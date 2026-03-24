<script lang="ts">
	let { variant = 0 }: { variant?: number } = $props();

	let normalized = $derived(((variant % 5) + 5) % 5);
</script>

<div class="pointer-events-none absolute right-0 top-0 hidden h-full w-64 md:block" aria-hidden="true">
	{#if normalized === 0}
		<svg class="absolute right-8 top-24 opacity-10" width="120" height="120" viewBox="0 0 120 120" fill="none">
			<circle cx="60" cy="60" r="55" stroke="#D4A843" stroke-width="1.5" />
			<circle cx="60" cy="60" r="35" stroke="#D4A843" stroke-width="1" />
			<circle cx="60" cy="60" r="15" stroke="#D4A843" stroke-width="0.5" />
		</svg>
		<svg class="absolute right-24 bottom-32 opacity-5" width="80" height="80" viewBox="0 0 80 80" fill="none">
			<rect x="10" y="10" width="60" height="60" rx="8" stroke="#D4A843" stroke-width="1" />
		</svg>
	{:else if normalized === 1}
		<svg class="absolute right-12 top-32 opacity-10" width="100" height="100" viewBox="0 0 100 100" fill="none">
			<polygon points="50,5 95,75 5,75" stroke="#D4A843" stroke-width="1.5" />
		</svg>
		<svg class="absolute right-32 bottom-24 opacity-5" width="60" height="60" viewBox="0 0 60 60" fill="none">
			<circle cx="30" cy="30" r="25" stroke="#D4A843" stroke-width="1" />
		</svg>
	{:else if normalized === 2}
		<svg class="absolute right-6 top-20 opacity-8" width="140" height="140" viewBox="0 0 140 140" fill="none">
			<path d="M70 10 L130 50 L110 120 L30 120 L10 50 Z" stroke="#D4A843" stroke-width="1" opacity="0.08" />
		</svg>
		<svg class="absolute right-20 bottom-40 opacity-5" width="50" height="50" viewBox="0 0 50 50" fill="none">
			<rect x="5" y="5" width="40" height="40" stroke="#D4A843" stroke-width="1" transform="rotate(45 25 25)" />
		</svg>
	{:else if normalized === 3}
		<svg class="absolute right-10 top-28 opacity-10" width="110" height="110" viewBox="0 0 110 110" fill="none">
			<ellipse cx="55" cy="55" rx="50" ry="30" stroke="#D4A843" stroke-width="1" />
			<ellipse cx="55" cy="55" rx="30" ry="50" stroke="#D4A843" stroke-width="1" />
		</svg>
		<svg class="absolute right-28 bottom-28 opacity-5" width="70" height="70" viewBox="0 0 70 70" fill="none">
			<line x1="0" y1="35" x2="70" y2="35" stroke="#D4A843" stroke-width="0.5" />
			<line x1="35" y1="0" x2="35" y2="70" stroke="#D4A843" stroke-width="0.5" />
		</svg>
	{:else}
		<svg class="absolute right-14 top-36 opacity-10" width="100" height="100" viewBox="0 0 100 100" fill="none">
			<path d="M50 5 L61 38 L97 38 L68 59 L79 92 L50 71 L21 92 L32 59 L3 38 L39 38 Z" stroke="#D4A843" stroke-width="1" />
		</svg>
		<svg class="absolute right-30 bottom-36 opacity-5" width="60" height="60" viewBox="0 0 60 60" fill="none">
			<circle cx="30" cy="30" r="20" stroke="#D4A843" stroke-width="0.5" stroke-dasharray="4 4" />
		</svg>
	{/if}
</div>
