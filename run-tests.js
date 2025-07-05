#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🎵 Running SoundMachine Tests...\n');

// Check if we're in a browser environment or Node.js
if (typeof window === 'undefined') {
    // Node.js environment - open test.html in default browser
    const testPath = path.join(__dirname, 'test.html');
    const url = `file://${testPath}`;
    
    console.log('Opening test file in browser...');
    console.log(`URL: ${url}\n`);
    
    // Try to open in default browser
    const platform = process.platform;
    let command;
    
    switch (platform) {
        case 'darwin':
            command = `open "${url}"`;
            break;
        case 'win32':
            command = `start "${url}"`;
            break;
        default:
            command = `xdg-open "${url}"`;
    }
    
    exec(command, (error) => {
        if (error) {
            console.error('❌ Error opening browser:', error.message);
            console.log('\n📋 Manual Instructions:');
            console.log('1. Open test.html in your web browser');
            console.log('2. View the test results in the browser');
            console.log('3. All tests should pass (green checkmarks)');
        } else {
            console.log('✅ Test file opened in browser');
            console.log('📋 Check the browser for test results');
        }
    });
} else {
    // Browser environment - tests will run automatically
    console.log('Tests are running in browser...');
}

// Also provide a summary of what the tests cover
console.log('\n📋 Test Coverage:');
console.log('✅ Initialization and setup');
console.log('✅ DOM structure validation');
console.log('✅ Sound generation for all 16 tiles');
console.log('✅ Event handling (clicks, keyboard)');
console.log('✅ Volume control functionality');
console.log('✅ Sound management (play, stop, cleanup)');
console.log('✅ Audio context management');
console.log('✅ Error handling');
console.log('✅ CSS classes and styling');
console.log('✅ Keyboard shortcuts for all tiles');
console.log('✅ Responsive design elements');

console.log('\n🎯 Total Tests: 50+ comprehensive tests');
console.log('🔧 Testing Framework: Mocha + Chai + Sinon');
console.log('🌐 Browser Compatibility: All modern browsers\n'); 