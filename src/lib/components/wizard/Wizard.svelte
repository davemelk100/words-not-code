<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { wizardStore } from '$lib/wizard-store.svelte';
	import Slide from './Slide.svelte';
	import OutputSlide from './OutputSlide.svelte';
	import CustomCursor from '$lib/components/ui/CustomCursor.svelte';
	import SaveProgressModal from '$lib/components/ui/SaveProgressModal.svelte';

	let announceText = $state('');
	let scrollContainer: HTMLDivElement | undefined = $state();
	let saveLink = $state('');
	let showSaveModal = $state(false);
	let saving = $state(false);

	async function handleSave() {
		if (saving) return;
		saving = true;
		try {
			const res = await fetch('/api/save-progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					answers: wizardStore.answers,
					currentStep: wizardStore.currentStep
				})
			});
			const data = await res.json();
			if (res.ok) {
				saveLink = `${window.location.origin}/wizard?s=${data.id}`;
				showSaveModal = true;
			}
		} catch {
			// Silently fail — the button is unobtrusive
		} finally {
			saving = false;
		}
	}

	let showOutput = $derived(wizardStore.isOutputSlide);

	// All questions visible so far (up to currentStep)
	let visitedQuestions = $derived(
		wizardStore.visibleQuestions.slice(0, wizardStore.currentStep)
	);

	async function handleNext() {
		wizardStore.nextStep();
		updateAnnouncement();
		await tick();
		scrollToCurrentStep();
	}

	function handlePrev() {
		wizardStore.prevStep();
		updateAnnouncement();
		scrollToCurrentStep();
	}

	function scrollToCurrentStep() {
		if (!scrollContainer) return;
		const selector = wizardStore.isOutputSlide
			? '[data-step="output"]'
			: `[data-step="${wizardStore.currentStep}"]`;
		const target = scrollContainer.querySelector(selector);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function updateAnnouncement() {
		if (wizardStore.currentQuestion) {
			announceText = `Question ${wizardStore.currentStep} of ${wizardStore.totalSteps}: ${wizardStore.currentQuestion.title}`;
		} else if (wizardStore.isOutputSlide) {
			announceText = 'Your blueprint is ready.';
		}
	}

	// Prevent scrolling past the current question (free scroll on output)
	function handleScroll() {
		if (!scrollContainer || wizardStore.isOutputSlide) return;
		const currentEl = scrollContainer.querySelector(`[data-step="${wizardStore.currentStep}"]`) as HTMLElement | null;
		if (!currentEl) return;
		const maxScroll = currentEl.offsetTop + currentEl.offsetHeight - scrollContainer.clientHeight;
		if (scrollContainer.scrollTop > maxScroll) {
			scrollContainer.scrollTop = maxScroll;
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<div
	class="relative h-[100dvh] w-full"
	role="application"
>
	<!-- Screen reader announcements -->
	<div class="sr-only" aria-live="polite" aria-atomic="true">
		{announceText}
	</div>

	<div
			class="scroll-container h-[100dvh] w-full overflow-y-auto"
			bind:this={scrollContainer}
			onscroll={handleScroll}
		>
			{#each visitedQuestions as q, i (q.id)}
				{@const isCurrentStep = i + 1 === wizardStore.currentStep}
				<div data-step={i + 1}>
					<Slide
						question={q}
						value={wizardStore.answers[q.id] ?? (q.inputType === 'check' ? [] : q.inputType === 'range' ? (q.rangeMin ?? 1) : '')}
						onAnswer={(v) => wizardStore.setAnswer(q.id, v)}
						decorationVariant={i + 1}
						showBack={i > 0}
						showNext={isCurrentStep && !wizardStore.isOutputSlide}
						nextLabel={wizardStore.isLastQuestion && isCurrentStep ? 'Generate' : 'Next'}
						onBack={handlePrev}
						onNext={handleNext}
						onSave={isCurrentStep ? handleSave : undefined}
					/>
				</div>
			{/each}

			{#if showOutput}
				<div data-step="output">
					<OutputSlide
						answers={wizardStore.answers}
						onReset={() => wizardStore.reset()}
						onSave={handleSave}
					/>
				</div>
			{/if}
		</div>

	{#if showSaveModal}
		<SaveProgressModal
			link={saveLink}
			onClose={() => { showSaveModal = false; }}
		/>
	{/if}

	<CustomCursor />
</div>

<style>
	.scroll-container {
		scroll-behavior: auto;
		scrollbar-width: none;
	}

	.scroll-container::-webkit-scrollbar {
		display: none;
	}

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
