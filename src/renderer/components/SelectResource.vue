<template>
    <label for="resource-select">Select Resource</label>
    <select id="resource-select" required v-model="fileId">
        <option v-for="resource in resourceList" v-bind:value="resource.fileId">{{ resource.fileId }} - {{ resource.description }}</option>
    </select>
    <button @click.prevent="setFileId">Load</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ResourceEntry, ResourceType, database } from '../../common/database';

export default defineComponent({
    created() {

        this.fileId = this.defaultFileId;
        this.resourceList = database;
    },

    data() {
        return {
            resourceList: [] as ResourceEntry[],
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
