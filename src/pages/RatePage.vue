<script setup lang="ts">
import ModListComponent from "@/components/ModListComponent.vue"
import FileUpload from "@/components/UI/FileUpload.vue";
import type { ModList } from "@/types/ModList.ts"
import { ref } from "vue";

const currentModList = ref<ModList | null>(null)

const handleModListUploaded = (modList: ModList | null) => {
  currentModList.value = modList;
  console.table(modList);
}
</script>

<template>
  <h2 class="text-xl mt-3">Rate a modlist</h2>
  <p>Here you can rate a modlist, give each mod a score from 0-5, 5 is the best, 0.5 the worst. Giving a mod a 0 means that don't know this mod or this is a library mod and can be ignored.</p>
  <FileUpload class="mt-1" @mod-list-uploaded="handleModListUploaded" />
  <ModListComponent :mod-list="currentModList" />
</template>

