import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { ResumePage } from '@/features/resume/ResumePage'

/** Build-time render of each page to static HTML (see scripts/prerender.mjs). */
export function render(page: 'main' | 'resume') {
  return renderToString(<StrictMode>{page === 'main' ? <App /> : <ResumePage />}</StrictMode>)
}
