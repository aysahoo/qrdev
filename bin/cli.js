#!/usr/bin/env node

const qrcode = require('qrcode-terminal');
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
  const match = output.match(/(?:localhost:|port\s|:)(\d{4,5})/i);
  return match ? match[1] : null;
}

const [, , cmd, ...args] = process.argv;

if (!cmd) {
  console.log('Usage: devqr <command>');
  console.log('Example: devqr npm run dev');
  console.log('Example: devqr bun run dev');
  process.exit(1);
}

console.log(`\n🚀 Running: ${cmd} ${args.join(' ')}\n`);

const server = spawn(cmd, args, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

let qrShown = false;

function tryShowQR(output) {
  if (qrShown) return;

  const port = detectPort(output);
  if (port) {
    qrShown = true;
    const ip = getLocalIP();
    const url = `http://${ip}:${port}`;

    console.log(`\n📱 Scan to open on any device`);
    console.log(`🌐 ${url}`);
    console.log(`⚠️  Make sure both devices are on the same Wi-Fi/network\n`);
    qrcode.generate(url, { small: true });
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
