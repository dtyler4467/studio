
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileDataTable } from '@/components/dashboard/file-data-table';
import { Folder, CalculatorIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [isFilesOpen, setIsFilesOpen] = useState(true);

  const handleDigitClick = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleOperatorClick = (op: string) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(op);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };
  
  const handleEqualsClick = () => {
    if (operator && currentValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(null);
      setDisplay(String(isNaN(result) ? 'Error' : result));
      setOperator(null);
      setWaitingForOperand(true);
    }
  };
  
  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(true);
  }

  const handleDecimalClick = () => {
      if (!display.includes('.')) {
          setDisplay(display + '.');
      }
  };
  
  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercentage = () => {
    if (currentValue !== null && operator) {
      const inputValue = parseFloat(display);
      const percentageValue = (currentValue * inputValue) / 100;
      setDisplay(String(percentageValue));
    } else {
      setDisplay(String(parseFloat(display) / 100));
    }
  }

  const handleMemory = (memOp: 'MC' | 'MR' | 'M+' | 'M-') => {
    const displayValue = parseFloat(display);
    switch (memOp) {
        case 'MC':
            setMemory(0);
            break;
        case 'MR':
            setDisplay(String(memory));
            setWaitingForOperand(true);
            break;
        case 'M+':
            setMemory(memory + displayValue);
            setWaitingForOperand(true);
            break;
        case 'M-':
            setMemory(memory - displayValue);
            setWaitingForOperand(true);
            break;
    }
  }

  const handleUnaryOperation = (op: 'sqrt' | 'sq' | 'inv') => {
    const displayValue = parseFloat(display);
    let result;
    switch(op) {
        case 'sqrt':
            result = Math.sqrt(displayValue);
            break;
        case 'sq':
            result = displayValue * displayValue;
            break;
        case 'inv':
            result = displayValue === 0 ? NaN : 1 / displayValue;
            break;
    }
    setDisplay(String(isNaN(result) ? 'Error' : result));
    setWaitingForOperand(true);
  };
  
  const handleBackspace = () => {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  }

  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Calculator & Files" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Collapsible open={isFilesOpen} onOpenChange={setIsFilesOpen}>
            <Card>
                 <CollapsibleTrigger asChild>
                     <div className="flex justify-between items-center cursor-pointer p-6">
                        <div className="flex items-center gap-2">
                             <Folder />
                             <div>
                                <CardTitle className="font-headline">File Management</CardTitle>
                                <CardDescription>Manage your documents and files.</CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <ChevronDown className={`transition-transform ${isFilesOpen ? 'rotate-180' : ''}`} />
                        </Button>
                     </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <FileDataTable onRowClick="dialog" />
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
        
        <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><CalculatorIcon /> Accounting Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative">
                <Input 
                    className="text-right text-4xl font-mono h-20 pr-4" 
                    value={display} 
                    readOnly 
                />
                {memory !== 0 && <Badge variant="secondary" className="absolute top-2 left-2">M</Badge>}
            </div>
            <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => handleMemory('MC')}>MC</Button>
                <Button variant="outline" onClick={() => handleMemory('MR')}>MR</Button>
                <Button variant="outline" onClick={() => handleMemory('M-')}>M-</Button>
                <Button variant="outline" onClick={() => handleMemory('M+')}>M+</Button>
                
                <Button variant="outline" onClick={handlePercentage}>%</Button>
                <Button variant="outline" onClick={handleClearEntry}>CE</Button>
                <Button variant="outline" onClick={handleClear}>C</Button>
                <Button variant="outline" onClick={handleBackspace}>del</Button>

                <Button variant="outline" onClick={() => handleUnaryOperation('inv')}>1/x</Button>
                <Button variant="outline" onClick={() => handleUnaryOperation('sq')}>x²</Button>
                <Button variant="outline" onClick={() => handleUnaryOperation('sqrt')}>√</Button>
                <Button variant="outline" onClick={() => handleOperatorClick('/')}>÷</Button>

                <Button variant="secondary" onClick={() => handleDigitClick('7')}>7</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('8')}>8</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('9')}>9</Button>
                <Button variant="outline" onClick={() => handleOperatorClick('*')}>×</Button>
                
                <Button variant="secondary" onClick={() => handleDigitClick('4')}>4</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('5')}>5</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('6')}>6</Button>
                <Button variant="outline" onClick={() => handleOperatorClick('-')}>-</Button>
                
                <Button variant="secondary" onClick={() => handleDigitClick('1')}>1</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('2')}>2</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('3')}>3</Button>
                <Button variant="outline" onClick={() => handleOperatorClick('+')}>+</Button>
                
                <Button variant="outline" onClick={handleToggleSign}>+/-</Button>
                <Button variant="secondary" onClick={() => handleDigitClick('0')}>0</Button>
                <Button variant="outline" onClick={handleDecimalClick}>.</Button>
                <Button onClick={handleEqualsClick}>=</Button>
            </div>
        </CardContent>
        </Card>
      </main>
    </div>
  );
}
