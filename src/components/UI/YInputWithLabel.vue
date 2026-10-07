<script lang="ts" setup>
const props = defineProps<{
  label: string,
  type: "text" | "number",
  id: string,
  placeholder?: string,
}>();
const model = defineModel<string>();
</script>

<template>
  <label :for="props.id" class="mr-3">{{ props.label }}</label>
  <input :id="props.id" v-model="model"
         :placeholder="props.placeholder?? `${props.label} ...`"
         :type="props.type" class="py-3 px-5 w-full rounded-md border border-b-gray-400"/>
</template>

