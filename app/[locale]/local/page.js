
import LocalListPage from '@/app/components/LocalListPage';
import { LOCAL_LIST_PAGE, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? LOCAL_LIST_PAGE.title_hi : LOCAL_LIST_PAGE.title,
    description: locale == 'hindi' ? LOCAL_LIST_PAGE.description_hi : LOCAL_LIST_PAGE.description,
    openGraph: {
      title: locale == 'hindi' ? LOCAL_LIST_PAGE.title_hi : LOCAL_LIST_PAGE.title,
      description: locale == 'hindi' ? LOCAL_LIST_PAGE.description_hi : LOCAL_LIST_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/local' : HOST + '/local',
      siteName: LOCAL_LIST_PAGE.siteName,
      images: [
        {
          url: LOCAL_LIST_PAGE.ogImage,
          width: 800,
          height: 400,
          alt: LOCAL_LIST_PAGE.title,
          secure_url: LOCAL_LIST_PAGE.ogImage,
        },
        {
          url: LOCAL_LIST_PAGE.ogImage,
          width: 1800,
          height: 1600,
          alt: LOCAL_LIST_PAGE.title,
          secure_url: LOCAL_LIST_PAGE.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: LOCAL_LIST_PAGE.title,
      description: LOCAL_LIST_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/local' : HOST + '/local',
      images: {
        url: LOCAL_LIST_PAGE.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/local' : HOST + '/local',
      languages: {
        'en-US': `${HOST}/local`,
        'x-default': `${HOST}/local`,
      },
    },
  };
}

export default function page() {

  return( 
    <LocalListPage />
)}
