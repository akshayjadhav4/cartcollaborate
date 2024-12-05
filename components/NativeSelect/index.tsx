import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React, { ChangeEvent } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { Adapt, Label, Select, Sheet, XStack, YStack } from "tamagui";

interface NativeSelectProps {
  lable: string;
  value: string;
  setValue: (e: string | ChangeEvent<any>) => void;
  items: { value: string; label: string }[];
  disabled?: boolean;
}

const NativeSelect = ({
  lable,
  value,
  setValue,
  items,
  disabled = false,
  ...props
}: NativeSelectProps) => {
  return (
    <XStack ai="center" gap="$4">
      <Label
        htmlFor={`select-${lable.toLowerCase()}`}
        f={1}
        fontWeight={"bold"}
        miw={80}
      >
        {lable}
      </Label>
      <Select
        value={value}
        onValueChange={setValue}
        disablePreventBodyScroll
        {...props}
      >
        <Select.Trigger width={220} iconAfter={ChevronDown} disabled={disabled}>
          <Select.Value placeholder={`Select ${lable}`} />
        </Select.Trigger>
        <Adapt when="sm" platform="touch">
          <Sheet
            native={true}
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: "spring",
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
          </Select.ScrollUpButton>

          <Select.Viewport minWidth={200}>
            <Select.Group>
              {React.useMemo(
                () =>
                  items?.map((item, i) => {
                    return (
                      <Select.Item
                        index={i}
                        key={item?.label}
                        value={item?.label?.toLowerCase()}
                      >
                        <Select.ItemText>{item?.label}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    );
                  }),
                [items]
              )}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>
    </XStack>
  );
};

export default NativeSelect;
