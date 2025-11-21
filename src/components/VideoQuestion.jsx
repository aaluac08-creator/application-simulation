import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, Square, Play, RotateCcw, AlertCircle } from 'lucide-react';
import Timer from './Timer';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

export default function VideoQuestion({ question, onComplete }) {
    const [step, setStep] = useState('prep'); // prep, recording, review
    const [mediaStream, setMediaStream] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const {
        transcript,
        isListening,
        isSupported: isSpeechSupported,
        startListening,
        stopListening
    } = useSpeechRecognition();

    // Initialize camera
    useEffect(() => {
        async function enableStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        }
        enableStream();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Re-attach stream when switching back to recording view (from review)
    useEffect(() => {
        if (step !== 'review' && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [step, mediaStream]);

    const startRecording = () => {
        setRecordedChunks([]);
        const recorder = new MediaRecorder(mediaStream);

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                setRecordedChunks((prev) => [...prev, e.data]);
            }
        };

        recorder.onstop = () => {
            // Create blob immediately when stopped
            // We handle the blob creation in the effect or a separate function to ensure chunks are ready
            // But for simplicity, we'll do it in the handleStopRecording or useEffect on chunks
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setStep('recording');

        if (isSpeechSupported) {
            startListening();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (isListening) {
            stopListening();
        }
        setStep('review');
    };

    // Create video URL when chunks change and we are in review mode
    useEffect(() => {
        if (step === 'review' && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [step, recordedChunks]);

    const handleSubmit = () => {
        // Create final blob
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        // Convert blob to base64 or just store blob URL? 
        // For this app, we'll store the Blob URL (which is temporary) or the Blob itself.
        // Storing Blob in context/state is fine for SPA.
        onComplete({
            type: 'video',
            videoBlob: blob,
            transcript: transcript
        });
    };

    const handleRetry = () => {
        setStep('prep');
        setVideoUrl(null);
        setRecordedChunks([]);
        // Transcript is reset by hook when starting listening again? 
        // Actually hook appends, so we might need to manually clear or just ignore previous.
        // The hook I wrote clears on startListening.
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Video className="w-3 h-3" />
                        Video Response
                    </span>
                    {step === 'prep' && (
                        <Timer duration={question.prepTime} onTimeUp={startRecording} isActive={true} />
                    )}
                    {step === 'recording' && (
                        <Timer duration={question.maxTime} onTimeUp={stopRecording} isActive={true} />
                    )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">{question.text}</h2>

                {step === 'prep' && (
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Recording will start automatically when prep time ends.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Area */}
                <div className="bg-black rounded-xl overflow-hidden aspect-video relative group">
                    {step === 'review' && videoUrl ? (
                        <video src={videoUrl} controls className="w-full h-full" />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full h-full object-cover transform scale-x-[-1] ${step === 'recording' ? 'ring-4 ring-red-500' : ''}`}
                        />
                    )}

                    {step === 'recording' && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            REC
                        </div>
                    )}
                </div>

                {/* Controls & Transcript */}
                <div className="flex flex-col gap-4">
                    {step === 'prep' && (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex-1 flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Prepare your answer</h3>
                            <p className="text-blue-700 mb-6 max-w-xs">Take a moment to gather your thoughts. You can start recording early if you're ready.</p>
                            <button
                                onClick={startRecording}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                                <div className="w-3 h-3 bg-red-500 rounded-full" />
                                Start Recording Now
                            </button>
                        </div>
                    )}

                    {step === 'recording' && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex-1 flex flex-col">
                            <div className="flex-1 mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Live Transcript</h3>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 h-48 overflow-y-auto text-slate-600 text-sm leading-relaxed">
                                    {transcript || <span className="text-slate-400 italic">Listening...</span>}
                                </div>
                            </div>
                            <button
                                onClick={stopRecording}
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <Square className="w-4 h-4 fill-current" />
                                Stop Recording
                            </button>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Review your response</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    Submit Response
                                </button>
                                {/* Optional Retry - usually not allowed in real exams but good for practice */}
                                <button
                                    onClick={handleRetry}
                                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Discard & Retry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
