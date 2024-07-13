import React from "react";

import { Input, Text, YStack } from "tamagui";
import { TextInputProps } from "react-native";

type Props = {
  name: string;
  isInvalid: boolean | undefined;
  errorMessage: string | undefined;
} & TextInputProps;

const FormInput = ({ name, isInvalid, errorMessage, ...props }: Props) => {
  return (
    <YStack width={"100%"} marginBottom="$5">
      <Input
        width={"100%"}
        marginBottom="$2"
        borderRadius={"$2"}
        borderColor={isInvalid ? "$red10Light" : "unset"}
        focusStyle={{ borderColor: isInvalid ? "$red10Light" : "unset" }}
        {...props}
      />

      {isInvalid ? <Text color={"$red10Light"}>{errorMessage}</Text> : null}
    </YStack>
  );
};

export default FormInput;
