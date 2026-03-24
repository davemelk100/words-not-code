import type { Answers, Question } from './types';

function isMobileRelevant(answers: Answers): boolean {
	const appType = answers.appType;
	if (typeof appType !== 'string') return false;
	const lower = appType.toLowerCase();
	return lower === 'mobile' || lower === 'both';
}

export const questions: Question[] = [
	{
		id: 'appType',
		step: 1,
		title: 'What are you building?',
		subtitle: 'Pick the closest match — we\'ll figure out the details together.',
		inputType: 'radio',
		options: [
			{ value: 'web', label: 'Website / Web App', description: 'Runs in a browser', icon: '🌐' },
			{ value: 'mobile', label: 'Mobile App', description: 'Lives on your phone', icon: '📱' },
			{ value: 'both', label: 'Both', description: 'Web + mobile', icon: '🔗' },
			{ value: 'ecommerce', label: 'Online Store', description: 'Sell things online', icon: '🛒' },
			{ value: 'blog', label: 'Blog / Content Site', description: 'Share writing, media or stories', icon: '📝' },
			{ value: 'portfolio', label: 'Landing Page', description: 'Showcase work or capture leads', icon: '🖼️' },
			{ value: 'other', label: 'Something Else', description: 'Tell us about it next', icon: '✨' }
		],
		required: true,
		gradient: ['#0f172a', '#1e3a5f']
	},
	{
		id: 'appDescription',
		step: 2,
		title: 'Describe your idea',
		subtitle: 'No jargon needed — just explain it like you\'d tell a friend.',
		inputType: 'text',
		placeholder: 'e.g., An app where local chefs sell home-cooked meals to neighbors...',
		required: true,
		gradient: ['#1a1a2e', '#16213e']
	},
	{
		id: 'targetAudience',
		step: 3,
		title: 'Who is this for?',
		subtitle: 'Describe the people who\'ll use your app.',
		inputType: 'text',
		placeholder: 'e.g., Busy parents who want healthy meals delivered...',
		required: true,
		gradient: ['#0d1b2a', '#1b2838']
	},
	{
		id: 'mobilePlatform',
		step: 4,
		title: 'Which phones?',
		subtitle: 'Not sure? "Both" is almost always the right call.',
		inputType: 'radio',
		options: [
			{ value: 'ios', label: 'iPhone Only', description: 'Apple devices', icon: '🍎' },
			{ value: 'android', label: 'Android Only', description: 'Samsung, Pixel, etc.', icon: '🤖' },
			{ value: 'both-mobile', label: 'Both', description: 'Recommended for most apps', icon: '🔗' }
		],
		required: true,
		condition: isMobileRelevant,
		gradient: ['#1a0a2e', '#2d1b69']
	},
	{
		id: 'userAuth',
		step: 5,
		title: 'Will people need to log in?',
		subtitle: 'We\'ll handle the security details for you.',
		inputType: 'radio',
		options: [
			{ value: 'social', label: 'Sign in with Google / Apple', description: 'Easiest for users — one tap', icon: '👥' },
			{ value: 'email-password', label: 'Email & Password', description: 'The classic approach', icon: '📧' },
			{ value: 'phone-sms', label: 'Phone Number', description: 'Verify with a text', icon: '📞' },
			{ value: 'none', label: 'No Login Needed', description: 'Anyone can use it', icon: '🔓' }
		],
		required: true,
		gradient: ['#0a1628', '#162544']
	},
	{
		id: 'coreFeatures',
		step: 6,
		title: 'What should your app do?',
		subtitle: 'Tap all that apply — you can always add more later.',
		inputType: 'check',
		options: [
			{ value: 'profiles', label: 'User Accounts', description: 'Profiles, settings & preferences', icon: '👤' },
			{ value: 'messaging', label: 'Messaging', description: 'Chat, comments or notifications', icon: '💬' },
			{ value: 'search', label: 'Search', description: 'Find and filter content', icon: '🔍' },
			{ value: 'media', label: 'Media & Files', description: 'Upload photos, videos or documents', icon: '📤' },
			{ value: 'dashboard', label: 'Dashboard', description: 'Analytics, charts & insights', icon: '📊' },
			{ value: 'scheduling', label: 'Scheduling', description: 'Calendar, bookings or events', icon: '📅' }
		],
		required: false,
		gradient: ['#0b1a30', '#1a3050']
	},
	{
		id: 'payments',
		step: 7,
		title: 'Will you accept payments?',
		subtitle: 'We\'ll set up Stripe so you can start earning.',
		inputType: 'radio',
		options: [
			{ value: 'subscriptions', label: 'Subscriptions', description: 'Monthly or yearly billing', icon: '🔄' },
			{ value: 'one-time', label: 'One-time Payments', description: 'Pay once for a product or service', icon: '💰' },
			{ value: 'free', label: 'It\'s Free', description: 'No payments needed right now', icon: '❤️' },
			{ value: 'not-sure', label: 'Not Sure Yet', description: 'We can add this later', icon: '❓' }
		],
		required: true,
		gradient: ['#141a2a', '#252d44']
	},
	{
		id: 'designStyle',
		step: 8,
		title: 'What vibe are you going for?',
		subtitle: 'Pick the look that feels right for your brand.',
		inputType: 'radio',
		options: [
			{ value: 'modern-minimal', label: 'Clean & Minimal', description: 'Simple, spacious, elegant', icon: '➖' },
			{ value: 'bold-colorful', label: 'Bold & Colorful', description: 'Vibrant and eye-catching', icon: '🎨' },
			{ value: 'professional', label: 'Professional', description: 'Polished and trustworthy', icon: '💼' },
			{ value: 'playful', label: 'Playful & Fun', description: 'Friendly and approachable', icon: '😊' },
			{ value: 'dark-sleek', label: 'Dark & Sleek', description: 'Modern dark theme', icon: '🌙' }
		],
		required: true,
		gradient: ['#1a0f2e', '#2a1a4e']
	},
	{
		id: 'timeline',
		step: 9,
		title: 'When do you need it?',
		subtitle: 'This helps us plan the right scope.',
		inputType: 'radio',
		options: [
			{ value: 'asap', label: 'As Soon as Possible', description: '1–2 weeks', icon: '⚡' },
			{ value: 'short', label: 'Soon', description: '1–2 months', icon: '🕐' },
			{ value: 'standard', label: 'No Rush', description: '3–6 months', icon: '📅' },
			{ value: 'flexible', label: 'Flexible', description: 'Whenever it\'s ready', icon: '☕' }
		],
		required: true,
		gradient: ['#0a192f', '#172a45']
	},
	{
		id: 'additionalNotes',
		step: 10,
		title: 'Anything else?',
		subtitle: 'Apps you love, must-have features, or things you definitely don\'t want.',
		inputType: 'text',
		placeholder: 'e.g., I love how Airbnb\'s search works. I want something similar but for...',
		required: false,
		gradient: ['#151525', '#252540']
	},
	{
		id: 'projectName',
		step: 11,
		title: 'What should we call it?',
		subtitle: 'Pick a name — you can always change it later.',
		inputType: 'text',
		placeholder: 'e.g., MealDash, FitTrack, BookNook...',
		required: true,
		gradient: ['#0f1b2d', '#1e2d4a']
	}
];

export function getVisibleQuestions(answers: Answers): Question[] {
	return questions.filter((q) => !q.condition || q.condition(answers));
}
