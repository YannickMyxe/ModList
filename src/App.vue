<script setup lang="ts">
import ModListComponent from "./components/ModListComponent.vue"
import FileUpload from "@/components/UI/FileUpload.vue";
import type { ModList } from "@/types/ModList.ts"
import {ref} from "vue";

const currentModList = ref<ModList | null>(null)

const handleModListUploaded = (modList: ModList) => {
  currentModList.value = modList
  console.table(modList)
}
</script>

<template>
  <div class="max-w-7xl mt-5 mx-auto">
    <h1 class="text-4xl">ModListItem Project</h1>
    <FileUpload @mod-list-uploaded="handleModListUploaded" />
    <ModListComponent />
  </div>
</template>
