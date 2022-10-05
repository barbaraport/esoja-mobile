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
  console.log('registering sample');
      const updatePlot = {
        plantsPerMeter: data?.plantsPerMeter,
        metersBetweenPlants: (Number(data?.metersBetweenPlants) || 0) / 100,
      };

      try {
        // await api.put(
        //   `/cultive/sample-information/${data?.cultiveId}`,
        //   updatePlot
        // );

        const newSample = {
          cultiveId: data?.cultiveId,
          samples: [
            { ...data?.plantA, name: 'Amostra 1' },
            { ...data?.plantB, name: 'Amostra 2' },
            { ...data?.plantC, name: 'Amostra 3' }
          ]
        };

        //await api.post('/sample', newSample);
        //await AsyncStorage.removeItem('@esoja:sample');
        
      } catch (error) {
        console.error(error);
        return false;
      }

      return true;
}

async function analyzeImages(images: Array<String>) {
  const response = await imageRecognition.post("/recognizeImages", JSON.stringify(images));
  
  if (response['status'] === 200) {
    const responseBody = JSON.parse(response['data']) as Array<string>;

    const analyzedImages: Array<ImageOrVideo> = [];

    for (let i = 0; i < responseBody.length; i++) {
      const analyzedImage = responseBody[i];
      
      analyzedImages.push({path: 'data:image/png;base64,' + analyzedImage} as ImageOrVideo);
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

      console.log('registering');
      const success = await registerSample(fullData);

      if (success === true) {
        // navigation.navigate('Plots');
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
          <ImageDisplayer image={imageToVisualize} title='Image analisada' closeFunction={toggleImageVisualization}/>
          :
          null
        }
        <FormContainer>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 10}}>1ª Amostra</Text>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta A</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantAImage!)}>
                    <Image source={{ uri: fullData?.plantA?.plantAImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[0])}>
                    <Image source={analyzedImages[0]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta B</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantBImage!)}>
                    <Image source={{ uri: fullData?.plantA?.plantBImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[1])}>
                    <Image source={analyzedImages[1]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 10}}>2ª Amostra</Text>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta A</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantB?.plantAImage!)}>
                    <Image source={fullData?.plantB?.plantAImage!} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[2])}>
                    <Image source={analyzedImages[2]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta B</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantB?.plantBImage!)}>
                    <Image source={{ uri: fullData?.plantB?.plantBImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[3])}>
                    <Image source={analyzedImages[3]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 10}}>3ª Amostra</Text>
            <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta A</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantC?.plantAImage!)}>
                    <Image source={{ uri: fullData?.plantC?.plantAImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[4])}>
                    <Image source={analyzedImages[4]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta B</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantC?.plantBImage!)}>
                    <Image source={{ uri: fullData?.plantC?.plantBImage!['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(analyzedImages[5])}>
                    <Image source={analyzedImages[5]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
            </View>
          </View>
          <NextStepButton>
            <Button
              title="Confirmar"
              onPress={handleSubmitStepNine}
              showLoadingIndicator={loading}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
}
