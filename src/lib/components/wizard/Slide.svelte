<script lang="ts">
	import type { Question } from '$lib/types';
	import RadioCards from './inputs/RadioCards.svelte';
	import CheckToggles from './inputs/CheckToggles.svelte';
	import RangeSlider from './inputs/RangeSlider.svelte';
	import TextInput from './inputs/TextInput.svelte';
	import SlideDecoration from '$lib/components/ui/SlideDecoration.svelte';
	import NavButtons from '$lib/components/ui/NavButtons.svelte';

	let {
		question,
		value,
		onAnswer,
		decorationVariant,
		showBack = false,
		showNext = true,
		nextLabel = 'Next',
		onBack,
		onNext,
		onSave
	}: {
		question: Question;
		value: string | string[] | number;
		onAnswer: (value: string | string[] | number) => void;
		decorationVariant: number;
		showBack?: boolean;
		showNext?: boolean;
		nextLabel?: string;
		onBack?: () => void;
		onNext?: () => void;
		onSave?: () => void;
	} = $props();
</script>

<div
	class="relative flex min-h-[100dvh] w-full flex-col items-center justify-start md:justify-center"
	style="background: linear-gradient(135deg, {question.gradient[0]}, {question.gradient[1]});"
>
	<div class="relative z-10 mx-auto w-full max-w-3xl px-3 py-6 text-center md:px-6 md:py-16">
		<a href="/">
			<img src="/wnc-logo.svg" alt="Words, Not Code" class="mx-auto mb-4 w-32 md:mb-10 md:w-56" />
		</a>
		<h2
			class="text-3xl font-light leading-tight text-gold-400 md:text-5xl"
			style="font-family: var(--font-heading);"
		>
			{question.title}
		</h2>

		{#if question.subtitle}
			<p class="mt-3 mb-10 text-lg text-cream-200">
				{question.subtitle}
			</p>
		{:else}
			<div class="mb-10"></div>
		{/if}

		<div>
			{#if question.inputType === 'radio' && question.options}
				<RadioCards
					options={question.options}
					value={typeof value === 'string' ? value : ''}
					onChange={(v) => onAnswer(v)}
				/>
			{:else if question.inputType === 'check' && question.options}
				<CheckToggles
					options={question.options}
					value={Array.isArray(value) ? value : []}
					onChange={(v) => onAnswer(v)}
				/>
			{:else if question.inputType === 'range'}
				<RangeSlider
					min={question.rangeMin ?? 1}
					max={question.rangeMax ?? 5}
					step={question.rangeStep ?? 1}
					value={typeof value === 'number' ? value : question.rangeMin ?? 1}
					labels={question.rangeLabels}
					descriptions={question.rangeDescriptions}
					onChange={(v) => onAnswer(v)}
				/>
			{:else if question.inputType === 'text'}
				<TextInput
					value={typeof value === 'string' ? value : ''}
					placeholder={question.placeholder}
					onChange={(v) => onAnswer(v)}
				/>
			{/if}
		</div>

		<NavButtons
			{showBack}
			{showNext}
			{nextLabel}
			{onBack}
			{onNext}
		/>

		{#if onSave}
			<div class="mt-4">
				<button
					type="button"
					onclick={onSave}
					class="text-xs text-white/40 underline decoration-white/20 transition-colors hover:text-white/70 hover:decoration-white/40"
				>
					Save progress for later
				</button>
			</div>
		{/if}
	</div>

	<SlideDecoration variant={decorationVariant} />
</div>
