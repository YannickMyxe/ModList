<script lang="ts" setup>
const model = defineModel<string>({required: true});

const props = defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <input
    v-model="model"
    :placeholder="props.placeholder ?? 'Filter...'"
    aria-label="Filter table"
    class="rounded border px-3 py-2"
    type="search"
  />
</template>
