# ERP Rooman System - Frontend

A modern, responsive React application built with TypeScript, Vite, and Tailwind CSS for the ERP Rooman System.

## Technology Stack

### Core
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Vite 5** - Fast build tool and dev server

### Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixing

### State Management
- **React Context API** - Authentication state
- **Zustand** - Global state management

### Routing
- **React Router DOM 6** - Client-side routing

### HTTP & API
- **Axios** - Promise-based HTTP client
- JWT token-based authentication

### UI Components
- **Headless UI** - Unstyled accessible components
- **Heroicons** - Icon library
- **React Hook Form** - Form validation

## Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/        # Common components (PrivateRoute, etc.)
│   │   ├── layout/        # Layout components (Layout, Header, etc.)
│   │   └── ui/            # UI components (Button, Input, Card, etc.)
│   ├── context/           # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── useApi.ts
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── student/       # Student pages
│   │   ├── employee/      # Employee pages
│   │   └── admin/         # Admin pages
│   ├── services/          # API services
│   │   ├── api.ts         # Axios instance
│   │   └── authService.ts # Auth API calls
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── tailwind.config.js     # Tailwind config
└── .env                   # Environment variables
```

## Features

### Authentication
- ✅ Login with JWT tokens
- ✅ User registration
- ✅ Role-based access control (Student, Employee, Admin)
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ Logout functionality

### User Roles

#### Student
- Dashboard with statistics
- Course management
- Attendance tracking
- Assignment submission
- Grade viewing

#### Employee
- Dashboard with statistics
- Attendance tracking (check-in/check-out)
- Task management
- Leave request management
- Payroll information
- Performance reviews

#### Admin
- System dashboard with statistics
- User management
- Student management
- Employee management
- Report generation
- System settings

## Installation & Setup

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=ERP Rooman System
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## API Integration

The frontend communicates with the Django backend API. The base URL is configured in the `.env` file.

### Authentication Flow

1. **Login**: POST `/api/auth/login/`
   - Returns access and refresh tokens
   - Tokens stored in localStorage
   - User redirected to role-based dashboard

2. **Token Refresh**: Automatic
   - Interceptor handles 401 errors
   - Automatically refreshes expired tokens
   - Retries failed requests

3. **Logout**: POST `/api/auth/logout/`
   - Blacklists refresh token
   - Clears localStorage
   - Redirects to login

### API Request Example

```typescript
import api from './services/api'

// GET request
const response = await api.get('/student/courses/')

// POST request
const response = await api.post('/student/assignments/', data)

// Authenticated requests automatically include Bearer token
```

## Component Usage

### Button Component

```tsx
import Button from './components/ui/Button'

<Button variant="primary" size="md" fullWidth>
  Click Me
</Button>
```

### Input Component

```tsx
import Input from './components/ui/Input'

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
  error={error}
/>
```

### Card Component

```tsx
import Card from './components/ui/Card'

<Card title="Card Title" footer={<Button>Action</Button>}>
  Card content here
</Card>
```

### Layout Component

```tsx
import Layout from './components/layout/Layout'

<Layout role="student">
  <h1>Page Content</h1>
</Layout>
```

## Routing

Routes are defined in `src/App.tsx`:

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Student)
- `/student/dashboard`
- `/student/courses`
- `/student/attendance`
- `/student/assignments`
- `/student/grades`

### Protected Routes (Employee)
- `/employee/dashboard`
- `/employee/attendance`
- `/employee/tasks`
- `/employee/leave`
- `/employee/payroll`

### Protected Routes (Admin)
- `/admin/dashboard`
- `/admin/users`
- `/admin/students`
- `/admin/employees`
- `/admin/reports`
- `/admin/settings`

## Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Custom configurations are in `tailwind.config.js`.

### Custom Colors

```javascript
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  // ... up to 900
}
```

### Usage Example

```tsx
<div className="bg-primary-600 text-white p-4 rounded-lg shadow-md">
  Styled with Tailwind
</div>
```

## TypeScript Types

All API response types are defined in `src/types/`:

- `auth.ts` - Authentication types
- `student.ts` - Student-related types
- `employee.ts` - Employee-related types
- `admin.ts` - Admin-related types
- `index.ts` - Common types

### Type Usage Example

```typescript
import { User } from './types/auth'
import { Course } from './types/student'

const user: User = {
  id: 1,
  username: 'john',
  role: 'student',
  // ...
}
```

## Custom Hooks

### useApi Hook

```typescript
import { useApi } from './hooks/useApi'

const { data, loading, error, execute } = useApi({
  url: '/student/courses/',
  method: 'GET',
  immediate: true,
})
```

### useAuth Hook

```typescript
import { useAuth } from './context/AuthContext'

const { user, login, logout } = useAuth()
```

## Development Tips

1. **Hot Module Replacement (HMR)** - Changes reflect instantly
2. **TypeScript** - Use type checking: `tsc --noEmit`
3. **ESLint** - Fix linting errors: `npm run lint`
4. **Responsive Design** - Use Tailwind responsive classes (`md:`, `lg:`, etc.)
5. **Component Organization** - Keep components small and focused

## Production Deployment

### Build Optimization

```bash
npm run build
```

### Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Test all routes and functionality
- [ ] Verify API integration
- [ ] Optimize images and assets
- [ ] Enable production error tracking
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **AWS S3 + CloudFront**
   - Build project: `npm run build`
   - Upload `dist/` to S3 bucket
   - Configure CloudFront distribution

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is part of the ERP Rooman System.
