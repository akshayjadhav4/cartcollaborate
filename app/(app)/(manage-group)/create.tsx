import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Spinner, View } from "tamagui";
import FormInput from "@/components/Inputs/FormInput";
import useGroup from "@/hooks/storage/useGroups";
import { useRouter } from "expo-router";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string(),
});

const CreateGroupPage = () => {
  const { replace } = useRouter();
  const { createGroup } = useGroup();

  return (
    <View flex={1} alignItems="center" justifyContent="center" padding={"$5"}>
      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          createGroup?.(values)
            .then(() => {
              replace("/(app)");
            })
            .catch((error) => {
              console.log("ERROR While Creating Group", error);
            });
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
        }) => (
          <>
            <FormInput
              name="name"
              placeholder="Group Name"
              isInvalid={!!errors.name && touched.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              errorMessage={errors.name}
            />
            <FormInput
              name="description"
              placeholder="Group Name (Optional)"
              isInvalid={!!errors.description && touched.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              value={values.description}
              errorMessage={errors.description}
            />

            <Button
              width={"100%"}
              variant="outlined"
              marginVertical="$10"
              disabled={isSubmitting || !isValid}
              onPress={() => handleSubmit()}
              icon={isSubmitting ? () => <Spinner /> : undefined}
            >
              CREATE
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

export default CreateGroupPage;
