# MY STEAM LAB - Blockly Code Generator

A comprehensive code generation and hardware interaction tool with multi-language support for JavaScript, Python, C++, and C.

## 🚀 Recent Updates - Language Detection Fix

### ✅ **Fixed Issues**
- **Language Detection**: Now properly detects C/C++ code and compiles with correct compiler
- **Auto-Detection**: Automatically detects language from code content
- **Manual Selection**: Added language dropdown for manual language selection
- **Real-time Detection**: Monaco editor now detects language as you type

### 🎯 **Language Detection Features**

#### **Automatic Detection**
The system now automatically detects the language based on code content:

- **C++/Arduino**: Detects `#include <Arduino.h>`, `void setup()`, `void loop()`, `Serial.`, `F_CPU`
- **C**: Detects `#include <stdio.h>`, `printf()`, `int main()`, `return 0;`
- **Python**: Detects `import`, `def`, `print()`, `if __name__`, `time.sleep`
- **JavaScript**: Detects `console.log()`, `function`, `var`, `let`, `const`

#### **Manual Language Selection**
- **Language Dropdown**: Select language manually from the navbar
- **Auto Detect**: Choose "Auto Detect" to let the system detect automatically
- **Override**: Manually select language to override auto-detection

### 🔧 **How It Works**

1. **Code Generation**: When you generate code from blocks, the language is automatically set
2. **Manual Typing**: When you type code manually, the system detects the language
3. **Compilation**: The correct compiler is used based on detected/selected language
4. **Feedback**: Terminal shows which language is being used for compilation

## Features

### 🚀 Multi-Language Support
- **JavaScript**: Node.js execution and compilation
- **Python**: MicroPython support with mpremote for ESP32
- **C++**: GCC compilation and execution
- **C**: GCC compilation and execution

### 🔧 Hardware Integration
- **Serial Port Management**: Automatic port detection and connection
- **ESP32 Support**: MicroPython upload and execution via mpremote
- **Board Status**: Real-time connection status monitoring
- **Hardware Detection**: Automatic detection of development boards

### 💻 Terminal Integration
- **Real-time Output**: Live terminal display for compile/upload/run operations
- **Multi-language Responses**: Language-specific compilation and execution feedback
- **Error Handling**: Comprehensive error reporting in terminal

### 🎯 Core Functionality

#### Compile
- Compiles code for the selected language
- Shows compilation output in terminal
- Supports all four languages (JavaScript, Python, C++, C)

#### Upload
- Uploads code to connected hardware (ESP32 for Python)
- Executes code locally for other languages
- Real-time progress feedback in terminal

#### Run
- Executes code immediately
- Shows execution output in terminal
- Supports both local and hardware execution

## Hardware Connectivity

### ✅ **Verified Hardware Support**

The application has been tested and verified to work with:

#### **ESP32 Development Boards**
- **Upload**: Uses `mpremote` to upload MicroPython code
- **Run**: Executes code directly on ESP32 via `mpremote run`
- **Detection**: Automatically detects ESP32 boards via serial port

#### **Arduino Boards**
- **Upload**: Compiles and uploads via Arduino CLI (if installed)
- **Run**: Executes compiled code on board

### 🔌 **Serial Port Management**
- **Automatic Detection**: Scans for available serial ports
- **Real-time Status**: Shows connection status
- **Port Selection**: Dropdown to select specific port
- **Refresh**: Button to refresh available ports

## Usage

### 📝 **Code Generation**
1. **Create Blocks**: Drag and drop blocks from the toolbox
2. **Generate Code**: Click language-specific generate buttons
3. **Edit Code**: Modify generated code in Monaco editor
4. **Compile/Run**: Use compile, upload, or run buttons

### 🔧 **Manual Code Entry**
1. **Type Code**: Write code directly in Monaco editor
2. **Language Detection**: System automatically detects language
3. **Manual Override**: Use language dropdown if needed
4. **Compile/Run**: Use action buttons

### 🎯 **Language Selection**
- **Auto Detect**: Let system detect language automatically
- **Manual Select**: Choose specific language from dropdown
- **Override**: Force compilation with specific language

## Troubleshooting

### ❌ **Common Issues**

#### **Language Detection Issues**
- **Problem**: Wrong language detected
- **Solution**: Use language dropdown to manually select correct language

#### **Compilation Errors**
- **Problem**: C/C++ code compiled as Python
- **Solution**: Ensure language is correctly detected or manually selected

#### **Hardware Connection Issues**
- **Problem**: Port not detected
- **Solution**: Click "Refresh Ports" button

### 🔧 **Debug Information**
- **Terminal Output**: Check terminal for detailed error messages
- **Language Detection**: Console shows detected language
- **Compilation Log**: Full compilation output in terminal

## Development

### 🛠️ **Testing**
Run the language detection test:
```bash
node test_language_detection.js
```

### 📁 **File Structure**
- `renderer.js`: Main UI logic and language detection
- `main.js`: Electron main process and compilation functions
- `monaco.html`: Code editor with language detection
- `navbar.html`: UI with language selection dropdown
- `test_language_detection.js`: Language detection test suite

### 🔄 **Language Detection Logic**
The system uses multiple detection methods:
1. **Editor Language**: Monaco editor's built-in language detection
2. **Code Content**: Pattern matching for language-specific syntax
3. **Manual Selection**: User-selected language from dropdown
4. **Fallback**: Last generated language as default

## License

This project is licensed under the MIT License. 