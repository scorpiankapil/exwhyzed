import { ChevronLeft, Package } from "lucide-react";

interface PlayStoreAppProps {
  goHome: () => void;
}

const PlayStoreApp = ({ goHome }: PlayStoreAppProps) => {
  const installedApps = [
    { name: "Play Store", size: "12.4 MB" },
    { name: "Settings", size: "8.2 MB" },
    { name: "Chrome", size: "45.1 MB" },
    { name: "WPS-TESTER", size: "3.8 MB" },
    { name: "Lucky Patcher", size: "6.5 MB" },
    { name: "Files", size: "5.1 MB" },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b bg-blue-600 p-4 text-white">
        <button onClick={goHome}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-lg font-medium">Play Store</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">My apps & games</h2>
          <p className="text-sm text-muted-foreground">Installed apps</p>
        </div>

        <div className="space-y-2">
          {installedApps.map((app) => (
            <div
              key={app.name}
              className="flex items-center justify-between rounded-lg border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.size}</p>
                </div>
              </div>
              <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
                Open
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayStoreApp;
