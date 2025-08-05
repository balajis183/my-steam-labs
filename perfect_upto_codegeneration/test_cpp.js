const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testCppCode() {
  console.log('🔧 Testing C++ Code Generation and Compilation...\n');

  // Test 1: Generate sample C++ code
  const sampleCppCode = `#include <Arduino.h>

void setup() {
  Serial.begin(9600);
  Serial.println("Hello from Arduino C++!");
}

void loop() {
  for(int i = 0; i < 5; i++) {
    Serial.print("Count: ");
    Serial.println(i);
    delay(1000);
  }
}`;

  console.log('1. Sample C++ Code:');
  console.log(sampleCppCode);
  console.log('\n');

  // Test 2: Test C++ compilation
  console.log('2. Testing C++ Compilation:');
  try {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpp-test-'));
    const cppPath = path.join(tmpDir, 'test.cpp');
    const exePath = path.join(tmpDir, 'test.exe');
    fs.writeFileSync(cppPath, sampleCppCode, 'utf-8');
    
    exec(`g++ "${cppPath}" -o "${exePath}" -std=c++11 -DARDUINO=100`, (err, stdout, stderr) => {
      if (err) {
        console.log('   ❌ C++ compilation failed:');
        console.log('   Error:', err.message);
        console.log('   Stderr:', stderr);
      } else {
        console.log('   ✅ C++ compilation successful!');
        console.log('   Output:', stdout);
        
        // Try to run the compiled executable
        exec(`"${exePath}"`, (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.log('   ⚠️  Execution failed (expected for Arduino code):');
            console.log('   Error:', runErr.message);
          } else {
            console.log('   ✅ Execution successful:');
            console.log('   Output:', runStdout);
          }
        });
      }
    });
  } catch (err) {
    console.log(`   ❌ Error creating test file: ${err.message}`);
  }

  // Test 3: Check GCC availability
  console.log('\n3. Testing GCC availability:');
  exec('gcc --version', (err, stdout, stderr) => {
    if (err) {
      console.log('   ❌ GCC not found');
      console.log('   Please install GCC compiler');
    } else {
      console.log(`   ✅ GCC available: ${stdout.split('\n')[0]}`);
    }
  });

  // Test 4: Check G++ availability
  console.log('\n4. Testing G++ availability:');
  exec('g++ --version', (err, stdout, stderr) => {
    if (err) {
      console.log('   ❌ G++ not found');
      console.log('   Please install G++ compiler');
    } else {
      console.log(`   ✅ G++ available: ${stdout.split('\n')[0]}`);
    }
  });

  console.log('\n📋 C++ Test Summary:');
  console.log('   - C++ code generation should work correctly');
  console.log('   - Arduino C++ syntax should be supported');
  console.log('   - GCC/G++ compilation should work');
  console.log('   - Proper error handling for compilation');
}

// Run the test
testCppCode().catch(console.error); 