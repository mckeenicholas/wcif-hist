<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div>
	Created at: {data.savedAt} - Saved by: {data.savedByName} - {data.description}
</div>
