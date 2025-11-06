import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { vfs } from '@/lib/virtualFS';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface NotepadProps {
  filePath?: string;
}

export const Notepad = ({ filePath }: NotepadProps) => {
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (filePath) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    if (!filePath) return;
    
    const file = await vfs.read(filePath);
    if (file && typeof file.content === 'string') {
      setContent(file.content);
    }
  };

  const handleSave = async () => {
    if (!filePath) {
      toast.error('Cannot save: No file path specified');
      return;
    }

    await vfs.write(filePath, content, 'text/plain');
    setHasChanges(false);
    toast.success('File saved successfully');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="h-10 border-b border-border flex items-center px-2 gap-2 bg-win-glass">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        {hasChanges && (
          <span className="text-xs text-muted-foreground">• Unsaved changes</span>
        )}
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 p-4 font-mono text-sm bg-background border-none outline-none resize-none"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
};
