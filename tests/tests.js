// Get Chai expect
const { expect } = chai;

// Test suite for SoundMachine
describe('SoundMachine', function() {
    let soundMachine;
    let audioContextStub;
    let oscillatorStub;
    let gainNodeStub;
    
    beforeEach(function() {
        // Stub Web Audio API
        oscillatorStub = {
            connect: sinon.stub(),
            frequency: {
                setValueAtTime: sinon.stub(),
                exponentialRampToValueAtTime: sinon.stub()
            },
            start: sinon.stub(),
            stop: sinon.stub(),
            onended: null
        };
        
        gainNodeStub = {
            connect: sinon.stub(),
            gain: {
                setValueAtTime: sinon.stub(),
                exponentialRampToValueAtTime: sinon.stub()
            }
        };
        
        audioContextStub = {
            createOscillator: sinon.stub().returns(oscillatorStub),
            createGain: sinon.stub().returns(gainNodeStub),
            destination: {},
            currentTime: 0,
            state: 'running',
            resume: sinon.stub()
        };
        
        // Mock Web Audio API
        global.AudioContext = sinon.stub().returns(audioContextStub);
        global.webkitAudioContext = sinon.stub().returns(audioContextStub);
        
        // Reset DOM
        document.body.innerHTML = document.getElementById('app').innerHTML;
        
        // Initialize SoundMachine
        soundMachine = new SoundMachine();
    });
    
    afterEach(function() {
        sinon.restore();
    });
    
    describe('Initialization', function() {
        it('should initialize with correct default values', function() {
            expect(soundMachine.audioContext).to.not.be.null;
            expect(soundMachine.currentVolume).to.equal(0.5);
            expect(soundMachine.playingSounds).to.be.instanceof(Set);
            expect(soundMachine.sounds).to.be.an('object');
        });
        
        it('should create all 16 sound functions', function() {
            const expectedSounds = [
                'claps', 'laugh', 'sad', 'xylophone',
                'rocket', 'kids', 'glass', 'coin',
                'drum', 'music', 'spiral', 'bulb',
                'whistle', 'ambulance', 'police', 'mystery'
            ];
            
            expectedSounds.forEach(sound => {
                expect(soundMachine.sounds[sound]).to.be.a('function');
            });
        });
    });
    
    describe('DOM Structure', function() {
        it('should have 16 sound tiles', function() {
            const tiles = document.querySelectorAll('.sound-tile');
            expect(tiles).to.have.length(16);
        });
        
        it('should have correct data-sound attributes', function() {
            const expectedSounds = [
                'claps', 'laugh', 'sad', 'xylophone',
                'rocket', 'kids', 'glass', 'coin',
                'drum', 'music', 'spiral', 'bulb',
                'whistle', 'ambulance', 'police', 'mystery'
            ];
            
            const tiles = document.querySelectorAll('.sound-tile');
            tiles.forEach((tile, index) => {
                expect(tile.dataset.sound).to.equal(expectedSounds[index]);
            });
        });
        
        it('should have correct emojis for each tile', function() {
            const expectedEmojis = [
                '👏', '😂', '😢', '🎵',
                '🚀', '👶', '🥂', '🪙',
                '🥁', '🎶', '🌀', '💡',
                '📢', '🚑', '🚓', '❓'
            ];
            
            const emojis = document.querySelectorAll('.sound-tile .emoji');
            emojis.forEach((emoji, index) => {
                expect(emoji.textContent).to.equal(expectedEmojis[index]);
            });
        });
        
        it('should have control buttons', function() {
            expect(document.getElementById('stopAll')).to.not.be.null;
            expect(document.getElementById('volumeUp')).to.not.be.null;
            expect(document.getElementById('volumeDown')).to.not.be.null;
        });
        
        it('should have correct CSS classes', function() {
            expect(document.querySelector('.container')).to.not.be.null;
            expect(document.querySelector('.sound-grid')).to.not.be.null;
            expect(document.querySelector('.controls')).to.not.be.null;
        });
    });
    
    describe('Sound Generation', function() {
        it('should create clap sound with correct parameters', function() {
            const sound = soundMachine.createClapSound();
            
            expect(audioContextStub.createOscillator).to.have.been.calledOnce;
            expect(audioContextStub.createGain).to.have.been.calledOnce;
            expect(oscillatorStub.connect).to.have.been.calledWith(gainNodeStub);
            expect(gainNodeStub.connect).to.have.been.calledWith(audioContextStub.destination);
        });
        
        it('should create laugh sound with correct parameters', function() {
            const sound = soundMachine.createLaughSound();
            
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(800, 0);
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(600, 0.1);
        });
        
        it('should create xylophone sound with musical notes', function() {
            const sound = soundMachine.createXylophoneSound();
            
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(523.25, 0); // C5
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(659.25, 0.1); // E5
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(783.99, 0.2); // G5
        });
        
        it('should create music sound with C major scale', function() {
            const sound = soundMachine.createMusicSound();
            
            const expectedNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
            expectedNotes.forEach((note, index) => {
                expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(note, index * 0.1);
            });
        });
        
        it('should create ambulance sound with alternating frequencies', function() {
            const sound = soundMachine.createAmbulanceSound();
            
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(800, 0);
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(600, 0.3);
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(800, 0.6);
            expect(oscillatorStub.frequency.setValueAtTime).to.have.been.calledWith(600, 0.9);
        });
    });
    
    describe('Event Handling', function() {
        it('should handle tile clicks', function() {
            const tile = document.querySelector('[data-sound="claps"]');
            const clickEvent = new Event('click');
            
            // Spy on playSound method
            const playSoundSpy = sinon.spy(soundMachine, 'playSound');
            
            tile.dispatchEvent(clickEvent);
            
            expect(playSoundSpy).to.have.been.calledWith(tile);
        });
        
        it('should handle stop all button click', function() {
            const stopButton = document.getElementById('stopAll');
            const clickEvent = new Event('click');
            
            // Spy on stopAllSounds method
            const stopAllSpy = sinon.spy(soundMachine, 'stopAllSounds');
            
            stopButton.dispatchEvent(clickEvent);
            
            expect(stopAllSpy).to.have.been.calledOnce;
        });
        
        it('should handle volume up button click', function() {
            const volumeUpButton = document.getElementById('volumeUp');
            const clickEvent = new Event('click');
            
            // Spy on adjustVolume method
            const adjustVolumeSpy = sinon.spy(soundMachine, 'adjustVolume');
            
            volumeUpButton.dispatchEvent(clickEvent);
            
            expect(adjustVolumeSpy).to.have.been.calledWith(0.1);
        });
        
        it('should handle volume down button click', function() {
            const volumeDownButton = document.getElementById('volumeDown');
            const clickEvent = new Event('click');
            
            // Spy on adjustVolume method
            const adjustVolumeSpy = sinon.spy(soundMachine, 'adjustVolume');
            
            volumeDownButton.dispatchEvent(clickEvent);
            
            expect(adjustVolumeSpy).to.have.been.calledWith(-0.1);
        });
    });
    
    describe('Keyboard Shortcuts', function() {
        it('should handle number keys for first row', function() {
            const keyMap = {
                '1': 'claps',
                '2': 'laugh', 
                '3': 'sad',
                '4': 'xylophone'
            };
            
            Object.entries(keyMap).forEach(([key, soundType]) => {
                const keyEvent = new KeyboardEvent('keydown', { key });
                const playSoundSpy = sinon.spy(soundMachine, 'playSound');
                
                document.dispatchEvent(keyEvent);
                
                const tile = document.querySelector(`[data-sound="${soundType}"]`);
                expect(playSoundSpy).to.have.been.calledWith(tile);
                
                playSoundSpy.restore();
            });
        });
        
        it('should handle Q-R keys for second row', function() {
            const keyMap = {
                'q': 'rocket',
                'w': 'kids',
                'e': 'glass',
                'r': 'coin'
            };
            
            Object.entries(keyMap).forEach(([key, soundType]) => {
                const keyEvent = new KeyboardEvent('keydown', { key });
                const playSoundSpy = sinon.spy(soundMachine, 'playSound');
                
                document.dispatchEvent(keyEvent);
                
                const tile = document.querySelector(`[data-sound="${soundType}"]`);
                expect(playSoundSpy).to.have.been.calledWith(tile);
                
                playSoundSpy.restore();
            });
        });
        
        it('should handle A-F keys for third row', function() {
            const keyMap = {
                'a': 'drum',
                's': 'music',
                'd': 'spiral',
                'f': 'bulb'
            };
            
            Object.entries(keyMap).forEach(([key, soundType]) => {
                const keyEvent = new KeyboardEvent('keydown', { key });
                const playSoundSpy = sinon.spy(soundMachine, 'playSound');
                
                document.dispatchEvent(keyEvent);
                
                const tile = document.querySelector(`[data-sound="${soundType}"]`);
                expect(playSoundSpy).to.have.been.calledWith(tile);
                
                playSoundSpy.restore();
            });
        });
        
        it('should handle Z-V keys for fourth row', function() {
            const keyMap = {
                'z': 'whistle',
                'x': 'ambulance',
                'c': 'police',
                'v': 'mystery'
            };
            
            Object.entries(keyMap).forEach(([key, soundType]) => {
                const keyEvent = new KeyboardEvent('keydown', { key });
                const playSoundSpy = sinon.spy(soundMachine, 'playSound');
                
                document.dispatchEvent(keyEvent);
                
                const tile = document.querySelector(`[data-sound="${soundType}"]`);
                expect(playSoundSpy).to.have.been.calledWith(tile);
                
                playSoundSpy.restore();
            });
        });
        
        it('should handle spacebar to stop all sounds', function() {
            const keyEvent = new KeyboardEvent('keydown', { key: ' ' });
            const stopAllSpy = sinon.spy(soundMachine, 'stopAllSounds');
            
            document.dispatchEvent(keyEvent);
            
            expect(stopAllSpy).to.have.been.calledOnce;
        });
    });
    
    describe('Volume Control', function() {
        it('should increase volume correctly', function() {
            const initialVolume = soundMachine.currentVolume;
            soundMachine.adjustVolume(0.1);
            
            expect(soundMachine.currentVolume).to.equal(initialVolume + 0.1);
        });
        
        it('should decrease volume correctly', function() {
            const initialVolume = soundMachine.currentVolume;
            soundMachine.adjustVolume(-0.1);
            
            expect(soundMachine.currentVolume).to.equal(initialVolume - 0.1);
        });
        
        it('should not exceed maximum volume', function() {
            soundMachine.currentVolume = 1.0;
            soundMachine.adjustVolume(0.1);
            
            expect(soundMachine.currentVolume).to.equal(1.0);
        });
        
        it('should not go below minimum volume', function() {
            soundMachine.currentVolume = 0.0;
            soundMachine.adjustVolume(-0.1);
            
            expect(soundMachine.currentVolume).to.equal(0.0);
        });
    });
    
    describe('Sound Management', function() {
        it('should add sounds to playingSounds set', function() {
            const tile = document.querySelector('[data-sound="claps"]');
            soundMachine.playSound(tile);
            
            expect(soundMachine.playingSounds.size).to.be.greaterThan(0);
        });
        
        it('should remove sounds from playingSounds when ended', function() {
            const tile = document.querySelector('[data-sound="claps"]');
            soundMachine.playSound(tile);
            
            const sound = Array.from(soundMachine.playingSounds)[0];
            sound.onended();
            
            expect(soundMachine.playingSounds.has(sound)).to.be.false;
        });
        
        it('should stop all sounds correctly', function() {
            const tile1 = document.querySelector('[data-sound="claps"]');
            const tile2 = document.querySelector('[data-sound="laugh"]');
            
            soundMachine.playSound(tile1);
            soundMachine.playSound(tile2);
            
            expect(soundMachine.playingSounds.size).to.equal(2);
            
            soundMachine.stopAllSounds();
            
            expect(soundMachine.playingSounds.size).to.equal(0);
        });
        
        it('should add playing class to tiles', function() {
            const tile = document.querySelector('[data-sound="claps"]');
            soundMachine.playSound(tile);
            
            expect(tile.classList.contains('playing')).to.be.true;
        });
        
        it('should remove playing class after animation', function(done) {
            const tile = document.querySelector('[data-sound="claps"]');
            soundMachine.playSound(tile);
            
            setTimeout(() => {
                expect(tile.classList.contains('playing')).to.be.false;
                done();
            }, 700);
        });
    });
    
    describe('Audio Context Management', function() {
        it('should resume suspended audio context', function() {
            audioContextStub.state = 'suspended';
            const tile = document.querySelector('[data-sound="claps"]');
            
            soundMachine.playSound(tile);
            
            expect(audioContextStub.resume).to.have.been.calledOnce;
        });
        
        it('should create new audio context if none exists', function() {
            soundMachine.audioContext = null;
            const tile = document.querySelector('[data-sound="claps"]');
            
            soundMachine.playSound(tile);
            
            expect(soundMachine.audioContext).to.not.be.null;
        });
    });
    
    describe('Error Handling', function() {
        it('should handle Web Audio API not supported', function() {
            // Remove AudioContext from global scope
            const originalAudioContext = global.AudioContext;
            delete global.AudioContext;
            delete global.webkitAudioContext;
            
            // Should not throw error
            expect(() => new SoundMachine()).to.not.throw();
            
            // Restore
            global.AudioContext = originalAudioContext;
        });
        
        it('should handle sound stop errors gracefully', function() {
            const tile = document.querySelector('[data-sound="claps"]');
            soundMachine.playSound(tile);
            
            const sound = Array.from(soundMachine.playingSounds)[0];
            sound.stop = sinon.stub().throws(new Error('Sound already stopped'));
            
            // Should not throw error
            expect(() => soundMachine.stopAllSounds()).to.not.throw();
        });
    });
    
    describe('CSS Classes and Styling', function() {
        it('should have correct CSS classes for responsive design', function() {
            const container = document.querySelector('.container');
            const soundGrid = document.querySelector('.sound-grid');
            const controls = document.querySelector('.controls');
            
            expect(container).to.have.class('container');
            expect(soundGrid).to.have.class('sound-grid');
            expect(controls).to.have.class('controls');
        });
        
        it('should have correct button classes', function() {
            const buttons = document.querySelectorAll('.control-btn');
            expect(buttons).to.have.length(3);
            
            buttons.forEach(button => {
                expect(button).to.have.class('control-btn');
            });
        });
        
        it('should have correct tile structure', function() {
            const tiles = document.querySelectorAll('.sound-tile');
            
            tiles.forEach(tile => {
                expect(tile.querySelector('.emoji')).to.not.be.null;
                expect(tile.querySelector('.label')).to.not.be.null;
            });
        });
    });
}); 