<script lang="ts">
	import type { JsonValue } from '.';
	import JsonNode from './JsonNode.svelte';

	interface Props {
		data: JsonValue;
		key: string;
		level?: number;
		isArrayItem?: boolean;
	}

	const { data, key, level = 0, isArrayItem = false }: Props = $props();

	let isExpanded = $state(level < 1); // Auto-expand first level

	function getDataType(value: unknown) {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value;
	}

	function getValuePreview(value: JsonValue) {
		const type = getDataType(value);
		switch (type) {
			case 'object': {
				const keys = Object.keys(value as Record<string, JsonValue>);
				return `{${keys.length} ${keys.length === 1 ? 'key' : 'keys'}}`;
			}
			case 'array': {
				const arr = value as JsonValue[];
				return `[${arr.length} ${arr.length === 1 ? 'item' : 'items'}]`;
			}
			case 'string': {
				const str = value as string;
				return str.length > 50 ? `"${str.substring(0, 50)}..."` : `"${str}"`;
			}
			case 'null':
				return 'null';
			default:
				return String(value);
		}
	}

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	function getDataTypeClass(type: string) {
		switch (type) {
			case 'string':
				return 'font-semibold text-black';
			case 'number':
				return 'text-blue-600';
			case 'boolean':
				return 'text-orange-400 font-semibold';
			case 'null':
			case 'object':
				return 'text-gray-500 italic';
			default:
				return '';
		}
	}

	let dataType = $derived(getDataType(data));
	let isExpandable = $derived(dataType === 'object' || dataType === 'array');
	let hasContent = $derived(
		(dataType === 'object' && Object.keys(data as object).length > 0) ||
			(dataType === 'array' && (data as JsonValue[]).length > 0)
	);
</script>

<div class="my-0.5" style="margin-left: {level * 20}px">
	{#if isExpandable && hasContent}
		<div
			class="flex cursor-pointer items-center rounded px-2 py-1 transition-colors duration-200 select-none hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
			onclick={toggleExpanded}
			onkeydown={(e) => e.key === 'Enter' && toggleExpanded()}
			tabindex="0"
			role="button"
		>
			<span class="text-xs text-gray-500 transition-transform duration-200">
				<span
					class="mr-2 flex flex-shrink-0 items-center justify-center text-gray-500 transition-transform duration-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4"
						class:rotate-90={isExpanded}
						aria-hidden="true"
					>
						<path d="M6 4l6 4-6 4z" />
					</svg>
				</span>
			</span>
			{#if key}
				<span class="mr-2 font-semibold text-gray-700">
					{#if isArrayItem}
						{key}:
					{:else}
						"{key}":
					{/if}
				</span>
			{/if}
			<span
				class="mr-2 rounded-full px-1.5 py-0.5 text-xs font-medium uppercase {dataType === 'object'
					? 'bg-blue-100 text-blue-800'
					: 'bg-purple-100 text-purple-800'}"
			>
				{dataType}
			</span>
			{#if !isExpanded}
				<span class="text-gray-500 italic">{getValuePreview(data)}</span>
			{/if}
		</div>

		{#if isExpanded}
			<div class="ml-2 border-l-2 border-gray-200 pl-1">
				{#if dataType === 'object'}
					{#each Object.entries(data as object) as [childKey, childValue], idx (idx)}
						<JsonNode data={childValue} key={childKey} level={level + 1} />
					{/each}
				{:else if dataType === 'array'}
					{#each data as JsonValue[] as item, idx (idx)}
						<JsonNode data={item} key={`${idx}`} level={level + 1} isArrayItem={true} />
					{/each}
				{/if}
			</div>
		{/if}
	{:else}
		<div class="flex items-center rounded px-2 py-1">
			{#if key}
				<span class="mr-2 font-semibold text-gray-700">
					{#if isArrayItem}
						{key}:
					{:else}
						"{key}":
					{/if}
				</span>
			{/if}
			<span class="font-medium {getDataTypeClass(dataType)}">
				{#if dataType === 'string'}
					"{data}"
				{:else if dataType === 'null'}
					null
				{:else if dataType === 'object' || dataType === 'array'}
					{getValuePreview(data)}
				{:else}
					{data}
				{/if}
			</span>
		</div>
	{/if}
</div>
