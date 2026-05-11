// 'use client';

// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistor, store } from './lib/store';

// export default function Providers({ children }) {

//   return (
//     <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           {children}
//         </PersistGate>
//     </Provider>
//   )
// }

'use client';

import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
// import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './lib/store';

const PersistGate = dynamic(() =>
    import('redux-persist/integration/react').then(
      (mod) => mod.PersistGate
    ),
  { ssr: false }
);

export default function Providers({ children }) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}