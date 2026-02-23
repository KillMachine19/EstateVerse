import { createBrowserRouter } from 'react-router-dom';
import { Root } from '../layout/Root';
import { Home } from '../pages/Home';
import { Properties } from '../pages/Properties';
import { Services } from '../pages/Services';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';

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
