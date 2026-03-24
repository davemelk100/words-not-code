<script lang="ts">
	let {
		min,
		max,
		step,
		value,
		labels,
		descriptions,
		onChange
	}: {
		min: number;
		max: number;
		step: number;
		value: number;
		labels?: Record<number, string>;
		descriptions?: Record<number, string>;
		onChange: (value: number) => void;
	} = $props();

	let steps = $derived.by(() => {
		const s: number[] = [];
		for (let i = min; i <= max; i += step) {
			s.push(i);
		}
		return s;
	});

	let fillPercent = $derived(((value - min) / (max - min)) * 100);

	let currentDescription = $derived(descriptions?.[value] ?? '');

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onChange(Number(target.value));
	}
</script>

<div class="w-full">
	<div class="relative px-1">
		<input
			type="range"
			{min}
			{max}
			{step}
			{value}
			oninput={handleInput}
			class="range-slider w-full"
			style="--fill: {fillPercent}%"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			aria-valuetext={labels?.[value] ?? String(value)}
		/>
	</div>

	{#if labels}
		<div class="relative flex justify-between mt-3 px-1">
			{#each steps as s}
				{@const isActive = s === value}
				<span
					class="text-xs md:text-sm font-medium transition-colors duration-200
						{isActive ? 'text-gold-400' : 'text-cream-300'}"
				>
					{labels[s] ?? s}
				</span>
			{/each}
		</div>
	{/if}

	{#if currentDescription}
		<p class="text-cream-300 text-sm mt-4 text-center transition-all duration-200">
			{currentDescription}
		</p>
	{/if}
</div>

<style>
	.range-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(
			to right,
			var(--color-gold-400) 0%,
			var(--color-gold-400) var(--fill),
			var(--color-dark-600) var(--fill),
			var(--color-dark-600) 100%
		);
		outline: none;
		cursor: pointer;
	}

	.range-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-gold-400);
		border: 2px solid var(--color-gold-300);
		cursor: pointer;
		transition: transform 0.15s ease;
		box-shadow: 0 0 8px rgba(226, 180, 64, 0.3);
	}

	.range-slider::-webkit-slider-thumb:active {
		transform: scale(1.2);
	}

	.range-slider::-moz-range-thumb {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-gold-400);
		border: 2px solid var(--color-gold-300);
		cursor: pointer;
		transition: transform 0.15s ease;
		box-shadow: 0 0 8px rgba(226, 180, 64, 0.3);
	}

	.range-slider::-moz-range-thumb:active {
		transform: scale(1.2);
	}

	.range-slider::-moz-range-track {
		height: 6px;
		border-radius: 3px;
		background: transparent;
	}

	.range-slider:focus-visible {
		outline: 2px solid var(--color-gold-400);
		outline-offset: 4px;
	}
</style>
