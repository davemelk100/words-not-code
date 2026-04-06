<script lang="ts">
	import type { QuestionOption } from '$lib/types';
	import AnimatedCheckmark from '$lib/components/ui/AnimatedCheckmark.svelte';

	let {
		options,
		value,
		onChange
	}: {
		options: QuestionOption[];
		value: string;
		onChange: (value: string) => void;
	} = $props();

	let focusedIndex = $state(0);
	let cardRefs: HTMLElement[] = $state([]);
	let justSelected = $state('');

	function handleKeyDown(e: KeyboardEvent) {
		let newIndex = focusedIndex;

		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			newIndex = (focusedIndex + 1) % options.length;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			newIndex = (focusedIndex - 1 + options.length) % options.length;
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			select(options[focusedIndex].value);
			return;
		} else {
			return;
		}

		focusedIndex = newIndex;
		cardRefs[newIndex]?.focus();
	}

	function select(val: string) {
		justSelected = val;
		onChange(val);
		setTimeout(() => {
			justSelected = '';
		}, 300);
	}
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	role="radiogroup"
	class="flex flex-wrap justify-center gap-4"
	onkeydown={handleKeyDown}
>
	{#each options as option, i}
		{@const isSelected = value === option.value}
		{@const hasPulse = justSelected === option.value}
		<button
			bind:this={cardRefs[i]}
			role="radio"
			aria-checked={isSelected}
			tabindex={focusedIndex === i ? 0 : -1}
			class="relative flex flex-col items-center rounded-xl p-5 border text-center transition-all duration-200 ease-in-out min-h-[44px] w-[calc(33.333%-1rem)] min-w-[140px] cursor-pointer
				{isSelected
				? 'border-transparent border-b-gold-400 bg-dark-700 shadow-[0_0_16px_rgba(226,180,64,0.15)]'
				: 'border-dark-600 bg-dark-800'}
				{value && !isSelected ? 'opacity-70' : 'opacity-100'}
				focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
			style={hasPulse ? 'transform: scale(1.02);' : ''}
			onclick={() => {
				focusedIndex = i;
				select(option.value);
			}}
			onfocus={() => (focusedIndex = i)}
		>
			{#if isSelected}
				<div class="absolute top-2 right-2">
					<AnimatedCheckmark visible={true} size={24} />
				</div>
			{/if}

			{#if option.icon}
				<div class="text-5xl mb-3">{option.icon}</div>
			{/if}

			<div class="font-medium text-cream-50 text-sm md:text-base">
				{option.label}
			</div>

			{#if option.description}
				<div class="text-cream-300 text-xs md:text-sm mt-1 leading-relaxed">
					{option.description}
				</div>
			{/if}
		</button>
	{/each}
</div>
