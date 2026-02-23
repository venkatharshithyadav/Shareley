# 🎉 Shareley - Complete Project Guide

## 🌟 Project Overview

Shareley is a **complete sustainable fashion marketplace** where users can:
- ✅ **Buy** clothes from other users
- ✅ **Sell** their own clothes
- ✅ **Lend** clothes to others
- ✅ **Rent** clothes for special occasions
- ✅ **Give away** clothes for free

## 🚀 Features

### 1. **User Authentication**
- Login/Signup pages
- User profiles
- Secure authentication (localStorage-based)
- Protected routes

### 2. **Marketplace**
- Browse all listings
- Filter by type (sell/lend/rent/free)
- Filter by category
- Search functionality
- View listing details

### 3. **Listings Management**
- Create new listings
- Add details (title, description, price, category, size, condition, location)
- Choose listing type (sell/lend/rent/free)
- View your own listings
- Track active/completed listings

### 4. **User Profile**
- View your profile
- See your listings
- Track statistics (total, active, completed)
- Edit profile information

## 📁 Project Structure

```
src/
├── components/
│   └── ListingCard.tsx       # Reusable listing card component
├── context/
│   ├── AuthContext.tsx        # Authentication context
│   └── ListingsContext.tsx    # Listings management context
├── pages/
│   ├── Home.tsx               # Homepage
│   ├── Login.tsx              # Login page
│   ├── Signup.tsx             # Signup page
│   ├── Marketplace.tsx        # Browse all listings
│   ├── AddListing.tsx         # Create new listing
│   ├── Profile.tsx            # User profile
│   └── ListingDetail.tsx      # View listing details
├── types.ts                   # TypeScript types
├── App.tsx                    # Main app with routing
└── main.tsx                   # App entry point
```

## 🎯 Key Pages

### 1. **Homepage** (`/`)
- Hero section with call-to-action
- Features section
- How it works section
- Recent listings preview
- Footer

### 2. **Marketplace** (`/marketplace`)
- Browse all listings
- Filters (type, category)
- Search functionality
- Listing cards grid

### 3. **Add Listing** (`/add-listing`)
- Form to create new listing
- Select listing type
- Add details (title, description, price, etc.)
- Choose category and size
- Protected route (requires login)

### 4. **Profile** (`/profile`)
- User information
- Statistics (total, active, completed listings)
- My listings section
- Logout functionality

### 5. **Login/Signup** (`/login`, `/signup`)
- User authentication
- Form validation
- Error handling
- Redirect after login

## 🔧 Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## 💾 Data Storage

All data is stored in **localStorage**:
- `users` - User accounts
- `user` - Currently logged-in user
- `listings` - All listings

## 🎨 Listing Types

1. **Sell** - Selling clothes for a price
2. **Lend** - Lending clothes (usually free)
3. **Rent** - Renting clothes for a price
4. **Free** - Giving away clothes for free

## 📝 How to Use

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Create an Account**
- Go to `/signup`
- Enter your name, email, and password
- Click "Create Account"

### 3. **Browse Listings**
- Go to `/marketplace`
- Use filters to find what you're looking for
- Click on a listing to see details

### 4. **Add a Listing**
- Login to your account
- Click "Add Listing" in the navigation
- Fill out the form
- Select listing type (sell/lend/rent/free)
- Click "Create Listing"

### 5. **View Your Profile**
- Click "Profile" in the navigation
- See your listings and statistics

## 🎯 User Flow

1. **New User**:
   - Visit homepage
   - Sign up for an account
   - Browse marketplace
   - Create listings

2. **Existing User**:
   - Login
   - Browse marketplace
   - Create listings
   - View profile

## 🔐 Authentication

- Users are stored in localStorage
- Passwords are stored in plain text (for demo purposes)
- Sessions persist across page refreshes
- Protected routes require authentication

## 📱 Responsive Design

- Mobile-friendly
- Tablet-optimized
- Desktop layout
- Responsive navigation
- Adaptive grids

## 🎨 Customization

### Change Colors
Edit Tailwind classes in components:
- `bg-pink-500` - Primary color
- `bg-cyan-500` - Secondary color

### Add Categories
Edit `AddListing.tsx`:
```typescript
<option value="YourCategory">Your Category</option>
```

### Modify Sample Listings
Edit `ListingsContext.tsx`:
- Update `initializeSampleListings()` function
- Add/remove sample listings

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📋 TODO (Future Enhancements)

- [ ] Image upload functionality
- [ ] Backend API integration
- [ ] Real authentication (JWT)
- [ ] Payment integration
- [ ] Messaging system
- [ ] Reviews and ratings
- [ ] Email notifications
- [ ] Advanced search
- [ ] Favorites/Wishlist
- [ ] Map integration for location

## 🐛 Known Issues

- Images are not yet implemented (placeholders used)
- No real backend (all data in localStorage)
- Passwords stored in plain text (for demo only)
- No payment processing
- No messaging system

## 📞 Support

For questions or issues, please check:
- README.md - Basic setup
- CONTENT_EDITING_GUIDE.md - How to edit content
- HOW_TO_RUN.md - Running instructions

## 🎉 Enjoy!

Your complete Shareley marketplace is ready to use! Start by creating an account and exploring the features.

