import React, { FC } from 'react';
import * as Notifications from 'expo-notifications';
import { StyledPagerView } from './styles';
import { DebugModal } from '@src/modules/home/components/DebugModal';
import { useHome } from '@src/modules/home/screens/Home/useHome';
import { FirstSlideScreen } from '@src/modules/home/components/FirstSlideScreen/FirstSlideScreen';
import { SecondSlideScreen } from '@src/modules/home/components/SecondSlideScreen';
import PagerIndicator from '@src/modules/home/components/PagerIndicator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const HomeScreen: FC = () => {
  const {
    isChangingServiceStatus,
    showDevInfoModal,
    oldStateDeleted,
    currentStopTrackingTime,
    timeLeft,
    isServiceCalled,
    location,
    apiCallStatus,
    userZones,
    trackedEvents,
    distributionZone,
    isInsideDistributionZone,
    detailEventLog,
    handleTripleTap,
    toggleLocationService,
    isServiceClosed,
    isTracking,
    hoursToTrack,
    setShowDevInfoModal,
    onTimerSliderChange,
    currentPage,
    setCurrentPage,
  } = useHome();

  return (
    <>
      <StyledPagerView
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <FirstSlideScreen
          key={0}
          userZones={userZones}
          isTracking={isTracking}
          hoursToTrack={hoursToTrack}
          currentStopTrackingTime={currentStopTrackingTime}
          timeLeft={timeLeft}
          onTimerSliderChange={onTimerSliderChange}
          toggleLocationService={toggleLocationService}
          isChangingServiceStatus={isChangingServiceStatus}
          handleTripleTap={handleTripleTap}
        />
        <SecondSlideScreen key={1} trackedEvents={trackedEvents} />
      </StyledPagerView>
      <PagerIndicator pageCount={2} activeIndex={currentPage} />
      <DebugModal
        isServiceClosed={isServiceClosed}
        isServiceCalled={isServiceCalled}
        apiCallStatus={apiCallStatus}
        isInsideDistributionZone={isInsideDistributionZone}
        distributionZone={distributionZone}
        location={location}
        userZones={userZones}
        detailEventLog={detailEventLog}
        showDevInfoModal={showDevInfoModal}
        setShowDevInfoModal={setShowDevInfoModal}
        oldStateDeleted={oldStateDeleted}
      />
    </>
  );
};
