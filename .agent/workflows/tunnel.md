---
description: Start the Expo server with a tunnel for external access
---

To allow external users to access your app via Expo Go:

1. Install the tunnel dependency if you haven't already:
```bash
npm install -g @expo/ngrok
```

2. Start the project with the tunnel flag:
// turbo
```bash
npx expo start --tunnel
```

3. Scan the QR code with the Expo Go app on your mobile device.
