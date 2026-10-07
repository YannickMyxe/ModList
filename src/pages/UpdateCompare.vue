<script setup lang="ts">
import {computed, ref} from "vue";
import type {ModList} from "@/types/ModList.ts";
import type {ModListItem} from "@/types/ModListItem.ts";
import ModListUpload from "@/components/ModList/ModListUpload.vue";
import YTable from "@/components/UI/YTable.vue";
import BackToTopButton from "@/components/UI/BackToTopButton.vue";
import DownloadButton from "@/components/UI/DownloadButton.vue";
import ModUrl from "@/components/ModList/ModUrl.vue";
import YMultiSelect from "@/components/UI/YMultiSelect.vue";

type UpdatedMod = {
  previous: ModListItem;
  current: ModListItem;
};

type ModListChanges = {
  added: ModListItem[];
  removed: ModListItem[];
  updated: UpdatedMod[];
};

type ModStatus = "Added" | "Removed" | "Updated" | "No changes";

type ModRow = {
  url: string;
  name: string;
  oldVersion: string | null;
  newVersion: string | null;
  status: ModStatus;
};

const statusOptions: { label: string, value: string, }[] = [
  { label: "Added", value: "Added" },
  { label: "Removed", value: "Removed" },
  { label: "Updated", value: "Updated" },
  { label: "No changes", value: "No changes" },
];

const oldModList = ref<ModList | null>(null);
const newModList = ref<ModList | null>(null);

const changes = computed<ModListChanges | null>(() => {
  if (!oldModList.value || !newModList.value) return null;

  const oldByUrl: Map<string, ModListItem> = new Map(oldModList.value.items.map(item => [item.url, item]));
  const newByUrl: Map<string, ModListItem> = new Map(newModList.value.items.map(item => [item.url, item]));

  return {
    added: newModList.value.items.filter(item => !oldByUrl.has(item.url)),
    removed: oldModList.value.items.filter(item => !newByUrl.has(item.url)),
    updated: newModList.value.items.flatMap(item => {
      const previous = oldByUrl.get(item.url);
      return previous && previous.version !== item.version
        ? [{previous, current: item}]
        : [];
    }),
  };
});

const markdownEscape = (value: string): string =>
  value.replace(/[\\`*_{}[\]()#+.!|>~-]/g, "\\$&");

const modLink = (item: ModListItem): string =>
  `[${markdownEscape(item.name)}](${item.url.replace(/[()\\\s]/g, "\\$&")})`;

const changelog = computed(() => {
  const result = changes.value;
  if (!result) return "";

  const sections = [
    ["Added", result.added.map(item => `- ${modLink(item)} (v${markdownEscape(item.version)})`)],
    ["Updated", result.updated.map(({previous, current}) =>
      `- ${modLink(current)}: v${markdownEscape(previous.version)} → v${markdownEscape(current.version)}`)],
    ["Removed", result.removed.map(item => `- ${modLink(item)} (v${markdownEscape(item.version)})`)],
  ] as const;

  return [
    "# Mod list changes",
    "",
    ...sections.flatMap(([title, items]) => [
      `## ${title} (${items.length})`,
      "",
      ...(items.length > 0 ? items : ["- None"]),
      "",
    ]),
  ].join("\n").trimEnd() + "\n";
});

const downloadChangelog = (): void => {
  if (!changes.value) return;

  const blob = new Blob([changelog.value], {type: "text/markdown;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `modlist-changelog-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const tableHeaders = ["Mod", "Old-Version", "New Version", "Status"];

const onOldModListUploaded = (lists: ModList[]): void => {
  oldModList.value = lists[0] ?? null;
};

const onNewModListUploaded = (lists: ModList[]): void => {
  newModList.value = lists[0] ?? null;
};

const amountOfChanges = computed(() => {
  const result = changes.value;
  if (!result) return 0;

  return result.added.length + result.removed.length + result.updated.length;
})

const modRows = computed<ModRow[]>(() => {
  if (!oldModList.value || !newModList.value) return [];
  const oldByUrl: Map<string, ModListItem> = new Map(oldModList.value.items.map(item => [item.url, item]));
  const newByUrl: Map<string, ModListItem> = new Map(newModList.value.items.map(item => [item.url, item]));
  const urls = new Set([...oldByUrl.keys(), ...newByUrl.keys()]);

  return [...urls]
    .map(url => {
      const oldItem = oldByUrl.get(url);
      const newItem = newByUrl.get(url);

      let status: ModStatus;
      if (!oldItem) status = "Added";
      else if (!newItem) status = "Removed";
      else if (oldItem.version !== newItem.version) status = "Updated";
      else status = "No changes";

      return {
        url,
        name: newItem?.name ?? oldItem!.name,
        oldVersion: oldItem?.version ?? null,
        newVersion: newItem?.version ?? null,
        status,
      } as ModRow
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
});

const selectedStatuses = ref<string[]>([]);
const filteredRows = computed(() => {
  if (selectedStatuses.value.length === 0) return modRows.value;

  return modRows.value.filter(row =>
    selectedStatuses.value.includes(row.status)
  );
});
</script>

<template>
  <h2 class="text-3xl">Compare 2 versions of modlist</h2>
  <p>Here you can compare 2 versions of a modlist and see what changed. See what is removed, added, updated.</p>
  <p>Use the changelog generator to generate a MD template which you can use as your changelog.</p>

  <div class="flex w-full flex-col gap-3 md:flex-row">
    <ModListUpload
      class="mt-5 min-w-0 flex-1"
      :max-files="1"
      text="Upload the old modlist"
      dropzone-text="Upload Old modlist"
      @mod-list-uploaded="onOldModListUploaded"
    />
    <ModListUpload
      class="mt-5 min-w-0 flex-1"
      :max-files="1"
      text="Upload the new modlist"
      dropzone-text="Upload New modlist"
      @mod-list-uploaded="onNewModListUploaded"
    />
  </div>

  <section v-if="changes" class="mt-4 space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h3 class="text-2xl font-semibold">Changes between modlists</h3>
      <DownloadButton :disabled="amountOfChanges === 0" text="Download Markdown Changelog" @click="downloadChangelog" />
    </div>
    <div class="flex flex-col gap-3">
      <label for="summary">Add an optional changelog summary above the list of changes. You can use Markdown. After downloading the file you can still change anything you want.</label>
      <textarea class="p-3 rounded-md border border-b-gray-400" name="summary" id="summary" cols="30" rows="10" placeholder="Insert changelog summary here ..."></textarea>
    </div>

    <div>
      <YMultiSelect :items="statusOptions" label="Select status to show" placeholder="All statuses" v-model="selectedStatuses" ></YMultiSelect>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs mb-9">
    <y-table :head="tableHeaders">
      <tr v-if="filteredRows.length === 0">
        <td class="w-full text-center text-lg py-5" :colspan="tableHeaders.length">No mods found.</td>
      </tr>
      <tr v-else-if="amountOfChanges === 0">
        <td class="w-full text-center text-lg py-5" :colspan="tableHeaders.length">No changes found.</td>
      </tr>
      <tr v-else v-for="row in filteredRows" class="hover:bg-gray-50/80 transition-colors" :key="row.url">
        <td class="px-6 py-4 whitespace-nowrap">
          <mod-url :url="row.url" :label="row.name" />
        </td>
        <td class="px-6 py-4 whitespace-nowrap">{{row.oldVersion?? "-"}}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{row.newVersion?? "-"}}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{row.status}}</td>
      </tr>
    </y-table>
    </div>

    <div v-if="modRows.length > 0" class="mb-8 flex justify-end">
      <BackToTopButton variant="inline" />
    </div>
  </section>

  <BackToTopButton />
</template>
