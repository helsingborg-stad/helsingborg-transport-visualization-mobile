import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalChildContainer,
  ModalBackDrop,
  Code,
  SubTitle,
  Body,
} from '@src/components';
import styled from 'styled-components/native';
import { LOCATION_SERVICE_CALL_INTERVAL_TIME } from '@src/utils/Constants';
import { ZoneFeature } from '@src/modules/home/types';

type DebugModalProps = {
  isServiceClosed: boolean;
  isServiceCalled: boolean;
  apiCallStatus: string;
  isInsideDistributionZone: boolean;
  distributionZone: any;
  location: any;
  userZones: ZoneFeature[];
  detailEventLog: any[];
  showDevInfoModal: boolean;
  setShowDevInfoModal: (val: boolean) => void;
  oldStateDeleted: string;
};

export const DebugModal: React.FC<DebugModalProps> = ({
  isServiceClosed,
  isServiceCalled,
  apiCallStatus,
  isInsideDistributionZone,
  distributionZone,
  location,
  userZones,
  detailEventLog,
  showDevInfoModal,
  setShowDevInfoModal,
  oldStateDeleted,
}) => {
  const [counter, setCounter] = useState(0);

  //reset the counter
  useEffect(() => {
    if (isServiceCalled) {
      setCounter(0);
    }
  }, [isServiceCalled]);

  //start the counter on load
  useEffect(() => {
    let interval = null;
    setCounter(0);
    interval = setInterval(() => {
      setCounter((v) => v + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledModal visible={showDevInfoModal}>
      <ModalBackDrop onPress={() => setShowDevInfoModal(false)} />
      <StyledModalChildContainer>
        <StyledOldState>
          {'Service time: '}
          {LOCATION_SERVICE_CALL_INTERVAL_TIME / 1000}
          {' sec '} - {' ' + counter + ' s'}
        </StyledOldState>
        <StyledOldState>{oldStateDeleted}</StyledOldState>

        <StyledServiceContainer>
          <StyledHeader>Service Status:</StyledHeader>
          <StyledServiceText>
            {isServiceClosed ? (
              <StyledServiceTextRed>Shutdown</StyledServiceTextRed>
            ) : isServiceCalled ? (
              'Running'
            ) : (
              'Waiting'
            )}
          </StyledServiceText>
        </StyledServiceContainer>
        <StyledUserLocationContainer>
          <StyledHeader>API call status:</StyledHeader>
          <StyledApiText>
            {apiCallStatus.length > 1 ? apiCallStatus : 'Waiting'}
          </StyledApiText>
        </StyledUserLocationContainer>

        <StyledUserLocationContainer>
          <StyledHeader>Distribution Zone:</StyledHeader>

          <StyledBody>
            Inside a distribution zone : {' ' + isInsideDistributionZone}
          </StyledBody>

          {distributionZone && (
            <StyledBody>
              Current Distribution Zone:{' '}
              {distributionZone
                ? distributionZone.properties.name
                : 'cannot get the name of zone'}
            </StyledBody>
          )}
        </StyledUserLocationContainer>

        <StyledUserLocationContainer>
          <StyledHeader>Location:</StyledHeader>
          {location && (
            <StyledBody>
              {location.latitude}, {location.longitude}
            </StyledBody>
          )}
        </StyledUserLocationContainer>

        <StyledUserZonesContainer>
          <StyledHeader>Zones:</StyledHeader>
          {userZones && (
            <StyledBody>
              {JSON.stringify(userZones.map((zone) => zone.properties.name))}
            </StyledBody>
          )}
        </StyledUserZonesContainer>
        <StyledScrollView>
          {detailEventLog.map((event, index) => (
            <StyledCode key={index}>
              {'• '}
              {event}
            </StyledCode>
          ))}
        </StyledScrollView>
      </StyledModalChildContainer>
    </StyledModal>
  );
};

const StyledUserLocationContainer = styled.View`
  flex-direction: column;
  width: 100%;
  margin: 10px;
`;

const StyledUserZonesContainer = styled(StyledUserLocationContainer)`
  margin-top: 0;
`;

const StyledServiceContainer = styled(StyledUserLocationContainer)`
  margin-top: 0;
  flex-direction: row;
  gap: 10px;
`;

const StyledHeader = styled(SubTitle)`
  font-weight: 900;
`;
const StyledBody = styled(Body)``;

const StyledCode = styled(Code)``;

const StyledOldState = styled(Body)`
  margin: 10px;
`;

const StyledServiceText = styled(Body)`
  color: green;
`;

const StyledServiceTextRed = styled(Body)`
  color: red;
`;
const StyledApiText = styled(Body)``;

//
const StyledModal = styled(Modal)``;

const StyledModalChildContainer = styled(ModalChildContainer)`
  padding: 20px;
  width: 100%;
`;

const StyledScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}))`
  width: 100%;
  height: 200px;
  background-color: papayawhip;
  border-radius: 10px;
`;
