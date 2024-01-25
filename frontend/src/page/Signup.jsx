import React, { useState } from "react";
import "../css/Signup.css";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  background,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Text } from "@chakra-ui/react";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassord] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app");
      data.append("cloud_name", "dwe6diijc");
      fetch("https://api.cloudinary.com/v1_1/dwe6diijc/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://sms2-wn9w.onrender.com/api/user/register",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Signup successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error Ocucured!",
        description: error.response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg">
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
            Sign up
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
          <VStack spacing="5px" color="black" w="100%">
            <FormControl id="first-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Your Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <Button h="1.75rem" size="4.5rem" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="confirme-password" isRequired>
              <FormLabel>Confirme Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  onChange={(e) => setConfirmPassord(e.target.value)}
                />
                <InputRightElement>
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="pic">
              <FormLabel>Upload your Picture</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </FormControl>
            <br></br>

            <Button
              colorScheme="blue"
              width="100%"
              onClick={submitHandler}
              isLoading={loading}
            >
              Sign up
            </Button>
            <Link to={"/login"}>Already have an account? Login</Link>
          </VStack>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
