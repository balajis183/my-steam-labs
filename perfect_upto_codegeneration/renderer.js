console.log('⚡ renderer.js loaded');

let currentPort = null;
let currentLanguage = 'python'; // Default language
let lastGeneratedLanguage = 'python'; // Track last generated language
let lastCompiledPath = null;
let lastCompiledSuccess = false;

// Terminal output functions
function appendTerminalOutput(message) {
  const terminalOutput = document.getElementById('terminal-output');
  if (terminalOutput) {
    terminalOutput.textContent += message + '\n';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

function clearTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  if (terminalOutput) {
    terminalOutput.textContent = '';
  }
}

// Make clearTerminal globally available
window.clearTerminal = clearTerminal;

// Get current code from Monaco editor
function getCurrentCode() {
  const editorWindow = document.getElementById('monacoEditor').contentWindow;
  if (editorWindow && editorWindow.getEditorValue) {
    return editorWindow.getEditorValue();
  }
  return '';
}

// Get current language from Monaco editor or last generated language
function getCurrentLanguage() {
  // Check if user has manually selected a language
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect && languageSelect.value && languageSelect.value !== 'auto') {
    return languageSelect.value;
  }
  
  const editorWindow = document.getElementById('monacoEditor').contentWindow;
  if (editorWindow && editorWindow.getEditorLanguage) {
    const editorLang = editorWindow.getEditorLanguage();
    if (editorLang && editorLang !== 'javascript') {
      return editorLang;
    }
  }
  
  // If editor language is not available, try to detect from code content
  const code = getCurrentCode();
  if (code.trim()) {
    const detectedLang = detectLanguageFromCode(code);
    if (detectedLang) {
      return detectedLang;
    }
  }
  
  // Fallback to last generated language
  return lastGeneratedLanguage;
}

// Detect language from code content
function detectLanguageFromCode(code) {
  const trimmedCode = code.trim();
  
  // Check for C/C++ includes
  if (trimmedCode.includes('#include <') || trimmedCode.includes('#include"')) {
    if (trimmedCode.includes('#include <Arduino.h>') || 
        trimmedCode.includes('void setup()') || 
        trimmedCode.includes('void loop()') ||
        trimmedCode.includes('Serial.') ||
        trimmedCode.includes('F_CPU')) {
      return 'cpp';
    }
    return 'c';
  }
  
  // Check for Python imports and syntax
  if (trimmedCode.includes('import ') || 
      trimmedCode.includes('def ') || 
      trimmedCode.includes('print(') ||
      trimmedCode.includes('if __name__') ||
      trimmedCode.includes('time.sleep')) {
    return 'python';
  }
  
  // Check for JavaScript syntax
  if (trimmedCode.includes('console.log(') || 
      trimmedCode.includes('function ') ||
      trimmedCode.includes('var ') ||
      trimmedCode.includes('let ') ||
      trimmedCode.includes('const ')) {
    return 'javascript';
  }
  
  // Check for C/C++ function syntax without includes
  if (trimmedCode.includes('void ') || 
      trimmedCode.includes('int main()') ||
      trimmedCode.includes('printf(') ||
      trimmedCode.includes('return 0;')) {
    if (trimmedCode.includes('Serial.') || trimmedCode.includes('Arduino')) {
      return 'cpp';
    }
    return 'c';
  }
  
  return null; // Could not detect
}

// Set the current language when code is generated
function setCurrentLanguage(language) {
  lastGeneratedLanguage = language;
  console.log(`🎯 Language set to: ${language}`);
}

// Manually set language for compilation (exposed globally)
function setLanguageForCompilation(language) {
  if (language === 'auto') {
    // Reset to auto-detect mode
    lastGeneratedLanguage = 'python'; // Default fallback
    console.log(`🎯 Language set to auto-detect mode`);
  } else {
    lastGeneratedLanguage = language;
    console.log(`🎯 Language manually set to: ${language} for compilation`);
  }
}

// Expose the function globally
window.setLanguageForCompilation = setLanguageForCompilation;

// Multi-language compile function
async function compileCode() {
  const code = getCurrentCode();
  const language = getCurrentLanguage();
  
  if (!code.trim()) {
    appendTerminalOutput('❌ No code to compile. Please generate some code first.');
    return;
  }
  
  appendTerminalOutput(`🔄 Compiling ${language} code...`);
  console.log(`🎯 Compiling with language: ${language}`);
  
  try {
    let result;
    switch (language) {
      case 'python':
        result = await window.electronAPI.compilePython(code);
        break;
      case 'javascript':
        result = await window.electronAPI.compileJavaScript(code);
        break;
      case 'cpp':
        result = await window.electronAPI.compileCpp(code);
        break;
      case 'c':
        result = await window.electronAPI.compileC(code);
        break;
      default:
        appendTerminalOutput(`❌ Unsupported language: ${language}`);
        return;
    }
    
    if (result.success) {
      appendTerminalOutput(`✅ Compilation successful!`);
      appendTerminalOutput(result.output || 'No output');
      lastCompiledPath = result.compiledPath;
      lastCompiledSuccess = true;
    } else {
      appendTerminalOutput(`❌ Compilation failed:`);
      appendTerminalOutput(result.error);
      lastCompiledSuccess = false;
    }
  } catch (error) {
    appendTerminalOutput(`❌ Compilation error: ${error.message}`);
    lastCompiledSuccess = false;
  }
}

// Multi-language upload function
async function uploadCode() {
  const code = getCurrentCode();
  const language = getCurrentLanguage();
  
  if (!code.trim()) {
    appendTerminalOutput('❌ No code to upload. Please generate some code first.');
    return;
  }
  
  if (!currentPort) {
    appendTerminalOutput('❌ No port selected. Please select a port first.');
    return;
  }
  
  appendTerminalOutput(`📤 Uploading ${language} code to ${currentPort}...`);
  
  try {
    let result;
    switch (language) {
      case 'python':
        result = await window.electronAPI.uploadPython(code, currentPort);
        break;
      case 'javascript':
        result = await window.electronAPI.uploadJavaScript(code, currentPort);
        break;
      case 'cpp':
        result = await window.electronAPI.uploadCpp(code, currentPort);
        break;
      case 'c':
        result = await window.electronAPI.uploadC(code, currentPort);
        break;
      default:
        appendTerminalOutput(`❌ Unsupported language for upload: ${language}`);
        return;
    }
    
    if (result.success) {
      appendTerminalOutput(`✅ Upload successful!`);
      appendTerminalOutput(result.output || 'No output');
    } else {
      appendTerminalOutput(`❌ Upload failed:`);
      appendTerminalOutput(result.error);
    }
  } catch (error) {
    appendTerminalOutput(`❌ Upload error: ${error.message}`);
  }
}

// Multi-language run function
async function runCode() {
  const code = getCurrentCode();
  const language = getCurrentLanguage();
  
  if (!code.trim()) {
    appendTerminalOutput('❌ No code to run. Please generate some code first.');
    return;
  }
  
  appendTerminalOutput(`▶️ Running ${language} code...`);
  
  try {
    let result;
    switch (language) {
      case 'python':
        result = await window.electronAPI.runPython(code, currentPort);
        break;
      case 'javascript':
        result = await window.electronAPI.runJavaScript(code);
        break;
      case 'cpp':
        result = await window.electronAPI.runCpp(code);
        break;
      case 'c':
        result = await window.electronAPI.runC(code);
        break;
      default:
        appendTerminalOutput(`❌ Unsupported language for running: ${language}`);
        return;
    }
    
    appendTerminalOutput(`📋 Execution output:`);
    appendTerminalOutput(result);
  } catch (error) {
    appendTerminalOutput(`❌ Execution error: ${error.message}`);
  }
}

// Make functions globally available
window.compileCode = compileCode;
window.uploadCode = uploadCode;
window.runCode = runCode;
window.setCurrentLanguage = setCurrentLanguage;

// Serial port management
async function refreshPorts() {
  const portSelect = document.getElementById('portSelect');
  if (!portSelect) {
    console.error('❌ #portSelect element not found');
    return;
  }

  const ports = await window.electronAPI.listSerialPorts();
  console.log('🔌 Ports found:', ports);

  portSelect.innerHTML = '';
  if (ports.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.text = 'No ports found';
    portSelect.appendChild(option);
  } else {
    ports.forEach(port => {
      const option = document.createElement('option');
      option.value = port.path;
      option.text = `${port.path} (${port.manufacturer || 'Unknown'})`;
      portSelect.appendChild(option);
    });
  }
}

// Port selection handler
async function selectPort(portPath, silent = false) {
  if (!portPath) return;
  
  currentPort = portPath;
  const result = await window.electronAPI.openSerialPort(portPath, 115200);
  
  if (result.success) {
    if (!silent) {
      appendTerminalOutput(`✅ Connected to ${portPath}`);
    }
  } else {
    appendTerminalOutput(`❌ Failed to connect to ${portPath}: ${result.error}`);
  }
}

// Event listeners for serial data
window.electronAPI.onSerialData((data) => {
  appendTerminalOutput(`📡 Serial: ${data}`);
});

window.electronAPI.onTerminalOutput((data) => {
  appendTerminalOutput(data);
});

window.electronAPI.onReopenPort(async (port) => {
  appendTerminalOutput(`🔄 Reconnecting to ${port}...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  await selectPort(port, true);
  appendTerminalOutput(`✅ Reconnected to ${port}`);
});

// Port selection change handler
function setupPortSelection() {
  const portSelect = document.getElementById('portSelect');
  if (portSelect) {
    portSelect.addEventListener('change', (e) => {
      selectPort(e.target.value);
    });
  }
}

// Board status check
function setupBoardStatusCheck() {
  const checkConnectionBtn = document.getElementById('checkConnectionBtn');
  const statusIndicator = document.getElementById('connection-status');
  
  if (checkConnectionBtn && statusIndicator) {
    checkConnectionBtn.addEventListener('click', async () => {
      statusIndicator.style.backgroundColor = 'grey';
      try {
        const status = await window.electronAPI.checkBoard();
        console.log('🟡 Board status:', status);
        
        if (status === 'connected') {
          statusIndicator.style.backgroundColor = 'green';
        } else if (status === 'disconnected') {
          statusIndicator.style.backgroundColor = 'red';
        } else {
          statusIndicator.style.backgroundColor = 'grey';
        }
      } catch (error) {
        console.error('❌ Board status check failed:', error);
        statusIndicator.style.backgroundColor = 'grey';
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM ready, setting up event listeners...');
  
  // Setup port selection
  setupPortSelection();
  
  // Setup board status check
  setupBoardStatusCheck();
  
  // Initial port refresh
  refreshPorts();
  
  // Make refreshPorts globally available
  window.refreshPorts = refreshPorts;
});

// Wait for dynamically injected elements
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

// Wait for portSelect after navbar loads
waitForElement('portSelect', () => {
  setupPortSelection();
  refreshPorts();
});

// Wait for checkConnectionBtn after navbar loads
waitForElement('checkConnectionBtn', () => {
  setupBoardStatusCheck();
});

