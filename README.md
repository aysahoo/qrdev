# devqr

Wrap any dev server command and instantly get a QR code for LAN access.

No config. No framework lock-in. Just prepend `devqr`.

## Install

```bash
npm i -g devqr
```

## Usage

```bash
devqr <command>
```

Works with any dev server:

```bash
devqr npm run dev
devqr bun run dev
devqr yarn dev
devqr pnpm dev
devqr node server.js
```

## Output

```
🚀 Running: npm run dev

▲ Next.js ready on http://localhost:3000

📱 Scan to open on any device
🌐 http://192.168.1.45:3000
⚠️  Make sure both devices are on the same Wi-Fi/network

█████████████████████████████
█████████████████████████████
████ ▄▄▄▄▄ █▄█▄█ ▄▄▄▄▄ ████
████ █   █ █▄▄ █ █   █ ████
████ █▄▄▄█ █ ▄ █ █▄▄▄█ ████
█████████████████████████████
```

## How it works

1. Runs your command as a child process
2. Watches stdout/stderr for a port (e.g. `localhost:3000`, `:5173`)
3. Detects your local network IP
4. Generates a QR code pointing to `http://<your-ip>:<port>`

Scan the QR from any device on the same Wi-Fi and you're in.

## Requirements

- Node.js >= 14
- Both devices must be on the **same Wi-Fi / local network**

## License

MIT
