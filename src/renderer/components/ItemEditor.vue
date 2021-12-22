<template>
    <template v-if="item">
        <img :src="iconSrc">

        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col" style="width: 100px">Field</th>
                    <th scope="col">Value</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="item?.text !== undefined">
                    <tr v-for="(text, id) in item.text">
                        <td>Text {{ id }}</td>
                        <td>{{ text }}</td>
                    </tr>
                </template>

                <template v-if="item?.id !== undefined">
                    <tr>
                        <td>Id</td>
                        <td>{{ item.id }}</td>
                    </tr>
                </template>

                <template v-if="item?.type !== undefined">
                    <tr>
                        <td>Type</td>
                        <td>{{ item.type }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk0 !== undefined">
                    <tr>
                        <td>_unk0</td>
                        <td>{{ _04X(item._unk0) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk2 !== undefined">
                    <tr>
                        <td>_unk2</td>
                        <td>{{ _04X(item._unk2) }}</td>
                    </tr>
                </template>

                <template v-if="item?.stack !== undefined">
                    <tr>
                        <td>stack</td>
                        <td>{{ item.stack }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk4 !== undefined">
                    <tr>
                        <td>_unk4</td>
                        <td>{{ _04X(item._unk4) }}</td>
                    </tr>
                </template>

                <template v-if="item?.level !== undefined">
                    <tr>
                        <td>level</td>
                        <td>{{ item.level }}</td>
                    </tr>
                </template>

                <template v-if="item?.slots !== undefined">
                    <tr>
                        <td>slots</td>
                        <td>{{ _04X(item.slots) }}</td>
                    </tr>
                </template>

                <template v-if="item?.races !== undefined">
                    <tr>
                        <td>races</td>
                        <td>{{ _04X(item.races) }}</td>
                    </tr>
                </template>

                <template v-if="item?.jobs !== undefined">
                    <tr>
                        <td>jobs</td>
                        <td>{{ _08X(item.jobs) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk11 !== undefined">
                    <tr>
                        <td>_unk11</td>
                        <td>{{ _04X(item._unk11) }}</td>
                    </tr>
                </template>

                <template v-if="item?.skill !== undefined">
                    <tr>
                        <td>skill</td>
                        <td>{{ _04X(item.skill) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk15 !== undefined">
                    <tr>
                        <td>_unk15</td>
                        <td>{{ _02X(item._unk15) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk16 !== undefined">
                    <tr>
                        <td>_unk16</td>
                        <td>{{ _04X(item._unk16) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk17 !== undefined">
                    <tr>
                        <td>_unk17</td>
                        <td>{{ _04X(item._unk17) }}</td>
                    </tr>
                </template>

                <template v-if="item?.dmg !== undefined">
                    <tr>
                        <td>dmg</td>
                        <td>{{ item.dmg }}</td>
                    </tr>
                </template>

                <template v-if="item?.delay !== undefined">
                    <tr>
                        <td>delay</td>
                        <td>{{ item.delay }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk20 !== undefined">
                    <tr>
                        <td>_unk20</td>
                        <td>{{ _04X(item._unk20) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk21 !== undefined">
                    <tr>
                        <td>_unk21</td>
                        <td>{{ _04X(item._unk21) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk23 !== undefined">
                    <tr>
                        <td>_unk23</td>
                        <td>{{ _04X(item._unk23) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk24 !== undefined">
                    <tr>
                        <td>_unk24</td>
                        <td>{{ _04X(item._unk24) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk25 !== undefined">
                    <tr>
                        <td>_unk24</td>
                        <td>{{ _08X(item._unk25) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk26 !== undefined">
                    <tr>
                        <td>_unk26</td>
                        <td>{{ _02X(item._unk26) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk27 !== undefined">
                    <tr>
                        <td>_unk27</td>
                        <td>{{ _02X(item._unk27) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk28 !== undefined">
                    <tr>
                        <td>_unk28</td>
                        <td>{{ _08X(item._unk28) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk29 !== undefined">
                    <tr>
                        <td>_unk29</td>
                        <td>{{ _08X(item._unk29) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk30 !== undefined">
                    <tr>
                        <td>_unk30</td>
                        <td>{{ _04X(item._unk30) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk31 !== undefined">
                    <tr>
                        <td>_unk31</td>
                        <td>{{ _08X(item._unk31) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk32 !== undefined">
                    <tr>
                        <td>_unk32</td>
                        <td>{{ _04X(item._unk32) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk33 !== undefined">
                    <tr>
                        <td>_unk33</td>
                        <td>{{ _08X(item._unk33) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk34 !== undefined">
                    <tr>
                        <td>_unk34</td>
                        <td>{{ _04X(item._unk34) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk35 !== undefined">
                    <tr>
                        <td>_unk35</td>
                        <td>{{ _04X(item._unk35) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk36 !== undefined">
                    <tr>
                        <td>_unk36</td>
                        <td>{{ _04X(item._unk36) }}</td>
                    </tr>
                </template>
                <template v-if="item?._unk37 !== undefined">
                    <tr>
                        <td>_unk37</td>
                        <td>{{ _08X(item._unk37) }}</td>
                    </tr>
                </template>
                <template v-if="item?._unk38 !== undefined">
                    <tr>
                        <td>_unk38</td>
                        <td>{{ _02X(item._unk38) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk39 !== undefined">
                    <tr>
                        <td>_unk39</td>
                        <td>{{ _02X(item._unk39) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk40 !== undefined">
                    <tr>
                        <td>_unk40</td>
                        <td>{{ _02X(item._unk40) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk41 !== undefined">
                    <tr>
                        <td>_unk41</td>
                        <td>{{ _04X(item._unk41) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk42 !== undefined">
                    <tr>
                        <td>_unk42</td>
                        <td>{{ _08X(item._unk42) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk43 !== undefined">
                    <tr>
                        <td>_unk43</td>
                        <td>{{ _08X(item._unk43) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk44 !== undefined">
                    <tr>
                        <td>_unk44</td>
                        <td>{{ _08X(item._unk44) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk45 !== undefined">
                    <tr>
                        <td>_unk45</td>
                        <td>{{ _08X(item._unk45) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk46 !== undefined">
                    <tr>
                        <td>_unk46</td>
                        <td>{{ _08X(item._unk46) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk47 !== undefined">
                    <tr>
                        <td>_unk47</td>
                        <td>{{ _08X(item._unk47) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk48 !== undefined">
                    <tr>
                        <td>_unk48</td>
                        <td>{{ _08X(item._unk48) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk49 !== undefined">
                    <tr>
                        <td>_unk49</td>
                        <td>{{ _08X(item._unk49) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk50 !== undefined">
                    <tr>
                        <td>_unk50</td>
                        <td>{{ _08X(item._unk50) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk51 !== undefined">
                    <tr>
                        <td>_unk51</td>
                        <td>{{ _08X(item._unk51) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk52 !== undefined">
                    <tr>
                        <td>_unk52</td>
                        <td>{{ _02X(item._unk52) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk53 !== undefined">
                    <tr>
                        <td>_unk53</td>
                        <td>{{ _02X(item._unk53) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk54 !== undefined">
                    <tr>
                        <td>_unk54</td>
                        <td>{{ _08X(item._unk54) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk55 !== undefined">
                    <tr>
                        <td>_unk55</td>
                        <td>{{ _04X(item._unk55) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk56 !== undefined">
                    <tr>
                        <td>_unk56</td>
                        <td>{{ _04X(item._unk56) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk57 !== undefined">
                    <tr>
                        <td>_unk57</td>
                        <td>{{ _08X(item._unk57) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk58 !== undefined">
                    <tr>
                        <td>_unk58</td>
                        <td>{{ _02X(item._unk58) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk59 !== undefined">
                    <tr>
                        <td>_unk59</td>
                        <td>{{ _02X(item._unk59) }}</td>
                    </tr>
                </template>

                <template v-if="item?._unk60 !== undefined">
                    <tr>
                        <td>_unk60</td>
                        <td>{{ _02X(item._unk60) }}</td>
                    </tr>
                </template>
            </tbody>
        </table>

        <template v-if="item?.debug !== undefined">
            <pre><code>{{ item.debug }}</code></pre>
        </template>
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

    computed: {
        iconSrc() : string {
            const item = this.item;

            if (item?.iconTexture) {
                const b = item.iconTexture.getRGBABuffer();

                if (b) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        canvas.width = item.iconTexture.width;
                        canvas.height = item.iconTexture.height;

                        const imageData = new ImageData(b, item.iconTexture.width, item.iconTexture.height);
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }
                }
            }

            return '';
        },
    },

    emits: {
    },

    methods: {
        _02X: function (n: number) {
            if (n === null || n === undefined) {
                return '???';
            }
            return n.toString(16).toUpperCase().padStart(2, '0');
        },

        _04X: function (n: number) {
            if (n === null || n === undefined) {
                return '???';
            }
            return n.toString(16).toUpperCase().padStart(4, '0');
        },

        _08X: function (n: number) {
            if (n === null || n === undefined) {
                return '???';
            }
            return n.toString(16).toUpperCase().padStart(8, '0');
        },
    },
});
</script>

<style scoped lang="sass">
</style>
