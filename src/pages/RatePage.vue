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
  <FileUpload @mod-list-uploaded="handleModListUploaded" />
  <ModListComponent :mod-list="currentModList" />
</template>

