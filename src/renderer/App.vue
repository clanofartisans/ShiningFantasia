<template>
    <h1>Shining Fantasia</h1>
    <template v-if="selectInstallLocation">
        <SelectInstallLocation @set-base-path="setBasePath" />
    </template>

    <template v-if="selectResource">
        <SelectResource
            @set-file-id="setFileId"
            :defaultFileId="fileId"
        />
    </template>

    <template v-if="dmsgEditor">
        <DmsgEditor @go-back="goBack" :fileId="fileId" />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    DmsgEditor,
    SelectInstallLocation,
    SelectResource,
} from './components';

enum AppState {
    DmsgEditor = 'DMSG_EDITOR',
    SelectInstallLocation = 'SELECT_INSTALL_LOCATION',
    SelectResource = 'SELECT_RESOURCE',
};

interface Data {
    appState: AppState,

    basePath: string | null,
    fileId: number | undefined,
};

export default defineComponent({
    components: {
        DmsgEditor,
        SelectInstallLocation,
        SelectResource,
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

        dmsgEditor() : boolean {
            return this.appState === AppState.DmsgEditor;
        },
    },

    methods: {
        setBasePath(basePath: string) {
            this.basePath = basePath;

            this.appState = AppState.SelectResource;
        },

        setFileId(fileId: number) {
            this.fileId = fileId;

            this.appState = AppState.DmsgEditor;
        },

        goBack() {
            // until there's an actual app stack
            switch (this.appState) {
                case AppState.SelectResource:
                    this.appState = AppState.SelectInstallLocation;
                    break;

                case AppState.DmsgEditor:
                    this.appState = AppState.SelectResource;
                    break;
            }
        }
    }
});
</script>

<style scoped lang="sass">
</style>
