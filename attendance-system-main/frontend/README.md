# VeriPoint Authentication Pages

Modern glassmorphism-styled login and signup pages for the VeriPoint attendance platform.

## Features

- ✨ **Glassmorphism Design** - Beautiful glass-card effects with backdrop blur
- 🌌 **Aurora Background** - Dynamic gradient mesh backgrounds
- 🎭 **Role Selection** - Toggle between Student/Lecturer/Admin roles
- 🔒 **Password Visibility Toggle** - Show/hide password functionality
- 📱 **Fully Responsive** - Works perfectly on all screen sizes
- 🎨 **Smooth Animations** - Floating elements and smooth transitions

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   └── signup/
│   │       └── page.tsx           # Signup page
│   ├── globals.css                # Updated with glassmorphism styles
│   └── layout.tsx                 # Root layout
├── public/
│   └── icons/
│       └── location-pin.svg       # Location pin icon
└── tailwind.config.ts             # Updated Tailwind config
```

## Installation

1. **Copy the authentication pages:**
   ```bash
   # Create auth directory structure
   mkdir -p src/app/auth/login src/app/auth/signup
   
   # Copy login page
   cp login-page.tsx src/app/auth/login/page.tsx
   
   # Copy signup page
   cp signup-page.tsx src/app/auth/signup/page.tsx
   ```

2. **Update globals.css:**
   ```bash
   cp auth-globals.css src/app/globals.css
   ```

3. **Update Tailwind config:**
   ```bash
   cp auth-tailwind.config.ts tailwind.config.ts
   ```

4. **Ensure icons are in place:**
   - Make sure `location-pin.svg` is in `public/icons/`
   - The icon is used for the floating 3D element

## Usage

Navigate to the authentication pages:

- **Login:** `http://localhost:3000/auth/login`
- **Signup:** `http://localhost:3000/auth/signup`

## Color Scheme

```css
Primary Blue: #256af4
Gold Accent: #f59e0b
Background Dark: #051025
Surface Dark: #0B162C
```

## Customization

### Change Brand Name

In both `login-page.tsx` and `signup-page.tsx`:

```tsx
<h1 className="text-3xl font-bold tracking-tight text-white">
  VeriPoint  {/* Change this */}
</h1>
```

### Modify Role Options

Update the role switcher section:

```tsx
<button onClick={() => setActiveRole("student")}>
  Student  {/* Modify role names */}
</button>
```

### Adjust Colors

Edit `tailwind.config.ts`:

```ts
colors: {
  primary: {
    DEFAULT: "#256af4", // Change primary color
  },
  "gold-accent": "#f59e0b", // Change accent
}
```

### Remove Floating Pin

In both pages, remove this section:

```tsx
{/* 3D Floating Pin Image */}
<div className="absolute top-[10%] left-[60%]...">
  ...
</div>
```

## Form Validation

To add form validation, install and configure:

```bash
npm install react-hook-form zod @hookform/resolvers
```

Then wrap your inputs with `react-hook-form`:

```tsx
import { useForm } from "react-hook-form";

const { register, handleSubmit, formState: { errors } } = useForm();

<input {...register("email", { required: true })} />
```

## Backend Integration

Replace the form submission with your API calls:

```tsx
const onSubmit = async (data: any) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

## Features Breakdown

### Login Page
- Email and password inputs
- Role selection (Student/Lecturer/Admin)
- Remember me checkbox
- Forgot password link
- Sign in button with animation
- Link to signup page

### Signup Page
- Full name input
- Email input
- Student/Staff ID input (changes based on role)
- Password input with confirmation
- Terms and conditions checkbox
- Create account button with animation
- Link to login page

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Notes

- The glassmorphism effect requires backdrop-filter support
- Aurora gradients are optimized for performance
- Floating animation uses CSS keyframes
- All transitions are GPU-accelerated for smooth performance

## License

MIT License - Free to use for educational projects