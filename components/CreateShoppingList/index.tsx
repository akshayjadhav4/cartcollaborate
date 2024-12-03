import React, { useState } from "react";
import BottomSheet from "../BottomSheet";
import { H1, Spinner, View } from "tamagui";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../Inputs/FormInput";
import { Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useShoppingList from "@/hooks/storage/useShoppingList";
import * as Burnt from "burnt";
import DatePicker from "react-native-date-picker";
import { TouchableOpacity } from "react-native";
import { Text } from "tamagui";
import { format } from "date-fns";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  dueDate: Yup.date().nullable(),
});

type Props = {
  groupID: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateShoppingList = ({ groupID, open, setOpen }: Props) => {
  const { top } = useSafeAreaInsets();
  const { create } = useShoppingList({});
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  return (
    <BottomSheet open={open} setOpen={setOpen}>
      <View flex={1}>
        <H1 mt={top} my="$10">
          Create New Shopping List
        </H1>
        <Formik
          initialValues={{ name: "", description: "", dueDate: null }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await create?.({ groupID: groupID, ...values });
              Burnt.toast({
                title: "Shopping list created successfully!",
                preset: "done",
                haptic: "success",
                duration: 2,
                from: "top",
                shouldDismissByDrag: true,
              });
            } catch (error) {
              console.log("🚀 ~ onSubmit={ ~ error:", error);
              Burnt.toast({
                title:
                  "Oops! Couldn't create the shopping list. Please try again.",
                preset: "error",
                haptic: "error",
                duration: 2,
                from: "top",
              });
            } finally {
              setOpen(false);
              resetForm();
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            isValid,
            resetForm,
            setFieldValue,
          }) => (
            <>
              <FormInput
                name="name"
                placeholder="Enter list name..."
                isInvalid={!!errors.name && touched.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                errorMessage={errors.name}
              />
              <FormInput
                name="description"
                placeholder="Enter description (optional)..."
                isInvalid={!!errors.description && touched.description}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                errorMessage={errors.description}
              />
              <TouchableOpacity onPress={() => setOpenDateTimePicker(true)}>
                <Text
                  mb="$5"
                  color={"$orange10Dark"}
                  fontSize={"$5"}
                  fontWeight={"bold"}
                >
                  Add a deadline to stay on track.
                </Text>
              </TouchableOpacity>
              {values.dueDate ? (
                <FormInput
                  name="dueDate"
                  placeholder="Deadline"
                  isInvalid={false}
                  value={format(values.dueDate, "do MMM y, h:mm a")}
                  errorMessage=""
                  editable={false}
                />
              ) : null}
              <DatePicker
                minimumDate={new Date()}
                date={values.dueDate || new Date()}
                open={openDateTimePicker}
                onDateChange={(date) => {
                  setFieldValue("dueDate", date);
                }}
                modal
                onCancel={() => {
                  setFieldValue("dueDate", null);
                  setOpenDateTimePicker(false);
                }}
                onConfirm={(date) => {
                  setFieldValue("dueDate", date);
                  setOpenDateTimePicker(false);
                }}
              />
              <Button
                width={"100%"}
                variant="outlined"
                marginVertical="$2"
                disabled={isSubmitting || !isValid}
                onPress={() => handleSubmit()}
                icon={isSubmitting ? () => <Spinner /> : undefined}
              >
                Create List
              </Button>
              <Button
                width={"100%"}
                color={"$red10"}
                marginVertical="$2"
                onPress={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Formik>
      </View>
    </BottomSheet>
  );
};

export default CreateShoppingList;
