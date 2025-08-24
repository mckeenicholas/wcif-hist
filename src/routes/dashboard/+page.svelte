<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Competition } from '$lib/types';
	import { authFetch, formatDate } from '$lib/util';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { SvelteDate } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	let { data }: { data: PageServerData } = $props();

	let competitions: Competition[] = $state([]);
	let loading = $state(true);

	// This is done on the client so the page rendering isn't blocked
	// I may later move this to an endpoint on the backend so we don't have
	// to pass tokens back and forth
	const getUpcomingCompetitions = async (token: string) => {
		const url = new URL('https://www.worldcubeassociation.org/api/v0/competitions');
		const startDate = new SvelteDate();

		// startDate.setDate(startDate.getDate() - 14);
		startDate.setDate(startDate.getDate() - 90);
		url.searchParams.append('managed_by_me', 'true');
		url.searchParams.append('start', startDate.toISOString());
		url.searchParams.append('sort', 'start_date');
		const response = await authFetch(url, token);
		if (!response.ok) {
			throw Error('Invalid or expired WCA Token');
		}
		competitions = await response.json();
		loading = false;
	};

	onMount(() => {
		if (!data.wcaToken) {
			goto('/login');
			return;
		}

		getUpcomingCompetitions(data.wcaToken);
	});
</script>

<div class="font-sans md:p-6">
	<!-- Header Section -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="mb-1 text-2xl font-medium text-gray-800">Hi, {data.name}!</h1>
			<p class="text-sm text-gray-600">Manage your WCA competitions</p>
		</div>
		<form method="POST" action="/logout" use:enhance>
			<button
				class="cursor-pointer border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:border-blue-500 focus:ring-blue-500"
				type="submit"
			>
				Log out
			</button>
		</form>
	</div>

	<!-- Competitions Section -->
	<div class="mb-4">
		<h2 class="mb-4 text-xl font-medium text-gray-800">My Competitions</h2>

		{#if loading}
			<div class="border border-gray-200 bg-white p-4 text-center">
				<div class="flex items-center justify-center space-x-2">
					<div class="h-4 w-4 animate-pulse rounded-full bg-blue-500"></div>
					<span class="text-gray-600">Loading Competitions...</span>
				</div>
			</div>
		{:else if competitions.length > 0}
			<div class="space-y-1">
				{#each competitions as competition (competition.id)}
					<div
						class="overflow-hidden border border-gray-200 bg-white transition-colors duration-200 hover:bg-gray-50"
					>
						<a
							href="/competition/{competition.id}"
							class="block px-4 py-3 text-gray-800 no-underline hover:text-gray-900"
						>
							<div class="flex items-center justify-between">
								<div>
									<span class="text-lg font-semibold">{competition.name}</span>
									<div class="mt-1 text-sm text-gray-600">
										<span class="font-medium">Start Date:</span>
										{formatDate(competition.start_date)}
									</div>
								</div>
								<div class="text-gray-400">
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										></path>
									</svg>
								</div>
							</div>
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<div class="border border-gray-200 bg-white p-6 text-center">
				<div class="text-gray-500">
					<svg
						class="mx-auto mb-3 h-12 w-12 text-gray-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						></path>
					</svg>
					<p class="mb-1 text-base font-medium text-gray-600">No upcoming competitions</p>
					<p class="text-sm text-gray-500">Check back later or create a new competition</p>
				</div>
			</div>
		{/if}
	</div>
</div>
