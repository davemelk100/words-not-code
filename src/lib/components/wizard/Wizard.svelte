<script lang="ts">
	import { onMount } from 'svelte';
	import { wizardStore } from '$lib/wizard-store.svelte';
	import HeroSlide from './HeroSlide.svelte';
	import Slide from './Slide.svelte';
	import OutputSlide from './OutputSlide.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import NavButtons from '$lib/components/ui/NavButtons.svelte';
	import CustomCursor from '$lib/components/ui/CustomCursor.svelte';

	let lastWheelTime = $state(0);
	let touchStartY = $state(0);
	let announceText = $state('');

	let showQuestionSlide = $derived(
		wizardStore.currentStep > 0 && !wizardStore.isOutputSlide
	);
	let showHero = $derived(wizardStore.currentStep === 0);
	let showOutput = $derived(wizardStore.isOutputSlide);
	let showNav = $derived(showQuestionSlide);

	function handleNext() {
		wizardStore.nextStep();
		updateAnnouncement();
	}

	function handlePrev() {
		wizardStore.prevStep();
		updateAnnouncement();
	}

	function updateAnnouncement() {
		if (wizardStore.currentQuestion) {
			announceText = `Question ${wizardStore.currentStep} of ${wizardStore.totalSteps}: ${wizardStore.currentQuestion.title}`;
		} else if (wizardStore.isOutputSlide) {
			announceText = 'Your blueprint is ready.';
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		// Don't intercept when user is typing in an input/textarea
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

		if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			e.preventDefault();
			handleNext();
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			e.preventDefault();
			handlePrev();
		}
	}

	function handleWheel(e: WheelEvent) {
		const now = Date.now();
		if (now - lastWheelTime < 300) return;
		lastWheelTime = now;

		if (e.deltaY > 0) {
			handleNext();
		} else if (e.deltaY < 0) {
			handlePrev();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchEnd(e: TouchEvent) {
		const deltaY = touchStartY - e.changedTouches[0].clientY;
		if (Math.abs(deltaY) < 50) return;

		if (deltaY > 0) {
			handleNext();
		} else {
			handlePrev();
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window
	onkeydown={handleKeyDown}
/>

<div
	class="relative h-[100dvh] w-full overflow-hidden"
	onwheel={handleWheel}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	role="application"
>
	<!-- Screen reader announcements -->
	<div class="sr-only" aria-live="polite" aria-atomic="true">
		{announceText}
	</div>

	{#if showHero}
		<HeroSlide onBegin={handleNext} />
	{/if}

	{#if showQuestionSlide && wizardStore.currentQuestion}
		{@const q = wizardStore.currentQuestion}
		{#key q.id}
			<Slide
				question={q}
				value={wizardStore.answers[q.id] ?? (q.inputType === 'check' ? [] : q.inputType === 'range' ? (q.rangeMin ?? 1) : '')}
				onAnswer={(v) => wizardStore.setAnswer(q.id, v)}
				direction={wizardStore.direction}
				decorationVariant={wizardStore.currentStep}
			/>
		{/key}
	{/if}

	{#if showOutput}
		<OutputSlide
			answers={wizardStore.answers}
			onReset={() => wizardStore.reset()}
		/>
	{/if}

	{#if showNav}
		<ProgressBar
			progress={wizardStore.progress}
			currentStep={wizardStore.currentStep}
			totalSteps={wizardStore.totalSteps}
		/>
		<NavButtons
			showBack={!wizardStore.isFirstStep}
			showNext={true}
			nextLabel={wizardStore.isLastQuestion ? 'Generate' : 'Next'}
			onBack={handlePrev}
			onNext={handleNext}
		/>
	{/if}

	<CustomCursor />
</div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
