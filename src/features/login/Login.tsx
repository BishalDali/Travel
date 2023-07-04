import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useLoginMutation } from "../auth/authApiSlice";
import { useAppDispatch } from "../app/store";
import { setAuth } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>();

    const [loginUser, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async (data: LoginFormData) => {
        try{
            const result = await loginUser(data).unwrap();
            if (result) {
                dispatch(
                    setAuth({
                        isAuthenticated: true,
                        user: result.data,
                    })
                )
                toast({
                    title: result.message,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                    position: "top-right",
                });   
                console.log(result.data)
                
                localStorage.setItem("user", JSON.stringify(result.data));
                localStorage.setItem("id", result.data._id)
                navigate("/");
            }
        } catch (error: any) {
            const { data} = error as {data: {message: string}}
            toast({
                title: "Login failed",
                description: data?.message,
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "top-right",
            });

        }
    }


  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to book the <Link color={"blue.400"}>trips</Link>
          </Text>
        </Stack>
        <Box
          as="form"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
            onSubmit={handleSubmit(handleLogin)}
        >
          <Stack spacing={4}>
            <FormControl isInvalid={errors.email ? true : false}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                {...register("email", {
                  required: true,
                })}
              />
              {errors.email && (
                <span style={{ color: "red" }}>This field is required</span>
              )}
            </FormControl>
            <FormControl isInvalid={errors.password ? true : false}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: true,
                })}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                isLoading = {isLoading}
                type="submit"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
