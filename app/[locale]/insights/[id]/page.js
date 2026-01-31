import InsightDetailPage from '@/app/components/InsightDetailPage';
import { INSIGHT_LIST, HOST } from '@/app/constants/localString';

let initialData = [];

const fetchData = () => {

  return new Promise((resolve, reject) => {
    fetch(`https://cdn.workmob.com/stories_workmob/config/insightlisting.json`)
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

export async function generateMetadata({ params }) {

  let { id } = await params;
  const decodedId = decodeURIComponent(id);

  try {
    const data = await fetchData();
    initialData = data

  } catch (error) {
    console.error("Error in fetching initial data:", error);
  }

  const filtered = initialData?.filter(o => {
    if (!o?.storySlug || typeof o.storySlug !== 'string') return false;
    const transformed = o.storySlug.toLowerCase().trim().replace(/ /g, '-');
    return transformed === decodedId;
  });

  return {
    title: filtered?.length > 0 ? `${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`,
    description: filtered?.length > 0 ? `Read and watch thoughts, insights and articles on ${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`,
    openGraph: {
      title: filtered?.length > 0 ? `${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`,
      description: filtered?.length > 0 ? `Read and watch thoughts, insights and articles on ${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`,
      url: HOST + '/insights/' + decodedId,
      siteName: INSIGHT_LIST.siteName,
      images: [
        {
          url: INSIGHT_LIST.ogImage,
          width: 800,
          height: 400,
          alt: filtered?.length > 0 ? `${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`,
          secure_url: INSIGHT_LIST.ogImage,
        },
        {
          url: INSIGHT_LIST.ogImage,
          width: 1800,
          height: 1600,
          alt: filtered?.length > 0 ? `${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`,
          secure_url: INSIGHT_LIST.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: filtered?.length > 0 ? `${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`,
      description: filtered?.length > 0 ? `Read and watch thoughts, insights and articles on ${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`,
      url: HOST + '/insights/' + decodedId,
      images: {
        url: INSIGHT_LIST.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: HOST + '/insights/' + decodedId,
      languages: {
        'en-US': `${HOST}/insights/${decodedId}`,
        'x-default': `${HOST}/insights/${decodedId}`,
      },
    },
  };
}

const Page = async () => {

  try {
    const data = await fetchData();
    initialData = data

  } catch (error) {
    console.error("Error in fetching initial data:", error);
  }

  return (
    <InsightDetailPage initialData={initialData} />
  )
}

export default Page;
