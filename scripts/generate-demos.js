#!/usr/bin/env node

/**
 * Auto-generate demo GIFs for all TypeStorm presets
 * Creates marketing materials and documentation assets
 */

import { program } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PRESETS = ['neon', 'liquid', 'fire', 'glitch', 'vf-morph'];
const LAYOUTS = ['spiral', 'radial', 'grid'];
const DEMO_TEXTS = [
  'HELLO',
  'WORLD',
  'STORM',
  'MAGIC',
  'POWER',
  'DREAM',
  'FORCE',
  'SPARK'
];

const OUTPUT_DIR = path.join(__dirname, '../dist/demos');
const ASSETS_DIR = path.join(__dirname, '../public/assets');

program
  .name('generate-demos')
  .description('Generate demo materials for TypeStorm')
  .option('-p, --preset <preset>', 'Generate for specific preset only')
  .option('-l, --layout <layout>', 'Generate for specific layout only')
  .option('-f, --format <format>', 'Output format (gif/mp4/webm)', 'gif')
  .option('-q, --quality <quality>', 'Quality level (low/medium/high)', 'high')
  .option('--duration <seconds>', 'Animation duration', '6')
  .option('--width <width>', 'Canvas width', '800')
  .option('--height <height>', 'Canvas height', '600')
  .option('--social', 'Generate social media optimized versions')
  .option('--thumbnails', 'Generate thumbnail images')
  .action(async (options) => {
    console.log(chalk.blue.bold('🎬 TypeStorm Demo Generator'));
    console.log(chalk.gray('━'.repeat(50)));
    
    try {
      await ensureDirectories();
      
      const presetsToGenerate = options.preset ? [options.preset] : PRESETS;
      const layoutsToGenerate = options.layout ? [options.layout] : LAYOUTS;
      
      // Generate main demos
      await generateMainDemos(presetsToGenerate, layoutsToGenerate, options);
      
      // Generate social media versions if requested
      if (options.social) {
        await generateSocialMediaVersions(presetsToGenerate, options);
      }
      
      // Generate thumbnails if requested
      if (options.thumbnails) {
        await generateThumbnails(presetsToGenerate, layoutsToGenerate);
      }
      
      // Generate demo index
      await generateDemoIndex(presetsToGenerate, layoutsToGenerate);
      
      // Generate marketing captions
      await generateMarketingCaptions(presetsToGenerate);
      
      console.log(chalk.green.bold('✅ Demo generation completed!'));
      console.log(chalk.yellow(`📁 Output directory: ${OUTPUT_DIR}`));
      
    } catch (error) {
      console.error(chalk.red.bold('❌ Demo generation failed:'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Ensure output directories exist
async function ensureDirectories() {
  const dirs = [
    OUTPUT_DIR,
    path.join(OUTPUT_DIR, 'gifs'),
    path.join(OUTPUT_DIR, 'videos'),
    path.join(OUTPUT_DIR, 'thumbnails'),
    path.join(OUTPUT_DIR, 'social'),
    ASSETS_DIR
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(chalk.green(`📁 Created directory: ${dir}`));
    }
  }
}

// Generate main demo content
async function generateMainDemos(presets, layouts, options) {
  console.log(chalk.yellow('🎨 Generating main demos...'));
  
  const total = presets.length * layouts.length;
  let completed = 0;
  
  for (const preset of presets) {
    for (const layout of layouts) {
      const text = getRandomText();
      const outputPath = path.join(
        OUTPUT_DIR, 
        options.format === 'gif' ? 'gifs' : 'videos',
        `${preset}-${layout}-demo.${options.format}`
      );
      
      console.log(chalk.blue(`  📹 Generating: ${preset} + ${layout} + "${text}"`));
      
      try {
        await generateSingleDemo({
          text,
          preset,
          layout,
          format: options.format,
          quality: options.quality,
          duration: parseInt(options.duration),
          width: parseInt(options.width),
          height: parseInt(options.height),
          output: outputPath
        });
        
        completed++;
        const progress = Math.round((completed / total) * 100);
        console.log(chalk.green(`    ✅ Completed (${progress}%)`));
        
      } catch (error) {
        console.error(chalk.red(`    ❌ Failed: ${error.message}`));
      }
    }
  }
}

// Generate social media optimized versions
async function generateSocialMediaVersions(presets, options) {
  console.log(chalk.yellow('📱 Generating social media versions...'));
  
  const socialConfigs = [
    {
      name: 'tiktok',
      width: 1080,
      height: 1920,
      duration: 6,
      format: 'mp4'
    },
    {
      name: 'instagram-story',
      width: 1080,
      height: 1920,
      duration: 8,
      format: 'mp4'
    },
    {
      name: 'instagram-post',
      width: 1080,
      height: 1080,
      duration: 5,
      format: 'mp4'
    },
    {
      name: 'twitter',
      width: 1200,
      height: 675,
      duration: 4,
      format: 'mp4'
    },
    {
      name: 'youtube-short',
      width: 1080,
      height: 1920,
      duration: 10,
      format: 'mp4'
    }
  ];
  
  for (const preset of presets) {
    for (const config of socialConfigs) {
      const text = getRandomText();
      const outputPath = path.join(
        OUTPUT_DIR,
        'social',
        `${preset}-${config.name}.${config.format}`
      );
      
      console.log(chalk.blue(`  📱 Generating: ${preset} for ${config.name}`));
      
      try {
        await generateSingleDemo({
          text,
          preset,
          layout: 'grid', // Use grid for social media
          format: config.format,
          quality: 'high',
          duration: config.duration,
          width: config.width,
          height: config.height,
          output: outputPath,
          optimizeForMobile: true
        });
        
        console.log(chalk.green(`    ✅ ${config.name} version created`));
        
      } catch (error) {
        console.error(chalk.red(`    ❌ Failed ${config.name}: ${error.message}`));
      }
    }
  }
}

// Generate thumbnail images
async function generateThumbnails(presets, layouts) {
  console.log(chalk.yellow('🖼️  Generating thumbnails...'));
  
  for (const preset of presets) {
    for (const layout of layouts) {
      const text = getRandomText();
      const outputPath = path.join(
        OUTPUT_DIR,
        'thumbnails',
        `${preset}-${layout}-thumb.png`
      );
      
      console.log(chalk.blue(`  🖼️  Generating thumbnail: ${preset} + ${layout}`));
      
      try {
        await generateThumbnail({
          text,
          preset,
          layout,
          width: 400,
          height: 300,
          output: outputPath
        });
        
        console.log(chalk.green(`    ✅ Thumbnail created`));
        
      } catch (error) {
        console.error(chalk.red(`    ❌ Thumbnail failed: ${error.message}`));
      }
    }
  }
}

// Generate a single demo
async function generateSingleDemo(config) {
  const { spawn } = await import('child_process');
  
  return new Promise((resolve, reject) => {
    const args = [
      path.join(__dirname, 'cli.js'),
      config.text,
      '--preset', config.preset,
      '--layout', config.layout,
      '--format', config.format,
      '--quality', config.quality,
      '--duration', config.duration.toString(),
      '--width', config.width.toString(),
      '--height', config.height.toString(),
      '--output', config.output
    ];
    
    if (config.optimizeForMobile) {
      args.push('--mobile-optimized');
    }
    
    const process = spawn('node', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(errorOutput || `Process exited with code ${code}`));
      }
    });
    
    // Timeout after 2 minutes
    setTimeout(() => {
      process.kill('SIGTERM');
      reject(new Error('Demo generation timed out'));
    }, 2 * 60 * 1000);
  });
}

// Generate thumbnail image
async function generateThumbnail(config) {
  // Create a simplified version for thumbnail
  return generateSingleDemo({
    ...config,
    format: 'png',
    duration: 0.1, // Very short for static frame
    quality: 'medium'
  });
}

// Get random demo text
function getRandomText() {
  return DEMO_TEXTS[Math.floor(Math.random() * DEMO_TEXTS.length)];
}

// Generate demo index HTML page
async function generateDemoIndex(presets, layouts) {
  console.log(chalk.yellow('📄 Generating demo index...'));
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeStorm Demo Gallery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        h1 {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        
        .subtitle {
            font-size: 1.2rem;
            color: #aaaaaa;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .section {
            margin-bottom: 80px;
        }
        
        .section-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .demo-card {
            background: #1a1a1a;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #333;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .demo-card:hover {
            transform: translateY(-5px);
            border-color: #00ffff;
        }
        
        .demo-media {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #333;
        }
        
        .demo-info {
            padding: 20px;
        }
        
        .demo-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: capitalize;
        }
        
        .demo-description {
            color: #aaaaaa;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        
        .demo-links {
            display: flex;
            gap: 10px;
        }
        
        .demo-link {
            display: inline-block;
            padding: 8px 16px;
            background: #333;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.8rem;
            transition: background 0.3s ease;
        }
        
        .demo-link:hover {
            background: #00ffff;
            color: #000;
        }
        
        .social-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .stats {
            text-align: center;
            margin-top: 60px;
            padding: 40px;
            background: #1a1a1a;
            border-radius: 12px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 800;
            color: #00ffff;
        }
        
        .stat-label {
            color: #aaaaaa;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 20px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🌪️ TypeStorm Demo Gallery</h1>
            <p class="subtitle">
                Explore all TypeStorm animation presets and layouts. 
                Each demo showcases the unique visual style and animation capabilities.
            </p>
        </header>
        
        <section class="section">
            <h2 class="section-title">🎨 Preset Demonstrations</h2>
            <div class="grid">
                ${generatePresetCards(presets, layouts)}
            </div>
        </section>
        
        <section class="section">
            <h2 class="section-title">📱 Social Media Ready</h2>
            <div class="social-grid">
                ${generateSocialCards(presets)}
            </div>
        </section>
        
        <section class="stats">
            <h2>Gallery Statistics</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${presets.length}</div>
                    <div class="stat-label">Animation Presets</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${layouts.length}</div>
                    <div class="stat-label">Layout Systems</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${presets.length * layouts.length}</div>
                    <div class="stat-label">Demo Combinations</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${presets.length * 5}</div>
                    <div class="stat-label">Social Media Versions</div>
                </div>
            </div>
        </section>
    </div>
    
    <script>
        // Add loading states for media
        document.querySelectorAll('.demo-media').forEach(media => {
            media.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            media.addEventListener('error', function() {
                this.style.background = '#ff4444';
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';
                this.textContent = 'Demo not available';
            });
        });
        
        // Analytics tracking (if available)
        document.querySelectorAll('.demo-link').forEach(link => {
            link.addEventListener('click', function() {
                const preset = this.dataset.preset;
                const layout = this.dataset.layout;
                const format = this.dataset.format;
                
                // Track demo views
                if (typeof gtag === 'function') {
                    gtag('event', 'demo_view', {
                        preset: preset,
                        layout: layout,
                        format: format
                    });
                }
            });
        });
    </script>
</body>
</html>
  `;
  
  const indexPath = path.join(OUTPUT_DIR, 'index.html');
  await fs.writeFile(indexPath, htmlContent.trim());
  
  console.log(chalk.green(`✅ Demo index created: ${indexPath}`));
}

// Generate preset demonstration cards
function generatePresetCards(presets, layouts) {
  const presetDescriptions = {
    neon: 'Vibrant glowing effects with electric particles and pulsing animations',
    liquid: 'Fluid morphing text with wave animations and color gradients',
    fire: 'Burning text effects with realistic flame particles and heat distortion',
    glitch: 'Digital corruption with RGB channel separation and data noise',
    'vf-morph': 'Variable font morphing with dynamic weight and width changes'
  };
  
  return presets.map(preset => {
    return layouts.map(layout => `
      <div class="demo-card">
        <img class="demo-media" 
             src="thumbnails/${preset}-${layout}-thumb.png" 
             alt="${preset} preset with ${layout} layout"
             loading="lazy" />
        <div class="demo-info">
          <h3 class="demo-title">${preset} + ${layout}</h3>
          <p class="demo-description">${presetDescriptions[preset]}</p>
          <div class="demo-links">
            <a href="gifs/${preset}-${layout}-demo.gif" 
               class="demo-link" 
               data-preset="${preset}" 
               data-layout="${layout}" 
               data-format="gif">
               🎬 GIF
            </a>
            <a href="videos/${preset}-${layout}-demo.mp4" 
               class="demo-link"
               data-preset="${preset}" 
               data-layout="${layout}" 
               data-format="mp4">
               📹 MP4
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }).join('');
}

// Generate social media cards
function generateSocialCards(presets) {
  const socialPlatforms = [
    { name: 'TikTok', format: 'tiktok', icon: '🎵' },
    { name: 'Instagram Story', format: 'instagram-story', icon: '📸' },
    { name: 'Instagram Post', format: 'instagram-post', icon: '📷' },
    { name: 'Twitter', format: 'twitter', icon: '🐦' },
    { name: 'YouTube Short', format: 'youtube-short', icon: '📺' }
  ];
  
  return socialPlatforms.map(platform => `
    <div class="demo-card">
      <div class="demo-info">
        <h3 class="demo-title">${platform.icon} ${platform.name}</h3>
        <p class="demo-description">Optimized for ${platform.name} specifications and audience</p>
        <div class="demo-links">
          ${presets.map(preset => `
            <a href="social/${preset}-${platform.format}.mp4" 
               class="demo-link"
               data-preset="${preset}" 
               data-platform="${platform.format}">
               ${preset}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// Generate marketing captions for social media
async function generateMarketingCaptions(presets) {
  console.log(chalk.yellow('📝 Generating marketing captions...'));
  
  const captions = {
    neon: {
      short: "✨ Electric vibes with TypeStorm's NEON preset! #TypeStorm #Animation #Neon",
      medium: "🌟 Bring your text to life with electric neon effects! TypeStorm's NEON preset creates stunning glowing animations perfect for your content. #TypeStorm #TextAnimation #NeonVibes #ContentCreator",
      long: "⚡ Transform ordinary text into extraordinary visual experiences! TypeStorm's NEON preset delivers stunning electric effects with:\n\n🔹 Vibrant glowing animations\n🔹 Electric particle systems\n🔹 Pulsing color effects\n🔹 Professional quality output\n\nPerfect for social media, presentations, and creative projects. Try TypeStorm today! #TypeStorm #Animation #NeonText #VisualEffects #ContentCreation #SocialMedia"
    },
    
    liquid: {
      short: "🌊 Fluid magic with TypeStorm's LIQUID preset! #TypeStorm #Animation #Liquid",
      medium: "💧 Create mesmerizing fluid text animations! TypeStorm's LIQUID preset brings organic, flowing movement to your words. Perfect for modern, dynamic content. #TypeStorm #FluidAnimation #TextEffects #CreativeTools",
      long: "🌊 Dive into fluid creativity with TypeStorm's LIQUID preset!\n\n✨ Features:\n🔹 Smooth morphing animations\n🔹 Wave-like text distortions\n🔹 Gradient color transitions\n🔹 Organic, natural movement\n\nCreate content that flows as beautifully as water. Whether it's for social media, presentations, or artistic projects - LIQUID brings your text to life! #TypeStorm #LiquidAnimation #FluidText #MotionGraphics #DigitalArt"
    },
    
    fire: {
      short: "🔥 Blazing text with TypeStorm's FIRE preset! #TypeStorm #Animation #Fire",
      medium: "🔥 Set your content ablaze! TypeStorm's FIRE preset creates realistic burning text effects with flame particles and heat distortion. Ignite your creativity! #TypeStorm #FireAnimation #BurningText #VisualEffects",
      long: "🔥 Ignite your content with TypeStorm's FIRE preset!\n\n🌟 Realistic fire effects:\n🔹 Dancing flame particles\n🔹 Heat distortion effects\n🔹 Flickering animations\n🔹 Ember trail systems\n\nPerfect for dramatic reveals, product launches, or any content that needs that extra spark! Professional quality, easy to use. #TypeStorm #FireEffects #BurningText #DramaticReveal #ContentMarketing"
    },
    
    glitch: {
      short: "⚡ Digital chaos with TypeStorm's GLITCH preset! #TypeStorm #Animation #Glitch",
      medium: "📺 Embrace the digital aesthetic! TypeStorm's GLITCH preset delivers authentic digital corruption effects with RGB separation and data noise. Perfect for tech content! #TypeStorm #GlitchArt #DigitalEffects #TechVibes",
      long: "⚡ Enter the digital realm with TypeStorm's GLITCH preset!\n\n🖥️ Authentic digital effects:\n🔹 RGB channel separation\n🔹 Data corruption visuals\n🔹 Scan line distortions\n🔹 Digital noise overlays\n\nPerfect for tech reviews, gaming content, cyberpunk aesthetics, or any project needing that digital edge. #TypeStorm #GlitchEffects #DigitalArt #Cyberpunk #TechContent #Gaming"
    },
    
    'vf-morph': {
      short: "🔤 Typography magic with TypeStorm's VF-MORPH preset! #TypeStorm #Animation #Typography",
      medium: "✨ Watch letters transform! TypeStorm's VF-MORPH preset uses variable fonts to create smooth weight and width transitions. Pure typography elegance! #TypeStorm #VariableFonts #Typography #TextAnimation",
      long: "🔤 Experience typography like never before with TypeStorm's VF-MORPH preset!\n\n📝 Variable font features:\n🔹 Smooth weight transitions\n🔹 Dynamic width morphing\n🔹 Elegant font animations\n🔹 Typography-focused design\n\nPerfect for designers, typographers, and anyone who appreciates the art of letterforms. Create sophisticated animations that celebrate the beauty of type! #TypeStorm #VariableFonts #Typography #DesignTools #MotionDesign"
    }
  };
  
  const captionsPath = path.join(OUTPUT_DIR, 'marketing-captions.json');
  await fs.writeFile(captionsPath, JSON.stringify(captions, null, 2));
  
  // Also create markdown file for easy copying
  const markdownContent = Object.entries(captions).map(([preset, content]) => `
## ${preset.toUpperCase()} Preset Captions

### Short (Tweet-length)
${content.short}

### Medium (Instagram caption)
${content.medium}

### Long (Full description)
${content.long}

---
  `).join('\n');
  
  const markdownPath = path.join(OUTPUT_DIR, 'marketing-captions.md');
  await fs.writeFile(markdownPath, `# TypeStorm Marketing Captions\n\nReady-to-use social media captions for each preset.\n${markdownContent}`);
  
  console.log(chalk.green(`✅ Marketing captions generated`));
}

program.parse();