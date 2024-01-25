import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/SideDrawer";
import "../css/Chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const { user,setUser } = ChatState();
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/signup");
  }, []);
  


  return (
    <div className="chat_bg">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox/>}
      </Box>
    </div>
  );
};

export default Chat;


