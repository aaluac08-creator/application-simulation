import React, { createContext, useContext, useState, useReducer } from 'react';

const AssessmentContext = createContext();

const initialState = {
    currentProgram: null,
    questions: [],
    responses: {}, // { questionId: { type: 'video' | 'text', content: string | blobUrl, duration: number } }
    currentStep: 0, // 0: Landing, 1: Instructions, 2: Assessment, 3: Results
    currentQuestionIndex: 0,
    isRecording: false,
    timeLeft: 0,
};

function assessmentReducer(state, action) {
    switch (action.type) {
        case 'SELECT_PROGRAM':
            return { ...state, currentProgram: action.payload, currentStep: 1 };
        case 'START_ASSESSMENT':
            return { ...state, currentStep: 2, currentQuestionIndex: 0 };
        case 'NEXT_QUESTION':
            return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
        case 'SAVE_RESPONSE':
            return {
                ...state,
                responses: {
                    ...state.responses,
                    [action.payload.questionId]: action.payload.response,
                },
            };
        case 'FINISH_ASSESSMENT':
            return { ...state, currentStep: 3 };
        case 'RESET_ASSESSMENT':
            return initialState;
        default:
            return state;
    }
}

export function AssessmentProvider({ children }) {
    const [state, dispatch] = useReducer(assessmentReducer, initialState);

    return (
        <AssessmentContext.Provider value={{ state, dispatch }}>
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (!context) {
        throw new Error('useAssessment must be used within an AssessmentProvider');
    }
    return context;
}
