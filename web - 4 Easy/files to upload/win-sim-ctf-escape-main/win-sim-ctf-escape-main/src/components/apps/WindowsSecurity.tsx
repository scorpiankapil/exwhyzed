import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Trash2, RotateCcw } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

export const WindowsSecurity = () => {
  const {
    realtimeProtection,
    cloudProtection,
    firewallEnabled,
    setRealtimeProtection,
    setCloudProtection,
    setFirewallEnabled,
    quarantinedItems,
    restoreFromQuarantine,
    deleteFromQuarantine,
  } = useDesktop();

  const [activeTab, setActiveTab] = React.useState<'protection' | 'quarantine'>('protection');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getThreatColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
      case 'severe':
        return 'text-destructive';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-win-glass p-4">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-semibold">Windows Security</span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('protection')}
            className={cn(
              "w-full text-left px-3 py-2 rounded transition-colors",
              activeTab === 'protection' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Protection Settings
          </button>
          <button
            onClick={() => setActiveTab('quarantine')}
            className={cn(
              "w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between",
              activeTab === 'quarantine' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Quarantine
            {quarantinedItems.length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                {quarantinedItems.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'protection' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Virus & threat protection</h2>
            <p className="text-muted-foreground mb-6">
              Actions needed. Threats found on this device.
            </p>

            {/* Protection Status */}
            <div className="bg-win-glass border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold text-orange-500">
                  Threats found — action needed
                </span>
              </div>

              {quarantinedItems.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {quarantinedItems.length} threat(s) detected and quarantined
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Real-time protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Finds and stops malware from installing or running
                    </p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Cloud-delivered protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Provides increased and faster protection
                    </p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">Firewall</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitors and controls network traffic
                    </p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quarantine' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Quarantined threats</h2>
            <p className="text-muted-foreground mb-6">
              Items that have been detected as potential threats
            </p>

            <div className="space-y-3">
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <h3 className="font-semibold text-destructive">system_helper.dll</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-destructive text-destructive-foreground">
                        High
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Suspicious behavior detected: Unauthorized system modification attempt
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quarantined: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-destructive/10 border border-destructive/30 rounded p-3 mt-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Action needed: Virus detected in core Windows folder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
