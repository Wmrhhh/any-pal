import { Outlet } from "react-router-dom";
import SettingMenu from "../components/SettingMenu";

export default function SettingLayout() {
  return (
    <div className="flex h-full w-full">
      <SettingMenu />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
