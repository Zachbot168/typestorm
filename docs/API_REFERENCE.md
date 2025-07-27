# TypeStorm API Reference

Complete API documentation for developers integrating TypeStorm into their applications.

## Table of Contents

1. [TextEngine Class](#textengine-class)
2. [Presets System](#presets-system)
3. [Layouts System](#layouts-system)
4. [Video Export](#video-export)
5. [Performance Monitoring](#performance-monitoring)
6. [Accessibility](#accessibility)
7. [Type Definitions](#type-definitions)

## TextEngine Class

The core class that handles text rendering, animation, and video export.

### Constructor

```typescript
import { TextEngine } from '@typestorm/core';

const engine = new TextEngine(options: TextEngineOptions);
```

#### TextEngineOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `canvas` | `HTMLCanvasElement` | Required | Target canvas element |
| `width` | `number` | `1080` | Canvas width in pixels |
| `height` | `number` | `1920` | Canvas height in pixels |
| `fps` | `number` | `60` | Target frames per second |

### Core Methods

#### applyPreset()

Apply an animation preset to text with layout options.

```typescript
async applyPreset(
  text: string,
  presetName: string,
  options?: ApplyPresetOptions
): Promise<AnimationTimeline>
```

**Parameters:**
- `text`: The text to animate
- `presetName`: One of: `'neon'`, `'liquid'`, `'fire'`, `'glitch'`, `'vf-morph'`
- `options`: Optional configuration object

**ApplyPresetOptions:**

```typescript
interface ApplyPresetOptions {
  layoutType?: 'spiral' | 'radial' | 'grid';
  layoutOptions?: any;
  customAnimations?: AnimationConfig[];
  fontUrl?: string;
}
```

**Returns:** Promise resolving to AnimationTimeline object

**Example:**
```typescript
const animation = await engine.applyPreset('HELLO WORLD', 'neon', {
  layoutType: 'spiral',
  layoutOptions: { spacing: 80, centerX: 500, centerY: 400 },
  fontUrl: '/fonts/custom-font.woff2'
});
```

#### generateLayout()

Generate layout data for text arrangement.

```typescript
async generateLayout(
  text: string,
  layoutType: string,
  options?: any
): Promise<LayoutData>
```

**Example:**
```typescript
const layoutData = await engine.generateLayout('DEMO', 'radial', {
  radius: 200,
  startAngle: 0,
  angleStep: 45
});
```

### Playback Control

#### play()
Start animation playback.

```typescript
engine.play(): void
```

#### pause()
Pause animation playback.

```typescript
engine.pause(): void
```

#### stop()
Stop animation and reset to beginning.

```typescript
engine.stop(): void
```

#### restart()
Restart animation from the beginning.

```typescript
engine.restart(): void
```

#### seek()
Seek to specific time in animation.

```typescript
engine.seek(time: number): void
```

**Parameters:**
- `time`: Time in seconds to seek to

#### Playback Properties

```typescript
// Get current progress (0-1)
engine.getProgress(): number

// Get current time in seconds
engine.getCurrentTime(): number

// Get total duration in seconds
engine.getDuration(): number

// Set playback speed (1.0 = normal speed)
engine.setPlaybackRate(rate: number): void

// Get current playback speed
engine.getPlaybackRate(): number

// Check if currently playing
engine.isCurrentlyPlaying(): boolean
```

### Video Export

#### exportAnimation()

High-quality video export with progress tracking.

```typescript
async exportAnimation(
  options?: Partial<ExportOptions>,
  callbacks?: ExportCallbacks
): Promise<Blob>
```

**ExportOptions:**

```typescript
interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  duration: number;
  width: number;
  height: number;
  enableHardwareAcceleration: boolean;
  preserveTransparency: boolean;
  optimizeForMobile: boolean;
}
```

**ExportCallbacks:**

```typescript
interface ExportCallbacks {
  onProgress?: (progress: CaptureProgress) => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}
```

**Example:**
```typescript
const blob = await engine.exportAnimation({
  format: 'mp4',
  quality: 'high',
  fps: 30,
  duration: 5,
  optimizeForMobile: true
}, {
  onProgress: (progress) => {
    console.log(`Export progress: ${progress.percentage}%`);
  },
  onComplete: (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animation.mp4';
    a.click();
  },
  onError: (error) => {
    console.error('Export failed:', error);
  }
});
```

#### Platform-Specific Exports

Pre-configured export methods for popular platforms:

```typescript
// TikTok: 1080x1920, 30fps, mobile-optimized
await engine.exportForTikTok(callbacks?)

// Instagram Stories: 1080x1920, high quality
await engine.exportForInstagramStories(callbacks?)

// Twitter: 1200x675, web-optimized
await engine.exportForTwitter(callbacks?)

// Custom quality preset
await engine.exportWithQuality('ultra', callbacks?)
```

### Utility Methods

#### Engine Status

```typescript
// Check if engine is initialized and ready
engine.isReady(): boolean

// Get current preset information
engine.getCurrentPreset(): Preset | null

// Check WebGPU support
engine.isWebGPUSupported(): boolean
```

#### Canvas Management

```typescript
// Get canvas dimensions
engine.getCanvasDimensions(): { width: number; height: number }

// Resize canvas and update camera
engine.resize(width: number, height: number): void
```

#### Performance Monitoring

```typescript
// Get current performance metrics
engine.getPerformanceMetrics(): PerformanceMetrics

// Get comprehensive status report
engine.getStatusReport(): StatusReport
```

#### Accessibility

```typescript
// Get screen reader description
engine.getAnimationDescription(
  text: string, 
  preset: string, 
  layout: string
): string

// Validate accessibility compliance
engine.validateAccessibility(): AccessibilityValidation
```

#### Resource Management

```typescript
// Dispose all resources and cleanup
engine.dispose(): void
```

## Presets System

### Built-in Presets

TypeStorm includes 5 professional animation presets:

#### 1. Neon Preset
```typescript
import { neonPreset } from '@typestorm/presets';

// Features:
- Vibrant glowing effects
- Electric particle system
- Pulsing animations
- Color cycling
```

#### 2. Liquid Preset
```typescript
import { liquidPreset } from '@typestorm/presets';

// Features:
- Fluid morphing animations
- Wave distortions
- Gradient transitions
- Organic movement
```

#### 3. Fire Preset
```typescript
import { firePreset } from '@typestorm/presets';

// Features:
- Flame particle effects
- Heat distortion
- Flickering animations
- Ember trails
```

#### 4. Glitch Preset
```typescript
import { glitchPreset } from '@typestorm/presets';

// Features:
- Digital corruption effects
- RGB channel separation
- Data noise overlay
- Scan line distortions
```

#### 5. Variable Font Morph Preset
```typescript
import { vfMorphPreset } from '@typestorm/presets';

// Features:
- Variable font weight changes
- Width morphing
- Smooth transitions
- Typography-focused
```

### Custom Preset Development

Create your own animation presets:

```typescript
import { Preset } from '@typestorm/types';

export const customPreset: Preset = {
  name: 'custom',
  description: 'My custom animation effect',
  
  // Visual styles
  styles: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Inter Variable, Arial, sans-serif',
    color: '#ff6600',
    textShadow: '0 0 20px #ff6600',
    background: '#000000',
    
    // Variable font settings
    fontVariationSettings: '"wght" 400, "wdth" 100',
    
    // CSS filters
    filter: 'blur(0px) brightness(1)'
  },
  
  // Animation configurations
  animations: {
    entrance: {
      duration: 2000,
      ease: 'power2.out',
      stagger: 0.1,
      keyframes: [
        { opacity: 0, scale: 0, y: 50 },
        { opacity: 1, scale: 1, y: 0 }
      ]
    },
    
    loop: {
      duration: 3000,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      keyframes: [
        { scale: 1, rotation: 0 },
        { scale: 1.1, rotation: 5 }
      ]
    },
    
    exit: {
      duration: 1500,
      ease: 'power2.in',
      keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0 }
      ]
    }
  },
  
  // Particle system configuration
  particles: {
    enabled: true,
    count: 100,
    color: ['#ff6600', '#ffaa00', '#ffffff'],
    size: { min: 1, max: 4 },
    velocity: { min: 0.5, max: 2.0 },
    life: { min: 2000, max: 5000 },
    gravity: { x: 0, y: -0.1 },
    physics: {
      collision: false,
      bounce: 0.8,
      friction: 0.95
    }
  },
  
  // Post-processing effects
  postProcessing: {
    bloom: {
      enabled: true,
      strength: 1.5,
      radius: 0.4,
      threshold: 0.85
    },
    
    colorGrading: {
      enabled: true,
      contrast: 1.2,
      brightness: 1.1,
      saturation: 1.3
    }
  }
};
```

## Layouts System

### Built-in Layouts

#### 1. Spiral Layout
```typescript
import { spiralLayout } from '@typestorm/layouts';

// Options:
{
  centerX: number;        // Center X position
  centerY: number;        // Center Y position
  spacing: number;        // Distance between characters
  turns: number;          // Number of spiral turns
  direction: 'clockwise' | 'counterclockwise';
}
```

#### 2. Radial Layout
```typescript
import { radialLayout } from '@typestorm/layouts';

// Options:
{
  centerX: number;        // Center X position
  centerY: number;        // Center Y position
  radius: number;         // Circle radius
  startAngle: number;     // Starting angle in degrees
  angleStep: number;      // Angle between characters
}
```

#### 3. Grid Layout
```typescript
import { gridLayout } from '@typestorm/layouts';

// Options:
{
  cols: number;           // Number of columns
  rows: number;           // Number of rows
  cellWidth: number;      // Cell width
  cellHeight: number;     // Cell height
  offsetX: number;        // Grid offset X
  offsetY: number;        // Grid offset Y
}
```

### Custom Layout Development

```typescript
import { Layout } from '@typestorm/types';

export const waveLayout: Layout = {
  name: 'wave',
  description: 'Wave-like text arrangement',
  
  calculate: (text: string, options = {}) => {
    const chars = text.split('');
    const {
      amplitude = 50,
      frequency = 0.5,
      spacing = 40,
      offsetX = 100,
      offsetY = 300
    } = options;
    
    return chars.map((char, index) => ({
      char,
      x: offsetX + (index * spacing),
      y: offsetY + Math.sin(index * frequency) * amplitude,
      rotation: Math.sin(index * 0.3) * 10,
      scale: 1,
      opacity: 1
    }));
  },
  
  animations: {
    wave: {
      duration: 4000,
      ease: 'sine.inOut',
      repeat: -1,
      stagger: 0.2,
      keyframes: [
        { y: '+=20' },
        { y: '-=40' },
        { y: '+=20' }
      ]
    }
  }
};
```

## Type Definitions

### Core Types

```typescript
// Main configuration interface
interface TextEngineOptions {
  canvas: HTMLCanvasElement;
  width?: number;
  height?: number;
  fps?: number;
}

// Character position data
interface CharacterPosition {
  char: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

// Animation timeline result
interface AnimationTimeline {
  timeline: gsap.core.Timeline;
  duration: number;
  fps: number;
  characters: HTMLElement[];
}

// Layout calculation result
interface LayoutData {
  positions: CharacterPosition[];
  bounds: { width: number; height: number };
  metadata: Record<string, any>;
}

// Performance metrics
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  gpuMemory?: number;
}

// Export progress tracking
interface CaptureProgress {
  percentage: number;
  currentFrame: number;
  totalFrames: number;
  timeElapsed: number;
  timeRemaining: number;
}
```

### Preset Types

```typescript
interface Preset {
  name: string;
  description: string;
  styles: PresetStyles;
  animations: Record<string, AnimationConfig>;
  particles?: ParticleConfig;
  postProcessing?: PostProcessingConfig;
}

interface PresetStyles {
  fontSize: number;
  fontWeight: string | number;
  fontFamily?: string;
  color: string;
  textShadow?: string;
  background?: string;
  fontVariationSettings?: string;
  filter?: string;
}

interface AnimationConfig {
  duration: number;
  ease: string;
  repeat?: number;
  yoyo?: boolean;
  stagger?: number;
  repeatDelay?: number;
  keyframes: Record<string, any>[];
}

interface ParticleConfig {
  enabled: boolean;
  count: number;
  color: string | string[];
  size: { min: number; max: number };
  velocity?: { min: number; max: number };
  life?: { min: number; max: number };
  gravity?: { x: number; y: number };
  physics?: {
    collision: boolean;
    bounce: number;
    friction: number;
  };
}
```

### Layout Types

```typescript
interface Layout {
  name: string;
  description: string;
  calculate: (text: string, options?: any) => CharacterPosition[];
  animations?: Record<string, AnimationConfig>;
}
```

### Export Types

```typescript
interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  duration: number;
  width: number;
  height: number;
  enableHardwareAcceleration: boolean;
  preserveTransparency: boolean;
  optimizeForMobile: boolean;
}

interface RecordingOptions {
  format: 'mp4' | 'webm' | 'gif';
  duration: number;
  fps: number;
  quality: number;
}
```

## Error Handling

TypeStorm provides comprehensive error handling:

```typescript
try {
  const animation = await engine.applyPreset('TEXT', 'invalid-preset');
} catch (error) {
  if (error instanceof PresetNotFoundError) {
    console.error('Preset not found:', error.presetName);
  } else if (error instanceof FontLoadError) {
    console.error('Font loading failed:', error.fontUrl);
  } else {
    console.error('General error:', error.message);
  }
}
```

### Custom Error Types

```typescript
class PresetNotFoundError extends Error {
  constructor(public presetName: string) {
    super(`Preset '${presetName}' not found`);
  }
}

class FontLoadError extends Error {
  constructor(public fontUrl: string) {
    super(`Failed to load font: ${fontUrl}`);
  }
}

class ExportError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
  }
}
```

## Best Practices

### Performance Optimization

1. **Dispose resources properly:**
```typescript
// Always dispose when done
engine.dispose();
```

2. **Use appropriate quality settings:**
```typescript
// For preview/development
const blob = await engine.exportWithQuality('medium');

// For production
const blob = await engine.exportWithQuality('high');
```

3. **Monitor performance:**
```typescript
const metrics = engine.getPerformanceMetrics();
if (metrics.fps < 30) {
  console.warn('Performance degraded, consider reducing quality');
}
```

### Memory Management

1. **Limit animation duration for large exports:**
```typescript
// Avoid very long animations that consume memory
const maxDuration = 30; // seconds
```

2. **Use progressive enhancement:**
```typescript
// Check device capabilities
const capabilities = engine.getStatusReport();
const quality = capabilities.performance.canHandleHighQuality ? 'high' : 'medium';
```

### Accessibility

1. **Always provide descriptions:**
```typescript
const description = engine.getAnimationDescription(text, preset, layout);
// Use description for screen readers
```

2. **Respect user preferences:**
```typescript
const validation = engine.validateAccessibility();
if (!validation.isCompliant) {
  console.warn('Accessibility issues:', validation.issues);
}
```

---

This API reference covers the complete TypeStorm API. For more examples and tutorials, visit our [documentation site](https://docs.typestorm.dev).