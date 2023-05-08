import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { ButtonText, OutlinedButtonText } from './Text';
import theme from '../theme/Theme';
import styled from 'styled-components/native';
import { Icon } from './Icon';

type StyledButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
};

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
  background: ${theme.colors.primary.main};
  border-radius: ${theme.radius.md};
  opacity: ${({ disabled, isLoading }) => (disabled && !isLoading ? 0.5 : 1)};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
`;

const OutlinedButton = styled(StyledButton)`
  color: ${theme.colors.primary.main};
  background: ${theme.colors.white};
  border-width: 1px;
  border-color: ${theme.colors.primary.main};
`;

const TransparentButton = styled(StyledButton)`
  color: ${theme.colors.primary.main};
  background: transparent;
  border: none;
`;

const IconWrapper = styled.View`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  margin-left: 12px;
`;

const ActivityIndicatorWrapper = styled.View`
  flex: 1;
  align-items: center;
`;

const StyledOutlinedButtonText = styled(OutlinedButtonText)`
  text-align: center;
`;

type Type = 'primary' | 'outline' | 'transparent';

type ButtonContainerProps = {
  type: Type;
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
  children: React.ReactNode;
};

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  type,
  onPress,
  disabled,
  isLoading,
  children,
}) => {
  switch (type) {
    case 'outline':
      return (
        <OutlinedButton
          onPress={onPress}
          disabled={disabled}
          isLoading={isLoading}
        >
          {children}
        </OutlinedButton>
      );
    case 'transparent':
      return (
        <TransparentButton
          onPress={onPress}
          disabled={disabled}
          isLoading={isLoading}
        >
          {children}
        </TransparentButton>
      );
    default:
      return (
        <StyledButton
          onPress={onPress}
          disabled={disabled}
          isLoading={isLoading}
        >
          {children}
        </StyledButton>
      );
  }
};

interface ButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  title: string;
  type?: Type;
  disabled?: boolean;
  icon?: React.ReactElement;
  iconSide?: string;
  isLoading?: boolean;
}

export const Button = ({
  title,
  type = 'primary',
  onPress,
  disabled = false,
  icon,
  iconSide,
  isLoading = false,
}: ButtonProps) => {
  const text =
    type !== 'primary' ? (
      <StyledOutlinedButtonText>{title}</StyledOutlinedButtonText>
    ) : (
      <ButtonText>{title}</ButtonText>
    );

  return (
    <ButtonContainer
      type={type}
      onPress={onPress}
      disabled={disabled}
      isLoading={isLoading}
    >
      {isLoading && (
        <ActivityIndicatorWrapper>
          <ActivityIndicator
            size={24}
            color={
              type === 'outline' ? theme.colors.gray['700'] : theme.colors.white
            }
          />
        </ActivityIndicatorWrapper>
      )}
      {!isLoading && icon && iconSide === 'left' && (
        <IconWrapper>
          <Icon icon={icon} />
        </IconWrapper>
      )}
      {!isLoading ? text : null}
      {!isLoading && icon && iconSide === 'right' && (
        <IconWrapper>
          <Icon icon={icon} />
        </IconWrapper>
      )}
    </ButtonContainer>
  );
};

Button.defaultProps = {
  type: 'primary',
  disabled: false,
  icon: null,
  iconSide: 'left',
  isLoading: false,
};
