import React, { useState } from "react";
import "../css/Login.css";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      
      toast({
        title: "Please Fill all the Fields",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://sms2-wn9w.onrender.com/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "err",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className="login_bg">
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="4xl" fontFamily="Work sans" color="black">
            Login
          </Text>
        </Box>
        <Box
          bg="white"
          w="100%"
          p={4}
          borderRadius="lg"
          color="black"
          borderWidth="1px"
          display="flex"
          justifyContent="center"
        >
          <VStack spacing="5px" w="100%" color="black">
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <Button h="1.75rem" size="4.5rem" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <br></br>

            <Button
              colorScheme="blue"
              width="100%"
              onClick={submitHandler}
              isLoading={loading}
            >
              Login
            </Button>

            <Button
              varient="solid"
              colorScheme="red"
              width="100%"
              onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
              }}
            >
              Get Guest User Credentials
            </Button>
            <Link to={"/"}>Nead an account Sign Up</Link>
          </VStack>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
