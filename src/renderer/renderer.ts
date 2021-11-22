import { Buffer } from 'buffer';
import { createApp } from 'vue';

import App from './App.vue';

// Add Buffer global if it doesn't exist yet.
if (!window.Buffer) {
    window.Buffer = Buffer;
}

createApp(App)
    .mount('#app');
