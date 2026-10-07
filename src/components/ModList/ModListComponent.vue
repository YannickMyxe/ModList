<script setup lang="ts">
import type { ModList } from "@/types/ModList.ts";
import type { ModListItem } from "@/types/ModListItem.ts";
import ModListTable from "@/components/ModList/ModListTable.vue";
import { computed } from "vue";
import {downloadJson} from "@/utils/downloadJson.ts";
import BackToTopButton from "@/components/UI/BackToTopButton.vue";

const props = defineProps<{
  modList?: ModList | ModListItem[] | null
}>();

const items = computed<ModListItem[]>(() => {
  if (!props.modList) return []
  if (Array.isArray(props.modList)) return props.modList
  return props.modList.items ?? []
})

const submitRatings = () => {
  if (items.value.length === 0) return

  const ratedItems: ModListItem[] = items.value.map((mod) => ({
    name: mod.name,
    version: mod.version,
    url: mod.url,
    rating: mod.rating ?? 0,
  }))

  const exportPayload = Array.isArray(props.modList)
    ? ratedItems
    : { items: ratedItems }

  downloadJson(exportPayload, `modlist-rated-${new Date().toISOString().slice(0, 10)}.json`);
}
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

    <!-- Mod List Table -->
    <ModListTable :items="items" />

    <!-- Action bar below the table -->
    <div v-if="items.length > 0" class="mt-4 flex items-center justify-between">
      <p class="text-xs text-gray-500">
        Mods with no rating will default to 0.
      </p>

      <div class="flex items-center gap-3">
        <BackToTopButton variant="inline" />

        <!-- Submit & Export button -->
        <button
          type="button"
          @click="submitRatings"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Submit & Export Ratings
        </button>
      </div>
    </div>

    <BackToTopButton />
  </div>
</template>
