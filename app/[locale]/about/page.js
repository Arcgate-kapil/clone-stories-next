
import AboutStories from '@/app/components/AboutStories';
import { ABOUT_PAGE, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? ABOUT_PAGE.title_hi : ABOUT_PAGE.title,
    description: locale == 'hindi' ? ABOUT_PAGE.description_hi : ABOUT_PAGE.description,
    openGraph: {
      title: locale == 'hindi' ? ABOUT_PAGE.title_hi : ABOUT_PAGE.title,
      description: locale == 'hindi' ? ABOUT_PAGE.description_hi : ABOUT_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/about' : HOST + '/about',
      siteName: ABOUT_PAGE.siteName,
      images: [
        {
          url: ABOUT_PAGE.ogImage,
          width: 800,
          height: 400,
          alt: ABOUT_PAGE.title,
          secure_url: ABOUT_PAGE.ogImage,
        },
        {
          url: ABOUT_PAGE.ogImage,
          width: 1800,
          height: 1600,
          alt: ABOUT_PAGE.title,
          secure_url: ABOUT_PAGE.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: ABOUT_PAGE.title,
      description: ABOUT_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/about' : HOST + '/about',
      images: {
        url: ABOUT_PAGE.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/about' : HOST + '/about',
      languages: {
        'en-US': `${HOST}/about`,
        'x-default': `${HOST}/about`,
      },
    },
  };
}

export default function page() {

  return( 
    <AboutStories />
)}
