import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

const rateLimit = new Map<string, { count: number; resetAt: number }>();

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const ip = getClientAddress();
	const now = Date.now();
	const limit = rateLimit.get(ip);

	if (limit && limit.resetAt > now && limit.count >= 20) {
		return json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
	}

	if (!limit || limit.resetAt <= now) {
		rateLimit.set(ip, { count: 1, resetAt: now + 3600000 });
	} else {
		limit.count++;
	}

	let body: { answers: unknown; currentStep: unknown };

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const { answers, currentStep } = body;

	if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
		return json({ error: 'Invalid answers: expected an object' }, { status: 400 });
	}

	if (typeof currentStep !== 'number' || currentStep < 1) {
		return json({ error: 'Invalid currentStep: expected a positive number' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('wizard_progress')
		.insert({ answers, current_step: currentStep })
		.select('id')
		.single();

	if (error) {
		console.error('Failed to save progress:', error);
		return json({ error: 'Failed to save progress' }, { status: 500 });
	}

	return json({ id: data.id });
};
