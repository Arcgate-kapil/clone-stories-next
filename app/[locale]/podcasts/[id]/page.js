
import PodcastDetailPage from '@/app/components/PodcastDetailPage';
import { STORY_LIST, HOST } from '@/app/constants/localString';

let initialData = { data: null, loading: true };
let category = [];

async function fetchCategoryAudio() {

  const response = await fetch(`https://cdn.workmob.com/stories_workmob/config/audio-category.json`);

  if (!response.ok) {
    throw new Error('Failed to fetch feed category audio');
  }
  return response.json();
}

async function fetchCategory(categ) {

  const response = await fetch(`https://cdn.workmob.com/stories_workmob/config/audio-category-index/${categ}.json`);

  if (!response.ok) {
    throw new Error('Failed to fetch feed category');
  }
  return response.json();
}

export async function generateMetadata({ params }) {

  let { locale, id } = await params;

  const categoryAudio = await fetchCategoryAudio();
  let mainCategory = categoryAudio.filter(e => e.category == id);

  if (mainCategory?.length == 0) {
    return {
      title: locale == 'hindi' ? `${initialData?.data?.name_hindi}, ${initialData?.data?.job_title_hindi}, ${initialData?.data?.company_name_hindi}, ${initialData?.data?.location_hindi} पॉडकास्ट एपिसोड` : `${initialData?.data?.name}, ${initialData?.data?.job_title}, ${initialData?.data?.company_name}, ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} Podcast Episode`,
      description: locale == 'hindi' ? `वर्कमोब पॉडकास्ट पर ${initialData?.data?.name_hindi}, ${initialData?.data?.company_name_hindi}, ${initialData?.data?.location_hindi} में ${initialData?.data?.job_title_hindi} की मोटिवेशनल ऑडियो स्टोरी सुनें।` : `Listen to the motivational audio story of ${initialData?.data?.name}, ${initialData?.data?.job_title} at ${initialData?.data?.company_name} in ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} on Workmob Podcast.`,
      openGraph: {
        title: locale == 'hindi' ? `${initialData?.data?.name_hindi}, ${initialData?.data?.job_title_hindi}, ${initialData?.data?.company_name_hindi}, ${initialData?.data?.location_hindi} पॉडकास्ट एपिसोड` : `${initialData?.data?.name}, ${initialData?.data?.job_title}, ${initialData?.data?.company_name}, ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} Podcast Episode`,
        description: locale == 'hindi' ? `वर्कमोब पॉडकास्ट पर ${initialData?.data?.name_hindi}, ${initialData?.data?.company_name_hindi}, ${initialData?.data?.location_hindi} में ${initialData?.data?.job_title_hindi} की मोटिवेशनल ऑडियो स्टोरी सुनें।` : `Listen to the motivational audio story of ${initialData?.data?.name}, ${initialData?.data?.job_title} at ${initialData?.data?.company_name} in ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} on Workmob Podcast.`,
        url: locale == 'hindi' ? HOST + '/hindi/podcasts/' + id : HOST + '/podcasts/' + id,
        siteName: STORY_LIST.siteName,
        images: [
          {
            url: STORY_LIST.ogImage,
            width: 800,
            height: 400,
            alt: `${initialData?.data?.name}, ${initialData?.data?.job_title}, ${initialData?.data?.company_name}, ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} Podcast Episode`,
            secure_url: STORY_LIST.ogImage,
          },
          {
            url: STORY_LIST.ogImage,
            width: 1800,
            height: 1600,
            alt: `${initialData?.data?.name}, ${initialData?.data?.job_title}, ${initialData?.data?.company_name}, ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} Podcast Episode`,
            secure_url: STORY_LIST.ogImage,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${initialData?.data?.name}, ${initialData?.data?.job_title}, ${initialData?.data?.company_name}, ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} Podcast Episode`,
        description: `Listen to the motivational audio story of ${initialData?.data?.name}, ${initialData?.data?.job_title} at ${initialData?.data?.company_name} in ${initialData?.data?.location[0].toUpperCase() + initialData?.data?.location.slice(1)} on Workmob Podcast.`,
        url: locale == 'hindi' ? HOST + '/hindi/podcasts/' + id : HOST + '/podcasts/' + id,
        images: {
          url: STORY_LIST.ogImage,
        },
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: locale == 'hindi' ? HOST + '/hindi/podcasts/' + id : HOST + '/podcasts/' + id,
        languages: {
          'en-US': `${HOST}/podcasts/${id}`,
          'x-default': `${HOST}/podcasts/${id}`,
        },
      },
    };
  } else {
    category = await fetchCategory(mainCategory[0].category);
    return {
      title: locale == 'hindi' ? `${category[0].industry_hindi} प्रोफेशनल्स , स्टार्टअप और बिज़नेस पॉडकास्ट | ऑडियो स्टोरीज़` : `${category[0].industry} Professionals, Startups & Businesses Podcast | Audio Stories`,
      description: locale == 'hindi' ? `वर्कमोब पॉडकास्ट पर कैटेगरी ${category[0].industry_hindi} के अनुसार भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${category[0].industry} professionals, startups & business owners from India.`,
      openGraph: {
        title: locale == 'hindi' ? `${category[0].industry_hindi} प्रोफेशनल्स , स्टार्टअप और बिज़नेस पॉडकास्ट | ऑडियो स्टोरीज़` : `${category[0].industry} Professionals, Startups & Businesses Podcast | Audio Stories`,
        description: locale == 'hindi' ? `वर्कमोब पॉडकास्ट पर कैटेगरी ${category[0].industry_hindi} के अनुसार भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${category[0].industry} professionals, startups & business owners from India.`,
        url: locale == 'hindi' ? HOST + '/hindi/podcasts/' + id : HOST + '/podcasts/' + id,
        siteName: STORY_LIST.siteName,
        images: [
          {
            url: STORY_LIST.ogImage,
            width: 800,
            height: 400,
            alt: `${category[0].industry} Professionals, Startups & Businesses Podcast | Audio Stories`,
            secure_url: STORY_LIST.ogImage,
          },
          {
            url: STORY_LIST.ogImage,
            width: 1800,
            height: 1600,
            alt: `${category[0].industry} Professionals, Startups & Businesses Podcast | Audio Stories`,
            secure_url: STORY_LIST.ogImage,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${category[0].industry} Professionals, Startups & Businesses Podcast | Audio Stories`,
        description: `Hear inspiring personal, career journey and business brand stories of ${category[0].industry} professionals, startups & business owners from India.`,
        url: locale == 'hindi' ? HOST + '/hindi/podcasts/' + id : HOST + '/podcasts/' + id,
        images: {
          url: STORY_LIST.ogImage,
        },
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: locale == 'hindi' ? HOST + '/hindi/podcasts/' + id : HOST + '/podcasts/' + id,
        languages: {
          'en-US': `${HOST}/podcasts/${id}`,
          'x-default': `${HOST}/podcasts/${id}`,
        },
      },
    };
  }
}

const fetchData = (id) => {

  return new Promise((resolve, reject) => {
    fetch(`https://cdn.workmob.com/stories_workmob/config/audio-story-detail/${id}.json`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const Page = async ({ params }) => {

  const { id } = await params;

  try {
    const data = await fetchData(id);
    initialData = { data, loading: false };

  } catch (error) {
    console.error("Error in fetching initial data:", error);
    initialData = { data: null, loading: false };
  }

  return (
    <PodcastDetailPage initialData={initialData} category={category[0]} />
  )
}

export default Page;
