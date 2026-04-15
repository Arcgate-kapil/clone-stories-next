
import TagListPage from '@/app/components/TagListPage';
import { TAG_LIST, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? TAG_LIST.title_hi : TAG_LIST.title,
    description: locale == 'hindi' ? TAG_LIST.description_hi : TAG_LIST.description,
    openGraph: {
      title: locale == 'hindi' ? TAG_LIST.title_hi : TAG_LIST.title,
      description: locale == 'hindi' ? TAG_LIST.description_hi : TAG_LIST.description,
      url: locale == 'hindi' ? HOST + '/hindi/tags' : HOST + '/tags',
      siteName: TAG_LIST.siteName,
      images: [
        {
          url: TAG_LIST.ogImage,
          width: 800,
          height: 400,
          alt: TAG_LIST.title,
          secure_url: TAG_LIST.ogImage,
        },
        {
          url: TAG_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: TAG_LIST.title,
          secure_url: TAG_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: locale == 'hindi' ? TAG_LIST.title_hi : TAG_LIST.title,
      description: locale == 'hindi' ? TAG_LIST.description_hi : TAG_LIST.description,
      url: locale == 'hindi' ? HOST + '/hindi/tags' : HOST + '/tags',
      images: {
        url: TAG_LIST.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/tags' : HOST + '/tags',
      languages: {
        'en': `${HOST}/tags`,
        'en-US': `${HOST}/tags`,
        'hi': `${HOST}/hindi/tags`,
        'hi-IN': `${HOST}/hindi/tags`,
        'x-default': `${HOST}/`,
      },
    },
  };
}

export default function page() {

  return( 
    <TagListPage />
)}
