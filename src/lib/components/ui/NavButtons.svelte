<script lang="ts">
	import ArrowLeftIcon from '$lib/components/icons/ArrowLeftIcon.svelte';
	import ArrowRightIcon from '$lib/components/icons/ArrowRightIcon.svelte';

	let {
		showBack = true,
		showNext = true,
		nextLabel = 'Next',
		onBack,
		onNext
	}: {
		showBack?: boolean;
		showNext?: boolean;
		nextLabel?: string;
		onBack?: () => void;
		onNext?: () => void;
	} = $props();
</script>

<div class="flex items-center justify-center gap-4 pt-8">
	<div>
		{#if showBack}
			<button
				type="button"
				onclick={onBack}
				class="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
			>
				<ArrowLeftIcon size={16} />
				<span>Back</span>
			</button>
		{/if}
	</div>
	<div>
		{#if showNext}
			<button
				type="button"
				onclick={onNext}
				class="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-black transition-colors hover:brightness-110"
				style="background-color: #D4A843;"
			>
				<span>{nextLabel}</span>
				<ArrowRightIcon size={16} />
			</button>
		{/if}
	</div>
</div>
