<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";

const props = withDefaults(defineProps<{
  variant?: "floating" | "inline";
}>(), {
  variant: "floating",
});

const showButton = ref(false);

const updateVisibility = (): void => {
  showButton.value = window.scrollY > 300;
};

const scrollToTop = (): void => {
  window.scrollTo({top: 0, behavior: "smooth"});
};

onMounted(() => {
  if (props.variant === "inline") return;

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, {passive: true});
});

onUnmounted(() => {
  if (props.variant === "inline") return;

  window.removeEventListener("scroll", updateVisibility);
});
</script>

<template>
  <button
    v-if="props.variant === 'inline'"
    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
    type="button"
    @click="scrollToTop"
  >
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2"/>
    </svg>
    Back to top
  </button>
  <Transition
    v-else
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-show="showButton"
      aria-label="Back to top"
      class="fixed bottom-6 right-6 z-50 rounded-full border border-gray-200 bg-white/95 p-3 text-gray-700 shadow-lg backdrop-blur-xs transition-all hover:-translate-y-0.5 hover:bg-white hover:text-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      title="Back to top"
      type="button"
      @click="scrollToTop"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2.5"/>
      </svg>
    </button>
  </Transition>
</template>
