import React from 'react';
import { FileText, Folder, File } from 'lucide-react';
import { VirtualFile } from '@/lib/virtualFS';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  file: VirtualFile;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const DesktopIcon = ({ file, onDoubleClick, onContextMenu }: DesktopIconProps) => {
  const getIcon = () => {
    if (file.type === 'folder') {
      return <Folder className="w-12 h-12 text-primary" />;
    }
    
    if (file.mimeType?.startsWith('text/')) {
      return <FileText className="w-12 h-12 text-blue-500" />;
    }
    
    return <File className="w-12 h-12 text-muted-foreground" />;
  };

  return (
    <div
      className={cn(
        "w-24 flex flex-col items-center gap-1 p-2 rounded cursor-pointer",
        "hover:bg-primary/10 transition-colors select-none"
      )}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {getIcon()}
      <span className="text-xs text-center break-words w-full text-foreground drop-shadow-sm">
        {file.name}
      </span>
    </div>
  );
};
