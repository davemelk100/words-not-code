<script>
</script>

<div class="home">
	<!-- Hero -->
	<section class="hero">
		<div class="hero-inner">
			<img src="/wnc-logo.svg" alt="Words Not Code" class="hero-logo" />
			<h1 class="hero-title" style="font-family: var(--font-heading);">
				Words, Not Code
			</h1>
			<h2 class="hero-sub">
				Turn your app idea into a technical blueprint in minutes.
				No coding required.
			</h2>
			<a href="/wizard" class="hero-cta">Get Started</a>
		</div>
	</section>

	<!-- How it works -->
	<section class="steps">
		<h2 class="section-title" style="font-family: var(--font-heading);">How It Works</h2>
		<div class="steps-row">
			<div class="step-card">
				<div class="step-num">1</div>
				<h3>Answer Questions</h3>
				<p>Simple, plain-English questions about your app idea. No jargon.</p>
			</div>
			<div class="step-card">
				<div class="step-num">2</div>
				<h3>Get a Blueprint</h3>
				<p>We generate a detailed technical spec covering architecture, features, and more.</p>
			</div>
			<div class="step-card">
				<div class="step-num">3</div>
				<h3>Start Building</h3>
				<p>Paste the blueprint into any AI coding assistant and watch your app come to life.</p>
			</div>
		</div>
	</section>

	<!-- Works with -->
	<section class="works-with">
		<h2 class="section-title" style="font-family: var(--font-heading);">Works With Any AI Tool</h2>
		<p class="works-with-sub">
			Claude, ChatGPT, Cursor, GitHub Copilot, Gemini, and more.
		</p>
	</section>

	<!-- CTA -->
	<section class="bottom-cta">
		<h2 class="bottom-cta-title" style="font-family: var(--font-heading);">Ready to build?</h2>
		<p class="bottom-cta-sub">Free. No sign-up. Takes about 5 minutes.</p>
		<a href="/wizard" class="hero-cta">Get Started</a>
	</section>

	<!-- SEO content -->
	<div class="sr-only">
		<p>
			Words Not Code helps you go from app idea to technical blueprint in minutes.
			Describe your idea in plain English by answering simple guided questions, and
			get a comprehensive spec document you can paste directly into any AI coding assistant.
		</p>
	</div>
</div>

<style>
	.home {
		min-height: 100dvh;
	}

	/* Hero */
	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		text-align: center;
		padding: 4rem 1.5rem;
		background: linear-gradient(160deg, #0a0f1a 0%, #0f172a 50%, #1a1a2e 100%);
	}

	.hero-inner {
		max-width: 600px;
	}

	.hero-logo {
		width: clamp(280px, 50vw, 450px);
		height: auto;
		margin: 0 auto 2rem;
		display: block;
		animation: fadeUp 0.8s ease both;
	}

	.hero-title {
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		font-weight: 300;
		line-height: 1.1;
		background: linear-gradient(135deg, var(--color-gold-400), var(--color-gold-200));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
		animation: fadeUp 0.8s ease both;
	}

	.hero-sub {
		margin-top: 1.5rem;
		font-size: 2rem;
		line-height: 1.6;
		color: var(--color-cream-200);
		opacity: 0.85;
		animation: fadeUp 0.8s ease 0.15s both;
	}

	.hero-cta {
		display: inline-block;
		margin-top: 2.5rem;
		padding: 0.9rem 2.5rem;
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--color-dark-950);
		background-color: #D4A843;
		text-decoration: none;
		transition: transform 0.2s, box-shadow 0.2s;
		animation: fadeUp 0.8s ease 0.3s both;
	}

	.hero-cta:hover {
		transform: scale(1.04);
		box-shadow: 0 0 24px rgba(226, 180, 64, 0.3);
	}

	/* Sections shared */
	.section-title {
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		font-weight: 300;
		color: var(--color-cream-50);
		text-align: center;
		margin: 0 0 3rem;
	}

	/* How it works */
	.steps {
		padding: 6rem 1.5rem;
		background: var(--color-dark-950);
	}

	.steps-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.step-card {
		flex: 1 1 250px;
		max-width: 280px;
		padding: 2rem;
		border-radius: 1rem;
		border: 1px solid var(--color-dark-600);
		background: var(--color-dark-800);
		text-align: center;
	}

	.step-num {
		width: 2.5rem;
		height: 2.5rem;
		margin: 0 auto 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(226, 180, 64, 0.15);
		color: var(--color-gold-400);
		font-weight: 600;
		font-size: 1rem;
	}

	.step-card h3 {
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--color-cream-50);
	}

	.step-card p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-cream-300);
	}

	/* Works with */
	.works-with {
		padding: 5rem 1.5rem;
		text-align: center;
		background: linear-gradient(180deg, var(--color-dark-950) 0%, #0f172a 100%);
	}

	.works-with-sub {
		margin: 0;
		font-size: 1.1rem;
		color: var(--color-cream-200);
		opacity: 0.8;
	}

	/* Bottom CTA */
	.bottom-cta {
		padding: 6rem 1.5rem;
		text-align: center;
		background: var(--color-dark-950);
	}

	.bottom-cta-title {
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: 300;
		color: var(--color-gold-400);
		margin: 0;
	}

	.bottom-cta-sub {
		margin-top: 0.75rem;
		font-size: 1rem;
		color: var(--color-cream-300);
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
