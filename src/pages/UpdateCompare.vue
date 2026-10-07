<script setup lang="ts">
import {ref} from "vue";
import type {ModList} from "@/types/ModList.ts";
import ModListUpload from "@/components/ModList/ModListUpload.vue";
import YButton from "@/components/UI/YButton.vue";
import YTable from "@/components/UI/YTable.vue";

const modLists = ref<ModList[]>([]);

const compareModLists = () => {
  if (modLists.value.length !== 2) {
    console.warn("Not enough mod lists");
    return;
  }

  const [baseline, updated] = modLists.value;
  if (!baseline || !updated) {
    return;
  }

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

const tableHeaders = [
  "Name",
  "Version",
  "Url",
];
</script>

<template>
  <h2 class="text-3xl">Compare 2 versions of modlist</h2>
  <p>Here you can compare 2 versions of a modlist and see what changed. See what is removed, added, updated.</p>
  <p>Use the changelog generator to generate a MD template which you can use as your changelog.</p>

  <div class="flex w-full flex-col gap-3 md:flex-row">
    <mod-list-upload class="mt-5" :max-files="1" label="Upload the old modlist" dropzone-text="Upload Old modlist" />
    <mod-list-upload class="mt-5" :max-files="1" label="Upload the new modlist" dropzone-text="Upload New modlist" />
  </div>

  <y-table :head="tableHeaders" class="my-5" >

  </y-table>

  <y-button label="Generate changelog"/>
</template>

<style scoped>

</style>
