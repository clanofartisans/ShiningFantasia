<template>
    <template v-if="item">
        <pre><code>{{ item.debug }}</code></pre>
    </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Item } from '@common/resources';

export default defineComponent({
    created() {
    },

    props: {
        item: {
            type: Object as PropType<Item>,
        },
    },

    emits: {
    },

    methods: {
    },
});
</script>

<style scoped lang="sass">
</style>
