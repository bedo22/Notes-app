# QuickNotes - Developer Documentation

> **A modern, full-stack note-taking application built with React, TypeScript, and Supabase**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Features](#features)
6. [Database Schema](#database-schema)
7. [Authentication Flow](#authentication-flow)
8. [Component Guide](#component-guide)
9. [Toast Notifications](#toast-notifications)
10. [Setup & Installation](#setup--installation)
11. [Environment Variables](#environment-variables)
12. [Available Scripts](#available-scripts)
13. [Code Patterns & Conventions](#code-patterns--conventions)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**QuickNotes** is a personal note-taking application that allows users to:
- Create, read, update, and delete notes
- Organize notes into folders
- Search and filter notes
- Switch between light and dark modes
- Access notes from any device with authentication

**Target Users:** Individual users looking for a simple, organized way to manage personal notes.

---

## 🛠 Technology Stack

### **Frontend Framework**
- **React 19.1.1** - UI library with latest features
- **TypeScript 5.9.3** - Type safety and better developer experience
- **Vite 7.1.7** - Lightning-fast build tool and dev server

### **Routing**
- **React Router DOM 7.9.5** - Client-side routing with data loading

### **Styling**
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite integration for Tailwind
- **class-variance-authority** - For component variant management
- **clsx & tailwind-merge** - Conditional className utilities

### **UI Components**
- **Radix UI** - Headless, accessible component primitives
  - Dialog, Label, ScrollArea, Select, Separator, Slot, Tabs
- **shadcn/ui** - Pre-built components using Radix UI
- **Sonner** - Beautiful toast notifications library
- **lucide-react** - Beautiful, consistent icon library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service (BaaS)
  - PostgreSQL database
  - Authentication (email/password, OAuth)
  - Row Level Security (RLS)
  - Real-time subscriptions (not currently used but available)
  - RESTful API auto-generated from database schema

### **Utilities**
- **date-fns 4.1.0** - Date formatting and manipulation
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## 📁 Project Structure

```
notes-app/
├── public/
│   └── vite.svg                    # Vite logo
├── src/
│   ├── assets/                     # Static assets
│   │   └── react.svg
│   ├── components/                 # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── AddNoteForm.tsx         # Dialog form for creating notes
│   │   ├── AuthProvider.tsx        # Auth context provider
│   │   ├── FolderList.tsx          # Sidebar folder navigation
│   │   ├── layout.tsx              # Main layout wrapper
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   └── ProtectedRoute.tsx      # Route guard component
│   ├── hooks/                      # Custom React hooks (empty, for future use)
│   ├── lib/                        # Utility libraries
│   │   ├── supabaseClient.ts       # Supabase client configuration
│   │   └── utils.ts                # General utility functions
│   ├── pages/                      # Page components
│   │   ├── Auth.tsx                # Login/signup page
│   │   ├── NoteDetail.tsx          # Single note edit view
│   │   └── NoteList.tsx            # Notes list/grid view
│   ├── types/                      # TypeScript type definitions
│   │   ├── Folder.ts               # Folder type
│   │   └── note.ts                 # Note type
│   ├── App.css                     # Global app styles (minimal)
│   ├── index.css                   # Global CSS and Tailwind imports
│   └── main.tsx                    # App entry point
├── .env                            # Environment variables (not in git)
├── .gitignore                      # Git ignore rules
├── components.json                 # shadcn/ui configuration
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript base config
├── tsconfig.app.json               # TypeScript app config
├── tsconfig.node.json              # TypeScript Node config
└── vite.config.ts                  # Vite configuration
```

---

## 🏗 Architecture

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │            React Application (SPA)                 │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │   Pages      │  │  Components  │              │  │
│  │  │              │  │              │              │  │
│  │  │ - Auth       │  │ - Navbar     │              │  │
│  │  │ - NoteList   │  │ - FolderList │              │  │
│  │  │ - NoteDetail │  │ - AddNote    │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         AuthProvider (Context)              │  │  │
│  │  │  - User state management                    │  │  │
│  │  │  - Login/Logout functions                   │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │      Supabase Client (lib/supabaseClient)   │  │  │
│  │  │  - API calls                                │  │  │
│  │  │  - Auth operations                          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                  Supabase Backend                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                   │  │
│  │                                                    │  │
│  │  Tables:                                           │  │
│  │  - auth.users (managed by Supabase Auth)          │  │
│  │  - public.notes                                    │  │
│  │  - public.folders                                  │  │
│  │                                                    │  │
│  │  Row Level Security (RLS) Policies                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Supabase Auth Service                    │  │
│  │  - Email/Password authentication                   │  │
│  │  - Session management                              │  │
│  │  - JWT tokens                                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **User Authentication:**
   - User signs up/logs in via `Auth.tsx`
   - Supabase Auth validates and returns JWT
   - JWT stored in localStorage by Supabase client
   - `AuthProvider` manages user session state
   - `ProtectedRoute` guards authenticated routes

2. **Fetching Data:**
   - Component calls Supabase client method
   - Request includes JWT from localStorage
   - Supabase validates JWT and applies RLS policies
   - Data filtered by `user_id` automatically
   - Response returned to component

3. **Creating/Updating Data:**
   - User interacts with form
   - Form submits to Supabase via client
   - RLS ensures user can only modify their own data
   - Success/error handled in component
   - UI refreshed with new data

---

## ✨ Features

### **1. Authentication**
- ✅ Email/password signup and login
- ✅ Persistent sessions (localStorage)
- ✅ Protected routes (redirect to /auth if not logged in)
- ✅ Sign out functionality
- ✅ User-specific data isolation via RLS

### **2. Note Management**
- ✅ Create notes with title and content
- ✅ View all notes in a list
- ✅ Edit existing notes
- ✅ Delete notes with confirmation dialog
- ✅ Assign notes to folders
- ✅ Move notes between folders
- ✅ Timestamp tracking (created_at)

### **3. Folder Organization**
- ✅ Create folders with custom names
- ✅ Rename existing folders
- ✅ Delete folders (notes move to "All Notes")
- ✅ Filter notes by folder
- ✅ "All Notes" view (shows all notes regardless of folder)
- ✅ Auto-create "General" folder for new users

### **4. Search & Filter**
- ✅ Real-time search across note titles and content
- ✅ Case-insensitive search
- ✅ Filter by folder

### **5. UI/UX Features**
- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ Dark mode with toggle button
- ✅ Dark mode preference persistence (localStorage)
- ✅ Toast notifications (Sonner) for user feedback
- ✅ Non-intrusive success/error messages
- ✅ Note preview truncation (line-clamp-2)
- ✅ Relative timestamps ("2 hours ago")
- ✅ Loading states
- ✅ Empty states with helpful messages
- ✅ Dialog modals instead of browser prompts
- ✅ Keyboard shortcuts (Enter to submit, ESC to close)
- ✅ Hover effects for better interactivity

### **6. Code Quality**
- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Component-based architecture
- ✅ Reusable UI components via shadcn/ui
- ✅ Context API for global state (Auth)

---

## 🗄 Database Schema

### **Table: `notes`**

```sql
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON public.notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.notes FOR DELETE
  USING (auth.uid() = user_id);
```

**Columns:**
- `id` (UUID) - Primary key, auto-generated
- `user_id` (UUID) - Foreign key to auth.users, ensures data isolation
- `folder_id` (UUID) - Foreign key to folders, nullable (notes can be unorganized)
- `title` (TEXT) - Note title, required
- `content` (TEXT) - Note body, optional
- `created_at` (TIMESTAMPTZ) - Timestamp, auto-set on creation

---

### **Table: `folders`**

```sql
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own folders"
  ON public.folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders"
  ON public.folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON public.folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON public.folders FOR DELETE
  USING (auth.uid() = user_id);
```

**Columns:**
- `id` (UUID) - Primary key, auto-generated
- `user_id` (UUID) - Foreign key to auth.users
- `name` (TEXT) - Folder name, required
- `created_at` (TIMESTAMPTZ) - Timestamp, auto-set on creation

---

### **Relationships:**

```
auth.users (Supabase Auth)
    ↓ (one-to-many)
├── notes (user_id)
└── folders (user_id)
    ↓ (one-to-many)
    notes (folder_id, nullable)
```

---

## 🔐 Authentication Flow

### **Signup/Login Flow:**

```
User enters email/password
        ↓
Auth.tsx calls supabase.auth.signUp() or signIn()
        ↓
Supabase validates credentials
        ↓
Success: JWT token returned and stored in localStorage
        ↓
AuthProvider.useEffect() detects session change
        ↓
User state updated in AuthProvider context
        ↓
ProtectedRoute allows access to app
        ↓
User redirected to "/" (NoteList)
```

### **Session Management:**

- **JWT Storage:** Supabase client automatically stores JWT in `localStorage`
- **Session Persistence:** On page refresh, `AuthProvider` checks for existing session
- **Auto-Refresh:** Supabase client auto-refreshes expired tokens
- **Logout:** `signOut()` clears localStorage and redirects to `/auth`

### **Protected Routes:**

```tsx
// main.tsx
<ProtectedRoute>
  <Layout />
</ProtectedRoute>
```

**ProtectedRoute.tsx:**
- Checks if `user` exists in AuthProvider context
- If no user: redirect to `/auth`
- If user exists: render children

---

## 🧩 Component Guide

### **Pages (src/pages/)**

#### **1. Auth.tsx**
- **Purpose:** Login and signup page
- **Features:**
  - Tab switching between login/signup
  - Email/password form
  - Form validation
  - Error display
  - Redirect to "/" after successful auth
- **Key Functions:**
  - `handleSignup()` - Creates new user
  - `handleLogin()` - Authenticates existing user

#### **2. NoteList.tsx**
- **Purpose:** Main dashboard showing all notes
- **Features:**
  - Search bar for filtering notes
  - Folder sidebar integration
  - AddNoteForm dialog trigger
  - Note cards with truncated content
  - Relative timestamps
  - Empty states
- **State:**
  - `notes` - Array of notes
  - `selectedFolderId` - Currently selected folder
  - `searchQuery` - Search input value
  - `loading` - Loading indicator
- **Key Functions:**
  - `fetchNotes()` - Loads notes from Supabase
  - `filteredNotes` - Computed filtered list

#### **3. NoteDetail.tsx**
- **Purpose:** View and edit a single note
- **Features:**
  - Title and content editing
  - Folder selection dropdown
  - Save and delete actions
  - Delete confirmation dialog
  - Back navigation
- **State:**
  - `note` - Current note data
  - `title` - Editable title
  - `content` - Editable content
  - `folderId` - Selected folder
  - `folders` - Available folders
- **Key Functions:**
  - `fetchNote()` - Load note by ID
  - `handleSave()` - Update note in DB
  - `handleDelete()` - Delete note from DB

---

### **Components (src/components/)**

#### **1. AuthProvider.tsx**
- **Purpose:** Global authentication context
- **Provides:**
  - `user` - Current user object or null
  - `signOut()` - Logout function
  - `loading` - Auth loading state
- **Usage:**
  ```tsx
  const { user, signOut } = useAuth();
  ```

#### **2. ProtectedRoute.tsx**
- **Purpose:** Route guard for authenticated pages
- **Logic:**
  - If loading: show loading spinner
  - If no user: redirect to /auth
  - If user exists: render children

#### **3. Navbar.tsx**
- **Purpose:** Top navigation bar
- **Features:**
  - App logo/title
  - Dark mode toggle
  - User email display
  - Sign out button
- **State:**
  - `isDark` - Dark mode state

#### **4. FolderList.tsx**
- **Purpose:** Sidebar folder navigation
- **Features:**
  - List of user folders
  - "All Notes" option
  - Create folder dialog
  - Rename folder dialog
  - Delete folder confirmation
  - Hover actions
  - ScrollArea for many folders
- **Props:**
  - `selectedFolderId` - Currently selected folder
  - `onSelectFolder()` - Callback when folder clicked
- **State:**
  - `folders` - Array of folders
  - Dialog states (add, rename, delete)
  - Form input states

#### **5. AddNoteForm.tsx**
- **Purpose:** Create new note
- **Features:**
  - Dialog modal trigger
  - Title and content inputs
  - Folder association
  - Form validation
  - Loading state
- **Props:**
  - `selectedFolderId` - Default folder for new note
  - `onNoteAdded()` - Callback after successful creation

#### **6. layout.tsx**
- **Purpose:** Main app layout wrapper
- **Structure:**
  ```tsx
  <Navbar />
  <main>
    <Outlet /> {/* Nested routes */}
  </main>
  ```

---

### **UI Components (src/components/ui/)**

These are shadcn/ui components built on Radix UI primitives. They are:
- **Accessible** - ARIA compliant, keyboard navigation
- **Unstyled** - Styled with Tailwind CSS
- **Composable** - Can be combined to build complex UIs

**Key Components:**
- `Button` - Clickable button with variants
- `Card` - Container with border and shadow
- `Dialog` - Modal dialog overlay
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Label` - Form label
- `Select` - Dropdown select
- `ScrollArea` - Custom scrollbar
- `Separator` - Horizontal divider

**Usage Example:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

---

## 🔔 Toast Notifications

QuickNotes uses **Sonner** for beautiful, non-intrusive toast notifications throughout the application.

### **Implementation**

**Setup (main.tsx):**
```tsx
import { Toaster } from 'sonner';

<AuthProvider>
  <RouterProvider router={router} />
  <Toaster position="top-right" richColors />
</AuthProvider>
```

### **Usage Patterns**

**Success Notifications:**
```tsx
import { toast } from 'sonner';

toast.success("Note created!", {
  description: `"${title}" has been added successfully.`,
});
```

**Error Notifications:**
```tsx
toast.error("Failed to create note", {
  description: error.message,
});
```

**Validation Feedback:**
```tsx
if (!title.trim()) {
  toast.error("Title required", {
    description: "Please enter a note title",
  });
  return;
}
```

### **Where Toasts Are Used**

1. **Authentication (Auth.tsx)**
   - Sign in success/failure
   - Sign up success/failure
   - Welcome messages

2. **Note Management (AddNoteForm.tsx, NoteDetail.tsx)**
   - Note creation success/failure
   - Note update confirmation
   - Note deletion confirmation
   - Validation errors

3. **Folder Management (FolderList.tsx)**
   - Folder creation success/failure
   - Folder rename confirmation
   - Folder deletion confirmation
   - Validation errors

### **Benefits**

- ✅ **Non-blocking** - Users can continue working while toasts display
- ✅ **Auto-dismiss** - Toasts automatically disappear after a few seconds
- ✅ **Stackable** - Multiple toasts can appear simultaneously
- ✅ **Accessible** - Built with keyboard navigation and screen reader support
- ✅ **Customizable** - Position, duration, and styling can be adjusted

### **Customization Options**

The Toaster component in `main.tsx` can be customized:

```tsx
<Toaster 
  position="top-right"      // top-left, top-center, bottom-right, etc.
  richColors                // Enables colored toasts
  expand={false}            // Compact toasts
  duration={4000}           // Display duration in milliseconds
  closeButton               // Show close button on each toast
/>
```

For detailed implementation guide, see **[SONNER_GUIDE.md](./SONNER_GUIDE.md)**.

---

## ⚙️ Setup & Installation

### **Prerequisites:**
- Node.js 18+ and npm
- Supabase account (free tier works)

### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd notes-app
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Set Up Supabase**

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL from [Database Schema](#database-schema) in the SQL Editor
3. Copy your project URL and anon key from Settings > API

### **Step 4: Configure Environment Variables**

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **Step 5: Run Development Server**
```bash
npm run dev
```

App will be available at `http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGci...` |

**Important:**
- Variables must be prefixed with `VITE_` to be exposed to the browser
- Never commit `.env` to version control
- Anon key is safe to expose (protected by RLS)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📐 Code Patterns & Conventions

### **1. Component Organization**

```tsx
// 1. Imports
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// 2. Type definitions
interface Props { ... }

// 3. Component function
export default function Component({ props }: Props) {
  // 4. Router hooks (useParams, useNavigate)
  const { id } = useParams();
  
  // 5. Context hooks (useAuth)
  const { user } = useAuth();
  
  // 6. State declarations
  const [data, setData] = useState(null);
  
  // 7. Effects (near related state)
  useEffect(() => {
    fetchData();
  }, [dependency]);
  
  // 8. Event handlers (function declarations)
  async function handleAction() { }
  
  // 9. Early returns (loading/error states)
  if (loading) return <Loading />;
  
  // 10. Main render
  return <div>...</div>
}
```

### **2. Supabase Queries**

```tsx
// SELECT
const { data, error } = await supabase
  .from("notes")
  .select("*")
  .eq("folder_id", folderId)
  .order("created_at", { ascending: false });

// INSERT
const { error } = await supabase
  .from("notes")
  .insert([{ title, content, user_id: user.id }]);

// UPDATE
const { error } = await supabase
  .from("notes")
  .update({ title, content })
  .eq("id", noteId);

// DELETE
const { error } = await supabase
  .from("notes")
  .delete()
  .eq("id", noteId);
```

### **3. TypeScript Types**

```tsx
// src/types/note.ts
export interface Note {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: string;
  created_at: string;
}

// Usage
const [notes, setNotes] = useState<Note[]>([]);
```

### **4. Error Handling**

```tsx
try {
  const { data, error } = await supabase.from("notes").select("*");
  if (error) {
    console.error("Error fetching notes:", error);
    // Optionally show user-facing error
    return;
  }
  setNotes(data);
} catch (error) {
  console.error("Unexpected error:", error);
}
```

### **5. Dialog Pattern**

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState("");

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      <Input value={formData} onChange={e => setFormData(e.target.value)} />
      <DialogFooter>
        <Button type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

### **6. Tailwind Utilities**

```tsx
// Responsive design
className="w-full md:w-1/2 lg:w-1/3"

// Dark mode
className="bg-white dark:bg-gray-900 text-black dark:text-white"

// Hover states
className="hover:bg-gray-100 dark:hover:bg-gray-800"

// Conditional classes (use clsx or cn utility)
className={cn(
  "base-classes",
  isActive && "active-classes",
  "more-classes"
)}
```

---

## 🐛 Troubleshooting

### **Issue: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"**
**Solution:** Create `.env` file with correct variables.

### **Issue: "User not authenticated" errors**
**Solution:** 
- Check RLS policies in Supabase
- Verify JWT is being sent (check Network tab)
- Clear localStorage and re-login

### **Issue: Dark mode not persisting**
**Solution:** Check localStorage for "theme" key. Should be "light" or "dark".

### **Issue: TypeScript errors on Supabase queries**
**Solution:** 
- Ensure types match database schema
- Use type assertions if needed: `as Note[]`

### **Issue: Dialogs not closing**
**Solution:** 
- Ensure `onOpenChange` is connected to state
- Check that close buttons call `setOpen(false)`

### **Issue: Notes not appearing**
**Solution:**
- Check browser console for errors
- Verify `user_id` is being set correctly
- Check RLS policies allow SELECT

---

## 🎓 Learning Resources

### **React & TypeScript:**
- [React Official Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### **Supabase:**
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### **Tailwind CSS:**
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### **shadcn/ui:**
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Radix UI Docs](https://www.radix-ui.com/)

---

## 🚀 Next Steps for Development

### **Immediate Improvements:**
- [x] ~~Add toast notifications for success/error messages~~ ✅ **Implemented with Sonner**
- [ ] Add note sorting options (by date, title, etc.)
- [ ] Add rich text editor (TipTap, Quill)
- [ ] Add note tags/labels
- [ ] Add note sharing functionality

### **Medium-term:**
- [ ] Add real-time collaboration (Supabase realtime)
- [ ] Add file attachments (Supabase storage)
- [ ] Add note templates
- [ ] Add keyboard shortcuts
- [ ] Add bulk actions (multi-select, bulk delete)

### **Long-term:**
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] AI-powered features (summarization, auto-tagging)
- [ ] Team workspaces
- [ ] Version history for notes

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review code comments
3. Check Supabase logs in dashboard
4. Review browser console for errors

---

**Happy Coding! 🎉**

*Last Updated: [Current Date]*
