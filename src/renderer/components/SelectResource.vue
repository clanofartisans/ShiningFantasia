<template>
    <label for="resource-select">Select Resource</label>
    <select id="resource-select" required v-model="fileId">
        <option v-for="resource in resourceList" v-bind:value="resource.fileId">{{ resource.fileId }} - {{ resource.description }}</option>
    </select>
    <button @click.prevent="setFileId">Load</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    created() {

        this.resourceList = [
            // Common resources
            { fileId: 0xd8b2, description: 'Chocobo names?' },

            // English resources
            { fileId: 0x9A76, description: '<Unknown>' },
            { fileId: 0x9A75, description: '<Unknown>' },
            { fileId: 0xD8AD, description: '<Unknown>' },
            { fileId: 0xD8AE, description: '<Unknown>' },
            { fileId: 0xD8AB, description: '<Unknown>' },
            { fileId: 0x3F, description: '<Unknown>' },
            { fileId: 0xD95D, description: '<Unknown>' },
            { fileId: 0xD95E, description: '<Unknown>' },
            { fileId: 0x30, description: '<Unknown>' },
            { fileId: 0xD960, description: '<Unknown>' },
            { fileId: 0x32, description: '<Unknown>' },
            { fileId: 0xD962, description: '<Unknown>' },
            { fileId: 0xD963, description: '<Unknown>' },
            { fileId: 0xD964, description: '<Unknown>' },
            { fileId: 0xD965, description: '<Unknown>' },
            { fileId: 0xD966, description: '<Unknown>' },
            { fileId: 0xD8A9, description: '<Unknown>' },
            { fileId: 0xD96D, description: '<Unknown>' },
            { fileId: 0xD980, description: '<Unknown>' },
            { fileId: 0xD8AB, description: '<Unknown>' },
            { fileId: 0xD969, description: '<Unknown>' },
            { fileId: 0xD96A, description: '<Unknown>' },
            { fileId: 0xD96B, description: '<Unknown>' },
            { fileId: 0xD96C, description: '<Unknown>' },
            { fileId: 0xD971, description: '<Unknown>' },
            { fileId: 0xD972, description: '<Unknown>' },
            { fileId: 0xD985, description: '<Unknown>' },
            { fileId: 0xD98C, description: '<Unknown>' },
            { fileId: 0xD988, description: '<Unknown>' },
            { fileId: 0xD986, description: '<Unknown>' },
            { fileId: 0xD98E, description: '<Unknown>' },
            { fileId: 0xD97A, description: '<Unknown>' },
            { fileId: 0xD989, description: '<Unknown>' },
            { fileId: 0xD98D, description: '<Unknown>' },
            { fileId: 0xD97C, description: '<Unknown>' },
            { fileId: 0xD987, description: '<Unknown>' },
            { fileId: 0xD98A, description: '<Unknown>' },
            { fileId: 0xD98B, description: '<Unknown>' },
            { fileId: 0x5B, description: '<Unknown>' },
            { fileId: 0x49, description: '<Unknown>' },
            { fileId: 0xD977, description: '<Unknown>' },
            { fileId: 0x4A, description: '<Unknown>' },
            { fileId: 0x4B, description: '<Unknown>' },
            { fileId: 0xD973, description: '<Unknown>' },
            { fileId: 0xD976, description: '<Unknown>' },
            { fileId: 0x5F, description: '<Unknown>' },
            { fileId: 0xD978, description: '<Unknown>' },
            { fileId: 0xD979, description: '<Unknown>' },
            { fileId: 0xD97D, description: '<Unknown>' },
            { fileId: 0xD97E, description: '<Unknown>' },
            { fileId: 0xD8D0, description: '<Unknown>' },
            { fileId: 0x4C, description: '<Unknown>' },
            { fileId: 0xD974, description: '<Unknown>' },
            { fileId: 0x4D, description: '<Unknown>' },
            { fileId: 0x55, description: '<Unknown>' },
            { fileId: 0x56, description: '<Unknown>' },
            { fileId: 0x57, description: '<Unknown>' },
            { fileId: 0x9A85, description: '<Unknown>' },
            { fileId: 0xD975, description: '<Unknown>' },
            { fileId: 0xD97F, description: '<Unknown>' },
            { fileId: 0xD998, description: '<Unknown>' },
            { fileId: 0xD999, description: '<Unknown>' },
            { fileId: 0xD99A, description: '<Unknown>' },
            { fileId: 0xD99B, description: '<Unknown>' },
            { fileId: 0xD99C, description: '<Unknown>' },
            { fileId: 0xD99D, description: '<Unknown>' },
            { fileId: 0xD99E, description: '<Unknown>' },
            { fileId: 0xD99F, description: '<Unknown>' },
            { fileId: 0xD9A0, description: '<Unknown>' },
            { fileId: 0xD9AA, description: '<Unknown>' },
            { fileId: 0xD9A1, description: '<Unknown>' },
            { fileId: 0xD9A3, description: '<Unknown>' },
            { fileId: 0xD9A4, description: '<Unknown>' },
            { fileId: 0xD9A5, description: '<Unknown>' },
            { fileId: 0xD9A6, description: '<Unknown>' },
            { fileId: 0xD9A7, description: '<Unknown>' },
            { fileId: 0xD9A8, description: '<Unknown>' },
            { fileId: 0xD9A9, description: '<Unknown>' },
            { fileId: 0xD9AC, description: '<Unknown>' },
            { fileId: 0xD9AB, description: '<Unknown>' },
            { fileId: 0xD9B7, description: '<Unknown>' },
            { fileId: 0xD9B8, description: '<Unknown>' },
            { fileId: 0xD9B9, description: '<Unknown>' },
            { fileId: 0xD9BA, description: '<Unknown>' },
            { fileId: 0xD9BD, description: '<Unknown>' },
            { fileId: 0xD9BE, description: '<Unknown>' },
            { fileId: 0xD9BB, description: '<Unknown>' },
            { fileId: 0xD9BC, description: '<Unknown>' },
            { fileId: 0x52, description: '<Unknown>' },
            { fileId: 0x51, description: '<Unknown>' },
            { fileId: 0xD9B4, description: '<Unknown>' },
            { fileId: 0xD996, description: '<Unknown>' },
            { fileId: 0xD9B6, description: '<Unknown>' },
            { fileId: 0xD995, description: '<Unknown>' },
            { fileId: 0xD9B5, description: '<Unknown>' },
            { fileId: 0xD981, description: '<Unknown>' },
            { fileId: 0xD982, description: '<Unknown>' },
            { fileId: 0x1B6D, description: '<Unknown>' },
            { fileId: 0x1B6F, description: '<Unknown>' },
            { fileId: 0x1B71, description: '<Unknown>' },
            { fileId: 0x1B73, description: '<Unknown>' },
            { fileId: 0x1B75, description: '<Unknown>' },
            { fileId: 0x1B77, description: '<Unknown>' },
            { fileId: 0x1B7B, description: '<Unknown>' },
            { fileId: 0x1B7F, description: '<Unknown>' },
            { fileId: 0x1914, description: '<Unknown>' },
            { fileId: 0xE259, description: '<Unknown>' },
            { fileId: 0x10B9F, description: '<Unknown>' },
            { fileId: 0x14E57, description: '<Unknown>' },
        ];

        this.fileId = this.defaultFileId;
    },

    data() {
        return {
            resourceList: [] as {fileId: number, description: string}[],
            fileId: null as number | null,
        }
    },

    emits: {
        setFileId: null,
    },

    methods: {
        setFileId() {
            this.$emit('setFileId', this.fileId);
        },
    },

    props: {
        defaultFileId: {
            type: Number,
            default: null,
        },
    },
});
</script>

<style scoped lang="sass">
</style>
