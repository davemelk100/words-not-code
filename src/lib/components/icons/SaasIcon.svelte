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
	<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
	<circle cx="12" cy="13" r="3" />
	<path d="M12 10v-1" />
	<path d="M12 17v-1" />
	<path d="M9.17 11.17l-.71-.71" />
	<path d="M15.54 14.54l-.71-.71" />
	<path d="M9 13H8" />
	<path d="M16 13h-1" />
	<path d="M9.17 14.83l-.71.71" />
	<path d="M15.54 11.46l-.71.71" />
</svg>
