import React from 'react';
import styled from 'styled-components/native';

interface PagerIndicatorProps {
  pageCount: number;
  activeIndex: number;
}

const PagerIndicator: React.FC<PagerIndicatorProps> = ({
  pageCount,
  activeIndex,
}) => {
  return (
    <Container>
      {[...Array(pageCount)].map((_, index) => (
        <Indicator key={index} active={index === activeIndex} />
      ))}
    </Container>
  );
};

const Container = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  justify-content: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.space.md};
`;

const Indicator = styled.View<{ active: boolean }>`
  height: 16px;
  width: 16px;
  border-radius: 8px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.black : theme.colors.primary.backgroundHighlight};
`;

export default PagerIndicator;
