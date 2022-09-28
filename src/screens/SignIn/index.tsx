import { FontAwesome5 } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import * as yup from 'yup';
import { Button } from '../../components/Button';
import { SafeAreaView } from '../../components/SafeAreaView';
import { TextInput } from '../../components/TextInput';
import { translate } from '../../data/I18n';
import { SignInScreenRouteProps } from '../../data/routes/auth';
import { useAuth } from '../../hooks/useAuth';
import { RFFontSize, RFHeight, RFWidth } from '../../utils/getResponsiveSizes';
import { CreatePlotStepFive } from '../CreatePlot/CreatePlotStepFive';
import { CreatePlotStepSix, CreateStepSix } from '../CreatePlot/CreatePlotStepSix';
import {
  Container,
  FormContainer,
  KeyboardAvoidingView,
  LogoImage,
  SignUpButton,
  SignUpButtonContainer,
  SignUpButtonText,
  SignUpHelpText,
  SocialSignInButton,
  SocialSignInButtonsContainer,
  SocialSignInButtonText,
  SocialSignInText,
  TouchableWithoutFeedback,
  WelcomeCaptionText,
  WelcomeText
} from './styles';

const userLogin = yup.object().shape({
  email: yup
    .string()
    .required('signIn.errors.email.required')
    .email('signIn.errors.email.format'),
  password: yup.string().min(6, 'signIn.errors.password.length')
});

export const SignIn: React.FC<SignInScreenRouteProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userLogin)
  });
  const { isLoading, signInWithPassword, signInWithGoogle, sigInWithFacebook } =
    useAuth();
  navigation = useNavigation();
  const route = useRoute();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView>
        <Container>
          <SafeAreaView
            style={{
              paddingHorizontal: RFHeight(24),
              paddingBottom: getBottomSpace() + RFHeight(24),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CreatePlotStepSix />
          </SafeAreaView>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
