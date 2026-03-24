<script lang="ts">
	import { onMount } from 'svelte';

	let dotX = $state(0);
	let dotY = $state(0);
	let ringX = $state(0);
	let ringY = $state(0);
	let visible = $state(false);
	let enabled = $state(false);

	onMount(() => {
		const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!hasFineCursor || prefersReducedMotion) return;

		enabled = true;

		function handleMouseMove(e: MouseEvent) {
			dotX = e.clientX;
			dotY = e.clientY;
			if (!visible) visible = true;
		}

		function handleMouseLeave() {
			visible = false;
		}

		function handleMouseEnter() {
			visible = true;
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.documentElement.addEventListener('mouseleave', handleMouseLeave);
		document.documentElement.addEventListener('mouseenter', handleMouseEnter);

		let animationId: number;

		function animate() {
			ringX += (dotX - ringX) * 0.15;
			ringY += (dotY - ringY) * 0.15;
			animationId = requestAnimationFrame(animate);
		}

		animationId = requestAnimationFrame(animate);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
			document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
			cancelAnimationFrame(animationId);
		};
	});
</script>

{#if enabled}
	<div
		class="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
		style="opacity: {visible ? 1 : 0}; transition: opacity 0.15s ease;"
		aria-hidden="true"
	>
		<!-- Dot -->
		<div
			class="absolute rounded-full"
			style="
				width: 8px;
				height: 8px;
				background-color: #D4A843;
				transform: translate({dotX - 4}px, {dotY - 4}px);
			"
		></div>
		<!-- Ring -->
		<div
			class="absolute rounded-full border"
			style="
				width: 32px;
				height: 32px;
				border-color: #D4A843;
				opacity: 0.5;
				transform: translate({ringX - 16}px, {ringY - 16}px);
			"
		></div>
	</div>
{/if}
