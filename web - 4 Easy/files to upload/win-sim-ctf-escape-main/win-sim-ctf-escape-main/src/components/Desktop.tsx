import React, { useEffect } from 'react';
import { useDesktop, WindowState } from '@/contexts/DesktopContext';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { DesktopIcon } from './DesktopIcon';
import { CTFModal } from './CTFModal';
import { SystemCrashScreen } from './SystemCrashScreen';
import { BootScreen } from './BootScreen';
import { FileExplorer } from './apps/FileExplorer';
import { WindowsSecurity } from './apps/WindowsSecurity';
import { Paint } from './apps/Paint';
import { Calculator } from './apps/Calculator';
import { Notepad } from './apps/Notepad';
import { Terminal } from './apps/Terminal';
import { vfs, VirtualFile } from '@/lib/virtualFS';
import { toast } from 'sonner';

export const Desktop = () => {
  const {
    windows,
    closeWindow,
    openWindow,
    desktopFiles,
    refreshDesktop,
    showCTFFlag,
    checkCTFCondition,
    systemCrashed,
    reloadSystem,
    realtimeProtection,
    cloudProtection,
    firewallEnabled,
  } = useDesktop();

  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);
  const [isBooting, setIsBooting] = React.useState(true);

  // Fallback: Auto-complete boot after 10 seconds
  React.useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isBooting) {
        console.log('Boot fallback triggered');
        setIsBooting(false);
      }
    }, 10000);
    
    return () => clearTimeout(fallbackTimer);
  }, [isBooting]);

  useEffect(() => {
    refreshDesktop();
  }, [refreshDesktop]);

  const handleBootComplete = () => {
    console.log('Boot completed, showing desktop');
    setIsBooting(false);
  };

  const handleDesktopDoubleClick = (file: VirtualFile) => {
    if (file.type === 'folder') {
      openWindow('explorer', { initialPath: file.path });
    } else if (file.mimeType?.startsWith('text/')) {
      openWindow('notepad', { filePath: file.path, title: file.name });
    } else if (file.mimeType?.startsWith('image/')) {
      openWindow('paint', { filePath: file.path, title: file.name });
    }
  };

  const handleDesktopContextMenu = (e: React.MouseEvent, file: VirtualFile) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDeleteFromDesktop = async (file: VirtualFile) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      await vfs.delete(file.path);
      checkCTFCondition(file.path);
      await refreshDesktop();
      toast.success(`${file.name} deleted`);
    }
    setContextMenu(null);
  };

  const renderApp = (window: WindowState) => {
    switch (window.app) {
      case 'explorer':
        return <FileExplorer initialPath={window.data?.initialPath as string} />;
      case 'security':
        return <WindowsSecurity />;
      case 'paint':
        return <Paint filePath={window.data?.filePath as string} />;
      case 'calculator':
        return <Calculator />;
      case 'notepad':
        return <Notepad filePath={window.data?.filePath as string} />;
      case 'terminal':
        return <Terminal />;
      default:
        return <div>Unknown app</div>;
    }
  };

  // Show boot screen first
  if (isBooting) {
    return (
      <div>
        <BootScreen onBootComplete={handleBootComplete} />
        {/* Development skip button - remove in production */}
        <button
          onClick={() => setIsBooting(false)}
          className="fixed top-4 left-4 z-[10000] bg-red-500 text-white px-3 py-1 rounded text-xs"
        >
          Skip Boot (Dev)
        </button>
      </div>
    );
  }

  console.log('Rendering desktop, isBooting:', isBooting);

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0'
      }}
      onClick={() => setContextMenu(null)}
    >
      {/* Funny Windows Wallpaper Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-90"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23bg)'/%3E%3Ctext x='200' y='120' font-family='Arial, sans-serif' font-size='20' font-weight='bold' text-anchor='middle' fill='white'%3E🪟 Windows 11%3C/text%3E%3Ctext x='200' y='145' font-family='Arial, sans-serif' font-size='12' text-anchor='middle' fill='white' opacity='0.8'%3ENow with 100% more bugs!%3C/text%3E%3Ctext x='200' y='165' font-family='Arial, sans-serif' font-size='10' text-anchor='middle' fill='white' opacity='0.6'%3ECTF Edition%3C/text%3E%3Ctext x='200' y='180' font-family='Arial, sans-serif' font-size='9' text-anchor='middle' fill='white' opacity='0.5'%3EFind the virus!%3C/text%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Author Watermark */}
      <div className="absolute bottom-16 right-4 z-50 text-right">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/30 shadow-lg">
          <div className="text-white/90 text-xs font-medium mb-1">
            Windows 11 activation failed
          </div>
          <div className="text-white/80 text-xs">
            Author - Suraj Shankhpal
          </div>
        </div>
      </div>
      {/* Security Warnings */}
      {(!realtimeProtection || !cloudProtection || !firewallEnabled) && (
        <div className="absolute top-4 right-4 z-40">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <div className="font-semibold">Security Warning</div>
              <div className="text-sm">
                {!realtimeProtection && "Real-time protection is OFF. "}
                {!cloudProtection && "Cloud protection is OFF. "}
                {!firewallEnabled && "Firewall is OFF. "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 pb-16">
        <div className="grid grid-cols-auto-fill gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, 96px)' }}>
          {desktopFiles.map(file => (
            <DesktopIcon
              key={file.path}
              file={file}
              onDoubleClick={() => handleDesktopDoubleClick(file)}
              onContextMenu={(e) => handleDesktopContextMenu(e, file)}
            />
          ))}
        </div>
      </div>

      {/* Windows */}
      {windows.map(window => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          onClose={() => closeWindow(window.id)}
          initialX={window.x}
          initialY={window.y}
          initialWidth={window.width}
          initialHeight={window.height}
          minimized={window.minimized}
          maximized={window.maximized}
          zIndex={window.zIndex}
        >
          {renderApp(window)}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar />

      {/* CTF Flag Modal */}
      <CTFModal isOpen={showCTFFlag} onClose={() => {}} />

      {/* System Crash Screen */}
      {systemCrashed && (
        <SystemCrashScreen onReload={reloadSystem} />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-popover border border-border rounded-lg shadow-elevated py-1 z-50 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors">
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};
