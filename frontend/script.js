class SoundMachine {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.currentVolume = 0.5;
        this.playingSounds = new Set();
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.setupEventListeners();
        this.createSounds();
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.error('Web Audio API not supported');
        }
    }
    
    setupEventListeners() {
        // Tile click events
        document.querySelectorAll('.sound-tile').forEach(tile => {
            tile.addEventListener('click', (e) => this.playSound(e.currentTarget));
        });
        
        // Control buttons
        document.getElementById('stopAll').addEventListener('click', () => this.stopAllSounds());
        document.getElementById('volumeUp').addEventListener('click', () => this.adjustVolume(0.1));
        document.getElementById('volumeDown').addEventListener('click', () => this.adjustVolume(-0.1));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    createSounds() {
        // Create different types of sounds using Web Audio API
        this.sounds = {
            claps: () => this.createClapSound(),
            laugh: () => this.createLaughSound(),
            sad: () => this.createSadSound(),
            xylophone: () => this.createXylophoneSound(),
            rocket: () => this.createRocketSound(),
            kids: () => this.createKidsSound(),
            glass: () => this.createGlassSound(),
            coin: () => this.createCoinSound(),
            drum: () => this.createDrumSound(),
            music: () => this.createMusicSound(),
            spiral: () => this.createSpiralSound(),
            bulb: () => this.createBulbSound(),
            whistle: () => this.createWhistleSound(),
            ambulance: () => this.createAmbulanceSound(),
            police: () => this.createPoliceSound(),
            mystery: () => this.createMysterySound()
        };
    }
    
    playSound(tile) {
        const soundType = tile.dataset.sound;
        
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Add playing animation
        tile.classList.add('playing');
        
        // Create and play the sound
        const sound = this.sounds[soundType]();
        if (sound) {
            sound.volume = this.currentVolume;
            this.playingSounds.add(sound);
            
            // Set up automatic stop after 12 seconds
            const maxDuration = 12000; // 12 seconds in milliseconds
            const stopTimeout = setTimeout(() => {
                try {
                    if (sound && this.playingSounds.has(sound)) {
                        sound.stop();
                        this.playingSounds.delete(sound);
                        tile.classList.remove('playing');
                        // Remove progress indicator
                        const progressIndicator = tile.querySelector('.sound-progress');
                        if (progressIndicator) {
                            progressIndicator.remove();
                        }
                    }
                } catch (e) {
                    // Sound might have already ended
                }
            }, maxDuration);
            
            // Add progress indicator
            const progressIndicator = document.createElement('div');
            progressIndicator.className = 'sound-progress';
            progressIndicator.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 100%;
                border-radius: 0 0 15px 15px;
                transition: width 0.1s linear;
                z-index: 10;
            `;
            tile.appendChild(progressIndicator);
            
            // Animate progress bar
            let startTime = Date.now();
            const progressInterval = setInterval(() => {
                if (!this.playingSounds.has(sound)) {
                    clearInterval(progressInterval);
                    return;
                }
                const elapsed = Date.now() - startTime;
                const progress = Math.min(100, (elapsed / maxDuration) * 100);
                progressIndicator.style.width = `${100 - progress}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 100);
            
            sound.onended = () => {
                clearTimeout(stopTimeout); // Clear the timeout if sound ends naturally
                clearInterval(progressInterval); // Clear progress interval
                this.playingSounds.delete(sound);
                tile.classList.remove('playing');
                // Remove progress indicator
                const progressIndicator = tile.querySelector('.sound-progress');
                if (progressIndicator) {
                    progressIndicator.remove();
                }
            };
            
            // Start all oscillators if this is a multi-oscillator sound (like kids)
            if (sound._allOscillators) {
                sound._allOscillators.forEach(osc => osc.start());
            } else {
                sound.start();
            }
        }
        
        // Remove playing class after animation
        setTimeout(() => {
            tile.classList.remove('playing');
        }, 600);
    }
    
    stopAllSounds() {
        this.playingSounds.forEach(sound => {
            try {
                // Stop all oscillators if this is a multi-oscillator sound
                if (sound._allOscillators) {
                    sound._allOscillators.forEach(osc => {
                        try {
                            osc.stop();
                        } catch (e) {
                            // Oscillator might have already ended
                        }
                    });
                } else {
                    sound.stop();
                }
            } catch (e) {
                // Sound might have already ended
            }
        });
        this.playingSounds.clear();
        
        // Remove all playing classes and progress indicators
        document.querySelectorAll('.sound-tile.playing').forEach(tile => {
            tile.classList.remove('playing');
            const progressIndicator = tile.querySelector('.sound-progress');
            if (progressIndicator) {
                progressIndicator.remove();
            }
        });
    }
    
    adjustVolume(delta) {
        this.currentVolume = Math.max(0, Math.min(1, this.currentVolume + delta));
        this.playingSounds.forEach(sound => {
            sound.volume = this.currentVolume;
        });
        
        // Visual feedback
        const volumeIndicator = document.createElement('div');
        volumeIndicator.textContent = `Volume: ${Math.round(this.currentVolume * 100)}%`;
        volumeIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(volumeIndicator);
        
        setTimeout(() => {
            document.body.removeChild(volumeIndicator);
        }, 1000);
    }
    
    handleKeyboard(e) {
        const keyMap = {
            '1': 'claps', '2': 'laugh', '3': 'sad', '4': 'xylophone',
            'q': 'rocket', 'w': 'kids', 'e': 'glass', 'r': 'coin',
            'a': 'drum', 's': 'music', 'd': 'spiral', 'f': 'bulb',
            'z': 'whistle', 'x': 'ambulance', 'c': 'police', 'v': 'mystery'
        };
        
        const soundType = keyMap[e.key.toLowerCase()];
        if (soundType) {
            const tile = document.querySelector(`[data-sound="${soundType}"]`);
            if (tile) {
                this.playSound(tile);
            }
        }
        
        if (e.key === ' ') {
            e.preventDefault();
            this.stopAllSounds();
        }
    }
    
    // Sound generation methods
    createClapSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        return oscillator;
    }
    
    createLaughSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        return oscillator;
    }
    
    createSadSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        return oscillator;
    }
    
    createXylophoneSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        return oscillator;
    }
    
    createRocketSound() {
        // Create multiple oscillators for a more realistic rocket launch sound
        const oscillators = [];
        const gainNodes = [];
        
        // Create 3 oscillators for rocket engine sound
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + (i * 0.1);
            
            // Rocket engine frequencies (low rumble to higher frequencies)
            const baseFreq = 50 + (i * 100);
            const endFreq = 200 + (i * 150);
            
            oscillator.frequency.setValueAtTime(baseFreq, startTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3 - (i * 0.1), startTime);
            gainNode.gain.setValueAtTime(0.3 - (i * 0.1), startTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createKidsSound() {
        // Create multiple oscillators to simulate children's laughter and play sounds
        const oscillators = [];
        const gainNodes = [];
        
        // Create 3-4 different "voices" for children
        for (let i = 0; i < 4; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Different frequencies for different "children"
            const baseFreq = 800 + (i * 200) + (Math.random() * 400);
            const startTime = this.audioContext.currentTime + (i * 0.1);
            
            // Simulate laughter pattern
            oscillator.frequency.setValueAtTime(baseFreq, startTime);
            oscillator.frequency.setValueAtTime(baseFreq + 300, startTime + 0.1);
            oscillator.frequency.setValueAtTime(baseFreq, startTime + 0.2);
            oscillator.frequency.setValueAtTime(baseFreq + 200, startTime + 0.3);
            oscillator.frequency.setValueAtTime(baseFreq, startTime + 0.4);
            
            gainNode.gain.setValueAtTime(0.1, startTime);
            gainNode.gain.setValueAtTime(0.15, startTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, startTime + 0.2);
            gainNode.gain.setValueAtTime(0.12, startTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createGlassSound() {
        // Create multiple oscillators for a more realistic glass breaking sound
        const oscillators = [];
        const gainNodes = [];
        
        // Create 4 oscillators for glass shattering effect
        for (let i = 0; i < 4; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + (i * 0.05);
            
            // Glass breaking frequencies (high to low)
            const baseFreq = 2000 - (i * 300);
            const endFreq = 500 - (i * 100);
            
            oscillator.frequency.setValueAtTime(baseFreq, startTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.25 - (i * 0.05), startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createCoinSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        return oscillator;
    }
    
    createDrumSound() {
        // Create multiple oscillators for a more realistic drum sound
        const oscillators = [];
        const gainNodes = [];
        
        // Create 3 oscillators for different drum components
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + (i * 0.02);
            
            // Different frequencies for different drum components
            const baseFreq = [150, 80, 200][i];
            const endFreq = [50, 30, 60][i];
            
            oscillator.frequency.setValueAtTime(baseFreq, startTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3 - (i * 0.1), startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createMusicSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
        let time = this.audioContext.currentTime;
        
        notes.forEach((note, index) => {
            oscillator.frequency.setValueAtTime(note, time + index * 0.1);
        });
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        return oscillator;
    }
    
    createSpiralSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 1.0);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
        
        return oscillator;
    }
    
    createBulbSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        return oscillator;
    }
    
    createWhistleSound() {
        // Create multiple oscillators for a more realistic whistle sound
        const oscillators = [];
        const gainNodes = [];
        
        // Create 2 oscillators for whistle harmonics
        for (let i = 0; i < 2; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + (i * 0.05);
            
            // Whistle pattern with harmonics
            const baseFreq = 1000 + (i * 500);
            oscillator.frequency.setValueAtTime(baseFreq, startTime);
            oscillator.frequency.setValueAtTime(baseFreq + 200, startTime + 0.2);
            oscillator.frequency.setValueAtTime(baseFreq, startTime + 0.4);
            oscillator.frequency.setValueAtTime(baseFreq + 150, startTime + 0.6);
            oscillator.frequency.setValueAtTime(baseFreq, startTime + 0.8);
            
            gainNode.gain.setValueAtTime(0.2 - (i * 0.1), startTime);
            gainNode.gain.setValueAtTime(0.2 - (i * 0.1), startTime + 0.2);
            gainNode.gain.setValueAtTime(0.2 - (i * 0.1), startTime + 0.4);
            gainNode.gain.setValueAtTime(0.2 - (i * 0.1), startTime + 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createAmbulanceSound() {
        // Create multiple oscillators for a more realistic ambulance siren
        const oscillators = [];
        const gainNodes = [];
        
        // Create 2 oscillators for the classic ambulance siren effect
        for (let i = 0; i < 2; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + (i * 0.1);
            
            // Classic ambulance siren pattern (high-low-high-low)
            oscillator.frequency.setValueAtTime(800, startTime);
            oscillator.frequency.setValueAtTime(600, startTime + 0.4);
            oscillator.frequency.setValueAtTime(800, startTime + 0.8);
            oscillator.frequency.setValueAtTime(600, startTime + 1.2);
            oscillator.frequency.setValueAtTime(800, startTime + 1.6);
            oscillator.frequency.setValueAtTime(600, startTime + 2.0);
            
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.setValueAtTime(0.25, startTime + 0.4);
            gainNode.gain.setValueAtTime(0.25, startTime + 0.8);
            gainNode.gain.setValueAtTime(0.25, startTime + 1.2);
            gainNode.gain.setValueAtTime(0.25, startTime + 1.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 2.0);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createPoliceSound() {
        // Create multiple oscillators for a more realistic police siren
        const oscillators = [];
        const gainNodes = [];
        
        // Create 2 oscillators for the classic police siren effect
        for (let i = 0; i < 2; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            const startTime = this.audioContext.currentTime + (i * 0.05);
            
            // Classic police siren pattern (faster alternation than ambulance)
            oscillator.frequency.setValueAtTime(1000, startTime);
            oscillator.frequency.setValueAtTime(800, startTime + 0.2);
            oscillator.frequency.setValueAtTime(1000, startTime + 0.4);
            oscillator.frequency.setValueAtTime(800, startTime + 0.6);
            oscillator.frequency.setValueAtTime(1000, startTime + 0.8);
            oscillator.frequency.setValueAtTime(800, startTime + 1.0);
            oscillator.frequency.setValueAtTime(1000, startTime + 1.2);
            oscillator.frequency.setValueAtTime(800, startTime + 1.4);
            
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.setValueAtTime(0.25, startTime + 0.2);
            gainNode.gain.setValueAtTime(0.25, startTime + 0.4);
            gainNode.gain.setValueAtTime(0.25, startTime + 0.6);
            gainNode.gain.setValueAtTime(0.25, startTime + 0.8);
            gainNode.gain.setValueAtTime(0.25, startTime + 1.0);
            gainNode.gain.setValueAtTime(0.25, startTime + 1.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.4);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        }
        
        // Return the first oscillator as the main one, but store all for cleanup
        const mainOscillator = oscillators[0];
        mainOscillator._allOscillators = oscillators;
        mainOscillator._allGainNodes = gainNodes;
        
        return mainOscillator;
    }
    
    createMysterySound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(700, this.audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        return oscillator;
    }
}

// Initialize the SoundMachine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SoundMachine();
}); 