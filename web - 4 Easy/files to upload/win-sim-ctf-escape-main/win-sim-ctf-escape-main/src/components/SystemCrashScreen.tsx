import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface SystemCrashScreenProps {
  onReload: () => void;
}

export const SystemCrashScreen = ({ onReload }: SystemCrashScreenProps) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-center max-w-2xl mx-4">
        {/* BSOD Header */}
        <div className="bg-blue-600 text-white p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Windows</h1>
          </div>
          <p className="text-lg">Your PC ran into a problem and needs to restart.</p>
        </div>

        {/* Error Details */}
        <div className="bg-gray-100 text-black p-6 mb-6 text-left">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            CRITICAL SYSTEM ERROR
          </h2>
          
          <div className="space-y-3 text-sm">
            <p><strong>Error Code:</strong> SYSTEM_INTEGRITY_VIOLATION</p>
            <p><strong>Error Message:</strong> System32 folder deletion detected</p>
            <p><strong>Cause:</strong> Critical system directory removed</p>
            <p><strong>Impact:</strong> System cannot function without System32</p>
          </div>

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 font-semibold">
              ⚠️ WARNING: Deleting System32 folder causes complete system failure
            </p>
            <p className="text-red-700 text-sm mt-2">
              The System32 folder contains essential Windows system files. 
              Removing it will crash the entire operating system.
            </p>
          </div>
        </div>

        {/* Recovery Options */}
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Recovery Required</h3>
            <p className="text-yellow-700 text-sm">
              The system has crashed due to critical folder deletion. 
              You must reload the system to continue.
            </p>
          </div>

          <Button
            onClick={onReload}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reload System
          </Button>

          <p className="text-gray-500 text-sm">
            Click "Reload System" to restart the Windows simulation
          </p>
        </div>
      </div>
    </div>
  );
};
