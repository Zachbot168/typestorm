# Variable-Font Morph Preset Documentation

## Overview

The Variable-Font Morph (VF-Morph) preset is an advanced text animation system that leverages variable fonts to create smooth morphing effects between different typographic styles. This preset uses CSS `font-variation-settings` to dynamically transform font weight, width, optical size, and slant properties in real-time.

## Features

### 🎯 Core Capabilities
- **Dynamic Font Variation**: Smoothly tweens between font weights (100-900)
- **Multi-Axis Morphing**: Supports weight (wght), width (wdth), optical size (opsz), and slant (slnt)
- **Character-Level Animation**: Individual character staggering with customizable timing
- **Real-Time Measurement**: Text reflow handling to maintain layout stability
- **Performance Optimization**: GPU acceleration and transform3d support

### 🎨 Visual Effects
- **Elastic Bounce**: Configurable bounce effects during transitions
- **Color Morphing**: Synchronized color changes with font variations
- **Shadow Morphing**: Dynamic text-shadow effects
- **Scale Morphing**: Subtle scaling animations for enhanced visual impact
- **Particle System**: Optional Three.js particle effects

### ⚙️ Technical Implementation
- **FontVariationInterpolator**: Advanced interpolation system for smooth transitions
- **TextMorphMeasurement**: Real-time text measurement for reflow handling
- **Multiple Variation Axes**: Support for standard and extended font axes
- **Performance Monitoring**: Optimized for 60fps animations
- **Resource Management**: Proper cleanup and memory management

## Usage

### Basic Implementation

```typescript
import { vfMorphPreset } from './presets/vf-morph';
import { TextEngine } from './core/TextEngine';

const textEngine = new TextEngine({
  canvas: canvasElement,
  width: 800,
  height: 600,
  fps: 60,
  duration: 5000
});

// Apply the vf-morph preset
const animation = await textEngine.applyPreset('TYPESTORM', 'vf-morph', {
  layoutType: 'grid',
  layoutOptions: { columns: 3, rows: 3 }
});

// Play the animation
textEngine.play();
```

### Advanced Configuration

```typescript
import { 
  createCharacterMorphingTimeline, 
  MORPH_PRESETS,
  VFMorphOptions 
} from './presets/vf-morph';

// Custom morphing options
const customOptions: VFMorphOptions = {
  initialWeight: 200,
  targetWeight: 800,
  initialWidth: 85,
  targetWidth: 115,
  morphSpeed: 2500,
  characterStagger: 0.15,
  bounceIntensity: 0.4,
  colorMorphing: true,
  shadowMorphing: true,
  optimizeReflow: true,
  useTransform3d: true
};

// Create custom timeline
const timeline = createCharacterMorphingTimeline(characters, customOptions);
```

## Preset Variations

The VF-Morph preset includes several pre-configured variations:

### 1. Dramatic
```typescript
const dramatic = MORPH_PRESETS.dramatic;
// Features: Extreme weight change (100→900), wide width variation, high bounce
```

### 2. Subtle  
```typescript
const subtle = MORPH_PRESETS.subtle;
// Features: Gentle weight change (300→600), minimal width change, low bounce
```

### 3. Rhythmic
```typescript
const rhythmic = MORPH_PRESETS.rhythmic;
// Features: Fast morphing, high stagger, scale morphing enabled
```

### 4. Optical
```typescript
const optical = MORPH_PRESETS.optical;
// Features: Emphasizes optical size changes, reflow optimization enabled
```

### 5. Slanted
```typescript
const slanted = MORPH_PRESETS.slanted;
// Features: Slant axis morphing, scale effects, moderate bounce
```

## Font Axis Support

The preset supports all standard variable font axes:

| Axis | Description | Range | Default |
|------|-------------|-------|---------|
| wght | Weight | 100-900 | 400 |
| wdth | Width | 50-200 | 100 |
| opsz | Optical Size | 6-144 | 14 |
| slnt | Slant | -15-0 | 0 |
| ital | Italic | 0-1 | 0 |

### Extended Axes (For Specialized Fonts)
- **GRAD**: Grade (-200 to 150)
- **XTRA**: X-transparent (323 to 603)
- **XOPQ**: X-opaque (27 to 175)
- **YOPQ**: Y-opaque (25 to 135)
- **YTLC**: Y-transparent lowercase (416 to 570)
- **YTUC**: Y-transparent uppercase (528 to 760)

## Animation Configuration

### Keyframe Structure
```typescript
animations: {
  weightMorph: {
    duration: 3000,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.08, from: 'center' },
    keyframes: [
      { 
        fontVariationSettings: '"wght" 400, "wdth" 100, "opsz" 14, "slnt" 0',
        color: '#333333'
      },
      { 
        fontVariationSettings: '"wght" 700, "wdth" 115, "opsz" 32, "slnt" -3',
        color: '#1e293b'
      }
    ]
  }
}
```

### Stagger Options
- **from**: 'start', 'end', 'center', 'edges', 'random'
- **each**: Delay between characters (in seconds)
- **amount**: Total stagger duration

### Easing Functions
- **power2.inOut**: Smooth acceleration/deceleration
- **elastic.out**: Bouncy effect
- **back.inOut**: Overshooting animation
- **sine.inOut**: Smooth sine wave
- **bounce.out**: Natural bounce

## Performance Optimization

### GPU Acceleration
```typescript
// Enable transform3d for better performance
const options = {
  useTransform3d: true,
  optimizeReflow: true
};
```

### Memory Management
```typescript
// The preset automatically handles cleanup
const { timeline, effects, cleanup } = applyVFMorphPreset(scene, camera, renderer, characters);

// Manual cleanup when needed
cleanup();
```

### Performance Monitoring
```typescript
const metrics = textEngine.getPerformanceMetrics();
console.log(`FPS: ${metrics.fps}, Frame Time: ${metrics.frameTime}ms`);
```

## Font Requirements

### Recommended Fonts
1. **Inter Variable** (Default) - Comprehensive variable font with weight, width, and optical size
2. **Roboto Flex** - Google's flexible variable font
3. **Source Sans Variable** - Adobe's variable font family
4. **Recursive** - Highly expressive variable font

### Font Loading
```css
/* In your CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');

/* Variable font settings */
.variable-font {
  font-family: 'Inter Variable', system-ui, sans-serif;
  font-variation-settings: 'wght' 400, 'wdth' 100, 'opsz' 14;
}
```

## Browser Support

### Full Support
- Chrome 88+
- Firefox 86+
- Safari 14+
- Edge 88+

### Fallback Behavior
```css
/* Automatic fallback for non-variable font browsers */
@supports not (font-variation-settings: normal) {
  .vf-morph-text {
    font-weight: var(--fallback-weight, 400);
  }
}
```

## Three.js Integration

### Particle Effects
```typescript
const effects = createVFMorphThreeJSEffects(scene, {
  colorMorphing: true
});

// Particle system is automatically created and animated
```

### Lighting Setup
```typescript
// The preset works best with proper Three.js lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(ambientLight, directionalLight);
```

## Custom Font Axes

For fonts with custom axes:

```typescript
const customOptions: VFMorphOptions = {
  customAxes: {
    'GRAD': { initial: -50, target: 100 },
    'XTRA': { initial: 400, target: 500 }
  }
};
```

## Troubleshooting

### Common Issues

1. **Font Not Loading**
   - Ensure variable font is properly loaded
   - Check CORS headers for external fonts
   - Verify font-display: swap is set

2. **Performance Issues**
   - Enable GPU acceleration with useTransform3d
   - Reduce character stagger amount
   - Lower particle count

3. **Layout Jumping**
   - Enable optimizeReflow option
   - Use fixed-width container
   - Set appropriate line-height

### Debug Mode
```typescript
// Enable debug logging
const textEngine = new TextEngine({
  canvas: canvasElement,
  // ... other options
});

// Monitor performance
textEngine.setupPerformanceMonitoring();
```

## Examples

### Basic Grid Layout
```typescript
await textEngine.applyPreset('VARIABLE', 'vf-morph', {
  layoutType: 'grid',
  layoutOptions: { columns: 4, spacing: 60 }
});
```

### Spiral with Custom Morphing
```typescript
await textEngine.applyPreset('MORPH', 'vf-morph', {
  layoutType: 'spiral',
  layoutOptions: { radius: 150, turns: 2 },
  customAnimations: [{
    duration: 2000,
    ease: 'elastic.out(1, 0.5)',
    keyframes: [{ fontVariationSettings: '"wght" 900' }]
  }]
});
```

### Radial with Particles
```typescript
const preset = { ...vfMorphPreset };
preset.particles.enabled = true;
preset.particles.count = 100;

await textEngine.applyPreset('RADIAL', 'vf-morph', {
  layoutType: 'radial',
  layoutOptions: { radius: 200 }
});
```

## API Reference

### Classes

#### FontVariationInterpolator
- `setTarget(axis: string, value: number)`: Set target value for axis
- `setTargets(values: Record<string, number>)`: Set multiple targets
- `animateToTargets(duration: number, ease?: string)`: Start interpolation
- `getCurrentVariationString()`: Get current CSS font-variation-settings

#### TextMorphMeasurement
- `measureText(text, fontSettings, fontSize, fontFamily)`: Measure text dimensions
- `dispose()`: Clean up resources

### Functions

#### createCharacterMorphingTimeline(characters, options)
Creates GSAP timeline for character-level morphing

#### createVFMorphThreeJSEffects(scene, options)
Creates Three.js particle effects and lighting

#### applyVFMorphPreset(scene, camera, renderer, characters, presetName)
Applies complete VF-Morph preset with cleanup handling

### Constants

#### FONT_AXES
Mapping of font axis codes to human-readable names and ranges

#### MORPH_PRESETS
Pre-configured morphing presets for different effects

---

*Built with ❤️ for TypeStorm - The next-generation text animation engine*