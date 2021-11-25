<template>
    <div class="fixed-top-padding"></div>

    <div class="fixed-top bg-light">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <SelectResource
                        @set-resource="setResource"
                    />
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div v-if="entry">{{ entry.fileId }} - {{ entry.fileName?.baseName }}</div>
                    <div v-else>&nbsp;</div>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid">
        <template v-if="dmsgEditor">
            <DmsgEditor
                :entry="entry!"
            />
        </template>

        <template v-if="eventMessageEditor">
            <EventMessageEditor
                :entry="entry!"
            />
        </template>
    </div>
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
    None = "NONE",
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
            appState: AppState.None,
            entry: null,
        } as Data;
    },

    computed: {
        none() : boolean {
            return this.appState === AppState.None;
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
    }
});
</script>

<style scoped lang="sass">
.fixed-top-padding
    padding-top: 5rem
</style>
