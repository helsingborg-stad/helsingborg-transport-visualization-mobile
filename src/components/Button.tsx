import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { ActivityIndicator } from './ActivityIndicator';
import { ButtonText, OutlinedButtonText } from './Text';
import styled from 'styled-components/native';

type Type = 'primary' | 'outline';

type StyledButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
};

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  type?: Type;
  isLoading?: boolean;
  onPress: () => void;
}

export const Button = ({
  title,
  type = 'primary',
  onPress,
  isLoading,
  ...rest
}: ButtonProps) => {
  switch (type) {
    case 'primary':
      return (
        <StyledButtonPrimary onPress={onPress} isLoading={isLoading} {...rest}>
          {isLoading && <ActivityIndicator />}
          <StyledText>{title}</StyledText>
        </StyledButtonPrimary>
      );
    case 'outline':
      return (
        <StyledButtonOutlined onPress={onPress} isLoading={isLoading} {...rest}>
          {isLoading && <ActivityIndicator />}
          <StyledTextOutlined>{title}</StyledTextOutlined>
        </StyledButtonOutlined>
      );
    default:
      <StyledButtonPrimary onPress={onPress} isLoading={isLoading} {...rest}>
        {isLoading && <ActivityIndicator />}
        <StyledText>{title}</StyledText>
      </StyledButtonPrimary>;
      break;
  }
};

Button.defaultProps = {
  type: 'primary',
  isLoading: false,
};

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
  border-radius: ${({ theme }) => theme.radius.md};
  opacity: ${({ disabled, isLoading }) => (disabled || isLoading ? 0.5 : 1)};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  gap: ${({ theme }) => theme.space.sm};
`;

const StyledButtonPrimary = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.primary.main};
`;

const StyledButtonOutlined = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.primary.main};
  border-width: 2px;
`;

const StyledText = styled(ButtonText)``;
const StyledTextOutlined = styled(OutlinedButtonText)``;
