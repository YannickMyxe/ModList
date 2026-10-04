<script setup lang="ts">
import type { ModList } from "@/types/ModList.ts";
import type { ModListItem } from "@/types/ModListItem.ts";
import { computed } from "vue";

const props = defineProps<{
  modList?: ModList | ModListItem[] | null
}>();

const items = computed<ModListItem[]>(() => {
  if (!props.modList) return []
  if (Array.isArray(props.modList)) return props.modList
  return props.modList.items ?? []
})
</script>

<template>
  <div v-if="props.modList" class="mt-6">
    <!-- Header with item count badge -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-gray-800">Mod List</h2>
      <span class="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
        {{ items.length }} {{ items.length === 1 ? 'mod' : 'mods' }}
      </span>
    </div>

    <!-- Table Card Container with overflow handling -->
    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
      <table class="w-full text-left text-sm text-gray-600 border-collapse">
        <!-- Header -->
        <thead class="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <tr>
          <th scope="col" class="px-6 py-3.5">Name</th>
          <th scope="col" class="px-6 py-3.5">Version</th>
          <th scope="col" class="px-6 py-3.5">Website / Repository</th>
        </tr>
        </thead>

        <!-- Body -->
        <tbody class="divide-y divide-gray-100">
        <tr
          v-for="mod in items"
          :key="mod.name"
          class="hover:bg-gray-50/80 transition-colors"
        >
          <!-- Mod Name -->
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ mod.name }}
          </td>

          <!-- Version Badge -->
          <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                v{{ mod.version.replace(/^v/, '') }}
              </span>
          </td>

          <!-- Link -->
          <td class="px-6 py-4 max-w-sm truncate">
            <a
              v-if="mod.url"
              :href="mod.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <span class="truncate">{{ mod.url.replace(/^https?:\/\//, '') }}</span>
              <span class="text-xs">↗</span>
            </a>
            <span v-else class="text-gray-400 italic">No URL</span>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="items.length === 0">
          <td colspan="3" class="px-6 py-10 text-center text-gray-400">
            No mods found in the uploaded file.
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
