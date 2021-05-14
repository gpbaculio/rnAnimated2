import React, {ReactNode} from 'react';
import {TextProps as OriginalTextProps, Text as RNText} from 'react-native';

import {styleGuide} from '../constants';

export interface TextProps extends OriginalTextProps {
  dark?: boolean;
  type?: keyof typeof styleGuide['typography'];
  children: ReactNode;
}

const Text = ({dark, type, style, children}: TextProps) => {
  const color = dark ? 'white' : 'black';
  return (
    <RNText style={[styleGuide.typography[type || 'body'], {color}, style]}>
      {children}
    </RNText>
  );
};

export default Text;
