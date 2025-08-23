<script lang="ts">
	import JsonNode from './JsonNode.svelte';

	interface Props {
		data: object;
	}

	const { data }: Props = $props();
</script>

<div class="max-w-full overflow-x-auto border border-gray-200 bg-gray-100 p-4 font-mono">
	<JsonNode {data} key="" level={0} />
</div>
