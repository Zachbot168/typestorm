export interface Preset {
    name: string;
    description: string;
    styles: {
        fontSize: number;
        fontWeight: string | number;
        color: string;
        background?: string;
        textShadow?: string;
        fontFamily?: string;
        fontVariationSettings?: string;
        filter?: string;
    };
    animations: {
        [key: string]: AnimationConfig;
    };
    particles?: ParticleConfig;
}
export interface Layout {
    name: string;
    description: string;
    calculate: (text: string, options?: any) => CharacterPosition[];
    animations: {
        [key: string]: AnimationConfig;
    };
}
export interface CharacterPosition {
    char: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
}
export interface AnimationConfig {
    duration: number;
    ease: string;
    repeat?: number;
    yoyo?: boolean;
    stagger?: number | object;
    keyframes: object[];
    repeatDelay?: number;
}
export interface ParticleConfig {
    enabled: boolean;
    count?: number;
    color?: string | string[];
    size?: {
        min: number;
        max: number;
    };
    speed?: {
        min: number;
        max: number;
    };
    shape?: 'circle' | 'rectangle' | 'flame';
    gravity?: number;
}
export interface TextEngineOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    fps: number;
    duration: number;
}
export interface RecordingOptions {
    format: 'webm' | 'mp4' | 'gif';
    quality: number;
    fps: number;
    duration: number;
}
export interface FontMetrics {
    ascent: number;
    descent: number;
    lineHeight: number;
    capHeight: number;
    xHeight: number;
}
export interface VariableFontAxis {
    tag: string;
    min: number;
    max: number;
    default: number;
    name: string;
}
export interface TextRenderConfig {
    text: string;
    preset: Preset;
    layout: Layout;
    layoutOptions?: any;
    customAnimations?: AnimationConfig[];
}
