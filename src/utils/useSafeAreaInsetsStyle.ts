import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

export type ExtendedEdge = Edge;

const propertySuffixMap = {
  top: 'top',
  bottom: 'bottom',
  left: 'start',
  right: 'end',
};

/**
 * A hook that can be used to create a safe-area-aware style object that can be passed directly to a View.
 *
 */
export function useSafeAreaInsetsStyle(
  safeAreaEdges: ExtendedEdge[] = [],
  property: 'padding' | 'margin' = 'padding'
) {
  const insets = useSafeAreaInsets();

  return safeAreaEdges.reduce((acc, e) => {
    return {
      ...acc,
      [`${property}-${propertySuffixMap[e]}`]: insets[e] + 'px',
    };
  }, {});
}
