<script setup lang="ts">
import type { ModList } from "@/types/ModList.ts";
import type { ModListItem } from "@/types/ModListItem.ts";
import { RatingGroup } from "@ark-ui/vue/rating-group";
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modList?: ModList | ModListItem[] | null
}>();

const items = computed<ModListItem[]>(() => {
  if (!props.modList) return []
  if (Array.isArray(props.modList)) return props.modList
  return props.modList.items ?? []
})

const tableHead = [
  "Name", "Version", "Website / Repository", "Rating",
];

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

    <!-- Table Card Container with overflow handling -->
    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
      <table class="w-full text-left text-sm text-gray-600 border-collapse">
        <!-- Header -->
        <thead class="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <tr>
            <th v-for="table in tableHead" :key="table" scope="col" class="px-6 py-3.5">
              {{ table }}
            </th>
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

            <!-- Rating -->
            <td class="px-6 py-4 whitespace-nowrap">
              <RatingGroup.Root v-model="mod.rating" :count="5" :allow-half="true" :default-value="0">
                <div class="flex items-center gap-2">
                  <RatingGroup.Control class="flex items-center gap-0.5">
                    <RatingGroup.Context v-slot="{ items: starIndices }">
                      <RatingGroup.Item
                        v-for="star in starIndices"
                        :key="star"
                        :index="star"
                        class="cursor-pointer focus:outline-none p-0.5 rounded hover:scale-110 transition-transform"
                      >
                        <RatingGroup.ItemContext v-slot="{ highlighted, half }">
                          <div class="relative w-4 h-4">
                            <!-- Background empty star -->
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              class="w-4 h-4 fill-none stroke-gray-300"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>

                            <!-- Foreground filled star (full or 50% clipped if half) -->
                            <div
                              v-if="highlighted"
                              class="absolute inset-0 overflow-hidden pointer-events-none"
                              :class="half ? 'w-1/2' : 'w-full'"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                class="w-4 h-4 fill-amber-400 stroke-amber-400"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </div>
                          </div>
                        </RatingGroup.ItemContext>
                      </RatingGroup.Item>
                    </RatingGroup.Context>
                  </RatingGroup.Control>
                  <RatingGroup.Context v-slot="{ value }">
                    <span
                      class="text-xs font-semibold w-6"
                      :class="value > 0 ? 'text-amber-600' : 'text-gray-400'"
                    >
                      {{ Math.max(0, value) }}
                    </span>
                  </RatingGroup.Context>
                </div>
                <RatingGroup.HiddenInput />
              </RatingGroup.Root>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="items.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-gray-400">
              No mods found in the uploaded file.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
