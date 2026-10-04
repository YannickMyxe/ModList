<script setup lang="ts">
import { FileUpload } from '@ark-ui/vue/file-upload'
import type { ModList } from "@/types/ModList.ts";

const emit = defineEmits<{
  (e: 'modListUploaded', modList: ModList): void
}>()

interface FileChangeDetails {
  acceptedFiles: File[]
  rejectedFiles: File[]
}

const onFileChange = async (details: FileChangeDetails): Promise<void> => {
  if (details.rejectedFiles.length > 0) {
    console.warn('Rejected file(s):', details.rejectedFiles)
    return
  }

  const file = details.acceptedFiles[0]
  if (!file) return

  try {
    const text = await file.text()
    const data: ModList = JSON.parse(text) as ModList
    emit('modListUploaded', data)
  } catch (error) {
    console.error('Failed to parse modlist file:', error)
  }
}

</script>

<template>
  <FileUpload.Root :maxFiles="1" accept="application/json, .json" @file-change="onFileChange" >
    <FileUpload.Label class="font-bold">Upload modlist file</FileUpload.Label>
    <FileUpload.Dropzone class="min-w-max p-3 mt-1 mb-3 border border-gray-300 rounded-lg text-center text-xl">
      <div>Drag and drop files here (JSON only)</div>
      <div>or click to browse</div>
    </FileUpload.Dropzone>
    <FileUpload.ItemGroup>
      <FileUpload.Context v-slot="{ acceptedFiles }">
        <FileUpload.Item v-for="file in acceptedFiles" :file="file" :key="file.name" class="flex flex-row gap-3 justify-around content-center">
          <FileUpload.ItemPreview type="image/*">
            <FileUpload.ItemPreviewImage />
          </FileUpload.ItemPreview>
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText />
          <FileUpload.ItemDeleteTrigger class="p-1 border border-b-slate-800 rounded-lg bg-red-200">X</FileUpload.ItemDeleteTrigger>
        </FileUpload.Item>
      </FileUpload.Context>
    </FileUpload.ItemGroup>

    <FileUpload.ItemGroup>
      <FileUpload.Context v-slot="{ rejectedFiles }">
        <FileUpload.Item
          v-for="fileRejection in rejectedFiles"
          :file="fileRejection.file"
          :key="fileRejection.file.name"
        >
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText />
          <div>
            <div v-for="error in fileRejection.errors" :key="error" style="color: red">
              {{ error }}
            </div>
          </div>
        </FileUpload.Item>
      </FileUpload.Context>
    </FileUpload.ItemGroup>
    <FileUpload.HiddenInput />
  </FileUpload.Root>
</template>

<style scoped>

</style>
