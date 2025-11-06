import { useState } from "react";
import { ChevronLeft, Lock, Eye, EyeOff } from "lucide-react";
import { DeviceState } from "../PhoneSimulator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChromeAppProps {
  goHome: () => void;
  deviceState: DeviceState;
  updateState: (updates: Partial<DeviceState>) => void;
}

const ChromeApp = ({ goHome, deviceState, updateState }: ChromeAppProps) => {
  const [url, setUrl] = useState("");
  const [currentPage, setCurrentPage] = useState<"search" | "router">("search");
  const [routerLoggedIn, setRouterLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [unlockKey, setUnlockKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRevealed, setPasswordRevealed] = useState(false);

  const handleNavigate = () => {
    if (url === "192.168.0.1" || url === "http://192.168.0.1") {
      if (!deviceState.wifiConnected) {
        toast.error("Not connected to network. Connect via Wi-Fi first.");
        return;
      }
      setCurrentPage("router");
      setRouterLoggedIn(false);
    } else {
      toast.info("Simulated browser - only router IP works");
    }
  };

  const handleRouterLogin = () => {
    if (username === "admin" && password === "admin") {
      setRouterLoggedIn(true);
      toast.success("Router login successful");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleUnlockPassword = () => {
    if (unlockKey.toLowerCase().trim() === "author@suraj") {
      setPasswordRevealed(true);
      updateState({
        routerPassword: "SURAJ_HOME_PASS_2025",
        inventory: [...deviceState.inventory, "ROUTER_PASSWORD"],
      });
      toast.success("Password revealed!");
    } else {
      toast.error("Incorrect unlock key. Check Files app for hints.");
    }
  };

  if (currentPage === "router") {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b p-3">
          <button onClick={() => setCurrentPage("search")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <Lock className="h-3 w-3 text-green-600" />
            <span className="flex-1 text-xs">http://192.168.0.1</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!routerLoggedIn ? (
            <div className="mx-auto max-w-sm space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold">Router Admin Panel</h2>
                <p className="text-xs text-muted-foreground mt-1">TP-LINK Wireless Router (simulated)</p>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin"
                  />
                </div>
                <Button onClick={handleRouterLogin} className="w-full">
                  Login
                </Button>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs text-amber-800">
                  💡 <strong>Hint:</strong> Try common default router credentials
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold mb-3">Wireless Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SSID:</span>
                    <span className="font-medium">SURAJ_HOME</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Security:</span>
                    <span className="font-medium">WPA2-PSK</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Password:</span>
                      {!passwordRevealed && (
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-primary hover:underline"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    {passwordRevealed ? (
                      <div className="rounded bg-green-50 border border-green-200 p-2">
                        <p className="font-mono text-sm text-green-800">SURAJ_HOME_PASS_2025</p>
                        <p className="text-xs text-green-600 mt-1">
                          ✅ This is the simulated SSID password for the CTF
                        </p>
                      </div>
                    ) : (
                      <div className="rounded bg-slate-100 border p-2">
                        <p className="font-mono text-sm">••••••••••••••••</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!passwordRevealed && (
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Owner Verification Puzzle</h4>
                  <p className="text-xs text-muted-foreground">
                    Enter the unlock key to reveal the password
                  </p>
                  <Input
                    value={unlockKey}
                    onChange={(e) => setUnlockKey(e.target.value)}
                    placeholder="Enter unlock key"
                  />
                  <Button onClick={handleUnlockPassword} className="w-full" size="sm">
                    Unlock Password
                  </Button>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Hint:</strong> The unlock key can be found in a note file. Check the Files app for clues about the "author tag".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b p-3">
        <button onClick={goHome}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
          placeholder="Search or enter address"
          className="flex-1"
        />
        <Button size="sm" onClick={handleNavigate}>
          Go
        </Button>
      </div>

      <div className="flex-1 p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Chrome</h2>
        <p className="text-sm text-muted-foreground mb-4">Simulated browser</p>
        
        {deviceState.wifiConnected && (
          <div className="mx-auto max-w-xs space-y-3">
            <div className="rounded-lg bg-teal-50 border border-teal-200 p-3">
              <p className="text-sm text-teal-800">
                <strong>Connected to network!</strong>
              </p>
              <p className="text-xs text-teal-600 mt-1">
                Try navigating to the router admin page
              </p>
            </div>
            <Button onClick={() => { setUrl("192.168.0.1"); handleNavigate(); }} className="w-full">
              Go to Router (192.168.0.1)
            </Button>
          </div>
        )}
        
        {!deviceState.wifiConnected && (
          <div className="mx-auto max-w-xs rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800">
              Not connected to Wi-Fi. Connect to a network first in Settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChromeApp;
