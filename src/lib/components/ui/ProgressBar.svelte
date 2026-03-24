<script lang="ts">
	let {
		progress = 0,
		currentStep = 0,
		totalSteps = 0
	}: { progress?: number; currentStep?: number; totalSteps?: number } = $props();
</script>

<div class="fixed top-0 left-0 right-0 z-50">
	<div class="h-1 w-full bg-white/10">
		<div
			class="h-full transition-all duration-300 ease-out"
			style="width: {Math.min(Math.max(progress, 0), 1) * 100}%; background-color: #D4A843;"
		></div>
	</div>
	{#if totalSteps > 0}
		<div class="flex justify-end px-4 py-1">
			<span class="text-xs text-white/50">{currentStep} of {totalSteps}</span>
		</div>
	{/if}
</div>
