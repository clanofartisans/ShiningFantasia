<template>
    <h1>Shining Fantasia</h1>
    <template v-if="selectInstallLocation">
        <SelectInstallLocation @set-base-path="setBasePath" />
    </template>

    <template v-if="selectResource">
        <SelectResource
            @set-resource="setResource"
        />
    </template>

    <template v-if="dmsgEditor">
        <DmsgEditor @go-back="goBack" :entry="entry" />
    </template>

    <template v-if="eventMessageEditor">
        <EventMessageEditor
            @go-back="goBack"
            :entry="entry"
        />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ResourceEntry, ResourceType } from '../common/database';

import {
    DmsgEditor,
    EventMessageEditor,
    SelectInstallLocation,
    SelectResource,
} from './components';

enum AppState {
    DmsgEditor = 'DMSG_EDITOR',
    EventMessageEditor = 'EVENT_MESSAGE_EDITOR',
    SelectInstallLocation = 'SELECT_INSTALL_LOCATION',
    SelectResource = 'SELECT_RESOURCE',
};

interface Data {
    appState: AppState,

    basePath: string | null,
    entry?: ResourceEntry,
};

export default defineComponent({
    components: {
        DmsgEditor,
        EventMessageEditor,
        SelectInstallLocation,
        SelectResource,
    },

    mounted() {
    },

    data() {
        return {
            appState: AppState.SelectInstallLocation,

            basePath: null,
            entry: undefined,
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

        eventMessageEditor() : boolean {
            return this.appState === AppState.EventMessageEditor;
        },
    },

    methods: {
        setBasePath(basePath: string) {
            this.basePath = basePath;

            this.appState = AppState.SelectResource;
        },

        setResource(entry: ResourceEntry) {
            this.entry = entry;

            switch (this.entry.type) {
                case ResourceType.Dmsg:
                default:
                    this.appState = AppState.DmsgEditor;
                    break;
                case ResourceType.EventMessage:
                    this.appState = AppState.EventMessageEditor;
                    break;
            }
        },

        goBack() {
            // until there's an actual app stack
            switch (this.appState) {
                case AppState.SelectResource:
                    this.appState = AppState.SelectInstallLocation;
                    break;

                case AppState.DmsgEditor:
                case AppState.EventMessageEditor:
                    this.appState = AppState.SelectResource;
                    break;
            }
        }
    }
});
</script>

<style scoped lang="sass">
</style>
