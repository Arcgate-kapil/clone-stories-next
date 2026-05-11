// lib/fetchBlogsSSR.js

const API_BASE_URL = 'https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/';

export async function fetchBlogsSSR() {
  try {
    const res = await fetch(`${API_BASE_URL}stories-blog-home`, {
      next: { revalidate: 300 }, // 5 min cache — CDN JSON hai to fresh rahega
    });

    if (!res.ok) throw new Error(`Failed: ${res.status}`);

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('fetchBlogsSSR error:', error);
    return []; // Error pe empty array, page crash nahi hoga
  }
}

export async function fetchInsightListingSSR() {
  try {
    const res = await fetch(`${API_BASE_URL}insightlisting`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`Failed: ${res.status}`);

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('fetchInsightListingSSR error:', error);
    return [];
  }
}