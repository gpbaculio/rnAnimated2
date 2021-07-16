import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import styled from 'styled-components/native';
import {Audio} from 'expo-av';
import Slider from '@react-native-community/slider';
import {AVPlaybackSource, AVPlaybackStatus} from 'expo-av/build/AV';
import MainAnimatedCircle from './MainAnimatedCircle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useRef} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import AnimatedCircle from './AnimatedCircle';
import {mix, withPause} from '../constants';

const song = require('../../../assets/audio/song.mp3');
const thumb = require('../../../assets/thumb.png');

class PlaylistItem {
  name: string;
  uri: string;
  image: string;
  constructor(name: string, uri: string, image: string) {
    this.name = name;
    this.uri = uri;
    this.image = image;
  }
}

const PLAYLIST = [
  new PlaylistItem(
    'Comfort Fit - “Sorry”',
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3',
    'https://facebook.github.io/react/img/logo_og.png',
  ),
  new PlaylistItem(
    'Mildred Bailey – “All Of Me”',
    'https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3',
    'https://facebook.github.io/react/img/logo_og.png',
  ),
  new PlaylistItem(
    'Podington Bear - “Rubber Robot”',
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3',
    'https://facebook.github.io/react/img/logo_og.png',
  ),
];

const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFFFFF';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;

const PlayingAudio = () => {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackInstancePosition, setPlaybackInstancePosition] = useState<
    number | null
  >(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState<
    number | null | undefined
  >(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);

  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [loopingType, setLoopingType] = useState(0);
  const [shouldCorrectPitch, setShouldCorrectPitch] = useState(false);
  const advanceIndex = (forward: boolean) => {
    setIndex(index + ((forward ? 1 : PLAYLIST.length - 1) % PLAYLIST.length));
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    console.log('status: ', status);
    if (status.isLoaded) {
      setShouldPlay(status.shouldPlay);
      setPlaybackInstancePosition(status.positionMillis);
      setPlaybackInstanceDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      setMuted(status.isMuted);
      setVolume(status.volume);
      setLoopingType(status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL);
      setShouldCorrectPitch(status.shouldCorrectPitch);

      if (status.didJustFinish && !status.isLooping) {
        advanceIndex(true);
        updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const updateScreenForLoading = (isLoading: boolean) => {
    if (isLoading) {
      setIsPlaying(false);
      setPlaybackInstancePosition(null);
      setPlaybackInstanceDuration(null);
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  const loadNewPlaybackInstance = async (playing: boolean) => {
    if (sound != null) {
      await sound.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      setSound(null);
    }

    const source = {uri: PLAYLIST[index].uri};
    const initialStatus = {
      shouldPlay: playing,
      shouldCorrectPitch,
      volume,
      isMuted: muted,
      isLooping: loopingType === LOOPING_TYPE_ONE,
    };

    const {sound: AudioSound, status} = await Audio.Sound.createAsync(
      source,
      initialStatus,
      onPlaybackStatusUpdate,
    );
    setSound(AudioSound);

    updateScreenForLoading(false);
  };

  const updatePlaybackInstanceForIndex = (playing: boolean) => {
    updateScreenForLoading(true);

    loadNewPlaybackInstance(playing);
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    const loadSound = async () => {
      const initialStatus = {
        shouldPlay: false,
        shouldCorrectPitch,
        volume,
        isMuted: muted,
        isLooping: loopingType === LOOPING_TYPE_ONE,
      };
      const {sound} = await Audio.Sound.createAsync(
        song,
        initialStatus,
        onPlaybackStatusUpdate,
      );
      setSound(sound);
    };
    loadSound();
  }, []);

  const getSeekSliderPosition = () => {
    if (
      sound != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return playbackInstancePosition / playbackInstanceDuration;
    }
    return 0;
  };
  //sound = playbackInstance
  const onSeekSliderValueChange = (value: number) => {
    console.log('onSeekSliderValueChange value ', value);
    if (sound != null && !isSeeking) {
      setIsSeeking(true);
      setShouldPlayAtEndOfSeek(shouldPlay);
      sound.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (sound != null && playbackInstanceDuration) {
      setIsSeeking(false);
      const seekPosition = value * playbackInstanceDuration;
      if (shouldPlayAtEndOfSeek) {
        sound.playFromPositionAsync(seekPosition);
      } else {
        sound.setPositionAsync(seekPosition);
      }
    }
  };

  const getMMSSFromMillis = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (time: number) => {
      const string = time.toString();
      if (time < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  };

  const getTimestamp = () => {
    if (
      sound != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(
        playbackInstancePosition,
      )} / ${getMMSSFromMillis(playbackInstanceDuration)}`;
    }
    return '';
  };

  const onBackPressed = () => {
    if (sound != null) {
      advanceIndex(false);
      updatePlaybackInstanceForIndex(shouldPlay);
    }
  };

  const onForwardPressed = () => {
    if (sound != null) {
      advanceIndex(true);
      updatePlaybackInstanceForIndex(shouldPlay);
    }
  };

  const onPlayPausePressed = () => {
    if (sound != null) {
      if (isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  };

  const onStopPressed = () => {
    if (sound != null) {
      sound.stopAsync();
    }
  };

  const progress = useSharedValue(0);
  const isPause = useSharedValue(true);
  const mainProgress = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${
            progress.value !== undefined
              ? interpolate(progress.value, [0, 1], [1, 360])
              : -45
          }deg`,
        },
      ],
    };
  });

  useEffect(() => {
    'worklet';

    progress.value = withPause(
      withRepeat(
        withTiming(1, {duration: 1000, easing: Easing.linear}),
        -1,
        false,
      ),
      isPause,
    );

    mainProgress.value = withPause(
      withRepeat(
        withTiming(1, {duration: 1000, easing: Easing.linear}),
        -1,
        true,
      ),
      isPause,
    );
  }, [isPause, progress, mainProgress]);
  return (
    <Container>
      <Main>
        <StyledSlider
          minimumTrackTintColor="red"
          maximumTrackTintColor="green"
          value={getSeekSliderPosition()}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={onSeekSliderSlidingComplete}
          disabled={isLoading}
        />
        <Animated.View style={[StyleSheet.absoluteFill, style]}>
          {new Array(2).fill(0).map((i, index) => {
            return (
              <AnimatedCircle {...{key: index, index, progress, isPause}} />
            );
          })}
        </Animated.View>
        <MainAnimatedCircle {...{progress: mainProgress}} />
        <TimestampRow>
          <StyledText>{isBuffering ? BUFFERING_STRING : ''}</StyledText>
          <StyledText>{getTimestamp()}</StyledText>
        </TimestampRow>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerTopRow,
            {
              opacity: isLoading ? DISABLED_OPACITY : 1.0,
            },
            {zIndex: 99},
          ]}>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={onBackPressed}
            disabled={isLoading}>
            <FontAwesome name="backward" color="red" size={18} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={() => {
              'worklet';
              isPause.value = !isPause.value;
              runOnJS(onPlayPausePressed)();
            }}
            disabled={isLoading}>
            {isPlaying ? (
              <FontAwesome name="pause" color="red" size={18} />
            ) : (
              <FontAwesome name="play" color="red" size={18} />
            )}
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={onStopPressed}
            disabled={isLoading}>
            <FontAwesome name="stop" color="red" size={18} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={onForwardPressed}
            disabled={isLoading}>
            <FontAwesome name="forward" color="red" size={18} />
          </TouchableHighlight>
        </View>
      </Main>
      <BottomPlay />
    </Container>
  );
};

export default PlayingAudio;

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  nameContainer: {
    height: FONT_SIZE,
  },
  space: {
    height: FONT_SIZE,
  },
  videoContainer: {
    height: VIDEO_CONTAINER_HEIGHT,
  },
  video: {
    maxWidth: DEVICE_WIDTH,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 19 * 2.0,
    maxHeight: 19 * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  timestampRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minHeight: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  buffering: {
    textAlign: 'left',
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: 'right',
    paddingRight: 20,
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: 51,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: 58,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - 67,
  },
  buttonsContainerBottomRow: {
    maxHeight: 19,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE,
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  },
});

const StyledText = styled.Text`
  font-size: 14px;
`;

const TimestampRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  min-height: 14px;
  z-index: 99;
`;

const StyledSlider = styled(Slider)`
  align-self: stretch;
  z-index: 99;
`;

const Container = styled.View`
  flex: 1;
`;

const Main = styled.View`
  flex: 0.8;
  background-color: #f5f5f5;
`;

const BottomPlay = styled.View`
  flex: 0.2;
  background-color: red;
`;
