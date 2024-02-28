import styled from 'styled-components/native';
import { Button, Screen } from '@src/components';

export const StyledScreen = styled(Screen).attrs(() => ({
  contentContainerStyle: {
    flex: 1,
    marginBottom: 32,
  },
}))``;

export const StyleButton = styled(Button)`
  width: 60%;
  margin-top: ${({ theme }) => theme.space.xl};
  align-self: center;
`;

export const Wrapper = styled.View`
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 22px;
  padding-bottom: 22px;
`;
