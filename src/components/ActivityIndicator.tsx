import React from 'react';
import {
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps as RNActivityIndicatorProps,
} from 'react-native';
import { useTheme } from 'styled-components';

export interface ActivityIndicatorProps extends RNActivityIndicatorProps {
  color?: string;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  color,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <RNActivityIndicator
      color={color ? color : theme.colors.primary.borderColor}
      {...rest}
    />
  );
};
ActivityIndicator.defaultProps = {
  color: null,
};
