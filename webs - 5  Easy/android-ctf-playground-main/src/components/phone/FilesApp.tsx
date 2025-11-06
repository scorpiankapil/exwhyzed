import { useState } from "react";
import { ChevronLeft, FileText, FolderOpen } from "lucide-react";
import { DeviceState } from "../PhoneSimulator";

interface FilesAppProps {
  goHome: () => void;
  deviceState: DeviceState;
}

const FilesApp = ({ goHome }: FilesAppProps) => {
  const [currentFolder, setCurrentFolder] = useState<"root" | "notes">("root");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const files = {
    root: [
      { name: "Downloads", type: "folder" as const, id: "downloads" },
      { name: "Notes", type: "folder" as const, id: "notes" },
      { name: "Pictures", type: "folder" as const, id: "pictures" },
    ],
    notes: [
      { name: "about_device.txt", type: "file" as const, id: "about" },
      { name: "router_hints.txt", type: "file" as const, id: "router" },
    ],
  };

  const fileContents: Record<string, { title: string; content: string }> = {
    about: {
      title: "about_device.txt",
      content: `Device Information
==================

Model: Generic Android Phone
Manufacturer: SURAJ Mobile
Android Version: 5.1 (Lollipop)
Build: LMY48G

---

This device was configured by the author.
Owner tag: author@suraj

For support, contact the manufacturer.`,
    },
    router: {
      title: "router_hints.txt",
      content: `Router Configuration Notes
==========================

Default Credentials:
- Username: admin
- Password: admin

Network Details:
- SSID: SURAJ_HOME
- Router IP: 192.168.0.1
- Security: WPA2-PSK

---

Note: Password reveal requires owner verification.
The unlock key is the owner tag from device info.`,
    },
  };

  if (selectedFile && fileContents[selectedFile]) {
    const file = fileContents[selectedFile];
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b bg-amber-500 p-4 text-white">
          <button onClick={() => setSelectedFile(null)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-medium">{file.title}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
            {file.content}
          </pre>
        </div>
      </div>
    );
  }

  const currentFiles = currentFolder === "root" ? files.root : files.notes;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b bg-amber-500 p-4 text-white">
        {currentFolder !== "root" && (
          <button onClick={() => setCurrentFolder("root")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {currentFolder === "root" && (
          <button onClick={goHome}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="flex-1 text-lg font-medium">
          {currentFolder === "root" ? "Files" : "Notes"}
        </h1>
      </div>

      <div className="flex-1 space-y-2 p-4">
        {currentFiles.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.type === "folder") {
                if (item.id === "notes") setCurrentFolder("notes");
              } else {
                setSelectedFile(item.id);
              }
            }}
            className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 hover:bg-slate-50 transition-all"
          >
            {item.type === "folder" ? (
              <FolderOpen className="h-5 w-5 text-amber-500" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
            <span className="flex-1 text-left font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilesApp;
