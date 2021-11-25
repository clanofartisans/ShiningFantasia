<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Text</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(text, id) in eventMessage.entries">
                <td>{{ id }}</td>
                <td>{{ text }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, EventMessage } from '@common/resources';

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
        eventMessage() {
            return this.resource as EventMessage;
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
