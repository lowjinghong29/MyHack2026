import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Entities from './pages/Entities';
import Linkages from './pages/Linkages';
import LinkageDetail from './pages/LinkageDetail';
import AIMatch from './pages/AIMatch';
import Interactions from './pages/Interactions';
import Register from './pages/Register';
import RegisterCompany from './pages/RegisterCompany';
import Consent from './pages/Consent';
import AdminFlags from './pages/AdminFlags';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entities" element={<Entities />} />
          <Route path="linkages" element={<Linkages />} />
          <Route path="linkages/:id" element={<LinkageDetail />} />
          <Route path="ai-match" element={<AIMatch />} />
          <Route path="interactions" element={<Interactions />} />
          <Route path="register" element={<Register />} />
          <Route path="register/company" element={<RegisterCompany />} />
          <Route path="consent/:matchId" element={<Consent />} />
          <Route path="admin/flags" element={<AdminFlags />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
