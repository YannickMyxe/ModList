<script setup lang="ts">
import {createListCollection, Select} from '@ark-ui/vue/select'
import { ChevronsUpDownIcon, XIcon, CheckIcon } from 'lucide-vue-next'
import { ref } from 'vue'

type SelectItem = {
  label: string, value: string,
};

const props = defineProps<{
  items: SelectItem[];
  label: string;
  placeholder: string;
}>();

const model = defineModel<string[]>({ default: [] });

const collection = createListCollection({ items: props.items });
</script>

<template>
  <Select.Root :collection="collection" v-model="model" multiple class="flex w-full max-w-md flex-col gap-1.5">
    <Select.Label class="text-sm font-medium text-gray-700">{{ props.label }}</Select.Label>
    <Select.Control class="flex items-center gap-1.5">
      <Select.Trigger
        class="flex min-h-10 flex-1 items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 shadow-xs transition hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      >
        <Select.ValueText :placeholder="props.placeholder" class="truncate" />
        <Select.Indicator class="shrink-0 text-gray-500">
          <ChevronsUpDownIcon class="h-4 w-4" />
        </Select.Indicator>
      </Select.Trigger>
      <Select.ClearTrigger
        aria-label="Clear status filters"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      >
        <XIcon class="h-4 w-4" />
      </Select.ClearTrigger>
    </Select.Control>
    <Teleport to="body">
      <Select.Positioner class="z-50">
        <Select.Content class="mt-1 min-w-[var(--reference-width)] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <Select.ItemGroup>
            <Select.ItemGroupLabel class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ props.label }}
            </Select.ItemGroupLabel>
            <Select.Item
              v-for="item in collection.items"
              :key="item.value"
              :item="item.value"
              class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-800 data-[state=checked]:font-medium"
            >
              <Select.ItemText>{{ item.label }}</Select.ItemText>
              <Select.ItemIndicator class="text-blue-600">
                <CheckIcon class="h-4 w-4" />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Teleport>
    <Select.HiddenSelect />
  </Select.Root>
</template>
