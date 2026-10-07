<script lang="ts" setup>
import {ref} from 'vue'
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from '@ark-ui/vue/collapsible'

const isMenuOpen = ref(false)

const links = [
  {label: 'Home', to: '/'},
  {label: 'Rate', to: '/rate'},
  {label: 'Compare', to: '/compare'},
  {label: 'Updates', to: '/updates'},
]
</script>

<template>
  <header class="relative mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div class="flex min-h-10 items-center justify-between gap-4">
      <RouterLink class="shrink-0 text-xl font-bold tracking-tight text-slate-900" to="/">
        ModList
      </RouterLink>

      <nav aria-label="Main navigation" class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          active-class="bg-slate-100 text-slate-900"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          exact-active-class="bg-blue-50 text-blue-700"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <CollapsibleRoot v-model:open="isMenuOpen" class="md:hidden">
        <CollapsibleTrigger
          :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          class="flex size-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <svg
            v-if="!isMenuOpen"
            aria-hidden="true"
            class="size-6"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg
            v-else
            aria-hidden="true"
            class="size-6"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="m6 6 12 12M18 6 6 18"/>
          </svg>
        </CollapsibleTrigger>

        <CollapsibleContent
          class="absolute inset-x-0 top-full z-10 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        >
          <nav aria-label="Mobile navigation" class="flex flex-col gap-1">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              active-class="bg-slate-100 text-slate-900"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              exact-active-class="bg-blue-50 text-blue-700"
              @click="isMenuOpen = false"
            >
              {{ link.label }}
            </RouterLink>
          </nav>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
  </header>
</template>
