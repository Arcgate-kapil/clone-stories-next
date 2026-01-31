import Providers from './providers';
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/assets/css/audio.css";
import "../public/assets/fonts/fonts.css";
import "../public/assets/css/fontello.css";
import "../public/assets/css/main.css";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
