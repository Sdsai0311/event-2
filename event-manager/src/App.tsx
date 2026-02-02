import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateEvent } from './pages/CreateEvent';
import { EventLayout } from './pages/EventLayout';
import { EventOverview } from './pages/EventOverview';
import { EventBudget } from './pages/EventBudget';
import { EventTimeline } from './pages/EventTimeline';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="events/:id" element={<EventLayout />}>
            <Route index element={<EventOverview />} />
            <Route path="budget" element={<EventBudget />} />
            <Route path="timeline" element={<EventTimeline />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
