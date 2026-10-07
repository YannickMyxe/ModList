<script setup lang="ts">
export type ButtonType = "button" | "submit" | "reset";
export type ButtonVariant = "default" | "primary";

const props = withDefaults(defineProps<{
  text?: string;
  type?: ButtonType;
  disabled?: boolean;
  variant?: ButtonVariant;
}>(), {
  type: "button",
  text: "submit",
  disabled: false,
  variant: "default",
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void,
}>();

const onClick = (event: MouseEvent): void => {
  emit("click", event);
};
</script>

<template>
  <button @click="onClick" :disabled="props.disabled" :type="props.type"
          :class="[
    'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium cursor-pointer disabled:cursor-not-allowed',
    props.variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-60'
      : 'rounded-2xl border border-b-slate-800 bg-slate-300 px-3 py-1 hover:bg-slate-400',
  ]">
    <slot v-if="$slots.default"/>
    <template v-else>{{ props.text }}</template>
  </button>
</template>
