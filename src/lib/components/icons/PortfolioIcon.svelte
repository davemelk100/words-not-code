<script lang="ts">
	let { size = 24, class: className = '' }: { size?: number; class?: string } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
>
	<rect x="2" y="3" width="20" height="14" rx="2" />
	<path d="M8 21h8" />
	<path d="M12 17v4" />
	<path d="M2 7h20" />
	<circle cx="5" cy="5" r="0.5" fill="currentColor" />
	<circle cx="7.5" cy="5" r="0.5" fill="currentColor" />
	<circle cx="10" cy="5" r="0.5" fill="currentColor" />
</svg>
