import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ModalBaseProps } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components';

interface ModalProps extends ModalBaseProps {
  onClose?: () => void;
  children: React.ReactNode;
}

export const ModalBackDrop = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.primary.modalBackground};
  flex: 1;
`;

export const ModalChildContainer = styled.View`
  background-color: white;
`;

export const Modal: React.FC<ModalProps> = ({
  onClose,
  visible,
  children,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <StyledModal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={onClose}
      {...rest}
    >
      <StatusBar
        translucent
        style="light"
        backgroundColor={theme.colors.primary.modalBackground}
      />
      {children}
    </StyledModal>
  );
};

const StyledModal = styled.Modal`
  padding: 100px;
  border: 1px solid red;
  flex: 1;
  height: 100%;
  background-color: red;
`;
