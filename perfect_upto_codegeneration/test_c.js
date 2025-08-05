const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testCCode() {
  console.log('🔧 Testing C Code Generation and Compilation...\n');

  // Test 1: Generate sample C code
  const sampleCCode = `#include <stdio.h>
#include <stdlib.h>

int main() {
  printf("Hello from C!\n");
  
  for(int i = 0; i < 5; i++) {
    printf("Count: %d\n", i);
  }
  
  return 0;
}`;

  console.log('1. Sample C Code:');
  console.log(sampleCCode);
  console.log('\n');

  // Test 2: Test C compilation
  console.log('2. Testing C Compilation:');
  try {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'c-test-'));
    const cPath = path.join(tmpDir, 'test.c');
    const exePath = path.join(tmpDir, 'test.exe');
    fs.writeFileSync(cPath, sampleCCode, 'utf-8');
    
    exec(`gcc "${cPath}" -o "${exePath}" -std=c99`, (err, stdout, stderr) => {
      if (err) {
        console.log('   ❌ C compilation failed:');
        console.log('   Error:', err.message);
        console.log('   Stderr:', stderr);
      } else {
        console.log('   ✅ C compilation successful!');
        console.log('   Output:', stdout);
        
        // Run the compiled executable
        exec(`"${exePath}"`, (runErr, runStdout, runStderr) => {
          if (runErr) {
            console.log('   ❌ C execution failed:');
            console.log('   Error:', runErr.message);
          } else {
            console.log('   ✅ C execution successful:');
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

  console.log('\n📋 C Test Summary:');
  console.log('   - C code generation should work correctly');
  console.log('   - Standard C syntax should be supported');
  console.log('   - GCC compilation should work');
  console.log('   - Proper error handling for compilation');
}

// Run the test
testCCode().catch(console.error); 