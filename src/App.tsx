import { RouterProvider } from 'react-router-dom';
import { router } from './config/router';
import './App.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
