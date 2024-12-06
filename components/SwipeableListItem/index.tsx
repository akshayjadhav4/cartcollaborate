import { ReactNode, useRef } from "react";
import { Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Button, XStack } from "tamagui";
// import type { IconProps } from "@tamagui/helpers-icon";

interface Action {
  icon: ReactNode;
  bgColor: string;
  onPress: () => void;
}

const RightAction: React.FC<{
  icon: ReactNode;
  bgColor: string;
  x: number;
  progress: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
}> = ({ icon, bgColor, x, progress, onPress }) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <Button
        height="100%"
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        color="$white0"
        borderTopRightRadius={"$4"}
        borderBottomRightRadius={"$4"}
        unstyled
        backgroundColor={bgColor}
        onPress={onPress}
      >
        {icon}
      </Button>
    </Animated.View>
  );
};

const RightActions: React.FC<{
  progressAnimatedValue: Animated.AnimatedInterpolation<number>;
  dragAnimatedValue: Animated.AnimatedInterpolation<number>;
  rightActions: Action[];
  close: () => void;
}> = ({ progressAnimatedValue, dragAnimatedValue, rightActions, close }) => {
  return (
    <XStack
      // flex={1}
      width={rightActions.length * 65}
      paddingBottom={3}
    >
      {rightActions.map((action, index) => {
        return (
          <RightAction
            key={index}
            x={(index + 1) * 65}
            progress={progressAnimatedValue}
            icon={action.icon}
            bgColor={action.bgColor}
            onPress={() => {
              action.onPress();
              close(); // on action complete swipe back
            }}
          />
        );
      })}
    </XStack>
  );
};

const SwipeableListItem: React.FC<{
  children: ReactNode;
  rightActions: Action[];
}> = ({ children, rightActions }) => {
  const ref = useRef<Swipeable>(null);

  function close() {
    ref.current?.close();
  }

  return (
    <Swipeable
      containerStyle={{ marginVertical: 8 }}
      ref={ref}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={0}
      rightThreshold={40}
      renderRightActions={(
        progressAnimatedValue: Animated.AnimatedInterpolation<number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<number>
      ) => (
        <RightActions
          close={close}
          dragAnimatedValue={dragAnimatedValue}
          progressAnimatedValue={progressAnimatedValue}
          rightActions={rightActions}
        />
      )}
    >
      {children}
    </Swipeable>
  );
};

export default SwipeableListItem;
