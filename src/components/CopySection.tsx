import { useState } from 'react';

interface CopySectionProps {
  text: string;
}

export function CopySection({ text }: CopySectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const embedCode = (window as any).latestEmbed;
    
    if (embedCode) {
      try {
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!text.trim()) return null;

  return (
    <div className="copy-section">
      <p className="copy-description">
        Want to bring this to your own project?
      </p>
      <button 
        className="copy-button"
        onClick={handleCopy}
        disabled={copied}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
    </div>
  );
}