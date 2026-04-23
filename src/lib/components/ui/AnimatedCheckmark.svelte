<script lang="ts">
	let { visible = false, size = 32 }: { visible?: boolean; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 32 32"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class="animated-checkmark"
>

	<circle
		cx="16"
		cy="16"
		r="14"
		stroke="#D4A843"
		stroke-width="2"
		fill="none"
		class="checkmark-circle"
		class:visible
	/>
	<path
		d="M10 16l4 4 8-8"
		stroke="#D4A843"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		fill="none"
		class="checkmark-path"
		class:visible
	/>
</svg>

<style>
	.checkmark-circle {
		stroke-dasharray: 88;
		stroke-dashoffset: 88;
		transition: stroke-dashoffset 0.4s ease;
	}

	.checkmark-circle.visible {
		stroke-dashoffset: 0;
	}

	.checkmark-path {
		stroke-dasharray: 24;
		stroke-dashoffset: 24;
		transition: stroke-dashoffset 0.4s ease 0.2s;
	}

	.checkmark-path.visible {
		stroke-dashoffset: 0;
	}
</style>
