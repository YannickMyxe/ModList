<script setup lang="ts">
import ModListComponent from "@/components/ModList/ModListComponent.vue"
import ModListUpload from "@/components/ModList/ModListUpload.vue"
import type { ModList } from "@/types/ModList.ts"
import { ref } from "vue";

const currentModList = ref<ModList | null>(null)

const handleModListUploaded = (modList: ModList | null) => {
  currentModList.value = modList;
  console.table(modList);
}
</script>

<template>
  <h2 class="text-3xl mt-3">Rate a modlist</h2>
  <div>
    <p>Here you can rate a modlist, give each mod a score from 0-5, 5 is the best, 0.5 the worst. Giving a mod a 0 means that don't know this mod or this is a library mod and can be ignored.</p>
    <p>You can also upload an already rated file to change its ratings.</p>
    <p>Warning: Keep in mind that progress is not saved automatically, you have to download the file.</p>
    <p><router-link to="/compare" class="text-sky-800 underline link">Want to compare your ratings with others?</router-link></p>
  </div>
  <ModListUpload class="mt-3" @mod-list-uploaded="handleModListUploaded" />
  <ModListComponent :mod-list="currentModList" />
</template>
