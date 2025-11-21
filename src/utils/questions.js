export const PROGRAMS = [
    {
        id: 'waterloo-eng',
        name: 'Waterloo Engineering',
        university: 'University of Waterloo',
        color: 'bg-purple-600',
        description: 'Video interview and written response assessment for engineering applicants.',
        questions: [
            {
                id: 'we-v1',
                type: 'video',
                text: 'Describe a technical project where you encountered an unexpected problem. How did you approach solving it?',
                prepTime: 30,
                maxTime: 120,
            },
            {
                id: 'we-v2',
                type: 'video',
                text: 'Why do you want to study this specific engineering discipline? What unique perspective will you bring to the cohort?',
                prepTime: 30,
                maxTime: 120,
            },
            {
                id: 'we-w1',
                type: 'written',
                text: 'Design a solution to reduce food waste on university campuses. Consider logistics, cost, and student engagement.',
                maxTime: 300, // 5 minutes
            }
        ]
    },
    {
        id: 'ubc-sauder',
        name: 'UBC Sauder School of Business',
        university: 'University of British Columbia',
        color: 'bg-blue-600',
        description: 'Personal profile video and written responses for BCom applicants.',
        questions: [
            {
                id: 'us-v1',
                type: 'video',
                text: 'Tell us about a time you demonstrated leadership in a team setting. What was the outcome?',
                prepTime: 30,
                maxTime: 90,
            },
            {
                id: 'us-v2',
                type: 'video',
                text: 'Describe an ethical dilemma you faced and how you resolved it.',
                prepTime: 30,
                maxTime: 90,
            },
            {
                id: 'us-w1',
                type: 'written',
                text: 'Analyze a current business trend and its potential impact on Canadian markets over the next 5 years.',
                maxTime: 300,
            }
        ]
    },
    {
        id: 'western-ivey',
        name: 'Ivey Business School',
        university: 'Western University',
        color: 'bg-green-700',
        description: 'Assessment focusing on leadership, character, and communication.',
        questions: [
            {
                id: 'wi-v1',
                type: 'video',
                text: 'What is the most significant challenge you have overcome? What did you learn about yourself?',
                prepTime: 60,
                maxTime: 120,
            },
            {
                id: 'wi-w1',
                type: 'written',
                text: 'Describe a time when you had to persuade others to adopt your point of view. What strategy did you use?',
                maxTime: 300,
            }
        ]
    },
    {
        id: 'queens-health',
        name: 'Health Sciences',
        university: "Queen's University",
        color: 'bg-red-700',
        description: 'Supplementary application focusing on empathy and critical thinking.',
        questions: [
            {
                id: 'qh-v1',
                type: 'video',
                text: 'Describe your understanding of what makes an effective healthcare professional beyond medical knowledge.',
                prepTime: 30,
                maxTime: 120,
            },
            {
                id: 'qh-w1',
                type: 'written',
                text: 'Discuss the balance between technology and human connection in modern healthcare.',
                maxTime: 600, // 10 minutes
            }
        ]
    },
    {
        id: 'rotman-commerce',
        name: 'Rotman Commerce',
        university: 'University of Toronto',
        color: 'bg-slate-800',
        description: 'Video interview and written response for business and finance applicants.',
        questions: [
            {
                id: 'rc-v1',
                type: 'video',
                text: 'Why have you chosen to apply to the Rotman Commerce program? How does it align with your future goals?',
                prepTime: 60,
                maxTime: 120,
            },
            {
                id: 'rc-v2',
                type: 'video',
                text: 'Describe a situation where you had to work with someone who had a different perspective. How did you handle it?',
                prepTime: 45,
                maxTime: 90,
            },
            {
                id: 'rc-w1',
                type: 'written',
                text: 'Identify a current global economic challenge. How do you think businesses should adapt to address this challenge?',
                maxTime: 1200, // 20 minutes
            }
        ]
    },
    {
        id: 'queens-comm',
        name: 'Smith Commerce',
        university: "Queen's University",
        color: 'bg-yellow-600',
        description: 'Personal Statement and Essay focusing on leadership, diversity, and impact.',
        questions: [
            {
                id: 'qc-v1',
                type: 'video',
                text: 'What does inclusive leadership mean to you? Provide an example of how you have demonstrated this.',
                prepTime: 30,
                maxTime: 90,
            },
            {
                id: 'qc-v2',
                type: 'video',
                text: 'Tell us about a time you failed or faced a significant setback. What did you learn from the experience?',
                prepTime: 30,
                maxTime: 90,
            },
            {
                id: 'qc-w1',
                type: 'written',
                text: 'Describe a community you are part of. What has been your contribution to this community?',
                maxTime: 600, // 10 minutes
            }
        ]
    }
];
