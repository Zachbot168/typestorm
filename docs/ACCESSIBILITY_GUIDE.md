# Accessibility Implementation Guide

Comprehensive guide to building accessible TypeStorm applications that work for all users.

## Table of Contents

1. [Accessibility Overview](#accessibility-overview)
2. [Motion & Animation](#motion--animation)
3. [Visual Accessibility](#visual-accessibility)
4. [Screen Reader Support](#screen-reader-support)
5. [Keyboard Navigation](#keyboard-navigation)
6. [Cognitive Accessibility](#cognitive-accessibility)
7. [Testing & Validation](#testing--validation)
8. [Implementation Examples](#implementation-examples)

## Accessibility Overview

TypeStorm follows WCAG 2.1 AA guidelines and provides built-in accessibility features:

- **Reduced Motion Support**: Respects `prefers-reduced-motion` setting
- **High Contrast Mode**: Compatible with system high contrast settings
- **Screen Reader Support**: Provides meaningful descriptions of animations
- **Keyboard Navigation**: Full keyboard accessibility for interactive elements
- **Focus Management**: Proper focus handling and indicators
- **Alternative Content**: Static alternatives to animated content

### Core Principles

1. **Perceivable**: Content must be presentable in ways users can perceive
2. **Operable**: Interface components must be operable by all users
3. **Understandable**: Information and UI operation must be understandable
4. **Robust**: Content must be robust enough for various assistive technologies

## Motion & Animation

### Reduced Motion Support

TypeStorm automatically detects and respects the `prefers-reduced-motion` setting:

```typescript
// Automatic reduced motion detection
const engine = new TextEngine({ canvas });

// Check if reduced motion is preferred
const prefersReducedMotion = engine.accessibilityManager.prefersReducedMotion();

if (prefersReducedMotion) {
  // Animations are automatically simplified
  console.log('Reduced motion mode active');
}
```

### Custom Reduced Motion Implementation

```typescript
// Create reduced motion versions of presets
export const neonPresetReduced: Preset = {
  ...neonPreset,
  animations: {
    // Replace complex animations with simple fade
    entrance: {
      duration: 300, // Much shorter
      ease: 'power1.out',
      keyframes: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    },
    // Remove looping animations
    loop: {
      duration: 0,
      keyframes: [{ opacity: 1 }]
    }
  },
  // Disable particle system
  particles: { enabled: false }
};

// Apply based on user preference
const preset = prefersReducedMotion ? neonPresetReduced : neonPreset;
await engine.applyPreset('TEXT', preset);
```

### Motion Guidelines

1. **Essential Motion**: Keep motion that conveys important information
2. **Reduced Intensity**: Lower animation speed and complexity
3. **Static Alternatives**: Provide non-animated versions
4. **User Control**: Allow users to disable motion manually

```typescript
// Motion control implementation
class MotionController {
  private motionLevel: 'none' | 'reduced' | 'full' = 'full';
  
  constructor() {
    this.detectPreferences();
    this.setupControls();
  }
  
  private detectPreferences() {
    // System preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.motionLevel = 'reduced';
    }
    
    // User preference (stored in localStorage)
    const userPref = localStorage.getItem('motion-preference');
    if (userPref) {
      this.motionLevel = userPref as any;
    }
  }
  
  private setupControls() {
    // Provide user controls
    const motionToggle = document.createElement('button');
    motionToggle.textContent = 'Motion Settings';
    motionToggle.onclick = () => this.showMotionControls();
    
    // Add to settings panel
    document.querySelector('.settings')?.appendChild(motionToggle);
  }
  
  getAnimationConfig(baseConfig: AnimationConfig): AnimationConfig {
    switch (this.motionLevel) {
      case 'none':
        return {
          duration: 0,
          keyframes: [{ opacity: 1 }]
        };
        
      case 'reduced':
        return {
          ...baseConfig,
          duration: Math.min(baseConfig.duration, 500),
          // Remove complex easing
          ease: 'power1.out'
        };
        
      default:
        return baseConfig;
    }
  }
}
```

## Visual Accessibility

### High Contrast Support

```typescript
// High contrast mode detection and implementation
class HighContrastManager {
  private isHighContrast = false;
  
  constructor() {
    this.detectHighContrast();
    this.setupMediaQuery();
  }
  
  private detectHighContrast() {
    // Detect high contrast mode
    this.isHighContrast = window.matchMedia('(prefers-contrast: high)').matches ||
                         window.matchMedia('(-ms-high-contrast: active)').matches;
  }
  
  private setupMediaQuery() {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addListener(() => {
      this.isHighContrast = mediaQuery.matches;
      this.updateStyles();
    });
  }
  
  getContrastColors() {
    if (this.isHighContrast) {
      return {
        background: '#000000',
        text: '#ffffff',
        accent: '#ffff00',
        border: '#ffffff'
      };
    }
    
    return null; // Use default colors
  }
  
  private updateStyles() {
    if (this.isHighContrast) {
      const colors = this.getContrastColors();
      
      // Apply high contrast styles
      document.documentElement.style.setProperty('--bg-color', colors.background);
      document.documentElement.style.setProperty('--text-color', colors.text);
      document.documentElement.style.setProperty('--accent-color', colors.accent);
    }
  }
}

// Integration with TypeStorm
const contrastManager = new HighContrastManager();
const colors = contrastManager.getContrastColors();

if (colors) {
  // Apply high contrast preset
  const highContrastPreset: Preset = {
    ...basePreset,
    styles: {
      ...basePreset.styles,
      color: colors.text,
      background: colors.background,
      textShadow: `0 0 4px ${colors.accent}`, // Maintain glow with high contrast
    }
  };
}
```

### Color Accessibility

```typescript
// Ensure sufficient color contrast
class ColorAccessibility {
  // Calculate luminance for contrast ratio
  private getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  // Calculate contrast ratio between two colors
  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  // Check if color combination meets WCAG standards
  isAccessible(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const threshold = level === 'AAA' ? 7 : 4.5;
    
    return ratio >= threshold;
  }
  
  // Generate accessible color alternatives
  generateAccessibleColor(baseColor: string, background: string): string {
    if (this.isAccessible(baseColor, background)) {
      return baseColor;
    }
    
    // Adjust color until it meets contrast requirements
    const hsl = this.hexToHsl(baseColor);
    
    // Try darkening/lightening
    for (let i = 0; i < 100; i++) {
      const lightness = this.getLuminance(background) > 0.5 
        ? Math.max(0, hsl[2] - i) // Darken for light backgrounds
        : Math.min(100, hsl[2] + i); // Lighten for dark backgrounds
      
      const adjustedColor = this.hslToHex([hsl[0], hsl[1], lightness]);
      
      if (this.isAccessible(adjustedColor, background)) {
        return adjustedColor;
      }
    }
    
    // Fallback to high contrast color
    return this.getLuminance(background) > 0.5 ? '#000000' : '#ffffff';
  }
  
  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }
  
  private hexToHsl(hex: string): [number, number, number] {
    const [r, g, b] = this.hexToRgb(hex).map(c => c / 255);
    // HSL conversion logic...
    return [0, 0, 0]; // Simplified for example
  }
  
  private hslToHex([h, s, l]: [number, number, number]): string {
    // HSL to hex conversion logic...
    return '#000000'; // Simplified for example
  }
}

// Use in preset validation
const colorAccessibility = new ColorAccessibility();

const validatePresetColors = (preset: Preset): string[] => {
  const issues: string[] = [];
  const { color, background } = preset.styles;
  
  if (!colorAccessibility.isAccessible(color, background)) {
    issues.push(`Text color ${color} does not meet contrast requirements against background ${background}`);
  }
  
  return issues;
};
```

### Visual Indicators

```typescript
// Enhanced focus indicators for interactive elements
const createAccessibleButton = (text: string, onClick: () => void) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  
  // Enhanced focus styles
  button.style.cssText = `
    padding: 12px 24px;
    border: 2px solid transparent;
    border-radius: 4px;
    background: #0066cc;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    /* Focus indicator */
    outline: none;
  `;
  
  // Focus event handlers
  button.addEventListener('focus', () => {
    button.style.borderColor = '#ffff00';
    button.style.boxShadow = '0 0 0 3px rgba(255, 255, 0, 0.5)';
  });
  
  button.addEventListener('blur', () => {
    button.style.borderColor = 'transparent';
    button.style.boxShadow = 'none';
  });
  
  return button;
};
```

## Screen Reader Support

### Animation Descriptions

```typescript
// Generate meaningful descriptions for screen readers
class AnimationDescriber {
  describe(text: string, preset: string, layout: string): string {
    const presetDescriptions = {
      neon: 'glowing neon effect with electric blue lighting',
      liquid: 'fluid morphing animation with wave-like movement',
      fire: 'burning text effect with flickering flame particles',
      glitch: 'digital corruption effect with RGB channel separation',
      'vf-morph': 'variable font morphing with weight and width changes'
    };
    
    const layoutDescriptions = {
      spiral: 'arranged in an expanding spiral pattern',
      radial: 'positioned in a circular formation',
      grid: 'arranged in a structured grid layout'
    };
    
    const presetDesc = presetDescriptions[preset] || 'animated text effect';
    const layoutDesc = layoutDescriptions[layout] || 'custom arrangement';
    
    return `Animated text "${text}" with ${presetDesc}, ${layoutDesc}. Duration approximately ${this.getDuration(preset)} seconds.`;
  }
  
  private getDuration(preset: string): number {
    // Return typical duration for preset
    const durations = {
      neon: 5,
      liquid: 6,
      fire: 7,
      glitch: 4,
      'vf-morph': 8
    };
    
    return durations[preset] || 5;
  }
  
  describeLiveRegion(event: string, details?: string): string {
    const descriptions = {
      'animation-start': 'Animation started',
      'animation-pause': 'Animation paused',
      'animation-end': 'Animation completed',
      'export-start': 'Video export started',
      'export-progress': `Export progress: ${details}`,
      'export-complete': 'Video export completed'
    };
    
    return descriptions[event] || event;
  }
}

// Implementation
const describer = new AnimationDescriber();

// Add description to page
const addAnimationDescription = (text: string, preset: string, layout: string) => {
  const description = describer.describe(text, preset, layout);
  
  // Hidden description for screen readers
  const srOnly = document.createElement('div');
  srOnly.className = 'sr-only';
  srOnly.textContent = description;
  srOnly.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(srOnly);
  
  // Also add as aria-label to canvas
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.setAttribute('aria-label', description);
    canvas.setAttribute('role', 'img');
  }
};
```

### Live Regions

```typescript
// Announce animation state changes
class LiveRegionManager {
  private liveRegion: HTMLElement;
  
  constructor() {
    this.createLiveRegion();
  }
  
  private createLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    
    document.body.appendChild(this.liveRegion);
  }
  
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 1000);
  }
  
  announceProgress(percentage: number, operation: string) {
    const message = `${operation} ${percentage}% complete`;
    this.announce(message);
  }
}

// Integration with TypeStorm
const liveRegion = new LiveRegionManager();

engine.on('play', () => {
  liveRegion.announce('Animation started');
});

engine.on('pause', () => {
  liveRegion.announce('Animation paused');
});

engine.on('export-progress', (progress) => {
  if (progress.percentage % 25 === 0) { // Announce every 25%
    liveRegion.announceProgress(progress.percentage, 'Export');
  }
});
```

### Alternative Content

```typescript
// Provide static alternatives to animated content
class AlternativeContent {
  generateStaticPreview(text: string, preset: Preset): HTMLElement {
    const container = document.createElement('div');
    container.className = 'static-preview';
    
    // Apply preset styles without animations
    const staticStyles = {
      ...preset.styles,
      fontSize: `${preset.styles.fontSize}px`,
      fontWeight: preset.styles.fontWeight,
      color: preset.styles.color,
      fontFamily: preset.styles.fontFamily,
      textShadow: preset.styles.textShadow,
      // Remove any animated properties
      animation: 'none',
      transform: 'none'
    };
    
    // Create styled text
    text.split('').forEach((char, index) => {
      const charElement = document.createElement('span');
      charElement.textContent = char;
      charElement.style.cssText = Object.entries(staticStyles)
        .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
        .join('; ');
      
      container.appendChild(charElement);
    });
    
    return container;
  }
  
  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  
  createToggleControl(animatedElement: HTMLElement, staticElement: HTMLElement): HTMLElement {
    const button = document.createElement('button');
    button.textContent = 'Toggle Animation';
    button.setAttribute('aria-pressed', 'true');
    
    let isAnimated = true;
    
    button.onclick = () => {
      isAnimated = !isAnimated;
      
      if (isAnimated) {
        animatedElement.style.display = 'block';
        staticElement.style.display = 'none';
        button.setAttribute('aria-pressed', 'true');
        button.textContent = 'Show Static Version';
      } else {
        animatedElement.style.display = 'none';
        staticElement.style.display = 'block';
        button.setAttribute('aria-pressed', 'false');
        button.textContent = 'Show Animation';
      }
    };
    
    return button;
  }
}
```

## Keyboard Navigation

### Focus Management

```typescript
// Comprehensive keyboard navigation
class KeyboardNavigationManager {
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  
  constructor(container: HTMLElement) {
    this.setupKeyboardHandlers(container);
    this.updateFocusableElements(container);
  }
  
  private setupKeyboardHandlers(container: HTMLElement) {
    container.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Tab':
          this.handleTabNavigation(event);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          this.moveFocus(1);
          event.preventDefault();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          this.moveFocus(-1);
          event.preventDefault();
          break;
        case 'Home':
          this.moveFocus(0, true);
          event.preventDefault();
          break;
        case 'End':
          this.moveFocus(this.focusableElements.length - 1, true);
          event.preventDefault();
          break;
        case 'Enter':
        case ' ':
          this.activateCurrentElement(event);
          break;
        case 'Escape':
          this.handleEscape();
          break;
      }
    });
  }
  
  private updateFocusableElements(container: HTMLElement) {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(container.querySelectorAll(selector));
  }
  
  private handleTabNavigation(event: KeyboardEvent) {
    // Let browser handle normal tab navigation
    // But ensure focus indicators are visible
    setTimeout(() => {
      const focused = document.activeElement as HTMLElement;
      if (focused && this.focusableElements.includes(focused)) {
        this.currentFocusIndex = this.focusableElements.indexOf(focused);
        this.ensureFocusVisible(focused);
      }
    }, 0);
  }
  
  private moveFocus(direction: number, absolute = false) {
    if (absolute) {
      this.currentFocusIndex = direction;
    } else {
      this.currentFocusIndex += direction;
    }
    
    // Wrap around
    if (this.currentFocusIndex < 0) {
      this.currentFocusIndex = this.focusableElements.length - 1;
    } else if (this.currentFocusIndex >= this.focusableElements.length) {
      this.currentFocusIndex = 0;
    }
    
    const elementToFocus = this.focusableElements[this.currentFocusIndex];
    if (elementToFocus) {
      elementToFocus.focus();
      this.ensureFocusVisible(elementToFocus);
    }
  }
  
  private activateCurrentElement(event: KeyboardEvent) {
    const focused = document.activeElement as HTMLElement;
    if (focused && (focused.tagName === 'BUTTON' || focused.tagName === 'A')) {
      focused.click();
      event.preventDefault();
    }
  }
  
  private handleEscape() {
    // Close any open modals/menus
    const openModal = document.querySelector('[aria-modal="true"]');
    if (openModal) {
      const closeButton = openModal.querySelector('[aria-label="Close"]') as HTMLElement;
      closeButton?.click();
    }
  }
  
  private ensureFocusVisible(element: HTMLElement) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
  
  // Focus trap for modals
  trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    });
    
    // Set initial focus
    firstElement?.focus();
  }
}
```

### Skip Links

```typescript
// Add skip navigation links
class SkipLinksManager {
  constructor() {
    this.createSkipLinks();
  }
  
  private createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#controls" class="skip-link">Skip to controls</a>
      <a href="#settings" class="skip-link">Skip to settings</a>
    `;
    
    // Insert at beginning of body
    document.body.insertBefore(skipLinks, document.body.firstChild);
    
    this.addSkipLinkStyles();
  }
  
  private addSkipLinkStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 10000;
      }
      
      .skip-link {
        position: absolute;
        top: -100px;
        left: 8px;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        z-index: 10001;
      }
      
      .skip-link:focus {
        top: 8px;
      }
    `;
    
    document.head.appendChild(style);
  }
}
```

## Cognitive Accessibility

### Clear Instructions

```typescript
// Provide clear, simple instructions
class InstructionManager {
  createInstructions(context: string): HTMLElement {
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.setAttribute('aria-labelledby', 'instructions-heading');
    
    const heading = document.createElement('h2');
    heading.id = 'instructions-heading';
    heading.textContent = 'How to Use TypeStorm';
    
    const list = document.createElement('ol');
    
    const steps = this.getStepsForContext(context);
    steps.forEach(step => {
      const listItem = document.createElement('li');
      listItem.textContent = step;
      list.appendChild(listItem);
    });
    
    instructions.appendChild(heading);
    instructions.appendChild(list);
    
    return instructions;
  }
  
  private getStepsForContext(context: string): string[] {
    const stepMap = {
      'text-input': [
        'Enter your text in the input field',
        'Choose an animation preset from the dropdown',
        'Select a layout style',
        'Click "Generate Animation" to create your video',
        'Use the export button to save your animation'
      ],
      
      'animation-viewer': [
        'Use the play button to start the animation',
        'Click pause to stop the animation',
        'Use the progress bar to scrub through the timeline',
        'Right-click for additional options',
        'Press space bar to toggle play/pause'
      ],
      
      'export-dialog': [
        'Choose your preferred video format',
        'Select the quality level',
        'Set the duration if needed',
        'Click "Export" to start the process',
        'Wait for the export to complete'
      ]
    };
    
    return stepMap[context] || [];
  }
  
  createProgressIndicator(steps: string[], currentStep: number): HTMLElement {
    const progress = document.createElement('div');
    progress.className = 'progress-indicator';
    progress.setAttribute('aria-label', `Step ${currentStep + 1} of ${steps.length}`);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuenow', (currentStep + 1).toString());
    progressBar.setAttribute('aria-valuemin', '1');
    progressBar.setAttribute('aria-valuemax', steps.length.toString());
    
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    
    progressBar.appendChild(fill);
    progress.appendChild(progressBar);
    
    return progress;
  }
}
```

### Error Handling & Feedback

```typescript
// Accessible error handling and user feedback
class AccessibleFeedbackManager {
  private errorContainer: HTMLElement;
  private successContainer: HTMLElement;
  
  constructor() {
    this.createFeedbackContainers();
  }
  
  private createFeedbackContainers() {
    // Error container
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'error-feedback';
    this.errorContainer.setAttribute('aria-live', 'assertive');
    this.errorContainer.setAttribute('aria-atomic', 'true');
    this.errorContainer.setAttribute('role', 'alert');
    
    // Success container
    this.successContainer = document.createElement('div');
    this.successContainer.className = 'success-feedback';
    this.successContainer.setAttribute('aria-live', 'polite');
    this.successContainer.setAttribute('aria-atomic', 'true');
    
    document.body.appendChild(this.errorContainer);
    document.body.appendChild(this.successContainer);
  }
  
  showError(message: string, details?: string, actionable?: () => void) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '⚠️';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    errorElement.appendChild(icon);
    errorElement.appendChild(text);
    
    if (details) {
      const detailsElement = document.createElement('div');
      detailsElement.className = 'error-details';
      detailsElement.textContent = details;
      errorElement.appendChild(detailsElement);
    }
    
    if (actionable) {
      const button = document.createElement('button');
      button.textContent = 'Retry';
      button.onclick = actionable;
      errorElement.appendChild(button);
    }
    
    // Clear previous errors
    this.errorContainer.innerHTML = '';
    this.errorContainer.appendChild(errorElement);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 10000);
  }
  
  showSuccess(message: string) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    
    this.successContainer.innerHTML = '';
    this.successContainer.appendChild(successElement);
    
    setTimeout(() => {
      successElement.remove();
    }, 5000);
  }
  
  showLoadingState(message: string): () => void {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-message';
    loadingElement.innerHTML = `
      <span aria-hidden="true">⏳</span>
      <span>${message}</span>
    `;
    
    this.successContainer.appendChild(loadingElement);
    
    // Return cleanup function
    return () => {
      if (loadingElement.parentNode) {
        loadingElement.remove();
      }
    };
  }
}
```

## Testing & Validation

### Automated Accessibility Testing

```typescript
// Automated accessibility testing
class AccessibilityTester {
  async runTests(container: HTMLElement): Promise<AccessibilityReport> {
    const report: AccessibilityReport = {
      passed: [],
      failed: [],
      warnings: []
    };
    
    // Color contrast testing
    await this.testColorContrast(container, report);
    
    // Focus management testing
    await this.testFocusManagement(container, report);
    
    // ARIA testing
    await this.testAriaImplementation(container, report);
    
    // Keyboard navigation testing
    await this.testKeyboardNavigation(container, report);
    
    return report;
  }
  
  private async testColorContrast(container: HTMLElement, report: AccessibilityReport) {
    const textElements = container.querySelectorAll('*');
    const colorAccessibility = new ColorAccessibility();
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const isAccessible = colorAccessibility.isAccessible(
          this.rgbaToHex(color),
          this.rgbaToHex(backgroundColor)
        );
        
        if (isAccessible) {
          report.passed.push(`Color contrast passed for element: ${element.tagName}`);
        } else {
          report.failed.push(`Insufficient color contrast for element: ${element.tagName}`);
        }
      }
    });
  }
  
  private async testFocusManagement(container: HTMLElement, report: AccessibilityReport) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      // Check for focus indicators
      const styles = window.getComputedStyle(element, ':focus');
      const hasOutline = styles.outline !== 'none' && styles.outline !== '';
      const hasBoxShadow = styles.boxShadow !== 'none';
      const hasBorder = styles.border !== 'none';
      
      if (hasOutline || hasBoxShadow || hasBorder) {
        report.passed.push(`Focus indicator present for: ${element.tagName}`);
      } else {
        report.failed.push(`Missing focus indicator for: ${element.tagName}`);
      }
    });
  }
  
  private async testAriaImplementation(container: HTMLElement, report: AccessibilityReport) {
    // Test for required ARIA attributes
    const interactiveElements = container.querySelectorAll('button, [role="button"]');
    
    interactiveElements.forEach(element => {
      const hasLabel = element.hasAttribute('aria-label') || 
                     element.hasAttribute('aria-labelledby') ||
                     element.textContent?.trim();
      
      if (hasLabel) {
        report.passed.push(`ARIA label present for: ${element.tagName}`);
      } else {
        report.failed.push(`Missing ARIA label for: ${element.tagName}`);
      }
    });
    
    // Test live regions
    const liveRegions = container.querySelectorAll('[aria-live]');
    if (liveRegions.length > 0) {
      report.passed.push(`Live regions implemented: ${liveRegions.length}`);
    } else {
      report.warnings.push('No live regions found - consider adding for dynamic content');
    }
  }
  
  private async testKeyboardNavigation(container: HTMLElement, report: AccessibilityReport) {
    // Simulate keyboard navigation
    const focusableElements = Array.from(container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];
    
    if (focusableElements.length === 0) {
      report.warnings.push('No focusable elements found');
      return;
    }
    
    // Test tab order
    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i];
      const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
      
      if (tabIndex >= 0) {
        report.passed.push(`Element in tab order: ${element.tagName}`);
      } else {
        report.warnings.push(`Element excluded from tab order: ${element.tagName}`);
      }
    }
  }
  
  private rgbaToHex(rgba: string): string {
    // Convert rgba/rgb to hex
    const values = rgba.match(/\d+/g);
    if (!values) return '#000000';
    
    const [r, g, b] = values.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

interface AccessibilityReport {
  passed: string[];
  failed: string[];
  warnings: string[];
}
```

### Manual Testing Checklist

```typescript
// Manual testing checklist for accessibility
const accessibilityChecklist = {
  keyboard: [
    'Can navigate to all interactive elements using Tab',
    'Can activate elements using Enter/Space',
    'Can escape from modal dialogs using Escape',
    'Focus indicators are clearly visible',
    'Tab order is logical and intuitive'
  ],
  
  screenReader: [
    'All images have appropriate alt text',
    'Form inputs have associated labels',
    'Page structure is logical with headings',
    'Dynamic content changes are announced',
    'Error messages are announced clearly'
  ],
  
  visual: [
    'Text meets minimum contrast requirements (4.5:1)',
    'Layout is readable at 200% zoom',
    'Color is not the only way to convey information',
    'Text can be resized to 200% without horizontal scrolling',
    'Focus indicators have sufficient contrast'
  ],
  
  cognitive: [
    'Instructions are clear and simple',
    'Error messages are helpful and actionable',
    'Users can undo or correct mistakes',
    'Time limits can be extended or disabled',
    'Complex interactions have simpler alternatives'
  ],
  
  motion: [
    'Respects prefers-reduced-motion setting',
    'Users can disable auto-playing content',
    'Essential motion is preserved in reduced motion mode',
    'No content flashes more than 3 times per second',
    'Users can control animation playback'
  ]
};
```

## Implementation Examples

### Complete Accessible Animation Component

```typescript
// Complete example of an accessible animation component
class AccessibleAnimationComponent {
  private engine: TextEngine;
  private container: HTMLElement;
  private controls: HTMLElement;
  private describer: AnimationDescriber;
  private liveRegion: LiveRegionManager;
  private feedbackManager: AccessibleFeedbackManager;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.describer = new AnimationDescriber();
    this.liveRegion = new LiveRegionManager();
    this.feedbackManager = new AccessibleFeedbackManager();
    
    this.setupComponent();
  }
  
  private setupComponent() {
    // Create accessible structure
    this.container.innerHTML = `
      <div class="animation-app" role="application" aria-label="TypeStorm Animation Creator">
        <header>
          <h1>TypeStorm Animation Creator</h1>
          <p>Create animated text videos with customizable presets and layouts.</p>
        </header>
        
        <main id="main-content">
          <form id="animation-form" aria-labelledby="form-heading">
            <h2 id="form-heading">Animation Settings</h2>
            
            <div class="form-group">
              <label for="text-input">Text to animate</label>
              <input type="text" id="text-input" required aria-describedby="text-help" />
              <div id="text-help" class="help-text">Enter the text you want to animate (1-50 characters)</div>
            </div>
            
            <div class="form-group">
              <label for="preset-select">Animation preset</label>
              <select id="preset-select" aria-describedby="preset-help">
                <option value="neon">Neon - Glowing electric effect</option>
                <option value="liquid">Liquid - Fluid morphing animation</option>
                <option value="fire">Fire - Burning text with flames</option>
                <option value="glitch">Glitch - Digital corruption effect</option>
                <option value="vf-morph">Variable Font Morph - Typography changes</option>
              </select>
              <div id="preset-help" class="help-text">Choose the visual style for your animation</div>
            </div>
            
            <div class="form-group">
              <fieldset>
                <legend>Animation preferences</legend>
                <label>
                  <input type="checkbox" id="reduced-motion" />
                  Reduce motion effects
                </label>
                <label>
                  <input type="checkbox" id="high-contrast" />
                  Use high contrast colors
                </label>
              </fieldset>
            </div>
            
            <button type="submit" id="generate-btn">Generate Animation</button>
          </form>
          
          <section id="animation-viewer" aria-labelledby="viewer-heading" class="hidden">
            <h2 id="viewer-heading">Animation Preview</h2>
            <div id="canvas-container">
              <canvas id="animation-canvas" aria-label="Animation preview"></canvas>
            </div>
            
            <div id="controls" class="controls" role="group" aria-labelledby="controls-heading">
              <h3 id="controls-heading" class="sr-only">Playback Controls</h3>
              <button id="play-btn" aria-label="Play animation">
                <span aria-hidden="true">▶</span> Play
              </button>
              <button id="pause-btn" aria-label="Pause animation" class="hidden">
                <span aria-hidden="true">⏸</span> Pause
              </button>
              <button id="restart-btn" aria-label="Restart animation">
                <span aria-hidden="true">⏮</span> Restart
              </button>
              <button id="export-btn" aria-label="Export animation as video">
                <span aria-hidden="true">💾</span> Export
              </button>
            </div>
            
            <div class="progress-container">
              <label for="progress-slider" class="sr-only">Animation progress</label>
              <input type="range" id="progress-slider" min="0" max="100" value="0" 
                     aria-label="Animation timeline" aria-valuetext="0% complete" />
            </div>
          </section>
        </main>
      </div>
    `;
    
    this.setupEventHandlers();
    this.setupKeyboardNavigation();
    this.setupAccessibilityFeatures();
  }
  
  private setupEventHandlers() {
    const form = this.container.querySelector('#animation-form') as HTMLFormElement;
    const textInput = this.container.querySelector('#text-input') as HTMLInputElement;
    const presetSelect = this.container.querySelector('#preset-select') as HTMLSelectElement;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.generateAnimation(textInput.value, presetSelect.value);
    });
    
    // Playback controls
    const playBtn = this.container.querySelector('#play-btn') as HTMLButtonElement;
    const pauseBtn = this.container.querySelector('#pause-btn') as HTMLButtonElement;
    const restartBtn = this.container.querySelector('#restart-btn') as HTMLButtonElement;
    
    playBtn.addEventListener('click', () => this.playAnimation());
    pauseBtn.addEventListener('click', () => this.pauseAnimation());
    restartBtn.addEventListener('click', () => this.restartAnimation());
  }
  
  private async generateAnimation(text: string, preset: string) {
    try {
      this.liveRegion.announce('Generating animation...');
      const cleanup = this.feedbackManager.showLoadingState('Creating your animation');
      
      // Initialize engine if needed
      if (!this.engine) {
        const canvas = this.container.querySelector('#animation-canvas') as HTMLCanvasElement;
        this.engine = new TextEngine({ canvas });
      }
      
      // Generate animation
      await this.engine.applyPreset(text, preset);
      
      // Add description for screen readers
      const description = this.describer.describe(text, preset, 'grid');
      const canvas = this.container.querySelector('#animation-canvas') as HTMLCanvasElement;
      canvas.setAttribute('aria-label', description);
      
      // Show viewer
      const viewer = this.container.querySelector('#animation-viewer') as HTMLElement;
      viewer.classList.remove('hidden');
      
      cleanup();
      this.liveRegion.announce('Animation ready');
      this.feedbackManager.showSuccess('Animation created successfully');
      
    } catch (error) {
      this.feedbackManager.showError(
        'Failed to generate animation',
        error.message,
        () => this.generateAnimation(text, preset)
      );
    }
  }
  
  private playAnimation() {
    this.engine.play();
    this.togglePlayButtons(false);
    this.liveRegion.announce('Animation started');
  }
  
  private pauseAnimation() {
    this.engine.pause();
    this.togglePlayButtons(true);
    this.liveRegion.announce('Animation paused');
  }
  
  private restartAnimation() {
    this.engine.restart();
    this.togglePlayButtons(false);
    this.liveRegion.announce('Animation restarted');
  }
  
  private togglePlayButtons(showPlay: boolean) {
    const playBtn = this.container.querySelector('#play-btn') as HTMLElement;
    const pauseBtn = this.container.querySelector('#pause-btn') as HTMLElement;
    
    if (showPlay) {
      playBtn.classList.remove('hidden');
      pauseBtn.classList.add('hidden');
    } else {
      playBtn.classList.add('hidden');
      pauseBtn.classList.remove('hidden');
    }
  }
  
  private setupKeyboardNavigation() {
    const keyboardManager = new KeyboardNavigationManager(this.container);
    
    // Global keyboard shortcuts
    this.container.addEventListener('keydown', (e) => {
      if (e.target === document.body || e.target === this.container) {
        switch (e.key) {
          case ' ':
            if (this.engine) {
              if (this.engine.isCurrentlyPlaying()) {
                this.pauseAnimation();
              } else {
                this.playAnimation();
              }
              e.preventDefault();
            }
            break;
          case 'r':
            if (e.ctrlKey || e.metaKey) {
              this.restartAnimation();
              e.preventDefault();
            }
            break;
        }
      }
    });
  }
  
  private setupAccessibilityFeatures() {
    // Reduced motion checkbox
    const reducedMotionCheckbox = this.container.querySelector('#reduced-motion') as HTMLInputElement;
    reducedMotionCheckbox.addEventListener('change', () => {
      this.updateMotionPreferences(reducedMotionCheckbox.checked);
    });
    
    // High contrast checkbox
    const highContrastCheckbox = this.container.querySelector('#high-contrast') as HTMLInputElement;
    highContrastCheckbox.addEventListener('change', () => {
      this.updateContrastPreferences(highContrastCheckbox.checked);
    });
    
    // Set initial states based on system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reducedMotionCheckbox.checked = true;
    }
    
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      highContrastCheckbox.checked = true;
    }
  }
  
  private updateMotionPreferences(reduced: boolean) {
    // Store preference
    localStorage.setItem('motion-preference', reduced ? 'reduced' : 'full');
    
    // Apply to current animation if exists
    if (this.engine) {
      // Re-apply current preset with motion preferences
      // Implementation would depend on how presets handle reduced motion
    }
    
    this.liveRegion.announce(
      reduced ? 'Motion effects reduced' : 'Full motion effects enabled'
    );
  }
  
  private updateContrastPreferences(highContrast: boolean) {
    // Store preference
    localStorage.setItem('contrast-preference', highContrast ? 'high' : 'normal');
    
    // Apply contrast styles
    if (highContrast) {
      this.container.classList.add('high-contrast');
    } else {
      this.container.classList.remove('high-contrast');
    }
    
    this.liveRegion.announce(
      highContrast ? 'High contrast mode enabled' : 'Normal contrast mode enabled'
    );
  }
}

// Initialize the accessible component
const container = document.getElementById('app');
if (container) {
  new AccessibleAnimationComponent(container);
}
```

This comprehensive accessibility guide ensures TypeStorm applications are usable by everyone, including users with disabilities, following WCAG 2.1 guidelines and modern accessibility best practices.