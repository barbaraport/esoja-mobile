import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import * as yup from 'yup';
import { Button } from '../../components/Button';
import { PictureInput } from '../../components/PictureInput';
import { TextInput } from '../../components/TextInput';
import Title from '../../components/Title';
import { SignUpScreenRouteProps } from '../../data/routes/auth';
import { useAuth } from '../../hooks/useAuth';
import { useUpload } from '../../hooks/useUpload';
import { PictureContainer } from '../CreatePlot/CreatePlotStepNine/styles';
import { Container, FormContainer, NextStepButton } from './styles';
import { translate } from '../../data/I18n';

const signUpValidator = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().required('Email é obrigatório').email('email invalido'),
  password: yup
    .string()
    .required('Senha é obrigatório')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  passwordConfirmation: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password'), null], 'As senhas não correspondem')
});

export const SignUp: React.FC<SignUpScreenRouteProps> = () => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const { pictureUpload, selectImage } = useUpload();

  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpValidator)
  });

  const handleSubmitSignUp = async (data: FieldValues) => {
    setLoading(true);
    if (image) {
      const url = await pictureUpload(image, 'user');
      data.picture = url;
    }
    await signUp(data);
    setLoading(false);
  };

  const handleSelectImage = async () => {
    const uri = await selectImage();
    setImage(uri);
  };

  return (
    <ScrollView>
      <Container>
        <Title
          title={translate('signUp.title')}
          subtitle={translate('signUp.subtitle')}
        />
        <FormContainer>
          <PictureContainer>
            <PictureInput
              placeholder="signUp.imagePlaceholder"
              updatePictureLabel="signUp.imageUpdatePictureLabel"
              onPress={handleSelectImage}
              uri={image}
            />
          </PictureContainer>

          <TextInput
            label="signUp.name"
            placeholder={translate('signUp.namePlaceholder')}
            icon="user"
            name="name"
            control={control}
          />
          <TextInput
            label="signUp.email"
            placeholder={translate('signUp.emailPlaceholder')}
            icon="mail"
            name="email"
            control={control}
          />

          <TextInput
            label="signUp.signUpPassword"
            placeholder={translate('signUp.passwordPlaceholder')}
            icon="lock"
            secureTextEntry
            name="password"
            control={control}
          />

          <TextInput
            label="signUp.passwordConfirmation"
            placeholder={translate('signUp.passwordRepeatPlaceholder')}
            secureTextEntry
            icon="repeat"
            name="passwordConfirmation"
            control={control}
          />
          <NextStepButton>
            <Button
              title={translate('signUp.signUp')}
              onPress={handleSubmit(handleSubmitSignUp)}
              showLoadingIndicator={loading}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
};
