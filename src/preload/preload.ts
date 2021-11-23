import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld(
    'ipcApi',
    {
        selectBasePath: (currentBasePath: string) => {
            return ipcRenderer.invoke('select-base-path', currentBasePath);
        },

        setBasePath: (basePath: string) => {
            return ipcRenderer.invoke('set-base-path', basePath);
        },

        getUniqueId: (fileId: number) => {
            return ipcRenderer.invoke('get-unique-id', fileId);
        },

        getFileName: (fileId: number) => {
            return ipcRenderer.invoke('get-file-name', fileId);
        },

        readResource: (fileId: number) => {
            return ipcRenderer.invoke('read-resource', fileId);
        },
    },
);
