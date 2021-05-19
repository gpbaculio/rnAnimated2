import React from 'react';
import {
  TextStyle,
  TextProps as RNTextProps,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({text: true});

interface TextProps {
  text: Animated.SharedValue<string>;
  style?: Animated.AnimateProps<TextStyle & RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReText = (props: TextProps) => {
  const {text, style} = {style: {}, ...props};
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={text.value}
      style={[styles.baseStyle, style]}
      animatedProps={
        animatedProps as Partial<
          Animated.AnimateProps<{
            text: string;
          }>
        >
      }
    />
  );
};

export default ReText;

const styles = StyleSheet.create({
  baseStyle: {
    color: 'black',
  },
});
