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
                :resource="resource!"
            />
        </template>

        <template v-if="entityListEditor">
            <EntityListEditor
                :resource="resource!"
            />
        </template>

        <template v-if="eventMessageEditor">
            <EventMessageEditor
                :resource="resource!"
            />
        </template>

        <template v-if="itemDatabaseEditor">
            <ItemDatabaseEditor
                :resource="resource!"
            />
        </template>

        <template v-if="xiStringEditor">
            <XiStringEditor
                :resource="resource!"
            />
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { loadResource } from '@common/datloader';
import { ResourceEntry, ResourceType } from '@common/database';
import { Resource } from '@common/resources';

import {
    DmsgEditor,
    EntityListEditor,
    EventMessageEditor,
    ItemDatabaseEditor,
    SelectResource,
    XiStringEditor,
} from '@components';

enum AppState {
    DmsgEditor = 'DMSG_EDITOR',
    EntityListEditor = 'ENTITY_LIST_EDITOR',
    EventMessageEditor = 'EVENT_MESSAGE_EDITOR',
    ItemDatabaseEditor = 'ITEM_DATABASE_EDITOR',
    None = "NONE",
    XiStringEditor = 'XI_STRING_EDITOR',
};

interface Data {
    appState: AppState,

    entry: ResourceEntry | null,

    resource: Resource | null,
};

export default defineComponent({
    components: {
        DmsgEditor,
        EntityListEditor,
        EventMessageEditor,
        ItemDatabaseEditor,
        SelectResource,
        XiStringEditor,
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

        entityListEditor() : boolean {
            return this.appState === AppState.EntityListEditor;
        },

        eventMessageEditor() : boolean {
            return this.appState === AppState.EventMessageEditor;
        },

        itemDatabaseEditor() : boolean {
            return this.appState === AppState.ItemDatabaseEditor;
        },

        xiStringEditor() : boolean {
            return this.appState === AppState.XiStringEditor;
        },
    },

    methods: {
        setResource(entry: ResourceEntry) {
            loadResource(entry)
                .then(resource => {
                    this.entry = entry;
                    this.resource = resource;

                    switch (this.entry.type) {
                        case ResourceType.Dmsg:
                        default:
                            this.appState = AppState.DmsgEditor;
                            break;
                        case ResourceType.EntityList:
                            this.appState = AppState.EntityListEditor;
                            break;
                        case ResourceType.EventMessage:
                            this.appState = AppState.EventMessageEditor;
                            break;
                        case ResourceType.Item:
                            this.appState = AppState.ItemDatabaseEditor;
                            break;
                        case ResourceType.XiString:
                            this.appState = AppState.XiStringEditor;
                            break;
                    }
                })
                .catch(error => {
                    console.error(`${entry.fileId}: readResource Exception`, error);
                });
        },
    }
});
</script>

<style scoped lang="sass">
.fixed-top
    max-height: 9rem

.fixed-top-padding
    padding-top: 8rem
</style>
