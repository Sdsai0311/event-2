# 🌟 Event Manager Pro
A premium, full-stack themed event management application built with React, TypeScript, and Google Cloud integrations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSdsai0311%2Fevent-2&root-directory=event-manager)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Sdsai0311/event-2&base=event-manager)

## 🚀 Features
- **Smart Dashboard**: Comprehensive overview of all events with filtering and search.
- **Google Integrations**: 
  - 📅 **Google Calendar**: One-click sync for event dates and times.
  - 📍 **Google Maps**: Visualized venue locations for booked events.
  - 👥 **Google Contacts**: Direct import of guest lists from your Google account.
- **Project Management**: 
  - 💰 **Budget Tracker**: Real-time expense monitoring and paid status.
  - 🕒 **Timeline Planner**: Minute-by-minute schedule management.
  - 📋 **Day-of Checklist**: Interactive task list for event execution.
- **Vendor & Venue Management**: Database for contacts, costs, and statuses.
- **Guest List Management**: Tracking invitations, VIP status, and dietary notes.
- **Security**: Full authentication flow with protected routes.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **State Management**: Zustand (with Persistence)
- **Forms**: React Hook Form, Zod
- **API**: Mock service layer (ready for backend swap)

## 📦 Deployment

### GitHub Pages (Automated)
This repository is configured with GitHub Actions to automatically deploy to GitHub Pages on every push to `main`.
1. Go to your repository settings on GitHub.
2. Select **Pages** from the sidebar.
3. Under **Build and deployment**, set the source to **GitHub Actions**.

### Vercel / Netlify
For the best experience with SPA routing, we recommend Vercel or Netlify. Click the buttons above for a one-click deployment.

## ⚙️ Configuration
Create a `.env` file in the `event-manager` directory with your Google API keys:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

## 🏃 Local Development
```bash
cd event-manager
npm install
npm run dev
```
