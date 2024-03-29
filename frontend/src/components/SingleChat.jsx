import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Text, Box, IconButton, Spinner, FormControl, Input, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import "../css/SingleChat.css"
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
// import animationData from "../animations/typing.json";

const ENDPOINT = "https://sms2-wn9w.onrender.com/"; 
let socket,selectedChatCompare;

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain,messages, setMessages} =
    ChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };


  const fetchMessages = async () => {
    if (!selectedChat) return; //if chat is not selected so return means don't do anything

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://sms2-wn9w.onrender.com/api/message/fatchsingleChat/${selectedChat._id}`,
        config
      );

      console.log(messages)
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id); //to send a message to all the connected clients. This code will notify when a user connects to the server. socket.
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };



const sendMessage=async(event)=>{
  if (event.key === "Enter" && newMessage) {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
     
     setNewMessage("");
      const { data } = await axios.post(
        "https://sms2-wn9w.onrender.com/api/message/createNewMessage",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
     
      console.log(data);
      socket.emit('newMessage',data)
      setMessages([...messages,data])
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
}

const typingHandler=(e)=>{
  setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
}

useEffect(()=>{
 socket = io(ENDPOINT);
 socket.emit("setup",user);
 socket.on('connected',()=>setSocketConnected(true));
 socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
},[])

useEffect(()=>{
  fetchMessages();
  selectedChatCompare = selectedChat;
    },[selectedChat])
  
    useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
          if (!notification.includes(newMessageRecieved)) {
            // setNotification([newMessageRecieved, ...notification]);
            // setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });

  return (
    
    <>
    
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel fetchMessages={fetchMessages}/>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? <Spinner  size="xl"
                w={20}
                h={20}
                alignItems="center"
                margin="auto"/> :(
                  <div className="messages">
                  <ScrollableChat />
                </div>
                )}

                <FormControl
                 onKeyDown={sendMessage}
                 id="first-name"
                 isRequired
                 mt={3}
                
                >
                  {istyping ? <div>Typing...</div>:(<></>)}
 <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
                </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
