<template>
    <table>
        <thead>
            <tr>
                <th>Text</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(text, id) in dmsg.entries">
                <td>{{ id }} - {{ text }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, Dmsg } from '@common/resources';

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
        dmsg() {
            return this.resource as Dmsg;
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
