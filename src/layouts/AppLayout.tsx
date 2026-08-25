
import { Outlet } from "react-router-dom";
import ToolList from "../components/ToolList";

export default function AppLayout() {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <ToolList />
      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}