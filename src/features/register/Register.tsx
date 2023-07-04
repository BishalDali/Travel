import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Button,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../auth/authApiSlice";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: {
    country: string;
    city: string;
    street: string;
    zip: string;
  };
}

const Register: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const toast = useToast();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...rest } = data;
    try {
       const result = await registerUser(rest).unwrap();

      toast({
        title: "Account created.",
        description: result.message,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/login");
    } catch (error : any) {
        const {data} = error as {data: {message: string, errors?: {[key: string]: string}}};
        if(data.message === "Validation error"){
            toast({
                title : data.message,
                description : Object.values(data.errors as {[key: string]: string}).join("\n"),
                status : "error",
                duration : 9000,
                isClosable : true,
                position : "top-right",
            })
        }
        else{
        toast({
            title: "An error occurred.",
            description: data.message,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top-right",
            });
        }
    }
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordMismatch = password !== confirmPassword;

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        maxWidth="500px"
        display={{ base: "block", md: "flex" }}
        flexDirection={{ base: "column-reverse", md: "column" }}
        alignItems="center"
      >
        <Heading as="h1" size="xl" mb={8}>
          Register
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid gap={4}>
            <GridItem colSpan={2}>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl isInvalid={errors.firstName ? true : false}>
                  <FormLabel>
                    First Name
                    {errors.firstName && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </FormLabel>
                  <Input
                    {...register("firstName", {
                      required: true,
                    
                    })}
                    isInvalid={errors.firstName ? true : false}
                  />
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.lastName ? true : false}>
                  <FormLabel>
                    Last Name
                    {errors.lastName && <span style={{ color: "red" }}>*</span>}
                  </FormLabel>
                  <Input
                    {...register("lastName", {
                      required: true
                    })}
                    isInvalid={errors.lastName ? true : false}
                  />
                  <FormErrorMessage>
                    {errors.lastName && errors.lastName.message}
                  </FormErrorMessage>
                </FormControl>
              </Grid>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isInvalid={errors.email ? true : false}>
                <FormLabel>
                  Email
                  {errors.email && <span style={{ color: "red" }}>*</span>}
                </FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: true,
               
                  })}
                  isInvalid={errors.email ? true : false}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl isInvalid={errors.password ? true : false}>
                  <FormLabel>
                    Password
                    {errors.password && <span style={{ color: "red" }}>*</span>}
                  </FormLabel>
                  <Input
                    type="password"
                    {...register("password", { required: true })}
                    isInvalid={errors.password ? true : false}
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    errors.confirmPassword || passwordMismatch ? true : false
                  }
                >
                  <FormLabel>
                    Confirm Password
                    {errors.confirmPassword && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </FormLabel>
                  <Input
                    type="password"
                    {...register("confirmPassword", { required: true })}
                    isInvalid={
                      errors.confirmPassword || passwordMismatch ? true : false
                    }
                  />
                  {passwordMismatch && (
                    <FormErrorMessage>
                      The passwords do not match.
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Grid>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isInvalid={errors.address?.country ? true : false}>
                <FormLabel>
                  Country
                  {errors.address?.country && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </FormLabel>
                <Input
                  {...register("address.country", {
                    required: true,
               
                  })}
                  isInvalid={errors.address?.country ? true : false}
                />
                <FormErrorMessage>
                  {errors.address?.country && "Country is required"}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isInvalid={errors.address?.city ? true : false}>
                <FormLabel>
                  City
                  {errors.address?.city && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </FormLabel>
                <Input
                  {...register("address.city", {
                    required: true,
               
                  })}
                  isInvalid={errors.address?.city ? true : false}
                />
                <FormErrorMessage>
                  {errors.address?.city && "City is required"}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel>Street</FormLabel>
                  <Input {...register("address.street")} />
                </FormControl>
                <FormControl>
                  <FormLabel>Zip Code</FormLabel>
                  <Input {...register("address.zip")} />
                </FormControl>
              </Grid>
            </GridItem>
          </Grid>

          <Button
            mt={8}
            colorScheme="teal"
            type="submit"
            disabled={passwordMismatch}
            isLoading={isLoading}
          >
            Register
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
