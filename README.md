# VikiTok

VikiTok is a TikTok-style application for browsing Wikipedia articles. It allows users to scroll through articles, like and share them, select topics of interest, and switch between English and Turkish languages.

## Features

- TikTok-style scrolling of Wikipedia articles
- English and Turkish language support
- Article liking
- Article sharing
- Topic selection

## Tech Stack

- React Native / Expo
- TypeScript
- Zustand for state management
- Expo Router for navigation
- Supabase for data persistence
- Wikipedia API for content
- i18n-js for internationalization

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Update the Supabase configuration in `src/services/supabaseClient.ts` with your Supabase URL and anon key.

4. Start the development server:

```bash
npm start
```

5. Use the Expo Go app on your device to scan the QR code, or run on an emulator/simulator:

```bash
npm run android
npm run ios
npm run web
```

## Project Structure

- `app/`: Expo Router screens
- `src/components/`: React components
- `src/services/`: API and data services
- `src/stores/`: Zustand state stores
- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions
- `src/hooks/`: Custom React hooks
- `src/i18n/`: Internationalization files
- `src/constants/`: Application constants

## License

This project is licensed under the MIT License. 