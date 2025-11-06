import { useState } from "react";
import { ChevronLeft, Package, Shield, CheckCircle } from "lucide-react";
import { DeviceState } from "../PhoneSimulator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LuckyPatcherAppProps {
  goHome: () => void;
  deviceState: DeviceState;
  updateState: (updates: Partial<DeviceState>) => void;
}

const LuckyPatcherApp = ({ goHome, deviceState, updateState }: LuckyPatcherAppProps) => {
  const [view, setView] = useState<"main" | "apps" | "system">("main");

  const apps = [
    { name: "Play Store", version: "5.1.0", patched: false },
    { name: "Chrome", version: "45.0", patched: false },
    { name: "Settings", version: "5.1.0", patched: false },
  ];

  const systemApps = [
    { name: "System UI", version: "5.1.0", protected: true },
    { name: "Package Manager", version: "5.1.0", protected: true },
    { name: "flag", version: "1.0.0", protected: true, hidden: !deviceState.flagUnlocked },
  ];

  const canUnlockFlag = 
    deviceState.wifiConnected &&
    deviceState.routerPassword !== null &&
    deviceState.inventory.includes("ROUTER_PASSWORD");

  const handleApplyPatch = () => {
    if (!canUnlockFlag) {
      toast.error("Requirements not met. Connect to Wi-Fi and obtain router password first.");
      return;
    }

    toast.success("Challenge Patch applied successfully!");
    updateState({ flagUnlocked: true });
    setTimeout(() => {
      toast.info("🎯 Secret app 'flag' is now visible in the app list!");
    }, 1000);
  };

  if (view === "system") {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b bg-purple-700 p-4 text-white">
          <button onClick={() => setView("main")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-medium">System Apps</h1>
        </div>

        <div className="flex-1 space-y-2 p-4">
          {systemApps.filter(app => !app.hidden).map((app) => (
            <div
              key={app.name}
              className="rounded-lg border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-slate-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{app.name}</p>
                  <p className="text-xs text-muted-foreground">v{app.version}</p>
                </div>
                {app.protected && (
                  <Shield className="h-4 w-4 text-amber-500" />
                )}
                {app.name === "flag" && deviceState.flagUnlocked && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          ))}

          {deviceState.flagUnlocked && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-4">
              <p className="text-sm text-green-800">
                ✅ <strong>Success!</strong> The 'flag' app is now unlocked. Open it from the App Drawer!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "apps") {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b bg-purple-700 p-4 text-white">
          <button onClick={() => setView("main")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-medium">Installed Apps</h1>
        </div>

        <div className="flex-1 space-y-2 p-4">
          {apps.map((app) => (
            <div
              key={app.name}
              className="rounded-lg border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{app.name}</p>
                  <p className="text-xs text-muted-foreground">v{app.version}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b bg-purple-700 p-4 text-white">
        <button onClick={goHome}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-lg font-medium">Lucky Patcher (simulated)</h1>
      </div>

      <div className="flex-1 space-y-4 p-4">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-800">
            <strong>Challenge Manager:</strong> This app helps you unlock hidden features through in-game puzzles. No real app modification occurs.
          </p>
        </div>

        <div className="space-y-2">
          <Button onClick={() => setView("apps")} variant="outline" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" />
            View Installed Apps
          </Button>

          <Button onClick={() => setView("system")} variant="outline" className="w-full justify-start">
            <Shield className="mr-2 h-4 w-4" />
            View System Apps
          </Button>

          <div className="rounded-lg border bg-card p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Challenge Patch</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Apply this patch to unlock the hidden flag app. Requires completing all prerequisites.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                {deviceState.wifiConnected ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
                <span className={deviceState.wifiConnected ? "text-green-700" : "text-muted-foreground"}>
                  Connect to Wi-Fi network
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {deviceState.routerPassword ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
                <span className={deviceState.routerPassword ? "text-green-700" : "text-muted-foreground"}>
                  Obtain router password
                </span>
              </div>
            </div>

            <Button
              onClick={handleApplyPatch}
              disabled={!canUnlockFlag || deviceState.flagUnlocked}
              className="w-full"
            >
              {deviceState.flagUnlocked ? "Patch Applied ✓" : "Apply Challenge Patch"}
            </Button>
          </div>
        </div>

        {!canUnlockFlag && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-800">
              💡 <strong>Hint:</strong> Complete the Wi-Fi puzzle and discover the router password through Chrome to unlock the flag app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyPatcherApp;
