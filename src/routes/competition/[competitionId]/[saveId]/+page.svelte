<script lang="ts">
	import PersonList from '$lib/components/PersonList.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div>
	Created at: {data.savedAt} - Saved by: {data.savedByName} - {data.description}
</div>

<PersonList competitors={data.wcif.persons} schedule={data.wcif.schedule} />
