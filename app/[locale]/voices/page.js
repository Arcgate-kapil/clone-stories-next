
import VoicesListPage from '@/app/components/VoicesListPage';
import { VOICE_LIST_PAGE, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? VOICE_LIST_PAGE.title_hi : VOICE_LIST_PAGE.title,
    description: locale == 'hindi' ? VOICE_LIST_PAGE.description_hi : VOICE_LIST_PAGE.description,
    openGraph: {
      title: locale == 'hindi' ? VOICE_LIST_PAGE.title_hi : VOICE_LIST_PAGE.title,
      description: locale == 'hindi' ? VOICE_LIST_PAGE.description_hi : VOICE_LIST_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/voices' : HOST + '/voices',
      siteName: VOICE_LIST_PAGE.siteName,
      images: [
        {
          url: VOICE_LIST_PAGE.ogImage,
          width: 800,
          height: 400,
          alt: VOICE_LIST_PAGE.title,
          secure_url: VOICE_LIST_PAGE.ogImage,
        },
        {
          url: VOICE_LIST_PAGE.ogImage,
          width: 1800,
          height: 1600,
          alt: VOICE_LIST_PAGE.title,
          secure_url: VOICE_LIST_PAGE.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: VOICE_LIST_PAGE.title,
      description: VOICE_LIST_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/voices' : HOST + '/voices',
      images: {
        url: VOICE_LIST_PAGE.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/voices' : HOST + '/voices',
      languages: {
        'en': `${HOST}/voices`,
        'en-US': `${HOST}/voices`,
        'hi': `${HOST}/hindi/voices`,
        'hi-IN': `${HOST}/hindi/voices`,
        'x-default': `${HOST}/voices`,
      },
    },
  };
}

export default function page() {

  return( 
    <VoicesListPage />
)}
