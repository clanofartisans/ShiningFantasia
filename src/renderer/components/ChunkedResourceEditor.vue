<template>
    <label for="item-select" class="form-label">Select Item</label>
    <select id="item-select" class="form-control" required v-model="resourceIndex">
        <option v-for="(i, index) in resourceList.resources" v-bind:value="index">{{ index }}: {{ getTypeName(i.type) }} - {{ i.name }} ({{ i.length }})</option>
    </select>

    <pre><code>{{ dump }} </code></pre>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, ChunkedResource } from '@common/resources';

import { dumpBinToStr } from '@common/datloader';

export default defineComponent({
    created() {
    },

    data() {
        return {
            resourceIndex: null as number | null,
        }
    },

    props: {
        resource: {
            type: Object as PropType<Resource>,
            default: null,
        },
    },

    computed: {
        resourceList() {
            return this.resource as ChunkedResource;
        },

        dump() {
            if (this.resourceIndex !== null) {
                if (this.resourceIndex >= 0 && this.resourceIndex <= this.resourceList.resources.length) {
                    return dumpBinToStr(this.resourceList.resources[this.resourceIndex].temp);
                }
            }
            return '';
        }
    },

    emits: {
    },

    methods: {
        getTypeName(type: number) {
            return ChunkedResource.getTypeName(type);
        },
    },
});
</script>

<style scoped lang="sass">
</style>
