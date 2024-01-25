import React, { createContext, useContext,useState } from "react";


export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const [fetchAgain,setFetchAgain] = useState(false);
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats,fetchAgain,setFetchAgain,messages,setMessages}}
    >
      {children}
    </ChatContext.Provider>
  );
};

//how to make state  access to other part of apps so we use useContext hook
export const ChatState = () => {
  return useContext(ChatContext);
};

export { ChatProvider };



