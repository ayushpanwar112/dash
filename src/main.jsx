
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { MyProvider } from './contest/MyProvider.jsx';
import { Provider } from 'react-redux';
import store from './features/store.js';

createRoot(document.getElementById('root')).render(
<MyProvider>


    <BrowserRouter>
<Provider store={store}>
    <App /></Provider>

    
   </BrowserRouter>
   </MyProvider>

)
