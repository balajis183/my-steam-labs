/*const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { SerialPort } = require('serialport'); // Correct import for v10+

// Adjust these paths for your setup
const ESP_PROJECT_DIR = path.join(__dirname, '../esp-project');
const MAIN_C_PATH = path.join(ESP_PROJECT_DIR, 'main.c');
const BIN_PATH = path.join(ESP_PROJECT_DIR, 'main.bin');
const ESPTOOL_PATH = '/path/to/esptool.py'; // <-- Set your esptool.py path


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: false by default with contextIsolation: true
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle code generation request from renderer
ipcMain.on('generateCode', (event, data) => {
  console.log('Received data to generate code:', data);
  // Assuming generateSetPinCode is imported or defined elsewhere:
  let generatedCode = generateSetPinCode(data.pin, data.value);
  event.reply('generatedCode', generatedCode);
});

// Flash code with esptool.py
ipcMain.handle('flash-code', async (event, port) => {
  const cmd = `python3 "${ESPTOOL_PATH}" --port "${port}" write_flash 0x00000 "${BIN_PATH}"`;
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, message: stderr || error.message });
      } else {
        resolve({ success: true, message: stdout });
      }
    });
  });
});

// List available serial ports (fixed for serialport v10+)
ipcMain.handle('list-serial-ports', async () => {
  try {
    const ports = await SerialPort.list();
    return { success: true, ports: ports.map(p => p.path) };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle board check
ipcMain.handle('check-board', async () => {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['status.py']);

    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (err) => {
      console.error('Python error:', err.toString());
    });

    python.on('close', () => {
      // IMPORTANT: output should be exactly "connected" or "disconnected"
      resolve(output.trim());
    });

    python.on('error', (err) => {
      reject(err);
    });
  });
});
// Handle firmware upload request
ipcMain.handle('upload-firmware', async (event, { port, filePath }) => {
  const { uploadFirmware } = require('./utils/uploader');
  try {
    const result = await uploadFirmware(port, filePath);
    return result;
  } catch (err) {
    console.error('Upload failed:', err);
    throw new Error('Firmware upload failed');
  }
});*/

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const { SerialPort } = require('serialport');

// Adjust paths
const ESP_PROJECT_DIR = path.join(__dirname, '../esp-project');
const MAIN_C_PATH = path.join(ESP_PROJECT_DIR, 'main.c');
const BIN_PATH = path.join(ESP_PROJECT_DIR, 'main.bin');
const ESPTOOL_PATH = '/path/to/esptool.py'; // TODO: UPDATE this

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html'); // adjust if needed
}

// Improve performance on some systems
app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  // List ports on startup for debug
  SerialPort.list().then(ports => {
    console.log('💡 Ports found (main process):', ports);
  }).catch(err => {
    console.error('❌ Error listing ports:', err);
  });

  // macOS: reopen window if no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit on all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// -------------------------
// ✅ IPC HANDLERS BELOW
// -------------------------

// Save C code to file
ipcMain.handle('save-code', async (event, code) => {
  try {
    fs.writeFileSync(MAIN_C_PATH, code, 'utf8');
    return { success: true, message: 'Code saved.' };
  } catch (err) {
    return { success: false, message: 'Failed to save code: ' + err.message };
  }
});

// Compile code using `make`
ipcMain.handle('compile-code', async () => {
  return new Promise(resolve => {
    exec('make', { cwd: ESP_PROJECT_DIR }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, message: stderr || error.message });
      } else {
        resolve({ success: true, message: stdout });
      }
    });
  });
});

// Flash binary to ESP device
ipcMain.handle('flash-code', async (event, port) => {
  const cmd = `python "${ESPTOOL_PATH}" --port "${port}" write_flash 0x00000 "${BIN_PATH}"`;
  return new Promise(resolve => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, message: stderr || error.message });
      } else {
        resolve({ success: true, message: stdout });
      }
    });
  });
});

// List serial ports
ipcMain.handle('list-serial-ports', async () => {
  try {
    const ports = await SerialPort.list();
    return { success: true, ports: ports.map(p => p.path) };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// Firmware upload using external utility
ipcMain.handle('upload-firmware', async (event, { port, filePath }) => {
  try {
    const { uploadFirmware } = require('./utils/uploader');
    const result = await uploadFirmware(port, filePath);
    return result;
  } catch (err) {
    console.error('Upload failed:', err);
    throw new Error('Firmware upload failed');
  }
});

// Python-based board connection check
ipcMain.handle('check-board', async () => {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['status.py']);
    let output = '';

    python.stdout.on('data', data => {
      output += data.toString();
    });

    python.stderr.on('data', err => {
      console.error('Python stderr:', err.toString());
    });

    python.on('close', () => {
      resolve(output.trim().toLowerCase());
    });

    python.on('error', err => {
      reject(err);
    });
  });
});

// Code generation logic
ipcMain.on('generateCode', (event, data) => {
  const code = generateSetPinCode(data.pin, data.value);
  event.reply('generatedCode', code);
});

// Fallback: Simple code generator (optional)
function generateSetPinCode(pin, value) {
  return `void setup() {
  pinMode(${pin}, OUTPUT);
}

void loop() {
  digitalWrite(${pin}, ${value});
}`;
}
