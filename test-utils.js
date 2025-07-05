// Test utilities for SoundMachine
class TestUtils {
    constructor() {
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            duration: 0
        };
    }
    
    // Helper to create mock audio context
    createMockAudioContext() {
        const oscillatorStub = {
            connect: sinon.stub(),
            frequency: {
                setValueAtTime: sinon.stub(),
                exponentialRampToValueAtTime: sinon.stub()
            },
            start: sinon.stub(),
            stop: sinon.stub(),
            onended: null
        };
        
        const gainNodeStub = {
            connect: sinon.stub(),
            gain: {
                setValueAtTime: sinon.stub(),
                exponentialRampToValueAtTime: sinon.stub()
            }
        };
        
        return {
            createOscillator: sinon.stub().returns(oscillatorStub),
            createGain: sinon.stub().returns(gainNodeStub),
            destination: {},
            currentTime: 0,
            state: 'running',
            resume: sinon.stub()
        };
    }
    
    // Helper to create test tile
    createTestTile(soundType, emoji, label) {
        const tile = document.createElement('div');
        tile.className = 'sound-tile';
        tile.dataset.sound = soundType;
        
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'emoji';
        emojiSpan.textContent = emoji;
        
        const labelSpan = document.createElement('span');
        labelSpan.className = 'label';
        labelSpan.textContent = label;
        
        tile.appendChild(emojiSpan);
        tile.appendChild(labelSpan);
        
        return tile;
    }
    
    // Helper to create test DOM structure
    createTestDOM() {
        const container = document.createElement('div');
        container.className = 'container';
        
        const soundGrid = document.createElement('div');
        soundGrid.className = 'sound-grid';
        
        const controls = document.createElement('div');
        controls.className = 'controls';
        
        // Add control buttons
        const stopButton = document.createElement('button');
        stopButton.id = 'stopAll';
        stopButton.className = 'control-btn';
        stopButton.textContent = '🔇 Stop All';
        
        const volumeUpButton = document.createElement('button');
        volumeUpButton.id = 'volumeUp';
        volumeUpButton.className = 'control-btn';
        volumeUpButton.textContent = '🔊 Volume Up';
        
        const volumeDownButton = document.createElement('button');
        volumeDownButton.id = 'volumeDown';
        volumeDownButton.className = 'control-btn';
        volumeDownButton.textContent = '🔉 Volume Down';
        
        controls.appendChild(stopButton);
        controls.appendChild(volumeUpButton);
        controls.appendChild(volumeDownButton);
        
        container.appendChild(soundGrid);
        container.appendChild(controls);
        
        return { container, soundGrid, controls };
    }
    
    // Helper to simulate click event
    simulateClick(element) {
        const clickEvent = new Event('click', {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(clickEvent);
        return clickEvent;
    }
    
    // Helper to simulate keyboard event
    simulateKeyPress(key) {
        const keyEvent = new KeyboardEvent('keydown', {
            key: key,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyEvent);
        return keyEvent;
    }
    
    // Helper to wait for async operations
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Helper to check if element has class
    hasClass(element, className) {
        return element.classList.contains(className);
    }
    
    // Helper to get element by data attribute
    getElementByData(dataAttr, value) {
        return document.querySelector(`[${dataAttr}="${value}"]`);
    }
    
    // Helper to count elements
    countElements(selector) {
        return document.querySelectorAll(selector).length;
    }
    
    // Helper to validate sound object
    validateSoundObject(sound) {
        return sound && 
               typeof sound === 'object' && 
               typeof sound.start === 'function' &&
               typeof sound.stop === 'function';
    }
    
    // Helper to validate audio context
    validateAudioContext(audioContext) {
        return audioContext && 
               typeof audioContext.createOscillator === 'function' &&
               typeof audioContext.createGain === 'function';
    }
    
    // Helper to test volume bounds
    testVolumeBounds(soundMachine, minVolume = 0, maxVolume = 1) {
        // Test minimum volume
        soundMachine.currentVolume = minVolume;
        soundMachine.adjustVolume(-0.1);
        expect(soundMachine.currentVolume).to.equal(minVolume);
        
        // Test maximum volume
        soundMachine.currentVolume = maxVolume;
        soundMachine.adjustVolume(0.1);
        expect(soundMachine.currentVolume).to.equal(maxVolume);
    }
    
    // Helper to test all keyboard shortcuts
    testAllKeyboardShortcuts(soundMachine) {
        const keyMap = {
            '1': 'claps', '2': 'laugh', '3': 'sad', '4': 'xylophone',
            'q': 'rocket', 'w': 'kids', 'e': 'glass', 'r': 'coin',
            'a': 'drum', 's': 'music', 'd': 'spiral', 'f': 'bulb',
            'z': 'whistle', 'x': 'ambulance', 'c': 'police', 'v': 'mystery'
        };
        
        Object.entries(keyMap).forEach(([key, soundType]) => {
            const playSoundSpy = sinon.spy(soundMachine, 'playSound');
            this.simulateKeyPress(key);
            
            // Find the corresponding tile
            const tile = this.getElementByData('data-sound', soundType);
            if (tile) {
                expect(playSoundSpy).to.have.been.calledWith(tile);
            }
            
            playSoundSpy.restore();
        });
    }
    
    // Helper to test all sound generation methods
    testAllSoundMethods(soundMachine) {
        const expectedSounds = [
            'claps', 'laugh', 'sad', 'xylophone',
            'rocket', 'kids', 'glass', 'coin',
            'drum', 'music', 'spiral', 'bulb',
            'whistle', 'ambulance', 'police', 'mystery'
        ];
        
        expectedSounds.forEach(soundType => {
            const soundMethod = soundMachine.sounds[soundType];
            expect(soundMethod).to.be.a('function');
            
            // Test that the method returns a valid sound object
            const sound = soundMethod();
            expect(this.validateSoundObject(sound)).to.be.true;
        });
    }
    
    // Helper to test responsive design
    testResponsiveDesign() {
        const container = document.querySelector('.container');
        const soundGrid = document.querySelector('.sound-grid');
        const controls = document.querySelector('.controls');
        
        expect(container).to.have.class('container');
        expect(soundGrid).to.have.class('sound-grid');
        expect(controls).to.have.class('controls');
        
        // Test that grid has correct number of tiles
        const tiles = document.querySelectorAll('.sound-tile');
        expect(tiles).to.have.length(16);
        
        // Test that each tile has required elements
        tiles.forEach(tile => {
            expect(tile.querySelector('.emoji')).to.not.be.null;
            expect(tile.querySelector('.label')).to.not.be.null;
            expect(tile.dataset.sound).to.not.be.undefined;
        });
    }
    
    // Helper to generate test report
    generateTestReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalTests: this.testResults.total,
            passedTests: this.testResults.passed,
            failedTests: this.testResults.failed,
            successRate: this.testResults.total > 0 ? 
                (this.testResults.passed / this.testResults.total * 100).toFixed(2) : 0,
            duration: this.testResults.duration
        };
        
        return report;
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestUtils;
} else {
    window.TestUtils = TestUtils;
} 