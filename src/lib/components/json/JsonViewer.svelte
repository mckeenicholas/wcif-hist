<script lang="ts">
	import type { JsonValue } from '.';
	import JsonNode from './JsonNode.svelte';

	interface Props {
		data: object;
	}

	const { data }: Props = $props();
</script>

<div class="max-w-full overflow-x-auto bg-gray-50 font-mono">
	<JsonNode data={data as unknown as JsonValue} key="" level={0} />
</div>
