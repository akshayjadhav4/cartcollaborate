import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Card, H4, Spinner, View } from "tamagui";
import FormInput from "@/components/Inputs/FormInput";
import useGroup from "@/hooks/storage/useGroups";
import { useRouter } from "expo-router";
import ParagraphWithNumber from "@/components/ParagraphWithNumber";

const validationSchema = Yup.object({
  code: Yup.string().required("Required"),
});

const JoinGroupPage = () => {
  const { back } = useRouter();
  const { joinGroup } = useGroup();

  return (
    <View flex={1} alignItems="center" padding={"$5"}>
      <View my="$10">
        <Card>
          <Card.Header>
            <H4 mb="$3">Here's how you can get started:</H4>
            <ParagraphWithNumber
              number={1}
              text="Ask for the Code: Reach out to any current member of the group you'd like to join. They'll provide you with the unique Group Code."
            />
            <ParagraphWithNumber
              number={2}
              text={`Enter the Code: Once you have the code, simply enter it in the field below and hit "Join Group."`}
            />
          </Card.Header>
        </Card>
      </View>
      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          joinGroup?.(values)
            .then(() => {
              back();
            })
            .catch((error) => {
              console.log("ERROR While joining Group", error);
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
              placeholder="Group Code"
              isInvalid={!!errors.code && touched.code}
              onChangeText={handleChange("code")}
              onBlur={handleBlur("code")}
              value={values.code}
              errorMessage={errors.code}
            />
            <Button
              width={"100%"}
              variant="outlined"
              marginVertical="$2"
              disabled={isSubmitting || !isValid}
              onPress={() => handleSubmit()}
              icon={isSubmitting ? () => <Spinner /> : undefined}
            >
              Join Group
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

export default JoinGroupPage;
