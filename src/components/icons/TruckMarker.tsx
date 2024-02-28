import { FC } from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

const TruckMarker: FC<SvgProps> = (props) => {
  return (
    <Svg width="56" height="56" viewBox="0 0 56 56" fill="none" {...props}>
      <Path
        d="M28 50.5787C27.9078 50.4733 27.7997 50.3488 27.677 50.2064C27.2332 49.6912 26.5983 48.9408 25.8361 48.0016C24.3113 46.1229 22.2791 43.4917 20.2478 40.4811C18.2156 37.469 16.1905 34.0862 14.675 30.7035C13.1566 27.3141 12.1667 23.9617 12.1667 21.0003C12.1667 12.2465 19.2461 5.16699 28 5.16699C36.7539 5.16699 43.8333 12.2465 43.8333 21.0003C43.8333 23.9617 42.8434 27.3141 41.3249 30.7035C39.8095 34.0862 37.7844 37.469 35.7522 40.4811C33.7209 43.4917 31.6887 46.1229 30.1639 48.0016C29.4017 48.9408 28.7668 49.6912 28.323 50.2064C28.2003 50.3488 28.0921 50.4733 28 50.5787ZM21.6667 21.0003C21.6667 24.4965 24.5039 27.3337 28 27.3337C31.4961 27.3337 34.3333 24.4965 34.3333 21.0003C34.3333 17.5042 31.4961 14.667 28 14.667C24.5039 14.667 21.6667 17.5042 21.6667 21.0003Z"
        fill="black"
        stroke="black"
      />
      <Rect x="20" y="13" width="16" height="16" fill="black" />
      <Path
        d="M36.3333 19.3337H33.5833V15.667H20.75C19.7417 15.667 18.9167 16.492 18.9167 17.5003V27.5837H20.75C20.75 29.1053 21.9783 30.3337 23.5 30.3337C25.0217 30.3337 26.25 29.1053 26.25 27.5837H31.75C31.75 29.1053 32.9783 30.3337 34.5 30.3337C36.0217 30.3337 37.25 29.1053 37.25 27.5837H39.0833V23.0003L36.3333 19.3337ZM23.5 28.9587C22.7392 28.9587 22.125 28.3445 22.125 27.5837C22.125 26.8228 22.7392 26.2087 23.5 26.2087C24.2608 26.2087 24.875 26.8228 24.875 27.5837C24.875 28.3445 24.2608 28.9587 23.5 28.9587ZM35.875 20.7087L37.6717 23.0003H33.5833V20.7087H35.875ZM34.5 28.9587C33.7392 28.9587 33.125 28.3445 33.125 27.5837C33.125 26.8228 33.7392 26.2087 34.5 26.2087C35.2608 26.2087 35.875 26.8228 35.875 27.5837C35.875 28.3445 35.2608 28.9587 34.5 28.9587Z"
        fill="#FCFCFC"
      />
    </Svg>
  );
};

export default TruckMarker;
