<script lang="ts" setup>
import {computed} from "vue";

type DisplayOptions = "name" | "short-url" | "full-url";

const props = withDefaults(
  defineProps<{
    url: string;
    label: string;
    display?: DisplayOptions;
  }>(), {
    display: "name",
  }
);

const shortenUrl = () => {
  return props.url.replace(/^https?:\/\//, '')
};

const renderName = computed(() => {
  if (props.display === "name") {
    return props.label;
  }
  if (props.display === "full-url") {
    return props.url;
  }
  if (props.display === "short-url") {
    return shortenUrl();
  }

  return props.label;
});

</script>

<template>
  <a
    :href="props.url"
    class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
    rel="noopener noreferrer"
    target="_blank"
  >
    <span class="truncate">{{ renderName }}</span>
    <span class="text-xs">↗</span>
  </a>
</template>

<style scoped>

</style>
