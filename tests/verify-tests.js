#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying SoundMachine Test Setup...\n');

// Check if all required files exist
const requiredFiles = [
    'frontend/index.html',
    'frontend/styles.css', 
    'frontend/script.js',
    'tests/test.html',
    'tests/tests.js',
    'tests/test-utils.js',
    'package.json',
    'README.md'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

// Check test file content
console.log('\n📋 Checking test file content:');

// Check if test.html has proper Mocha setup
const testHtmlContent = fs.readFileSync('tests/test.html', 'utf8');
const hasMochaSetup = testHtmlContent.includes('mocha.setup') && 
                     testHtmlContent.includes('mocha.run');
console.log(`  ${hasMochaSetup ? '✅' : '❌'} test.html has Mocha configuration`);

// Check if tests.js has test suites
const testsJsContent = fs.readFileSync('tests/tests.js', 'utf8');
const hasTestSuites = testsJsContent.includes('describe(') && 
                     testsJsContent.includes('it(');
console.log(`  ${hasTestSuites ? '✅' : '❌'} tests.js has test suites`);

// Check if test-utils.js has utility functions
const testUtilsContent = fs.readFileSync('tests/test-utils.js', 'utf8');
const hasTestUtils = testUtilsContent.includes('class TestUtils') && 
                    testUtilsContent.includes('createMockAudioContext');
console.log(`  ${hasTestUtils ? '✅' : '❌'} test-utils.js has utility functions`);

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['start', 'test', 'test:run'];
requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
        console.log(`  ❌ ${script} script missing`);
        allFilesExist = false;
    }
});

// Check if main application files are properly structured
console.log('\n🎵 Checking main application files:');

// Check if index.html has proper structure
const indexHtmlContent = fs.readFileSync('frontend/index.html', 'utf8');
const hasSoundGrid = indexHtmlContent.includes('sound-grid') && 
                    indexHtmlContent.includes('sound-tile');
console.log(`  ${hasSoundGrid ? '✅' : '❌'} index.html has sound grid structure`);

// Check if script.js has SoundMachine class
const scriptJsContent = fs.readFileSync('frontend/script.js', 'utf8');
const hasSoundMachineClass = scriptJsContent.includes('class SoundMachine') && 
                            scriptJsContent.includes('constructor');
console.log(`  ${hasSoundMachineClass ? '✅' : '❌'} script.js has SoundMachine class`);

// Check if styles.css has responsive design
const stylesCssContent = fs.readFileSync('frontend/styles.css', 'utf8');
const hasResponsiveDesign = stylesCssContent.includes('@media') && 
                           stylesCssContent.includes('grid-template-columns');
console.log(`  ${hasResponsiveDesign ? '✅' : '❌'} styles.css has responsive design`);

// Summary
console.log('\n📊 Test Setup Summary:');
if (allFilesExist && hasMochaSetup && hasTestSuites && hasTestUtils && hasSoundGrid && hasSoundMachineClass && hasResponsiveDesign) {
    console.log('🎉 All checks passed! Test setup is complete and ready.');
    console.log('\n🚀 To run tests:');
    console.log('   npm test          # Open test file in browser');
    console.log('   npm run test:run  # Run test runner script');
    console.log('   npm start         # Open main application');
} else {
    console.log('❌ Some checks failed. Please review the issues above.');
    process.exit(1);
}

// Additional recommendations
console.log('\n💡 Recommendations:');
console.log('   - Open test.html in a modern browser to see detailed test results');
console.log('   - All tests should show green checkmarks when passing');
console.log('   - Check browser console for any JavaScript errors');
console.log('   - Ensure Web Audio API is supported in your browser');

console.log('\n✅ Test verification complete!\n'); 