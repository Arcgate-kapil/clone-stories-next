import Providers from './providers';
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/assets/css/audio.css";
import "../public/assets/fonts/fonts.css";
import "../public/assets/css/fontello.css";
import "../public/assets/css/main.css";
import "./globals.css";
import { Analytics } from './components/Analytics';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Providers>
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
