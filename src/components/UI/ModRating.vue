<script setup lang="ts">
import { RatingGroup } from "@ark-ui/vue/rating-group";

const rating = defineModel<number>({ default: 0 });

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = parseFloat(target.value);
  if (isNaN(val) || val < 0) {
    rating.value = 0;
  } else if (val > 5) {
    rating.value = 5;
  } else {
    rating.value = val;
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Visual Stars -->
    <RatingGroup.Root v-model="rating" :count="5" :allow-half="true" :default-value="0">
      <RatingGroup.Control class="flex items-center gap-0.5">
        <RatingGroup.Context v-slot="{ items: starIndices }">
          <RatingGroup.Item
            v-for="star in starIndices"
            :key="star"
            :index="star"
            class="cursor-pointer focus:outline-none p-0.5 rounded hover:scale-110 transition-transform"
          >
            <RatingGroup.ItemContext v-slot="{ highlighted, half }">
              <div class="relative w-4 h-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-gray-300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>

                <div v-if="highlighted" class="absolute inset-0 overflow-hidden pointer-events-none" :class="half ? 'w-1/2' : 'w-full'">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-amber-400 stroke-amber-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
            </RatingGroup.ItemContext>
          </RatingGroup.Item>
        </RatingGroup.Context>
      </RatingGroup.Control>
      <RatingGroup.HiddenInput />
    </RatingGroup.Root>

    <!-- Compact Number Input for direct typing -->
    <input
      type="number"
      min="0"
      max="5"
      step="0.5"
      :value="rating"
      @input="handleInput"
      class="w-14 px-1.5 py-0.5 text-xs text-center font-semibold rounded-md border border-gray-200 bg-white text-gray-800 shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
      title="Type a rating (0 - 5)"
    />

    <!-- Reset / Undo Button -->
    <button
      v-if="rating > 0"
      type="button"
      @click="rating = 0"
      title="Reset rating to 0"
      aria-label="Reset rating to 0"
      class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors text-xs font-bold cursor-pointer"
    >
      ✕
    </button>
    <div v-else class="w-5" /> <!-- Spacer to prevent row jumping -->
  </div>
</template>
