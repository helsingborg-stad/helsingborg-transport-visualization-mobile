import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

interface InputProps extends TextInputProps {
  value?: string;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText: (val: string) => void;
}

interface StyledInputProps {
  focused?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  // error,
  placeholder,
  defaultValue,
  onFocus,
  onBlur,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = () => {
    onFocus?.();
    setIsFocused(true);
  };

  const handleOnBlur = () => {
    onBlur?.();
    setIsFocused(false);
  };
  return (
    <StyledInput
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      focused={isFocused}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      onChangeText={onChangeText}
      textAlign={'center'}
      keyboardType="numeric"
      maxLength={1}
      selectionColor={theme.colors.primary.main}
    />
  );
};

const StyledInput = styled.TextInput<StyledInputProps>`
  border-color: ${({ theme, focused }) =>
    focused ? theme.colors.grey['300'] : theme.colors.grey['200']};
  border-width: 2px;
  padding: 15px 0;
  flex: 1;
  border-radius: 5px;
  border: 1px solid #a3a3a3;
  background: #f7f7f8;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.grey['900']};
`;

Input.defaultProps = {
  value: '',
  error: '',
  placeholder: '',
  defaultValue: '',
  onFocus: () => {},
  onBlur: () => {},
};
