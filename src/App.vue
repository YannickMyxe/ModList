<script setup lang="ts">



import NavBar from "@/components/UI/NavBar.vue";
</script>

<template>
  <div class="max-w-7xl mt-5 mx-auto p-3">
    <nav-bar />
    <h1 class="text-4xl">ModListItem Project</h1>
    <div>
      <p>Welcome to ModList! Here you can compare modpacks, check what mods have updated and compare what mods people like</p>
    </div>
    <RouterView />
  </div>
</template>
