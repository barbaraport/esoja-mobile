import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Button } from '../../../components/Button';
import { PictureInput } from '../../../components/PictureInput';
import { StepIndicator } from '../../../components/StepIndicator';
import Title from '../../../components/Title';
import { CreatePlotStepNineScreenRouteProps } from '../../../data/routes/app';
import { useAuth } from '../../../hooks/useAuth';
import { Sample, useSample } from '../../../hooks/useSample';
import { useUpload } from '../../../hooks/useUpload';
import { translate } from '../../../data/I18n';
import {
  Container,
  FormContainer,
  NextStepButton,
  NoNetworkMessage,
  PictureContainer
} from './styles';
import { api } from '../../../data/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageDisplayer } from '../../../components/ImageDisplayer';

export const CreatePlotStepNine2: React.FC<
  CreatePlotStepNineScreenRouteProps
> = ({ navigation }) => {
  const { isConnected } = useAuth();
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const { createSample } = useSample();
  const { selectImage } = useUpload();

  const handleSelectImage = async () => {
    const uri = await selectImage();
    setImage(uri);
  };

  const handleSubmitStepNine = async () => {
    setLoading(true);
    try {
      await createSample(image);
      navigation.navigate('Plots');
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert(
        'Erro ao cadastrar',
        'Não foi possivel cadastrar as amostras'
      );
    }
  };

  return (
    <ScrollView>
      <Container>
        <Title
          title={translate('CreatePlotStepNine.title')}
          subtitle={translate('CreatePlotStepNine.subtitle')}
        />
        <StepIndicator step={2} indicator={8} />
        <FormContainer>
          {isConnected ? (
            <>
              <PictureContainer>
                <PictureInput
                  model="RETANGLE"
                  placeholder="CreatePlotStepNine.imagePlaceholder"
                  updatePictureLabel="CreatePlotStepNine.imageUpdatePictureLabel"
                  onPress={handleSelectImage}
                  uri={image}
                />
              </PictureContainer>
              <NextStepButton>
                <Button
                  title="Finalizar"
                  onPress={handleSubmitStepNine}
                  showLoadingIndicator={loading}
                />
              </NextStepButton>
            </>
          ) : (
            <>
              <NoNetworkMessage>
                Você não possui conexão com a internet no momento, retire a foto
                e deixe salva em seu dispositivo e quando tiver com conexão
                retorne nesta etapa para finalizar o cadastro, Os dados
                coletados até este ponto não serão perdidos se sair dessa tela
              </NoNetworkMessage>
              <NextStepButton>
                <Button
                  title="Ir para Menu principal"
                  onPress={() => navigation.navigate('Home')}
                  showLoadingIndicator={loading}
                />
              </NextStepButton>
            </>
          )}
        </FormContainer>
      </Container>
    </ScrollView>
  );
};

async function registerSample(data: any) {
      const updatePlot = {
        plantsPerMeter: data?.plantsPerMeter,
        metersBetweenPlants: (Number(data?.metersBetweenPlants) || 0) / 100,
      };

      try {
        await api.put(
          `/cultive/sample-information/${data?.cultiveId}`,
          updatePlot
        );

        const newSample = {
          cultiveId: data?.cultiveId,
          samples: [
            { ...data?.plantA, name: 'Amostra 1' },
            { ...data?.plantB, name: 'Amostra 2' },
            { ...data?.plantC, name: 'Amostra 3' }
          ]
        };

        await api.post('/sample', newSample);

        await AsyncStorage.removeItem('@esoja:sample');
      } catch (error) {
        console.error(error);

        return false;
      }

      return true;
}

async function analyzeImages(images: Array<ImageSourcePropType>) {
  return images;
}

export const CreatePlotStepNine: React.FC<
  CreatePlotStepNineScreenRouteProps
> = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [imageToVisualize, setImageToVisualize] = useState<ImageSourcePropType | null>(null);
    const [fullData, setFullData] = useState<Sample | null>(null);
    const [analyzedImages, setAnalyzedImages] = useState<Array<ImageSourcePropType>>([]);
  
    const { getPersistedData } = useSample();

    useEffect(() => {
      getPersistedData().
        then(fullData => {
          setFullData(fullData as Sample);

          const imagesToAnalyze = [
            fullData?.plantA?.plantAImage!,
            fullData?.plantA?.plantBImage!,
            fullData?.plantB?.plantAImage!,
            fullData?.plantB?.plantBImage!,
            fullData?.plantC?.plantAImage!,
            fullData?.plantC?.plantBImage!,
          ];

          analyzeImages(imagesToAnalyze).then(
            result => {
              setAnalyzedImages(result);
            }
          );
        });
    }, []);

    const handleSubmitStepNine = async () => {
      setLoading(true);

      const success = await registerSample(fullData);

      if (success === true) {
        // navigation.navigate('Plots');
        console.log("deu certo");
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
          <ImageDisplayer image={imageToVisualize} title='Mostrando' closeFunction={toggleImageVisualization}/>
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
                    <Image source={fullData?.plantA?.plantAImage!} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantAImage!)}>
                    <Image source={analyzedImages[0]} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Analisada</Text>
                </View>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>Planta B</Text>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 30}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantBImage!)}>
                    <Image source={fullData?.plantA?.plantBImage!} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>Original</Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(fullData?.plantA?.plantBImage!)}>
                    <Image source={analyzedImages[1]} style={{ width: 128, height: 128 }} />
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
