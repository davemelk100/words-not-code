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

<div role="group" class="flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-4">
	{#each options as option}
		{@const isSelected = value.includes(option.value)}
		<button
			role="checkbox"
			aria-checked={isSelected}
			class="glass-card relative flex flex-row items-center rounded-xl p-4 border text-left transition-all duration-200 ease-in-out min-h-[44px] w-full cursor-pointer md:w-[calc(33.333%-1rem)] md:min-w-[140px] md:flex-col md:p-5 md:text-center
				{isSelected
				? 'border-white/20 shadow-[0_0_20px_rgba(226,180,64,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]'
				: 'border-white/[0.08]'}
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
				<div class="text-3xl mr-3 md:mr-0 md:mb-3 md:text-5xl">{option.icon}</div>
			{/if}

			<div class="flex flex-col md:items-center">
				<div class="font-medium text-cream-50 text-sm md:text-base">
					{option.label}
				</div>

				{#if option.description}
					<div class="text-cream-300 text-xs md:text-sm mt-0.5 md:mt-1 leading-relaxed">
						{option.description}
					</div>
				{/if}
			</div>
		</button>
	{/each}
</div>

<style>
	.glass-card {
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 24px rgba(0, 0, 0, 0.2);
	}

	.glass-card:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.15);
	}
</style>
