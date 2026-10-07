<script lang="ts" setup>
const props = defineProps<{
  head: string[];
}>();
</script>

<template>
  <table class="w-full text-left text-sm text-gray-600 border-collapse">
    <!-- Header -->
    <thead
      class="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
    <tr>
      <slot name="header">
        <th v-for="column in props.head" :key="column" class="px-6 py-3.5 text-md" scope="col">
          {{ column }}
        </th>
      </slot>
    </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
    <slot></slot>
    </tbody>
  </table>
</template>
