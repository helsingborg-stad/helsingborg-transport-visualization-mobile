import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import {
  Button,
  Screen,
  LargeTitle,
  SubTitle,
  SubBody,
  Body,
  CaptionSmall,
  Modal,
  StyledModalChildContainer,
  StyledModalBackDrop,
} from '@src/components';
import { PinCodeInput } from '../components/PinCodeInput';

export const LoginScreen: FC = () => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [showOrganizationPopup, setShowOrganizationPopup] = useState(false);

  const handlePinFinished = (pin: string) => {
    setPin(pin);
  };

  const handleOrganizationClick = () => {
    console.log('Clicked');
    setShowOrganizationPopup(true);
  };

  const handlePinSubmit = () => {
    setIsError(false);

    if (pin !== '123456') {
      setIsError(true);
      setPin('');
    }
  };

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Wrapper>
        <StyledTitle>Hej 👋</StyledTitle>

        <StyledSubTitle>Organisation du kör för</StyledSubTitle>

        <StyledOrganizationPressable onPress={handleOrganizationClick}>
          <OrganizationContainer isFocused={showOrganizationPopup}>
            <OrganizationText>Välj organisation</OrganizationText>
            <FontAwesome name="angle-down" size={24} color="black" />
          </OrganizationContainer>
        </StyledOrganizationPressable>

        <StyledSubTitle>Ange pinkod</StyledSubTitle>

        <StyledSubBody>
          Den sexsiffriga koden du loggar in med är angiven i
          instruktionsmejl/sms
        </StyledSubBody>
        <InputTextContainer>
          <PinCodeInput isError={isError} onFinish={handlePinFinished} />
        </InputTextContainer>

        {isError && (
          <StyledErrorText>
            Fel pinkod - kolla att du valt rätt organisation och testa igen.
          </StyledErrorText>
        )}
        {pin && (
          <StyleButton
            title={'Starta körning'}
            onPress={handlePinSubmit}
            type="primary"
          />
        )}
      </Wrapper>

      <StyledModal visible={showOrganizationPopup}>
        <StyledModalBackDrop onPress={() => setShowOrganizationPopup(false)} />
        <StyledModalChildContainer></StyledModalChildContainer>
      </StyledModal>
    </StyledScreen>
  );
};
const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
}))``;

const StyledModal = styled(Modal)``;

// const StyledModalBackDrop = styled.View`
//   background-color: red;
//   flex: 1;
// `;

type OrganizationContainerProps = {
  isFocused?: boolean;
};

const Wrapper = styled.View`
  width: 100%;
`;

const StyledTitle = styled(LargeTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0 ${theme.space.xxl} 0`};
`;

const StyledSubTitle = styled(SubTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const StyledOrganizationPressable = styled.TouchableOpacity``;

const OrganizationContainer = styled.View<OrganizationContainerProps>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border-color: ${({ theme, isFocused }) =>
    isFocused ? theme.colors.primary.main : 'transparent'};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const OrganizationText = styled(Body)`
  flex: 1;
`;

const StyledSubBody = styled(SubBody)`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const InputTextContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: ${({ theme }) => theme.space.sm};
  padding-bottom: ${({ theme }) => theme.space.sm};
`;

const StyledErrorText = styled(CaptionSmall)`
  color: ${({ theme }) => theme.colors.state.error};
`;

const StyleButton = styled(Button)`
  width: 60%;
  margin: ${({ theme }) => `${theme.space.xxl} 0px ${theme.space.lg} 0px`};
  align-self: center;
`;
