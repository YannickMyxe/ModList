<script setup lang="ts">
import type { ModList } from "@/types/ModList.ts";
import type {ModListItem} from "@/types/ModListItem.ts";
import {computed} from "vue";

const props = defineProps<{
  modList?: ModList | ModListItem[] | null
}>();

// Safely normalize whether modList is an array or { items: [...] }
const items = computed<ModListItem[]>(() => {
  if (!props.modList) return []
  if (Array.isArray(props.modList)) return props.modList
  return props.modList.items ?? []
})
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Version</th>
        <th>URL</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="mod in items" :key="mod.name">
        <td>{{ mod.name }}</td>
        <td>{{ mod.version }}</td>
        <td>
          <a :href="mod.url" target="_blank" class="text-blue-500 underline">{{ mod.url }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
