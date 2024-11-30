import { useAuth } from "@/hooks/useAuth";
import { Button, Spinner, Text, View } from "tamagui";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Inputs/FormInput";
import { Link, useRouter } from "expo-router";
import useSync from "@/hooks/storage/useSync";

const validationSchema = Yup.object({
  email: Yup.string().email("Provide valid email.").required("Required"),
  password: Yup.string()
    .min(6, "Min 6 character required")
    .required("Required"),
});

export default function SignIn() {
  const auth = useAuth();
  const { replace } = useRouter();
  const { trigger } = useSync();
  return (
    <View
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={"$background"}
      padding={"$5"}
    >
      <Text marginVertical="$10" fontSize={"$8"}>
        Log In
      </Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) =>
          auth.signIn(values.email, values.password).then(() => {
            replace("/(app)");
          })
        }
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
              name="email"
              placeholder="Email"
              isInvalid={!!errors.email && touched.email}
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              errorMessage={errors.email}
            />
            <FormInput
              name="password"
              placeholder="Password"
              isInvalid={!!errors.password && touched.password}
              secureTextEntry={true}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              errorMessage={errors.password}
            />
            <Button
              width={"100%"}
              variant="outlined"
              marginVertical="$10"
              disabled={isSubmitting || !isValid || auth.isLoading}
              onPress={() => handleSubmit()}
              icon={
                isSubmitting || auth.isLoading ? () => <Spinner /> : undefined
              }
            >
              Log In
            </Button>
          </>
        )}
      </Formik>
      <Link href={"/sign-up"}>
        <Text>Create an account</Text>
      </Link>
    </View>
  );
}
