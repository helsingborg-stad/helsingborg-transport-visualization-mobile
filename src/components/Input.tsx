import React from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

interface InputProps extends TextInputProps {
  value: string;
  isError?: boolean;
  onChangeText: (val: string) => void;
}

interface StyledInputProps {
  isError?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  isError,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <StyledInput
      value={value}
      onChangeText={onChangeText}
      selectionColor={theme.colors.primary.main}
      isError={isError}
      {...rest}
    />
  );
};

Input.defaultProps = {
  value: '',
  isError: false,
};

const StyledInput = styled.TextInput<StyledInputProps>`
  border-color: ${({ theme, isError }) =>
    isError ? theme.colors.state.error : theme.colors.primary.borderColor};
  border-width: 1px;
  padding: ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;
