// CLI Bridge - Simplified integration between CLI and TypeStorm components
// This file creates a simplified but functional bridge for CLI video generation

class TypeStormCLIBridge {
  constructor() {
    this.canvas = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.timeline = null;
    this.isReady = false;
  }

  async initialize(config) {
    try {
      console.log('🔧 Initializing TypeStorm CLI Bridge...');
      
      // Get canvas element
      this.canvas = document.getElementById('canvas');
      if (!this.canvas) {
        throw new Error('Canvas element not found');
      }

      // Set canvas dimensions for TikTok/Reels format  
      this.canvas.width = config.width || 1080;
      this.canvas.height = config.height || 1920;
      
      // Initialize Three.js
      await this.initializeThreeJS();
      
      // Initialize GSAP
      this.initializeGSAP();
      
      this.isReady = true;
      console.log('✅ TypeStorm CLI Bridge initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize TypeStorm CLI Bridge:', error);
      throw error;
    }
  }

  async initializeThreeJS() {
    // Wait for Three.js to load
    await this.waitForThreeJS();
    
    if (typeof THREE === 'undefined') {
      throw new Error('Three.js not loaded after waiting');
    }
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    const aspect = this.canvas.width / this.canvas.height;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.setPixelRatio(1); // Fixed pixel ratio for consistent output
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  async waitForThreeJS() {
    return new Promise((resolve, reject) => {
      const maxWaitTime = 30000; // 30 seconds
      const checkInterval = 100; // 100ms
      let waitTime = 0;
      
      const checkForThreeJS = () => {
        if (typeof THREE !== 'undefined') {
          resolve();
          return;
        }
        
        waitTime += checkInterval;
        if (waitTime >= maxWaitTime) {
          reject(new Error('Timeout waiting for Three.js to load'));
          return;
        }
        
        setTimeout(checkForThreeJS, checkInterval);
      };
      
      checkForThreeJS();
    });
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

  async initializeGSAP() {
    // Wait for GSAP to load
    await this.waitForGSAP();
    
    if (typeof gsap === 'undefined') {
      throw new Error('GSAP not loaded after waiting');
    }
    
    this.timeline = gsap.timeline({ 
      paused: true,
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
      this.setupAnimations(preset, characters);
      
      console.log(`✅ Preset applied successfully. Animation duration: ${this.timeline.duration()}s`);
      
      return {
        timeline: this.timeline,
        duration: this.timeline.duration(),
        fps: 30,
        characters: characters
      };
      
    } catch (error) {
      console.error('❌ Failed to apply preset:', error);
      throw error;
    }
  }

  async loadPreset(presetName) {
    // Enhanced preset definitions with proper Three.js materials and effects
    const presets = {
      neon: {
        styles: {
          fontSize: 120,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
          filter: 'drop-shadow(0 0 20px #00ffff)',
          background: '#000011'
        },
        animations: {
          fadeIn: {
            duration: 1.5,
            ease: 'power2.out',
            from: { opacity: 0, scale: 0.5 },
            to: { opacity: 1, scale: 1 },
            stagger: 0.1
          },
          glow: {
            duration: 2,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { filter: 'drop-shadow(0 0 10px #00ffff)' },
            to: { filter: 'drop-shadow(0 0 30px #00ffff)' }
          }
        }
      },
      liquid: {
        styles: {
          fontSize: 100,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#4CAF50',
          textShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
          background: '#001122'
        },
        animations: {
          flow: {
            duration: 3,
            ease: 'power2.inOut',
            repeat: -1,
            from: { scaleY: 1, skewX: 0 },
            to: { scaleY: 1.2, skewX: 5 },
            stagger: 0.2
          },
          wave: {
            duration: 4,
            ease: 'sine.inOut',
            repeat: -1,
            from: { y: '+=0' },
            to: { y: '+=20' },
            stagger: 0.3
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
          background: '#220000'
        },
        animations: {
          flicker: {
            duration: 0.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { opacity: 0.8, scale: 1 },
            to: { opacity: 1, scale: 1.05 },
            stagger: 0.1
          },
          burn: {
            duration: 2,
            ease: 'power2.out',
            repeat: -1,
            from: { y: '+=0' },
            to: { y: '-=10' },
            stagger: 0.15
          }
        }
      },
      glitch: {
        styles: {
          fontSize: 100,
          fontWeight: 'bold',
          fontFamily: 'Courier New, monospace',
          color: '#00ff00',
          textShadow: '2px 0 #ff0000, -2px 0 #0000ff',
          background: '#000000'
        },
        animations: {
          glitch: {
            duration: 0.2,
            ease: 'power2.inOut',
            repeat: -1,
            from: { x: 0, skewX: 0 },
            to: { x: 'random(-5, 5)', skewX: 'random(-2, 2)' },
            stagger: 0.05
          },
          distort: {
            duration: 0.3,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { scaleX: 1 },
            to: { scaleX: 'random(0.8, 1.2)' },
            stagger: 0.1
          }
        }
      },
      'vf-morph': {
        styles: {
          fontSize: 100,
          fontWeight: 400,
          fontFamily: 'Arial, sans-serif',
          color: '#ffffff',
          background: '#111111'
        },
        animations: {
          morph: {
            duration: 4,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            from: { fontWeight: 100, fontSize: 80 },
            to: { fontWeight: 900, fontSize: 120 },
            stagger: 0.3
          },
          scale: {
            duration: 3,
            ease: 'back.inOut(1.7)',
            repeat: -1,
            yoyo: true,
            from: { scale: 0.8 },
            to: { scale: 1.2 },
            stagger: 0.4
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
    
    // Clear timeline
    this.timeline.clear();
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
      this.scene.background = new THREE.Color(styles.background);
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
    // Add preset animations to timeline
    Object.entries(preset.animations).forEach(([name, animation]) => {
      this.addAnimationToTimeline(animation, characters);
    });
    
    // Ensure timeline has some duration
    if (this.timeline.duration() === 0) {
      this.timeline.set(characters, { opacity: 1 }, 0);
      this.timeline.to(characters, { duration: 1, opacity: 1 }, 0);
    }
  }

  addAnimationToTimeline(animation, elements) {
    const { duration, ease, repeat, yoyo, from, to, stagger } = animation;
    
    // Set initial state if provided
    if (from) {
      this.timeline.set(elements, from, 0);
    }
    
    // Create animation
    const animProps = {
      duration,
      ease,
      repeat,
      yoyo,
      ...to
    };
    
    if (stagger) {
      animProps.stagger = stagger;
    }
    
    this.timeline.to(elements, animProps, 0);
  }

  async exportVideo(options = {}) {
    console.log('🎬 Starting video export...');
    
    const exportOptions = {
      format: 'webm', // Use WebM for better browser support
      quality: 'high',
      fps: 30,
      duration: Math.max(this.timeline.duration(), 3),
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
          videoBitsPerSecond: 5000000 // 5 Mbps
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
        this.timeline.restart();
        
        // Start render loop
        const renderLoop = () => {
          this.renderer.render(this.scene, this.camera);
          
          if (this.timeline.progress() < 1) {
            requestAnimationFrame(renderLoop);
          }
        };
        
        renderLoop();
        
        // Stop recording after duration
        setTimeout(() => {
          mediaRecorder.stop();
          console.log('⏹️ Recording stopped');
        }, exportOptions.duration * 1000);
        
      } catch (error) {
        console.error('❌ Export error:', error);
        reject(error);
      }
    });
  }
}

// Make TypeStormCLIBridge available globally
window.TypeStormRenderer = new TypeStormCLIBridge();

console.log('📦 TypeStorm CLI Bridge loaded');