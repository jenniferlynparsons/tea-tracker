import React, { useState, useEffect, useCallback } from 'react';
import { Tea, TeaType } from '../types/Tea';
import '../styles/TeaTimer.css';

interface TeaTimerProps {
  tea: Tea;
  onComplete: (amount: number) => void;
  onCancel: () => void;
}

const TeaTimer: React.FC<TeaTimerProps> = ({ tea, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(tea.brewingInstructions.steepTimeInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState(timeLeft);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playAlertSound();
      showNotification();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playAlertSound = () => {
    // Create a simple beep using Web Audio API as fallback
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  };

  const showNotification = () => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Tea Timer', {
          body: `Your ${tea.name} is ready!`,
        });
      }
    } catch (error) {
      console.warn('Could not show notification:', error);
    }
  };

  const handleStart = () => {
    if (amount > tea.amount) {
      alert('Not enough tea left!');
      return;
    }
    setIsRunning(true);
  };

  const handleComplete = () => {
    onComplete(amount);
  };

  const progress = ((tea.brewingInstructions.steepTimeInSeconds - timeLeft) / 
                    tea.brewingInstructions.steepTimeInSeconds) * 100;

  return (
    <div className="tea-timer" role="complementary" aria-label="Tea brewing timer">
      <div className="timer-display" aria-live="polite">
        <div className="progress-ring" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="time-left">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="timer-controls">
        <div className="amount-control">
          <label htmlFor="amount-input">Amount to use ({tea.unit}):</label>
          <input
            id="amount-input"
            type="number"
            min="1"
            max={tea.amount}
            value={amount}
            onChange={(e) => setAmount(Math.min(parseInt(e.target.value), tea.amount))}
            aria-describedby="amount-available"
          />
          <span id="amount-available" className="max-amount">Available: {tea.amount}</span>
        </div>

        <div className="custom-time">
          <label>Steep Time (minutes):</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={customTime / 60}
            onChange={(e) => {
              const newTime = Math.max(30, Math.min(900, parseFloat(e.target.value) * 60));
              setCustomTime(newTime);
              if (!isRunning) setTimeLeft(newTime);
            }}
          />
        </div>

        <div className="buttons">
          {!isRunning ? (
            <button onClick={handleStart} className="btn btn-primary">
              Start Brewing
            </button>
          ) : (
            <button onClick={() => setIsRunning(false)} className="btn btn-secondary">
              Pause
            </button>
          )}
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          {timeLeft === 0 && (
            <button onClick={handleComplete} className="btn btn-success">
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeaTimer;
