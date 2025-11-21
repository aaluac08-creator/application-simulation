import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { CheckCircle, Video, FileText, Download, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { generateFeedback } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function ResultsPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useAssessment();
    const { currentProgram, responses } = state;
    const [feedbacks, setFeedbacks] = useState({});
    const [loadingFeedback, setLoadingFeedback] = useState({});

    useEffect(() => {
        if (!currentProgram || Object.keys(responses).length === 0) {
            navigate('/');
        }
    }, [currentProgram, responses, navigate]);

    const handleGenerateFeedback = async (questionId, questionText, response, type) => {
        setLoadingFeedback(prev => ({ ...prev, [questionId]: true }));

        const responseText = type === 'video' ? response.transcript : response.text;

        if (!responseText || (type === 'video' && responseText.length < 10)) {
            setFeedbacks(prev => ({
                ...prev,
                [questionId]: "Not enough content to generate feedback. Please ensure you have a clear transcript or written response."
            }));
            setLoadingFeedback(prev => ({ ...prev, [questionId]: false }));
            return;
        }

        const feedback = await generateFeedback(questionText, responseText, type);

        setFeedbacks(prev => ({ ...prev, [questionId]: feedback }));
        setLoadingFeedback(prev => ({ ...prev, [questionId]: false }));
    };

    if (!currentProgram) return null;

    const handleRestart = () => {
        dispatch({ type: 'RESET_ASSESSMENT' });
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Assessment Completed!</h1>
                <p className="text-slate-600">
                    You have successfully completed the practice assessment for <span className="font-semibold">{currentProgram.name}</span>.
                </p>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Your Responses</h2>
                    {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            <Download className="w-4 h-4" />
            Download Report (PDF)
          </button> */}
                </div>

                {currentProgram.questions.map((question, index) => {
                    const response = responses[question.id];
                    if (!response) return null;

                    return (
                        <div key={question.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                            Question {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-slate-900">{question.text}</h3>
                                    </div>
                                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${question.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {question.type === 'video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                        {question.type === 'video' ? 'Video Response' : 'Written Response'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {question.type === 'video' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
                                            {response.videoBlob && (
                                                <video
                                                    src={URL.createObjectURL(response.videoBlob)}
                                                    controls
                                                    className="w-full h-full"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Transcript</h4>
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600 h-full max-h-48 overflow-y-auto italic">
                                                "{response.transcript || 'No transcript available.'}"
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                                            {response.text}
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500 text-right">
                                            Word Count: {response.wordCount}
                                        </div>
                                    </div>
                                )}

                                {/* AI Feedback Section */}
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    {!feedbacks[question.id] && !loadingFeedback[question.id] && (
                                        <button
                                            onClick={() => handleGenerateFeedback(question.id, question.text, response, question.type)}
                                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Get AI Feedback
                                        </button>
                                    )}

                                    {loadingFeedback[question.id] && (
                                        <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Analyzing your response...
                                        </div>
                                    )}

                                    {feedbacks[question.id] && (
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                            <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                AI Feedback
                                            </h4>
                                            <div className="text-sm text-slate-700 leading-relaxed">
                                                <ReactMarkdown
                                                    components={{
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                        strong: ({ node, ...props }) => <span className="font-semibold text-blue-900" {...props} />,
                                                    }}
                                                >
                                                    {feedbacks[question.id]}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={handleRestart}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try Another Program
                </button>
            </div>
        </div>
    );
}
