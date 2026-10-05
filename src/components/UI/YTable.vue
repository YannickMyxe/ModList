<script setup lang="ts">

import ModRating from "@/components/UI/ModRating.vue";

const props = defineProps<{
  head: string[];
}>();
</script>

<template>
  <table class="w-full text-left text-sm text-gray-600 border-collapse">
    <!-- Header -->
    <thead class="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
    <tr>
      <th v-for="column in props.head" :key="column" scope="col" class="px-6 py-3.5">
        {{ column }}
      </th>
    </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <slot></slot>
    </tbody>
  </table>
</template>
