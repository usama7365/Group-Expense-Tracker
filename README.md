# Group Expense Tracker

A simple group expense tracking application built with Next.js, TypeScript, and Supabase.

## Features

- User authentication using Supabase Auth
- Create and manage groups
- Add and track expenses within groups
- Real-time updates using Supabase

## Tech Stack

- Next.js 13 with App Router
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- shadcn/ui components

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/group-expense-tracker.git
   cd group-expense-tracker
   ```
2. Copy `.env.example` to `.env` and add your Supabase credentials.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

The application uses two main tables in Supabase:

### Groups Table
- `id` (uuid, primary key)
- `name` (text)
- `user_id` (uuid, references auth.users)
- `created_at` (timestamp)

### Expenses Table
- `id` (uuid, primary key)
- `group_id` (uuid, references groups)
- `user_id` (uuid, references auth.users)
- `user_email` (text)
- `description` (text)
- `amount` (numeric)
- `created_at` (timestamp)

## Code Formatting with Prettier

This project uses [Prettier](https://prettier.io/) for code formatting.

### Installation

If Prettier is not already installed, install it as a dev dependency:
```bash
npm install --save-dev prettier
```

### Configuration

Create a `.prettierrc` file in the root of your project with the following configuration:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

You can also create a `.prettierignore` file to exclude specific files or folders from formatting:
```
node_modules
.next
out
public
```

### Formatting Code

To format your code, run:
```bash
npm run format
```

To ensure code is automatically formatted before committing, consider adding a Git hook using Husky:
```bash
npx husky-init && npm install
npx husky set .husky/pre-commit "npm run format"
```

## AI Usage Documentation

This project was developed with the assistance of AI tools:

1. **Initial Project Structure**
   - Used AI to generate the basic Next.js project structure
   - Modified the generated code to match the specific requirements

2. **Database Schema**
   - AI helped design the initial database schema
   - Manually reviewed and adjusted the schema for security

3. **API Routes**
   - Generated basic API route structure using AI
   - Customized error handling and response formats

4. **Components**
   - Used AI to generate component templates
   - Manually styled and adjusted components for better UX

5. **Authentication**
   - AI provided guidance on Supabase Auth integration
   - Implemented and tested auth flow manually

All AI-generated code was reviewed, tested, and modified to ensure it meets the project requirements and best practices.

