<p align="center">
  <h1 align="center">qrdev</h1>
  <p align="center">Instantly access your dev server from any device on your network.</p>
  <p align="center">
    <a href="https://www.npmjs.com/package/qrdev"><img src="https://img.shields.io/npm/v/qrdev?color=blue&label=npm" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/qrdev"><img src="https://img.shields.io/npm/dm/qrdev?color=green" alt="downloads"></a>
    <a href="https://github.com/aysahoo/devqr/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/qrdev" alt="license"></a>
    <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="zero dependencies">
  </p>
</p>

---

Just prepend `qrdev` to your dev command. It runs your server, detects the port, and shows a **QR code** you can scan from any device on the same network.

> No config. No framework lock-in. Works with everything.

---

## Install

### Global (use anywhere)

```bash
npm i -g qrdev
```

### Local (per project)

```bash
npm i -D qrdev
```

Then update your `package.json` scripts to use `qrdev` seamlessly:

```json
{
  "scripts": {
    "dev": "qrdev <your-dev-command>"
  }
}
```

For example:

```json
"dev": "qrdev vite"
"dev": "qrdev next dev"
"dev": "qrdev node server.js"
"dev": "qrdev python -m http.server 8000"
```

Now `npm run dev` / `bun run dev` will automatically show a QR code — no extra steps needed.

---

## Usage

```bash
qrdev <command>
```

Works with **any** dev server or package manager:

```bash
qrdev npm run dev
qrdev bun run dev
qrdev yarn dev
qrdev pnpm dev
qrdev node server.js
qrdev python -m http.server 8000
```

---

## What you'll see

```
Running: npm run dev

<your dev server output>

Scan to open on any device
http://<your-local-ip>:<port>
Make sure both devices are on the same Wi-Fi/network

[ QR code appears here ]
```

---

## How it works

| Step | What happens |
|------|-------------|
| 1 | Spawns your command as a child process |
| 2 | Watches stdout/stderr for a port (`localhost:3000`, `:5173`, etc.) |
| 3 | Detects your local network IP |
| 4 | Generates a QR code pointing to `http://<your-ip>:<port>` |

---

## Requirements

- **Node.js** >= 14
- Both devices must be on the **same Wi-Fi / local network**

---

## Contributing

Issues and PRs welcome at [github.com/aysahoo/devqr](https://github.com/aysahoo/devqr)

## License

MIT — [Ayush Ranjan Sahoo](https://github.com/aysahoo)
