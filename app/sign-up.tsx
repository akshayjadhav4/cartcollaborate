import { useAuth } from "@/hooks/useAuth";
import { Button, Spinner, Text, View } from "tamagui";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Inputs/FormInput";
import { Link } from "expo-router";

const validationSchema = Yup.object({
  displayName: Yup.string().min(2, "Too Short!").required("Required"),
  email: Yup.string().email("Provide valid email.").required("Required"),
  password: Yup.string()
    .min(6, "Min 6 character required")
    .required("Required"),
});

export default function SignUp() {
  const auth = useAuth();

  return (
    <View
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={"$background"}
      padding={"$5"}
    >
      <Text marginVertical="$10" fontSize={"$8"}>
        Create Account
      </Text>
      <Formik
        initialValues={{ displayName: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) =>
          auth.signUp(values.displayName, values.email, values.password)
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
              name="displayName"
              placeholder="Name"
              isInvalid={!!errors.displayName && touched.displayName}
              onChangeText={handleChange("displayName")}
              onBlur={handleBlur("displayName")}
              value={values.displayName}
              errorMessage={errors.displayName}
            />
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
              disabled={isSubmitting || !isValid}
              onPress={() => handleSubmit()}
              icon={isSubmitting ? () => <Spinner /> : undefined}
            >
              Sign In
            </Button>
          </>
        )}
      </Formik>

      <Text>
        Already have an account?{" "}
        <Link href={"/sign-in"}>
          <Text color={"$orange10Light"}>Log In</Text>
        </Link>
      </Text>
    </View>
  );
}
