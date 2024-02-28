import { TouchableWithoutFeedback } from 'react-native';
import React, { FC } from 'react';
import { StyledSubTitle, StyledScrollView, ZoneContainer } from './styles';
import { Body, Title } from '@src/components';
import { ZoneFeature } from '@src/modules/home/types';

interface ZonesCardProps {
  showDebugModal: () => void;
  zones: ZoneFeature[];
}

export const ZonesCard: FC<ZonesCardProps> = ({ showDebugModal, zones }) => {
  return (
    <>
      <TouchableWithoutFeedback onPress={showDebugModal}>
        <StyledSubTitle>Inom spårningsområde</StyledSubTitle>
      </TouchableWithoutFeedback>
      {zones && zones.length > 0 && (
        <StyledScrollView>
          {zones.map((zone) => (
            <ZoneContainer key={zone.properties.id}>
              <Title>{zone.properties.name}</Title>
              <Body>{zone.properties.address}</Body>
            </ZoneContainer>
          ))}
        </StyledScrollView>
      )}
    </>
  );
};
