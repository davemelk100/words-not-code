<script lang="ts">
	import MicrophoneIcon from '$lib/components/icons/MicrophoneIcon.svelte';

	let {
		value,
		placeholder = '',
		onChange
	}: {
		value: string;
		placeholder?: string;
		onChange: (value: string) => void;
	} = $props();

	let textareaEl: HTMLTextAreaElement | undefined = $state();
	let hasSpeechApi = $state(false);
	let isListening = $state(false);
	let recognition: any = $state(null);

	$effect(() => {
		if (typeof window !== 'undefined') {
			hasSpeechApi = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
		}
	});

	$effect(() => {
		autoResize();
	});

	function autoResize() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = textareaEl.scrollHeight + 'px';
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		onChange(target.value);
	}

	function toggleVoice() {
		if (isListening) {
			recognition?.stop();
			isListening = false;
			return;
		}

		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = false;
		recognition.lang = 'en-US';

		recognition.onresult = (event: any) => {
			let transcript = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				if (event.results[i].isFinal) {
					transcript += event.results[i][0].transcript;
				}
			}
			if (transcript) {
				const separator = value ? ' ' : '';
				onChange(value + separator + transcript);
			}
		};

		recognition.onerror = () => {
			isListening = false;
		};

		recognition.onend = () => {
			isListening = false;
		};

		recognition.start();
		isListening = true;
	}
</script>

<div class="w-full">
	<div class="relative flex items-end min-h-[120px]">
		<textarea
			bind:this={textareaEl}
			{placeholder}
			{value}
			oninput={handleInput}
			rows="1"
			class="w-full bg-transparent border-0 border-b-2 border-dark-600
				text-xl md:text-2xl text-cream-50 placeholder-cream-300/50
				pt-0 pb-3 pr-12 resize-none outline-none!
				transition-colors duration-200
				focus:border-gold-400
				self-end"
		></textarea>

		{#if hasSpeechApi}
			<button
				type="button"
				onclick={toggleVoice}
				class="absolute right-0 bottom-3 p-2 rounded-full transition-all duration-200
					{isListening ? 'text-red-400' : 'text-cream-300 hover:text-gold-400'}
					focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
				aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
			>
				{#if isListening}
					<span class="absolute inset-0 rounded-full bg-red-400/20 animate-pulse"></span>
				{/if}
				<MicrophoneIcon size={22} class="relative" />
			</button>
		{/if}
	</div>

	{#if value}
		<div class="text-cream-300/60 text-xs mt-2 text-right">
			{value.length} character{value.length !== 1 ? 's' : ''}
		</div>
	{/if}
</div>
