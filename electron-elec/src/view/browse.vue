<template>
    <span>{{ data }}</span>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useIpcRenderer} from "@vueuse/electron";

const ipcRenderer = useIpcRenderer();

const data = ref('')
ipcRenderer.on('customer-msg', ((event, arg) => {
    data.value = JSON.parse(arg);
}))
</script>

<style></style>