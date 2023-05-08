import styled from 'styled-components/native';

export const Text = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const LargeTitle = styled(Text)`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  line-height: ${({ theme }) => theme.lineHeights.xxl};
  letter-spacing: ${({ theme }) => theme.letterSpaces.lg};
`;

export const Title = styled(Text)`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  line-height: ${({ theme }) => theme.lineHeights.xl};
  letter-spacing: ${({ theme }) => theme.letterSpaces.no};
`;

export const SubTitle = styled(Text)`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeights.md};
  letter-spacing: ${({ theme }) => theme.letterSpaces.sm};
`;

export const Body = styled(Text)`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeights.md};
  letter-spacing: ${({ theme }) => theme.letterSpaces.no};
`;

export const SubBody = styled(Text)`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.xs};
  letter-spacing: ${({ theme }) => theme.letterSpaces.no};
`;

export const ButtonText = styled(Text)`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeights.md};
  letter-spacing: ${({ theme }) => theme.letterSpaces.no};
`;

export const OutlinedButtonText = styled(ButtonText)`
  color: ${({ theme }) => theme.colors.primary.main};
`;
