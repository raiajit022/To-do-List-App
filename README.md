# To-Do List Application

A modern task management application built with Next.js 14, TypeScript, Supabase, and Shadcn UI.

## Features

- User authentication with Supabase
- Task management with categories
- Real-time updates
- Responsive design
- Dark/Light mode support
- Calendar integration
- Custom tag management

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- Shadcn UI
- Radix UI
- Lucide Icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── dashboard/         # Dashboard pages
│   ├── auth/             # Authentication pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/              # UI components
│   ├── tasks/           # Task-related components
│   └── providers/       # Context providers
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── public/               # Static assets
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 