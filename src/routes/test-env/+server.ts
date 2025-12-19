// src/routes/test-env/+server.ts
import { json } from '@sveltejs/kit';

export const GET = () => {
	return json({
		hasAuthSecret: !!process.env.AUTH_SECRET,
		authSecretLength: process.env.AUTH_SECRET?.length || 0,
		nodeEnv: process.env.NODE_ENV
	});
};
