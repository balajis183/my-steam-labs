const { contextBridge, ipcRenderer } = require('electron');

// Expose API for compile/save/etc. under electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  saveCode: (code) => ipcRenderer.invoke('save-code', code),
  compileCode: () => ipcRenderer.invoke('compile-code'),
  flashCode: (port) => ipcRenderer.invoke('flash-code', port),
  listSerialPorts: () => ipcRenderer.invoke('list-serial-ports')
});

// Expose advanced features like code generation and firmware under electron
contextBridge.exposeInMainWorld('electron', {
  generateCode: (data) => ipcRenderer.send('generateCode', data),

  onGeneratedCode: (callback) => {
    const listener = (event, code) => callback(code);
    ipcRenderer.on('generatedCode', listener);
    return () => ipcRenderer.removeListener('generatedCode', listener);
  },

  flashCode: (port) => ipcRenderer.invoke('flash-code', port),
  listSerialPorts: () => ipcRenderer.invoke('list-serial-ports'),

  uploadFirmware: (port, filePath) => ipcRenderer.invoke('upload-firmware', { port, filePath })
    .catch(err => console.error('Error uploading firmware:', err)),

  checkBoard: () => ipcRenderer.invoke('check-board')
});
