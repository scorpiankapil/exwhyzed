import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vfs, VirtualFile } from '@/lib/virtualFS';
import { CTF_CONFIG } from '@/lib/ctfConfig';

export interface WindowState {
  id: string;
  app: 'explorer' | 'security' | 'paint' | 'calculator' | 'notepad' | 'terminal';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  data?: Record<string, unknown>; // App-specific data (e.g., file path for notepad, current folder for explorer)
}

export interface QuarantinedItem {
  id: string;
  fileName: string;
  originalPath: string;
  detectionReason: string;
  threatLevel: string;
  quarantinedAt: number;
}

interface DesktopContextType {
  windows: WindowState[];
  openWindow: (app: WindowState['app'], data?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowState>) => void;
  
  // Security settings
  realtimeProtection: boolean;
  cloudProtection: boolean;
  firewallEnabled: boolean;
  setRealtimeProtection: (enabled: boolean) => void;
  setCloudProtection: (enabled: boolean) => void;
  setFirewallEnabled: (enabled: boolean) => void;
  
  // Quarantine
  quarantinedItems: QuarantinedItem[];
  restoreFromQuarantine: (id: string) => void;
  deleteFromQuarantine: (id: string) => void;
  
  // CTF
  showCTFFlag: boolean;
  checkCTFCondition: (deletedFilePath: string) => void;
  checkCTFConditionTerminal: (deletedFilePath: string) => string | null;
  
  // System crash
  systemCrashed: boolean;
  triggerSystemCrash: () => void;
  reloadSystem: () => void;
  
  // Desktop files
  desktopFiles: VirtualFile[];
  refreshDesktop: () => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) throw new Error('useDesktop must be used within DesktopProvider');
  return context;
};

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [showCTFFlag, setShowCTFFlag] = useState(false);
  const [systemCrashed, setSystemCrashed] = useState(false);
  const [desktopFiles, setDesktopFiles] = useState<VirtualFile[]>([]);
  
  // Security settings
  const [realtimeProtection, setRealtimeProtection] = useState(CTF_CONFIG.security.realtimeProtectionEnabled);
  const [cloudProtection, setCloudProtection] = useState(CTF_CONFIG.security.cloudProtectionEnabled);
  const [firewallEnabled, setFirewallEnabled] = useState(CTF_CONFIG.security.firewallEnabled);
  
  // Quarantine
  const [quarantinedItems, setQuarantinedItems] = useState<QuarantinedItem[]>([]);

  // Initialize file system and detect threats
  useEffect(() => {
    const init = async () => {
      await vfs.initialize();
      
      // Load security settings from storage
      const savedSettings = await vfs.getSetting('security');
      if (savedSettings && typeof savedSettings === 'object' && savedSettings !== null) {
        const s = savedSettings as { realtimeProtection?: boolean; cloudProtection?: boolean; firewallEnabled?: boolean };
        setRealtimeProtection(s.realtimeProtection ?? CTF_CONFIG.security.realtimeProtectionEnabled);
        setCloudProtection(s.cloudProtection ?? CTF_CONFIG.security.cloudProtectionEnabled);
        setFirewallEnabled(s.firewallEnabled ?? CTF_CONFIG.security.firewallEnabled);
      } else {
        // Persist current defaults (OFF by config)
        await vfs.setSetting('security', {
          realtimeProtection: CTF_CONFIG.security.realtimeProtectionEnabled,
          cloudProtection: CTF_CONFIG.security.cloudProtectionEnabled,
          firewallEnabled: CTF_CONFIG.security.firewallEnabled,
        });
      }
      
      // Add the flagged file to System32 if it doesn't exist
      const flaggedExists = await vfs.exists(CTF_CONFIG.flaggedFile.path);
      if (!flaggedExists) {
        await vfs.write(
          CTF_CONFIG.flaggedFile.path,
          CTF_CONFIG.flaggedFile.content,
          'text/plain'
        );
      }
      
      // Load quarantine from storage or create initial detection
      const savedQuarantine = await vfs.getSetting('quarantine');
      if (savedQuarantine) {
        setQuarantinedItems(savedQuarantine as QuarantinedItem[]);
      } else {
        // Always seed a detection regardless of toggles
        const item: QuarantinedItem = {
          id: crypto.randomUUID(),
          fileName: CTF_CONFIG.flaggedFile.name,
          originalPath: CTF_CONFIG.flaggedFile.path,
          detectionReason: CTF_CONFIG.flaggedFile.detectionReason,
          threatLevel: CTF_CONFIG.flaggedFile.threatLevel,
          quarantinedAt: Date.now(),
        };
        setQuarantinedItems([item]);
        await vfs.setSetting('quarantine', [item]);
      }
      
      refreshDesktop();
    };
    
    init();
  }, []);

  // Save security settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      await vfs.setSetting('security', {
        realtimeProtection,
        cloudProtection,
        firewallEnabled,
      });
    };
    saveSettings();
  }, [realtimeProtection, cloudProtection, firewallEnabled]);

  // Save quarantine when it changes
  useEffect(() => {
    const saveQuarantine = async () => {
      await vfs.setSetting('quarantine', quarantinedItems);
    };
    saveQuarantine();
  }, [quarantinedItems]);

  const refreshDesktop = async () => {
    const files = await vfs.list('C:/Users/Default/Desktop');
    setDesktopFiles(files);
  };

  const openWindow = (app: WindowState['app'], data?: Record<string, unknown>) => {
    const titles = {
      explorer: 'File Explorer',
      security: 'Windows Security',
      paint: 'Paint',
      calculator: 'Calculator',
      notepad: 'Notepad',
      terminal: 'Terminal',
    };

    const sizes = {
      explorer: { width: 900, height: 600 },
      security: { width: 800, height: 600 },
      paint: { width: 1000, height: 700 },
      calculator: { width: 350, height: 500 },
      notepad: { width: 700, height: 500 },
      terminal: { width: 800, height: 500 },
    };

    const newWindow: WindowState = {
      id: crypto.randomUUID(),
      app,
      title: data?.title || titles[app],
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: sizes[app].width,
      height: sizes[app].height,
      minimized: false,
      maximized: false,
      zIndex: nextZIndex,
      data,
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, minimized: false } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: !w.minimized } : w
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ));
  };

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const restoreFromQuarantine = async (id: string) => {
    const item = quarantinedItems.find(i => i.id === id);
    if (!item) return;

    // Restore file to original location
    const file = await vfs.read(CTF_CONFIG.flaggedFile.path);
    if (file) {
      // File still exists, just remove from quarantine
      setQuarantinedItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const deleteFromQuarantine = (id: string) => {
    setQuarantinedItems(prev => prev.filter(i => i.id !== id));
  };

  const checkCTFCondition = (deletedFilePath: string) => {
    // Check if the deleted file is the flagged system file
    // and it was deleted from Desktop (moved to Desktop then deleted)
    if (deletedFilePath === CTF_CONFIG.flaggedFile.path || 
        deletedFilePath.includes(CTF_CONFIG.flaggedFile.name)) {
      setShowCTFFlag(true);
    }
  };

  const checkCTFConditionTerminal = (deletedFilePath: string) => {
    // Check if the deleted file is the flagged system file
    if (deletedFilePath === CTF_CONFIG.flaggedFile.path || 
        deletedFilePath.includes(CTF_CONFIG.flaggedFile.name)) {
      return CTF_CONFIG.flag;
    }
    return null;
  };

  const triggerSystemCrash = () => {
    setSystemCrashed(true);
  };

  const reloadSystem = () => {
    window.location.reload();
  };

  const value: DesktopContextType = {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindow,
    realtimeProtection,
    cloudProtection,
    firewallEnabled,
    setRealtimeProtection,
    setCloudProtection,
    setFirewallEnabled,
    quarantinedItems,
    restoreFromQuarantine,
    deleteFromQuarantine,
    showCTFFlag,
    checkCTFCondition,
    checkCTFConditionTerminal,
    systemCrashed,
    triggerSystemCrash,
    reloadSystem,
    desktopFiles,
    refreshDesktop,
  };

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
};
