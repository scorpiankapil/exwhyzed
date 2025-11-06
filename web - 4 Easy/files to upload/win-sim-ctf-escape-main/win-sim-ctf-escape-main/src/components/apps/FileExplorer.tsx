import React, { useState, useEffect } from 'react';
import { ChevronRight, Home, HardDrive, Folder, File, FileText, Trash2, Edit, FolderPlus, FilePlus } from 'lucide-react';
import { vfs, VirtualFile } from '@/lib/virtualFS';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface FileExplorerProps {
  initialPath?: string;
}

export const FileExplorer = ({ initialPath = 'C:/Users/Default/Desktop' }: FileExplorerProps) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: VirtualFile | null } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const { openWindow, checkCTFCondition, refreshDesktop } = useDesktop();

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    const fileList = await vfs.list(currentPath);
    setFiles(fileList);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const handleFileDoubleClick = async (file: VirtualFile) => {
    if (file.type === 'folder') {
      handleNavigate(file.path);
    } else if (file.mimeType?.startsWith('text/')) {
      openWindow('notepad', { filePath: file.path, title: file.name });
    } else if (file.mimeType?.startsWith('image/')) {
      openWindow('paint', { filePath: file.path, title: file.name });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: VirtualFile | null) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
    if (file) setSelectedFile(file.path);
  };

  const handleDelete = async (file: VirtualFile) => {
    // Check if trying to delete from System32
    if (currentPath.includes('System32')) {
      alert('Access is denied.\nYou require permission from the computer\'s administrator to perform this action.');
      setContextMenu(null);
      return;
    }

    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      await vfs.delete(file.path);
      
      // Check if this was the flagged file and if we're in Desktop
      if (currentPath.includes('Desktop')) {
        checkCTFCondition(file.path);
      }
      
      await loadFiles();
      await refreshDesktop();
    }
    setContextMenu(null);
  };

  const handleRename = async (file: VirtualFile) => {
    setRenaming(file.path);
    setNewName(file.name);
    setContextMenu(null);
  };

  const confirmRename = async (file: VirtualFile) => {
    if (newName && newName !== file.name) {
      await vfs.rename(file.path, newName);
      await loadFiles();
      await refreshDesktop();
    }
    setRenaming(null);
  };

  const handleMove = async (file: VirtualFile, destFolder: string) => {
    const destPath = `${destFolder}/${file.name}`;
    await vfs.move(file.path, destPath);
    await loadFiles();
    await refreshDesktop();
  };

  const getPathSegments = () => {
    const segments = currentPath.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      return { name: segment, path };
    });
  };

  const getFileIcon = (file: VirtualFile) => {
    if (file.type === 'folder') return <Folder className="w-5 h-5 text-primary" />;
    if (file.mimeType?.startsWith('text/')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Navigation Bar */}
      <div className="h-12 border-b border-border flex items-center px-3 gap-2 bg-win-glass">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigate('C:/Users/Default/Desktop')}
          title="Desktop"
        >
          <Home className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigate('C:/')}
          title="This PC"
        >
          <HardDrive className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex items-center gap-1 text-sm">
          {getPathSegments().map((segment, index) => (
            <React.Fragment key={segment.path}>
              {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <button
                onClick={() => handleNavigate(segment.path)}
                className="hover:bg-muted px-2 py-1 rounded transition-colors"
              >
                {segment.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div
        className="flex-1 overflow-auto p-4"
        onClick={() => setContextMenu(null)}
        onContextMenu={(e) => handleContextMenu(e, null)}
      >
        <div className="grid grid-cols-1 gap-1">
          {files.map(file => (
            <div
              key={file.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-muted",
                selectedFile === file.path && "bg-primary/10"
              )}
              onClick={() => setSelectedFile(file.path)}
              onDoubleClick={() => handleFileDoubleClick(file)}
              onContextMenu={(e) => handleContextMenu(e, file)}
            >
              {getFileIcon(file)}
              {renaming === file.path ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => confirmRename(file)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmRename(file);
                    if (e.key === 'Escape') setRenaming(null);
                  }}
                  autoFocus
                  className="h-6 text-sm"
                />
              ) : (
                <span className="flex-1 text-sm">{file.name}</span>
              )}
              <span className="text-xs text-muted-foreground">
                {file.type === 'folder' ? 'Folder' : `${(file.size / 1024).toFixed(1)} KB`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-popover border border-border rounded-lg shadow-elevated py-1 z-50 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.file ? (
            <>
              <button
                onClick={() => handleFileDoubleClick(contextMenu.file!)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
              >
                Open
              </button>
              <button
                onClick={() => handleRename(contextMenu.file!)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Rename
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => handleDelete(contextMenu.file!)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          ) : (
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              onClick={async () => {
                await vfs.createFolder(`${currentPath}/New Folder`);
                await loadFiles();
                setContextMenu(null);
              }}
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
          )}
        </div>
      )}
    </div>
  );
};
