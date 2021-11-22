<template>
    <button @click.prevent="goBack">Go Back</button>
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
import { defineComponent } from 'vue';

import { loadStringTable } from '../../common/datloader';

export default defineComponent({
    created() {
        loadStringTable(this.fileId)
            .then(st => {
                console.log(`${this.fileId}: Found ${st.entries.length} strings.`);
                this.entries = st.entries;
            })
            .catch(error => {
                console.error(`${this.fileId}: readResource Exception`, error);
            });
    },

    data() {
        return {
            entries: [] as string[],
        }
    },

    emits: {
        goBack: null,
    },

    methods: {
        goBack() {
            this.$emit('goBack');
        },
    },

    props: {
        fileId: {
            type: Number,
            default: null,
        },
    },
});
</script>

<style scoped lang="sass">
</style>
