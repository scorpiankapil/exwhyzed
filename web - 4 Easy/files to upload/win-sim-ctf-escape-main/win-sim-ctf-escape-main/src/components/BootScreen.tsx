import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen = ({ onBootComplete }: BootScreenProps) => {
  const [currentStage, setCurrentStage] = useState<'update' | 'booting' | 'complete'>('update');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Update animation
  useEffect(() => {
    if (currentStage === 'update') {
      const interval = setInterval(() => {
        setUpdateProgress(prev => {
          if (prev >= 100) {
            setCurrentStage('booting');
            return 100;
          }
          return prev + Math.random() * 5 + 2; // Faster progress
        });
      }, 50); // Faster updates
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  // Boot animation
  useEffect(() => {
    if (currentStage === 'booting') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            setCurrentStage('complete');
            setTimeout(onBootComplete, 500); // Shorter delay
            return 100;
          }
          return prev + Math.random() * 4 + 2; // Faster progress
        });
      }, 60); // Faster updates
      return () => clearInterval(interval);
    }
  }, [currentStage, onBootComplete]);

  // Dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Author Watermark */}
      <div className="absolute bottom-4 right-4 z-50 text-right">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/30 shadow-lg">
          <div className="text-white/90 text-xs font-medium mb-1">
            Windows 11 activation failed
          </div>
          <div className="text-white/80 text-xs">
            Author - Suraj Shankhpal
          </div>
        </div>
      </div>
      {/* Windows Update Screen */}
      {currentStage === 'update' && (
        <div className="text-center max-w-2xl mx-4">
          {/* Windows Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 rounded-lg flex items-center justify-center windows-logo windows-glow">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Windows 11</h1>
            <p className="text-xl text-gray-300">CTF Training Environment</p>
          </div>

          {/* Update Animation */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
              <span className="text-white text-lg">Updating your system{dots}</span>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="text-green-400 text-sm">✓ Installing security updates</div>
              <div className="text-green-400 text-sm">✓ Updating system components</div>
              <div className="text-yellow-400 text-sm">⏳ Installing CTF challenge files</div>
              <div className="text-blue-400 text-sm">⏳ Preparing virtual environment</div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Installing updates</span>
                <span>{Math.round(updateProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 progress-shimmer"
                  style={{ width: `${updateProgress}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Please don't turn off your computer. This may take a few minutes.
          </p>
        </div>
      )}

      {/* Booting Screen */}
      {currentStage === 'booting' && (
        <div className="text-center max-w-2xl mx-4">
          {/* Windows Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center windows-logo windows-glow shadow-2xl">
              <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">Windows 11</h1>
            <p className="text-2xl text-gray-300">CTF Training Environment</p>
          </div>

          {/* Boot Progress */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-pulse w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-white text-lg">Starting up{dots}</span>
            </div>
            
            <div className="space-y-2 text-left text-sm">
              <div className="text-green-400">✓ Loading system files</div>
              <div className="text-green-400">✓ Initializing security modules</div>
              <div className="text-green-400">✓ Starting virtual file system</div>
              <div className="text-yellow-400">⏳ Loading CTF challenge</div>
              <div className="text-blue-400">⏳ Preparing desktop environment</div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Starting Windows</span>
                <span>{Math.round(bootProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 progress-shimmer"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Getting things ready for you...
          </p>
        </div>
      )}

      {/* Complete Screen */}
      {currentStage === 'complete' && (
        <div className="text-center max-w-2xl mx-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center animate-bounce">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Ready!</h1>
          <p className="text-xl text-gray-300">Welcome to Windows 11 CTF Training</p>
        </div>
      )}
    </div>
  );
};
