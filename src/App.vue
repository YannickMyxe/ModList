<script setup lang="ts">
import ModListComponent from "./components/ModListComponent.vue"
import FileUpload from "@/components/UI/FileUpload.vue";
</script>

<template>
  <div class="max-w-7xl mt-5 mx-auto">
    <h1 class="text-4xl">ModList Project</h1>
    <ModListComponent />
    <FileUpload/>
  </div>
</template>
