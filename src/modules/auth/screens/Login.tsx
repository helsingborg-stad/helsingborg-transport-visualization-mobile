import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import {
  Screen,
  LargeTitle,
  SubTitle,
  SubBody,
  Body,
  Input,
} from '@src/components';

export const LoginScreen: FC = () => {
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');
  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Wrapper>
        <StyledTitle>Hej 👋</StyledTitle>

        <StyledSubTitle>Organisation du kör för</StyledSubTitle>

        <OrganizationContainer>
          <OrganizationText>Välj organisation</OrganizationText>
          <FontAwesome name="angle-down" size={24} color="black" />
        </OrganizationContainer>

        <StyledSubTitle>Ange pinkod</StyledSubTitle>

        <StyledSubBody>
          Den sexsiffriga koden du loggar in med är angiven i
          instruktionsmejl/sms
        </StyledSubBody>
        <InputTextContainer>
          <StyledInput
            placeholder="1"
            value={inputText1}
            onChangeText={setInputText1}
            maxLength={1}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
          <StyledInput
            placeholder="2"
            value={inputText2}
            onChangeText={setInputText2}
            isError={true}
          />
        </InputTextContainer>
      </Wrapper>
    </StyledScreen>
  );
};
const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
}))``;

const Wrapper = styled.View`
  width: 100%;
`;

const StyledTitle = styled(LargeTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0 ${theme.space.xxl} 0`};
`;

const StyledSubTitle = styled(SubTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const OrganizationContainer = styled.View`
  width: 100%;
  height: 54px;
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radius.lg};
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
  padding-top: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.md};
  gap: 10px;
`;

const StyledInput = styled(Input)`
  /* background-color: red; */
  flex: 1;
`;
