<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const onInput = (event: Event): void => {
  if (event.target instanceof HTMLInputElement) {
    emit("update:modelValue", event.target.value);
  }
}
</script>

<template>
  <input
    :value="props.modelValue"
    @input="onInput"
    type="search"
    :placeholder="props.placeholder ?? 'Filter...'"
    aria-label="Filter table"
    class="rounded border px-3 py-2"
  />
</template>
