import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateBlueprint } from '$lib/generate-blueprint';
import type { Answers } from '$lib/types';

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Rate limit: 10 per hour per IP
	const ip = getClientAddress();
	const now = Date.now();
	const limit = rateLimit.get(ip);

	if (limit && limit.resetAt > now && limit.count >= 10) {
		return json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
	}

	if (!limit || limit.resetAt <= now) {
		rateLimit.set(ip, { count: 1, resetAt: now + 3600000 });
	} else {
		limit.count++;
	}

	// Validate and generate
	let answers: Answers;

	try {
		answers = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
		return json({ error: 'Invalid answers: expected an object' }, { status: 400 });
	}

	const blueprint = generateBlueprint(answers);

	// Optional: save to Supabase (don't block response on this)
	// saveSession(answers, blueprint).catch(console.error);

	return json({ blueprint });
};
