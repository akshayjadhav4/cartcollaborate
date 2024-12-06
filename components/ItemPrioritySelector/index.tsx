import {
  getPriorityLabel,
  getSelectorColor,
  PRIORITY_LEVELS,
} from "@/constants/ShopItem";
import React, { ChangeEvent } from "react";
import { TouchableOpacity } from "react-native";
import { Circle, Label, Text, View, XStack } from "tamagui";

interface ItemPrioritySelectorProps {
  value: number;
  setValue: any;
}

const ItemPrioritySelector = ({
  value,
  setValue,
}: ItemPrioritySelectorProps) => {
  return (
    <View>
      <Label htmlFor="priority" fontWeight={"bold"}>
        Priority ({getPriorityLabel(value)})
      </Label>
      <XStack gap="$5">
        {Object.values(PRIORITY_LEVELS)
          .filter((value) => typeof value === "number")
          .map((priority) => (
            <TouchableOpacity
              key={priority}
              onPress={() => {
                try {
                  setValue("priority", priority);
                } catch (error) {
                  console.log(typeof priority, error);
                }
              }}
            >
              <Circle
                size={40}
                backgroundColor={
                  priority === value ? getSelectorColor(priority) : "$gray1"
                }
                elevation="$4"
              >
                <Circle
                  size={30}
                  backgroundColor={`${getSelectorColor(priority)}`}
                  elevation="$4"
                />
              </Circle>
            </TouchableOpacity>
          ))}
      </XStack>
    </View>
  );
};

export default ItemPrioritySelector;
