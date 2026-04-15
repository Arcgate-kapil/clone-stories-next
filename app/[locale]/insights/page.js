import InsightsListPage from "@/app/components/InsightsListPage";
import { INSIGHT_LIST, HOST } from "@/app/constants/localString";

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: INSIGHT_LIST.title,
    description: INSIGHT_LIST.description,
    openGraph: {
      title: INSIGHT_LIST.title,
      description: INSIGHT_LIST.description,
      url: HOST + '/insights',
      siteName: INSIGHT_LIST.siteName,
      images: [
        {
          url: INSIGHT_LIST.ogImage,
          width: 800,
          height: 400,
          alt: INSIGHT_LIST.title,
          secure_url: INSIGHT_LIST.ogImage,
        },
        {
          url: INSIGHT_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: INSIGHT_LIST.title,
          secure_url: INSIGHT_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: INSIGHT_LIST.title,
      description: INSIGHT_LIST.description,
      url: HOST + '/insights',
      images: {
        url: INSIGHT_LIST.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    },
    alternates: {
      canonical: HOST + '/insights',
      languages: {
        'en': `${HOST}/insights`,
        'en-US': `${HOST}/insights`,
        'hi': `${HOST}/insights`,
        'hi-IN': `${HOST}/insights`,
        'x-default': `${HOST}/insights`,
      },
    },
  };
}

export default function page() {

  return (
    <InsightsListPage />
  )
}
