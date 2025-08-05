/*console.log('⚡ renderer.js loaded');

let portSelect = null;
const codeArea = document.getElementById('codeArea');
const saveBtn = document.getElementById('saveBtn');
const compileBtn = document.getElementById('compileBtn');
const flashBtn = document.getElementById('flashBtn');
const output = document.getElementById('output');

// --- Serial Ports Dropdown ---
async function refreshPorts() {
  portSelect = document.getElementById('portSelect');
  if (!portSelect) {
    console.error('❌ #portSelect element not found at refreshPorts()');
    return;
  }

  const result = await window.electronAPI.listSerialPorts();
  console.log('🔌 Port result:', result);

  portSelect.innerHTML = '';
  if (result.success) {
    result.ports.forEach(port => {
      const option = document.createElement('option');
      option.value = port;
      option.text = port;
      portSelect.appendChild(option);
    });
    console.log('✅ Ports added to dropdown');
  } else {
    if (output) output.textContent = 'Error listing ports: ' + result.message;
    console.warn('⚠️ Failed to list ports:', result.message);
  }
}

// --- Save Code ---
saveBtn?.addEventListener('click', async () => {
  const code = codeArea?.value || '';
  const result = await window.electronAPI.saveCode(code);
  if (output) output.textContent = result.message;
});

// --- Compile Code ---
compileBtn?.addEventListener('click', async () => {
  await saveBtn?.click(); // Save first
  if (output) output.textContent = 'Compiling...';
  const result = await window.electronAPI.compileCode();
  if (output) {
    output.textContent = result.success
      ? 'Compile Success:\n' + result.message
      : 'Compile Error:\n' + result.message;
  }
});

// --- Flash Code ---
flashBtn?.addEventListener('click', async () => {
  const port = portSelect?.value;
  if (!port) {
    if (output) output.textContent = 'Please select a serial port.';
    return;
  }

  if (output) output.textContent = 'Flashing...';
  const result = await window.electronAPI.flashCode(port);
  if (output) {
    output.textContent = result.success
      ? 'Flash Success:\n' + result.message
      : 'Flash Error:\n' + result.message;
  }
});

// --- Generate Code Button ---
document.getElementById('generateCodeButton')?.addEventListener('click', () => {
  const pin = document.getElementById('pinInput')?.value;
  const value = document.getElementById('valueInput')?.value;

  window.electron.generateCode({ pin, value });

  window.electron.onGeneratedCode((generatedCode) => {
    const outputEl = document.getElementById('generatedCodeOutput');
    if (outputEl) outputEl.textContent = generatedCode;
  });
});

// --- Upload Firmware Button ---
document.getElementById('uploadFirmwareButton')?.addEventListener('click', () => {
  const selectedPort = portSelect?.value;
  const fileInput = document.getElementById('fileInput');
  const filePath = fileInput?.files[0]?.path;

  if (selectedPort && filePath) {
    window.electron.uploadFirmware(selectedPort, filePath);
    window.electron.onFirmwareUploadResponse((response) => {
      console.log('Firmware upload response:', response);
      alert(response.success ? 'Firmware uploaded successfully!' : 'Upload failed!');
    });
  } else {
    alert('Please select a COM port and a file to upload.');
  }
});

// --- Check Connection Status ---
document.getElementById('checkConnectionBtn')?.addEventListener('click', async () => {
  const status = await window.electron.checkBoard();
  const statusEl = document.getElementById('connection-status');

  if (!statusEl) return;
  if (status === 'connected') {
    statusEl.style.backgroundColor = 'green';
  } else if (status === 'disconnected') {
    statusEl.style.backgroundColor = 'red';
  } else {
    statusEl.style.backgroundColor = 'grey';
  }
});

// --- Expose refreshPorts globally ---
window.refreshPorts = refreshPorts;

// --- Watch for dynamic injection of #portSelect ---
function waitForPortSelectAndRun() {
  const tryInit = () => {
    portSelect = document.getElementById('portSelect');
    if (portSelect) {
      console.log('✅ #portSelect detected in DOM');
      refreshPorts();
      return true;
    }
    return false;
  };

  if (tryInit()) return;

  const observer = new MutationObserver(() => {
    if (tryInit()) observer.disconnect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM ready, now waiting for #portSelect...');
  waitForPortSelectAndRun();
});*/

console.log('⚡ renderer.js loaded');

// Grab elements that exist at load time
const codeArea = document.getElementById('codeArea');
const saveBtn = document.getElementById('saveBtn');
const compileBtn = document.getElementById('compileBtn');
const flashBtn = document.getElementById('flashBtn');
const output = document.getElementById('output');

// --- Helper: Wait for dynamically injected elements ---
function waitForElement(id, callback) {
  const el = document.getElementById(id);
  if (el) {
    callback(el);
    return;
  }

  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// --- Serial Ports Dropdown ---
async function refreshPorts() {
  const portSelect = document.getElementById('portSelect');
  if (!portSelect) {
    console.error('❌ #portSelect element not found');
    return;
  }

  const result = await window.electronAPI.listSerialPorts();
  console.log('🔌 Port result:', result);

  portSelect.innerHTML = '';
  if (result.success) {
    result.ports.forEach(port => {
      const option = document.createElement('option');
      option.value = port;
      option.text = port;
      portSelect.appendChild(option);
    });
    console.log('✅ Ports added to dropdown');
  } else {
    if (output) output.textContent = 'Error listing ports: ' + result.message;
    console.warn('⚠️ Failed to list ports:', result.message);
  }
}
window.refreshPorts = refreshPorts;

// --- Save Code ---
saveBtn?.addEventListener('click', async () => {
  const code = codeArea?.value || '';
  const result = await window.electronAPI.saveCode(code);
  if (output) output.textContent = result.message;
});

// --- Compile Code ---
compileBtn?.addEventListener('click', async () => {
  await saveBtn?.click(); // Save first
  if (output) output.textContent = 'Compiling...';
  const result = await window.electronAPI.compileCode();
  if (output) {
    output.textContent = result.success
      ? 'Compile Success:\n' + result.message
      : 'Compile Error:\n' + result.message;
  }
});

// --- Flash Code ---
flashBtn?.addEventListener('click', async () => {
  const portSelect = document.getElementById('portSelect');
  const port = portSelect?.value;
  if (!port) {
    if (output) output.textContent = 'Please select a serial port.';
    return;
  }

  if (output) output.textContent = 'Flashing...';
  const result = await window.electronAPI.flashCode(port);
  if (output) {
    output.textContent = result.success
      ? 'Flash Success:\n' + result.message
      : 'Flash Error:\n' + result.message;
  }
});

// --- Generate Code Button ---
document.getElementById('generateCodeButton')?.addEventListener('click', () => {
  const pin = document.getElementById('pinInput')?.value;
  const value = document.getElementById('valueInput')?.value;

  window.electron.generateCode({ pin, value });

  window.electron.onGeneratedCode((generatedCode) => {
    const outputEl = document.getElementById('generatedCodeOutput');
    if (outputEl) outputEl.textContent = generatedCode;
  });
});

// --- Upload Firmware Button ---
document.getElementById('uploadFirmwareButton')?.addEventListener('click', () => {
  const portSelect = document.getElementById('portSelect');
  const selectedPort = portSelect?.value;
  const fileInput = document.getElementById('fileInput');
  const filePath = fileInput?.files[0]?.path;

  if (selectedPort && filePath) {
    window.electron.uploadFirmware(selectedPort, filePath);
    window.electron.onFirmwareUploadResponse((response) => {
      console.log('Firmware upload response:', response);
      alert(response.success ? 'Firmware uploaded successfully!' : 'Upload failed!');
    });
  } else {
    alert('Please select a COM port and a file to upload.');
  }
});

// --- Check Board Status ---
waitForElement('checkConnectionBtn', (btn) => {
  btn.addEventListener('click', async () => {
    const status = await window.electron.checkBoard();
    console.log('🟡 Board status from Python:', status);

    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;

    if (status === 'connected') {
      statusEl.style.backgroundColor = 'green';
    } else if (status === 'disconnected') {
      statusEl.style.backgroundColor = 'red';
    } else {
      statusEl.style.backgroundColor = 'grey';
    }
  });
});

// --- Wait for #portSelect after navbar loads ---
waitForElement('portSelect', () => {
  refreshPorts();
});

