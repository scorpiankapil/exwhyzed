import React from 'react';
import { Trophy, Copy, Check } from 'lucide-react';
import { CTF_CONFIG } from '@/lib/ctfConfig';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface CTFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CTFModal = ({ isOpen, onClose }: CTFModalProps) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CTF_CONFIG.flag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-win-window rounded-xl shadow-elevated max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-pulse">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-white/90 text-sm">
            You've successfully completed the CTF challenge!
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              You found and eliminated the threat! Here's your flag:
            </p>
            
            {/* Flag Display */}
            <div className="relative">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-lg text-center border-2 border-primary/20">
                {CTF_CONFIG.flag}
              </div>
              
              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className={cn(
                  "absolute top-2 right-2 p-2 rounded transition-colors",
                  copied ? "bg-green-500 text-white" : "bg-background hover:bg-muted"
                )}
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-4 border border-primary/20">
            <p className="text-sm font-medium text-foreground">
              🏆 Achievement Unlocked
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Threat Hunter - Successfully identified and removed a hidden malicious file from the system
            </p>
          </div>

          {/* Summary */}
          <div className="text-xs text-muted-foreground space-y-1 mb-4">
            <p>✓ Navigated to C:\Windows\System32\</p>
            <p>✓ Identified suspicious file: {CTF_CONFIG.flaggedFile.name}</p>
            <p>✓ Removed threat from system</p>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full"
            size="lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
