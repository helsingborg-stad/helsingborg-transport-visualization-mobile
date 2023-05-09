import React from 'react';
import { TouchableOpacityProps } from 'react-native';
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
  onPress: () => void;
}

export const Button = ({
  title,
  type = 'primary',
  onPress,
  ...rest
}: ButtonProps) => {
  switch (type) {
    case 'primary':
      return (
        <StyledButtonPrimary onPress={onPress} {...rest}>
          <StyledText>{title}</StyledText>
        </StyledButtonPrimary>
      );
    case 'outline':
      return (
        <StyledButtonOutlined onPress={onPress} {...rest}>
          <StyledTextOutlined>{title}</StyledTextOutlined>
        </StyledButtonOutlined>
      );
    default:
      <StyledButtonPrimary onPress={onPress} {...rest}>
        <StyledText>{title}</StyledText>
      </StyledButtonPrimary>;
      break;
  }
};

Button.defaultProps = {
  type: 'primary',
};

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
  border-radius: ${({ theme }) => theme.radius.md};
  opacity: ${({ disabled, isLoading }) => (disabled && !isLoading ? 0.5 : 1)};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
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
