import { AppWindow, Settings, ShoppingBag, Chrome, Wifi, FolderOpen, Calculator, Camera, Clock } from "lucide-react";
import { AppName, DeviceState } from "../PhoneSimulator";

interface HomeScreenProps {
  openApp: (app: AppName) => void;
  deviceState: DeviceState;
}

const HomeScreen = ({ openApp, deviceState }: HomeScreenProps) => {
  const apps = [
    { name: "Play Store", icon: ShoppingBag, color: "text-blue-500" },
    { name: "Settings", icon: Settings, color: "text-slate-600" },
    { name: "Chrome", icon: Chrome, color: "text-red-500" },
    { name: "Files", icon: FolderOpen, color: "text-amber-500" },
    { name: "WPS-TESTER", icon: Wifi, color: "text-teal-500" },
    { name: "Lucky Patcher", icon: AppWindow, color: "text-purple-500" },
    { name: "Calculator", icon: Calculator, color: "text-slate-500" },
    { name: "Camera", icon: Camera, color: "text-slate-500" },
    { name: "Clock", icon: Clock, color: "text-slate-500" },
  ];

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 text-center">
        <h1 className="text-sm font-medium text-muted-foreground">Android 5.1 Lollipop</h1>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-6 content-start">
        {apps.map((app) => {
          const Icon = app.icon;
          const isClickable = ["Play Store", "Settings", "Chrome", "Files", "WPS-TESTER", "Lucky Patcher"].includes(app.name);
          
          return (
            <button
              key={app.name}
              onClick={() => isClickable && openApp(app.name as AppName)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                isClickable
                  ? "hover:bg-white/50 active:scale-95"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <div className={`rounded-full bg-white p-4 shadow-md ${app.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-foreground">{app.name}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => openApp("drawer")}
        className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-slate-600" />
          ))}
        </div>
      </button>

      {deviceState.wifiConnected && (
        <div className="mt-4 rounded-lg bg-teal-50 border border-teal-200 p-3 text-xs text-teal-800">
          <p className="font-semibold">Connected to: {deviceState.connectedNetwork}</p>
          <p className="text-teal-600 mt-1">IP: 192.168.0.42 (simulated)</p>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
