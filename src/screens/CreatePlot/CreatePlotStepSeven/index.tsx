import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';
import StepSeven from '../../../assets/plot-steps-images/StepSample.png';
import { Button } from '../../../components/Button';
import { StepIndicator } from '../../../components/StepIndicator';
import { TextInput } from '../../../components/TextInput';
import Title from '../../../components/Title';
import { CreatePlotStepSevenScreenRouteProps } from '../../../data/routes/app';
import { useSample } from '../../../hooks/useSample';
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

  const handleSubmitStepSeven = (data: FieldValues) => {
    console.log('step 7');
    const sample: any = {
      plantB: {
        grainsPlant1: data.grainsPlant1,
        grainsPlant2: data.grainsPlant2
      }
    };
    if (data?.description) {
      sample.plantB.description = data.description;
    }
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
        setValue('plantASize', data?.plantB?.plantASize?.toString() || '');
        setValue('plantBSize', data?.plantB?.plantBSize?.toString() || '');
        setValue('plantAStage', data?.plantB?.plantAStage?.toString() || '');
        setValue('plantBStage', data?.plantB?.plantBStage?.toString() || '');
      }
    });
  }, [getPersistedData, setValue]);

  const [selectedStage, setSelectedStage] = useState();
  const [plantAImage, setPlantAImage] = useState<ImageOrVideo>();
  const [plantBImage, setPlantBImage] = useState<ImageOrVideo>();

  const pickPictureA = () => {
    ImageCropPicker.openPicker({
      width: 256,
      height: 256,
      cropping: true
    }).then(image => {
      setPlantAImage(image);
    }).catch();
  }

  const photographPictureA = () => {
    ImageCropPicker.openCamera({
      width: 256,
      height: 256,
      cropping: true
    }).then(image => {
      setPlantAImage(image);
    }).catch();
  }

  const pickPictureB = () => {
    ImageCropPicker.openPicker({
      width: 256,
      height: 256,
      cropping: true
    }).then(image => {
      setPlantBImage(image);
    }).catch();
  }

  const photographPictureB = () => {
    ImageCropPicker.openCamera({
      width: 256,
      height: 256,
      cropping: true
    }).then(image => {
      setPlantBImage(image);
    }).catch();
  }

  const analyseImage = () => {

  }

  return (
    <ScrollView>
      <Container>
        <Title
          title={translate('CreatePlotStepSix.title')}
          subtitle={"Tire uma foto ou escolha de sua galeria imagens de duas plantas e insira suas respectivas alturas em centímetros"}
        />
        <StepIndicator step={1} indicator={5} />
        <FormContainer>
          <View style={{ flexDirection: 'row', flex: 1, marginBottom: 30 }} >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={{
                textAlign: 'center', paddingRight: 15, marginBottom: 5,
                fontWeight: 'bold'
              }}>Planta A</Text>
              <View style={{
                borderStyle: 'dashed', borderColor: 'black', borderWidth: 1,
                flex: 1, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column', width: 127, height: 127
              }}>
                {plantAImage !== undefined ?
                  <Image source={{ uri: plantAImage['path'] }} style={{ width: 128, height: 128 }} />
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
                  <FontAwesome5 solid name="folder-open" size={RFFontSize(32)} color="#FFCC66" style={{ marginLeft: 40 }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <TextInput
                label="plots.size"
                placeholder={"Altura"}
                name="size"
                control={control}
              />
              <Picker style={{ backgroundColor: 'white' }}
                selectedValue={selectedStage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedStage(itemValue)
                }>
                <Picker.Item label="Escolha um estágio" value="default" enabled={false} />
                <Picker.Item label="Desenvolvimento vegetativo" value="desenvolvimentoVegetativo" />
                <Picker.Item label="Florescimento" value="florescimento" />
                <Picker.Item label="Enchimento de grãos" value="enchimentoDeGraos" />
                <Picker.Item label="Maturação" value="maturacao" />
                <Picker.Item label="Maturação (Dessecado)" value="maturacaoDessecado" />
                <Picker.Item label="Em colheita" value="emColheita" />
              </Picker>
              <TouchableOpacity activeOpacity={0.5} onPress={analyseImage}>
                <View style={{
                  flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center',
                  marginTop: 15, paddingLeft: 0
                }}>
                  <MaterialIcons name='image-search' size={RFFontSize(32)} color="#FFCC66" />
                  <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>Preview da análise</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginBottom: 30 }} >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={{
                textAlign: 'center', paddingRight: 15, marginBottom: 5,
                fontWeight: 'bold'
              }}>Planta B</Text>
              <View style={{
                borderStyle: 'dashed', borderColor: 'black', borderWidth: 1,
                flex: 1, justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column', width: 127, height: 127
              }}>
                {plantBImage !== undefined ?
                  <Image source={{ uri: plantBImage['path'] }} style={{ width: 128, height: 128 }} />
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
                  <FontAwesome5 solid name="folder-open" size={RFFontSize(32)} color="#FFCC66" style={{ marginLeft: 40 }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <TextInput
                label="plots.size"
                placeholder={"Altura"}
                name="size"
                control={control}
              />
              <Picker style={{ backgroundColor: 'white' }}
                selectedValue={selectedStage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedStage(itemValue)
                }>
                <Picker.Item label="Escolha um estágio" value="default" enabled={false} />
                <Picker.Item label="Desenvolvimento vegetativo" value="desenvolvimentoVegetativo" />
                <Picker.Item label="Florescimento" value="florescimento" />
                <Picker.Item label="Enchimento de grãos" value="enchimentoDeGraos" />
                <Picker.Item label="Maturação" value="maturacao" />
                <Picker.Item label="Maturação (Dessecado)" value="maturacaoDessecado" />
                <Picker.Item label="Em colheita" value="emColheita" />
              </Picker>
              <TouchableOpacity activeOpacity={0.5} onPress={analyseImage}>
                <View style={{
                  flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center',
                  marginTop: 15, paddingLeft: 0
                }}>
                  <MaterialIcons name='image-search' size={RFFontSize(32)} color="#FFCC66" />
                  <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>Preview da análise</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <NextStepButton>
            <Button
              title={translate('CreatePlotStepSeven.buttonTitle')}
              onPress={handleSubmit(handleSubmitStepSeven)}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
};
