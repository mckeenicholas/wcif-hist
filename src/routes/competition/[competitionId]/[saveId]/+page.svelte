<script lang="ts">
	import { page } from '$app/state';
	import { formatDateTime } from '$lib/util';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div>
	Created at: {data.savedAt} - Saved by: {data.savedByName} - {data.description}
</div>
