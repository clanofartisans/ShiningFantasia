<template>
    <h1>Shining Fantasia</h1>
    <template v-if="selectInstallLocation">
        <SelectInstallLocation @set-base-path="setBasePath" />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    SelectInstallLocation,
} from './components';

enum AppState {
    SelectInstallLocation = 'SELECT_INSTALL_LOCATION',
};

interface Data {
    appState: AppState,

    basePath: string | null,
};

export default defineComponent({
    components: {
        SelectInstallLocation,
    },

    mounted() {
    },

    data() {
        return {
            appState: AppState.SelectInstallLocation,

            basePath: null,
        } as Data;
    },

    computed: {
        selectInstallLocation() : boolean {
            return this.appState === AppState.SelectInstallLocation;
        },
    },

    methods: {
        setBasePath(basePath: string) {
            this.basePath = basePath;
        },
    }
});
</script>

<style scoped lang="sass">
</style>
