import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Events from './pages/Events';
import Articles from './pages/Articles';
import Users from './pages/Users';
import Organization from './pages/Organization';
import Sponsors from './pages/Sponsors';
import Celebrities from './pages/Celebrities';
import Donations from './pages/Donations';
import PartnerManagement from './pages/PartnerManagement';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import EventRegistrations from './pages/EventRegistrations';

export default function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/events" element={<Events />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/users" element={<Users />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/admin/events" element={<Events />} />
          {/* Route tạo mới sự kiện */}
          <Route path="/admin/events/create" element={<CreateEvent />} />
          {/* Route sửa sự kiện (nhận ID động) */}
          <Route path="/admin/events/edit/:id" element={<EditEvent />} />
          <Route path="/admin/campaigns" element={<Campaigns />} />
          <Route path="/admin/campaigns/create" element={<CreateCampaign />} />
          <Route path="/admin/campaigns/edit/:id" element={<EditCampaign />} />
          <Route path="/admin/articles" element={<Articles />} />
          <Route path="/admin/articles/create" element={<CreateArticle />} />
          <Route path="/admin/articles/edit/:id" element={<EditArticle />} />
          <Route path="/registrations" element={<EventRegistrations />} />
        </Routes>
      </Layout>
=======
      <Routes>
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/events" element={<Events />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/users" element={<Users />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/partners-management" element={<PartnerManagement />} />
                <Route path="/celebrities" element={<Celebrities />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/admin/events" element={<Events />} />
                <Route path="/admin/events/create" element={<CreateEvent />} />
                <Route path="/admin/events/edit/:id" element={<EditEvent />} />
                <Route path="/admin/campaigns" element={<Campaigns />} />
                <Route path="/admin/campaigns/create" element={<CreateCampaign />} />
                <Route path="/admin/campaigns/edit/:id" element={<EditCampaign />} />
                <Route path="/admin/articles" element={<Articles />} />
                <Route path="/admin/articles/create" element={<CreateArticle />} />
                <Route path="/admin/articles/edit/:id" element={<EditArticle />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    </Router>
  );
}
