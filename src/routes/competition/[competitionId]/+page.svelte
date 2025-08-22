<script lang="ts">
	import { page } from '$app/state';
	import { formatDateTime } from '$lib/util';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let competitionId = page.params.competitionId;
</script>

{#if data.savedVersions.length != 0}
	<ul>
		{#each data.savedVersions as save}
			<li>
				<a href="/{competitionId}/{save.id.toString()}">
					{formatDateTime(save.savedAt)} - Saved by: {save.savedBy} - {save.description}
				</a>
			</li>
		{/each}
	</ul>
{:else}
	No saves
{/if}
