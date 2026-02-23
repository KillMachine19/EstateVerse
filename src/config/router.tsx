import { createBrowserRouter } from 'react-router-dom';
import { Root } from '../layout/Root';
import { Home } from '../pages/Home/Home';
import { Properties } from '../pages/Properties/Properties';
import { Services } from '../pages/Services/Services';
import { About } from '../pages/About/About';
import { Contact } from '../pages/Contact/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'properties',
        element: <Properties />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
]);
