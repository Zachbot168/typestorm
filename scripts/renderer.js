// TypeStorm CLI Renderer Module
// This module provides a standalone interface for video generation from CLI

class TypeStormRenderer {
  constructor() {
    this.engine = null;
    this.canvas = null;
    this.isReady = false;
    this.animationTimeline = null;
  }

  async initialize(config) {
    try {
      console.log('🔧 Initializing TypeStorm Renderer...');
      
      // Get canvas element
      this.canvas = document.getElementById('canvas');
      if (!this.canvas) {
        throw new Error('Canvas element not found');
      }

      // Set canvas dimensions for TikTok/Reels format
      this.canvas.width = config.width || 1080;
      this.canvas.height = config.height || 1920;
      
      // Wait for TypeStorm module to be loaded from the dist build
      await this.waitForTypeStormModule();
      
      // Initialize TextEngine using the actual built module
      if (window.TypeStorm && window.TypeStorm.TextEngine) {
        this.engine = new window.TypeStorm.TextEngine({
          canvas: this.canvas,
          width: this.canvas.width,
          height: this.canvas.height,
          fps: config.fps || 30,
        });
      } else {
        throw new Error('TypeStorm module not found. Make sure the build assets are loaded.');
      }

      // Wait for engine to be ready
      if (!this.engine.isReady()) {
        throw new Error('TextEngine initialization failed');
      }

      this.isReady = true;
      console.log('✅ TypeStorm Renderer initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize TypeStorm Renderer:', error);
      throw error;
    }
  }

  async waitForTypeStormModule() {
    return new Promise((resolve, reject) => {
      const maxWaitTime = 10000; // 10 seconds
      const checkInterval = 100; // 100ms
      let waitTime = 0;
      
      const checkForModule = () => {
        if (window.TypeStorm) {
          resolve();
          return;
        }
        
        waitTime += checkInterval;
        if (waitTime >= maxWaitTime) {
          reject(new Error('Timeout waiting for TypeStorm module to load'));
          return;
        }
        
        setTimeout(checkForModule, checkInterval);
      };
      
      checkForModule();
    });
  }

  async applyPreset(text, presetName, options = {}) {
    console.log(`🎨 Applying preset: ${presetName} to text: "${text}"`);
    
    if (!this.engine) {
      throw new Error('TextEngine not initialized');
    }

    try {
      // Use the real TextEngine to apply preset
      const result = await this.engine.applyPreset(text, presetName, {
        layoutType: options.layoutType || 'grid',
        layoutOptions: options.layoutOptions || {}
      });
      
      console.log(`✅ Preset applied successfully. Animation duration: ${result.duration}s`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Failed to apply preset:', error);
      throw error;
    }
  }

  async exportVideo(options = {}) {
    console.log('🎬 Starting video export...');
    
    if (!this.engine) {
      throw new Error('TextEngine not initialized');
    }

    try {
      // Use the real TextEngine video capture system
      const blob = await this.engine.exportVideo(options);
      
      console.log(`✅ Video export complete. Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
      
      return blob;
      
    } catch (error) {
      console.error('❌ Failed to export video:', error);
      throw error;
    }
  }
}

// Make TypeStormRenderer available globally
window.TypeStormRenderer = new TypeStormRenderer();

console.log('📦 TypeStorm CLI Renderer loaded');