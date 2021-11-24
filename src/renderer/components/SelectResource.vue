<template>
    <label for="resource-select">Select Resource</label>
    <select id="resource-select" required v-model="entry">
        <option v-for="resource in resourceList" v-bind:value="resource">{{ resource.fileId }} - {{ resource.description }}</option>
    </select>
    <button @click.prevent="setResource">Load</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ResourceEntry, ResourceType, database } from '../../common/database';

export default defineComponent({
    created() {

        // this.fileId = this.defaultFileId;
        this.entry = null;
        this.resourceList = database;
    },

    data() {
        return {
            resourceList: [] as ResourceEntry[],
            entry: null as ResourceEntry | null,
        }
    },

    emits: {
        setResource: null,
    },

    methods: {
        setResource() {
            this.$emit('setResource', this.entry);
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
