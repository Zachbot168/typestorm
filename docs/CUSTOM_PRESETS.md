# Creating Custom Presets

A comprehensive guide to developing custom animation presets for TypeStorm.

## Table of Contents

1. [Preset Basics](#preset-basics)
2. [Preset Structure](#preset-structure)
3. [Animation System](#animation-system)
4. [Particle Effects](#particle-effects)
5. [Post-Processing](#post-processing)
6. [Testing Your Preset](#testing-your-preset)
7. [Advanced Techniques](#advanced-techniques)
8. [Best Practices](#best-practices)

## Preset Basics

A preset in TypeStorm defines how text should be styled and animated. Each preset contains:

- **Visual styles**: Typography, colors, shadows, filters
- **Animations**: GSAP-based timeline animations
- **Particle system**: Optional particle effects
- **Post-processing**: Visual enhancement effects

### Getting Started

Create a new preset file in `src/presets/`:

```typescript
// src/presets/myPreset.ts
import { Preset } from '../core/types';

export const myPreset: Preset = {
  name: 'my-preset',
  description: 'My awesome animation effect',
  styles: {
    // Visual styling
  },
  animations: {
    // Animation configurations
  },
  particles: {
    // Particle system (optional)
  },
  postProcessing: {
    // Post-processing effects (optional)
  }
};
```

## Preset Structure

### Required Properties

#### name
Unique identifier for your preset.

```typescript
name: 'crystal-glow' // kebab-case recommended
```

#### description
Brief description of the effect.

```typescript
description: 'Crystalline text with glowing particles'
```

#### styles
Visual appearance of the text.

```typescript
styles: {
  fontSize: 64,                    // Font size in pixels
  fontWeight: 'bold',             // Font weight
  fontFamily: 'Inter Variable',   // Font family
  color: '#00ffff',              // Text color
  textShadow: '0 0 30px #00ffff', // CSS text shadow
  background: '#000012',          // Scene background
  
  // Variable font settings (if using variable fonts)
  fontVariationSettings: '"wght" 700, "wdth" 100',
  
  // CSS filters
  filter: 'brightness(1.2) contrast(1.1)'
}
```

#### animations
Animation configurations using GSAP.

```typescript
animations: {
  entrance: {
    duration: 2000,      // Duration in milliseconds
    ease: 'power2.out',  // GSAP easing function
    stagger: 0.1,        // Delay between characters
    keyframes: [
      { opacity: 0, scale: 0, rotationY: 180 },
      { opacity: 1, scale: 1, rotationY: 0 }
    ]
  },
  
  idle: {
    duration: 4000,
    ease: 'sine.inOut',
    repeat: -1,          // Infinite repeat
    yoyo: true,          // Reverse on repeat
    keyframes: [
      { textShadow: '0 0 30px #00ffff' },
      { textShadow: '0 0 60px #00ffff, 0 0 90px #0088ff' }
    ]
  }
}
```

### Optional Properties

#### particles
Particle system configuration.

```typescript
particles: {
  enabled: true,
  count: 150,
  color: ['#00ffff', '#0088ff', '#ffffff'],
  size: { min: 1, max: 3 },
  velocity: { min: 0.2, max: 1.5 },
  life: { min: 3000, max: 6000 },
  gravity: { x: 0, y: -0.05 },
  physics: {
    collision: false,
    bounce: 0.9,
    friction: 0.98
  }
}
```

#### postProcessing
Visual enhancement effects.

```typescript
postProcessing: {
  bloom: {
    enabled: true,
    strength: 2.0,
    radius: 0.5,
    threshold: 0.8
  },
  
  colorGrading: {
    enabled: true,
    contrast: 1.3,
    brightness: 1.1,
    saturation: 1.4,
    hue: 0.02
  },
  
  distortion: {
    enabled: true,
    type: 'wave',
    strength: 0.1,
    frequency: 0.5
  }
}
```

## Animation System

TypeStorm uses GSAP for animations. Each animation in the `animations` object represents a phase of the text lifecycle.

### Common Animation Phases

#### entrance
Initial animation when text appears.

```typescript
entrance: {
  duration: 1500,
  ease: 'back.out(1.7)',
  stagger: 0.08,
  keyframes: [
    { 
      opacity: 0, 
      scale: 0, 
      y: -100,
      rotation: -180 
    },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotation: 0 
    }
  ]
}
```

#### idle / loop
Continuous animation during display.

```typescript
idle: {
  duration: 3000,
  ease: 'power1.inOut',
  repeat: -1,
  yoyo: true,
  stagger: 0.1,
  keyframes: [
    { scale: 1, rotation: 0 },
    { scale: 1.05, rotation: 2 }
  ]
}
```

#### exit
Animation when text disappears.

```typescript
exit: {
  duration: 1000,
  ease: 'power2.in',
  stagger: 0.05,
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0, rotation: 90 }
  ]
}
```

### Advanced Animation Properties

#### stagger
Delay between character animations.

```typescript
stagger: 0.1              // Fixed delay
stagger: { amount: 1.5 }  // Total time spread
stagger: { each: 0.1, from: 'center' } // From center outward
```

#### repeat and yoyo
Control animation repetition.

```typescript
repeat: -1,     // Infinite
repeat: 3,      // Repeat 3 times
yoyo: true,     // Reverse on repeat
repeatDelay: 0.5 // Delay between repeats
```

#### Custom Properties
Animate any CSS property or custom values.

```typescript
keyframes: [
  { 
    '--glow-intensity': 0,
    '--particle-density': 0.5,
    filter: 'blur(10px) brightness(0.5)'
  },
  { 
    '--glow-intensity': 1,
    '--particle-density': 1,
    filter: 'blur(0px) brightness(1.2)'
  }
]
```

## Particle Effects

Particle systems add dynamic visual elements to your preset.

### Basic Particle Configuration

```typescript
particles: {
  enabled: true,
  count: 100,                    // Number of particles
  color: '#ff6600',             // Single color
  color: ['#ff6600', '#ffaa00'], // Multiple colors
  size: { min: 1, max: 4 },     // Size range
  velocity: { min: 0.5, max: 2.0 }, // Speed range
  life: { min: 2000, max: 5000 }    // Lifetime in ms
}
```

### Advanced Particle Physics

```typescript
particles: {
  // ... basic config
  
  gravity: { x: 0, y: -0.1 },    // Gravity force
  wind: { x: 0.05, y: 0 },       // Wind force
  
  physics: {
    collision: true,              // Enable collision detection
    bounce: 0.8,                  // Bounce coefficient
    friction: 0.95,               // Air friction
    attraction: {                 // Attract to text
      enabled: true,
      strength: 0.02,
      maxDistance: 100
    }
  },
  
  emission: {
    rate: 10,                     // Particles per second
    burst: {
      count: 50,                  // Burst particle count
      interval: 2000              // Burst interval
    }
  },
  
  shape: {
    type: 'circle',               // circle, square, triangle
    variance: 0.3                 // Shape variation
  }
}
```

### Particle Behaviors

```typescript
particles: {
  // ... config
  
  behaviors: [
    {
      type: 'orbit',
      radius: 50,
      speed: 0.02,
      direction: 'clockwise'
    },
    {
      type: 'swarm',
      cohesion: 0.1,
      separation: 0.2,
      alignment: 0.05
    },
    {
      type: 'flow-field',
      strength: 0.5,
      scale: 0.01,
      speed: 0.02
    }
  ]
}
```

## Post-Processing

Enhance the visual quality with post-processing effects.

### Bloom Effect

Creates a glowing halo around bright areas.

```typescript
postProcessing: {
  bloom: {
    enabled: true,
    strength: 1.5,      // Glow intensity
    radius: 0.4,        // Glow spread
    threshold: 0.85     // Brightness threshold
  }
}
```

### Color Grading

Adjust overall color and tone.

```typescript
postProcessing: {
  colorGrading: {
    enabled: true,
    contrast: 1.2,      // Contrast adjustment
    brightness: 1.1,    // Brightness adjustment
    saturation: 1.3,    // Color saturation
    hue: 0.02,          // Hue shift
    gamma: 1.0,         // Gamma correction
    
    // Color curves
    shadows: { r: 0.9, g: 0.95, b: 1.1 },
    midtones: { r: 1.0, g: 1.0, b: 1.0 },
    highlights: { r: 1.1, g: 1.05, b: 0.9 }
  }
}
```

### Distortion Effects

Add visual distortions and warping.

```typescript
postProcessing: {
  distortion: {
    enabled: true,
    type: 'wave',       // wave, noise, spiral
    strength: 0.1,      // Distortion intensity
    frequency: 0.5,     // Pattern frequency
    speed: 0.02,        // Animation speed
    
    // Type-specific options
    wave: {
      direction: 'horizontal', // horizontal, vertical, radial
      amplitude: 20,
      wavelength: 100
    }
  }
}
```

### Film Grain

Add analog film texture.

```typescript
postProcessing: {
  filmGrain: {
    enabled: true,
    intensity: 0.1,     // Grain strength
    size: 1.0,          // Grain size
    speed: 1.0          // Animation speed
  }
}
```

## Testing Your Preset

### 1. Create Test File

```typescript
// src/presets/__tests__/myPreset.test.ts
import { myPreset } from '../myPreset';
import { TextEngine } from '../../core/TextEngine';

describe('MyPreset', () => {
  let engine: TextEngine;
  let canvas: HTMLCanvasElement;
  
  beforeEach(() => {
    canvas = document.createElement('canvas');
    engine = new TextEngine({ canvas });
  });
  
  afterEach(() => {
    engine.dispose();
  });
  
  it('should apply preset successfully', async () => {
    const animation = await engine.applyPreset('TEST', 'my-preset');
    expect(animation.duration).toBeGreaterThan(0);
    expect(animation.characters.length).toBe(4);
  });
  
  it('should have required properties', () => {
    expect(myPreset.name).toBe('my-preset');
    expect(myPreset.description).toBeTruthy();
    expect(myPreset.styles).toBeDefined();
    expect(myPreset.animations).toBeDefined();
  });
});
```

### 2. Visual Testing

Create a demo page to test your preset:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Preset Test</title>
</head>
<body>
  <canvas id="canvas" width="1080" height="1920"></canvas>
  
  <script type="module">
    import { TextEngine } from './src/core/TextEngine.js';
    
    const canvas = document.getElementById('canvas');
    const engine = new TextEngine({ canvas });
    
    // Test your preset
    await engine.applyPreset('PREVIEW TEXT', 'my-preset');
    engine.play();
  </script>
</body>
</html>
```

### 3. Performance Testing

```typescript
// Performance benchmark
const startTime = performance.now();
await engine.applyPreset('PERFORMANCE TEST', 'my-preset');

const metrics = engine.getPerformanceMetrics();
console.log('FPS:', metrics.fps);
console.log('Memory:', metrics.memoryUsage);

// Should maintain 30+ FPS
expect(metrics.fps).toBeGreaterThan(30);
```

## Advanced Techniques

### Variable Font Animation

Animate variable font properties:

```typescript
animations: {
  fontMorph: {
    duration: 3000,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
    keyframes: [
      { 
        fontVariationSettings: '"wght" 300, "wdth" 75' 
      },
      { 
        fontVariationSettings: '"wght" 900, "wdth" 125' 
      }
    ]
  }
}
```

### Complex Stagger Patterns

Create sophisticated animation sequences:

```typescript
animations: {
  wave: {
    duration: 2000,
    ease: 'sine.inOut',
    stagger: {
      each: 0.1,
      from: 'center',
      grid: 'auto',
      axis: 'both'
    }
  },
  
  spiral: {
    duration: 3000,
    stagger: (index, target, list) => {
      // Custom stagger function
      const center = list.length / 2;
      const distance = Math.abs(index - center);
      return distance * 0.1;
    }
  }
}
```

### Custom CSS Properties

Use CSS custom properties for dynamic styling:

```typescript
styles: {
  // Define custom properties
  '--glow-color': '#00ffff',
  '--glow-intensity': '1',
  '--pulse-speed': '2s',
  
  // Use in other properties
  color: 'var(--glow-color)',
  textShadow: '0 0 calc(30px * var(--glow-intensity)) var(--glow-color)',
  animation: 'pulse var(--pulse-speed) infinite'
}
```

### Conditional Animations

Adapt animations based on context:

```typescript
// In your preset file
export const adaptivePreset: Preset = {
  // ... basic config
  
  getAnimations: (context) => {
    const baseAnimations = {
      entrance: { /* ... */ }
    };
    
    // Adapt based on text length
    if (context.text.length > 10) {
      baseAnimations.entrance.stagger = 0.05; // Faster for long text
    }
    
    // Adapt based on device performance
    if (context.performance.low) {
      baseAnimations.entrance.duration *= 0.5; // Shorter for low-end devices
    }
    
    return baseAnimations;
  }
};
```

## Best Practices

### Performance Optimization

1. **Limit particle count:**
```typescript
particles: {
  count: Math.min(100, window.innerWidth / 10) // Adaptive count
}
```

2. **Use efficient easing:**
```typescript
// Prefer power easing for better performance
ease: 'power2.out' // Good
ease: 'elastic.out' // More expensive
```

3. **Optimize animation properties:**
```typescript
// Prefer transform properties (GPU accelerated)
keyframes: [
  { transform: 'scale(1) rotate(0deg)' }, // Good
  { width: '100px', height: '50px' }      // Causes layout
]
```

### Accessibility

1. **Respect reduced motion:**
```typescript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable or reduce animations
  animations.entrance.duration *= 0.1;
  particles.enabled = false;
}
```

2. **Provide alternatives:**
```typescript
// Include static version
export const myPresetStatic: Preset = {
  ...myPreset,
  animations: {
    entrance: {
      duration: 100, // Very short
      keyframes: [{ opacity: 1 }] // Just fade in
    }
  },
  particles: { enabled: false }
};
```

### Code Organization

1. **Modular configuration:**
```typescript
// Separate configuration objects
const glowStyles = {
  color: '#00ffff',
  textShadow: '0 0 30px #00ffff'
};

const entranceAnimation = {
  duration: 2000,
  ease: 'back.out(1.7)',
  keyframes: [/* ... */]
};

export const myPreset: Preset = {
  name: 'my-preset',
  styles: { ...baseStyles, ...glowStyles },
  animations: { entrance: entranceAnimation }
};
```

2. **Shared utilities:**
```typescript
// src/presets/utils/animations.ts
export const commonAnimations = {
  fadeIn: {
    duration: 1000,
    keyframes: [
      { opacity: 0 },
      { opacity: 1 }
    ]
  },
  
  bounce: {
    duration: 1500,
    ease: 'bounce.out',
    keyframes: [
      { scale: 0 },
      { scale: 1 }
    ]
  }
};
```

### Testing Strategy

1. **Unit tests** for preset structure
2. **Integration tests** with TextEngine
3. **Performance tests** for FPS and memory
4. **Visual regression tests** for consistency
5. **Accessibility tests** for compliance

### Documentation

Document your preset thoroughly:

```typescript
/**
 * Crystal Glow Preset
 * 
 * Creates a crystalline text effect with:
 * - Prismatic color shifts
 * - Sparkling particle system  
 * - Smooth scaling animations
 * 
 * @example
 * ```typescript
 * await engine.applyPreset('CRYSTAL', 'crystal-glow', {
 *   layoutType: 'radial',
 *   layoutOptions: { radius: 200 }
 * });
 * ```
 * 
 * @performance
 * - Particle count: 150
 * - Target FPS: 60
 * - Memory usage: ~50MB
 * 
 * @accessibility
 * - Respects prefers-reduced-motion
 * - High contrast mode compatible
 * - Screen reader description provided
 */
export const crystalGlowPreset: Preset = {
  // ... implementation
};
```

---

With these techniques and best practices, you can create sophisticated, performant, and accessible animation presets for TypeStorm. Remember to test thoroughly and consider the user experience across different devices and accessibility needs.