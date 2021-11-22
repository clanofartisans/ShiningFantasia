<template>
    <h1>Shining Fantasia</h1>
    <template v-if="selectInstallLocation">
        <SelectInstallLocation @set-base-path="setBasePath" />
    </template>

    <template v-if="selectResource">
        <SelectResource @set-file-id="setFileId" />
    </template>

    <template v-if="stringTable">
        <StringTable @go-back="goBack" :fileId="fileId" />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    SelectInstallLocation,
    SelectResource,
    StringTable,
} from './components';

enum AppState {
    SelectInstallLocation = 'SELECT_INSTALL_LOCATION',
    SelectResource = 'SELECT_RESOURCE',
    StringTable = 'STRING_TABLE',
};

interface Data {
    appState: AppState,

    basePath: string | null,
    fileId: number | undefined,
};

export default defineComponent({
    components: {
        SelectInstallLocation,
        SelectResource,
        StringTable,
    },

    mounted() {
    },

    data() {
        return {
            appState: AppState.SelectInstallLocation,

            basePath: null,
            fileId: undefined,
        } as Data;
    },

    computed: {
        selectInstallLocation() : boolean {
            return this.appState === AppState.SelectInstallLocation;
        },

        selectResource() : boolean {
            return this.appState === AppState.SelectResource;
        },

        stringTable() : boolean {
            return this.appState === AppState.StringTable;
        },
    },

    methods: {
        setBasePath(basePath: string) {
            this.basePath = basePath;

            this.appState = AppState.SelectResource;
        },

        setFileId(fileId: number) {
            this.fileId = fileId;

            this.appState = AppState.StringTable;
        },

        goBack() {
            // until there's an actual app stack
            switch (this.appState) {
                case AppState.SelectResource:
                    this.appState = AppState.SelectInstallLocation;
                    break;

                case AppState.StringTable:
                    this.appState = AppState.SelectResource;
                    break;
            }
        }
    }
});
</script>

<style scoped lang="sass">
</style>
