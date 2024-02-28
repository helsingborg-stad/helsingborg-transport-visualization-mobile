import React, { FC } from 'react';
import { StyleButton, StyledScreen, Wrapper } from './styles';
import Map from '@src/modules/home/components/Map/Map';
import { ZonesCard } from '@src/modules/home/components/ZonesCard';
import { Timer } from '@src/modules/home/components/Timer';
import { ZoneFeature } from '@src/modules/home/types';

interface FirstSlideScreenProps {
  key: number;
  userZones: ZoneFeature[];
  handleTripleTap: () => void;
  currentStopTrackingTime: string;
  timeLeft: string;
  hoursToTrack: number;
  onTimerSliderChange: (value: number) => void;
  isTracking: boolean;
  toggleLocationService: () => void;
  isChangingServiceStatus: boolean;
}

export const FirstSlideScreen: FC<FirstSlideScreenProps> = ({
  key,
  userZones,
  handleTripleTap,
  currentStopTrackingTime,
  timeLeft,
  hoursToTrack,
  onTimerSliderChange,
  isTracking,
  toggleLocationService,
  isChangingServiceStatus,
}) => {
  return (
    <StyledScreen key={key} safeAreaEdges={['top', 'bottom']}>
      <Map />
      <Wrapper>
        {userZones && userZones.length > 0 ? (
          <ZonesCard showDebugModal={handleTripleTap} zones={userZones} />
        ) : (
          <Timer
            showDebugModal={handleTripleTap}
            currentStopTrackingTime={currentStopTrackingTime}
            timeLeft={timeLeft}
            hoursToTrack={hoursToTrack}
            onSliderChange={onTimerSliderChange}
          />
        )}
        <StyleButton
          title={isTracking ? 'Stoppa körning' : 'Starta körning'}
          type="primary"
          onPress={toggleLocationService}
          disabled={isChangingServiceStatus}
          isLoading={isChangingServiceStatus}
        />
      </Wrapper>
    </StyledScreen>
  );
};
