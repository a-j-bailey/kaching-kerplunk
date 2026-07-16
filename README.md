# Ka-Ching Kerplunk

A playful passing-score game built with Expo (SDK 57) and React Native.

## Bundle ID

`com.magicmirrorcreative.kachingkerplunk`

## Game rules

| Event | Points |
| --- | --- |
| Pass a car | +10 |
| Get passed by a car | −10 |
| Pass a truck | +100 |
| Get passed by a truck | −100 |

Tap the big **green** (add) and **red** (subtract) buttons as you drive. Sounds, haptics, and floating score animations keep it fun.

## Local data

High score, streaks, and play history are stored on-device with AsyncStorage. Nothing is sent to the cloud.

## Run

```bash
npm install
npx expo start
```

- Press `w` for web
- Scan the QR code with Expo Go for a device

```bash
npx expo start --web
```
