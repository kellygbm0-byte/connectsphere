# ConnectSphere

A responsive social-networking and marketplace front-end prototype built with vanilla JavaScript and Vite.

## Included
- Responsive desktop and mobile layouts
- Social feed with create post, likes, comments, save, and share actions
- Discover page with demo connection actions
- Community/idea-sharing interface
- Messaging UI with local demo messages
- Marketplace with product search, category filters, and product detail modal
- Profile and settings screens
- Demo notices for backend-dependent features

## Run locally
Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production work still required
This is a front-end prototype, not a production multi-user social network. State is stored only in memory and resets on refresh. Before launch, implement:
- Secure authentication and account recovery
- Database persistence and server-side authorization
- Real-time private messaging and notifications
- WebRTC or managed voice/video calls, including signaling and TURN servers
- Secure media storage and upload validation
- Real marketplace seller accounts, moderation, and optional checkout
- Payment provider integration and verified webhooks
- Privacy policy, data retention/deletion, abuse reporting, backups, and security testing

Product imagery is loaded from Unsplash and avatar placeholders from pravatar.cc; these require an internet connection.
