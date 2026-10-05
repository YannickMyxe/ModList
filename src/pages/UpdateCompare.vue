<script setup lang="ts">
import {ref} from "vue";
import type {ModList} from "@/types/ModList.ts";

const modLists = ref<ModList[]>([]);

const compareModLists = () => {
  if (modLists.value.length !== 2) {
    console.warn("Not enough mod lists");
    return;
  }

  const [baseline, updated] = modLists.value;
  const baselineByUrl = new Map(baseline.items.map(item => [item.url, item]));
  const updatedByUrl = new Map(updated.items.map(item => [item.url, item]));

  const added = updated.items.filter(item => !baselineByUrl.has(item.url));
  const removed = baseline.items.filter(item => !updatedByUrl.has(item.url));
  const changed = updated.items.flatMap(item => {
    const previous = baselineByUrl.get(item.url);
    if (!previous) return [];

    const versionChanged = previous.version !== item.version;
    const ratingChanged = previous.rating !== item.rating;
    return versionChanged || ratingChanged
      ? [{ previous, current: item, versionChanged, ratingChanged }]
      : [];
  });
  console.table(added);
  console.table(removed);
  console.table(changed);

  // Store these in a result ref and render the three groups in the template.
};
</script>

<template>
  <h2 class="text-3xl">Compare 2 versions of modlist</h2>
  <p>Here you can compare 2 versions of a modlist and see what changed. See what is removed, added, updated.</p>
  <p>Use the changelog generator to generate a MD template which you can use as your changelog.</p>
</template>

<style scoped>

</style>
