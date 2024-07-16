import React from "react";
import { Paragraph, XStack } from "tamagui";

type Props = {
  number: number;
  text: string;
};

const ParagraphWithNumber = ({ number, text }: Props) => {
  return (
    <XStack>
      <Paragraph>{number}. </Paragraph>
      <Paragraph theme={"alt1"}>{text}</Paragraph>
    </XStack>
  );
};

export default ParagraphWithNumber;
