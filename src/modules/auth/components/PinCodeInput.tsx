import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { Body } from '@src/components';

type PinCodeInputProps = {
  isError?: boolean;
  onFinish?: (val: string) => void;
};

type StyledPinProps = {
  isError?: boolean;
};

//
// This component Renders the PinCode control
// Instead of 6 inputs it uses only one so Its efficent and fast
// Because if this its not too complex either
// We move the original input text outside of the screen and use
// Texts to show the pin and for caret we just animate a View with
// a background color
//

export const PinCodeInput: React.FC<PinCodeInputProps> = ({
  onFinish,
  isError,
}) => {
  const inputRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [currentPinIndex, setCurrentPinIndex] = useState(-1);
  const [showCaret, setShowCaret] = useState(true);

  //To update the current index for Pin boxes
  useEffect(() => {
    const index = inputText.length;
    setCurrentPinIndex(index <= 0 ? 0 : index > 5 ? 5 : index);
    setShowCaret(true);
  }, [inputText]);

  //when we fill all the pin codes then we dismiss the keyboard
  useEffect(() => {
    if (inputRef && inputText.length === 6) {
      inputRef.current.blur();
      onFinish?.(inputText);
    }
  }, [inputRef, inputText]);

  //For caret animation
  //we should convert this to ReAnimated 2
  useEffect(() => {
    setCurrentPinIndex(-1);
    const interval = setInterval(() => {
      setShowCaret((v) => !v);
    }, 800);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // if there is an error
  // clear the pin and move the cursor and move the cursor
  // to first pin box and show keyboard
  useEffect(() => {
    if (isError) {
      setInputText('');
      inputRef.current.focus();
    }
  }, [isError]);

  // To show the keyboard when PinCode boxes are pressed
  const handleOnPress = () => {
    if (inputRef) {
      inputRef.current.focus();
      const index = inputText.length;
      setCurrentPinIndex(index < 0 ? -1 : index > 5 ? 5 : index);
    }
  };

  // Set the caret hidden when keyboard is not shown
  const handleOnBlur = () => {
    setCurrentPinIndex(-1);
  };

  return (
    <StyledMainContainer>
      {/* we use normal input as user will not be able to see it */}
      <TextInput
        ref={inputRef}
        placeholder="1"
        value={inputText}
        onChangeText={setInputText}
        maxLength={6}
        keyboardType={'number-pad'}
        textAlign={'center'}
        onBlur={handleOnBlur}
        //Workaroud for carret if text aligned center - Android
        multiline={true}
        numberOfLines={1}
        style={{
          position: 'absolute',
          top: 0,
          left: -Dimensions.get('window').width * 2,
          width: 1,
          height: 1,
        }}
      />
      <StyledPinContainer>
        {[...Array(6).keys()].map((elem, index) => (
          <StyledPin key={elem} onPress={handleOnPress} isError={isError}>
            <StyledPinText>{Array.from(inputText)[index]}</StyledPinText>
            {currentPinIndex === index && (
              <StyledPinCaret style={{ opacity: showCaret ? 1 : 0 }} />
            )}
          </StyledPin>
        ))}
      </StyledPinContainer>
    </StyledMainContainer>
  );
};

const StyledMainContainer = styled.View`
  flex: 1;
`;

const StyledPinContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledPin = styled.Pressable<StyledPinProps>`
  flex: 1;
  height: 60px;
  border-radius: 5px;
  border-color: ${({ theme, isError }) =>
    isError ? theme.colors.state.error : theme.colors.primary.borderColor};
  background-color: ${({ theme }) => theme.colors.primary.backgroundHighlight};
  border-width: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1px;
`;

const StyledPinText = styled(Body)``;

const StyledPinCaret = styled.View`
  width: 2px;
  border-color: ${({ theme }) => theme.colors.primary.main};
  background-color: ${({ theme }) => theme.colors.primary.main};
  height: 20px;
`;
