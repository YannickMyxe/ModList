<script lang="ts" setup>
import ModListUpload from "@/components/ModList/ModListUpload.vue";
import YButton from "@/components/UI/YButton.vue";
import type {ModList} from "@/types/ModList.ts";
import {computed, ref} from "vue";
import YTable from "@/components/UI/YTable.vue";
import TableFilter from "@/components/UI/TableFilter.vue";
import YSelect from "@/components/UI/YSelect.vue";
import BackToTopButton from "@/components/UI/BackToTopButton.vue";
import {downloadJson} from "@/utils/downloadJson.ts";
import type {ComparisonItem} from "@/types/ModListComparison.ts";
import {createModListComparison} from "@/utils/modListComparison.ts";
import DownloadButton from "@/components/UI/DownloadButton.vue";
import ModUrl from "@/components/ModList/ModUrl.vue";

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

const tableRowToComparison = (table: TableRow): ComparisonItem => {
  return {
    name: table.data.name,
    url: table.data.url,
    ratings: table.data.ratings,
    average: table.average,
  }
}

type RatingStrictness = "lower" | "equal" | "higher";

const tableRows = ref<TableRow[]>([]);
const searchQuery = ref("");
const filterRating = ref<number>(-1);
const ratingStrictness = ref<RatingStrictness>("higher");

const ratingOptions: ({ label: string, value: number })[] = [
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

const tableHeads = ['Modname/Link', 'Ratings', 'Average'];

const filteredRows = computed<TableRow[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return tableRows.value.filter(({data, average}) => {
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

const formatAverage = (row: TableRow): string =>
  row.average === null ? 'Not rated' : row.average.toFixed(1);

const averageTextClass = (row: TableRow): string =>
  row.average === null ? 'text-gray-400' : 'text-gray-900';

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

const downloadComparison = () => {
  if (tableRows.value.length === 0) return;

  const items = createModListComparison(tableRows.value.map((row: TableRow) =>
    tableRowToComparison(row)
  ));

  downloadJson(items, `modlist-rating-comparison-${new Date().toISOString().slice(0, 10)}.json`);
};

const downloadFilteredComparison = () => {
  if (filteredRows.value.length === 0) return;

  const items = createModListComparison(filteredRows.value.map((row: TableRow) =>
    tableRowToComparison(row)
  ));

  downloadJson(items, `modlist-rating-comparison-filtered-${new Date().toISOString().slice(0, 10)}.json`);
};
</script>

<template>
  <h1 class="text-3xl">Compare multiple ratings and see the differences</h1>
  <ModListUpload :max-files="null" @mod-list-uploaded="onUpload"/>
  <div class="flex justify-between">
    <YButton class="my-5" text="Compare ratings" @click="compareRatings"/>
    <YButton class="my-5" text="Clear Data" @click="clearData"/>
  </div>

  <div v-if="tableRows.length > 0" class="mt-6">
    <!-- Header with item count badge -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-gray-800">Mod List</h2>
      <span
        class="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
        <template v-if="filteredRows.length === tableRows.length">
          {{ tableRows.length }} {{ tableRows.length === 1 ? 'mod' : 'mods' }}
        </template>
        <template v-else>
          {{ filteredRows.length }} of {{
            tableRows.length
          }} {{ tableRows.length === 1 ? 'mod' : 'mods' }}
        </template>
      </span>
    </div>
  </div>

  <div class="mb-3 flex flex-row flex-wrap gap-5">
    <div>
      <label class="mr-2" for="mod-filter">Filter on mod name:</label>
      <TableFilter id="mod-filter" v-model="searchQuery" placeholder="Filter mods..."/>
    </div>
    <div>
      <label class="mr-2" for="mod-rating">Filter on mod rating:</label>
      <YSelect id="mod-rating" v-model:option="filterRating" :options="ratingOptions"/>
    </div>
    <div>
      <label class="mr-2" for="strictness">Compare rating:</label>
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
        <td>
          <mod-url :label="row.data.name" :url="row.data.url" class="pl-5"/>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span v-for="(rating, index) in row.data.ratings" :key="index">
            {{ rating > 0 ? rating.toFixed(1) : '—' }}
            <span v-if="index < row.data.ratings.length - 1"> / </span>
          </span>
        </td>
        <td
          :class="['px-6 py-4 font-medium whitespace-nowrap', averageTextClass(row)]"
        >
          {{ formatAverage(row) }}
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
    <BackToTopButton variant="inline"/>
    <download-button text="Download Comparison" @click="downloadComparison"/>
    <download-button text="Download Filtered Comparison" @click="downloadFilteredComparison"/>
  </div>

  <BackToTopButton/>
</template>
