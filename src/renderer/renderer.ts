import 'bootstrap/dist/css/bootstrap.min.css';

// Before importing the rest of the application,
// add Buffer to the global space if it doesn't
// exist yet.
//
// The actual work is done inside a separate
// module so that the extra module can be
// placed before everything else in the
// initialization chain.
//
// This entry point will be executed
// last, after any global initialization.
//
import { Buffer } from './init-buffer';

// Do something with the global so that the
// import is preserved.
globalThis.Buffer = Buffer;

import { createApp } from 'vue';

import App from './App.vue';

createApp(App)
    .mount('#app');
