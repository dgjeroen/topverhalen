<script lang="ts">
	let email = $state('');
	let loading = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');

	async function handleLogin(event: Event) {
		event.preventDefault();
		loading = true;
		message = '';

		try {
			const response = await fetch('/cms/auth/send-link', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			const data = await response.json();

			if (response.ok) {
				messageType = 'success';
				message = '✅ Check je email voor de login link!';
				email = ''; // Clear input
			} else {
				messageType = 'error';
				message = data.error || '❌ Er ging iets mis. Probeer opnieuw.';
			}
		} catch (error) {
			messageType = 'error';
			message = '❌ Netwerkfout. Probeer opnieuw.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Topverhalen CMS</title>
</svelte:head>

<div class="login-container">
	<div class="login-box">
		<h1>Topverhalen CMS</h1>
		<p>Voer je @persgroep.net email in om in te loggen</p>

		<form onsubmit={handleLogin}>
			<input
				type="email"
				bind:value={email}
				placeholder="jouw.naam@persgroep.net"
				required
				disabled={loading}
				pattern=".*@persgroep\.net$"
				title="Alleen @persgroep.net emails zijn toegestaan"
			/>

			<button type="submit" disabled={loading || !email}>
				{loading ? 'Versturen...' : 'Stuur Login Link'}
			</button>
		</form>

		{#if message}
			<div class="message {messageType}">
				{message}
			</div>
		{/if}
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px;
	}

	.login-box {
		background: white;
		padding: 40px;
		border-radius: 12px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
		max-width: 400px;
		width: 100%;
	}

	h1 {
		margin: 0 0 10px;
		color: #333;
		font-size: 28px;
	}

	p {
		color: #666;
		margin: 0 0 30px;
		font-size: 14px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	input {
		width: 100%;
		padding: 12px;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 16px;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
	}

	input:disabled {
		background: #f5f5f5;
		cursor: not-allowed;
	}

	button {
		width: 100%;
		padding: 12px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover:not(:disabled) {
		background: #5568d3;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.message {
		margin-top: 20px;
		padding: 12px;
		border-radius: 6px;
		text-align: center;
		font-size: 14px;
	}

	.message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}
</style>
