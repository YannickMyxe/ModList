<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/UI/FileUpload.vue'
import type { ModList } from '@/types/ModList'
import type { ModListItem } from '@/types/ModListItem'
import type { FileUploadFileChangeDetails } from '@ark-ui/vue/file-upload'

const props = defineProps<{
  label?: string;
  dropzoneText?: string;
  maxFiles?: number | null;
}>();

const emit = defineEmits<{
  (e: 'modListUploaded', lists: ModList[]): void
}>()

const errorMessage = ref<string | null>(null)

const isModListItem = (value: unknown): value is ModListItem => {
  if (typeof value !== 'object' || value === null) return false

  const item = value as Record<string, unknown>
  return (
    typeof item.name === 'string' &&
    typeof item.url === 'string' &&
    typeof item.version === 'string' &&
    (item.rating === undefined || (typeof item.rating === 'number' && Number.isFinite(item.rating)))
  )
}

const getModListItems = (value: unknown): unknown[] | null => {
  if (Array.isArray(value)) return value
  if (typeof value !== 'object' || value === null || !('items' in value)) return null

  const items = (value as { items: unknown }).items
  return Array.isArray(items) ? items : null
}

const onChange = async (details: FileUploadFileChangeDetails): Promise<void> => {
  errorMessage.value = null

  if (details.rejectedFiles.length > 0) {
    errorMessage.value = 'The selected file could not be accepted. Choose JSON files.'
    return
  }

  try {
    const lists = await Promise.all(
      details.acceptedFiles.map(async (file): Promise<ModList> => {
        const data: unknown = JSON.parse(await file.text())
        const items = getModListItems(data)

        if (!items || !items.every(isModListItem)) {
          throw new Error('The JSON file does not contain a valid modlist.')
        }

        const validItems: ModListItem[] = [];
        for (const item of items) {
          if (!isModListItem(item)) {
            throw new Error('The JSON file does not contain a valid modlist.');
          }
          validItems.push(item);
        }

        return { items: validItems }
      }),
    )

    emit('modListUploaded', lists)
  } catch (error) {
    errorMessage.value = error instanceof SyntaxError
      ? 'A selected file is not valid JSON.'
      : error instanceof Error
        ? error.message
        : 'A selected file could not be read.'
  }
}
</script>

<template>
  <div>
    <FileUpload
      accept="application/json,.json"
      :max-files="props.maxFiles"
      :label="props.label?? 'Upload modlist file'"
      :dropzone-text="props.dropzoneText?? 'Drag and drop a JSON file here'"
      @file-change="onChange"
    />
    <p v-if="errorMessage" role="alert" class="mt-2 text-sm text-red-700">
      {{ errorMessage }}
    </p>
  </div>
</template>
