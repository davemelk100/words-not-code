<script lang="ts">
	import type { QuestionOption } from '$lib/types';
	import AnimatedCheckmark from '$lib/components/ui/AnimatedCheckmark.svelte';

	let {
		options,
		value,
		onChange
	}: {
		options: QuestionOption[];
		value: string[];
		onChange: (value: string[]) => void;
	} = $props();

	function toggle(optionValue: string) {
		if (value.includes(optionValue)) {
			onChange(value.filter((v) => v !== optionValue));
		} else {
			onChange([...value, optionValue]);
		}
	}

	function handleKeyDown(e: KeyboardEvent, optionValue: string) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle(optionValue);
		}
	}
</script>

<div role="group" class="grid grid-cols-2 md:grid-cols-3 gap-4">
	{#each options as option}
		{@const isSelected = value.includes(option.value)}
		<button
			role="checkbox"
			aria-checked={isSelected}
			class="relative rounded-xl p-5 border text-left transition-all duration-200 ease-in-out min-h-[44px] cursor-pointer
				{isSelected
				? 'border-transparent border-b-gold-400 bg-dark-700 shadow-[0_0_16px_rgba(226,180,64,0.15)]'
				: 'border-dark-600 bg-dark-800'}
				focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
			onclick={() => toggle(option.value)}
			onkeydown={(e) => handleKeyDown(e, option.value)}
		>
			{#if isSelected}
				<div class="absolute top-2 right-2">
					<AnimatedCheckmark visible={true} size={22} />
				</div>
			{/if}

			{#if option.icon}
				<div class="text-2xl mb-2">{option.icon}</div>
			{/if}

			<div class="font-medium text-cream-50 text-sm md:text-base pr-6">
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
