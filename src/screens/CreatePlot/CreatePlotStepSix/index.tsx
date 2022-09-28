import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ScrollView, View, Text, Image } from 'react-native';
import * as yup from 'yup';
import StepSix from '../../../assets/plot-steps-images/StepSample.png';
import PlantIcon from '../../../assets/plot-steps-images/StepTwo.png';
import { Button } from '../../../components/Button';
import { StepIndicator } from '../../../components/StepIndicator';
import { TextInput } from '../../../components/TextInput';
import Title from '../../../components/Title';
import { CreatePlotStepFiveScreenRouteProps, CreatePlotStepSixScreenRouteProps } from '../../../data/routes/app';
import { useSample } from '../../../hooks/useSample';
import { translate } from '../../../data/I18n';
import {
  Container,
  FormContainer,
  HelperImageContainer,
  NextStepButton,
  RegisterPlantImage,
  StepSixHelperImage
} from './styles';
import { FontAwesome5, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { RFFontSize } from '../../../utils/getResponsiveSizes';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';

const userLogin = yup.object().shape({
  plantASize: yup
    .number()
    .min(1, 'Quantidade de grãos não pode ser "ZERO"'),
  plantBSize: yup
    .number()
    .min(1, 'Quantidade de grãos não pode ser "ZERO"'),
  plantAStage: yup
    .string()
    .min(1, 'Quantidade de grãos não pode ser "ZERO"'),
  plantBStage: yup
    .string()
    .min(1, 'Quantidade de grãos não pode ser "ZERO"')
});

export const CreatePlotStepSix: React.FC<CreatePlotStepSixScreenRouteProps> = ({ navigation }) => {
  const { saveStep, getPersistedData } = useSample();

  const handleSubmitStepFive = (data: FieldValues) => {

    console.log(data);
    const sample: any = {
      plantA: {
        grainsPlant1: data.grainsPlant1,
        grainsPlant2: data.grainsPlant2
      }
    };
    if (data?.description) {
      sample.plantA.description = data.description;
    }
    saveStep(sample);
    navigation.navigate('Home');
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
        const dataAny: any = data as any;
        setValue('plantASize', data?.plantB?.plantASize?.toString() || '');
        setValue('plantBSize', data?.plantB?.plantBSize?.toString() || '');
        setValue('plantAStage', data?.plantB?.plantAStage?.toString() || '');
        setValue('plantBStage', data?.plantB?.plantBStage?.toString() || '');
      }
    });
  }, [getPersistedData, setValue]);

  const [selectedStageA, setSelectedStageA] = useState();
  const [selectedStageB, setSelectedStageB] = useState();
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
        <StepIndicator step={1} indicator={4} />

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
                name="sizeA"
                control={control}
              />
              <Picker style={{ backgroundColor: 'white' }}
                selectedValue={selectedStageA}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedStageA(itemValue)
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
                name="sizeB"
                control={control}
              />
              <Picker style={{ backgroundColor: 'white' }}
                selectedValue={selectedStageB}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedStageB(itemValue)
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
              title={translate('CreatePlotStepFive.continueButton')}
              onPress={handleSubmit(handleSubmitStepFive)}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
}
