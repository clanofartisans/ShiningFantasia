<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="({id, name}, index) in entityList.entries">
                <td>{{ index }}</td>
                <td>{{ id }}</td>
                <td>{{ name }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, EntityList } from '@common/resources';

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
        entityList() {
            return this.resource as EntityList;
        }
    },

    emits: {
    },

    methods: {
    },
});
</script>

<style scoped lang="sass">
</style>
