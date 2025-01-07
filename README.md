# Parent-Teacher Meeting Portal

A modern web application built with Next.js 13 that facilitates seamless communication and meeting scheduling between parents and teachers.

Live Link: ```bash 
            https://parent-teacher-dbms.vercel.app/ 
          ```

## 🌟 Features

- **Dual Authentication System**
  - Separate login portals for parents and teachers
  - Role-based access control
  - Secure session management

- **Meeting Management**
  - Schedule parent-teacher meetings
  - Real-time meeting status updates
  - Meeting request acceptance/rejection with feedback
  - Comprehensive meeting history

- **User-Friendly Interface**
  - Responsive design for all devices
  - Intuitive navigation
  - Beautiful UI with modern design principles
  - Real-time updates and notifications

## 🔒 Authentication

### Parent Login
- Username: parent1
- Password: pass123

### Teacher Login
- Username: teacher1
- Password: pass123

## 🚀 Tech Stack

- **Frontend**
  - Next.js 13 (App Router)
  - React 18
  - Tailwind CSS
  - shadcn/ui Components
  - TypeScript

- **Backend**
  - Next.js API Routes
  - PostgreSQL with Supabase
  - Server-side Authentication

- **Development & Deployment**
  - Vercel Deployment
  - Environment Variables
  - TypeScript
  - ESLint

## 📋 Prerequisites

- Node.js 18.x or later
- PostgreSQL database (or Supabase account)
- npm or yarn package manager

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Eahtasham/Parent-Teacher-DBMS.git
   cd parent-teacher-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=your_database_connection_string
   ```

4. Run database migrations:
   ```bash
   npx supabase db push
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📱 Usage Guide

1. **Login**
   - Choose between Parent or Teacher portal
   - Enter credentials
   - System redirects to respective dashboard

2. **Parent Dashboard**
   - View all scheduled meetings
   - Request new meetings
   - Check meeting status
   - View teacher feedback

3. **Teacher Dashboard**
   - View pending meeting requests
   - Accept/Reject meetings
   - Provide feedback
   - Manage schedule

## 🛣️ Future Improvements

1. **Enhanced Features**
   - Real-time chat system
   - Video conferencing integration
   - Calendar integration
   - Email notifications
   - Student performance tracking

2. **Technical Improvements**
   - Implement refresh tokens
   - Add unit and integration tests
   - Implement rate limiting
   - Add WebSocket for real-time updates
   - Implement proper password hashing
   - Add forgot password functionality

3. **UI/UX Improvements**
   - Dark mode support
   - Accessibility improvements
   - Mobile app development
   - Offline support
   - Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.
