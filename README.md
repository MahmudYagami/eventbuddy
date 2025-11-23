# Event Buddy

Event Buddy is a modern web application for discovering and booking events. Built with Next.js and Tailwind CSS, it provides a seamless experience for users to browse, search, and book events.
# Preview Of the Website [https://68347a00279c060ae16e82f3--eventbuddy334.netlify.app/](https://eventbuddy-beige.vercel.app/)

## Features

- 🎫 Dynamic event listings with search functionality
- 📱 Fully responsive design for mobile and desktop
- 👤 User authentication and role-based access
- 📅 Upcoming and previous events categorization
- 🔍 Advanced search capabilities
- 🎨 Modern UI with smooth animations

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js) or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd eventbuddy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory (if needed for any environment variables):
```bash
touch .env.local
```

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```
Admin login:
```
adminEmail = "admin@example.com"
adminPassword = "admin123"
```
## Project Structure

```
my-app/
├── app/
│   ├── admin/         # Admin dashboard routes
│   ├── dashboard/     # User dashboard routes
│   ├── event/         # Event details routes
│   ├── login/         # Authentication routes
│   ├── page.tsx       # Home page
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles
├── public/            # Static assets
└── lib/              # Utility functions and data
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run start` - Runs the production build
- `npm run lint` - Runs the linter

## Technologies Used

- Next.js 13+ (App Router)
- React
- Tailwind CSS
- TypeScript
- Context API for state management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Icons8](https://icons8.com)
- Design inspiration from modern web applications
