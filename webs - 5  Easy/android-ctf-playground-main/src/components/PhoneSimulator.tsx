import { useState } from "react";
import { Battery, Signal, Wifi } from "lucide-react";
import HomeScreen from "./phone/HomeScreen";
import AppDrawer from "./phone/AppDrawer";
import SettingsApp from "./phone/SettingsApp";
import PlayStoreApp from "./phone/PlayStoreApp";
import ChromeApp from "./phone/ChromeApp";
import WPSTesterApp from "./phone/WPSTesterApp";
import LuckyPatcherApp from "./phone/LuckyPatcherApp";
import FlagApp from "./phone/FlagApp";
import FilesApp from "./phone/FilesApp";

export type AppName = 
  | "home"
  | "drawer"
  | "Play Store"
  | "Settings"
  | "Chrome"
  | "WPS-TESTER"
  | "Lucky Patcher"
  | "Files"
  | "flag";

export interface DeviceState {
  currentScreen: AppName;
  wifiConnected: boolean;
  connectedNetwork: string | null;
  routerPassword: string | null;
  puzzleSolved: boolean;
  flagUnlocked: boolean;
  inventory: string[];
}

const PhoneSimulator = () => {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    currentScreen: "home",
    wifiConnected: false,
    connectedNetwork: null,
    routerPassword: null,
    puzzleSolved: false,
    flagUnlocked: false,
    inventory: [],
  });

  const openApp = (app: AppName) => {
    setDeviceState((prev) => ({ ...prev, currentScreen: app }));
  };

  const goHome = () => {
    setDeviceState((prev) => ({ ...prev, currentScreen: "home" }));
  };

  const updateState = (updates: Partial<DeviceState>) => {
    setDeviceState((prev) => ({ ...prev, ...updates }));
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const renderCurrentScreen = () => {
    switch (deviceState.currentScreen) {
      case "home":
        return <HomeScreen openApp={openApp} deviceState={deviceState} />;
      case "drawer":
        return <AppDrawer openApp={openApp} deviceState={deviceState} />;
      case "Play Store":
        return <PlayStoreApp goHome={goHome} />;
      case "Settings":
        return <SettingsApp goHome={goHome} deviceState={deviceState} updateState={updateState} />;
      case "Chrome":
        return <ChromeApp goHome={goHome} deviceState={deviceState} updateState={updateState} />;
      case "WPS-TESTER":
        return <WPSTesterApp goHome={goHome} deviceState={deviceState} updateState={updateState} />;
      case "Lucky Patcher":
        return <LuckyPatcherApp goHome={goHome} deviceState={deviceState} updateState={updateState} />;
      case "Files":
        return <FilesApp goHome={goHome} deviceState={deviceState} />;
      case "flag":
        return <FlagApp goHome={goHome} />;
      default:
        return <HomeScreen openApp={openApp} deviceState={deviceState} />;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Phone Body */}
      <div className="relative h-[700px] w-[360px] rounded-[3rem] bg-[hsl(var(--phone-body))] p-3 shadow-2xl">
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-[hsl(var(--app-background))]">
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-[hsl(var(--status-bar))] px-4 py-2 text-white">
            <div className="flex items-center gap-2 text-xs">
              <Signal className="h-3 w-3" />
              {deviceState.wifiConnected ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <Wifi className="h-3 w-3 opacity-30" />
              )}
            </div>
            <div className="text-xs font-medium">{getCurrentTime()}</div>
            <div className="flex items-center gap-1 text-xs">
              <Battery className="h-3 w-3" />
              <span>85%</span>
            </div>
          </div>

          {/* App Screen */}
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
            {renderCurrentScreen()}
          </div>

          {/* Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 flex h-10 items-center justify-around bg-[hsl(var(--nav-bar))]">
            <button
              onClick={goHome}
              className="h-1 w-12 rounded-full bg-white/70 transition-all hover:bg-white"
              aria-label="Home"
            />
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="ml-8 hidden max-w-md rounded-xl bg-slate-800 p-6 text-white shadow-xl lg:block">
        <h2 className="mb-4 text-2xl font-bold text-primary">CTF Challenge</h2>
        <div className="space-y-3 text-sm">
          <p className="text-slate-300">
            <strong className="text-primary">Objective:</strong> Capture the flag hidden in this simulated Android device.
          </p>
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="mb-2 font-semibold text-accent">⚠️ Important Notice</p>
            <p className="text-xs text-slate-400">
              This is a <strong>purely simulated</strong> environment for educational purposes. All network scans,
              connections, and exploits are fake game mechanics. No real hacking instructions are provided.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-teal-400">Tips:</p>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Explore all installed apps</li>
              <li>• Check the Files app for clues</li>
              <li>• Connect to Wi-Fi networks</li>
              <li>• Investigate router settings</li>
              <li>• Solve puzzles to progress</li>
            </ul>
          </div>
          <div className="mt-4 border-t border-slate-700 pt-3 text-center">
            <p className="text-xs text-slate-500">Created by @surajshankhpal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSimulator;
