<script lang="ts">
	import { fade } from 'svelte/transition';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import CheckIcon from '$lib/components/icons/CheckIcon.svelte';

	let {
		link,
		onClose
	}: {
		link: string;
		onClose: () => void;
	} = $props();

	let copied = $state(false);

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(link);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = link;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
	transition:fade={{ duration: 200 }}
	onclick={handleBackdropClick}
>
	<div
		class="w-full max-w-md rounded-xl border border-dark-600 bg-dark-800 p-6 shadow-2xl"
		role="dialog"
		aria-labelledby="save-modal-title"
	>
		<h3
			id="save-modal-title"
			class="mb-2 text-xl font-light text-gold-400"
			style="font-family: var(--font-heading);"
		>
			Progress Saved
		</h3>
		<p class="mb-4 text-sm text-cream-200">
			Bookmark this link or save it somewhere safe. It will work for 30 days.
		</p>

		<div class="flex items-stretch gap-2">
			<input
				type="text"
				readonly
				value={link}
				class="min-w-0 flex-1 rounded-lg border border-dark-500 bg-dark-900 px-3 py-2 font-mono text-sm text-cream-100 select-all"
			/>
			<button
				type="button"
				onclick={copyLink}
				class="flex shrink-0 items-center gap-1.5 rounded-lg border border-gold-400 px-4 py-2 text-sm text-gold-400 transition-colors hover:bg-gold-400/10"
			>
				{#if copied}
					<CheckIcon size={14} />
					<span>Copied</span>
				{:else}
					<CopyIcon size={14} />
					<span>Copy</span>
				{/if}
			</button>
		</div>

		<button
			type="button"
			onclick={onClose}
			class="mt-4 w-full rounded-lg border border-cream-300/20 py-2 text-sm text-cream-300 transition-colors hover:border-cream-300/40 hover:text-cream-100"
		>
			Close
		</button>
	</div>
</div>
