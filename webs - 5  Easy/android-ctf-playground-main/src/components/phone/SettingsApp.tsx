import { useState } from "react";
import { ChevronLeft, Wifi, WifiOff, RefreshCw, Signal } from "lucide-react";
import { DeviceState } from "../PhoneSimulator";
import { Button } from "@/components/ui/button";

interface SettingsAppProps {
  goHome: () => void;
  deviceState: DeviceState;
  updateState: (updates: Partial<DeviceState>) => void;
}

const networks = [
  { ssid: "Cafe_Free_WiFi", strength: 3, security: "Open", bssid: "A4:2B:8C:1D:5E:9F" },
  { ssid: "Office_Guest", strength: 2, security: "WPA2", bssid: "B8:3F:7D:2A:6C:4E" },
  { ssid: "SURAJ_HOME", strength: 4, security: "WPA2", bssid: "D2:9A:4E:7B:1C:8F" },
  { ssid: "ISP-TP-LINK", strength: 1, security: "WPA2", bssid: "C1:5D:9E:3A:7F:2B" },
];

const SettingsApp = ({ goHome, deviceState, updateState }: SettingsAppProps) => {
  const [view, setView] = useState<"main" | "wifi" | "network-details">("main");
  const [scanning, setScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<typeof networks[0] | null>(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 1500);
  };

  const handleNetworkClick = (network: typeof networks[0]) => {
    setSelectedNetwork(network);
    setView("network-details");
  };

  const getSignalBars = (strength: number) => {
    return [...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`h-1 w-0.5 rounded-full ${
          i < strength ? "bg-primary" : "bg-slate-300"
        }`}
        style={{ height: `${(i + 1) * 3}px` }}
      />
    ));
  };

  if (view === "network-details" && selectedNetwork) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b bg-primary p-4 text-white">
          <button onClick={() => setView("wifi")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-medium">{selectedNetwork.ssid}</h1>
        </div>

        <div className="flex-1 space-y-1 p-4">
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium">
                {deviceState.connectedNetwork === selectedNetwork.ssid ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Security</span>
              <span className="text-sm font-medium">{selectedNetwork.security}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">BSSID</span>
              <span className="text-xs font-mono">{selectedNetwork.bssid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Channel</span>
              <span className="text-sm font-medium">{Math.floor(Math.random() * 11) + 1}</span>
            </div>
            {deviceState.connectedNetwork === selectedNetwork.ssid && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <span className="text-xs font-mono">192.168.0.42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gateway</span>
                  <span className="text-xs font-mono">192.168.0.1</span>
                </div>
              </>
            )}
          </div>

          {selectedNetwork.ssid === "SURAJ_HOME" && !deviceState.wifiConnected && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mt-4">
              <p className="text-xs text-amber-800">
                💡 <strong>Hint:</strong> This network requires special access. Try using the WPS-TESTER app to solve
                the connection puzzle.
              </p>
            </div>
          )}

          {deviceState.connectedNetwork === selectedNetwork.ssid && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-4">
              <p className="text-xs text-green-800">
                ✅ <strong>Note:</strong> This is a simulated connection. Original password required in reality.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "wifi") {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b bg-primary p-4 text-white">
          <button onClick={() => setView("main")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-medium">Wi-Fi</h1>
        </div>

        <div className="flex-1 space-y-4 p-4">
          <Button onClick={handleScan} disabled={scanning} className="w-full">
            <RefreshCw className={`mr-2 h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning..." : "Scan Networks"}
          </Button>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground">Available Networks</h3>
            {networks.map((network) => (
              <button
                key={network.ssid}
                onClick={() => handleNetworkClick(network)}
                className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 hover:bg-slate-50 transition-all"
              >
                <Signal className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">
                    {network.ssid}
                    {deviceState.connectedNetwork === network.ssid && (
                      <span className="ml-2 text-xs text-green-600">Connected</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{network.security}</p>
                </div>
                <div className="flex gap-0.5">{getSignalBars(network.strength)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b bg-primary p-4 text-white">
        <button onClick={goHome}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-lg font-medium">Settings</h1>
      </div>

      <div className="flex-1 space-y-1 p-4">
        <button
          onClick={() => setView("wifi")}
          className="flex w-full items-center gap-3 rounded-lg border bg-card p-4 hover:bg-slate-50 transition-all"
        >
          {deviceState.wifiConnected ? (
            <Wifi className="h-5 w-5 text-primary" />
          ) : (
            <WifiOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex-1 text-left">
            <p className="font-medium">Wi-Fi</p>
            <p className="text-xs text-muted-foreground">
              {deviceState.wifiConnected ? deviceState.connectedNetwork : "Not connected"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingsApp;
