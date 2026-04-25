import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	// Validate UUID format
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!uuidRegex.test(id)) {
		return json({ error: 'Invalid session ID' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('wizard_progress')
		.select('answers, current_step, expires_at')
		.eq('id', id)
		.single();

	if (error || !data) {
		return json({ error: 'Session not found' }, { status: 404 });
	}

	if (new Date(data.expires_at) < new Date()) {
		return json({ error: 'This save link has expired' }, { status: 410 });
	}

	return json({
		answers: data.answers,
		currentStep: data.current_step
	});
};
