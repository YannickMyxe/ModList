<script setup lang="ts">

const props = defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent),
}>();

const onClick = (event: MouseEvent): void => {
  emit("click", event);
};
</script>

<template>
  <Button class="border border-b-slate-800 px-3 py-1 rounded-2xl bg-slate-300 hover:bg-slate-400 cursor-pointer"
    @click="onClick">
    {{props.label}}
  </Button>
</template>
