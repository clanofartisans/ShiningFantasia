interface Window {
    ipcApi: WindowIpcApi,
}

interface GetFileNameResult {
    baseFileName: string,
    fileName: string,
}

interface WindowIpcApi {
    selectBasePath(currentBasePath: string): Promise<string>;
    setBasePath(basePath: string): Promise<boolean>;
    getFileList() : Promise<string[]>,
    getUniqueId(fileId: number): Promise<number>;
    getFileName(fileId: number): Promise<GetFileNameResult | null>,
    readResource(fileId: number): Promise<Buffer>;
}
