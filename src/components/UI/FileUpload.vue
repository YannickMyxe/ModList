<script lang="ts" setup>
import {computed} from 'vue'
import {
  FileUploadContext,
  FileUploadDropzone,
  type FileUploadFileChangeDetails,
  FileUploadHiddenInput,
  FileUploadItemGroup,
  FileUploadLabel,
  FileUploadRoot,
} from '@ark-ui/vue/file-upload'
import FileUploadItem from './FileUploadItem.vue'

const props = defineProps<{
  accept: string | string[];
  label: string;
  dropzoneText: string;
  maxFiles?: number | null;
}>()

const dropzoneText = computed(() => props.dropzoneText)
const maxFiles = computed<number>(() => props.maxFiles ?? Number.POSITIVE_INFINITY)

const emit = defineEmits<{
  (e: 'file-change', details: FileUploadFileChangeDetails): void
}>()

const onFileChange = (details: FileUploadFileChangeDetails): void => {
  emit('file-change', details)
}

</script>

<template>
  <FileUploadRoot
    :accept="props.accept"
    :max-files="maxFiles"
    @file-change="onFileChange"
  >
    <FileUploadLabel class="font-bold">{{ props.label }}</FileUploadLabel>
    <FileUploadDropzone
      class="min-w-max p-3 mt-1 mb-3 border border-gray-300 rounded-lg text-center text-xl">
      <div>{{ dropzoneText }}</div>
      <div>or click to browse</div>
    </FileUploadDropzone>

    <FileUploadItemGroup>
      <FileUploadContext v-slot="{ acceptedFiles }">
        <FileUploadItem
          v-for="file in acceptedFiles"
          :key="file.name"
          :file="file"
          type="accepted"
        />
      </FileUploadContext>
    </FileUploadItemGroup>

    <FileUploadItemGroup type="rejected">
      <FileUploadContext v-slot="{ rejectedFiles }">
        <FileUploadItem
          v-for="rejection in rejectedFiles"
          :key="`${rejection.file.name}-${rejection.errors.join('-')}`"
          :errors="rejection.errors"
          :file="rejection.file"
          type="rejected"
        />
      </FileUploadContext>
    </FileUploadItemGroup>

    <FileUploadHiddenInput/>
  </FileUploadRoot>
</template>
