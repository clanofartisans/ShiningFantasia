import { app, BrowserWindow, dialog, ipcMain } from 'electron';

import path from 'path';

import { DatReader } from '../common/datreader';

let mainWindow: BrowserWindow | null = null;

let datReader: DatReader | null = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/preload.js'),
        },
        icon: path.join(__dirname, '../icon.png'),
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
});

ipcMain.handle('select-base-path', async (event, currentPath) => {
    const files = await dialog.showOpenDialog(mainWindow!, {
        title: 'Select Xi Base Path',
        properties: ['openDirectory'],
    });

    if (!files?.canceled && files?.filePaths?.length > 0) {
        return files.filePaths[0];
    }
    return currentPath;
});

ipcMain.handle('set-base-path', async (event, basePath) => {
    datReader = new DatReader(basePath);
    return true;
});

ipcMain.handle('get-file-list', async (event) => {
    if (datReader) {
        const fileTable = datReader.fileTable;

        const fileList = [];
        for (let i = 0; i < fileTable.length; i++) {
            fileList.push(fileTable.getBaseFileName(i));
        }
        return fileList;
    }
    return null;
});

ipcMain.handle('get-unique-id', async (event, fileId) => {
    if (datReader) {
        return datReader.getUniqueId(fileId);
    }
    return 0;
});

ipcMain.handle('get-file-name', async (event, fileId) => {
    if (datReader) {
        const baseFileName = datReader.getBaseFileName(fileId);
        const fileName = datReader.getFileName(fileId);

        if (fileName) {
            return {
                baseFileName,
                fileName,
            }
        }
    }
    return null;
});

ipcMain.handle('read-resource', async (event, fileId) => {
    if (datReader) {
        return datReader.readFile(fileId);
    }
    return null;
});
