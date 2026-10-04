<script setup lang="ts">
import type { ModList } from "@/types/ModList.ts";
import type { ModListItem } from "@/types/ModListItem.ts";
import ModListTable from "@/components/ModListTable.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modList?: ModList | ModListItem[] | null
}>();

const items = computed<ModListItem[]>(() => {
  if (!props.modList) return []
  if (Array.isArray(props.modList)) return props.modList
  return props.modList.items ?? []
})

const showBackToTop = ref(false);

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

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

  const jsonString = JSON.stringify(exportPayload, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const downloadUrl = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = downloadUrl
  link.download = `modlist-rated-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
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
        <!-- Inline Back to top button -->
        <button
          type="button"
          @click="scrollToTop"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Back to top
        </button>

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

    <!-- Floating Back to Top button (visible after scrolling down) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-show="showBackToTop"
        type="button"
        @click="scrollToTop"
        aria-label="Back to top"
        title="Back to top"
        class="fixed bottom-6 right-6 p-3 bg-white/95 hover:bg-white text-gray-700 hover:text-blue-600 border border-gray-200 rounded-full shadow-lg backdrop-blur-xs transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </Transition>
  </div>
</template>
