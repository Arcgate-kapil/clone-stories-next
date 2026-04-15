
import HomePage from '../components/HomePage';
import { HOME_PAGE, HOST } from '../constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? HOME_PAGE.title_hi : HOME_PAGE.title,
    description: locale == 'hindi' ? HOME_PAGE.description_hi : HOME_PAGE.description,
    openGraph: {
      title: locale == 'hindi' ? HOME_PAGE.title_hi : HOME_PAGE.title,
      description: locale == 'hindi' ? HOME_PAGE.description_hi : HOME_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi' : HOST + '/',
      siteName: HOME_PAGE.siteName,
      images: [
        {
          url: HOME_PAGE.ogImage,
          width: 800,
          height: 400,
          alt: HOME_PAGE.title,
          secure_url: HOME_PAGE.ogImage,
        },
        {
          url: HOME_PAGE.ogImage,
          width: 1800,
          height: 1600,
          alt: HOME_PAGE.title,
          secure_url: HOME_PAGE.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: HOME_PAGE.title,
      description: HOME_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi' : HOST + '/',
      images: {
        url: HOME_PAGE.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi' : HOST + '/',
      languages: {
        'en': `${HOST}/`,
        'en-US': `${HOST}/`,
        'hi': `${HOST}/hindi`,
        'hi-IN': `${HOST}/hindi`,
        'x-default': `${HOST}/`,
      },
    },
  };
}

export default function page() {

  return (
    <HomePage />
  )
}
