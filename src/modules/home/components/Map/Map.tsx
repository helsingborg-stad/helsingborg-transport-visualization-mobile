import React, { FC } from 'react';
import MapView, {
  Geojson,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import TruckMarker from '@src/components/TruckMarker';
import styled from 'styled-components/native';
import mapStyle from './mapStyle';
import { useGeolocationContext } from '@src/context/geolocation/geolocationContext';

const MapWrapper = styled.View`
  flex: 1;
  width: 100%;
`;

const Map: FC = () => {
  const { location, recordedLocations, zones } = useGeolocationContext();

  return (
    <MapWrapper>
      <MapView
        customMapStyle={mapStyle}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        mapPadding={{ top: 0, left: 0, right: 0, bottom: 0 }}
        showsUserLocation={false}
        followsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsScale={false}
        showsPointsOfInterest={false}
        showsIndoorLevelPicker={false}
        pitchEnabled={false}
        region={{
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location?.latitude || 0,
              longitude: location?.longitude || 0,
            }}
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
    </MapWrapper>
  );
};

export default Map;
