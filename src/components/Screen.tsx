// import { useScrollToTop } from "@react-navigation/native"
import { StatusBar, StatusBarProps } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingViewProps,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

import {
  ExtendedEdge,
  useSafeAreaInsetsStyle,
} from '../utils/useSafeAreaInsetsStyle';
import styled from 'styled-components/native';

interface BaseScreenProps {
  children?: React.ReactNode;
  contentContainerStyle?: any;
  safeAreaEdges?: ExtendedEdge[];
  backgroundColor?: string;
  statusBarStyle?: 'light' | 'dark';
  keyboardOffset?: number;
  StatusBarProps?: StatusBarProps;
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed';
}
interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll';
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  ScrollViewProps?: ScrollViewProps;
}

interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto';
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

export type ScreenProps =
  | ScrollScreenProps
  | FixedScreenProps
  | AutoScreenProps;

const isIos = Platform.OS === 'ios';

function isNonScrolling(preset?: ScreenProps['preset']) {
  return !preset || preset === 'fixed';
}

function useAutoPreset(props: AutoScreenProps) {
  const { preset, scrollEnabledToggleThreshold } = props;
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {};

  const scrollViewHeight = useRef(null);
  const scrollViewContentHeight = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  function updateScrollState() {
    if (
      scrollViewHeight.current === null ||
      scrollViewContentHeight.current === null
    )
      return;

    // check whether content fits the screen then toggle scroll state according to it
    const contentFitsScreen = (function () {
      if (point) {
        return (
          scrollViewContentHeight.current < scrollViewHeight.current - point
        );
      } else {
        return (
          scrollViewContentHeight.current < scrollViewHeight.current * percent
        );
      }
    })();

    // content is less than the size of the screen, so we can disable scrolling
    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);

    // content is greater than the size of the screen, so let's enable scrolling
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
  }

  function onContentSizeChange(w: number, h: number) {
    // update scroll-view content height
    scrollViewContentHeight.current = h;
    updateScrollState();
  }

  function onLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout;
    // update scroll-view  height
    scrollViewHeight.current = height;
    updateScrollState();
  }

  // update scroll state on every render
  if (preset === 'auto') updateScrollState();

  return {
    scrollEnabled: preset === 'auto' ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  };
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const { contentContainerStyle, children } = props;
  return (
    <ScreenWithoutScrollingContainer>
      <ScreenWithoutScrollingInnerContainer style={contentContainerStyle}>
        {children}
      </ScreenWithoutScrollingInnerContainer>
    </ScreenWithoutScrollingContainer>
  );
}

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    ScrollViewProps,
    contentContainerStyle,
  } = props as ScrollScreenProps;

  const ref = useRef<ScrollView>();

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(
    props as AutoScreenProps
  );

  //
  //  RE ADD THE LOGIC WHEN NAVIGATION IS IN PLACE
  //
  // Add native behavior of pressing the active tab to scroll to the top of the content
  // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
  // useScrollToTop(ref)
  //
  return (
    <MainScrollView
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e);
        ScrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h);
        ScrollViewProps?.onContentSizeChange?.(w, h);
      }}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </MainScrollView>
  );
}

export function Screen(props: ScreenProps) {
  const {
    backgroundColor,
    KeyboardAvoidingViewProps,
    keyboardOffset = 0,
    safeAreaEdges,
    StatusBarProps,
    statusBarStyle = 'dark',
  } = props;

  const containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  return (
    <MainContinerWithInsets insets={containerInsets} bg={backgroundColor}>
      <StatusBar style={statusBarStyle} {...StatusBarProps} />

      <KeyboardAvoidingViewContainer
        behavior={isIos ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
      >
        {isNonScrolling(props.preset) ? (
          <ScreenWithoutScrolling {...props} />
        ) : (
          <ScreenWithScrolling {...props} />
        )}
      </KeyboardAvoidingViewContainer>
    </MainContinerWithInsets>
  );
}

// Styled Compoenents interfaces
interface Insets {
  'margin-bottom': string;
  'margin-top': string;
  'margin-left': string;
  'margin-right': string;
  'padding-bottom': string;
  'padding-top': string;
  'padding-left': string;
  'padding-right': string;
}

interface MainContainerProps {
  bg?: string;
  insets: Partial<Insets>;
}

const MainContinerWithInsets = styled.View<MainContainerProps>`
  flex: 1;
  height: 100%;
  width: 100%;
  background: ${(props) =>
    props.bg ? props.bg : props.theme.colors.primary.background};
  ${(props) => props.insets}
`;

const KeyboardAvoidingViewContainer = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ScreenWithoutScrollingContainer = styled.View`
  flex: 1;
  height: 100%;
  width: 100%;
`;

const ScreenWithoutScrollingInnerContainer = styled.View`
  justify-content: 'flex-start';
  align-items: 'stretch';
`;

const MainScrollView = styled.ScrollView`
  flex: 1;
  height: 100%;
  width: 100%;
`;
