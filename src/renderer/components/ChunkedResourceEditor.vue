<template>
    <label for="item-select" class="form-label">Select Item</label>
    <select id="item-select" class="form-control" required v-model="resourceIndex">
        <option v-for="(i, index) in resourceList.resources" v-bind:value="index">{{ index }}: {{ getTypeName(i.type) }} - {{ i.name }} ({{ i.length }})</option>
    </select>

    <img :src="imgSrc">

    <pre><code>{{ dump }} </code></pre>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, ChunkedResource, Bmp2 } from '@common/resources';

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
                    if (!this.resourceList.resources[this.resourceIndex].resource) {
                        return dumpBinToStr(this.resourceList.resources[this.resourceIndex].temp);
                    }
                }
            }
            return '';
        },

        imgSrc() {
            let resource: Resource | null = null;

            if (this.resourceIndex !== null) {
                if (this.resourceIndex >= 0 && this.resourceIndex <= this.resourceList.resources.length) {
                    if (this.resourceList.resources[this.resourceIndex].resource) {
                        resource = this.resourceList.resources[this.resourceIndex].resource;
                    }
                }
            }

            if (resource) {
                const bmp2 = resource as Bmp2;

                const b = bmp2.getRGBABuffer();

                if (b) {
                    const width = bmp2.width;
                    const height = bmp2.height;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        canvas.width = width;
                        canvas.height = height;

                        const imageData = new ImageData(b, width, height);
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }
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
