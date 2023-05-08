import React, { ReactElement } from 'react';
import { ComponentType } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface IconProps extends TouchableOpacityProps {
  icon: ReactElement;
  onPress?: TouchableOpacityProps['onPress'];
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 */
export function Icon(props: IconProps) {
  const { icon, ...WrapperProps } = props;

  const isPressable = !!WrapperProps.onPress;
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View;

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
    >
      {icon}
    </Wrapper>
  );
}
