<script setup lang="ts">
const model = defineModel<string>({ required: true });

const props = defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <input
    v-model="model"
    type="search"
    :placeholder="props.placeholder ?? 'Filter...'"
    aria-label="Filter table"
    class="rounded border px-3 py-2"
  />
</template>
