# Performance Optimization Guide

Comprehensive guide to optimizing TypeStorm for maximum performance across devices and use cases.

## Table of Contents

1. [Performance Overview](#performance-overview)
2. [Rendering Optimization](#rendering-optimization)
3. [Animation Performance](#animation-performance)
4. [Memory Management](#memory-management)
5. [Device Adaptation](#device-adaptation)
6. [Export Optimization](#export-optimization)
7. [Monitoring & Debugging](#monitoring--debugging)
8. [Best Practices](#best-practices)

## Performance Overview

TypeStorm is designed for high-performance text animation with several optimization systems:

- **Hardware Acceleration**: WebGL rendering with Three.js
- **Adaptive Quality**: Dynamic quality adjustment based on performance
- **Memory Management**: Automatic cleanup and resource optimization
- **Frame Rate Monitoring**: Real-time FPS tracking and optimization
- **Device Detection**: Automatic adaptation to device capabilities

### Performance Targets

| Device Category | Target FPS | Memory Limit | Quality Level |
|----------------|------------|--------------|---------------|
| High-end Desktop | 60 FPS | 200MB | Ultra |
| Mid-range Desktop | 30-60 FPS | 150MB | High |
| High-end Mobile | 30 FPS | 100MB | Medium |
| Low-end Mobile | 24 FPS | 50MB | Low |

## Rendering Optimization

### WebGL Configuration

TypeStorm automatically configures WebGL for optimal performance:

```typescript
// Engine automatically optimizes renderer settings
const engine = new TextEngine({
  canvas,
  width: 1080,
  height: 1920,
  fps: 60  // Target FPS - engine will adapt if needed
});

// Check WebGL capabilities
const capabilities = engine.getPerformanceMetrics();
console.log('GPU Memory:', capabilities.gpuMemory);
```

### Canvas Optimization

#### Resolution Scaling

```typescript
// High-DPI display optimization
const pixelRatio = Math.min(window.devicePixelRatio, 2);
canvas.width = baseWidth * pixelRatio;
canvas.height = baseHeight * pixelRatio;
canvas.style.width = baseWidth + 'px';
canvas.style.height = baseHeight + 'px';

// Engine handles pixel ratio automatically
const engine = new TextEngine({ canvas });
```

#### Viewport Culling

```typescript
// Only render visible elements
const isVisible = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

// Engine automatically culls off-screen characters
```

### Texture Optimization

```typescript
// Optimize font textures
const fontLoader = {
  preloadFonts: async (fonts) => {
    const promises = fonts.map(font => {
      return new Promise((resolve) => {
        const fontFace = new FontFace(font.family, `url(${font.url})`);
        fontFace.load().then(resolve);
      });
    });
    await Promise.all(promises);
  }
};

// Efficient texture atlasing for particles
const particleTexture = {
  size: 256,  // Power of 2 for GPU efficiency
  format: 'RGBA8',
  generateMipmaps: true
};
```

## Animation Performance

### GSAP Optimization

#### Efficient Property Animation

```typescript
// GPU-accelerated properties (preferred)
const efficientAnimation = {
  keyframes: [
    { transform: 'translateX(0) scale(1) rotate(0deg)' },
    { transform: 'translateX(100px) scale(1.2) rotate(180deg)' }
  ]
};

// Avoid layout-triggering properties
const inefficientAnimation = {
  keyframes: [
    { left: '0px', width: '100px' },  // Causes layout recalculation
    { left: '100px', width: '120px' }
  ]
};
```

#### Timeline Optimization

```typescript
// Batch animations for better performance
const timeline = gsap.timeline();

// Good: Single timeline for all characters
timeline.to('.char', {
  duration: 1,
  stagger: 0.1,
  x: 100,
  rotation: 360
});

// Less efficient: Individual tweens
characters.forEach((char, i) => {
  gsap.to(char, {
    duration: 1,
    delay: i * 0.1,
    x: 100,
    rotation: 360
  });
});
```

#### Custom Easing Functions

```typescript
// Use built-in easing for better performance
const easing = {
  fast: 'power2.out',      // Very efficient
  medium: 'back.out(1.7)', // Moderately efficient
  complex: 'elastic.out',  // More computationally expensive
};

// Custom easing function optimization
const optimizedEasing = (progress) => {
  // Cache expensive calculations
  const cached = progress * progress;
  return cached * (3 - 2 * progress);
};
```

### Stagger Optimization

```typescript
// Efficient stagger patterns
const staggerPatterns = {
  // Linear stagger (most efficient)
  linear: { each: 0.1 },
  
  // From center (moderately efficient)
  center: { each: 0.1, from: 'center' },
  
  // Custom function (ensure efficiency)
  custom: (index, target, list) => {
    // Pre-calculate values when possible
    const center = list.length * 0.5;
    return Math.abs(index - center) * 0.05;
  }
};
```

### Particle System Performance

```typescript
// Optimized particle configuration
const efficientParticles = {
  enabled: true,
  count: 100,  // Reasonable count
  
  // Use object pooling for particles
  pooling: {
    enabled: true,
    maxSize: 200,
    prealloc: 100
  },
  
  // Efficient update patterns
  updateFrequency: 'frame',  // 'frame' | 'fixed' | 'adaptive'
  
  // LOD (Level of Detail) settings
  lod: {
    enabled: true,
    distances: [100, 200, 500],  // Distance thresholds
    counts: [100, 50, 25]        // Particle counts at each level
  }
};
```

## Memory Management

### Automatic Cleanup

TypeStorm includes automatic memory management:

```typescript
// Engine automatically cleans up resources
engine.dispose(); // Call when done

// Manual cleanup for specific resources
const timeline = gsap.timeline();
// ... use timeline
timeline.kill(); // Cleanup GSAP timeline

// Texture cleanup
texture.dispose();
geometry.dispose();
material.dispose();
```

### Resource Pooling

```typescript
// Object pooling for frequently created objects
class ParticlePool {
  private pool: Particle[] = [];
  private active: Particle[] = [];
  
  acquire(): Particle {
    if (this.pool.length > 0) {
      const particle = this.pool.pop()!;
      this.active.push(particle);
      return particle;
    }
    
    const particle = new Particle();
    this.active.push(particle);
    return particle;
  }
  
  release(particle: Particle): void {
    const index = this.active.indexOf(particle);
    if (index > -1) {
      this.active.splice(index, 1);
      particle.reset();
      this.pool.push(particle);
    }
  }
  
  cleanup(): void {
    this.pool.length = 0;
    this.active.length = 0;
  }
}
```

### Memory Monitoring

```typescript
// Monitor memory usage
const monitorMemory = () => {
  const metrics = engine.getPerformanceMetrics();
  
  console.log('JS Heap:', metrics.memoryUsage / 1024 / 1024, 'MB');
  console.log('GPU Memory:', metrics.gpuMemory || 0, 'MB');
  
  // Warning thresholds
  if (metrics.memoryUsage > 100 * 1024 * 1024) { // 100MB
    console.warn('High memory usage detected');
    
    // Trigger cleanup
    engine.cleanup();
  }
};

// Monitor every 5 seconds during development
setInterval(monitorMemory, 5000);
```

## Device Adaptation

### Performance Detection

```typescript
// Detect device performance level
const detectPerformance = (): 'low' | 'medium' | 'high' => {
  const navigator = window.navigator as any;
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check memory (if available)
  const memory = navigator.deviceMemory || 2;
  
  // Check GPU
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
  
  // Performance scoring
  let score = 0;
  
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;
  
  if (memory >= 8) score += 3;
  else if (memory >= 4) score += 2;
  else score += 1;
  
  if (renderer.includes('RTX') || renderer.includes('RX')) score += 3;
  else if (renderer.includes('GTX') || renderer.includes('Radeon')) score += 2;
  else score += 1;
  
  if (score >= 7) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
};
```

### Adaptive Configuration

```typescript
// Adapt settings based on device performance
const adaptToDevice = (performance: string) => {
  const configs = {
    low: {
      fps: 24,
      particleCount: 50,
      quality: 'low',
      enableBloom: false,
      enableParticles: false,
      textureSize: 512
    },
    
    medium: {
      fps: 30,
      particleCount: 100,
      quality: 'medium',
      enableBloom: true,
      enableParticles: true,
      textureSize: 1024
    },
    
    high: {
      fps: 60,
      particleCount: 200,
      quality: 'high',
      enableBloom: true,
      enableParticles: true,
      textureSize: 2048
    }
  };
  
  return configs[performance] || configs.medium;
};

// Apply adaptive configuration
const devicePerf = detectPerformance();
const config = adaptToDevice(devicePerf);

const engine = new TextEngine({
  canvas,
  fps: config.fps
});
```

### Mobile Optimization

```typescript
// Mobile-specific optimizations
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
  const mobileConfig = {
    // Reduce canvas size
    maxWidth: 720,
    maxHeight: 1280,
    
    // Lower particle count
    maxParticles: 50,
    
    // Simplified effects
    disableBloom: true,
    disablePostProcessing: true,
    
    // Battery optimization
    pauseOnBackground: true,
    reducedMotion: true
  };
  
  // Apply mobile optimizations
  engine.configure(mobileConfig);
}
```

## Export Optimization

### Quality Presets

```typescript
// Optimized export configurations
const exportConfigs = {
  preview: {
    width: 540,     // Half resolution
    height: 960,
    fps: 24,
    quality: 'low',
    duration: 3,
    enableHardwareAcceleration: false
  },
  
  social: {
    width: 1080,
    height: 1920,
    fps: 30,
    quality: 'medium',
    optimizeForMobile: true,
    enableHardwareAcceleration: true
  },
  
  professional: {
    width: 1080,
    height: 1920,
    fps: 60,
    quality: 'ultra',
    enableHardwareAcceleration: true,
    preserveTransparency: true
  }
};

// Use appropriate config
const blob = await engine.exportAnimation(exportConfigs.social);
```

### Progressive Export

```typescript
// Export with progressive quality for large files
const progressiveExport = async (options) => {
  // Start with lower quality
  let currentQuality = 'medium';
  
  try {
    // Attempt high quality
    const result = await engine.exportAnimation({
      ...options,
      quality: 'high'
    });
    
    // Check file size
    if (result.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error('File too large');
    }
    
    return result;
    
  } catch (error) {
    console.warn('High quality export failed, trying medium');
    
    // Fallback to medium quality
    return await engine.exportAnimation({
      ...options,
      quality: 'medium'
    });
  }
};
```

### Batch Processing

```typescript
// Efficient batch export
const batchExport = async (animations, options) => {
  const results = [];
  
  // Process in chunks to avoid memory issues
  const chunkSize = 3;
  for (let i = 0; i < animations.length; i += chunkSize) {
    const chunk = animations.slice(i, i + chunkSize);
    
    const chunkResults = await Promise.all(
      chunk.map(async (animation) => {
        const blob = await engine.exportAnimation(options);
        
        // Cleanup between exports
        await engine.cleanup();
        
        return blob;
      })
    );
    
    results.push(...chunkResults);
    
    // Allow garbage collection between chunks
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};
```

## Monitoring & Debugging

### Performance Metrics

```typescript
// Comprehensive performance monitoring
class PerformanceMonitor {
  private metrics = {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    gpuMemory: 0,
    drawCalls: 0,
    triangles: 0
  };
  
  private history = [];
  private maxHistory = 100;
  
  update() {
    const now = performance.now();
    
    // Calculate FPS
    this.metrics.fps = 1000 / (now - this.lastFrame);
    this.lastFrame = now;
    
    // Memory usage
    const memInfo = (performance as any).memory;
    if (memInfo) {
      this.metrics.memoryUsage = memInfo.usedJSHeapSize;
    }
    
    // GPU metrics (if available)
    const renderer = engine.getRenderer();
    if (renderer) {
      this.metrics.drawCalls = renderer.info.render.calls;
      this.metrics.triangles = renderer.info.render.triangles;
    }
    
    // Store history
    this.history.push({ ...this.metrics, timestamp: now });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }
  
  getAverages() {
    const recent = this.history.slice(-30); // Last 30 frames
    
    return {
      avgFps: recent.reduce((sum, m) => sum + m.fps, 0) / recent.length,
      avgFrameTime: recent.reduce((sum, m) => sum + m.frameTime, 0) / recent.length,
      maxMemory: Math.max(...recent.map(m => m.memoryUsage))
    };
  }
  
  generateReport() {
    const averages = this.getAverages();
    
    return {
      performance: {
        current: this.metrics,
        averages,
        issues: this.detectIssues(averages)
      },
      recommendations: this.getRecommendations(averages)
    };
  }
  
  private detectIssues(averages) {
    const issues = [];
    
    if (averages.avgFps < 24) {
      issues.push('Low frame rate detected');
    }
    
    if (averages.maxMemory > 100 * 1024 * 1024) {
      issues.push('High memory usage');
    }
    
    if (this.metrics.drawCalls > 1000) {
      issues.push('High draw call count');
    }
    
    return issues;
  }
  
  private getRecommendations(averages) {
    const recommendations = [];
    
    if (averages.avgFps < 30) {
      recommendations.push('Reduce particle count');
      recommendations.push('Lower animation complexity');
      recommendations.push('Disable post-processing effects');
    }
    
    if (averages.maxMemory > 100 * 1024 * 1024) {
      recommendations.push('Enable resource pooling');
      recommendations.push('Reduce texture sizes');
      recommendations.push('Implement garbage collection');
    }
    
    return recommendations;
  }
}
```

### Debug Visualization

```typescript
// Visual performance overlay
const createDebugOverlay = () => {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    pointer-events: none;
  `;
  
  document.body.appendChild(overlay);
  
  const update = () => {
    const metrics = engine.getPerformanceMetrics();
    
    overlay.innerHTML = `
      FPS: ${metrics.fps.toFixed(1)}
      Frame Time: ${metrics.frameTime.toFixed(2)}ms
      Memory: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
      GPU Memory: ${(metrics.gpuMemory || 0).toFixed(1)}MB
      Draw Calls: ${metrics.drawCalls || 0}
    `;
    
    requestAnimationFrame(update);
  };
  
  update();
  
  return overlay;
};

// Enable in development
if (process.env.NODE_ENV === 'development') {
  createDebugOverlay();
}
```

## Best Practices

### Code Optimization

1. **Minimize DOM manipulation:**
```typescript
// Good: Batch DOM updates
const fragment = document.createDocumentFragment();
characters.forEach(char => fragment.appendChild(char));
container.appendChild(fragment);

// Avoid: Individual DOM updates
characters.forEach(char => container.appendChild(char));
```

2. **Use requestAnimationFrame efficiently:**
```typescript
// Good: Single animation loop
const animationLoop = () => {
  engine.render();
  particles.update();
  effects.update();
  
  requestAnimationFrame(animationLoop);
};

// Avoid: Multiple animation loops
const loop1 = () => { engine.render(); requestAnimationFrame(loop1); };
const loop2 = () => { particles.update(); requestAnimationFrame(loop2); };
```

3. **Optimize event handlers:**
```typescript
// Good: Throttled event handling
const throttledResize = throttle(() => {
  engine.resize(window.innerWidth, window.innerHeight);
}, 100);

window.addEventListener('resize', throttledResize);

// Avoid: Unthrottled events
window.addEventListener('resize', () => {
  engine.resize(window.innerWidth, window.innerHeight);
});
```

### Resource Management

1. **Preload critical resources:**
```typescript
const preloadAssets = async () => {
  await Promise.all([
    fontLoader.preload('/fonts/inter-variable.woff2'),
    textureLoader.preload('/textures/particle.png'),
    shaderLoader.preload('/shaders/glow.frag')
  ]);
};
```

2. **Implement lazy loading:**
```typescript
const lazyLoadPreset = async (presetName) => {
  if (!presetCache.has(presetName)) {
    const preset = await import(`./presets/${presetName}.js`);
    presetCache.set(presetName, preset);
  }
  
  return presetCache.get(presetName);
};
```

3. **Use efficient data structures:**
```typescript
// Use typed arrays for better performance
const positions = new Float32Array(particleCount * 3);
const colors = new Uint8Array(particleCount * 4);

// Use Map for O(1) lookups
const characterMap = new Map();
characters.forEach((char, index) => {
  characterMap.set(char.id, index);
});
```

### Testing Performance

1. **Automated performance tests:**
```typescript
// Performance regression testing
describe('Performance Tests', () => {
  it('should maintain 30+ FPS', async () => {
    const engine = new TextEngine({ canvas });
    await engine.applyPreset('TEST', 'neon');
    
    engine.play();
    
    // Wait for animation to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const metrics = engine.getPerformanceMetrics();
    expect(metrics.fps).toBeGreaterThan(30);
  });
  
  it('should not exceed memory limit', async () => {
    const engine = new TextEngine({ canvas });
    
    // Create multiple animations
    for (let i = 0; i < 10; i++) {
      await engine.applyPreset(`TEST${i}`, 'liquid');
    }
    
    const metrics = engine.getPerformanceMetrics();
    expect(metrics.memoryUsage).toBeLessThan(200 * 1024 * 1024); // 200MB
  });
});
```

2. **Real-world testing:**
```typescript
// Test on various devices
const deviceTests = [
  { name: 'High-end Desktop', config: { fps: 60, particles: 200 } },
  { name: 'Mid-range Laptop', config: { fps: 30, particles: 100 } },
  { name: 'Mobile Device', config: { fps: 24, particles: 50 } }
];

deviceTests.forEach(test => {
  it(`should perform well on ${test.name}`, async () => {
    const engine = new TextEngine(test.config);
    // ... test implementation
  });
});
```

By following these optimization guidelines, you can ensure TypeStorm performs well across a wide range of devices and use cases, providing smooth animations and efficient resource usage for all users.