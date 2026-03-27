import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Categories from './pages/Categories';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* CHỈ CÓ MỘT NHÓM ADMIN DUY NHẤT */}
        <Route path="/admin" element={<Layout />}>
          {/* path="/admin" -> Hiện Dashboard */}
          <Route index element={<Dashboard />} /> 
          
          {/* path="/admin/campaigns" -> Hiện Campaigns */}
          <Route path="campaigns" element={<Campaigns />} /> 
          
          <Route path="events" element={<Events />} />
          <Route path="articles" element={<Articles />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
          <Route path="organization" element={<Organization />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="celebrities" element={<Celebrities />} />
          <Route path="donations" element={<Donations />} />
        </Route>

        {/* Nếu gõ localhost:3000/ thì tự động nhảy vào /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
