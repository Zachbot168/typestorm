import { useState, useRef, useEffect } from 'react';
import { AnimationStage } from './components/AnimationStage';
import { SettingsPanel } from './components/SettingsPanel';
import { CopySection } from './components/CopySection';
import { TextEffectOptions } from './core/TextEngine';
import './styles/index.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<TextEffectOptions>({
    entrance: 'fade',
    loop: 'pulse',
    exit: 'fade',
    fontFamily: 'Inter',
    fontSize: 96,
    theme: 'light'
  });

  // Focus the hidden input on page load and when clicking on main area
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Apply theme styles to body
  useEffect(() => {
    const body = document.body;
    const root = document.getElementById('root');
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-nightcore');
    root?.classList.remove('theme-light', 'theme-dark', 'theme-nightcore');
    
    // Add current theme class
    const themeClass = `theme-${options.theme || 'light'}`;
    body.classList.add(themeClass);
    root?.classList.add(themeClass);
  }, [options.theme]);

  const handleMainClick = () => {
    inputRef.current?.focus();
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-logo">Typestorm</h1>
        <button 
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open settings"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="app-main" onClick={handleMainClick}>
        {/* Hidden Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          className="text-input"
          autoFocus
          tabIndex={0}
        />

        {/* Animation Stage */}
        <AnimationStage 
          text={inputText}
          options={options}
        />

        {/* Copy Section */}
        <CopySection text={inputText} />
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        options={options}
        onOptionsChange={setOptions}
      />
    </div>
  );
}

export default App;