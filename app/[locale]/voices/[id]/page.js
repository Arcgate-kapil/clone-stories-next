
import VoicesDetailPage from '@/app/components/VoicesDetailPage';
import { STORY_LIST, HOST } from '@/app/constants/localString';

async function fetchCategories() {

  const response = await fetch(`https://cdn.workmob.com/stories_workmob/config-latest/category.json`);

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function generateMetadata({ params }) {

  let { locale, id } = await params;

  let categories = await fetchCategories();

  const foundObject = categories?.categories?.find(obj =>
    Object.values(obj).includes(id)
  );

  return {
    title: locale == 'hindi' ? `भारत के ${foundObject?.title} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की प्रेरक कहानियाँ।` : `${foundObject?.title} Professionals, Startups & Businesses from India | Video Stories & People`,
    description: locale == 'hindi' ? `भारत के ${foundObject?.title} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की व्यक्तिगत एवं करियर यात्रा और व्यावसायिक ब्रांड कहानियां देखें।` : `Watch personal, career journey and business brand stories of ${foundObject?.title} professionals, startups & business owners from India. Discover interesting people.`,
    openGraph: {
      title: locale == 'hindi' ? `भारत के ${foundObject?.title} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की प्रेरक कहानियाँ।` : `${foundObject?.title} Professionals, Startups & Businesses from India | Video Stories & People`,
      description: locale == 'hindi' ? `भारत के ${foundObject?.title} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की व्यक्तिगत एवं करियर यात्रा और व्यावसायिक ब्रांड कहानियां देखें।` : `Watch personal, career journey and business brand stories of ${foundObject?.title} professionals, startups & business owners from India. Discover interesting people.`,
      url: locale == 'hindi' ? HOST + '/hindi/voices/' + id : HOST + '/voices/' + id,
      siteName: STORY_LIST.siteName,
      images: [
        {
          url: STORY_LIST.ogImage,
          width: 800,
          height: 400,
          alt: `${foundObject?.title} Professionals, Startups & Businesses from India | Video Stories & People`,
          secure_url: STORY_LIST.ogImage,
        },
        {
          url: STORY_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: `${foundObject?.title} Professionals, Startups & Businesses from India | Video Stories & People`,
          secure_url: STORY_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${foundObject?.title} Professionals, Startups & Businesses from India | Video Stories & People`,
      description: `Watch personal, career journey and business brand stories of ${foundObject?.title} professionals, startups & business owners from India. Discover interesting people.`,
      url: locale == 'hindi' ? HOST + '/hindi/voices/' + id : HOST + '/voices/' + id,
      images: {
        url: STORY_LIST.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/voices/' + id : HOST + '/voices/' + id,
      languages: {
        'en': `${HOST}/voices/${id}`,
        'en-US': `${HOST}/voices/${id}`,
        'hi': `${HOST}/hindi/voices/${id}`,
        'hi-IN': `${HOST}/hindi/voices/${id}`,
        'x-default': `${HOST}/voices/${id}`,
      },
    },
  };
}

export default function page() {

  return (
    <VoicesDetailPage />
  )
}