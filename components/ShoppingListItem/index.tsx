import { getPriorityLabel, getSelectorColor } from "@/constants/ShopItem";
import { Check, Trash } from "@tamagui/lucide-icons";
import React from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View } from "tamagui";
import { Card, Checkbox, Circle, Text, XStack, YStack } from "tamagui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;
const ITEM_HEIGHT = 65;
interface ShoppingListItemProps {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  priority: number;
  purchased: boolean;
  note?: string;
  onTogglePurchased: (isPurchased: boolean) => void;
  deleteHandler: () => void;
}
const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedView = Animated.createAnimatedComponent(View);
const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  id,
  name,
  quantity,
  unit,
  category,
  priority,
  purchased,
  note,
  onTogglePurchased,
  deleteHandler,
}) => {
  const translationX = useSharedValue(0);
  const iconContainerHeight = useSharedValue(ITEM_HEIGHT);
  const iconContainerOpacity = useSharedValue(1);
  const iconContainerVerticalMargin = useSharedValue(8);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translationX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldDelete = event.translationX < TRANSLATE_X_THRESHOLD;
      if (shouldDelete) {
        translationX.value = withTiming(-SCREEN_WIDTH);
        iconContainerHeight.value = withTiming(0);
        iconContainerOpacity.value = withTiming(0);
        iconContainerVerticalMargin.value = withTiming(
          0,
          undefined,
          (isFinished) => {
            if (isFinished && deleteHandler) {
              runOnJS(deleteHandler)();
            }
          }
        );
      } else {
        translationX.value = withTiming(0);
      }
    });

  const cardAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));
  const listItemContainerStyles = useAnimatedStyle(() => ({
    height: iconContainerHeight.value,
    opacity: iconContainerOpacity.value,
    marginVertical: iconContainerVerticalMargin.value,
  }));
  return (
    <AnimatedView style={[listItemContainerStyles]}>
      <AnimatedView
        borderRadius={"$4"}
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
        backgroundColor={"$red10"}
        height={ITEM_HEIGHT}
        width={ITEM_HEIGHT}
      >
        <Trash />
      </AnimatedView>
      <GestureDetector gesture={pan}>
        <AnimatedCard
          p="$3"
          borderRadius={"$4"}
          style={[cardAnimatedStyles]}
          position={"relative"}
        >
          <XStack gap="$4" alignItems="center">
            <Checkbox
              id={id}
              size="$4"
              checked={purchased}
              onCheckedChange={onTogglePurchased}
              backgroundColor={"$black0"}
            >
              <Checkbox.Indicator>
                <Check color={"$green10"} />
              </Checkbox.Indicator>
            </Checkbox>
            <YStack flex={1}>
              <Text
                fontWeight="bold"
                color={purchased ? "$gray10" : "$color"}
                textDecorationLine={purchased ? "line-through" : "none"}
              >
                {name}
              </Text>
              <XStack gap="$2" my="$1">
                <Text color={"$gray10"}>
                  {quantity} {unit} • {category}
                </Text>
              </XStack>
            </YStack>
            <YStack alignItems="flex-end">
              <Circle
                mb="$1"
                size={20}
                backgroundColor={getSelectorColor(priority)}
              />
              <Text color={"$gray10"}>{getPriorityLabel(priority)}</Text>
            </YStack>
          </XStack>
        </AnimatedCard>
      </GestureDetector>
    </AnimatedView>
  );
};

export default ShoppingListItem;
