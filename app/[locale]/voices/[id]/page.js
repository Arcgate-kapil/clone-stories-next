
import VoicesDetailPage from '@/app/components/VoicesDetailPage';
import { STORY_LIST, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale, id } = await params;
  // भारत के (एडवरटाइजिंग) प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की व्यक्तिगत एवं करियर यात्रा और व्यावसायिक ब्रांड कहानियां देखें। 

  return {
    title: locale == 'hindi' ? `भारत के ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की प्रेरक कहानियाँ।` : `${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Professionals, Startups & Businesses from India | Video Stories & People`,
    description: locale == 'hindi' ? `भारत के ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की व्यक्तिगत एवं करियर यात्रा और व्यावसायिक ब्रांड कहानियां देखें।` : `Watch personal, career journey and business brand stories of ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} professionals, startups & business owners from India. Discover interesting people.`,
    openGraph: {
      title: locale == 'hindi' ? `भारत के ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की प्रेरक कहानियाँ।` : `${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Professionals, Startups & Businesses from India | Video Stories & People`,
      description: locale == 'hindi' ? `भारत के ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} प्रोफेशनल्स, स्टार्टअप्स और बिज़नेस ओनर्स की व्यक्तिगत एवं करियर यात्रा और व्यावसायिक ब्रांड कहानियां देखें।` : `Watch personal, career journey and business brand stories of ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} professionals, startups & business owners from India. Discover interesting people.`,
      url: locale == 'hindi' ? HOST + '/hindi/voices/' + id : HOST + '/voices/' + id,
      siteName: STORY_LIST.siteName,
      images: [
        {
          url: STORY_LIST.ogImage,
          width: 800,
          height: 400,
          alt: `${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Professionals, Startups & Businesses from India | Video Stories & People`,
          secure_url: STORY_LIST.ogImage,
        },
        {
          url: STORY_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: `${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Professionals, Startups & Businesses from India | Video Stories & People`,
          secure_url: STORY_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Professionals, Startups & Businesses from India | Video Stories & People`,
      description: `Watch personal, career journey and business brand stories of ${id.replace(/_/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} professionals, startups & business owners from India. Discover interesting people.`,
      url: locale == 'hindi' ? HOST + '/hindi/voices/' + id : HOST + '/voices/' + id,
      images: {
        url: STORY_LIST.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/voices/' + id : HOST + '/voices/' + id,
      languages: {
        'en-US': `${HOST}/voices/${id}`,
        'x-default': `${HOST}/voices/${id}`,
      },
    },
  };
}

export default function page() {

  return( 
    <VoicesDetailPage />
)}
