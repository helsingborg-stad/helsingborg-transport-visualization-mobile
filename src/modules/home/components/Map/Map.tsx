import React, { FC, useEffect, useRef, useState } from 'react';
import MapView, {
  Geojson,
  Marker,
  MarkerPressEvent,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import TruckMarker from '@src/components/icons/TruckMarker';
import MyLocation from '@src/components/icons/MyLocation';
import MyLocationDisabled from '@src/components/icons/MyLocationDisabled';
import styled from 'styled-components/native';
import mapStyle from './mapStyle';
import { useGeolocationContext } from '@src/context/geolocation/geolocationContext';

const MapWrapper = styled.View`
  flex: 1;
  width: 100%;
`;

const FollowButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #fff;
  padding: 8px;
  border-radius: 8px;
`;

const Map: FC = () => {
  const { location, recordedLocations, zones } = useGeolocationContext();
  const mapRef = useRef<MapView>();
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const toggleFollowUserLocation = () => {
    setFollowUserLocation((prev) => !prev);
    if (!followUserLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        0
      );
    }
  };

  const handleDisableFollow = () => {
    setFollowUserLocation(false);
  };

  useEffect(() => {
    if (location && followUserLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        0
      );
    }
  }, [location]);

  const handleMarkerPress = (event: MarkerPressEvent) => {
    event.preventDefault();
  };

  return (
    <MapWrapper>
      <MapView
        ref={mapRef}
        customMapStyle={mapStyle}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        mapPadding={{ top: 0, left: 0, right: 0, bottom: 0 }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsScale={false}
        showsPointsOfInterest={false}
        showsIndoorLevelPicker={false}
        pitchEnabled={false}
        onPanDrag={handleDisableFollow}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location?.latitude || 0,
              longitude: location?.longitude || 0,
            }}
            onPress={handleMarkerPress}
          >
            <TruckMarker />
          </Marker>
        )}
        {zones && (
          <Geojson
            geojson={zones}
            strokeColor="#000000"
            strokeWidth={2}
            fillColor="#FFFFFF"
          />
        )}
        {recordedLocations.length > 1 && (
          <Polyline
            coordinates={recordedLocations.map((loc) => ({
              latitude: loc.latitude,
              longitude: loc.longitude,
            }))}
            strokeWidth={10}
            strokeColor="#707070" // Line color
          />
        )}
      </MapView>
      <FollowButton onPress={toggleFollowUserLocation}>
        {followUserLocation ? <MyLocation /> : <MyLocationDisabled />}
      </FollowButton>
    </MapWrapper>
  );
};

export default Map;
