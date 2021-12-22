<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col" style="width: 100px">Id</th>
                <th scope="col">Type</th>
                <th scope="col">Name</th>
                <th scope="col">Length</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="({ type, name, length }, id) in resourceList.resources">
                <td>{{ id }}</td>
                <td>{{ getTypeName(type) }}</td>
                <td>{{ name }}</td>
                <td>{{ length }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, ChunkedResource } from '@common/resources';

export default defineComponent({
    created() {
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
