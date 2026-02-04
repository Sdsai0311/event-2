import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateEvent } from './pages/CreateEvent';
import { EventLayout } from './pages/EventLayout';
import { EventOverview } from './pages/EventOverview';
import { EventBudget } from './pages/EventBudget';
import { EventTimeline } from './pages/EventTimeline';
import { EventVenues } from './pages/EventVenues';
import { EventVendors } from './pages/EventVendors';
import { EventTeam } from './pages/EventTeam';
import { EventGuests } from './pages/EventGuests';
import { EventRisks } from './pages/EventRisks';
import { EventDayOf } from './pages/EventDayOf';
import { EventSettings } from './pages/EventSettings';
import { EventCertificates } from './pages/EventCertificates';
import { EventFeedback } from './pages/EventFeedback';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { StudentRegistration } from './pages/StudentRegistration';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="events/:id" element={<EventLayout />}>
            <Route index element={<EventOverview />} />
            <Route path="guests" element={<EventGuests />} />
            <Route path="venues" element={<EventVenues />} />
            <Route path="vendors" element={<EventVendors />} />
            <Route path="budget" element={<EventBudget />} />
            <Route path="timeline" element={<EventTimeline />} />
            <Route path="team" element={<EventTeam />} />
            <Route path="risks" element={<EventRisks />} />
            <Route path="day-of" element={<EventDayOf />} />
            <Route path="certificates" element={<EventCertificates />} />
            <Route path="feedback" element={<EventFeedback />} />
            <Route path="settings" element={<EventSettings />} />
          </Route>
        </Route>
        <Route path="/register/:eventId" element={<StudentRegistration />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
