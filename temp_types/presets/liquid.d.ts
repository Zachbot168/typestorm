import * as THREE from 'three';
import { Preset } from '../core/types';
export declare function createLiquidDroplets(options?: LiquidOptions): THREE.Points;
export declare function createFlowField(options?: LiquidOptions): THREE.LineSegments;
export declare function createMetaballMorph(characters: HTMLElement[], options?: LiquidOptions): gsap.core.Timeline;
export interface LiquidOptions {
    liquidColor?: string;
    transparency?: number;
    waveAmplitude?: number;
    waveFrequencyX?: number;
    waveFrequencyY?: number;
    viscosity?: number;
    flowDirection?: {
        x: number;
        y: number;
    };
    surfaceTension?: number;
    refractionIndex?: number;
    bubbleIntensity?: number;
    foamLevel?: number;
    shininess?: number;
    particleCount?: number;
    morphDuration?: number;
    animationDuration?: number;
}
export declare function createLiquidTimeline(characters: HTMLElement[], particles: THREE.Points, flowField: THREE.LineSegments, options?: LiquidOptions): gsap.core.Timeline;
export declare function applyLiquidPreset(scene: THREE.Scene, _camera: THREE.Camera, _renderer: THREE.WebGLRenderer, options?: LiquidOptions): {
    particles: THREE.Points;
    flowField: THREE.LineSegments;
    timeline: gsap.core.Timeline;
    material: THREE.ShaderMaterial;
    cleanup: () => void;
};
export declare const liquidPreset: Preset;
