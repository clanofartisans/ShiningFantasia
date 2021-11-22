// Shims magic required for Vue 3 SFCs

declare module '*.vue' {
    import { defineComponent } from 'vue';
    const vueComponent: ReturnType<typeof defineComponent>;
    export default vueComponent;
}
