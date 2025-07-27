import { useEffect, useRef } from 'react';
import { TextEngine, TextEffectOptions } from '../core/TextEngine';

interface AnimationStageProps {
  text: string;
  options: TextEffectOptions;
}

export function AnimationStage({ text, options }: AnimationStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TextEngine>();

  useEffect(() => {
    if (stageRef.current) {
      engineRef.current = new TextEngine(stageRef.current);
      // Initialize with placeholder
      const placeholder = '<span class="placeholder">Input Text</span>';
      stageRef.current.innerHTML = placeholder;
      
      // Apply font family and size to match options
      const fontFamily = `${options.fontFamily || 'Inter'}, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
      stageRef.current.style.fontFamily = fontFamily;
      stageRef.current.style.fontSize = `clamp(24px, 8vw, ${options.fontSize || 96}px)`;
    }

    return () => {
      engineRef.current?.dispose();
    };
  }, [options.fontFamily, options.fontSize]);

  useEffect(() => {
    if (engineRef.current) {
      if (text.trim()) {
        engineRef.current.playText(text, options);
      } else {
        // Clear the stage and show placeholder when no text
        engineRef.current.stop();
        if (stageRef.current) {
          stageRef.current.innerHTML = '<span class="placeholder">Input Text</span>';
          // Maintain font family and size consistency
          const fontFamily = `${options.fontFamily || 'Inter'}, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
          stageRef.current.style.fontFamily = fontFamily;
          stageRef.current.style.fontSize = `clamp(24px, 8vw, ${options.fontSize || 96}px)`;
        }
      }
    }
  }, [text, options]);

  return (
    <div className="animation-stage">
      <div 
        ref={stageRef}
        data-typestorm-stage
        className="stage-content"
      />
    </div>
  );
}