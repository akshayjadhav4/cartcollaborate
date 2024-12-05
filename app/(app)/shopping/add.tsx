import FormInput from "@/components/Inputs/FormInput";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Button,
  Checkbox,
  Label,
  Spacer,
  Spinner,
  Text,
  View,
  XStack,
} from "tamagui";

import NativeSelect from "@/components/NativeSelect";
import {
  CATEGORIES,
  CATEGORY_UNITS,
  itemValidationSchema,
  PRIORITY_LEVELS,
} from "@/constants/ShopItem";
import ItemPrioritySelector from "@/components/ItemPrioritySelector";
import { Formik } from "formik";
import * as Burnt from "burnt";
import useShoppingListItems from "@/hooks/storage/useShoppingListItems";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Check } from "@tamagui/lucide-icons";

const AddItem = () => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { addItem } = useShoppingListItems({});
  const router = useRouter();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Stack.Screen
        options={{
          title: "Add Item",
          headerBackTitleVisible: false,
        }}
      />
      <Formik
        initialValues={{
          name: "",
          category: "",
          note: "",
          priority: PRIORITY_LEVELS.Low,
          quantity: 1,
          unit: "",
          purchased: false,
        }}
        validationSchema={itemValidationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (listId) {
              await addItem?.({ listId: listId, ...values });
              Burnt.toast({
                title: "Successfully added item to list.",
                preset: "done",
                haptic: "success",
                duration: 2,
                from: "top",
                shouldDismissByDrag: true,
              });
              router.back();
            }
          } catch (error) {
            Burnt.toast({
              title: "Couldn't add the item to shopping list",
              preset: "error",
              haptic: "error",
              duration: 2,
              from: "top",
            });
          } finally {
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
          setFieldValue,
        }) => (
          <>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
              }}
            >
              <Label htmlFor="name" fontWeight={"bold"}>
                Item Name
              </Label>
              <FormInput
                name="name"
                placeholder="e.g., apple, milk, ..."
                isInvalid={!!errors.name && touched.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                errorMessage={errors.name}
              />

              <NativeSelect
                lable="Category"
                value={values.category}
                setValue={handleChange("category")}
                items={CATEGORIES.map((category) => ({
                  value: category,
                  label: category.charAt(0).toUpperCase() + category.slice(1),
                }))}
              />
              {!isValid && errors?.category ? (
                <Text color={"$red10Light"}>{errors?.category}</Text>
              ) : null}
              <Spacer />

              <NativeSelect
                lable="Unit"
                value={values.unit}
                setValue={handleChange("unit")}
                items={CATEGORY_UNITS[
                  values.category as keyof typeof CATEGORY_UNITS
                ]?.map((unit) => ({
                  value: unit,
                  label: unit.charAt(0).toUpperCase() + unit.slice(1),
                }))}
                disabled={!values.category}
              />
              {!isValid && errors?.unit ? (
                <Text color={"$red10Light"}>{errors?.unit}</Text>
              ) : null}
              <Spacer />
              <Label htmlFor="quantity" fontWeight={"bold"}>
                Quantity
              </Label>
              <FormInput
                name="quantity"
                placeholder={`Enter quantity in ${values?.unit}`}
                isInvalid={!!errors.quantity && touched.quantity}
                onChangeText={handleChange("quantity")}
                onBlur={handleBlur("quantity")}
                value={`${values.quantity}`}
                errorMessage={errors.quantity}
              />
              <Spacer />
              <ItemPrioritySelector
                value={values.priority}
                setValue={setFieldValue}
              />
              <Spacer />
              <Label htmlFor="notes" fontWeight={"bold"}>
                Note (Optional)
              </Label>
              <FormInput
                name="note"
                isInvalid={!!errors.note && touched.note}
                onChangeText={handleChange("note")}
                onBlur={handleBlur("note")}
                value={`${values.note}`}
                errorMessage={errors.note}
                numberOfLines={4}
              />
              <XStack width={300} alignItems="center" gap="$4">
                <Label htmlFor="isPurchased" size="$4" fontWeight={"bold"}>
                  Already Purchased
                </Label>
                <Checkbox
                  id={"isPurchased"}
                  size="$4"
                  checked={values.purchased}
                  onCheckedChange={(isPurchased) => {
                    setFieldValue("purchased", isPurchased);
                  }}
                >
                  <Checkbox.Indicator>
                    <Check />
                  </Checkbox.Indicator>
                </Checkbox>
              </XStack>
              <Spacer />
            </ScrollView>
            <View mx="$5" mt="$5" mb="$10">
              <Button
                variant="outlined"
                disabled={isSubmitting || !isValid}
                onPress={() => handleSubmit()}
                icon={isSubmitting ? () => <Spinner /> : undefined}
              >
                Add
              </Button>
            </View>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default AddItem;
