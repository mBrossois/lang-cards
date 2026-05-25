import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import CardsHub from './CardsHub'
import Cards from './Cards'
import AddCards from './AddCards'
import CameraCapture from './CameraCapture'
import Settings from './Settings'
import Layout from './shared/Layout'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cards" element={<CardsHub />} />
          <Route path="/cards/:mode" element={<Cards />} />
          <Route path="/add-cards-default" element={<AddCards />} />
        <Route path="/add-cards-default/camera" element={<CameraCapture />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
