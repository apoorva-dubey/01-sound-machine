# 🎵 SoundMachine

[![GitHub stars](https://img.shields.io/github/stars/apoorva-dubey/01-sound-machine?style=social)](https://github.com/apoorva-dubey/01-sound-machine/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/apoorva-dubey/01-sound-machine?style=social)](https://github.com/apoorva-dubey/01-sound-machine/network)
[![GitHub issues](https://img.shields.io/github/issues/apoorva-dubey/01-sound-machine)](https://github.com/apoorva-dubey/01-sound-machine/issues)
[![GitHub license](https://img.shields.io/github/license/apoorva-dubey/01-sound-machine)](https://github.com/apoorva-dubey/01-sound-machine/blob/main/LICENSE)
[![Tests](https://img.shields.io/badge/tests-50%2B%20passing-brightgreen)](https://apoorva-dubey.github.io/01-sound-machine/test.html)

A fun and interactive single-page application that lets you create music and sounds by clicking on tiles! Each tile has a unique emoji and plays a corresponding sound when clicked.

## Features

- **16 Interactive Tiles**: Click any tile to play its unique sound
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Volume Controls**: Adjust volume up/down or stop all sounds
- **Keyboard Shortcuts**: Use your keyboard to trigger sounds
- **Beautiful Animations**: Visual feedback when tiles are clicked
- **Modern UI**: Clean, gradient-based design with smooth animations

## Sound Layout

### Row 1
- 👏 **Claps** - Clapping sound
- 😂 **Laugh** - Laughter sound
- 😢 **Sad** - Sad/melancholy sound
- 🎵 **Xylophone** - Musical xylophone notes

### Row 2
- 🚀 **Rocket** - Rocket explosion sound
- 👶 **Kids** - Children laughing
- 🥂 **Glass** - Glass breaking sound
- 🪙 **Coin** - Coin dropping sound

### Row 3
- 🥁 **Drum** - Drum roll sound
- 🎶 **Music** - Musical scale
- 🌀 **Spiral** - Spiral falling sound
- 💡 **Bulb** - Light bulb sound

### Row 4
- 📢 **Whistle** - Whistle sound
- 🚑 **Ambulance** - Ambulance siren
- 🚓 **Police** - Police siren
- ❓ **Mystery** - Mysterious sound

## How to Use

### Mouse/Touch
1. Simply click or tap any tile to play its sound
2. Use the control buttons at the bottom:
   - 🔇 **Stop All**: Stops all currently playing sounds
   - 🔊 **Volume Up**: Increases volume
   - 🔉 **Volume Down**: Decreases volume

### Keyboard Shortcuts
- **Row 1**: `1`, `2`, `3`, `4`
- **Row 2**: `Q`, `W`, `E`, `R`
- **Row 3**: `A`, `S`, `D`, `F`
- **Row 4**: `Z`, `X`, `C`, `V`
- **Spacebar**: Stop all sounds

## Technical Details

- **Pure JavaScript**: No external dependencies
- **Web Audio API**: Generates sounds programmatically
- **CSS Grid**: Responsive 4x4 layout
- **Modern CSS**: Gradients, animations, and glassmorphism effects
- **Mobile-First**: Responsive design that works on all devices

## Getting Started

1. Open `index.html` in a modern web browser
2. Click on any tile to start making music!
3. Experiment with different combinations of sounds
4. Use keyboard shortcuts for faster interaction

## Testing

The project includes comprehensive tests to ensure all functionality works correctly:

### Running Tests
```bash
# Open test file in browser
npm test

# Run test runner script
npm run test:run

# Or manually open test.html in your browser
```

### Test Coverage
- ✅ Initialization and setup
- ✅ DOM structure validation  
- ✅ Sound generation for all 16 tiles
- ✅ Event handling (clicks, keyboard)
- ✅ Volume control functionality
- ✅ Sound management (play, stop, cleanup)
- ✅ Audio context management
- ✅ Error handling
- ✅ CSS classes and styling
- ✅ Keyboard shortcuts for all tiles
- ✅ Responsive design elements

**Total Tests**: 50+ comprehensive tests using Mocha + Chai + Sinon

## 🚀 Quick Start

### Live Demo
🎵 **[Try SoundMachine Live](https://apoorva-dubey.github.io/01-sound-machine/)**

### Prerequisites
- Node.js (version 14 or higher)
- Modern web browser with Web Audio API support

### Setup
```bash
# Clone the repository
git clone https://github.com/apoorva-dubey/01-sound-machine.git
cd 01-sound-machine

# Install dependencies (optional)
npm install

# Start development server
npm run dev
# or
npm run serve
```

### Available Scripts
- `npm start` - Open the main application
- `npm test` - Run tests in browser
- `npm run test:run` - Run test runner script
- `npm run dev` - Start development server with Python
- `npm run serve` - Start development server with http-server

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Requires a modern browser that supports the Web Audio API.

## File Structure

```
SoundMachine/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── test.html           # Test runner HTML file
├── tests.js            # Comprehensive test suite
├── run-tests.js        # Test runner script
├── package.json        # Project configuration
├── README.md           # This file
└── assets/             # Asset directory
```

## Customization

You can easily customize the sounds by modifying the sound generation methods in `script.js`. Each sound is created using the Web Audio API with different frequencies, timing, and effects.

## License

This project is open source and available under the MIT License.

---

Enjoy making music with SoundMachine! 🎵✨ 