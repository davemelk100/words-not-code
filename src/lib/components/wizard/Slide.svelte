<script lang="ts">
	import type { Question } from '$lib/types';
	import RadioCards from './inputs/RadioCards.svelte';
	import CheckToggles from './inputs/CheckToggles.svelte';
	import RangeSlider from './inputs/RangeSlider.svelte';
	import TextInput from './inputs/TextInput.svelte';
	import SlideDecoration from '$lib/components/ui/SlideDecoration.svelte';

	let {
		question,
		value,
		onAnswer,
		direction,
		decorationVariant
	}: {
		question: Question;
		value: string | string[] | number;
		onAnswer: (value: string | string[] | number) => void;
		direction: 1 | -1;
		decorationVariant: number;
	} = $props();
</script>

<div
	class="slide-container relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
	style="background: linear-gradient(135deg, {question.gradient[0]}, {question.gradient[1]});"
	class:slide-enter-forward={direction === 1}
	class:slide-enter-backward={direction === -1}
>
	<div class="relative z-10 mx-auto w-full max-w-3xl px-6 py-24">
		<h2
			class="slide-title font-serif text-3xl leading-tight text-gold-400 md:text-5xl"
			style="animation: slideStaggerIn 0.5s ease both;"
		>
			{question.title}
		</h2>

		{#if question.subtitle}
			<p
				class="mt-2 mb-8 text-lg text-cream-200"
				style="animation: slideStaggerIn 0.5s ease 0.1s both;"
			>
				{question.subtitle}
			</p>
		{:else}
			<div class="mb-8"></div>
		{/if}

		<div style="animation: slideStaggerIn 0.5s ease 0.2s both;">
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
	</div>

	<SlideDecoration variant={decorationVariant} />
</div>

<style>
	@keyframes slideStaggerIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Forward: emerge from the depth (small → full size) */
	@keyframes zoomInFromDepth {
		0% {
			opacity: 0;
			transform: scale(0.92);
			filter: blur(6px);
		}
		40% {
			opacity: 0.6;
			filter: blur(2px);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	/* Backward: return from foreground (large → full size) */
	@keyframes zoomOutFromForeground {
		0% {
			opacity: 0;
			transform: scale(1.06);
			filter: blur(6px);
		}
		40% {
			opacity: 0.6;
			filter: blur(2px);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	.slide-enter-forward {
		animation: zoomInFromDepth 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.slide-enter-backward {
		animation: zoomOutFromForeground 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.slide-container {
		perspective: 1000px;
	}
</style>
