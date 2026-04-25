<script lang="ts">
	import { onMount } from 'svelte';
	import { wizardStore } from '$lib/wizard-store.svelte';
	import Wizard from '$lib/components/wizard/Wizard.svelte';

	let loading = $state(false);
	let loadError = $state('');

	onMount(async () => {
		const sessionId = new URL(window.location.href).searchParams.get('s');
		if (!sessionId) return;

		loading = true;
		try {
			const res = await fetch(`/api/load-progress/${sessionId}`);
			const data = await res.json();
			if (!res.ok) {
				loadError = data.error || 'Failed to load saved progress.';
			} else {
				wizardStore.loadState(data.answers, data.currentStep);
			}
		} catch {
			loadError = 'Network error loading saved progress.';
		} finally {
			loading = false;
			// Clean the URL so bookmarking doesn't re-trigger load
			window.history.replaceState({}, '', '/wizard');
		}
	});
</script>

{#if loading}
	<div class="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-dark-950">
		<div class="h-10 w-10 animate-spin rounded-full border-2 border-gold-400/30 border-t-gold-400"></div>
		<p class="text-cream-200">Restoring your progress...</p>
	</div>
{:else if loadError}
	<div class="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-dark-950 px-6">
		<div class="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
			<p class="text-red-300">{loadError}</p>
		</div>
		<a
			href="/wizard"
			class="rounded-lg border border-gold-400 px-6 py-3 text-gold-400 transition-colors hover:bg-gold-400/10"
		>
			Start Fresh
		</a>
	</div>
{:else}
	<Wizard />
{/if}
