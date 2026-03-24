<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Answers } from '$lib/types';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
	import RefreshIcon from '$lib/components/icons/RefreshIcon.svelte';

	let {
		answers,
		onReset
	}: {
		answers: Answers;
		onReset: () => void;
	} = $props();

	let blueprint = $state('');
	let loading = $state(true);
	let error = $state('');
	let copied = $state(false);

	const destinations = [
		{
			name: 'Claude',
			url: 'anthropic.com',
			accent: '#a78bfa',
			how: 'Open Claude, paste the blueprint, and ask it to build your app step by step.'
		},
		{
			name: 'ChatGPT',
			url: 'chat.openai.com',
			accent: '#4ade80',
			how: 'Start a new chat, paste the blueprint, and let GPT scaffold your project.'
		},
		{
			name: 'Cursor',
			url: 'cursor.com',
			accent: '#60a5fa',
			how: 'Open Composer, paste the blueprint as context, and start generating code.'
		},
		{
			name: 'Gemini',
			url: 'gemini.google.com',
			accent: '#facc15',
			how: 'Paste the blueprint into Gemini and ask it to create an implementation plan.'
		}
	];

	async function fetchBlueprint() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(answers)
			});
			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'Failed to generate blueprint.';
			} else {
				blueprint = data.blueprint;
			}
		} catch (e) {
			error = 'Network error. Please check your connection and try again.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchBlueprint();
	});

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(blueprint);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// Fallback
			const textarea = document.createElement('textarea');
			textarea.value = blueprint;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<div
	class="output-slide min-h-[100dvh] w-full overflow-y-auto bg-dark-950"
	in:fade={{ duration: 300 }}
>
	<div class="mx-auto max-w-4xl px-6 py-16">
		{#if loading}
			<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4">
				<div class="loading-spinner h-10 w-10 rounded-full border-2 border-gold-400/30 border-t-gold-400"></div>
				<p class="text-cream-200">Generating your blueprint...</p>
			</div>
		{:else if error}
			<div class="flex min-h-[60vh] flex-col items-center justify-center gap-6">
				<div class="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
					<p class="text-red-300">{error}</p>
				</div>
				<button
					type="button"
					onclick={fetchBlueprint}
					class="flex items-center gap-2 rounded-lg border border-gold-400 px-6 py-3 text-gold-400 transition-colors hover:bg-gold-400/10"
				>
					<RefreshIcon size={16} />
					<span>Retry</span>
				</button>
			</div>
		{:else}
			<!-- Header -->
			<div class="mb-8 text-center">
				<h2 class="font-serif text-3xl text-gold-400 md:text-5xl">Your Blueprint</h2>
				<p class="mt-2 text-cream-200">Copy and paste this into your favorite AI coding assistant.</p>
			</div>

			<!-- Blueprint display -->
			<div class="relative mb-8 rounded-xl border-l-4 border-gold-400 bg-dark-800 p-6">
				<pre class="max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-cream-100">{blueprint}</pre>
			</div>

			<!-- Action buttons -->
			<div class="mb-12 flex flex-wrap items-center justify-center gap-4">
				<button
					type="button"
					onclick={copyToClipboard}
					class="flex items-center gap-2 rounded-lg border border-gold-400 px-6 py-3 text-gold-400 transition-colors hover:bg-gold-400/10"
				>
					{#if copied}
						<CheckIcon size={16} />
						<span>Copied!</span>
					{:else}
						<CopyIcon size={16} />
						<span>Copy to Clipboard</span>
					{/if}
				</button>

				<button
					type="button"
					onclick={onReset}
					class="flex items-center gap-2 rounded-lg border border-cream-300/30 px-6 py-3 text-cream-300 transition-colors hover:border-cream-300/60 hover:text-cream-100"
				>
					<RefreshIcon size={16} />
					<span>Start Over</span>
				</button>
			</div>

			<!-- How to use it -->
			<div class="mb-12">
				<h3 class="mb-4 text-center font-serif text-2xl text-cream-50">How to use it</h3>
				<ol class="mx-auto max-w-lg space-y-3 text-cream-200">
					<li class="flex items-start gap-3">
						<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-sm font-semibold text-gold-400">1</span>
						<span>Copy the blueprint above</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-sm font-semibold text-gold-400">2</span>
						<span>Open your preferred AI assistant</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-sm font-semibold text-gold-400">3</span>
						<span>Paste the blueprint as your prompt</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-sm font-semibold text-gold-400">4</span>
						<span>Start building your app</span>
					</li>
				</ol>
			</div>

			<!-- Destination cards -->
			<div class="mb-16">
				<h3 class="mb-6 text-center font-serif text-2xl text-cream-50">Where to paste it</h3>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each destinations as dest}
						<div
							class="rounded-lg border border-dark-600 bg-dark-800 p-5 transition-colors hover:border-dark-500"
						>
							<div class="mb-2 flex items-center gap-3">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
									style="background-color: {dest.accent}20; color: {dest.accent};"
								>
									{dest.name.charAt(0)}
								</div>
								<div>
									<div class="font-medium text-cream-50">{dest.name}</div>
									<div class="text-xs text-cream-300/60">{dest.url}</div>
								</div>
							</div>
							<p class="text-sm leading-relaxed text-cream-300">{dest.how}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.loading-spinner {
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
