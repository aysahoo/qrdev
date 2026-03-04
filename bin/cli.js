#!/usr/bin/env node

const qrcode = require('./qr');
const { networkInterfaces } = require('os');
const { spawn } = require('child_process');

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
}

function detectPort(output) {
  const patterns = [
    /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\d{1,3}(?:\.\d{1,3}){3}):(\d{4,5})/i,
    /(?:port|listening on)[:\s]*(\d{4,5})/i,
    /localhost:(\d{4,5})/i,
    /:(\d{4,5})/,
  ];
  for (const re of patterns) {
    const match = output.match(re);
    if (match) return match[1];
  }
  return null;
}

const [, , cmd, ...args] = process.argv;
const pkg = require('../package.json');

if (cmd === '--version' || cmd === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (!cmd || cmd === '--help' || cmd === '-h') {
  console.log(`qrdev v${pkg.version}\n`);
  console.log('Wrap any dev server command and get a QR code for LAN access.\n');
  console.log('Usage:  qrdev <command> [args...]\n');
  console.log('Examples:');
  console.log('  qrdev npm run dev');
  console.log('  qrdev vite');
  console.log('  qrdev next dev');
  console.log('  qrdev bun run dev');
  console.log('  qrdev python -m http.server 8000\n');
  console.log('Flags:');
  console.log('  -v, --version   Show version number');
  console.log('  -h, --help      Show this help message');
  process.exit(cmd ? 0 : 1);
}

console.log(`\n🚀 Running: ${cmd} ${args.join(' ')}\n`);

const server = spawn(cmd, args, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

let qrShown = false;
let outputBuffer = '';

function tryShowQR(chunk) {
  if (qrShown) return;

  outputBuffer += chunk;

  const port = detectPort(outputBuffer);
  if (port) {
    qrShown = true;
    outputBuffer = '';
    const ip = getLocalIP();
    const url = `http://${ip}:${port}`;

    console.log(`\n📱 Scan to open on any device`);
    console.log(`🌐 ${url}`);
    console.log(`⚠️  Make sure both devices are on the same Wi-Fi/network\n`);
    qrcode.generate(url);
  }

  if (outputBuffer.length > 4096) {
    outputBuffer = outputBuffer.slice(-2048);
  }
}

server.stdout.on('data', (data) => {
  process.stdout.write(data);
  tryShowQR(data.toString());
});

server.stderr.on('data', (data) => {
  process.stderr.write(data);
  tryShowQR(data.toString());
});

server.on('exit', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});
