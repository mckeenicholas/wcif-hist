<script lang="ts">
	import { goto } from '$app/navigation';
	import { applicationID, redirectURI } from '$lib/util';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let error = $state<string | null>(null);

	const logIn = () => {
		if (browser) {
			const url = new URL('https://worldcubeassociation.org/oauth/authorize');
			url.searchParams.append('client_id', applicationID);
			url.searchParams.append('redirect_uri', redirectURI);
			url.searchParams.append('response_type', 'token');
			url.searchParams.append('scope', 'public manage_competitions ');

			window.location.href = url.href;
		}
	};

	const handleAuthRedirect = async () => {
		if (!browser) return;

		if (window.location.hash) {
			const urlParams = new URLSearchParams(window.location.hash.substring(1));
			const accessToken = urlParams.get('access_token');
			const expiresIn = urlParams.get('expires_in');

			if (accessToken && expiresIn) {
				try {
					const response = await fetch('/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ wcaToken: accessToken })
					});

					const result = await response.json();

					if (result.success) {
						goto('/dashboard');
					} else {
						error = result.error || 'Authentication failed';
					}
				} catch (e) {
					console.error('Error during authentication:', e);
					error = 'Error during authentication process';
				}
			}
		}
	};

	onMount(handleAuthRedirect);
</script>

<h1>Login/Register</h1>
{#if error}
	<div>
		{error}
	</div>
{/if}

<button onclick={logIn}>Log in with WCA</button>
