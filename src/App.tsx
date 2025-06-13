import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Assessments from './pages/Assessments';
import Layout from './components/layout/Navabr';
import { Toaster } from 'sonner';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Assessments />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
};

export default App;
