import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
// import ChatPage from "../pages/ChatPage";
import LoginPage from "../pages/login/LoginPage";
// import SettingPage from "../pages/SettingPage";
import ChatContent from "../pages/chat/ChatContent";
import EmptyChat from "../pages/chat/EmptyChat";
import AccountPage from "../pages/settings/AccountPage";
import ModelPage from "../pages/settings/ModelPage";
import ThemePage from "../pages/settings/ThemePage";
import ChatLayout from "../layouts/ChatLayout";
import SettingLayout from "../layouts/SettingLayout";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/chat" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/chat",
        element: <ChatLayout />,
        children: [
          {
            index: true,
            element: <EmptyChat />,
          },
          {
            path: ":conversationId",
            element: <ChatContent />,
          },
        ],
      },
      {
        path: "/settings",
        element: <SettingLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="theme" replace />,
          },
          {
            path: "theme",
            element: <ThemePage />,
          },
          {
            path: "account",
            element: <AccountPage />,
          },
          {
            path: "model",
            element: <ModelPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
