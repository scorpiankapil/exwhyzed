import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface VirtualFile {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string | Blob;
  size: number;
  created: number;
  modified: number;
  mimeType?: string;
}

interface FileSystemDB extends DBSchema {
  files: {
    key: string;
    value: VirtualFile;
    indexes: { 'by-path': string };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

class VirtualFileSystem {
  private db: IDBPDatabase<FileSystemDB> | null = null;
  private listeners: Map<string, Set<() => void>> = new Map();

  async initialize() {
    this.db = await openDB<FileSystemDB>('windows11-fs', 1, {
      upgrade(db) {
        const fileStore = db.createObjectStore('files', { keyPath: 'path' });
        fileStore.createIndex('by-path', 'path');
        db.createObjectStore('settings');
      },
    });

    // Initialize default file system if empty
    const files = await this.list('/');
    if (files.length === 0) {
      await this.initializeDefaultFS();
    }
  }

  private async initializeDefaultFS() {
    // Create extensive folder structure
    await this.createFolder('C:/Windows');
    await this.createFolder('C:/Windows/System32');
    await this.createFolder('C:/Windows/SysWOW64');
    await this.createFolder('C:/Windows/System');
    await this.createFolder('C:/Windows/Temp');
    await this.createFolder('C:/Windows/Logs');
    await this.createFolder('C:/Windows/Fonts');
    await this.createFolder('C:/Windows/Media');
    await this.createFolder('C:/Windows/Resources');
    await this.createFolder('C:/Windows/Boot');
    await this.createFolder('C:/Windows/Prefetch');
    
    await this.createFolder('C:/Users');
    await this.createFolder('C:/Users/Default');
    await this.createFolder('C:/Users/Default/Desktop');
    await this.createFolder('C:/Users/Default/Documents');
    await this.createFolder('C:/Users/Default/Downloads');
    await this.createFolder('C:/Users/Default/Pictures');
    await this.createFolder('C:/Users/Default/Music');
    await this.createFolder('C:/Users/Default/Videos');
    await this.createFolder('C:/Users/Default/AppData');
    await this.createFolder('C:/Users/Default/AppData/Local');
    await this.createFolder('C:/Users/Default/AppData/Roaming');
    await this.createFolder('C:/Users/Public');
    await this.createFolder('C:/Users/Public/Documents');
    await this.createFolder('C:/Users/Public/Desktop');
    await this.createFolder('C:/Users/Administrator');
    
    await this.createFolder('C:/Program Files');
    await this.createFolder('C:/Program Files/Common Files');
    await this.createFolder('C:/Program Files/Internet Explorer');
    await this.createFolder('C:/Program Files/Windows Defender');
    await this.createFolder('C:/Program Files/Windows Media Player');
    await this.createFolder('C:/Program Files/Microsoft Office');
    await this.createFolder('C:/Program Files/Adobe');
    await this.createFolder('C:/Program Files/Mozilla Firefox');
    await this.createFolder('C:/Program Files/Google');
    await this.createFolder('C:/Program Files/7-Zip');
    
    await this.createFolder('C:/Program Files (x86)');
    await this.createFolder('C:/Program Files (x86)/Common Files');
    await this.createFolder('C:/Program Files (x86)/Internet Explorer');
    await this.createFolder('C:/Program Files (x86)/Microsoft');
    
    await this.createFolder('C:/ProgramData');
    await this.createFolder('C:/ProgramData/Microsoft');
    await this.createFolder('C:/ProgramData/Package Cache');
    
    await this.createFolder('C:/Temp');
    await this.createFolder('C:/Quarantine');

    // Populate System32 with extensive fake system files
    const systemFiles = [
      'kernel32.dll', 'ntdll.dll', 'user32.dll', 'advapi32.dll',
      'gdi32.dll', 'shell32.dll', 'ole32.dll', 'msvcrt.dll',
      'ws2_32.dll', 'rpcrt4.dll', 'comctl32.dll', 'comdlg32.dll',
      'wininet.dll', 'crypt32.dll', 'winspool.drv', 'imm32.dll',
      'oleaut32.dll', 'setupapi.dll', 'version.dll', 'shlwapi.dll',
      'winmm.dll', 'secur32.dll', 'bcrypt.dll', 'ncrypt.dll',
      'kernelbase.dll', 'ucrtbase.dll', 'msvcp_win.dll', 'netapi32.dll',
      'samsrv.dll', 'lsasrv.dll', 'wldap32.dll', 'dnsapi.dll',
      'iphlpapi.dll', 'userenv.dll', 'powrprof.dll', 'wintrust.dll',
      'imagehlp.dll', 'psapi.dll', 'dbghelp.dll', 'winhttp.dll',
      'bcryptprimitives.dll', 'cryptsp.dll', 'rsaenh.dll', 'ncryptsslp.dll',
      'mpr.dll', 'winsta.dll', 'winscard.dll', 'credui.dll',
      'webio.dll', 'xmllite.dll', 'propsys.dll', 'dwmapi.dll',
      'uxtheme.dll', 'd3d11.dll', 'dxgi.dll', 'd2d1.dll',
      'gdiplus.dll', 'windowscodecs.dll', 'mf.dll', 'mfplat.dll',
      'avrt.dll', 'audioses.dll', 'mmdevapi.dll', 'wdmaud.drv',
      'ksuser.dll', 'setupapi.dll', 'cfgmgr32.dll', 'devobj.dll',
      'wtsapi32.dll', 'profapi.dll', 'authz.dll', 'sechost.dll',
      'ntasn1.dll', 'msasn1.dll', 'cabinet.dll', 'msi.dll',
    ];

    for (const fileName of systemFiles) {
      await this.write(
        `C:/Windows/System32/${fileName}`,
        `// ${fileName}\n// System library file\n// Version 10.0.22000.1`,
        'text/plain'
      );
    }

    // Add files to other Windows directories
    const windowsFiles = [
      'C:/Windows/win.ini',
      'C:/Windows/system.ini',
      'C:/Windows/notepad.exe',
      'C:/Windows/regedit.exe',
      'C:/Windows/explorer.exe',
    ];

    for (const filePath of windowsFiles) {
      const fileName = filePath.split('/').pop() || '';
      await this.write(
        filePath,
        `// ${fileName}\n// Windows system file`,
        'text/plain'
      );
    }

    // Add some Program Files content
    await this.write(
      'C:/Program Files/Windows Defender/MpCmdRun.exe',
      '// Windows Defender Command Line Utility',
      'text/plain'
    );

    // Create a welcome text file on Desktop
    await this.write(
      'C:/Users/Default/Desktop/Welcome.txt',
      'Welcome to Windows 11 CTF Training Environment!\n\nThis is a safe, browser-based simulation.\n\nObjective: Find and eliminate the threat hidden in the system.\n\nHint: Check Windows Security for suspicious activity.',
      'text/plain'
    );
    
    // Add some user documents
    await this.write(
      'C:/Users/Default/Documents/README.txt',
      'User documents folder',
      'text/plain'
    );
  }

  async list(path: string): Promise<VirtualFile[]> {
    if (!this.db) throw new Error('FileSystem not initialized');
    
    const normalizedPath = this.normalizePath(path);
    const allFiles = await this.db.getAll('files');
    
    // Get immediate children only
    return allFiles.filter(file => {
      const filePath = file.path;
      const fileDir = filePath.substring(0, filePath.lastIndexOf('/')) || '/';
      return fileDir === normalizedPath;
    }).sort((a, b) => {
      // Folders first, then alphabetically
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  async read(path: string): Promise<VirtualFile | null> {
    if (!this.db) throw new Error('FileSystem not initialized');
    const normalizedPath = this.normalizePath(path);
    return await this.db.get('files', normalizedPath) || null;
  }

  async write(path: string, content: string | Blob, mimeType = 'text/plain'): Promise<void> {
    if (!this.db) throw new Error('FileSystem not initialized');
    
    const normalizedPath = this.normalizePath(path);
    const name = normalizedPath.split('/').pop() || '';
    const size = typeof content === 'string' ? content.length : content.size;
    
    const existing = await this.read(normalizedPath);
    const now = Date.now();
    
    const file: VirtualFile = {
      name,
      path: normalizedPath,
      type: 'file',
      content,
      size,
      mimeType,
      created: existing?.created || now,
      modified: now,
    };

    await this.db.put('files', file);
    this.notifyListeners(normalizedPath);
  }

  async createFolder(path: string): Promise<void> {
    if (!this.db) throw new Error('FileSystem not initialized');
    
    const normalizedPath = this.normalizePath(path);
    const name = normalizedPath.split('/').pop() || '';
    const now = Date.now();
    
    const folder: VirtualFile = {
      name,
      path: normalizedPath,
      type: 'folder',
      size: 0,
      created: now,
      modified: now,
    };

    await this.db.put('files', folder);
    this.notifyListeners(normalizedPath);
  }

  async delete(path: string): Promise<void> {
    if (!this.db) throw new Error('FileSystem not initialized');
    
    const normalizedPath = this.normalizePath(path);
    const file = await this.read(normalizedPath);
    
    if (!file) return;

    if (file.type === 'folder') {
      // Delete all children recursively
      const children = await this.listRecursive(normalizedPath);
      for (const child of children) {
        await this.db.delete('files', child.path);
      }
    }

    await this.db.delete('files', normalizedPath);
    this.notifyListeners(normalizedPath);
  }

  async move(srcPath: string, destPath: string): Promise<void> {
    if (!this.db) throw new Error('FileSystem not initialized');
    
    const normalizedSrc = this.normalizePath(srcPath);
    const normalizedDest = this.normalizePath(destPath);
    
    const file = await this.read(normalizedSrc);
    if (!file) throw new Error('Source file not found');

    // Create new file at destination
    const newName = normalizedDest.split('/').pop() || file.name;
    const newFile: VirtualFile = {
      ...file,
      name: newName,
      path: normalizedDest,
      modified: Date.now(),
    };

    await this.db.put('files', newFile);
    
    // If it's a folder, move all children
    if (file.type === 'folder') {
      const children = await this.listRecursive(normalizedSrc);
      for (const child of children) {
        const newChildPath = child.path.replace(normalizedSrc, normalizedDest);
        const childFile = await this.read(child.path);
        if (childFile) {
          const newChildFile: VirtualFile = {
            ...childFile,
            path: newChildPath,
            modified: Date.now(),
          };
          await this.db.put('files', newChildFile);
        }
      }
      
      // Delete old children
      for (const child of children) {
        await this.db.delete('files', child.path);
      }
    }

    // Delete source
    await this.db.delete('files', normalizedSrc);
    
    this.notifyListeners(normalizedSrc);
    this.notifyListeners(normalizedDest);
  }

  async rename(path: string, newName: string): Promise<void> {
    const normalizedPath = this.normalizePath(path);
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/'));
    const newPath = `${parentPath}/${newName}`;
    await this.move(normalizedPath, newPath);
  }

  async stat(path: string): Promise<VirtualFile | null> {
    return this.read(path);
  }

  async exists(path: string): Promise<boolean> {
    const file = await this.read(path);
    return file !== null;
  }

  private async listRecursive(path: string): Promise<VirtualFile[]> {
    if (!this.db) throw new Error('FileSystem not initialized');
    
    const normalizedPath = this.normalizePath(path);
    const allFiles = await this.db.getAll('files');
    
    return allFiles.filter(file => 
      file.path.startsWith(normalizedPath + '/') && file.path !== normalizedPath
    );
  }

  private normalizePath(path: string): string {
    // Remove trailing slashes, handle edge cases
    let normalized = path.replace(/\\/g, '/').replace(/\/+/g, '/');
    if (normalized.endsWith('/') && normalized !== '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized || '/';
  }

  // Settings management
  async getSetting(key: string): Promise<unknown> {
    if (!this.db) throw new Error('FileSystem not initialized');
    return await this.db.get('settings', key);
  }

  async setSetting(key: string, value: unknown): Promise<void> {
    if (!this.db) throw new Error('FileSystem not initialized');
    await this.db.put('settings', value, key);
  }

  // Event listeners for file changes
  onChange(path: string, callback: () => void) {
    const normalizedPath = this.normalizePath(path);
    if (!this.listeners.has(normalizedPath)) {
      this.listeners.set(normalizedPath, new Set());
    }
    this.listeners.get(normalizedPath)!.add(callback);

    return () => {
      const callbacks = this.listeners.get(normalizedPath);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  private notifyListeners(path: string) {
    const callbacks = this.listeners.get(path);
    if (callbacks) {
      callbacks.forEach(cb => cb());
    }
    
    // Also notify parent directory listeners
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
    const parentCallbacks = this.listeners.get(parentPath);
    if (parentCallbacks) {
      parentCallbacks.forEach(cb => cb());
    }
  }
}

// Export singleton instance
export const vfs = new VirtualFileSystem();
