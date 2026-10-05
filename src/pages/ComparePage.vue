<script setup lang="ts">
import ModListUpload from "@/components/ModList/ModListUpload.vue";
import YButton from "@/components/UI/YButton.vue";
import type {ModList} from "@/types/ModList.ts";
import {computed, onMounted, onUnmounted, ref} from "vue";
import YTable from "@/components/UI/YTable.vue";
import TableFilter from "@/components/UI/TableFilter.vue";
import YSelect from "@/components/UI/YSelect.vue";
import {downloadJson} from "@/utils/downloadJson.ts";

const modLists = ref<ModList[]>([]);

type RatingRow = {
  url: string;
  name: string;
  ratings: number[];
}

type TableRow = {
  data: RatingRow;
  average: number | null;
}

type RatingStrictness = "lower" | "equal" | "higher";

const tableRows = ref<TableRow[]>([]);
const searchQuery = ref("");
const filterRating = ref<number>(-1);
const ratingStrictness = ref<RatingStrictness>("higher");
const showBackToTop = ref(false);

const ratingOptions: ({label: string, value: number})[] = [
  {label: 'All', value: -1},
  {label: 'Not Rated', value: 0},
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
  {label: '4', value: 4},
  {label: '5', value: 5},
];

const strictnessOptions: ({ label: string; value: RatingStrictness })[] = [
  {label: "Lower than", value: "lower"},
  {label: "Equal", value: "equal"},
  {label: "Higher than", value: "higher"},
];

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return tableRows.value.filter(({ data, average }) => {
    const matchesName =
      !query || data.name.toLowerCase().includes(query);

    let matchesRating: boolean;
    if (filterRating.value === -1) {
      matchesRating = true;
    } else if (filterRating.value === 0) {
      matchesRating = average === null;
    } else if (average === null) {
      matchesRating = false;
    } else {
      switch (ratingStrictness.value) {
        case "lower":
          matchesRating = average < filterRating.value;
          break;
        case "equal":
          matchesRating = average === filterRating.value;
          break;
        case "higher":
          matchesRating = average > filterRating.value;
          break;
      }
    }

    return matchesName && matchesRating;
  });
});

const calculateRating = (row: RatingRow) => {
  const rated = row.ratings.filter(rating => rating > 0);
  return rated.length > 0
    ? rated.reduce((sum, rating) => sum + rating, 0) / rated.length
    : null;
}

const compareRatings = () => {
  tableRows.value = [];

  const ratingsByMod = new Map<string, RatingRow>();

  modLists.value.forEach((list, listIndex) => {
    list.items.forEach(item => {
      let row = ratingsByMod.get(item.url);
      if (!row) {
        row = {
          url: item.url,
          name: item.name,
          ratings: Array<number>(modLists.value.length).fill(0),
        };
        ratingsByMod.set(item.url, row);
      }

      row.ratings[listIndex] = item.rating ?? 0;
    });
  });

  for (const row of ratingsByMod.values()) {
    tableRows.value.push({
      data: row,
      average: calculateRating(row),
    });
  }
};

const onUpload = (lists: ModList[]): void => {
  modLists.value = lists;
  compareRatings();
}

const clearData = () => {
  tableRows.value = [];
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({top: 0, behavior: "smooth"});
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, {passive: true});
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const downloadComparison = () => {
  if (tableRows.value.length === 0) return;

  downloadJson(tableRows.value, `modlist-rating-comparison-${new Date().toISOString().slice(0, 10)}.json`);
};

const downloadFilteredComparison =  () => {
  if (tableRows.value.length === 0) return;

  downloadJson(filteredRows.value, `modlist-rating-comparison-filtered-${new Date().toISOString().slice(0, 10)}.json`);
};

const tableHeads = ['Modname/Link', 'Ratings', 'Average'];
</script>

<template>
  <h1 class="text-3xl">Compare 2 versions and see the differences</h1>
  <ModListUpload :max-files="null" @mod-list-uploaded="onUpload" />
  <div class="flex justify-between">
    <YButton class="my-5" @click="compareRatings" label="Compare ratings" />
    <YButton class="my-5" @click="clearData" label="Clear Data" />
  </div>

  <div v-if="tableRows.length > 0" class="mt-6">
    <!-- Header with item count badge -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-gray-800">Mod List</h2>
      <span class="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
        {{ tableRows.length }} {{ tableRows.length === 1 ? 'mod' : 'mods' }}
      </span>
    </div>
  </div>

  <div class="mb-3 flex flex-row flex-wrap gap-5">
    <div>
      <label for="mod-filter" class="mr-2">Filter on mod name:</label>
      <TableFilter id="mod-filter" v-model="searchQuery" placeholder="Filter mods..." />
    </div>
    <div>
      <label for="mod-rating" class="mr-2">Filter on mod rating:</label>
      <YSelect id="mod-rating" v-model:option="filterRating" :options="ratingOptions"/>
    </div>
    <div>
      <label for="strictness" class="mr-2">Compare rating:</label>
      <YSelect id="strictness" v-model:option="ratingStrictness" :options="strictnessOptions"/>
    </div>
  </div>



  <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs mb-9">
    <y-table :head="tableHeads" class="">
      <tr
        v-for="row in filteredRows"
        :key="row.data.url"
        class="hover:bg-gray-50/80 transition-colors"
      >
        <td><a
          :href="row.data.url"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          <span class="truncate">{{ row.data.name }}</span>
          <span class="text-xs">↗</span>
        </a></td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span v-for="(rating, index) in row.data.ratings" :key="index">
            {{ rating > 0 ? rating.toFixed(1) : '—' }}
            <span v-if="index < row.data.ratings.length - 1"> / </span>
          </span>
        </td>
        <td
          :class="[
            'px-6 py-4 font-medium whitespace-nowrap',
            row.average === null ? 'text-gray-400' : 'text-gray-900',
          ]"
          >
          {{ row.average === null ? 'Not rated' : row.average.toFixed(1) }}
        </td>
      </tr>
      <tr v-if="tableRows.length === 0">
        <td :colspan="tableHeads.length" class="px-6 py-8 text-center text-gray-400">
          No data
        </td>
      </tr>
      <tr v-else-if="filteredRows.length === 0">
        <td :colspan="tableHeads.length" class="px-6 py-8 text-center text-gray-400">
          No matching mods
        </td>
      </tr>
    </y-table>
  </div>

  <div v-if="tableRows.length > 0" class="mb-8 flex justify-end gap-3">
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
    <button
      type="button"
      @click="downloadComparison"
      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Comparison
    </button>
    <button
      type="button"
      @click="downloadFilteredComparison"
      class="inline-flex items-center gap-2 px-4 py-2 bg-sky-800 hover:bg-sky-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Filtered Comparison
    </button>
  </div>

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
</template>
