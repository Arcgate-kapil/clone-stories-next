
import BlogDetailPage from '@/app/components/BlogDetailPage';
import { HOME_PAGE, HOST } from '@/app/constants/localString';

async function fetchFeedDetail(slug) {

  // const response = await fetch(`https://cdn.workmob.com/stories_workmob/config/story-detail/${slug}.json`);
  const response = await fetch(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/story-detail/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch feed detail');
  }
  return response.json();
}

export async function generateMetadata({ params }) {

  let { locale, slug } = await params;

  const feedDetail = await fetchFeedDetail(slug);

  return {
    title: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ' में' : ''} ${feedDetail.job_title_hindi}, ${feedDetail.location_hindi}`}` : `${`${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)} | Profile & Intro Video`}`,
    description: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ',' : ''} ${feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)}.`}`,
    openGraph: {
      title: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ' में' : ''} ${feedDetail.job_title_hindi}, ${feedDetail.location_hindi}`}` : `${`${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)} | Profile & Intro Video`}`,
      description: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ',' : ''} ${feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)}.`}`,
      url: locale == 'hindi' ? HOST + '/hindi/' + slug : HOST + '/' + slug,
      siteName: HOME_PAGE.siteName,
      images: [
        {
          url: locale == 'hindi' ? feedDetail.mobileThumb_hindi : feedDetail.mobileThumb,
          width: 800,
          height: 400,
          alt: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ' में' : ''} ${feedDetail.job_title_hindi}, ${feedDetail.location_hindi}`}` : `${`${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)} | Profile & Intro Video`}`,
          secure_url: locale == 'hindi' ? feedDetail.mobileThumb_hindi : feedDetail.mobileThumb,
        },
        {
          url: locale == 'hindi' ? feedDetail.mobileThumb_hindi : feedDetail.mobileThumb,
          width: 1800,
          height: 1600,
          alt: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ' में' : ''} ${feedDetail.job_title_hindi}, ${feedDetail.location_hindi}`}` : `${`${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)} | Profile & Intro Video`}`,
          secure_url: locale == 'hindi' ? feedDetail.mobileThumb_hindi : feedDetail.mobileThumb,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ' में' : ''} ${feedDetail.job_title_hindi}, ${feedDetail.location_hindi}`}` : `${`${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)} | Profile & Intro Video`}`,
      description: locale == 'hindi' ? `${`${feedDetail.name_hindi}, ${feedDetail.company_name_hindi ? feedDetail.company_name_hindi + ',' : ''} ${feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${feedDetail.name}, ${feedDetail.job_title}${feedDetail.company_name ? ' at ' + feedDetail.company_name : ''}, ${feedDetail.location.charAt(0).toUpperCase() + feedDetail.location.slice(1)}.`}`,
      url: locale == 'hindi' ? HOST + '/hindi/' + slug : HOST + '/' + slug,
      images: {
        url: locale == 'hindi' ? feedDetail.mobileThumb_hindi : feedDetail.mobileThumb,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/' + slug : HOST + '/' + slug,
      languages: {
        'en-US': `${HOST}/${slug}`,
        'x-default': `${HOST}/${slug}`,
      },
    },
  };
}

export default async function page({ params }) {

  let { slug } = await params;

  const feedDetail = await fetchFeedDetail(slug);

  return (
    <BlogDetailPage feedDetail={feedDetail} />
  )
}
