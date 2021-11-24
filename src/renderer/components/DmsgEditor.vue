<template>
    <button @click.prevent="goBack">Go Back</button>
    <div>{{ fileId }} - {{ baseFileName }}</div>
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

import { getFileName, loadDmsg } from '../../common/datloader';

export default defineComponent({
    created() {
        getFileName(this.fileId)
            .then(fileName => {
                if (fileName) {
                    this.baseFileName = fileName.baseFileName;
                    this.fileName = fileName.fileName;
                }
                return loadDmsg(this.fileId);
            })
            .then(st => {
                console.log(`${this.fileId}: Found ${st.entries.length} strings.`);
                this.entries = st.entries;
            })
            .catch(error => {
                console.error(`${this.fileId}: readResource Exception`, error);
            });
    },

    props: {
        fileId: {
            type: Number,
            default: null,
        },
    },

    data() {
        return {
            baseFileName: '' as string,
            fileName: '' as string,

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
});
</script>

<style scoped lang="sass">
</style>
