<template>
    <table>
        <thead>
            <tr>
                <th>Text</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(text, id) in entries">
                <td>{{ id }} - {{ text }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ResourceEntry } from '@common/database';
import { loadResource } from '@common/datloader';
import { Dmsg } from '@common/resources';

export default defineComponent({
    created() {
        loadResource(this.entry)
            .then(r_ => {
                const r = r_ as Dmsg;
                console.log(`${this.entry.fileId}: Found ${r.entries.length} strings.`);
                this.entries = r.entries;
            })
            .catch(error => {
                console.error(`${this.entry.fileId}: readResource Exception`, error);
            });
    },

    props: {
        entry: {
            type: Object as PropType<ResourceEntry>,
            default: null,
        },
    },

    data() {
        return {
            entries: [] as string[],
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
