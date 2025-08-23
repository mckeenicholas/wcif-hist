<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/util';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Hi, {data.name}!</h1>

<h1>My Competitions</h1>

<form method="POST" action="/logout" use:enhance>
	<button>Log out</button>
</form>

{#if data.competitions}
	<ul>
		{#each data.competitions as competition (competition.id)}
			<li>
				<a href="/competition/{competition.id}">
					{competition.name} - {formatDate(competition.start_date)}
				</a>
			</li>
		{/each}
	</ul>
{:else}
	No upcoming competitions
{/if}
