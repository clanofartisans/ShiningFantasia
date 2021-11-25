<template>
    <template v-if="selectResource">
        <SelectResource
            @set-resource="setResource"
        />
    </template>

    <template v-if="dmsgEditor">
        <DmsgEditor
            @go-back="goBack"
            :entry="entry!"
        />
    </template>

    <template v-if="eventMessageEditor">
        <EventMessageEditor
            @go-back="goBack"
            :entry="entry!"
        />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ResourceEntry, ResourceType } from '@common/database';

import {
    DmsgEditor,
    EventMessageEditor,
    SelectResource,
} from '@components';

enum AppState {
    DmsgEditor = 'DMSG_EDITOR',
    EventMessageEditor = 'EVENT_MESSAGE_EDITOR',
    SelectResource = 'SELECT_RESOURCE',
};

interface Data {
    appState: AppState,

    entry: ResourceEntry | null,
};

export default defineComponent({
    components: {
        DmsgEditor,
        EventMessageEditor,
        SelectResource,
    },

    mounted() {
    },

    props: {
        basePath: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            appState: AppState.SelectResource,
            entry: null,
        } as Data;
    },

    computed: {
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
