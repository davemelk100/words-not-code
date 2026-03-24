<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let {
		onBegin
	}: {
		onBegin: () => void;
	} = $props();
</script>

<div
	class="hero-slide relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
	in:fade={{ duration: 400 }}
>
	<!-- Background grain / noise overlay -->
	<div class="hero-grain absolute inset-0 opacity-[0.03]" aria-hidden="true"></div>

	<!-- Subtle radial glow -->
	<div
		class="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
		style="background: radial-gradient(circle, rgba(226,180,64,0.15) 0%, transparent 70%);"
		aria-hidden="true"
	></div>

	<div class="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
		<h1
			class="hero-title font-serif text-5xl leading-tight md:text-7xl"
			style="animation: heroStagger 0.7s ease both;"
		>
			Words, Not Code
		</h1>

		<p
			class="mt-6 max-w-lg text-xl text-cream-200"
			style="animation: heroStagger 0.7s ease 0.15s both;"
		>
			Turn your app idea into a technical blueprint
		</p>

		<p
			class="mt-3 max-w-md text-base text-cream-300"
			style="animation: heroStagger 0.7s ease 0.3s both;"
		>
			Answer simple questions. Get a complete spec you can paste into any AI coding assistant.
		</p>

		<button
			type="button"
			onclick={onBegin}
			class="hero-cta mt-10 rounded-full px-8 py-4 text-lg font-semibold text-dark-950 transition-all duration-200 hover:scale-105"
			style="animation: heroStagger 0.7s ease 0.45s both; background-color: #D4A843;"
		>
			Begin
		</button>

		<p
			class="mt-6 text-sm text-cream-300/60"
			style="animation: heroStagger 0.7s ease 0.6s both;"
		>
			17 questions &middot; 5 minutes &middot; Free
		</p>
	</div>
</div>

<style>
	.hero-title {
		background: linear-gradient(135deg, var(--color-gold-400), var(--color-gold-200));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-cta:hover {
		box-shadow: 0 0 24px rgba(226, 180, 64, 0.35);
	}

	.hero-grain {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 256px 256px;
	}

	@keyframes heroStagger {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
