import { getVisibleQuestions } from './questions';
import type { Answers } from './types';

let answers = $state<Answers>({});
let currentStep = $state(1);
let direction = $state<1 | -1>(1);

let visibleQuestions = $derived(getVisibleQuestions(answers));
let totalSteps = $derived(visibleQuestions.length);
let progress = $derived(currentStep <= 0 ? 0 : Math.min(currentStep / totalSteps, 1));
let currentQuestion = $derived(
	currentStep > 0 && currentStep <= totalSteps ? visibleQuestions[currentStep - 1] : null
);
let isFirstStep = $derived(currentStep <= 1);
let isLastQuestion = $derived(currentStep >= totalSteps);
let isOutputSlide = $derived(currentStep > totalSteps);

export const wizardStore = {
	get answers() {
		return answers;
	},
	get currentStep() {
		return currentStep;
	},
	get direction() {
		return direction;
	},
	get visibleQuestions() {
		return visibleQuestions;
	},
	get totalSteps() {
		return totalSteps;
	},
	get progress() {
		return progress;
	},
	get currentQuestion() {
		return currentQuestion;
	},
	get isFirstStep() {
		return isFirstStep;
	},
	get isLastQuestion() {
		return isLastQuestion;
	},
	get isOutputSlide() {
		return isOutputSlide;
	},

	setAnswer(questionId: string, value: string | string[] | number) {
		answers = { ...answers, [questionId]: value };
	},

	nextStep() {
		direction = 1;
		if (currentStep <= totalSteps) {
			currentStep++;
		}
	},

	prevStep() {
		direction = -1;
		if (currentStep > 1) {
			currentStep--;
		}
	},

	goToStep(step: number) {
		direction = step > currentStep ? 1 : -1;
		currentStep = Math.max(1, Math.min(step, totalSteps + 1));
	},

	reset() {
		answers = {};
		currentStep = 1;
		direction = 1;
	}
};
