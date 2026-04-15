
import LocalDetailPage from '@/app/components/LocalDetailPage';
import { STORY_LIST, HOST } from '@/app/constants/localString';

let cityDetail = [];

async function fetchCityDetail(id) {

  let convertedPathname = id?.replace(/-/g, "_");
  const response = await fetch(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/locations/${convertedPathname}`);

  if (!response.ok) {
    throw new Error('Failed to fetch city detail');
  }
  return response.json();
}

export async function generateMetadata({ params }) {

  let { locale, id } = await params;
  cityDetail = await fetchCityDetail(id);

  return {
    title: locale == 'hindi' ? `${cityDetail?.stories[0]?.location_hindi} लोकल प्रोफेशनल्स (स्थानीय पेशेवरों), बिज़नेस ओनर्स, स्टार्टअप्स। खोजें व कनेक्ट करें।` : `${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`,
    description: locale == 'hindi' ? `स्थानीय प्रोफेशनल्स, स्टार्टअप्स एवं बिज़नेस ओनर्स को सर्च करें और उनसे कनेक्ट करें।` : `Discover, connect and meet with local ${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location.slice(1)} professionals, business owners, startups, social workers and more.`,
    openGraph: {
      title: locale == 'hindi' ? `${cityDetail?.stories[0]?.location_hindi} लोकल प्रोफेशनल्स (स्थानीय पेशेवरों), बिज़नेस ओनर्स, स्टार्टअप्स। खोजें व कनेक्ट करें।` : `${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`,
      description: locale == 'hindi' ? `स्थानीय प्रोफेशनल्स, स्टार्टअप्स एवं बिज़नेस ओनर्स को सर्च करें और उनसे कनेक्ट करें।` : `Discover, connect and meet with local ${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location.slice(1)} professionals, business owners, startups, social workers and more.`,
      url: locale == 'hindi' ? HOST + '/hindi/local/' + id : HOST + '/local/' + id,
      siteName: STORY_LIST.siteName,
      images: [
        {
          url: STORY_LIST.ogImage,
          width: 800,
          height: 400,
          alt: `${cityDetail?.stories[0]?.location?.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`,
          secure_url: STORY_LIST.ogImage,
        },
        {
          url: STORY_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: `${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location?.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`,
          secure_url: STORY_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`,
      description: `Discover, connect and meet with local ${cityDetail?.stories[0]?.location.charAt(0).toUpperCase() + cityDetail?.stories[0]?.location?.slice(1)} professionals, business owners, startups, social workers and more.`,
      url: locale == 'hindi' ? HOST + '/hindi/local/' + id : HOST + '/local/' + id,
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
      canonical: locale == 'hindi' ? HOST + '/hindi/local/' + id : HOST + '/local/' + id,
      languages: {
        'en': `${HOST}/local/${id}`,
        'en-US': `${HOST}/local/${id}`,
        'hi': `${HOST}/hindi/local/${id}`,
        'hi-IN': `${HOST}/hindi/local/${id}`,
        'x-default': `${HOST}/local/${id}`,
      },
    },
  };
}

export default async function page({ params }) {

  let { id } = await params;
  cityDetail = await fetchCityDetail(id);

  return( 
    <LocalDetailPage cityDetail={cityDetail?.stories} />
)}
