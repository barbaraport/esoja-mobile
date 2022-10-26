import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as yup from 'yup';
import StepSeven from '../../../assets/plot-steps-images/StepSample.png';
import { Button } from '../../../components/Button';
import { StepIndicator } from '../../../components/StepIndicator';
import { TextInput } from '../../../components/TextInput';
import Title from '../../../components/Title';
import { CreatePlotStepSevenScreenRouteProps } from '../../../data/routes/app';
import { Sample, useSample } from '../../../hooks/useSample';
import { translate } from '../../../data/I18n';
import PlantIcon from '../../../assets/plot-steps-images/StepTwo.png';
import {
  Container,
  FormContainer,
  HelperImageContainer,
  NextStepButton,
  StepSevenHelperImage
} from './styles';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RFFontSize } from '../../../utils/getResponsiveSizes';
import { RegisterPlantImage } from '../CreatePlotStepSix/styles';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { ImageDisplayer } from '../../../components/ImageDisplayer';
import RNFS from 'react-native-fs';
import { api, imageRecognition } from '../../../data/services/api';

const userLogin = yup.object().shape({
  grainsPlant1: yup
    .number()
    .required('Quantidade é obrigatória')
    .min(1, 'Quantidade de grãos não pode ser "ZERO"'),
  grainsPlant2: yup
    .number()
    .required('Quantidade é obrigatória')
    .min(1, 'Quantidade de grãos não pode ser "ZERO"')
});

export const CreatePlotStepSeven: React.FC<
  CreatePlotStepSevenScreenRouteProps
> = ({ navigation }) => {
    const { saveStep, getPersistedData } = useSample();

  const handleSubmitStepSeven = () => {
    if (!plantAImage || !plantBImage) {
      Alert.alert("Amostras sem imagens", "Todas as amostras necessitam de imagens");
      return;
    } else if (!plantASize || !plantBSize) {
      Alert.alert("Amostras sem tamanhos definidos", "Todas as amostras necessitam que seus tamanhos, " +
      "em centímetros, sejam fornecidos");
      return;
    } else if (!/^\d+$/.test(plantASize) || !/^\d+$/.test(plantBSize)) {
      Alert.alert("Amostras com tamanhos inválidos", "O tamanho das amostras devem ser um número inteiro " +
      "e positivo");
      return;
    } else if (!plantAStage || !plantAStage) {
      Alert.alert("Amostras sem estágios definidos", "Todas as amostras necessitam que seus estágios " +
      "fenológicos estejam definidos");
      return;
    }
  
    const sample: Sample =  {
      plantB: {
        plantAImage: plantAImage,
        plantASize: plantASize,
        plantAStage: plantAStage,
        plantBImage: plantBImage,
        plantBSize: plantBSize,
        plantBStage: plantBStage
      }
    };

    saveStep(sample);

    navigation.navigate('CreatePlotStepEight');
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userLogin)
  });

  useEffect(() => {
    getPersistedData().then(data => {
      if (data) {
        setPlantASize(data?.plantB?.plantASize!);
        setPlantBSize(data?.plantB?.plantBSize!);
      }
    });
  }, [getPersistedData, setValue]);

  const [plantAImage, setPlantAImage] = useState<ImageOrVideo>();
  const [plantASize, setPlantASize] = useState<string>('');
  const [plantAStage, setPlantAStage] = useState<string>('');
  const [plantBImage, setPlantBImage] = useState<ImageOrVideo>();
  const [plantBSize, setPlantBSize] = useState<string>('');
  const [plantBStage, setPlantBStage] = useState<string>('');
  const [imageToVisualize, setImageToVisualize] = useState<ImageOrVideo | null>(null);

  const pickPictureA = () => {
    ImageCropPicker.openPicker({
      cropping: true
    }).then(image => {
      setPlantAImage(image);
    }).catch();
  }

  const photographPictureA = () => {
    ImageCropPicker.openCamera({
      cropping: true
    }).then(image => {
      setPlantAImage(image);
    }).catch();
  }

  const pickPictureB = () => {
    ImageCropPicker.openPicker({
      cropping: true
    }).then(image => {
      setPlantBImage(image);
    }).catch();
  }

  const photographPictureB = () => {
    ImageCropPicker.openCamera({
      cropping: true
    }).then(image => {
      setPlantBImage(image);
    }).catch();
  }
const analyzeImage = async (imageToAnalyze?: ImageOrVideo) => {
    if (imageToAnalyze) {
      const base64 = await RNFS.readFile(imageToAnalyze['path'], 'base64');
      const body = JSON.stringify(base64);
      const response = await imageRecognition.post("/recognizeImages", [body]);

      if (response['status'] === 200) {
        const responseBody = JSON.parse(response['data']) as Array<any>;

        setImageToVisualize({path: 'data:image/png;base64,' + responseBody[0].image} as ImageOrVideo);
      } else {
        throw new Error('Unable to analyze the image');
      }
    } else {
      Alert.alert(
        'Erro ao analisar imagem',
        'É necessário escolher uma imagem antes de solicitar seu preview de analise'
      );
    }
  }

  const toggleImageVisualization = () => {
    if (imageToVisualize !== null) {
      setImageToVisualize(null);
    }
  }

  return (
    <ScrollView>
      <Container>
        <Title
          title={translate('CreatePlotStepSix.title') + ' 2'}
          subtitle={translate('CreatePlotStepSix.explanation')}
        />
        <StepIndicator step={1} indicator={5} />
        {imageToVisualize !== null ?
          <ImageDisplayer image={imageToVisualize} title={translate('CreatePlotStepSix.image')} closeFunction={toggleImageVisualization}/>
          :
          null
        }
        <FormContainer>
          <View style={{ flexDirection: 'row', flex: 1, marginBottom: 30 }} >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={{
                textAlign: 'center', paddingRight: 15, marginBottom: 5,
                fontWeight: 'bold'
              }}>{translate('CreatePlotStepSix.plant') + ' A'}</Text>
              <View style={{
                borderStyle: 'dashed', borderColor: 'black', borderWidth: 1,
                flex: 1, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column', width: 127, height: 127
              }}>
                {plantAImage !== undefined ?
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(plantAImage)}>
                    <Image source={{ uri: plantAImage['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  :
                  <RegisterPlantImage source={PlantIcon} resizeMode="contain" />
                }
              </View>
              <View style={{
                flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center',
                marginTop: 10, paddingRight: 15
              }}>
                <TouchableOpacity activeOpacity={0.5} onPress={photographPictureA}>
                  <FontAwesome5 regular name="camera" size={RFFontSize(32)} color="#FFCC66" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={pickPictureA}>
                  <FontAwesome5 solid name="folder-open" size={RFFontSize(32)} color="#FFCC66"/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <TextInput
                label="plots.size"
                placeholder={translate('CreatePlotStepSix.height')}
                name="size"
                onChangeText={(text) => setPlantASize(text)}
              />
              <Picker style={{ backgroundColor: 'white' }}
                selectedValue={plantAStage}
                onValueChange={(itemValue, itemIndex) =>
                  setPlantAStage(itemValue)
                }>
                <Picker.Item label={translate('CreatePlotStepSix.selectDefault')} value="0" enabled={false} />
                <Picker.Item label={translate('CreatePlotStepSix.selectVegetativeDevelopment')} value="1" />
                <Picker.Item label={translate('CreatePlotStepSix.selectFlowering')} value="2" />
                <Picker.Item label={translate('CreatePlotStepSix.selectGrainFilling')} value="3" />
                <Picker.Item label={translate('CreatePlotStepSix.selectMaturation')} value="4" />
                <Picker.Item label={translate('CreatePlotStepSix.selectDesiccatedMaturation')} value="5" />
                <Picker.Item label={translate('CreatePlotStepSix.selectInHarvest')} value="6" />
              </Picker>
              <TouchableOpacity activeOpacity={0.5} onPress={() => analyzeImage(plantAImage)}>
                <View style={{
                  flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center',
                  marginTop: 15, paddingLeft: 0
                }}>
                  <MaterialIcons name='image-search' size={RFFontSize(32)} color="#FFCC66" />
                  <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>{translate('CreatePlotStepSix.analysisPreview')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginBottom: 30 }} >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={{
                textAlign: 'center', paddingRight: 15, marginBottom: 5,
                fontWeight: 'bold'
              }}>{translate('CreatePlotStepSix.plant') + ' B'}</Text>
              <View style={{
                borderStyle: 'dashed', borderColor: 'black', borderWidth: 1,
                flex: 1, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column', width: 127, height: 127
              }}>
                {plantBImage !== undefined ?
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setImageToVisualize(plantBImage)}>
                    <Image source={{ uri: plantBImage['path'] }} style={{ width: 128, height: 128 }} />
                  </TouchableOpacity>
                  :
                  <RegisterPlantImage source={PlantIcon} resizeMode="contain" />
                }
              </View>
              <View style={{
                flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center',
                marginTop: 10, paddingRight: 15
              }}>
                <TouchableOpacity activeOpacity={0.5} onPress={photographPictureB}>
                  <FontAwesome5 regular name="camera" size={RFFontSize(32)} color="#FFCC66" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={pickPictureB}>
                  <FontAwesome5 solid name="folder-open" size={RFFontSize(32)} color="#FFCC66" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <TextInput
                label="plots.size"
                placeholder={translate('CreatePlotStepSix.height')}
                name="size"
                onChangeText={(text) => setPlantBSize(text)}
              />
              <Picker style={{ backgroundColor: 'white' }}
                selectedValue={plantBStage}
                onValueChange={(itemValue, itemIndex) =>
                  setPlantBStage(itemValue)
                }>
                <Picker.Item label={translate('CreatePlotStepSix.selectDefault')} value="0" enabled={false} />
                <Picker.Item label={translate('CreatePlotStepSix.selectVegetativeDevelopment')} value="1" />
                <Picker.Item label={translate('CreatePlotStepSix.selectFlowering')} value="2" />
                <Picker.Item label={translate('CreatePlotStepSix.selectGrainFilling')} value="3" />
                <Picker.Item label={translate('CreatePlotStepSix.selectMaturation')} value="4" />
                <Picker.Item label={translate('CreatePlotStepSix.selectDesiccatedMaturation')} value="5" />
                <Picker.Item label={translate('CreatePlotStepSix.selectInHarvest')} value="6" />
              </Picker>
              <TouchableOpacity activeOpacity={0.5} onPress={() => analyzeImage(plantBImage)}>
                <View style={{
                  flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center',
                  marginTop: 15, paddingLeft: 0
                }}>
                  <MaterialIcons name='image-search' size={RFFontSize(32)} color="#FFCC66" />
                  <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>{translate('CreatePlotStepSix.analysisPreview')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <NextStepButton>
            <Button
              title={translate('CreatePlotStepSeven.buttonTitle')}
              onPress={handleSubmitStepSeven}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
};
