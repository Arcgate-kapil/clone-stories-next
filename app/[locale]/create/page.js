
import Rules from '@/app/components/Rules';
import { CREATE_PAGE, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? CREATE_PAGE.title_hi : CREATE_PAGE.title,
    description: locale == 'hindi' ? CREATE_PAGE.description_hi : CREATE_PAGE.description,
    openGraph: {
      title: locale == 'hindi' ? CREATE_PAGE.title_hi : CREATE_PAGE.title,
      description: locale == 'hindi' ? CREATE_PAGE.description_hi : CREATE_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/create' : HOST + '/create',
      siteName: CREATE_PAGE.siteName,
      images: [
        {
          url: CREATE_PAGE.ogImage,
          width: 800,
          height: 400,
          alt: CREATE_PAGE.title,
          secure_url: CREATE_PAGE.ogImage,
        },
        {
          url: CREATE_PAGE.ogImage,
          width: 1800,
          height: 1600,
          alt: CREATE_PAGE.title,
          secure_url: CREATE_PAGE.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: locale == 'hindi' ? CREATE_PAGE.title_hi : CREATE_PAGE.title,
      description: locale == 'hindi' ? CREATE_PAGE.description_hi : CREATE_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/create' : HOST + '/create',
      images: {
        url: CREATE_PAGE.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/create' : HOST + '/create',
      languages: {
        'en-US': `${HOST}/`,
        'x-default': `${HOST}/`,
      },
    },
  };
}

export default function page() {

  return( 
    <Rules />
)}
