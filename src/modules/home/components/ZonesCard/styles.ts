import styled from 'styled-components/native';
import { SubTitle } from '@src/components';

export const StyledSubTitle = styled(SubTitle)`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

export const ZoneContainer = styled.View`
  align-items: center;
`;

export const StyledScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
}))`
  max-height: 150px;
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.xxl}`};
  border-radius: 15px;
  margin: 10px;
`;
