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
            
            sound.onended = () => {
                this.playingSounds.delete(sound);
                tile.classList.remove('playing');
            };
            
            sound.start();
        }
        
        // Remove playing class after animation
        setTimeout(() => {
            tile.classList.remove('playing');
        }, 600);
    }
    
    stopAllSounds() {
        this.playingSounds.forEach(sound => {
            try {
                sound.stop();
            } catch (e) {
                // Sound might have already ended
            }
        });
        this.playingSounds.clear();
        
        // Remove all playing classes
        document.querySelectorAll('.sound-tile.playing').forEach(tile => {
            tile.classList.remove('playing');
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
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        return oscillator;
    }
    
    createKidsSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        return oscillator;
    }
    
    createGlassSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        return oscillator;
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
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        return oscillator;
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
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        return oscillator;
    }
    
    createAmbulanceSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.6);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.9);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
        
        return oscillator;
    }
    
    createPoliceSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.4);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        return oscillator;
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