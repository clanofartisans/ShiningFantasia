<template>
    <table class="table">
        <thead>
            <tr>
                <th scope="col" style="width: 50px">Id</th>
                <th scope="col">Entry</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(entry, id) in dmsg.entries">
                <td>{{ id }}</td>
                <template v-if="entry.length === 0"><td></td></template>
                <template v-if="entry.length === 1"><td>{{ entry[0] }}</td></template>
                <template v-if="entry.length > 1">
                    <td class="p-0">
                        <table class="table table-hover m-0">
                            <tbody>
                                <tr v-for="(elem, index) in entry">
                                    <td style="width: 50px">{{ index }}</td>
                                    <td>{{ elem }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </template>
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
.table .table > tbody > tr:last-child > td
    border: none
</style>
