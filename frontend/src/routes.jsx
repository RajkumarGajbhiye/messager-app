import Chat from "./page/Chat";
import Login from "./page/Login";
import Signup from "./page/Signup";
const routes = [
  {
    path:"/chat",
    element:<Chat/>
  }, 
  {
    path:"/",
    element:<Signup/>
  }, 
  {
    path:"/login",
    element:<Login/>
  }, 


]

export default routes;