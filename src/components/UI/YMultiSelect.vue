<script lang="ts" setup>
import {
  createListCollection,
  SelectClearTrigger,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@ark-ui/vue/select'
import {CheckIcon, ChevronsUpDownIcon, XIcon} from 'lucide-vue-next'
import {computed} from 'vue'

type SelectItem = {
  label: string, value: string,
};

const props = defineProps<{
  items: SelectItem[];
  label: string;
  placeholder: string;
}>();

const model = defineModel<string[]>({required: true});

const collection = computed(() => createListCollection<SelectItem>({
  items: props.items,
  itemToValue: item => item.value,
  itemToString: item => item.label,
}));
</script>

<template>
  <SelectRoot
    :collection="collection"
    :model-value="model"
    class="flex w-full max-w-md flex-col gap-1.5"
    multiple
    @update:model-value="model = $event"
  >
    <SelectLabel class="text-sm font-medium text-gray-700">{{ props.label }}</SelectLabel>
    <SelectControl class="flex items-center gap-1.5">
      <SelectTrigger
        class="flex min-h-10 flex-1 items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 shadow-xs transition hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      >
        <SelectValueText :placeholder="props.placeholder" class="truncate"/>
        <SelectIndicator class="shrink-0 text-gray-500">
          <ChevronsUpDownIcon class="h-4 w-4"/>
        </SelectIndicator>
      </SelectTrigger>
      <SelectClearTrigger
        aria-label="Clear status filters"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
      >
        <XIcon class="h-4 w-4"/>
      </SelectClearTrigger>
    </SelectControl>
    <Teleport to="body">
      <SelectPositioner class="z-50">
        <SelectContent
          class="mt-1 min-w-[var(--reference-width)] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <SelectItemGroup>
            <SelectItemGroupLabel
              class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ props.label }}
            </SelectItemGroupLabel>
            <SelectItem
              v-for="item in collection.items"
              :key="item.value"
              :item="item.value"
              class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-800 data-[state=checked]:font-medium"
            >
              <SelectItemText>{{ item.label }}</SelectItemText>
              <SelectItemIndicator class="text-blue-600">
                <CheckIcon class="h-4 w-4"/>
              </SelectItemIndicator>
            </SelectItem>
          </SelectItemGroup>
        </SelectContent>
      </SelectPositioner>
    </Teleport>
    <SelectHiddenSelect/>
  </SelectRoot>
</template>
