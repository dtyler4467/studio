
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
      case '/': return a / b;
      default: return b;
    }
  };
  
  const handleEqualsClick = () => {
    if (operator && currentValue !== null) {
        const inputValue = parseFloat(display);
        const result = calculate(currentValue, inputValue, operator);
        setCurrentValue(null);
        setDisplay(String(result));
        setOperator(null);
        setWaitingForOperand(true);
    }
  };
  
  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };
  
  const handleDecimalClick = () => {
      if (!display.includes('.')) {
          setDisplay(display + '.');
      }
  };


  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Calculator" />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-xs">
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
                className="text-right text-3xl font-mono h-16" 
                value={display} 
                readOnly 
            />
            <div className="grid grid-cols-4 gap-2">
                 <Button variant="outline" className="col-span-2" onClick={handleClear}>C</Button>
                 <Button variant="outline" onClick={() => handleOperatorClick('/')}>/</Button>
                 <Button variant="outline" onClick={() => handleOperatorClick('*')}>*</Button>
            
                <Button variant="outline" onClick={() => handleDigitClick('7')}>7</Button>
                <Button variant="outline" onClick={() => handleDigitClick('8')}>8</Button>
                <Button variant="outline" onClick={() => handleDigitClick('9')}>9</Button>
                 <Button variant="outline" onClick={() => handleOperatorClick('-')}>-</Button>
                
                 <Button variant="outline" onClick={() => handleDigitClick('4')}>4</Button>
                 <Button variant="outline" onClick={() => handleDigitClick('5')}>5</Button>
                 <Button variant="outline" onClick={() => handleDigitClick('6')}>6</Button>
                 <Button variant="outline" onClick={() => handleOperatorClick('+')}>+</Button>
                 
                <div className="col-span-3 grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => handleDigitClick('1')}>1</Button>
                    <Button variant="outline" onClick={() => handleDigitClick('2')}>2</Button>
                    <Button variant="outline" onClick={() => handleDigitClick('3')}>3</Button>
                    <Button variant="outline" className="col-span-2" onClick={() => handleDigitClick('0')}>0</Button>
                    <Button variant="outline" onClick={handleDecimalClick}>.</Button>
                </div>
                 <Button className="row-span-2 h-full" onClick={handleEqualsClick}>=</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

