'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function PomodoroApp() {
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [initialTime, setInitialTime] = useState(25 * 60); // Track the initial time set
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState('25');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const toggleTimer = () => {
    if (!isActive && time === initialTime) {
      // If starting a new session, update initialTime
      setInitialTime(time);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(parseInt(customTime) * 60);
    setInitialTime(parseInt(customTime) * 60);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && parseInt(value) <= 120) {
      setCustomTime(value);
    }
  };

  const handleCustomTimeSet = () => {
    if (customTime) {
      const newTime = parseInt(customTime) * 60;
      setTime(newTime);
      setInitialTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return ((initialTime - time) / initialTime) * 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pomodoro Study App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-center">
            {formatTime(time)}
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={toggleTimer}>
              {isActive ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          {isActive ? (
            <Progress value={calculateProgress()} className="w-full" />
          ) : (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Custom time (minutes)"
                value={customTime}
                onChange={handleCustomTimeChange}
                className="flex-grow"
              />
              <Button onClick={handleCustomTimeSet}>Set</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
