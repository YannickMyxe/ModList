<script setup lang="ts">
import DownloadSvg from "@/components/UI/svg/download-svg.vue";
import YButton from "@/components/UI/YButton.vue";
import type {ButtonType} from "@/components/UI/YButton.vue";

const props = withDefaults(defineProps<{
  disabled?: boolean;
  iconPosition?: "left" | "right";
  text?: string;
  type?: ButtonType;
}>(), {
  text: "Download",
  type: "button",
  disabled: false,
  iconPosition: "left",
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void,
}>();

const onClick = (event: MouseEvent): void => {
  emit("click", event);
};

</script>

<template>
  <y-button
    :type="props.type"
    @click="onClick"
    :disabled="props.disabled"
    variant="primary"
  >
    <template v-if="props.iconPosition === 'left'">
      <download-svg />
      <slot v-if="$slots.default" />
      <template v-else>{{ props.text }}</template>
    </template>
    <template v-else>
      <slot v-if="$slots.default" />
      <template v-else>{{ props.text }}</template>
      <download-svg />
    </template>
  </y-button>
</template>

