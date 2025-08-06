// Test language detection logic
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

// Test cases
const testCases = [
  {
    name: "Arduino C++",
    code: `#include <Arduino.h>

void setup() {
  Serial.begin(9600);
  Serial.println("Hello from Arduino!");
}

void loop() {
  Serial.println("Running...");
  delay(1000);
}`,
    expected: "cpp"
  },
  {
    name: "Standard C",
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
  printf("Hello from C!\n");
  return 0;
}`,
    expected: "c"
  },
  {
    name: "Python",
    code: `import time

def setup():
    print("Setup")

def loop():
    print("Running...")
    time.sleep(1)

if __name__ == "__main__":
    setup()
    while True:
        loop()`,
    expected: "python"
  },
  {
    name: "JavaScript",
    code: `function setup() {
  console.log("Setup");
}

function loop() {
  console.log("Running...");
}

setup();
loop();`,
    expected: "javascript"
  },
  {
    name: "C with printf",
    code: `void main() {
  printf("Hello World");
  return 0;
}`,
    expected: "c"
  }
];

// Run tests
console.log("🧪 Testing Language Detection...\n");

testCases.forEach((testCase, index) => {
  const detected = detectLanguageFromCode(testCase.code);
  const passed = detected === testCase.expected;
  
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Expected: ${testCase.expected}, Detected: ${detected}`);
  console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('---');
});

console.log("🎯 Language detection test completed!"); 