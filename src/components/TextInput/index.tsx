import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Control, FieldValues, useController, UseControllerReturn } from 'react-hook-form';
import { TextInputProps as RNTextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { translate } from '../../data/I18n';
import { RFFontSize } from '../../utils/getResponsiveSizes';
import {
  Container,
  ErrorMessage,
  FeatherIcon,
  InnerContainer,
  InputLabel,
  RNTextInput
} from './styles';

interface TextInputProps extends RNTextInputProps {
  icon?: string;
  containerStyle?: Record<string, unknown>;
  name: string;
  label?: string;
  control?: Control;
  errorMessage?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  icon,
  containerStyle = {},
  name,
  label,
  control,
  errorMessage,
  defaultValue,
  disabled = false,
  ...rest
}) => {
  const theme = useTheme();
  const inputElementRef = useRef<any>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  let field: UseControllerReturn<FieldValues, string> | undefined = undefined;

  if (control) {
    field = useController({
      name,
      control,
      defaultValue
    });
  }


  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback((value: string) => {
    setIsFocused(false);
    setIsFilled(!!value);
  }, []);

  useEffect(() => {
    if (defaultValue) {
      handleInputBlur(defaultValue);
    }
  }, [defaultValue, handleInputBlur]);

  return (
    <Container>
      {label && <InputLabel>{translate(label)}</InputLabel>}
      <InnerContainer
        style={containerStyle}
        isFocused={isFocused}
        isErrored={!!errorMessage}
        editable={!disabled}
      >
        {!!icon && (
          <FeatherIcon
            name={icon}
            size={RFFontSize(20)}
            isFocusedOrFilled={isFocused || isFilled}
            isErrored={!!errorMessage}
          />
        )}

        {field ?
        <RNTextInput
          {...rest}
          editable={!disabled}
          placeholder={rest.placeholder}
          value={field.field.value}
          ref={inputElementRef}
          keyboardAppearance="dark"
          placeholderTextColor={theme.colors.details}
          onFocus={handleInputFocus}
          onBlur={() => handleInputBlur(field!.field.value)}
          onChangeText={field.field.onChange}
        />
          :
        <RNTextInput
          {...rest}
          editable={!disabled}
          placeholder={rest.placeholder}
          ref={inputElementRef}
          keyboardAppearance="dark"
          placeholderTextColor={theme.colors.details}
          onFocus={handleInputFocus}
        />
        }
      </InnerContainer>

      {errorMessage && <ErrorMessage>{translate(errorMessage)}</ErrorMessage>}
    </Container>
  );
};
