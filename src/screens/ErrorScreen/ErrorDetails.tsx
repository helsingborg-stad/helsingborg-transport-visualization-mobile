import React, { ErrorInfo, useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components';
import { Icon, Screen, Button, Title, Body } from '../../components';

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo;
  onReset(): void;
}

export function ErrorDetails(props: ErrorDetailsProps) {
  const theme = useTheme();

  const bugIcon = useMemo(
    () => (
      <MaterialIcons
        name="bug-report"
        size={64}
        color={theme.colors.primary.main}
      />
    ),
    []
  );

  return (
    <StyledScreen preset="fixed" safeAreaEdges={['top', 'bottom']}>
      <TopViewSection>
        <StyledIcon icon={bugIcon} />
        <StyleTitle>Something went wrong!</StyleTitle>
        <StyleBody>
          This is the screen that users will see in production when an error is
          thrown. We should change the UI or Remove this screen all togehter
        </StyleBody>
      </TopViewSection>

      <StyledScrollView showsVerticalScrollIndicator={false}>
        <StyledErrorTitle>{`${props.error}`.trim()}</StyledErrorTitle>
        <StyledErrorText>
          {`${props.errorInfo.componentStack}`.trim()}
        </StyledErrorText>
      </StyledScrollView>

      <Button title={'Reset App'} onPress={props.onReset} />
    </StyledScreen>
  );
}

const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    flex: 1,
    justifyContent: 'center',
  },
}))``;

const TopViewSection = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-top: ${({ theme }) => theme.space.lg};
  padding-bottom: ${({ theme }) => theme.space.lg};
`;

const StyledIcon = styled(Icon)`
  margin: 0;
`;

const StyleTitle = styled(Title)`
  color: ${({ theme }) => theme.colors.primary.main};
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const StyleBody = styled(Body)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const StyledScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    padding: 16,
  },
}))`
  flex: 2;
  background-color: ${({ theme }) => theme.colors.seperator};
  margin: ${({ theme }) => `${theme.space.md} 0`};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const StyledErrorTitle = styled(Body)`
  color: ${({ theme }) => theme.colors.primary.main};
  font-family: ${({ theme }) => theme.fonts.code.normal};
`;
const StyledErrorText = styled(Body)`
  color: ${({ theme }) => theme.colors.dimText};
  margin-top: ${({ theme }) => theme.space.md};
  font-family: ${({ theme }) => theme.fonts.code.normal};
`;
