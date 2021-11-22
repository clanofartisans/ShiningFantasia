<template>
    <label for="base-path-input">Xi Base Path</label>
    <input id="base-path-input" required v-model="basePath">
    <button @click.prevent="selectBasePath">...</button>
    <button @click.prevent="setBasePath">Load</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            basePath: '',
        }
    },

    emits: {
        setBasePath: null,
    },

    methods: {
        selectBasePath() {
            window.ipcApi.selectBasePath(this.basePath)
                .then(basePath => {
                    this.basePath = basePath;
                });
        },

        setBasePath() {
            window.ipcApi.setBasePath(this.basePath)
                .then(result => {
                    this.$emit('setBasePath', this.basePath);
                })
                .catch(error => {
                    console.error('setBasePath Exception', error);
                });
        },
    },
});
</script>

<style scoped lang="sass">
</style>
