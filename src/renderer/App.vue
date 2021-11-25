<template>
    <template v-if="selectInstallLocation">
        <SelectInstallLocation
            @set-base-path="setBasePath"
        />
    </template>

    <template v-if="editResource">
        <EditResource
            :basePath="basePath"
        />
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    EditResource,
    SelectInstallLocation,
} from '@views';

enum AppState {
    EditResource = 'EDIT_RESOURCE',
    SelectInstallLocation = 'SELECT_INSTALL_LOCATION',
};

interface Data {
    appState: AppState,

    basePath: string | undefined,
};

export default defineComponent({
    components: {
        EditResource,
        SelectInstallLocation,
    },

    mounted() {
    },

    data() {
        return {
            appState: AppState.SelectInstallLocation,

            basePath: undefined,
        } as Data;
    },

    computed: {
        selectInstallLocation() : boolean {
            return this.appState === AppState.SelectInstallLocation;
        },

        editResource() : boolean {
            return this.appState === AppState.EditResource;
        },
    },

    methods: {
        setBasePath(basePath: string) {
            this.basePath = basePath;

            this.appState = AppState.EditResource;
        },
    }
});
</script>

<style scoped lang="sass">
</style>
