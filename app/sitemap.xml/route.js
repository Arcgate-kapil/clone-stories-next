export const runtime = 'edge'; // or 'nodejs' depending on your environment
// const masterndexUrl = `https://cdn.workmob.com/stories_workmob/config/MasterIndex.json`;
const masterndexUrl = `https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories`;
// const trendingTagsUrl = 'https://cdn.workmob.com/stories_workmob/config/tags_master.json';
const trendingTagsUrl = 'https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/master_tag';
// const locationsUrl = 'https://cdn.workmob.com/stories_workmob/config/LocationMaster.json';
const locationsUrl = 'https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/locations';
const categoriesUrl = 'https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/config-latest-category?limit=80';

async function fetchAllStories() {
  const allStories = [];
  let lastKey = null;

  while (true) {
    const url = lastKey
      ? `${masterndexUrl}?lastKey=${encodeURIComponent(lastKey)}`
      : `${masterndexUrl}?limit=100`;

    const res = await fetch(url);
    const data = await res.json();

    // Aapke response me "data" array tha
    const records = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    // hide=1 wale skip karo
    const visible = records.filter(item => item.hide !== 1);
    allStories.push(...visible);

    console.log(`Fetched ${allStories.length} stories so far...`);

    // hasMore false ya lastKey nahi aaya to band karo
    if (!data.hasMore || !data.lastKey) break;

    lastKey = data.lastKey;
  }
  return allStories;
}

async function fetchUrlData() {
  try {
    // const [trendingTagsRes, masterIndexRes, locationsRes, categoriesRes] = await Promise.all([
    const [trendingTagsRes, masterIndex, locationsRes, categoriesRes] = await Promise.all([
      fetch(trendingTagsUrl),
      fetchAllStories(),
      // masterndexUrl,
      fetch(locationsUrl),
      fetch(categoriesUrl),
    ]);
    // Parse JSON from responses
    const trendingTags = await trendingTagsRes.json();
    // const masterIndex = await masterIndexRes.json();
    const locations = await locationsRes.json();
    const categories = await categoriesRes.json();

    return {
      trendingTags,
      masterIndex,
      locations,
      categories,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to handle upstream
  }
}

fetchUrlData().then(resp => {
  generateSitemap(resp);
});

export async function generateSitemap(data) {

  // Base URL from env or fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stories.workmob.com';

  const blogsId = data.masterIndex.map(blog => ({ slug: blog.slug }));
  // const tagsId = data.trendingTags.map(tags => ({id: tags.tag.toLowerCase().replace(/ /g, '-')}))
  const tagsId = data.trendingTags.data.map(tags => ({ id: tags.tag_name.toLowerCase().replace(/ /g, '-') }))
  const locationsId = data.locations.locations.map(location => ({ id: location.id.replace(/_/g, '-') }));
  const categoriesId = data?.categories?.data.map(category => ({ id: category.category }));

  // Static routes
  const staticRoutes = [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/hindi` },
    { url: `${baseUrl}/merikahani` },
    { url: `${baseUrl}/admin` },
    { url: `${baseUrl}/create` },
    { url: `${baseUrl}/hindi/create` },
    { url: `${baseUrl}/tags` },
    { url: `${baseUrl}/hindi/tags` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/voices` },
    { url: `${baseUrl}/hindi/voices` },
    { url: `${baseUrl}/local` },
    { url: `${baseUrl}/hindi/local` },
    { url: `${baseUrl}/categories` },
    { url: `${baseUrl}/hindi/categories` },
    { url: `${baseUrl}/insights` },
    { url: `${baseUrl}/podcasts` },
    { url: `${baseUrl}/hindi/podcasts` },
  ];

  const blogRoutes = data.masterIndex.map(blog => ({
    url: `${baseUrl}/${blog.slug}`
    // lastModified: new Date(),
    // videoThumb: blog.mobileThumb || blog.thumb || "",
    // videoTitle: blog.storyHeading || blog.metaTitle || "",   // ← yeh add karo
    // videoDesc: blog.metaDesc || "",
    // videoUrl: `https://cdn.workmob.com/stories_workmob/videos/${blog?.slug}-${blog?.location}-video/${blog?.slug}-${blog?.location}-video.m3u8` || "",
    // image: blog.thumb || ""
  }));
  const hindiBlogRoutes = data.masterIndex.map(blog => ({
    url: `${baseUrl}/hindi/${blog.slug}`
    // lastModified: new Date(),
    // videoThumb: blog.mobileThumb || blog.thumb || "",
    // videoTitle: blog.storyHeading_hindi || blog.metaTitle_hindi || "",   // ← yeh add karo
    // videoDesc: blog.metaDesc || "",
    // videoUrl: `https://cdn.workmob.com/stories_workmob/videos/${blog?.slug}-${blog?.location}-video/${blog?.slug}-${blog?.location}-video.m3u8` || "",
    // image: blog.thumb || ""
  }));
  // Dynamic routes for tags
  const tagRoutes = data?.trendingTags?.data.map(tags => ({
    // url: `${baseUrl}/tags/${tags.tag.toLowerCase().replace(/ /g, '-')}`,
    url: `${baseUrl}/tags/${tags.tag_name.toLowerCase().replace(/ /g, '-')}`
    // lastModified: new Date(),
  }));
  const hindiTagRoutes = data?.trendingTags?.data.map(tags => ({
    // url: `${baseUrl}/hindi/tags/${tags.tag.toLowerCase().replace(/ /g, '-')}`,
    url: `${baseUrl}/hindi/tags/${tags.tag_name.toLowerCase().replace(/ /g, '-')}`
    // lastModified: new Date(),
  }));
  // Dynamic routes for locations
  const locationRoutes = data.locations.locations.map(location => ({
    url: `${baseUrl}/local/${location.id.replace(/_/g, '-')}`
    // lastModified: new Date(),
  }));

  const hindiLocationRoutes = data.locations.locations.map(location => ({
    url: `${baseUrl}/hindi/local/${location.id.replace(/_/g, '-')}`
    // lastModified: new Date(),
  }));
  // Dynamic routes for categories
  const categoryRoutes = data?.categories?.data.map(category => ({
    url: `${baseUrl}/voices/${category.category}`
    // lastModified: new Date(),
  }));
  const hindiCategoryRoutes = data?.categories?.data.map(category => ({
    url: `${baseUrl}/hindi/voices/${category.category}`
    // lastModified: new Date(),
  }));

  const allRoutes = [...staticRoutes,
  ...blogRoutes,
  ...hindiBlogRoutes,
  ...tagRoutes,
  ...hindiTagRoutes,
  ...locationRoutes,
  ...hindiLocationRoutes,
  ...categoryRoutes,
  ...hindiCategoryRoutes];

  function escapeXml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  // Generate XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${allRoutes
      .map(
        (route) => {
          return `
      <url>
        <loc>${escapeXml(route.url)}</loc>
      </url>
    `
        })
      .join('')}
  </urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Optional: cache control headers for ISR-like behavior
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=59',
      'Access-Control-Allow-Origin': '*'
    },
  });
}

export async function GET() {
  try {
    const data = await fetchUrlData();
    return await generateSitemap(data);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}