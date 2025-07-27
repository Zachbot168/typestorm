// Simple CSS-based renderer for CLI video generation
// This provides a working CLI without complex Three.js dependencies

class SimpleTypeStormRenderer {
  constructor() {
    this.isReady = false;
    this.animationDuration = 5; // Default 5 seconds
  }

  async initialize(config) {
    try {
      console.log('🔧 Initializing Simple TypeStorm Renderer...');
      
      // Set canvas dimensions for TikTok/Reels format  
      this.canvas = document.getElementById('canvas');
      if (!this.canvas) {
        throw new Error('Canvas element not found');
      }
      
      this.canvas.width = config.width || 1080;
      this.canvas.height = config.height || 1920;
      
      // Get 2D context for canvas rendering
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Failed to get 2D context');
      }
      
      // Wait for GSAP to load
      await this.waitForGSAP();
      
      // Start render loop
      this.startRenderLoop();
      
      this.isReady = true;
      console.log('✅ Simple TypeStorm Renderer initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Simple TypeStorm Renderer:', error);
      throw error;
    }
  }

  startRenderLoop() {
    const render = () => {
      // Clear canvas
      this.ctx.fillStyle = this.currentBackground || '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Continue render loop
      requestAnimationFrame(render);
    };
    
    render();
  }

  async waitForGSAP() {
    return new Promise((resolve, reject) => {
      const maxWaitTime = 30000; // 30 seconds
      const checkInterval = 100; // 100ms
      let waitTime = 0;
      
      const checkForGSAP = () => {
        if (typeof gsap !== 'undefined') {
          resolve();
          return;
        }
        
        waitTime += checkInterval;
        if (waitTime >= maxWaitTime) {
          reject(new Error('Timeout waiting for GSAP to load'));
          return;
        }
        
        setTimeout(checkForGSAP, checkInterval);
      };
      
      checkForGSAP();
    });
  }

  async applyPreset(text, presetName, options = {}) {
    console.log(`🎨 Applying preset: ${presetName} to text: "${text}"`);
    
    try {
      // Load preset configuration
      const preset = await this.loadPreset(presetName);
      if (!preset) {
        throw new Error(`Preset '${presetName}' not found`);
      }

      // Generate layout positions
      const layoutData = this.generateLayout(text, options.layoutType || 'grid', options.layoutOptions || {});
      
      // Clear previous content
      this.clearScene();
      
      // Create character elements
      const characters = this.createCharacterElements(layoutData.positions, text);
      
      // Apply preset styles
      this.applyPresetStyles(preset, characters);
      
      // Setup animations
      const timeline = this.setupAnimations(preset, characters);
      
      this.animationDuration = Math.max(timeline.duration(), 3);
      
      console.log(`✅ Preset applied successfully. Animation duration: ${this.animationDuration}s`);
      
      return {
        timeline: timeline,
        duration: this.animationDuration,
        fps: 30,
        characters: characters
      };
      
    } catch (error) {
      console.error('❌ Failed to apply preset:', error);
      throw error;
    }
  }

  async loadPreset(presetName) {
    const presets = {
      neon: {
        styles: {
          fontSize: 120,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
          filter: 'drop-shadow(0 0 20px #00ffff)',
          background: 'linear-gradient(45deg, #000011, #001122)'
        },
        animations: {
          entrance: {
            duration: 1.5,
            ease: 'back.out(1.7)',
            from: { opacity: 0, scale: 0, rotationZ: 180 },
            to: { opacity: 1, scale: 1, rotationZ: 0 },
            stagger: 0.1
          },
          glow: {
            duration: 2,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { filter: 'drop-shadow(0 0 10px #00ffff)' },
            to: { filter: 'drop-shadow(0 0 40px #00ffff)' }
          }
        }
      },
      liquid: {
        styles: {
          fontSize: 100,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#4CAF50',
          textShadow: '0 5px 15px rgba(76, 175, 80, 0.8)',
          background: 'linear-gradient(45deg, #001122, #002244)'
        },
        animations: {
          entrance: {
            duration: 2,
            ease: 'elastic.out(1, 0.75)',
            from: { opacity: 0, scaleY: 0, y: '-=100' },
            to: { opacity: 1, scaleY: 1, y: '+=0' },
            stagger: 0.15
          },
          flow: {
            duration: 3,
            ease: 'sine.inOut',
            repeat: -1,
            from: { scaleY: 1, skewX: 0, y: '+=0' },
            to: { scaleY: 1.2, skewX: 3, y: '+=15' },
            stagger: 0.2
          }
        }
      },
      fire: {
        styles: {
          fontSize: 110,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#FF4500',
          textShadow: '0 0 5px #FF4500, 0 0 10px #FF6500, 0 0 15px #FF8500',
          background: 'radial-gradient(circle, #220000, #110000)'
        },
        animations: {
          entrance: {
            duration: 1,
            ease: 'power3.out',
            from: { opacity: 0, scale: 2, filter: 'blur(20px)' },
            to: { opacity: 1, scale: 1, filter: 'blur(0px)' },
            stagger: 0.08
          },
          flicker: {
            duration: 0.4,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { opacity: 0.7, scale: 0.95, y: '+=0' },
            to: { opacity: 1, scale: 1.05, y: '-=8' },
            stagger: 0.1
          }
        }
      },
      glitch: {
        styles: {
          fontSize: 100,
          fontWeight: 'bold',
          fontFamily: 'Courier New, monospace',
          color: '#00ff00',
          textShadow: '3px 0 #ff0000, -3px 0 #0000ff, 0 0 10px #00ff00',
          background: '#000000'
        },
        animations: {
          entrance: {
            duration: 1.2,
            ease: 'rough({ template: none.out, strength: 2, points: 50, randomize: true })',
            from: { opacity: 0, x: 'random(-200, 200)' },
            to: { opacity: 1, x: 0 },
            stagger: 0.05
          },
          glitch: {
            duration: 0.15,
            ease: 'rough({ template: none.out, strength: 3, points: 20, randomize: true })',
            repeat: -1,
            from: { x: 0, skewX: 0, scaleX: 1 },
            to: { x: 'random(-8, 8)', skewX: 'random(-3, 3)', scaleX: 'random(0.9, 1.1)' },
            stagger: 0.03
          }
        }
      },
      'vf-morph': {
        styles: {
          fontSize: 100,
          fontWeight: 400,
          fontFamily: 'Arial, sans-serif',
          color: '#ffffff',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          background: 'linear-gradient(135deg, #111111, #333333)'
        },
        animations: {
          entrance: {
            duration: 2,
            ease: 'power4.out',
            from: { opacity: 0, fontSize: 20, fontWeight: 100 },
            to: { opacity: 1, fontSize: 100, fontWeight: 400 },
            stagger: 0.2
          },
          morph: {
            duration: 4,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { fontSize: 80, fontWeight: 100, scale: 0.8 },
            to: { fontSize: 120, fontWeight: 900, scale: 1.2 },
            stagger: 0.3
          }
        }
      }
    };

    return presets[presetName] || null;
  }

  generateLayout(text, layoutType, options = {}) {
    const chars = text.split('');
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    let positions = [];
    
    switch (layoutType) {
      case 'spiral':
        positions = this.generateSpiralLayout(chars, centerX, centerY, options);
        break;
      case 'radial':
        positions = this.generateRadialLayout(chars, centerX, centerY, options);
        break;
      case 'grid':
      default:
        positions = this.generateGridLayout(chars, centerX, centerY, options);
        break;
    }
    
    return {
      positions,
      bounds: { width: this.canvas.width, height: this.canvas.height },
      metadata: { layoutType, characterCount: text.length }
    };
  }

  generateGridLayout(chars, centerX, centerY, options) {
    const spacing = options.spacing || 100;
    const cols = Math.ceil(Math.sqrt(chars.length));
    const rows = Math.ceil(chars.length / cols);
    const startX = centerX - ((cols - 1) * spacing) / 2;
    const startY = centerY - ((rows - 1) * spacing) / 2;
    
    return chars.map((char, index) => ({
      char,
      x: startX + (index % cols) * spacing,
      y: startY + Math.floor(index / cols) * spacing,
      rotation: 0,
      scale: 1,
      opacity: 1
    }));
  }

  generateSpiralLayout(chars, centerX, centerY, options) {
    const radius = options.radius || 200;
    const turns = options.turns || 2;
    
    return chars.map((char, index) => {
      const t = (index / chars.length) * turns * Math.PI * 2;
      const r = radius * (index / chars.length);
      
      return {
        char,
        x: centerX + Math.cos(t) * r,
        y: centerY + Math.sin(t) * r,
        rotation: (t * 180 / Math.PI) % 360,
        scale: 1,
        opacity: 1
      };
    });
  }

  generateRadialLayout(chars, centerX, centerY, options) {
    const radius = options.radius || 250;
    
    return chars.map((char, index) => {
      const angle = (index / chars.length) * Math.PI * 2;
      
      return {
        char,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        rotation: (angle * 180 / Math.PI) + 90,
        scale: 1,
        opacity: 1
      };
    });
  }

  clearScene() {
    // Clear previous character elements
    const container = document.getElementById('text-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  createCharacterElements(positions, text) {
    // Create or get text container
    let textContainer = document.getElementById('text-container');
    if (!textContainer) {
      textContainer = document.createElement('div');
      textContainer.id = 'text-container';
      textContainer.style.position = 'absolute';
      textContainer.style.top = '0';
      textContainer.style.left = '0';
      textContainer.style.width = '100%';
      textContainer.style.height = '100%';
      textContainer.style.pointerEvents = 'none';
      textContainer.style.zIndex = '10';
      document.body.appendChild(textContainer);
    }
    
    return positions.map((pos, index) => {
      const charElement = document.createElement('span');
      charElement.textContent = pos.char;
      charElement.style.position = 'absolute';
      charElement.style.left = `${pos.x}px`;
      charElement.style.top = `${pos.y}px`;
      charElement.style.transform = `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`;
      charElement.style.opacity = pos.opacity.toString();
      charElement.style.transformOrigin = 'center';
      charElement.style.userSelect = 'none';
      charElement.dataset.index = index.toString();
      charElement.dataset.char = pos.char;
      
      textContainer.appendChild(charElement);
      
      return charElement;
    });
  }

  applyPresetStyles(preset, characters) {
    const { styles } = preset;
    
    // Apply background
    if (styles.background) {
      document.body.style.background = styles.background;
      // Extract solid color from gradient for canvas background
      if (styles.background.includes('gradient')) {
        this.currentBackground = '#000000'; // Default for gradients
      } else {
        this.currentBackground = styles.background;
      }
    }
    
    // Apply character styles
    characters.forEach(element => {
      element.style.fontSize = `${styles.fontSize}px`;
      element.style.fontWeight = styles.fontWeight.toString();
      element.style.fontFamily = styles.fontFamily;
      element.style.color = styles.color;
      
      if (styles.textShadow) {
        element.style.textShadow = styles.textShadow;
      }
      
      if (styles.filter) {
        element.style.filter = styles.filter;
      }
    });
  }

  setupAnimations(preset, characters) {
    const timeline = gsap.timeline({ paused: true });
    
    // Add preset animations to timeline
    Object.entries(preset.animations).forEach(([name, animation], index) => {
      this.addAnimationToTimeline(timeline, animation, characters, index * 0.5);
    });
    
    // Ensure timeline has some duration
    if (timeline.duration() === 0) {
      timeline.set(characters, { opacity: 1 }, 0);
      timeline.to(characters, { duration: 1, opacity: 1 }, 0);
    }
    
    return timeline;
  }

  addAnimationToTimeline(timeline, animation, elements, startTime) {
    const { duration, ease, repeat, yoyo, from, to, stagger } = animation;
    
    // Set initial state if provided
    if (from) {
      timeline.set(elements, from, startTime);
    }
    
    // Create animation
    const animProps = {
      duration,
      ease: ease || 'power2.out',
      repeat: repeat,
      yoyo: yoyo,
      ...to
    };
    
    if (stagger) {
      animProps.stagger = stagger;
    }
    
    timeline.to(elements, animProps, startTime);
  }

  async exportVideo(options = {}) {
    console.log('🎬 Starting video export...');
    
    const exportOptions = {
      format: 'webm',
      quality: 'high',
      fps: 30,
      duration: this.animationDuration,
      width: this.canvas.width,
      height: this.canvas.height,
      ...options
    };
    
    console.log('Export options:', exportOptions);
    
    return new Promise((resolve, reject) => {
      try {
        const chunks = [];
        
        // Create MediaRecorder with canvas stream
        const stream = this.canvas.captureStream(exportOptions.fps);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 8000000 // 8 Mbps for good quality
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          console.log(`✅ Video export complete. Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
          resolve(blob);
        };
        
        mediaRecorder.onerror = (error) => {
          console.error('❌ MediaRecorder error:', error);
          reject(error);
        };
        
        // Start recording
        mediaRecorder.start();
        console.log('🔴 Recording started...');
        
        // Start animation playback
        gsap.globalTimeline.clear();
        
        // Wait a bit then stop recording
        setTimeout(() => {
          mediaRecorder.stop();
          console.log('⏹️ Recording stopped');
        }, exportOptions.duration * 1000 + 1000); // Add 1 second buffer
        
      } catch (error) {
        console.error('❌ Export error:', error);
        reject(error);
      }
    });
  }
}

// Make SimpleTypeStormRenderer available globally
window.TypeStormRenderer = new SimpleTypeStormRenderer();

console.log('📦 Simple TypeStorm Renderer loaded');