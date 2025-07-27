#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Available presets and layouts
const PRESETS = ['neon', 'liquid', 'fire', 'glitch', 'vf-morph'];
const LAYOUTS = ['spiral', 'radial', 'grid'];
const FORMATS = ['mp4', 'webm', 'gif'];

program
  .name('typestorm')
  .description('Generate animated text reels with TypeStorm')
  .version('1.0.0');

// Main reel command
program
  .argument('[text]', 'Text to animate')
  .option('-p, --preset <preset>', 'Animation preset', 'neon')
  .option('-l, --layout <layout>', 'Text layout', 'grid')
  .option('-f, --format <format>', 'Output format', 'mp4')
  .option('-d, --duration <seconds>', 'Animation duration', '5')
  .option('-o, --output <filename>', 'Output filename')
  .option('--fps <fps>', 'Frames per second', '30')
  .option('--width <width>', 'Canvas width', '1080')
  .option('--height <height>', 'Canvas height', '1920')
  .option('--quality <quality>', 'Video quality (low/medium/high/ultra)', 'high')
  .action(async (text, options) => {
    // Handle subcommands
    if (text === 'list') {
      return listCommand();
    }
    
    if (text === 'interactive') {
      return interactiveCommand();
    }
    
    if (!text) {
      console.error(chalk.red('❌ Please provide text to animate'));
      console.log(chalk.yellow('Usage: npm run reel "Your text here" --preset neon'));
      console.log(chalk.yellow('   or: npm run reel list (to see available options)'));
      console.log(chalk.yellow('   or: npm run reel interactive (for interactive mode)'));
      process.exit(1);
    }
    console.log(chalk.blue.bold('🌪️  TypeStorm Reel Generator'));
    console.log(chalk.gray('━'.repeat(50)));
    
    // Validate options
    if (!PRESETS.includes(options.preset)) {
      console.error(chalk.red(`❌ Invalid preset: ${options.preset}`));
      console.log(chalk.yellow(`Available presets: ${PRESETS.join(', ')}`));
      process.exit(1);
    }
    
    if (!LAYOUTS.includes(options.layout)) {
      console.error(chalk.red(`❌ Invalid layout: ${options.layout}`));
      console.log(chalk.yellow(`Available layouts: ${LAYOUTS.join(', ')}`));
      process.exit(1);
    }
    
    if (!FORMATS.includes(options.format)) {
      console.error(chalk.red(`❌ Invalid format: ${options.format}`));
      console.log(chalk.yellow(`Available formats: ${FORMATS.join(', ')}`));
      process.exit(1);
    }
    
    // Validate quality
    const QUALITIES = ['low', 'medium', 'high', 'ultra'];
    if (!QUALITIES.includes(options.quality)) {
      console.error(chalk.red(`❌ Invalid quality: ${options.quality}`));
      console.log(chalk.yellow(`Available qualities: ${QUALITIES.join(', ')}`));
      process.exit(1);
    }
    
    // Generate default output filename if not provided
    if (!options.output) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      options.output = path.join('dist', `reel.${options.format}`);
    }
    
    // Ensure output is in dist directory
    if (!options.output.startsWith('dist/')) {
      const outputDir = path.dirname(options.output);
      const outputFile = path.basename(options.output);
      options.output = path.join('dist', outputFile);
    }
    
    console.log(chalk.green('📝 Configuration:'));
    console.log(`   Text: "${text}"`);
    console.log(`   Preset: ${options.preset}`);
    console.log(`   Layout: ${options.layout}`);
    console.log(`   Format: ${options.format}`);
    console.log(`   Duration: ${options.duration}s`);
    console.log(`   Output: ${options.output}`);
    console.log(`   Canvas: ${options.width}x${options.height}`);
    console.log(`   FPS: ${options.fps}`);
    console.log('');
    
    try {
      // Generate the reel
      await generateReel({
        text,
        preset: options.preset,
        layout: options.layout,
        format: options.format,
        duration: parseInt(options.duration),
        output: options.output,
        fps: parseInt(options.fps),
        width: parseInt(options.width),
        height: parseInt(options.height),
        quality: options.quality,
      });
      
      console.log(chalk.green.bold(`✅ Reel generated successfully: ${options.output}`));
      
    } catch (error) {
      console.error(chalk.red.bold('❌ Error generating reel:'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// List command function
function listCommand() {
  console.log(chalk.blue.bold('🌪️  TypeStorm Assets'));
  console.log(chalk.gray('━'.repeat(30)));
  
  console.log(chalk.yellow.bold('🎨 Presets:'));
  PRESETS.forEach(preset => {
    console.log(`   • ${preset} - ${getPresetDescription(preset)}`);
  });
  
  console.log('');
  console.log(chalk.cyan.bold('📐 Layouts:'));
  LAYOUTS.forEach(layout => {
    console.log(`   • ${layout} - ${getLayoutDescription(layout)}`);
  });
  
  console.log('');
  console.log(chalk.magenta.bold('🎬 Formats:'));
  FORMATS.forEach(format => {
    console.log(`   • ${format}`);
  });
  
  console.log('');
  console.log(chalk.green.bold('💎 Quality Levels:'));
  ['low', 'medium', 'high', 'ultra'].forEach(quality => {
    console.log(`   • ${quality}`);
  });
}

// Interactive command function
async function interactiveCommand() {
  console.log(chalk.blue.bold('🌪️  TypeStorm Interactive Mode'));
  console.log(chalk.gray('━'.repeat(40)));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: 'Enter the text to animate:',
      validate: input => input.length > 0 || 'Text cannot be empty',
    },
    {
      type: 'list',
      name: 'preset',
      message: 'Choose an animation preset:',
      choices: PRESETS.map(preset => ({
        name: `${preset} - ${getPresetDescription(preset)}`,
        value: preset,
      })),
    },
    {
      type: 'list',
      name: 'layout',
      message: 'Choose a text layout:',
      choices: LAYOUTS.map(layout => ({
        name: `${layout} - ${getLayoutDescription(layout)}`,
        value: layout,
      })),
    },
    {
      type: 'list',
      name: 'format',
      message: 'Choose output format:',
      choices: FORMATS,
    },
    {
      type: 'list',
      name: 'quality',
      message: 'Choose quality level:',
      choices: ['low', 'medium', 'high', 'ultra'],
      default: 'high',
    },
    {
      type: 'number',
      name: 'duration',
      message: 'Animation duration (seconds):',
      default: 5,
      validate: input => input > 0 || 'Duration must be greater than 0',
    },
    {
      type: 'input',
      name: 'output',
      message: 'Output filename (leave empty for default):',
      default: '',
    },
  ]);
  
  // Generate default filename if not provided
  if (!answers.output) {
    answers.output = path.join('dist', `reel.${answers.format}`);
  } else if (!answers.output.startsWith('dist/')) {
    const outputFile = path.basename(answers.output);
    answers.output = path.join('dist', outputFile);
  }
  
  try {
    await generateReel({
      text: answers.text,
      preset: answers.preset,
      layout: answers.layout,
      format: answers.format,
      duration: answers.duration,
      output: answers.output,
      fps: 30,
      width: 1080,
      height: 1920,
      quality: answers.quality,
    });
    
    console.log(chalk.green.bold(`✅ Reel generated successfully: ${answers.output}`));
    
  } catch (error) {
    console.error(chalk.red.bold('❌ Error generating reel:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

// Helper function to generate reel
async function generateReel(config) {
  const { spawn } = await import('child_process');
  
  console.log(chalk.yellow('🔧 Initializing video generation...'));
  
  // Validate configuration
  if (!config.text || config.text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }
  
  if (config.duration <= 0) {
    throw new Error('Duration must be greater than 0');
  }
  
  // Create a temporary HTML file for puppeteer
  const tempHtml = createTempHTML(config);
  const tempPath = path.join(__dirname, 'temp-reel.html');
  const outputPath = path.resolve(config.output);
  
  try {
    fs.writeFileSync(tempPath, tempHtml);
    console.log(chalk.green('📄 Temporary HTML file created'));
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(chalk.green(`📁 Created output directory: ${outputDir}`));
    }
    
    console.log(chalk.yellow('🚀 Starting headless browser...'));
    
    return new Promise((resolve, reject) => {
      let hasErrored = false;
      let outputBuffer = '';
      let errorBuffer = '';
      
      // Use puppeteer to generate the reel
      const puppeteerProcess = spawn('node', [
        path.join(__dirname, 'puppeteer-renderer.js'),
        tempPath,
        outputPath,
        JSON.stringify(config)
      ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production' }
      });
      
      // Handle stdout
      puppeteerProcess.stdout.on('data', (data) => {
        const text = data.toString();
        outputBuffer += text;
        
        // Show progress messages
        const lines = text.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.includes('🚀') || line.includes('📄') || line.includes('⏳') || 
              line.includes('🎬') || line.includes('💾') || line.includes('✅')) {
            console.log(chalk.gray(line));
          }
        });
      });
      
      // Handle stderr
      puppeteerProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorBuffer += text;
        
        // Only show critical errors, not warnings
        const lines = text.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.includes('Error:') || line.includes('Fatal:') || line.includes('❌')) {
            console.error(chalk.red(line));
            hasErrored = true;
          }
        });
      });
      
      // Handle process completion
      puppeteerProcess.on('close', (code, signal) => {
        // Clean up temp file
        try {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        } catch (cleanupError) {
          console.warn(chalk.yellow(`⚠️  Could not clean up temp file: ${cleanupError.message}`));
        }
        
        if (signal) {
          reject(new Error(`Process was killed with signal ${signal}`));
          return;
        }
        
        if (code === 0 && !hasErrored) {
          // Verify output file was created
          if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
            console.log(chalk.green(`📊 Output file size: ${sizeInMB} MB`));
            resolve();
          } else {
            reject(new Error('Output file was not created'));
          }
        } else {
          const errorMessage = errorBuffer.trim() || outputBuffer.trim() || `Process exited with code ${code}`;
          reject(new Error(`Video generation failed: ${errorMessage}`));
        }
      });
      
      // Handle process errors
      puppeteerProcess.on('error', (error) => {
        hasErrored = true;
        reject(new Error(`Failed to start puppeteer process: ${error.message}`));
      });
      
      // Timeout after 5 minutes
      const timeout = setTimeout(() => {
        hasErrored = true;
        puppeteerProcess.kill('SIGTERM');
        reject(new Error('Video generation timed out after 5 minutes'));
      }, 5 * 60 * 1000);
      
      // Clear timeout on completion
      puppeteerProcess.on('close', () => {
        clearTimeout(timeout);
      });
    });
    
  } catch (error) {
    // Clean up temp file on error
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (cleanupError) {
      console.warn(chalk.yellow(`⚠️  Could not clean up temp file: ${cleanupError.message}`));
    }
    
    throw new Error(`Failed to generate reel: ${error.message}`);
  }
}

// Create temporary HTML for rendering
function createTempHTML(config) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeStorm CLI Renderer</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        #canvas {
            display: block;
            background: #000;
        }
        #text-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        }
    </style>
    
    <!-- Load local dependencies -->
    <script src="file://${path.join(__dirname, 'vendor', 'gsap.min.js')}"></script>
</head>
<body>
    <canvas id="canvas" width="${config.width}" height="${config.height}"></canvas>
    <div id="text-container"></div>
    
    <script>
        window.TYPESTORM_CONFIG = ${JSON.stringify(config)};
    </script>
    
    <!-- Load Simple TypeStorm Renderer -->
    <script src="file://${path.join(__dirname, 'simple-renderer.js')}"></script>
</body>
</html>
  `;
}

// Helper functions for descriptions
function getPresetDescription(preset) {
  const descriptions = {
    neon: 'Glowing neon effect with vibrant colors',
    liquid: 'Fluid morphing text with liquid effects',
    fire: 'Burning text with flame particles',
    glitch: 'Digital glitch with RGB separation',
    'vf-morph': 'Variable font morphing animation',
  };
  return descriptions[preset] || '';
}

function getLayoutDescription(layout) {
  const descriptions = {
    spiral: 'Text arranged in a spiral pattern',
    radial: 'Text arranged in a circle',
    grid: 'Text arranged in a grid pattern',
  };
  return descriptions[layout] || '';
}

// Add dependencies check command
program
  .command('check')
  .description('Check system dependencies')
  .action(() => {
    console.log(chalk.blue.bold('🔍 Checking TypeStorm Dependencies'));
    console.log(chalk.gray('━'.repeat(40)));
    
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`Node.js: ${nodeVersion} ${nodeVersion >= 'v16.0.0' ? '✅' : '❌'}`);
    
    // Check if required packages are installed
    const requiredPackages = ['puppeteer', 'commander', 'inquirer', 'chalk'];
    
    requiredPackages.forEach(pkg => {
      try {
        require.resolve(pkg);
        console.log(`${pkg}: ✅ Installed`);
      } catch (e) {
        console.log(`${pkg}: ❌ Missing - run 'npm install ${pkg}'`);
      }
    });
  });

program.parse();