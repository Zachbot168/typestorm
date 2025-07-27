import { TextEffectOptions } from '../core/TextEngine';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: TextEffectOptions;
  onOptionsChange: (options: TextEffectOptions) => void;
}

export function SettingsPanel({ isOpen, onClose, options, onOptionsChange }: SettingsPanelProps) {
  const handleChange = (key: keyof TextEffectOptions, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="settings-overlay"
          onClick={onClose}
        />
      )}
      <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <label>Theme</label>
            <select 
              value={options.theme || 'light'}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="nightcore">Nightcore</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Change font</label>
            <select 
              value={options.fontFamily || 'Inter'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
            >
              <option value="Inter">Inter</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Times">Times</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Change entrance animation</label>
            <select 
              value={options.entrance || 'fade'}
              onChange={(e) => handleChange('entrance', e.target.value)}
            >
              <option value="fade">Fade In</option>
              <option value="slide">Slide Up</option>
              <option value="scale">Scale In</option>
              <option value="typewriter">Typewriter</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Change loop animation</label>
            <select 
              value={options.loop || 'pulse'}
              onChange={(e) => handleChange('loop', e.target.value)}
            >
              <option value="pulse">Pulse Opacity</option>
              <option value="tilt">Slow Tilt</option>
              <option value="hue">Gentle Hue Shift</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Change exit animation</label>
            <select 
              value={options.exit || 'fade'}
              onChange={(e) => handleChange('exit', e.target.value)}
            >
              <option value="fade">Fade Out</option>
              <option value="slide">Slide Down</option>
              <option value="scale">Scale Out</option>
              <option value="typewriter">Typewriter</option>
            </select>
          </div>

          <div className="setting-group">
            <label>
              <input 
                type="checkbox"
                checked={options.loopAnimation ?? true}
                onChange={(e) => handleChange('loopAnimation', e.target.checked)}
              />
              Loop entire animation sequence
            </label>
          </div>

          <div className="setting-group">
            <label>Animation duration (seconds)</label>
            <input 
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={options.duration || 0.5}
              onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
            />
            <span className="size-value">{options.duration || 0.5}s</span>
          </div>

          <div className="setting-group">
            <label>Loop hold duration (seconds)</label>
            <input 
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={options.loopDuration || 3}
              onChange={(e) => handleChange('loopDuration', parseFloat(e.target.value))}
            />
            <span className="size-value">{options.loopDuration || 3}s</span>
          </div>

          <div className="setting-group">
            <label>Typewriter speed (chars/sec)</label>
            <input 
              type="range"
              min="1"
              max="20"
              step="1"
              value={options.typewriterSpeed || 10}
              onChange={(e) => handleChange('typewriterSpeed', parseInt(e.target.value))}
            />
            <span className="size-value">{options.typewriterSpeed || 10}</span>
          </div>

          <div className="setting-group">
            <label>Change size of text</label>
            <input 
              type="range"
              min="24"
              max="144"
              value={options.fontSize || 96}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            />
            <span className="size-value">{options.fontSize || 96}px</span>
          </div>
        </div>
      </div>
    </>
  );
}