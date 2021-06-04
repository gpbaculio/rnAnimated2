import React, {ReactNode} from 'react';
import {
  TextProps as OriginalTextProps,
  Text as RNText,
  TextStyle,
} from 'react-native';
import {styleGuide} from '../../constants';

interface TextProps extends OriginalTextProps {
  dark?: boolean;
  type?: keyof typeof styleGuide['typography'];
  children: ReactNode;
}

const Text = ({dark, type, style, children}: TextProps) => {
  const color = dark ? 'white' : 'black';
  return (
    <RNText
      style={[
        styleGuide.typography[type || 'body'] as TextStyle,
        {color},
        style,
      ]}>
      {children}
    </RNText>
  );
};

export default Text;
