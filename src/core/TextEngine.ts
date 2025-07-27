import { gsap } from 'gsap';

export interface TextEffectOptions {
  entrance?: 'fade' | 'slide' | 'scale' | 'typewriter';
  loop?: 'pulse' | 'tilt' | 'hue' | 'none';
  exit?: 'fade' | 'slide' | 'scale' | 'typewriter' | 'none';
  fontFamily?: string;
  fontSize?: number;
  loopAnimation?: boolean; // Whether to loop the entire sequence
  typewriterSpeed?: number; // Speed for typewriter effect (chars per second)
  duration?: number; // Total duration in seconds for each phase
  loopDuration?: number; // How long to hold the loop phase in seconds
  theme?: 'light' | 'dark' | 'nightcore'; // Visual theme
}

export class TextEngine {
  private element: HTMLElement;
  private timeline: gsap.core.Timeline;
  private prefersReducedMotion: boolean;

  constructor(element: HTMLElement) {
    this.element = element;
    this.timeline = gsap.timeline();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  async playText(text: string, options: TextEffectOptions = {}): Promise<void> {
    
    // Clear previous animation
    this.timeline.kill();
    this.element.innerHTML = '';

    // Default options
    const config = {
      entrance: options.entrance || 'fade',
      loop: options.loop || 'pulse',
      exit: options.exit || 'fade',
      fontFamily: options.fontFamily || 'Inter',
      fontSize: options.fontSize || 96,
      loopAnimation: options.loopAnimation ?? true,
      typewriterSpeed: options.typewriterSpeed || 10,
      duration: options.duration || 0.5,
      loopDuration: options.loopDuration || 3,
      theme: options.theme || 'light',
      ...options
    };

    // Create character elements
    const chars = this.createCharacters(text, config);
    
    if (chars.length === 0) return;
    
    // Apply font styles
    this.element.style.fontFamily = `${config.fontFamily}, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
    this.element.style.fontSize = `clamp(24px, 8vw, ${config.fontSize}px)`;
    this.element.style.fontWeight = '400';
    this.element.style.wordBreak = 'break-word';
    
    // Apply theme-specific text colors and effects
    this.applyThemeStyles(config.theme);

    // Create 3-phase animation timeline
    this.timeline = gsap.timeline();
    
    try {
      if (config.loopAnimation) {
        // Create looped sequence: entrance → loop → exit → repeat
        this.createLoopedSequence(chars, config);
      } else {
        // Single sequence: entrance → loop (continuous)
        await this.createEntrance(chars, config.entrance, config);
        this.createLoop(chars, config.loop);
      }

      // Generate embed code
      this.generateEmbedCode(text, config);
    } catch (error) {
      console.error('Animation error:', error);
      // Fallback: show text immediately
      gsap.set(chars, { opacity: 1 });
    }
  }

  private createCharacters(text: string, _config: TextEffectOptions): HTMLElement[] {
    const chars: HTMLElement[] = [];
    
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      chars.push(span);
      this.element.appendChild(span);
    });

    return chars;
  }

  private async createEntrance(chars: HTMLElement[], type: string, config: TextEffectOptions): Promise<void> {
    if (type === 'typewriter') {
      return this.createTypewriterEntrance(chars, config);
    }

    const duration = this.prefersReducedMotion ? 0.1 : (config.duration || 0.3);
    const stagger = this.prefersReducedMotion ? 0 : 0.02;

    // Set initial states
    gsap.set(chars, this.getEntranceInitialState(type));

    // Animate to final state
    return new Promise(resolve => {
      gsap.to(chars, {
        duration,
        stagger,
        ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        ...this.getEntranceFinalState(type),
        onComplete: resolve
      });
    });
  }

  private async createTypewriterEntrance(chars: HTMLElement[], config: TextEffectOptions): Promise<void> {
    const speed = config.typewriterSpeed || 10; // characters per second
    const charDelay = 1 / speed; // delay between each character

    // Initially hide all characters
    gsap.set(chars, { opacity: 0 });

    return new Promise(resolve => {
      const timeline = gsap.timeline({ onComplete: resolve });
      
      chars.forEach((char, index) => {
        timeline.to(char, {
          opacity: 1,
          duration: 0.05, // Quick reveal for each character
          ease: "none"
        }, index * charDelay);
      });
    });
  }

  private createLoop(chars: HTMLElement[], type: string): void {
    if (this.prefersReducedMotion) return;

    const loopAnimation = this.getLoopAnimation(type);
    
    gsap.to(chars, {
      duration: loopAnimation.duration,
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      repeat: -1,
      yoyo: true,
      stagger: 0.05,
      ...loopAnimation.props
    });
  }

  private getEntranceInitialState(type: string): gsap.TweenVars {
    switch (type) {
      case 'slide':
        return { opacity: 0, y: 20 };
      case 'scale':
        return { opacity: 0, scale: 0.8 };
      case 'typewriter':
        return { opacity: 0, scaleX: 0, transformOrigin: 'left center' };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  }

  private getEntranceFinalState(type: string): gsap.TweenVars {
    switch (type) {
      case 'slide':
        return { opacity: 1, y: 0 };
      case 'scale':
        return { opacity: 1, scale: 1 };
      case 'typewriter':
        return { opacity: 1, scaleX: 1 };
      case 'fade':
      default:
        return { opacity: 1 };
    }
  }

  private getLoopAnimation(type: string): { duration: number; props: gsap.TweenVars } {
    switch (type) {
      case 'tilt':
        return {
          duration: 4,
          props: { rotation: 2 }
        };
      case 'hue':
        return {
          duration: 6,
          props: { filter: 'hue-rotate(10deg)' }
        };
      case 'pulse':
      default:
        return {
          duration: 2,
          props: { opacity: 0.8 }
        };
    }
  }

  private createLoopedSequence(chars: HTMLElement[], config: TextEffectOptions): void {
    const loopSequence = async () => {
      // Create a new timeline for each loop cycle
      const loopTimeline = gsap.timeline();

      // Phase 1: Entrance
      if (config.entrance === 'typewriter') {
        await this.createTypewriterEntrance(chars, config);
      } else {
        loopTimeline.add(() => {
          gsap.set(chars, this.getEntranceInitialState(config.entrance!));
        });

        loopTimeline.to(chars, {
          duration: this.prefersReducedMotion ? 0.1 : (config.duration || 0.3),
          stagger: this.prefersReducedMotion ? 0 : 0.02,
          ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          ...this.getEntranceFinalState(config.entrance!)
        });
      }

      // Phase 2: Hold and loop
      const holdDuration = config.loopDuration || 3;
      if (!this.prefersReducedMotion && config.loop !== 'none') {
        const loopAnimation = this.getLoopAnimation(config.loop!);
        loopTimeline.to(chars, {
          duration: loopAnimation.duration,
          ease: "cubic-bezier(0.4, 0, 0.2, 1)",
          repeat: Math.floor(holdDuration / loopAnimation.duration),
          yoyo: true,
          stagger: 0.05,
          ...loopAnimation.props
        });
      } else {
        // Hold for specified duration
        loopTimeline.to({}, { duration: holdDuration });
      }

      // Phase 3: Exit
      if (config.exit && config.exit !== 'none') {
        if (config.exit === 'typewriter') {
          await this.createTypewriterExit(chars, config);
        } else {
          loopTimeline.to(chars, {
            duration: this.prefersReducedMotion ? 0.1 : (config.duration || 0.3),
            stagger: this.prefersReducedMotion ? 0 : 0.02,
            ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            ...this.getExitFinalState(config.exit)
          });
        }
      }

      // Wait for timeline to complete, then loop
      await new Promise(resolve => {
        loopTimeline.eventCallback("onComplete", resolve);
      });
      
      setTimeout(loopSequence, 500); // Small delay between cycles
    };

    // Start the loop
    loopSequence();
  }

  private async createTypewriterExit(chars: HTMLElement[], config: TextEffectOptions): Promise<void> {
    const speed = config.typewriterSpeed || 10; // characters per second
    const charDelay = 1 / speed; // delay between each character

    return new Promise(resolve => {
      const timeline = gsap.timeline({ onComplete: resolve });
      
      // Reverse order for exit - last character disappears first
      chars.reverse().forEach((char, index) => {
        timeline.to(char, {
          opacity: 0,
          duration: 0.05, // Quick hide for each character
          ease: "none"
        }, index * charDelay);
      });
      
      // Restore original order
      chars.reverse();
    });
  }

  private getExitFinalState(type: string): gsap.TweenVars {
    switch (type) {
      case 'slide':
        return { opacity: 0, y: -20 };
      case 'scale':
        return { opacity: 0, scale: 0.8 };
      case 'typewriter':
        return { opacity: 0, scaleX: 0, transformOrigin: 'right center' };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  }

  private applyThemeStyles(theme: string): void {
    switch (theme) {
      case 'dark':
        this.element.style.color = '#ffffff';
        this.element.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
        break;
      case 'nightcore':
        // Solid neon pink text with minimal glow for maximum clarity
        this.element.style.color = '#ff66b3';
        this.element.style.textShadow = '0 0 5px rgba(255, 102, 179, 0.5)';
        this.element.style.background = 'none';
        this.element.style.backgroundClip = 'unset';
        this.element.style.webkitBackgroundClip = 'unset';
        this.element.style.filter = 'none';
        break;
      case 'light':
      default:
        this.element.style.color = '#000000';
        this.element.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
        this.element.style.background = 'none';
        this.element.style.backgroundClip = 'unset';
        this.element.style.webkitBackgroundClip = 'unset';
        this.element.style.filter = 'none';
        break;
    }
  }

  private generateEmbedCode(text: string, config: TextEffectOptions): void {
    const embedScript = `<script src="https://cdn.typestorm.dev/embed.min.js"
        data-text="${text}"
        data-entrance="${config.entrance}"
        data-loop="${config.loop}"
        data-exit="${config.exit}"
        data-font="${config.fontFamily}"
        data-size="${config.fontSize}">
</script>`;

    // Expose to global scope for copy functionality
    (window as any).latestEmbed = embedScript;
  }

  public stop(): void {
    this.timeline.kill();
  }

  public dispose(): void {
    this.timeline.kill();
    this.element.innerHTML = '';
  }
}

// Main public API function
export async function playText(text: string, options?: TextEffectOptions): Promise<void> {
  const stage = document.querySelector('[data-typestorm-stage]') as HTMLElement;
  if (!stage) {
    throw new Error('Typestorm stage element not found');
  }

  const engine = new TextEngine(stage);
  return engine.playText(text, options);
}