
import { Outlet } from "react-router-dom";
import ToolList from "../components/ToolList";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-chat-bg text-chat-text">
      <ToolList />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}