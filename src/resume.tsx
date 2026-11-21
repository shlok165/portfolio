import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { ResumePage } from '@/features/resume/ResumePage'

const root = document.getElementById('root')!
const page = (
  <StrictMode>
    <ResumePage />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
