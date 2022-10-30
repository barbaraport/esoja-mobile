import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Button } from '../../../components/Button';
import { StepIndicator } from '../../../components/StepIndicator';
import Title from '../../../components/Title';
import { CreatePlotStepNineScreenRouteProps } from '../../../data/routes/app';
import { Sample, useSample } from '../../../hooks/useSample';
import { translate } from '../../../data/I18n';
import {
  Container,
  FormContainer,
  NextStepButton,
} from './styles';
import { api, imageRecognition } from '../../../data/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageDisplayer } from '../../../components/ImageDisplayer';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

async function registerSample(data: any) {
      const updatePlot = {
        id: data?.cultiveId,
        plantsPerMeter: data?.plantsPerMeter,
        metersBetweenPlants: (Number(data?.metersBetweenPlants) || 0) / 100,
      };

      console.log('oi');
      await api.put(
          `/cultive/sample-information`,
          updatePlot
      );

      console.log('tchau');
      try {
        const plantAImageA = await RNFS.readFile(data?.plantA?.plantAImage!['path']!, 'base64');
        const plantAImageB = await RNFS.readFile(data?.plantA?.plantBImage!['path']!, 'base64');
        const plantBImageA = await RNFS.readFile(data?.plantB?.plantAImage!['path']!, 'base64');
        const plantBImageB = await RNFS.readFile(data?.plantB?.plantBImage!['path']!, 'base64');
        const plantCImageA = await RNFS.readFile(data?.plantC?.plantAImage!['path']!, 'base64');
        const plantCImageB = await RNFS.readFile(data?.plantC?.plantBImage!['path']!, 'base64');

        const newSample = {
          cultiveId: data?.cultiveId,
          samples: [
            {
               name: 'Amostra 1', 
               photoPlantA: plantAImageA, 
               photoPlantB: plantAImageB,
               heightPlantB: parseInt(data.plantA.plantBSize),
               heightPlantA: parseInt(data.plantA.plantASize),
               stagePlantA: parseInt(data.plantA.plantAStage),
               stagePlantB: parseInt(data.plantA.plantBStage),
            },
            { 
               name: 'Amostra 2' ,
                photoPlantA: plantBImageA,
                photoPlantB: plantBImageB,
                heightPlantB: parseInt(data.plantB.plantBSize),
                heightPlantA: parseInt(data.plantB.plantASize),
                stagePlantA: parseInt(data.plantB.plantAStage),
                stagePlantB: parseInt(data.plantB.plantBStage),
            },
            { 
              name: 'Amostra 3' ,
              photoPlantA: plantCImageA,
              photoPlantB: plantCImageB,
              heightPlantA: parseInt(data.plantC.plantBSize),
              heightPlantB: parseInt(data.plantC.plantASize),
              stagePlantA: parseInt(data.plantC.plantAStage),
              stagePlantB: parseInt(data.plantC.plantBStage),
            }
          ]
        };

        await api.post('/sample', newSample);
        await AsyncStorage.removeItem('@esoja:sample');
        
      } catch (error) {
        console.error(error);
        return false;
      }
      console.log('parece que foi tudo!!!!!!!!');
      return true;
}

async function analyzeImages(images: Array<String>) {
  const response = await imageRecognition.post("/recognizeImages", images);
  
  if (response['status'] === 200) {
    const responseBody = JSON.parse(response['data']);
    const analyzedImages: Array<ImageOrVideo> = [];

    for (const recognizedImage in responseBody) {
      const analyzedImageData = 'data:image/png;base64,' + responseBody[recognizedImage].image;
      
      analyzedImages.push({path: analyzedImageData, mime: 'image/png'} as ImageOrVideo);
    }

    return analyzedImages;
  }

  throw new Error('Unable to analyze the images');
}

export const CreatePlotStepNine: React.FC<
  CreatePlotStepNineScreenRouteProps
> = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [imageToVisualize, setImageToVisualize] = useState<ImageOrVideo | null>(null);
    const [fullData, setFullData] = useState<Sample | null>(null);
    const [analyzedImages, setAnalyzedImages] = useState<Array<ImageOrVideo>>([]);
  
    const { getPersistedData } = useSample();

    useEffect(() => {
      async function analyze(data: Sample) {
        const plantAImageA = await RNFS.readFile(data?.plantA?.plantAImage!['path']!, 'base64');
        const plantAImageB = await RNFS.readFile(data?.plantA?.plantBImage!['path']!, 'base64');
        const plantBImageA = await RNFS.readFile(data?.plantB?.plantAImage!['path']!, 'base64');
        const plantBImageB = await RNFS.readFile(data?.plantB?.plantBImage!['path']!, 'base64');
        const plantCImageA = await RNFS.readFile(data?.plantC?.plantAImage!['path']!, 'base64');
        const plantCImageB = await RNFS.readFile(data?.plantC?.plantBImage!['path']!, 'base64');

        const imagesToAnalyze = [
          plantAImageA,
          plantAImageB,
          plantBImageA,
          plantBImageB,
          plantCImageA,
          plantCImageB
        ];

        analyzeImages(imagesToAnalyze).then(
          result => {
              setAnalyzedImages(result);
          }
        );
      }

      getPersistedData().then(
        fullData => {
          setFullData(fullData as Sample);

          analyze(fullData!);
        }
      )
    }, []);

    const handleSubmitStepNine = async () => {
      setLoading(true);

      const success = await registerSample(fullData);

      if (success === true) {
        navigation.navigate('Plots');
      } else {
        setLoading(false);

        Alert.alert(
          'Erro ao cadastrar',
          'Não foi possivel cadastrar as amostras'
        );

      }
  };

  const toggleImageVisualization = () => {
    if (imageToVisualize !== null) {
      setImageToVisualize(null);
    }
  }

  return (
    <ScrollView>
      <Container>
        <Title
          title={translate('CreatePlotStepNine.title')}
          subtitle={translate('CreatePlotStepNine.subtitle')}
        />
        <StepIndicator step={2} indicator={8} />
        {imageToVisualize !== null ?
          <ImageDisplayer image={imageToVisualize} title={translate('CreatePlotStepSix.image')} closeFunction={toggleImageVisualization}/>
          :
          null
        }
        <FormContainer>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 10}}>{translate('CreatePlotStepSix.title') + ' 1'}</Text>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>{translate('CreatePlotStepSix.plant') + ' A'}</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantAImage!)}>
                    <Image source={{ uri: fullData?.plantA?.plantAImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[0])}>
                    <Image source={{uri: analyzedImages[0]?.path}} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>{translate('CreatePlotStepSix.analyzed')}</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>{translate('CreatePlotStepSix.plant') + ' B'}</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantBImage!)}>
                    <Image source={{ uri: fullData?.plantA?.plantBImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[1])}>
                    <Image source={{uri: analyzedImages[1]?.path}} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>{translate('CreatePlotStepSix.analyzed')}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 10}}>{translate('CreatePlotStepSix.title') + ' 2'}</Text>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>{translate('CreatePlotStepSix.plant') + ' A'}</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantB?.plantAImage!)}>
                    <Image source={{ uri: fullData?.plantB?.plantAImage!['path']}} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[2])}>
                    <Image source={{uri: analyzedImages[2]?.path}} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>{translate('CreatePlotStepSix.analyzed')}</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>{translate('CreatePlotStepSix.plant') + ' B'}</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantB?.plantBImage!)}>
                    <Image source={{ uri: fullData?.plantB?.plantBImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[3])}>
                    <Image source={{uri: analyzedImages[3]?.path}}style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>{translate('CreatePlotStepSix.analyzed')}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 10}}>{translate('CreatePlotStepSix.title') + ' 3'}</Text>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>{translate('CreatePlotStepSix.plant') + ' A'}</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantC?.plantAImage!)}>
                    <Image source={{ uri: fullData?.plantC?.plantAImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[4])}>
                    <Image source={{uri: analyzedImages[4]?.path}} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>{translate('CreatePlotStepSix.analyzed')}</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>{translate('CreatePlotStepSix.plant') + ' B'}</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantC?.plantBImage!)}>
                    <Image source={{ uri: fullData?.plantC?.plantBImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[5])}>
                    <Image source={{uri: analyzedImages[5]?.path}} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>{translate('CreatePlotStepSix.analyzed')}</Text>
                </View>
              </View>
            </View>
          </View>
          <NextStepButton>
            <Button
              title={translate('CreatePlotStepSix.confirm')}
              onPress={handleSubmitStepNine}
              showLoadingIndicator={loading}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
}
