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
import { UpcomingEvents } from './pages/UpcomingEvents';
import { UploadUpcomingEvent } from './pages/UploadUpcomingEvent';
import { EditUpcomingEvent } from './pages/EditUpcomingEvent';
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
          <Route path="upcoming" element={<UpcomingEvents />} />

          {/* Admin Only Routes */}
          <Route path="upcoming/upload" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UploadUpcomingEvent />
            </ProtectedRoute>
          } />
          <Route path="upcoming/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditUpcomingEvent />
            </ProtectedRoute>
          } />
          <Route path="create-event" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateEvent />
            </ProtectedRoute>
          } />

          <Route path="events/:id" element={<EventLayout />}>
            <Route index element={<EventOverview />} />
            <Route path="guests" element={<EventGuests />} />
            <Route path="venues" element={<EventVenues />} />
            <Route path="vendors" element={<EventVendors />} />

            {/* Admin Only Event Details */}
            <Route path="budget" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventBudget />
              </ProtectedRoute>
            } />
            <Route path="timeline" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventTimeline />
              </ProtectedRoute>
            } />
            <Route path="team" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventTeam />
              </ProtectedRoute>
            } />
            <Route path="risks" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventRisks />
              </ProtectedRoute>
            } />
            <Route path="day-of" element={<EventDayOf />} />
            <Route path="certificates" element={<EventCertificates />} />
            <Route path="feedback" element={<EventFeedback />} />
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventSettings />
              </ProtectedRoute>
            } />
          </Route>
        </Route>
        <Route path="/register/:eventId" element={<StudentRegistration />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
