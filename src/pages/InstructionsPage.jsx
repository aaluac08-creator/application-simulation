import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { Camera, Mic, CheckCircle, AlertCircle, ArrowRight, Video, FileText } from 'lucide-react';

export default function InstructionsPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useAssessment();
    const [hasPermissions, setHasPermissions] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!state.currentProgram) {
            navigate('/');
        }
    }, [state.currentProgram, navigate]);

    const checkPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setHasPermissions(true);
            setError(null);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Stop tracks after check to release camera until actual assessment
            // setTimeout(() => {
            //   stream.getTracks().forEach(track => track.stop());
            // }, 5000); 
            // Actually, let's keep it open for the user to see themselves in the "test" box

        } catch (err) {
            console.error("Permission error:", err);
            setHasPermissions(false);
            setError('Could not access camera or microphone. Please allow permissions to continue.');
        }
    };

    const startAssessment = () => {
        // Stop the preview stream before navigating
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        dispatch({ type: 'START_ASSESSMENT' });
        navigate('/assessment');
    };

    if (!state.currentProgram) return null;

    return (
        <div className="max-w-3xl mx-auto py-8 sm:py-12">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Assessment Instructions
                    </h1>
                    <p className="text-slate-600">
                        You are about to begin the assessment for <span className="font-semibold text-blue-600">{state.currentProgram.name}</span>.
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</div>
                            System Check
                        </h2>

                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-full md:w-1/2 aspect-video bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                                    {hasPermissions ? (
                                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                                    ) : (
                                        <div className="text-slate-500 flex flex-col items-center gap-2">
                                            <Camera className="w-8 h-8" />
                                            <span className="text-sm">Camera Preview</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${hasPermissions ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                            <Camera className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">Camera Access</span>
                                        {hasPermissions && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${hasPermissions ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                            <Mic className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">Microphone Access</span>
                                        {hasPermissions && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                                    </div>

                                    {!hasPermissions && (
                                        <button
                                            onClick={checkPermissions}
                                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                                        >
                                            Check Permissions
                                        </button>
                                    )}

                                    {error && (
                                        <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</div>
                            Format Overview
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                                    <Video className="w-4 h-4 text-purple-500" /> Video Questions
                                </h3>
                                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                                    <li>30-60 seconds preparation</li>
                                    <li>90-120 seconds to record</li>
                                    <li>One take only (simulated)</li>
                                </ul>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" /> Written Responses
                                </h3>
                                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                                    <li>5-10 minutes per question</li>
                                    <li>250-500 word limit</li>
                                    <li>Auto-submits when time is up</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={startAssessment}
                        disabled={!hasPermissions}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-white transition-all ${hasPermissions
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-slate-300 cursor-not-allowed'
                            }`}
                    >
                        Start Assessment
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
