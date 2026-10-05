<script setup lang="ts">
import { FileUpload as ArkFileUpload, type FileUploadFileChangeDetails } from '@ark-ui/vue/file-upload'
import FileUploadItem from './FileUploadItem.vue'

const props = defineProps<{
  accept: string | string[];
  label: string;
  dropzoneText: string;
}>()

const emit = defineEmits<{
  (e: 'file-change', details: FileUploadFileChangeDetails): void
}>()

const onFileChange = (details: FileUploadFileChangeDetails): void => {
  emit('file-change', details)
}

</script>

<template>
  <ArkFileUpload.Root :maxFiles="1" :accept="props.accept" @file-change="onFileChange">
    <ArkFileUpload.Label class="font-bold">{{ props.label }}</ArkFileUpload.Label>
    <ArkFileUpload.Dropzone class="min-w-max p-3 mt-1 mb-3 border border-gray-300 rounded-lg text-center text-xl">
      <div>{{ props.dropzoneText }}</div>
      <div>or click to browse</div>
    </ArkFileUpload.Dropzone>

    <ArkFileUpload.ItemGroup>
      <ArkFileUpload.Context v-slot="{ acceptedFiles }">
        <FileUploadItem
          v-for="file in acceptedFiles"
          :key="file.name"
          :file="file"
          type="accepted"
        />
      </ArkFileUpload.Context>
    </ArkFileUpload.ItemGroup>

    <ArkFileUpload.ItemGroup type="rejected">
      <ArkFileUpload.Context v-slot="{ rejectedFiles }">
        <FileUploadItem
          v-for="rejection in rejectedFiles"
          :key="`${rejection.file.name}-${rejection.errors.join('-')}`"
          :file="rejection.file"
          :errors="rejection.errors"
          type="rejected"
        />
      </ArkFileUpload.Context>
    </ArkFileUpload.ItemGroup>

    <ArkFileUpload.HiddenInput />
  </ArkFileUpload.Root>
</template>
