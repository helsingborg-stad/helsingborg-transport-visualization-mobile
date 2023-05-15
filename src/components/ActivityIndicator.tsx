import React from 'react';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

export type ActivityIndicatorProps = {
  color?: string;
};

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  color,
}) => {
  const theme = useTheme();
  return (
    <RNActivityIndicator
      color={color ? color : theme.colors.primary.borderColor}
    />
  );
};
ActivityIndicator.defaultProps = {
  color: null,
};
