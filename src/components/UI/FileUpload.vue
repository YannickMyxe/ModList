<script setup lang="ts">
import { FileUpload } from '@ark-ui/vue/file-upload'

const onFileAccepted = (file: File): void => {
  console.log(file)
}

</script>

<template>
  <FileUpload.Root :maxFiles="1" :fileChanged="onFileAccepted" >
    <FileUpload.Label class="font-bold">Upload modlist file</FileUpload.Label>
    <FileUpload.Dropzone class="min-w-max p-3 mt-1 mb-3 border border-gray-300 rounded-lg text-center text-xl">
      <div>Drag and drop files here</div>
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
    <FileUpload.HiddenInput />
  </FileUpload.Root>
</template>

<style scoped>

</style>
