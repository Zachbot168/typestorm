# Typestorm Lite

A minimal, elegant text animation tool with Apple-style design principles. Create beautiful text animations and embed them anywhere.

![Typestorm Lite Demo](https://via.placeholder.com/800x400/ffffff/000000?text=Typestorm+Lite+Demo)

## ✨ Features

- **3-Phase Animation System**: Entrance → Loop → Exit
- **Apple-Style Design**: Clean, minimal, no clutter
- **Embed Anywhere**: Generate lightweight `<script>` tags
- **Accessibility First**: Respects `prefers-reduced-motion`
- **Performance Optimized**: < 35KB total bundle size

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/typestorm-lite.git
cd typestorm-lite

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎨 Animation Types

### Entrance Animations
- **Fade**: Smooth opacity transition
- **Slide**: Slide up from below
- **Scale**: Scale from small to normal

### Loop Animations
- **Pulse**: Subtle opacity pulsing
- **Tilt**: Gentle rotation effect
- **Hue**: Soft color shifting

### Typography
- **Inter Variable**: Clean, modern font
- **Responsive Sizing**: `clamp(24px, 8vw, 96px)`
- **Custom Fonts**: Helvetica, Georgia, Times support

## 📝 Embed Code

Generate lightweight embed scripts for any website:

```html
<script src="https://cdn.typestorm.dev/embed.min.js"
        data-text="Hello World"
        data-entrance="fade"
        data-loop="pulse"
        data-exit="fade"
        data-font="Inter"
        data-size="72">
</script>
```

## 🛠 Development

### Project Structure

```
src/
├── core/
│   └── TextEngine.ts          # 3-phase animation engine
├── components/
│   ├── AnimationStage.tsx     # Text display component
│   ├── SettingsPanel.tsx      # Settings slide-in panel
│   └── CopySection.tsx        # Embed code generation
├── App.tsx                    # Main application
└── styles/
    └── index.css              # Minimal styling
```

### API Reference

```typescript
import { playText } from './core/TextEngine';

// Basic usage
await playText("Hello World", {
  entrance: 'fade',
  loop: 'pulse',
  exit: 'fade',
  fontFamily: 'Inter',
  fontSize: 96
});
```

### Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🎯 Performance

- **Lighthouse Score**: 90+ on mobile
- **Bundle Size**: ~35KB gzipped total
- **Dependencies**: React 18 + GSAP 3 only
- **Target FPS**: 60fps with adaptive quality

## ♿ Accessibility

- Respects `prefers-reduced-motion`
- Keyboard navigation support
- ARIA labels and semantic HTML
- Focus management for settings panel

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using React, GSAP, and TypeScript