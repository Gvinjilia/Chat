import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router'
import { CallProvider } from './context/CallContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatProvider>
      <AuthProvider>
        <CallProvider>
          <App />
        </CallProvider>
      </AuthProvider>
    </ChatProvider>
  </BrowserRouter>
)
