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
	<rect x="1" y="3" width="15" height="11" rx="1" />
	<path d="M6 14v2" />
	<path d="M2 16h12" />
	<rect x="16" y="6" width="7" height="14" rx="1" />
	<path d="M19.5 17h.01" />
</svg>
