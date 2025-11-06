import React, { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setNewNumber(false);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const handleNegate = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  return (
    <div className="h-full bg-background p-4 flex flex-col">
      {/* Display */}
      <div className="bg-win-glass border border-border rounded-lg p-6 mb-4 text-right">
        <div className="text-sm text-muted-foreground h-6">
          {previousValue !== null && `${previousValue} ${operation || ''}`}
        </div>
        <div className="text-4xl font-light overflow-hidden text-ellipsis">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {/* Row 1 */}
        <CalcButton onClick={handleClear} variant="secondary">C</CalcButton>
        <CalcButton onClick={handleClearEntry} variant="secondary">CE</CalcButton>
        <CalcButton onClick={handleBackspace} variant="secondary">⌫</CalcButton>
        <CalcButton onClick={() => handleOperation('÷')} variant="operation">÷</CalcButton>

        {/* Row 2 */}
        <CalcButton onClick={() => handleNumber('7')}>7</CalcButton>
        <CalcButton onClick={() => handleNumber('8')}>8</CalcButton>
        <CalcButton onClick={() => handleNumber('9')}>9</CalcButton>
        <CalcButton onClick={() => handleOperation('×')} variant="operation">×</CalcButton>

        {/* Row 3 */}
        <CalcButton onClick={() => handleNumber('4')}>4</CalcButton>
        <CalcButton onClick={() => handleNumber('5')}>5</CalcButton>
        <CalcButton onClick={() => handleNumber('6')}>6</CalcButton>
        <CalcButton onClick={() => handleOperation('-')} variant="operation">-</CalcButton>

        {/* Row 4 */}
        <CalcButton onClick={() => handleNumber('1')}>1</CalcButton>
        <CalcButton onClick={() => handleNumber('2')}>2</CalcButton>
        <CalcButton onClick={() => handleNumber('3')}>3</CalcButton>
        <CalcButton onClick={() => handleOperation('+')} variant="operation">+</CalcButton>

        {/* Row 5 */}
        <CalcButton onClick={handleNegate}>+/-</CalcButton>
        <CalcButton onClick={() => handleNumber('0')}>0</CalcButton>
        <CalcButton onClick={handleDecimal}>.</CalcButton>
        <CalcButton onClick={handleEquals} variant="equals">=</CalcButton>
      </div>
    </div>
  );
};

interface CalcButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operation' | 'equals' | 'secondary';
}

const CalcButton = ({ children, onClick, variant = 'default' }: CalcButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-full text-lg font-medium rounded-lg transition-all",
        variant === 'operation' && "bg-primary/10 hover:bg-primary/20 text-primary",
        variant === 'equals' && "bg-primary hover:bg-primary/90 text-primary-foreground",
        variant === 'secondary' && "bg-secondary hover:bg-secondary/80",
        variant === 'default' && "bg-card hover:bg-muted"
      )}
      variant="ghost"
    >
      {children}
    </Button>
  );
};
