import { AppWindow, Settings, ShoppingBag, Chrome, Wifi, FolderOpen, Calculator, Camera, Clock, Info, Search } from "lucide-react";
import { AppName, DeviceState } from "../PhoneSimulator";

interface AppDrawerProps {
  openApp: (app: AppName) => void;
  deviceState: DeviceState;
}

const AppDrawer = ({ openApp, deviceState }: AppDrawerProps) => {
  const apps = [
    { name: "Play Store", icon: ShoppingBag, color: "text-blue-500", clickable: true },
    { name: "Settings", icon: Settings, color: "text-slate-600", clickable: true },
    { name: "About phone", icon: Info, color: "text-slate-500", clickable: false },
    { name: "Chrome", icon: Chrome, color: "text-red-500", clickable: true },
    { name: "WPS-TESTER", icon: Wifi, color: "text-teal-500", clickable: true },
    { name: "Lucky Patcher", icon: AppWindow, color: "text-purple-500", clickable: true },
    { name: "Files", icon: FolderOpen, color: "text-amber-500", clickable: true },
    { name: "Calculator", icon: Calculator, color: "text-slate-500", clickable: false },
    { name: "Camera", icon: Camera, color: "text-slate-500", clickable: false },
    { name: "Clock", icon: Clock, color: "text-slate-500", clickable: false },
  ];

  // Add flag app if unlocked
  if (deviceState.flagUnlocked) {
    apps.push({
      name: "flag",
      icon: AppWindow,
      color: "text-green-500",
      clickable: true,
    });
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Search Bar */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search apps"
            className="flex-1 bg-transparent text-sm outline-none"
            readOnly
          />
        </div>
      </div>

      {/* App List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">All Apps</h2>
        <div className="space-y-2">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.name}
                onClick={() => app.clickable && openApp(app.name as AppName)}
                disabled={!app.clickable}
                className={`flex w-full items-center gap-4 rounded-lg p-3 transition-all ${
                  app.clickable
                    ? "hover:bg-slate-50 active:bg-slate-100"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <div className={`rounded-full bg-slate-50 p-3 ${app.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-foreground">{app.name}</p>
                  {app.name === "flag" && (
                    <p className="text-xs text-green-600">🎯 Flag unlocked!</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => openApp("home")}
        className="border-t p-4 text-center text-sm font-medium text-primary hover:bg-slate-50"
      >
        Close Drawer
      </button>
    </div>
  );
};

export default AppDrawer;
