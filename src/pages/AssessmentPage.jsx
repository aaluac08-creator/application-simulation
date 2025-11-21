import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import VideoQuestion from '../components/VideoQuestion';
import WrittenQuestion from '../components/WrittenQuestion';

export default function AssessmentPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useAssessment();
    const { currentProgram, currentQuestionIndex, responses } = state;

    useEffect(() => {
        if (!currentProgram) {
            navigate('/');
        }
    }, [currentProgram, navigate]);

    if (!currentProgram) return null;

    const questions = currentProgram.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    const handleQuestionComplete = (response) => {
        // Save response
        dispatch({
            type: 'SAVE_RESPONSE',
            payload: {
                questionId: currentQuestion.id,
                response: {
                    ...response,
                    questionText: currentQuestion.text,
                    timestamp: new Date().toISOString()
                }
            }
        });

        // Move to next question or finish
        if (currentQuestionIndex < questions.length - 1) {
            dispatch({ type: 'NEXT_QUESTION' });
        } else {
            dispatch({ type: 'FINISH_ASSESSMENT' });
            navigate('/results');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {currentQuestion.type === 'video' ? (
                <VideoQuestion
                    key={currentQuestion.id} // Key ensures component resets on new question
                    question={currentQuestion}
                    onComplete={handleQuestionComplete}
                />
            ) : (
                <WrittenQuestion
                    key={currentQuestion.id}
                    question={currentQuestion}
                    onComplete={handleQuestionComplete}
                />
            )}
        </div>
    );
}
