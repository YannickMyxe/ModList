<script setup lang="ts">
import { RatingGroup } from "@ark-ui/vue/rating-group";

const rating = defineModel<number>({ default: 0 });
</script>

<template>
  <RatingGroup.Root v-model="rating" :count="5" :allow-half="true" :default-value="0">
    <div class="flex items-center gap-2">
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
                <!-- Background empty star -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-4 h-4 fill-none stroke-gray-300"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>

                <!-- Foreground filled star (full or 50% clipped if half) -->
                <div
                  v-if="highlighted"
                  class="absolute inset-0 overflow-hidden pointer-events-none"
                  :class="half ? 'w-1/2' : 'w-full'"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-4 h-4 fill-amber-400 stroke-amber-400"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
            </RatingGroup.ItemContext>
          </RatingGroup.Item>
        </RatingGroup.Context>
      </RatingGroup.Control>

      <RatingGroup.Context v-slot="{ value }">
        <span
          class="text-xs font-semibold w-6"
          :class="value > 0 ? 'text-amber-600' : 'text-gray-400'"
        >
          {{ Math.max(0, value) }}
        </span>
      </RatingGroup.Context>
    </div>
    <RatingGroup.HiddenInput />
  </RatingGroup.Root>
</template>
