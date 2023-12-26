import { create } from "zustand";
import { Question } from "../interfaces/types";
import confetti from "canvas-confetti";
import { persist, devtools } from "zustand/middleware";

interface State {
	questions: Question[];
	currentQuestion: number;
	fetchQuestions: (limit: number) => Promise<void>;
	selectAnswer: (questionId: number, answerIndex: number) => void;
	goNextQuestion: () => void;
	goPreviosQuestion: () => void;
	reset: () => void;
}

export const useQuestionsStore = create<State>()(
	devtools(
		persist(
			(set, get) => {
				return {
					questions: [],
					currentQuestion: 0,
					fetchQuestions: async (limit: number) => {
						const res = await fetch("http://localhost:5173/data.json");
						const json = await res.json();
						const questions = json
							.sort(() => Math.random() - 0.5)
							.slice(0, limit);
						set({ questions }, false, 'fetch-questions');
					},
					selectAnswer: (questionId: number, answerIndex: number) => {
						const { questions } = get();
						const newQuestions = structuredClone(questions);

						const questionIndex = newQuestions.findIndex(
							(q) => q.id === questionId,
						);
						const questionInfo = newQuestions[questionIndex];

						const isCorrectUserAnswer =
							questionInfo.correctAnswer === answerIndex;
						if (isCorrectUserAnswer) confetti();

						newQuestions[questionIndex] = {
							...questionInfo,
							isCorrectUserAnswer,
							userSelectedAnswer: answerIndex,
						};
						set({ questions: newQuestions }, false , 'select-answer');
					},
					goNextQuestion: () => {
						const { currentQuestion, questions } = get();
						const nextQuestion = currentQuestion + 1;

						if (nextQuestion < questions.length) {
							set({ currentQuestion: nextQuestion }, false, 'next-question');
						}
					},
					goPreviosQuestion: () => {
						const { currentQuestion } = get();
						const nextQuestion = currentQuestion - 1;

						if (nextQuestion >= 0) {
							set({ currentQuestion: nextQuestion }, false, 'previous-question');
						}
					},
					reset: () => {
						set({ questions: [], currentQuestion: 0 }, false, 'reset');
					},
				};
			},
			{
				name: "questions",
			},
		),
		{
			name:'questions'
		}
	),
);
