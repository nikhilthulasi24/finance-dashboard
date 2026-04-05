#!/usr/bin/env node

/**
 * Custom dev server that bypasses PostCSS configuration issues
 * Run with: node dev-server.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Start Vite dev server
console.log('🚀 Starting Finance Dashboard...\n');
console.log('📍 Opening at: http://localhost:5173\n');

const vite = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Disable PostCSS
    POSTCSS_DISABLE_LOADER: 'true'
  }
});

vite.on('error', (err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log('\nServer closed with code:', code);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  vite.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  vite.kill();
  process.exit(0);
});
