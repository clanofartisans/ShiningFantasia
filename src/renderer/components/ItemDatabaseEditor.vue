<template>
    <label for="item-select" class="form-label">Select Item</label>
    <select id="item-select" class="form-control" required v-model="item">
        <option v-for="i in itemDatabase.entries" v-bind:value="i">Item {{ i.id }} - {{ i.itemName }} </option>
    </select>

    <template v-if="item">
        <ItemEditor
            :item="item"
        />
    </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Resource, ItemDatabase, Item } from '@common/resources';

import { ItemEditor } from '@components';

export default defineComponent({
    components: {
        ItemEditor,
    },

    created() {
    },

    data() {
        return {
            item: null as Item | null,
        }
    },

    props: {
        resource: {
            type: Object as PropType<Resource>,
            default: null,
        },
    },

    computed: {
        itemDatabase() {
            return this.resource as ItemDatabase;
        },
    },

    emits: {
    },
});
</script>

<style scoped lang="sass">
</style>
