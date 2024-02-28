import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import WheelPicker from 'react-native-wheely';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import { A } from '@expo/html-elements';

import {
  Button,
  Screen,
  LargeTitle,
  SubTitle,
  SubBody,
  Body,
  CaptionSmall,
  Modal,
  ModalChildContainer,
  ModalBackDrop,
  ActivityIndicator,
} from '@src/components';
import { PinCodeInput } from '../components/PinCodeInput';
import { useTheme } from 'styled-components';
import { getOrganisations, login } from '@src/api/auth';
import { OrganisationResponse, LoginResponse } from '@src/api/types';
import { useAuthContext } from '@src/context/auth/AuthState';
import { User } from '@src/context/auth/AuthTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredServiceTimeType } from './types';
import DeviceInfo from 'react-native-device-info';
import { PRIVACY_POLICY } from '@src/utils/Constants';

export const LoginScreen: FC = () => {
  const theme = useTheme();
  const { setUser } = useAuthContext();

  //Button States
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  //Pin code states
  const [pin, setPin] = useState('');
  const [cachedPin, setCachedPin] = useState('');
  const [isPinError, setIsPinError] = useState(false);
  //Org states
  const [isOrgNotSelected, setIsOrgNotSelected] = useState(false);
  const [showOrganizationPopup, setShowOrganizationPopup] = useState(false);
  const [currentOrgIndex, setCurrentOrgIndex] = useState(-1);
  const [organiazations, setOrganiazations] = useState<string[]>([]);
  const [organisationObject, setOrganisationObject] = useState<
    OrganisationResponse[]
  >([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [storedUser, setStoredUser] = useState<User | null>();
  //Service timer popup
  const [showServiceTimerPopup, setShowServiceTimerPopup] = useState(false);
  const [serviceTimes, setServiceTimes] =
    useState<StoredServiceTimeType | null>(null);

  //Fetch organisations on Load
  useEffect(() => {
    getOrganisations()
      .then((data: OrganisationResponse[]) => {
        const tmpList = data.map((org) => org.name);
        setOrganiazations(tmpList);
        setOrganisationObject(data);
        setIsLoadingOrgs(false);
      })
      .catch((error) => {
        console.log('org fetch error', error);
        setIsLoadingOrgs(false);
      });
  }, []);

  //Check if the user is in Secure Storage then Populate the pin
  useEffect(() => {
    const getDataFromStore = async () => {
      const userStr = await SecureStore.getItemAsync('user');
      const userObj: User = await JSON.parse(userStr);

      if (userObj) {
        setCachedPin(userObj.pin);
        setStoredUser(userObj);
      }
    };
    getDataFromStore();
  }, []);

  //check if there service had time set
  useEffect(() => {
    const getShutdownTime = async () => {
      const shutDownTimeObj = await readFromAsyncStorage('shutDownTime');
      if (shutDownTimeObj) {
        setShowServiceTimerPopup(true);
        setServiceTimes(shutDownTimeObj);
      } else {
        console.log('shutDownTime key not found');
        setShowServiceTimerPopup(false);
        setServiceTimes(null);
      }
    };
    getShutdownTime();
  }, []);

  //Check if Organisations are fetched then set the user current Organistaion
  useEffect(() => {
    if (!storedUser) return;
    const orgIndex = organiazations.indexOf(storedUser.name);
    if (orgIndex !== -1) {
      setCurrentOrgIndex(orgIndex);
    }
  }, [organiazations, storedUser]);

  //
  // Handler funcs
  //

  const handlePinFinished = (pin: string) => {
    setIsPinError(false);
    setPin(pin);
  };

  const handleOrganizationClick = () => {
    if (!isLoadingOrgs && organiazations.length < 0) return;
    setShowOrganizationPopup(true);
    if (currentOrgIndex === -1) {
      setCurrentOrgIndex(0);
    }
  };

  const handlePinSubmit = async () => {
    setIsPinError(false);
    setIsOrgNotSelected(false);
    setIsLoggingIn(true);

    if (currentOrgIndex === -1) {
      setIsOrgNotSelected(true);
      return;
    }

    // Get the orgNumber
    const org = organisationObject[currentOrgIndex];
    const payload = {
      identifier: org.orgNumber,
      pinCode: pin,
    };
    login(payload)
      .then(async (data: LoginResponse) => {
        let deviceId = null;
        //check if we already have a tracking id in secure store
        const userStr = await SecureStore.getItemAsync('user');
        const user: User = JSON.parse(userStr);

        if (user && user.deviceId) {
          deviceId = user.deviceId;
        } else {
          //generate a new tracking id
          deviceId = await DeviceInfo.getUniqueId();
        }

        const extraKeys = {
          pin: pin,
          isLoggedIn: true,
          isTokenExpired: false,
          sessionId: uuid.v4().toString(),
          deviceId,
        };

        const userObj = { ...data, ...extraKeys };

        setUser(userObj);

        setIsLoggingIn(false);
      })
      .catch((err) => {
        console.log('err', err);
        setIsPinError(true);
        setPin('');
        setIsLoggingIn(false);
      });
  };

  const readFromAsyncStorage = async (key: string) => {
    try {
      let jsonObject = null;
      const jsonValue = await AsyncStorage.getItem(key);
      jsonObject = jsonValue != null ? JSON.parse(jsonValue) : null;
      return jsonObject;
    } catch (e) {
      console.log('Failed to read ' + key);
      return null;
    }
  };

  const getServiceRunTimes = () => {
    // serviceTimes
    if (!showServiceTimerPopup) return;

    const startDate = new Date(serviceTimes?.startTime);
    const stopDate = new Date(serviceTimes?.stopTime);

    //Calculate and format start time
    const startMonth = startDate.toLocaleDateString('sv-SE', { month: 'long' });
    const startDay = startDate.getDate();
    const startTime = startDate
      .toLocaleTimeString('sv-SE', {
        hour12: false,
      })
      .slice(0, -3);

    //Calculate and format end time
    const stopMonth = stopDate.toLocaleDateString('sv-SE', { month: 'long' });
    const stopDay = stopDate.getDate();
    const stopTime = stopDate
      .toLocaleTimeString('sv-SE', {
        hour12: false,
      })
      .slice(0, -3);

    if (startMonth === stopMonth && startDay === stopDay) {
      return `${startDay} ${startMonth}, ${startTime} - ${stopTime}`;
    }

    return `${startDay} ${startMonth} ${startTime} - ${stopDay} ${stopMonth} ${stopTime}`;
  };

  const handleTimerPopupClose = async () => {
    //delete the timer from local storage
    await AsyncStorage.removeItem('shutDownTime');
    setShowServiceTimerPopup(false);
    setServiceTimes(null);
  };

  return (
    <StyledScreen preset="auto" safeAreaEdges={['top', 'bottom']}>
      <Wrapper>
        <StyledTitle>Hej 👋</StyledTitle>

        <StyledSubTitle>Organisation du kör för</StyledSubTitle>

        <StyledOrganizationPressable onPress={handleOrganizationClick}>
          <OrganizationContainer
            isFocused={showOrganizationPopup}
            isOrgError={isOrgNotSelected}
          >
            {isLoadingOrgs && <ActivityIndicator />}
            {isLoadingOrgs && <OrganizationText>Loading</OrganizationText>}
            {!isLoadingOrgs && organiazations.length < 0 && (
              <OrganizationText>Error Loading Organisations</OrganizationText>
            )}
            {!isLoadingOrgs && organiazations.length > 0 && (
              <OrganizationText>
                {currentOrgIndex === -1
                  ? 'Välj organisation'
                  : organiazations[currentOrgIndex]}
              </OrganizationText>
            )}
            <FontAwesome name="angle-down" size={24} color="black" />
          </OrganizationContainer>
        </StyledOrganizationPressable>

        <StyledSubTitle>Ange pinkod</StyledSubTitle>

        <StyledSubBody>
          Den sexsiffriga koden du loggar in med är angiven i
          instruktionsmejl/sms
        </StyledSubBody>
        <InputTextContainer>
          <PinCodeInput
            isError={isPinError}
            onFinish={handlePinFinished}
            pin={cachedPin}
          />
        </InputTextContainer>

        {isPinError && (
          <StyledErrorText>
            Fel pinkod - kolla att du valt rätt organisation och testa igen.
          </StyledErrorText>
        )}
        {pin && (
          <StyleButton
            title={'Starta körning'}
            onPress={handlePinSubmit}
            type="primary"
            disabled={isLoggingIn || isLoadingOrgs}
            isLoading={isLoggingIn}
          />
        )}
        <StyledLink href={PRIVACY_POLICY}>Personuppgiftspolicy</StyledLink>
      </Wrapper>

      <StyledModal visible={showOrganizationPopup}>
        <ModalBackDrop onPress={() => setShowOrganizationPopup(false)} />
        <StyledModalChildContainer>
          <WheelPicker
            selectedIndex={currentOrgIndex}
            options={organiazations}
            onChange={(index) => {
              setCurrentOrgIndex(index);
            }}
            visibleRest={2}
            itemHeight={45}
            itemTextStyle={{
              fontFamily: theme.fonts.regular,
              fontSize: 18,
            }}
          />
        </StyledModalChildContainer>
      </StyledModal>

      <StyledServiceTimerModal visible={showServiceTimerPopup}>
        <StyledServiceTimerBackdrop onPress={() => handleTimerPopupClose()}>
          <StyledServiceTimerModalChildContainer>
            <StyledSubTitle>Färddata sparad</StyledSubTitle>
            <StyledSubBody>{getServiceRunTimes()}</StyledSubBody>
            <StyledSeparator />
            <StyledModalButton onPress={() => handleTimerPopupClose()}>
              <StyledModalButtonText>Okej</StyledModalButtonText>
            </StyledModalButton>
          </StyledServiceTimerModalChildContainer>
        </StyledServiceTimerBackdrop>
      </StyledServiceTimerModal>
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

type OrganizationContainerProps = {
  isFocused?: boolean;
  isOrgError?: boolean;
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

const StyledLink = styled(A)`
  align-self: center;
  text-decoration-line: underline;
`;

const StyledOrganizationPressable = styled.TouchableOpacity``;

const OrganizationContainer = styled.View<OrganizationContainerProps>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md};
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border-color: ${({ theme, isFocused, isOrgError }) =>
    isOrgError
      ? theme.colors.state.error
      : isFocused
      ? theme.colors.primary.main
      : 'transparent'};
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

const StyledModalChildContainer = styled(ModalChildContainer)`
  padding-top: ${({ theme }) => theme.space.xl};
  padding-bottom: ${({ theme }) => theme.space.xl};
`;

const StyledServiceTimerModal = styled(Modal)``;

const StyledServiceTimerBackdrop = styled(ModalBackDrop)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const StyledServiceTimerModalChildContainer = styled(ModalChildContainer)`
  padding-top: 30px;
  width: 70%;
  border-radius: 7px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const StyledSeparator = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.primary.borderColor};
`;
const StyledModalButton = styled.TouchableOpacity`
  padding: 10px 0;
`;

const StyledModalButtonText = styled(SubTitle)`
  color: ${({ theme }) => theme.colors.state.info};
`;
