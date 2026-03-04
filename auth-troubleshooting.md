# Authentication Issues on Local Network

If you are using `qrdev` to access your development server from another device (like a phone) and find that you cannot log in or stay authenticated, it is almost certainly due to **Secure Cookies**.

## The Problem

Modern authentication libraries (like NextAuth.js, Supabase, Firebase) often set session cookies with the `Secure` flag enabled by default. 

Browsers have a strict security policy: they will **only** send `Secure` cookies if the connection is encrypted via **HTTPS**, or if the host is `localhost`.

When you connect from your phone over your local network, the URL looks something like this:
`http://192.168.1.10:3000`

Because this is a non-`localhost` connection over HTTP, your phone's browser will refuse to send the authentication cookie back to your dev server. As a result, the server thinks you are not logged in.

## How to Fix It

Since `qrdev` is designed to be a zero-dependency wrapper that simply exposes your existing development port, it does not inject SSL certificates. 

To fix this, you have two main options:

### Option 1: Run your dev server with HTTPS

The easiest way to get `Secure` cookies working on other devices is to run your development server over HTTPS. Many modern frameworks have built-in support for generating self-signed certificates.

#### Next.js
If you are using Next.js, you can use the experimental HTTPS feature:
```bash
# In your package.json
"dev": "qrdev next dev --experimental-https"
```

#### Vite
If you are using Vite (React, Vue, Svelte), you can use the `@vitejs/plugin-basic-ssl` plugin:
1. Install it: `npm i -D @vitejs/plugin-basic-ssl`
2. Add it to your `vite.config.js`:
```js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [
    basicSsl()
  ]
}
```
3. Run as normal: `qrdev vite`

*Note: Your phone's browser will likely show a "Connection is not private" warning because it's a self-signed certificate. You can usually bypass this by clicking "Advanced" -> "Proceed anyway".*

### Option 2: Disable the Secure flag in Development

If you don't want to use HTTPS locally, you can configure your authentication library to not use the `Secure` flag when running in development mode.

#### NextAuth.js Example
You can override the cookie policies in your NextAuth configuration based on the environment:
```typescript
{
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' // Only secure in production
      }
    }
  }
}
```
*Note: The exact configuration depends heavily on which library you are using. Consult your auth library's documentation for disabling secure cookies in development.*
