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

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/events" element={<Events />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/users" element={<Users />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/celebrities" element={<Celebrities />} />
          <Route path="/donations" element={<Donations />} />
        </Routes>
      </Layout>
    </Router>
  );
}
