import React, { useRef, useState, useEffect } from 'react';
import { Brush, Eraser, Circle, Square, Minus, Save, Undo } from 'lucide-react';
import { vfs } from '@/lib/virtualFS';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PaintProps {
  filePath?: string;
}

type Tool = 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle';

export const Paint = ({ filePath }: PaintProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#FFA500',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 900;
    canvas.height = 600;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load image if filePath provided
    if (filePath) {
      loadImage();
    }

    // Save initial state
    saveToHistory();
  }, []);

  const loadImage = async () => {
    if (!filePath) return;
    
    const file = await vfs.read(filePath);
    if (file && file.content instanceof Blob) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          ctx.drawImage(img, 0, 0);
          saveToHistory();
        }
      };
      img.src = URL.createObjectURL(file.content);
    }
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-9), imageData]); // Keep last 10 states
  };

  const handleUndo = () => {
    if (history.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const previousState = history[history.length - 2];
    ctx.putImageData(previousState, 0, 0);
    setHistory(prev => prev.slice(0, -1));
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    setIsDrawing(false);
    saveToHistory();
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const fileName = filePath || `C:/Users/Default/Desktop/painting_${Date.now()}.png`;
      await vfs.write(fileName, blob, 'image/png');
      toast.success('Image saved successfully');
    });
  };

  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center px-3 gap-3 bg-win-glass">
        <div className="flex gap-1 border-r border-border pr-3">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <Button
                key={t.id}
                variant={tool === t.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>

        <div className="flex gap-1 border-r border-border pr-3">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-6 h-6 rounded border-2 transition-all",
                color === c ? 'border-primary scale-110' : 'border-border'
              )}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 border-r border-border pr-3">
          <span className="text-sm text-muted-foreground">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm w-6">{lineWidth}</span>
        </div>

        <Button size="sm" onClick={handleUndo} disabled={history.length < 2}>
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </Button>

        <Button size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-4 bg-muted/30">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white shadow-lg cursor-crosshair"
        />
      </div>
    </div>
  );
};
