
import PodcastListPage from '@/app/components/PodcastListPage';
import { PODCAST_LIST, STORY_LIST, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? PODCAST_LIST.title_hi : PODCAST_LIST.title,
    description: locale == 'hindi' ? PODCAST_LIST.description_hi : PODCAST_LIST.description,
    openGraph: {
      title: locale == 'hindi' ? PODCAST_LIST.title_hi : PODCAST_LIST.title,
      description: locale == 'hindi' ? PODCAST_LIST.description_hi : PODCAST_LIST.description,
      url: locale == 'hindi' ? HOST + '/hindi/podcasts' : HOST + '/podcasts',
      siteName: STORY_LIST.siteName,
      images: [
        {
          url: STORY_LIST.ogImage,
          width: 800,
          height: 400,
          alt: PODCAST_LIST.title,
          secure_url: STORY_LIST.ogImage,
        },
        {
          url: STORY_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: PODCAST_LIST.title,
          secure_url: STORY_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: PODCAST_LIST.title,
      description: PODCAST_LIST.description,
      url: locale == 'hindi' ? HOST + '/hindi/podcasts' : HOST + '/podcasts',
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
      canonical: locale == 'hindi' ? HOST + '/hindi/podcasts' : HOST + '/podcasts',
      languages: {
        'en': `${HOST}/podcasts`,
        'en-US': `${HOST}/podcasts`,
        'hi': `${HOST}/hindi/podcasts`,
        'hi-IN': `${HOST}/hindi/podcasts`,
        'x-default': `${HOST}/podcasts`,
      },
    },
  };
}

export default function page() {

  return( 
    <PodcastListPage />
)}
