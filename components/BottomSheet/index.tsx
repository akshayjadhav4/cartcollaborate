import React from "react";
import { Sheet } from "@tamagui/sheet";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const BottomSheet = ({ open, setOpen, children }: Props) => {
  const [position, setPosition] = React.useState(0);
  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={setOpen}
      snapPoints={[80]}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
      moveOnKeyboardChange={true}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Frame padding="$4">{children}</Sheet.Frame>
    </Sheet>
  );
};

export default BottomSheet;
