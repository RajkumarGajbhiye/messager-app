import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import routes from "./routes"
import {ChatProvider} from './context/ChatProvider'

const router = createBrowserRouter(routes)
ReactDOM.createRoot(document.getElementById('root')).render(
 
  
    
 <ChatProvider>
 <ChakraProvider>
 <RouterProvider router={router}/>
 </ChakraProvider>
  </ChatProvider>   


)
