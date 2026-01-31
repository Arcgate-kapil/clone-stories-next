export const runtime = 'edge'; // or 'nodejs' depending on your environment
const masterndexUrl = `https://cdn.workmob.com/stories_workmob/config/MasterIndex.json`;
// const trendingTagsUrl = 'https://cdn.workmob.com/stories_workmob/config/tags_master.json';
const trendingTagsUrl = 'https://cdn.workmob.com/stories_workmob/promotional/tags_bg_10_june.json';
const locationsUrl = 'https://cdn.workmob.com/stories_workmob/config/LocationMaster.json';
const categoriesUrl = 'https://cdn.workmob.com/stories_workmob/config-latest/category.json';

async function fetchUrlData() {
   try {
    const [trendingTagsRes, masterIndexRes, locationsRes, categoriesRes] = await Promise.all([
      fetch(trendingTagsUrl),
      fetch(masterndexUrl),
      fetch(locationsUrl),
      fetch(categoriesUrl),
    ]);
    // Parse JSON from responses
    const trendingTags = await trendingTagsRes.json();
    const masterIndex = await masterIndexRes.json();
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

   const blogsId = data.masterIndex.map(blog => ({slug: blog.slug}));
  // const tagsId = data.trendingTags.map(tags => ({id: tags.tag.toLowerCase().replace(/ /g, '-')}))
  const tagsId = data.trendingTags.map(tags => ({id: tags.tag_name.toLowerCase().replace(/ /g, '-')}))
  const locationsId = data.locations.map(location => ({id: location.id.replace(/_/g, '-')}));
  const categoriesId = data.categories.map(category => ({id: category.category}));

  // Static routes
   const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/hindi`, lastModified: new Date() },
    { url: `${baseUrl}/merikahani`, lastModified: new Date() },
    { url: `${baseUrl}/admin`, lastModified: new Date() },
    { url: `${baseUrl}/create`, lastModified: new Date() },
    { url: `${baseUrl}/hindi/create`, lastModified: new Date() },
    { url: `${baseUrl}/tags`, lastModified: new Date() },
    { url: `${baseUrl}/hindi/tags`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/voices`, lastModified: new Date() },
    { url: `${baseUrl}/hindi/voices`, lastModified: new Date() },
    { url: `${baseUrl}/local`, lastModified: new Date() },
    { url: `${baseUrl}/hindi/local`, lastModified: new Date() },
    { url: `${baseUrl}/categories`, lastModified: new Date() },
    { url: `${baseUrl}/hindi/categories`, lastModified: new Date() },
    { url: `${baseUrl}/insights`, lastModified: new Date() },
    { url: `${baseUrl}/podcasts`, lastModified: new Date() },
    { url: `${baseUrl}/hindi/podcasts`, lastModified: new Date() },
  ];

  const blogRoutes = data.masterIndex.map(blog => ({
    url: `${baseUrl}/${blog.slug}`,
    lastModified: new Date(),
  }));
  const hindiBlogRoutes = data.masterIndex.map(blog => ({
    url: `${baseUrl}/hindi/${blog.slug}`,
    lastModified: new Date(),
  }));
  // Dynamic routes for tags
  const tagRoutes = data.trendingTags.map(tags => ({
    // url: `${baseUrl}/tags/${tags.tag.toLowerCase().replace(/ /g, '-')}`,
    url: `${baseUrl}/tags/${tags.tag_name.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
  }));
  const hindiTagRoutes = data.trendingTags.map(tags => ({
    // url: `${baseUrl}/hindi/tags/${tags.tag.toLowerCase().replace(/ /g, '-')}`,
    url: `${baseUrl}/hindi/tags/${tags.tag_name.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
  }));
  // Dynamic routes for locations
  const locationRoutes = data.locations.map(location => ({
    url: `${baseUrl}/local/${location.id.replace(/_/g, '-')}`,
    lastModified: new Date(),
  }));

  const hindiLocationRoutes = data.locations.map(location => ({
    url: `${baseUrl}/hindi/local/${location.id.replace(/_/g, '-')}`,
    lastModified: new Date(),
  }));
  // Dynamic routes for categories
  const categoryRoutes = data.categories.map(category => ({
    url: `${baseUrl}/voices/${category.category}`,
    lastModified: new Date(),
  }));
  const hindiCategoryRoutes = data.categories.map(category => ({
    url: `${baseUrl}/hindi/voices/${category.category}`,
    lastModified: new Date(),
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

  // Generate XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutes
      .map(
        (route) => `
      <url>
        <loc>${route.url}</loc>
        <lastmod>${route.lastModified.toISOString()}</lastmod>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      // Optional: cache control headers for ISR-like behavior
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=59',
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