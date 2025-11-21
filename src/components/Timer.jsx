import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ duration, onTimeUp, isActive = true, warningThreshold = 30 }) {
    const [timeLeft, setTimeLeft] = React.useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isWarning = timeLeft <= warningThreshold;

    return (
        <div className={`flex items-center gap-2 font-mono text-lg font-bold transition-colors ${isWarning ? 'text-red-600 animate-pulse' : 'text-slate-700'
            }`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
        </div>
    );
}
