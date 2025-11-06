import React, { useState, useRef, useEffect } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { vfs } from '@/lib/virtualFS';
import { CTF_CONFIG } from '@/lib/ctfConfig';

interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error';
  timestamp: number;
}

export const Terminal = () => {
  const { checkCTFConditionTerminal, triggerSystemCrash } = useDesktop();
  const [currentPath, setCurrentPath] = useState('C:/Users/Default');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      content: 'Microsoft Windows [Version 10.0.22000.1]',
      type: 'output',
      timestamp: Date.now()
    },
    {
      id: '2',
      content: '(c) Microsoft Corporation. All rights reserved.',
      type: 'output',
      timestamp: Date.now()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (content: string, type: 'input' | 'output' | 'error' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: Date.now()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    // Add input line
    addLine(`${currentPath}> ${trimmedCommand}`, 'input');

    const parts = trimmedCommand.split(' ');
    const rawCmd = parts[0];
    const cmd = rawCmd.toLowerCase();
    const args = parts.slice(1);
    const hasHelpFlag = args.includes('-help') || args.includes('--help') || cmd.endsWith('-help');

    try {
      if (hasHelpFlag) {
        handleHelp();
        return;
      }

      switch (cmd) {
        case 'cd':
          await handleCd(args);
          break;
        case 'dir':
        case 'ls':
          await handleDir();
          break;
        case 'rm':
        case 'del':
          await handleRm(args);
          break;
        case 'rmdir':
          await handleRmdir(args);
          break;
        case 'pwd':
          addLine(currentPath);
          break;
        case 'help':
          handleHelp();
          break;
        case 'cls':
        case 'clear':
          setLines([]);
          break;
        case 'echo':
          addLine(args.join(' '));
          break;
        default:
          addLine(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`, 'error');
      }
    } catch (error) {
      addLine(`Error: ${error}`, 'error');
    }
  };

  const handleCd = async (args: string[]) => {
    if (args.length === 0) {
      setCurrentPath('C:/Users/Default');
      return;
    }

    let newPath = args[0];
    
    // Handle relative paths
    if (!newPath.startsWith('C:/') && !newPath.startsWith('/')) {
      if (newPath === '..') {
        const parts = currentPath.split('/');
        parts.pop();
        newPath = parts.join('/') || 'C:/';
      } else if (newPath === '.') {
        newPath = currentPath;
      } else {
        newPath = `${currentPath}/${newPath}`;
      }
    }

    // Normalize path
    newPath = newPath.replace(/\\/g, '/').replace(/\/+/g, '/');
    if (newPath.endsWith('/') && newPath !== 'C:/') {
      newPath = newPath.slice(0, -1);
    }

    // Check if path exists
    const exists = await vfs.exists(newPath);
    if (exists) {
      const file = await vfs.read(newPath);
      if (file && file.type === 'folder') {
        setCurrentPath(newPath);
      } else {
        addLine(`The system cannot find the path specified.`, 'error');
      }
    } else {
      addLine(`The system cannot find the path specified.`, 'error');
    }
  };

  const handleDir = async () => {
    try {
      const files = await vfs.list(currentPath);
      if (files.length === 0) {
        addLine('Directory of ' + currentPath);
        addLine('');
        addLine('File(s) not found.');
        return;
      }

      addLine(`Directory of ${currentPath}`);
      addLine('');

      // Group files and folders
      const folders = files.filter(f => f.type === 'folder');
      const fileList = files.filter(f => f.type === 'file');

      // Show folders first
      folders.forEach(folder => {
        const date = new Date(folder.modified).toLocaleDateString();
        const time = new Date(folder.modified).toLocaleTimeString();
        addLine(`${date}  ${time}    <DIR>          ${folder.name}`);
      });

      // Show files
      fileList.forEach(file => {
        const date = new Date(file.modified).toLocaleDateString();
        const time = new Date(file.modified).toLocaleTimeString();
        const size = file.size.toString().padStart(12);
        addLine(`${date}  ${time}    ${size} ${file.name}`);
      });

      addLine(`               ${fileList.length} File(s)`);
      addLine(`               ${folders.length} Dir(s)`);
    } catch (error) {
      addLine(`Error listing directory: ${error}`, 'error');
    }
  };

  const handleRm = async (args: string[]) => {
    if (args.length === 0) {
      addLine('The syntax of the command is incorrect.', 'error');
      return;
    }

    const fileName = args[0];
    let filePath: string;

    if (fileName.includes('/') || fileName.includes('\\')) {
      filePath = fileName.replace(/\\/g, '/');
    } else {
      filePath = `${currentPath}/${fileName}`;
    }

    try {
      const exists = await vfs.exists(filePath);
      if (!exists) {
        addLine(`Could not find ${fileName}`, 'error');
        return;
      }

      const file = await vfs.read(filePath);
      if (file && file.type === 'folder') {
        addLine(`The directory name is invalid.`, 'error');
        return;
      }

      // Check if it's the flagged file
      const flag = checkCTFConditionTerminal(filePath);
      if (flag) {
        addLine(`File deleted: ${fileName}`);
        addLine('');
        addLine('🎉 CTF FLAG CAPTURED! 🎉');
        addLine(`Flag: ${flag}`);
        addLine('');
        addLine('Congratulations! You found and eliminated the threat using the terminal.');
      } else {
        addLine(`File deleted: ${fileName}`);
      }

      await vfs.delete(filePath);
    } catch (error) {
      addLine(`Error deleting file: ${error}`, 'error');
    }
  };

  const handleRmdir = async (args: string[]) => {
    if (args.length === 0) {
      addLine('The syntax of the command is incorrect.', 'error');
      return;
    }

    const dirName = args[0];
    let dirPath: string;

    if (dirName.includes('/') || dirName.includes('\\')) {
      dirPath = dirName.replace(/\\/g, '/');
    } else {
      dirPath = `${currentPath}/${dirName}`;
    }

    try {
      const exists = await vfs.exists(dirPath);
      if (!exists) {
        addLine(`The system cannot find the path specified.`, 'error');
        return;
      }

      const dir = await vfs.read(dirPath);
      if (dir && dir.type === 'file') {
        addLine(`The directory name is invalid.`, 'error');
        return;
      }

      // Check if trying to delete System32 folder
      if (dirPath.toLowerCase().includes('system32') && dirPath.toLowerCase().endsWith('system32')) {
        addLine(`CRITICAL ERROR: System32 folder deletion detected!`, 'error');
        addLine(`System integrity compromised. Initiating emergency shutdown...`, 'error');
        addLine(``, 'error');
        addLine(`SYSTEM CRASH IMMINENT`, 'error');
        
        // Trigger system crash after a short delay
        setTimeout(() => {
          triggerSystemCrash();
        }, 2000);
        return;
      }

      await vfs.delete(dirPath);
      addLine(`Directory removed: ${dirName}`);
    } catch (error) {
      addLine(`Error removing directory: ${error}`, 'error');
    }
  };

  const handleHelp = () => {
    addLine('Available commands:');
    addLine('  cd [path]     - Change directory');
    addLine('  dir, ls       - List directory contents');
    addLine('  rm, del       - Delete file');
    addLine('  rmdir         - Remove directory');
    addLine('  pwd           - Print working directory');
    addLine('  echo [text]   - Display text');
    addLine('  cls, clear    - Clear screen');
    addLine('  help          - Show this help');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="flex h-full bg-gray-900 text-green-400 font-mono text-sm border border-gray-600">
      <div className="flex-1 flex flex-col">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-300 text-xs">Terminal</span>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 space-y-1"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => (
            <div key={line.id} className={`
              ${line.type === 'input' ? 'text-white' : ''}
              ${line.type === 'error' ? 'text-red-400' : ''}
              ${line.type === 'output' ? 'text-green-400' : ''}
            `}>
              {line.content}
            </div>
          ))}
          
          {/* Current Input Line */}
          <div className="flex items-center">
            <span className="text-white">{currentPath}&gt; </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};
