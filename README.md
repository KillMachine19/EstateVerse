# EstateVerse - Commercial Real Estate Platform

EstateVerse is a modern commercial real estate website built with **Vite**, **React**, and **TypeScript**. The platform is designed to help users discover premium office spaces, retail locations, warehouses, and industrial properties.

## 🚀 Features

- **Modern Frontend**: Built with Vite for fast development and optimized production builds
- **Responsive Design**: Fully responsive UI using custom CSS
- **TypeScript**: Type-safe React components and utilities
- **Modular Architecture**: Well-organized component structure for scalability
- **API Ready**: Pre-configured axios service for backend integration
- **Professional Components**: Header, Footer, Hero Section, Features Section

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components (Header, Footer, Button)
│   ├── sections/         # Page sections (HeroSection, FeaturesSection)
│   └── pages/           # Page components (for future expansion)
├── services/            # API and external services
│   └── apiClient.ts    # Axios configuration and API calls
├── types/               # TypeScript interfaces and types
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── assets/              # Images and static files
└── App.tsx             # Main App component
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios
- **Linting**: ESLint

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔄 Future Enhancements

- Property listings database integration
- Advanced search and filtering (similar to 99acres)
- User authentication and login
- Admin panel for property management
- Payment integration for listings
- Real-time notifications
- Mobile app

## 🔧 Backend Integration

The frontend is configured to connect to a Java backend. Update the API base URL in `.env`:

```
VITE_API_BASE_URL=http://your-backend-url:8080
```

## 📄 License

MIT License - Feel free to use this project for commercial purposes.
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
