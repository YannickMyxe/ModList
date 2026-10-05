<script setup lang="ts">
import { FileUpload, type FileUploadFileChangeDetails } from '@ark-ui/vue/file-upload'
import FileUploadItem from './FileUploadItem.vue'

const props = defineProps<{
  accept: string | string[]
  label: string
  dropzoneText: string
}>()

const emit = defineEmits<{
  (e: 'file-change', details: FileUploadFileChangeDetails): void
}>()

const onFileChange = (details: FileUploadFileChangeDetails): void => {
  emit('file-change', details)
}

</script>

<template>
  <FileUpload.Root :maxFiles="1" :accept="props.accept" @file-change="onFileChange">
    <FileUpload.Label class="font-bold">{{ props.label }}</FileUpload.Label>
    <FileUpload.Dropzone class="min-w-max p-3 mt-1 mb-3 border border-gray-300 rounded-lg text-center text-xl">
      <div>{{ props.dropzoneText }}</div>
      <div>or click to browse</div>
    </FileUpload.Dropzone>

    <FileUpload.ItemGroup>
      <FileUpload.Context v-slot="{ acceptedFiles }">
        <FileUploadItem
          v-for="file in acceptedFiles"
          :key="file.name"
          :file="file"
          type="accepted"
        />
      </FileUpload.Context>
    </FileUpload.ItemGroup>

    <FileUpload.ItemGroup type="rejected">
      <FileUpload.Context v-slot="{ rejectedFiles }">
        <FileUploadItem
          v-for="rejection in rejectedFiles"
          :key="`${rejection.file.name}-${rejection.errors.join('-')}`"
          :file="rejection.file"
          :errors="rejection.errors"
          type="rejected"
        />
      </FileUpload.Context>
    </FileUpload.ItemGroup>

    <FileUpload.HiddenInput />
  </FileUpload.Root>
</template>
