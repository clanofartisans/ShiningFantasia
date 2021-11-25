<template>
    <label for="resource-select" class="form-label">Select Resource</label>
    <select id="resource-select" class="form-control" required v-model="entry">
        <option v-for="resource in resourceList" v-bind:value="resource">{{ resource.fileId }} - {{ resource.description }}</option>
    </select>
    <button class="btn btn-primary" @click.prevent="setResource">Load</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ResourceEntry, database } from '@common/database';

export default defineComponent({
    created() {
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
