<script lang="ts" setup>
import {computed} from "vue";
import {
  RatingGroupControl,
  RatingGroupContext,
  RatingGroupHiddenInput,
  RatingGroupItem,
  RatingGroupItemContext,
  RatingGroupRoot,
} from "@ark-ui/vue/rating-group";

const props = defineProps<{
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const rating = computed(() => props.modelValue ?? 0);

const updateRating = (value: number): void => {
  emit("update:modelValue", value);
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = parseFloat(target.value);
  if (isNaN(val) || val < 0) {
    updateRating(0);
  } else if (val > 5) {
    updateRating(5);
  } else {
    updateRating(val);
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Visual Stars -->
    <RatingGroupRoot
      :model-value="rating"
      :allow-half="true"
      :count="5"
      @update:model-value="updateRating"
    >
      <RatingGroupControl class="flex items-center gap-0.5">
        <RatingGroupContext v-slot="{ items: starIndices }">
          <RatingGroupItem
            v-for="star in starIndices"
            :key="star"
            :index="star"
            class="cursor-pointer focus:outline-none p-0.5 rounded hover:scale-110 transition-transform"
          >
            <RatingGroupItemContext v-slot="{ highlighted, half }">
              <div class="relative w-4 h-4">
                <svg class="w-4 h-4 fill-none stroke-gray-300" stroke-linecap="round"
                     stroke-linejoin="round" stroke-width="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>

                <div v-if="highlighted" :class="half ? 'w-1/2' : 'w-full'"
                     class="absolute inset-0 overflow-hidden pointer-events-none">
                  <svg class="w-4 h-4 fill-amber-400 stroke-amber-400" stroke-linecap="round"
                       stroke-linejoin="round" stroke-width="2"
                       viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
              </div>
            </RatingGroupItemContext>
          </RatingGroupItem>
        </RatingGroupContext>
      </RatingGroupControl>
      <RatingGroupHiddenInput/>
    </RatingGroupRoot>

    <!-- Compact Number Input for direct typing -->
    <input
      :value="rating"
      class="w-14 px-1.5 py-0.5 text-xs text-center font-semibold rounded-md border border-gray-200 bg-white text-gray-800 shadow-2xs focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
      max="5"
      min="0"
      step="0.5"
      title="Type a rating (0 - 5)"
      type="number"
      @input="handleInput"
    />

    <!-- Reset / Undo Button -->
    <button
      v-if="rating > 0"
      aria-label="Reset rating to 0"
      class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors text-xs font-bold cursor-pointer"
      title="Reset rating to 0"
      type="button"
      @click="updateRating(0)"
    >
      ✕
    </button>
    <div v-else class="w-5"/> <!-- Spacer to prevent row jumping -->
  </div>
</template>
