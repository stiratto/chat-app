import { createBrowserRouter } from "react-router";
import Layout from "./layout/Layout";
import App from "./App";
import Chat from "./components/Chat";

export const router = createBrowserRouter([
   {
      element: <Layout />,
      children: [
         {
            path: '/',
            element: <App/>
         },
         {
            path: '/chat/:id',
            element: <Chat/>
         }
      ]
   }
])
