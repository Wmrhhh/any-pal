import { createBrowserRouter } from "react-router-dom";
import ChatPage from '../pages/ChatPage'
import SettingPage from '../pages/SettingPage'
import Theme from "../component/tool/Theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />
  },
  {
    path: "/chat",
    element: <ChatPage />
  },
  {
    path: "/settings",
    element: <SettingPage />,
    children: [
      {
        index: true,
        element: <Theme />
      },
      {
        path: "theme",
        element: <Theme />
      },
    ]
  }
])

export default router