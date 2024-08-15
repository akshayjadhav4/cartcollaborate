import React from "react";
import BottomSheet from "../BottomSheet";
import { H1, Spinner, View } from "tamagui";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../Inputs/FormInput";
import { Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useShoppingList from "@/hooks/storage/useShoppingList";
import * as Burnt from "burnt";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string(),
});

type Props = {
  groupID: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateShoppingList = ({ groupID, open, setOpen }: Props) => {
  const { top } = useSafeAreaInsets();
  const { create } = useShoppingList({});

  return (
    <BottomSheet open={open} setOpen={setOpen}>
      <View flex={1}>
        <H1 mt={top} my="$10">
          Create New Shopping List
        </H1>
        <Formik
          initialValues={{ name: "", description: "" }}
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
