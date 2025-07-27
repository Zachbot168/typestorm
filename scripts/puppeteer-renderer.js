#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const [,, htmlPath, outputPath, configJson] = process.argv;

if (!htmlPath || !outputPath || !configJson) {
  console.error('Usage: node puppeteer-renderer.js <htmlPath> <outputPath> <config>');
  process.exit(1);
}

const config = JSON.parse(configJson);

async function renderVideo() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Starting Puppeteer browser...');
    
    // Launch browser with optimized settings
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--allow-running-insecure-content',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        `--window-size=${config.width},${config.height}`,
      ],
      defaultViewport: {
        width: config.width,
        height: config.height,
        deviceScaleFactor: 1,
      },
    });

    page = await browser.newPage();
    
    // Set viewport to match canvas dimensions
    await page.setViewport({
      width: config.width,
      height: config.height,
      deviceScaleFactor: 1,
    });

    console.log('📄 Loading HTML page...');
    await page.goto(`file://${path.resolve(htmlPath)}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('⏳ Waiting for TypeStorm initialization...');
    
    // Wait for TypeStorm CLI Bridge to be ready
    await page.waitForFunction(() => {
      return window.TypeStormRenderer;
    }, { timeout: 60000 });

    console.log('🎬 Starting animation and video capture...');
    
    // Start the animation and capture process
    const result = await page.evaluate(async (renderConfig) => {
      try {
        // Initialize renderer with config
        const renderer = window.TypeStormRenderer;
        await renderer.initialize(renderConfig);
        
        // Generate animation
        await renderer.applyPreset(
          renderConfig.text,
          renderConfig.preset,
          {
            layoutType: renderConfig.layout,
            layoutOptions: {}
          }
        );
        
        // Export video
        const blob = await renderer.exportVideo({
          format: renderConfig.format,
          quality: renderConfig.quality,
          fps: renderConfig.fps,
          duration: renderConfig.duration,
          width: renderConfig.width,
          height: renderConfig.height,
        });
        
        // Convert blob to base64 for transfer
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        return {
          success: true,
          data: base64,
          size: blob.size,
          type: blob.type,
        };
        
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack,
        };
      }
    }, config);

    if (!result.success) {
      throw new Error(`Animation failed: ${result.error}`);
    }

    console.log('💾 Saving video file...');
    
    // Convert base64 back to buffer and save
    const videoBuffer = Buffer.from(result.data, 'base64');
    const outputDir = path.dirname(outputPath);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, videoBuffer);
    
    console.log(`✅ Video saved: ${outputPath}`);
    console.log(`📊 File size: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error during rendering:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
    
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️ Process interrupted, cleaning up...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught exception:', error);
  process.exit(1);
});

// Start rendering
renderVideo().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});