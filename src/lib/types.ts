export type InputType = 'radio' | 'check' | 'range' | 'text';

export interface QuestionOption {
	value: string;
	label: string;
	description?: string;
	icon?: string;
}

export interface Question {
	id: string;
	step: number;
	title: string;
	subtitle?: string;
	inputType: InputType;
	options?: QuestionOption[];
	rangeMin?: number;
	rangeMax?: number;
	rangeStep?: number;
	rangeLabels?: Record<number, string>;
	rangeDescriptions?: Record<number, string>;
	placeholder?: string;
	required: boolean;
	condition?: (answers: Answers) => boolean;
	gradient: [string, string];
}

export type Answers = Record<string, string | string[] | number>;

export interface WizardState {
	answers: Answers;
	currentStep: number;
	direction: 1 | -1;
}
