<script setup lang="ts">
import ModListUpload from "@/components/ModList/ModListUpload.vue";
import YButton from "@/components/UI/YButton.vue";
import type {ModList} from "@/types/ModList.ts";
import {computed, ref} from "vue";
import YTable from "@/components/UI/YTable.vue";
import TableFilter from "@/components/UI/TableFilter.vue";

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

const tableRows = ref<TableRow[]>([]);
const searchQuery = ref("");

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return tableRows.value;

  return tableRows.value.filter(({data}) =>
    data.name.toLowerCase().includes(query)
  );
});

const calculateRating = (row: RatingRow) => {
  const rated = row.ratings.filter(rating => rating > 0);
  return rated.length > 0
    ? rated.reduce((sum, rating) => sum + rating, 0) / rated.length
    : null;
}

const compareRatings = () => {
  if (modLists.value.length < 2) {
    console.warn("Not enough mod lists");
    return;
  }

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
}

const clearData = () => {
  tableRows.value = [];
}

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

  <div class="mb-3">
    <label for="mod-filter" class="mr-2">Filter on mod name:</label>
    <TableFilter id="mod-filter" v-model="searchQuery" placeholder="Filter mods..." />
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
</template>
