# QuickNotes 📝

> A modern, intuitive note-taking application with folder organization and real-time search.

Live Demo -> https://notes-app-8wk.pages.dev/

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.16-cyan)
<img width="1883" height="925" alt="Screenshot 2025-11-20 182637" src="https://github.com/user-attachments/assets/aea488d9-2e43-43af-8080-c293485d0f05" />

---

## ✨ Features

- 📝 **Note Management** - Create, edit, and delete notes with rich content
- 📁 **Folder Organization** - Organize notes into custom folders
- 🔍 **Real-time Search** - Search notes by title or content instantly
- 🎨 **Dark Mode** - Beautiful dark theme with persistent preference
- 🔐 **User Authentication** - Secure login with Supabase Auth
- 🔔 **Toast Notifications** - Non-intrusive feedback for all user actions
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and production

---

## 🛠 Tech Stack

### **Frontend**
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components built on Radix UI
- **React Router** - Client-side routing
- **Sonner** - Beautiful toast notifications for user feedback
- **date-fns** - Modern date utility library
- **lucide-react** - Beautiful icon library

### **Backend**
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication & authorization
  - Row Level Security (RLS)
  - Auto-generated RESTful API

---
### **Screenshots of the Notes-app**
<img width="1920" height="954" alt="Screenshot 2025-11-20 064314" src="https://github.com/user-attachments/assets/cf04fe2e-b7a6-46d1-9563-53e91e79f32f" />
<img width="1920" height="954" alt="Screenshot 2025-11-20 064530" src="https://github.com/user-attachments/assets/bd1ca0f0-0e8e-41af-88ce-f80945dea35c" />
<img width="1906" height="947" alt="Screenshot 2025-11-20 064632" src="https://github.com/user-attachments/assets/ead514ef-c1d8-4f07-8ee3-b79d9c4b922f" />
<img width="1883" height="943" alt="Screenshot 2025-11-20 064703" src="https://github.com/user-attachments/assets/3b16fae8-4481-45d7-bfe3-d0963062618b" />

---


## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account (free tier available)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/bedo22/Notes-app.git
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `DEVELOPER_DOCUMENTATION.md` in your Supabase SQL Editor
   - Copy your project URL and anon key from Settings > API

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📖 Documentation

For detailed documentation, see:
- **[DEVELOPER_DOCUMENTATION.md](./DEVELOPER_DOCUMENTATION.md)** - Complete technical documentation

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🗂 Project Structure

```
notes-app/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── AddNoteForm.tsx
│   │   ├── FolderList.tsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Auth.tsx
│   │   ├── NoteList.tsx
│   │   └── NoteDetail.tsx
│   ├── lib/             # Utilities
│   │   └── supabaseClient.ts
│   ├── types/           # TypeScript types
│   └── main.tsx         # Entry point
├── .env                 # Environment variables (not in git)
└── package.json
```

---

## 🔐 Authentication

QuickNotes uses Supabase Authentication with:
- Email/password signup and login
- Secure JWT tokens
- Row Level Security (RLS) for data isolation
- Persistent sessions via localStorage

---

## 🗄 Database Schema

### **Notes Table**
- `id` - Unique identifier
- `user_id` - Owner of the note
- `folder_id` - Associated folder (nullable)
- `title` - Note title
- `content` - Note content
- `created_at` - Creation timestamp

### **Folders Table**
- `id` - Unique identifier
- `user_id` - Owner of the folder
- `name` - Folder name
- `created_at` - Creation timestamp

See `DEVELOPER_DOCUMENTATION.md` for complete schema and SQL.

---

## 🎨 Features in Detail

### **Note Management**
- Create notes with title and content
- Edit existing notes
- Delete notes with confirmation
- Assign notes to folders
- Move notes between folders

### **Folder Organization**
- Create custom folders
- Rename folders
- Delete folders (notes move to "All Notes")
- Filter notes by folder
- View all notes in one place

### **Search & Filter**
- Real-time search across titles and content
- Case-insensitive matching
- Filter by folder
- Beautiful empty states

### **UI/UX**
- Clean, modern interface
- Dark mode with toggle
- Toast notifications (Sonner)
- Responsive design
- Keyboard shortcuts
- Loading states
- Confirmation dialogs

---

## 🔮 Future Enhancements

- [ ] Rich text editor
- [ ] Note tags/labels
- [ ] Note sharing
- [ ] File attachments
- [ ] Real-time collaboration
- [ ] Mobile app
- [ ] Export notes (PDF, Markdown)

---

## 🤝 Contributing

Contributions are welcome! Please read `DEVELOPER_DOCUMENTATION.md` to understand the codebase.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Abdelrahman Khaled

---

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Happy Note-Taking! 📝✨**
