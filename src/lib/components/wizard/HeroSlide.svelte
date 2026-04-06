<script lang="ts">
	let {
		onBegin
	}: {
		onBegin: () => void;
	} = $props();
</script>

<div
	class="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
	style="background: linear-gradient(160deg, #0a0f1a 0%, #0f172a 50%, #1a1a2e 100%);"
>
	<div class="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center">
		<h1
			class="hero-title text-5xl font-light leading-tight md:text-7xl"
			style="font-family: var(--font-heading);"
			style="animation: heroFadeIn 0.8s ease both;"
		>
			Words, Not Code
		</h1>

		<p
			class="mt-6 text-lg text-cream-200/80 leading-relaxed"
			style="animation: heroFadeIn 0.8s ease 0.2s both;"
		>
			Describe your idea. Get a blueprint you can paste into any AI coding tool.
		</p>

		<button
			type="button"
			onclick={onBegin}
			class="hero-cta mt-12 rounded-full px-10 py-4 text-base font-semibold tracking-wide text-dark-950 transition-all duration-200 hover:scale-105"
			style="animation: heroFadeIn 0.8s ease 0.4s both; background-color: #D4A843;"
		>
			Get Started
		</button>
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
		box-shadow: 0 0 24px rgba(226, 180, 64, 0.3);
	}

	@keyframes heroFadeIn {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
