import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { useDesktop } from '@/contexts/DesktopContext';
import { cn } from '@/lib/utils';

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose: () => void;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  minimized?: boolean;
  maximized?: boolean;
  zIndex?: number;
}

export const Window = ({
  id,
  title,
  children,
  onClose,
  initialX = 100,
  initialY = 100,
  initialWidth = 800,
  initialHeight = 600,
  minimized = false,
  maximized = false,
  zIndex = 1000,
}: WindowProps) => {
  const { focusWindow, updateWindow, minimizeWindow, maximizeWindow } = useDesktop();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(0, e.clientY - dragOffset.y);
        setPosition({ x: newX, y: newY });
        updateWindow(id, { x: newX, y: newY });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, id, updateWindow]);

  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => {
        if (windowRef.current) {
          const newWidth = Math.max(300, e.clientX - position.x);
          const newHeight = Math.max(200, e.clientY - position.y);
          setSize({ width: newWidth, height: newHeight });
          updateWindow(id, { width: newWidth, height: newHeight });
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, position, id, updateWindow]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      focusWindow(id);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    focusWindow(id);
  };

  if (minimized) return null;

  const windowStyle = maximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)', zIndex }
    : { top: position.y, left: position.x, width: size.width, height: size.height, zIndex };

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col",
        "transition-all duration-200 backdrop-blur-sm",
        maximized && "rounded-none"
      )}
      style={windowStyle}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className="h-8 bg-gray-100 flex items-center justify-between px-2 cursor-move select-none border-b border-gray-300"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <span className="text-sm font-medium text-gray-800 truncate flex-1">
          {title}
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="w-8 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors text-gray-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="w-8 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors text-gray-600"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white rounded transition-colors text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize Handle */}
      {!maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};
