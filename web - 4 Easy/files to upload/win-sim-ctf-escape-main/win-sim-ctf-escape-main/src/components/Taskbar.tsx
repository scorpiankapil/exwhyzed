import React from 'react';
import { Search, Folder, Shield, Palette, Calculator, FileText, Terminal } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';
import { cn } from '@/lib/utils';

export const Taskbar = () => {
  const { windows, openWindow, focusWindow, minimizeWindow } = useDesktop();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const taskbarApps = [
    { id: 'explorer', icon: Folder, label: 'File Explorer', app: 'explorer' as const },
    { id: 'security', icon: Shield, label: 'Windows Security', app: 'security' as const },
    { id: 'paint', icon: Palette, label: 'Paint', app: 'paint' as const },
    { id: 'calculator', icon: Calculator, label: 'Calculator', app: 'calculator' as const },
    { id: 'terminal', icon: Terminal, label: 'Terminal', app: 'terminal' as const },
  ];

  const handleAppClick = (app: typeof taskbarApps[0]) => {
    const existingWindow = windows.find(w => w.app === app.app && !w.minimized);
    if (existingWindow) {
      focusWindow(existingWindow.id);
    } else {
      const minimizedWindow = windows.find(w => w.app === app.app && w.minimized);
      if (minimizedWindow) {
        minimizeWindow(minimizedWindow.id);
        focusWindow(minimizedWindow.id);
      } else {
        openWindow(app.app);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-800/95 backdrop-blur-xl shadow-2xl border-t border-gray-700/50 z-50 flex items-center justify-between px-2">
      {/* Start Button */}
      <button className="h-10 px-3 hover:bg-gray-700/50 rounded transition-colors flex items-center gap-2 text-white">
        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
        </div>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md mx-2">
        <div className="h-8 bg-gray-700/50 rounded flex items-center px-3 gap-2 border border-gray-600/30">
          <Search className="w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Type here to search"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* App Icons */}
      <div className="flex items-center gap-1">
        {taskbarApps.map(app => {
          const isOpen = windows.some(w => w.app === app.app);
          const Icon = app.icon;
          
          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded transition-colors relative text-gray-300",
                "hover:bg-gray-700/50 hover:text-white",
                isOpen && "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-400 after:rounded-full text-white"
              )}
              title={app.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 text-sm text-white">
        <div className="text-white">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-gray-300 text-xs">
          {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};
