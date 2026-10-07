<script lang="ts" setup>
const props = defineProps<{
  options: Array<{ label: string; value: string | number }>;
  id?: string;
}>();

const model = defineModel<string | number>("option", {required: true});
</script>

<template>
  <select
    :id="id"
    v-model="model"
    class="rounded border px-3 py-2"
  >
    <option
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
