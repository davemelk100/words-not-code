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
	<path d="M15 4V2" />
	<path d="M15 16v-2" />
	<path d="M8 9h2" />
	<path d="M20 9h2" />
	<path d="M17.8 11.8l1.4 1.4" />
	<path d="M11 4.8l1.4 1.4" />
	<path d="M17.8 6.2l1.4-1.4" />
	<path d="M3.5 20.5l9-9" />
	<path d="M4.5 16.5L2 19l3 3 2.5-2.5" />
</svg>
