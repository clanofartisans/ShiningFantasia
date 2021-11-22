interface Window {
    ipcApi: WindowIpcApi,
}

interface WindowIpcApi {
    selectBasePath(currentBasePath: string): Promise<string>;
    setBasePath(basePath: string): Promise<boolean>;
    getUniqueId(fileId: number): Promise<number>;
    readResource(fileId: number): Promise<Buffer>;
}
