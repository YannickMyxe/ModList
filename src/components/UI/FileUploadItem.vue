<script lang="ts" setup>
import {
  FileUploadItem as ArkFileUploadItem,
  FileUploadItemDeleteTrigger,
  FileUploadItemName,
  FileUploadItemSizeText,
} from '@ark-ui/vue/file-upload'

const props = withDefaults(
  defineProps<{
    file: File
    type?: 'accepted' | 'rejected'
    errors?: string[]
  }>(),
  {
    type: 'accepted',
    errors: () => [],
  }
)

const formatError = (code: string) => {
  switch (code) {
    case 'FILE_INVALID_TYPE':
      return 'Invalid file type'
    case 'FILE_TOO_LARGE':
      return 'File is too large'
    case 'TOO_MANY_FILES':
      return 'Too many files'
    case 'FILE_EXISTS':
      return 'This file is already uploaded'
    default:
      return code
  }
}
</script>

<template>
  <ArkFileUploadItem
    :class="props.type === 'rejected' ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-200 bg-gray-50'"
    :file="props.file"
    :type="props.type"
    class="flex flex-row items-center justify-between gap-3 p-2.5 my-1.5 border rounded-lg transition-colors"
  >
    <div class="flex flex-col flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <FileUploadItemName class="font-medium truncate text-sm"/>
        <FileUploadItemSizeText class="text-xs opacity-60"/>
      </div>

      <!-- Error messages -->
      <div v-if="props.errors.length > 0" class="text-xs text-red-600 mt-0.5">
        <span v-for="err in props.errors" :key="err">{{ formatError(err) }}</span>
      </div>
    </div>

    <!-- Delete / dismiss trigger -->
    <FileUploadItemDeleteTrigger
      :class="props.type === 'rejected' ? 'border-red-300 text-red-700 hover:bg-red-100' : ''"
      class="px-2 py-0.5 text-xs font-semibold rounded border border-gray-300 hover:bg-white transition-colors"
    >
      ✕
    </FileUploadItemDeleteTrigger>
  </ArkFileUploadItem>
</template>
