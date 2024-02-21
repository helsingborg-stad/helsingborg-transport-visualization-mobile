import React, { FC } from 'react';
import {
  CenterView,
  Circle,
  ListItem,
  NoResultTitle,
  StyledBody,
  StyledScreen,
  StyledSubtitle,
} from './styles';
import { FlatList, View } from 'react-native';
import { TrackingEvent } from '@src/api/types';
import DistributionCenter from '@src/components/icons/DistributionCenter';
import Delivery from '@src/components/icons/Delivery';
import { UTCToLocal } from '@src/utils/date';

interface SecondSlideScreenProps {
  key: number;
  trackedEvents: TrackingEvent[];
}

export const SecondSlideScreen: FC<SecondSlideScreenProps> = ({
  key,
  trackedEvents,
}) => {
  return (
    <StyledScreen key={key} safeAreaEdges={['top', 'bottom']}>
      {(!trackedEvents || trackedEvents.length === 0) && (
        <CenterView>
          <Circle>
            <Delivery />
          </Circle>
          <NoResultTitle>
            Inga händelser registrerade under denna resa
          </NoResultTitle>
        </CenterView>
      )}
      {trackedEvents && trackedEvents.length > 0 && (
        <FlatList
          data={trackedEvents}
          renderItem={({ item }) => (
            <ListItem key={item.trackingId}>
              <View>
                <Circle>
                  {item.zone.properties.type &&
                  item.zone.properties.type.toLowerCase() === 'distribution' ? (
                    <DistributionCenter />
                  ) : (
                    <Delivery />
                  )}
                </Circle>
              </View>
              <View>
                <StyledSubtitle>{item.zone.properties.name}</StyledSubtitle>
                <StyledBody>{item.zone.properties.address}</StyledBody>
                <StyledBody>
                  {UTCToLocal(item.enteredAt).toLocaleTimeString('se-SV', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {UTCToLocal(item.exitedAt).toLocaleTimeString('se-SV', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </StyledBody>
              </View>
            </ListItem>
          )}
        />
      )}
    </StyledScreen>
  );
};
