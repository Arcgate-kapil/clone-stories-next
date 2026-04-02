// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)'],
// };

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

let redirectMap = null;
async function getRedirectMap() {
  if (redirectMap) return redirectMap; // Return cached map if available
  try {
    const response = await fetch('https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/redirect_url_list', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch redirect map');
    }
    const data = await response.json();
    const result = data.data.map(item => ({
      [item.key]: item.value
    }));

    redirectMap = new Map();
    // Flatten the array of objects into a Map for O(1) lookups
    result.forEach((obj) => {
      const key = Object.keys(obj)[0]; // Get the key (old slug)
      const value = obj[key]; // Get the value (new slug)
      if (key && value) {
        redirectMap.set(key, value);
      }
    });
    return redirectMap;
  } catch (error) {
    console.error('Error fetching redirect map:', error);
    return new Map(); // Return empty map on error to avoid breaking
  }
}

// Custom middleware function
export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const currentPathname = pathname?.split('/')?.filter(segment => segment !== '');

  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Page Not Found</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background-color: #000;
              background-image: url(https://cdn.workmob.com/stories_workmob/images/common/blog_bg.jpg);
              background-origin: border-box;
              background-size: cover !important;
            }
            h1 {
              font-size: 2.2rem;
              color: rgba(255, 255, 255, 1);
              margin-bottom: 0;
              font-weight: 500;
              margin-top: 13%;
              font-family: "Montserrat", sans-serif;
            }
            p {
              font-size: 20px;
              font-weight: 700;
              margin-top: 14px;
            }
            a {
              color: rgba(108, 117, 125, 1);
              text-decoration: none;
              font-family: "Montserrat", sans-serif;
            }
          </style>
        </head>
        <body>
          <h1>404 - PAGE NOT FOUND</h1>
          <p><a href="/">GO TO HOME</a></p>
        </body>
        </html>
      `;

  if (pathname === '/' || pathname === '/hindi' || pathname.startsWith('/categories') || pathname.startsWith('/hindi/categories') || pathname.startsWith('/about') || pathname.startsWith('/hindi/about') || pathname.startsWith('/merikahani') || pathname.startsWith('/hindi/merikahani') || pathname.startsWith('/admin') || pathname === '/create' || pathname === '/hindi/create' || pathname === '/sitemap.xml') {
    // Proceed directly to next-intl middleware without API check
    return createMiddleware(routing)(request);
  }

  if (pathname.startsWith('/voices') || pathname.startsWith('/hindi/voices')) {
    if (currentPathname[0] == 'voices' && currentPathname[1] == undefined || currentPathname[0] == 'hindi' && currentPathname[1] == 'voices' && currentPathname[2] == undefined) {
      return createMiddleware(routing)(request);
    } else {
      let newPathname = currentPathname[0] == 'hindi' ? currentPathname[2] : currentPathname[1];
      try {
        const apiResponse = await fetch(`https://cdn.workmob.com/stories_workmob/config-latest/category-index/${newPathname}.json`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (apiResponse.status == 404) {
          return new NextResponse(htmlContent, {
            status: 404,
            headers: { 'Content-Type': 'text/html' },
          });
        }

        if (apiResponse.ok) {
          const data = await apiResponse.json();
        } else {

        }
      } catch (error) {
        console.error('Error checking URL existence:', error);
      }
    }
  } else if (pathname.startsWith('/local') || pathname.startsWith('/hindi/local')) {
    if (currentPathname[0] == 'local' && currentPathname[1] == undefined || currentPathname[0] == 'hindi' && currentPathname[1] == 'local' && currentPathname[2] == undefined) {
      return createMiddleware(routing)(request);
    } else {
      let newPathname = currentPathname[0] == 'hindi' ? currentPathname[2] : currentPathname[1];
      try {
        // const apiResponse = await fetch(`https://cdn.workmob.com/stories_workmob/config-latest/locations/${newPathname}.json`, {
        const apiResponse = await fetch(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/config-latest-locations-${newPathname}?limit=100`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (apiResponse.status == 404) {
          return new NextResponse(htmlContent, {
            status: 404,
            headers: { 'Content-Type': 'text/html' },
          });
        }

        if (apiResponse.ok) {
          const data = await apiResponse.json();
        } else {

        }
      } catch (error) {
        console.error('Error checking URL existence:', error);
      }
    }
  } else if (pathname.startsWith('/insights')) {
    if (currentPathname[0] == 'insights' && currentPathname[1] == undefined || currentPathname[0] == 'hindi' && currentPathname[1] == 'insights' && currentPathname[2] == undefined) {
      return createMiddleware(routing)(request);
    } else {
      let newPathname = currentPathname[0] == 'hindi' ? currentPathname[2] : currentPathname[1];
      try {
        // const apiResponse = await fetch(`https://cdn.workmob.com/stories_workmob/config/insightlisting.json`, {
        const apiResponse = await fetch(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/insightlisting?limit=100`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          const hasMatch = data?.data?.some(story => story.slug === newPathname);
          const hasMatchNew = data?.data?.some(story => story.storySlug.toLowerCase().replace(/ /g, '-') === newPathname);
          if (hasMatch == false && hasMatchNew == false) {
            return new NextResponse(htmlContent, {
              status: 404,
              headers: { 'Content-Type': 'text/html' },
            });
          }
        } else {

        }
      } catch (error) {
        console.error('Error checking URL existence:', error);
      }
    }
  } else if (pathname.startsWith('/podcasts') || pathname.startsWith('/hindi/podcasts')) {
    if (currentPathname[0] == 'podcasts' && currentPathname[1] == undefined || currentPathname[0] == 'hindi' && currentPathname[1] == 'podcasts' && currentPathname[2] == undefined) {
      return createMiddleware(routing)(request);
    } else {
      let newPathname = currentPathname[0] == 'hindi' ? currentPathname[2] : currentPathname[1];
      try {
        const apiResponse = await fetch(`https://cdn.workmob.com/stories_workmob/config/audio-category-index/${newPathname}.json`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (apiResponse.status == 404) {
          const apiResponseOne = await fetch(`https://cdn.workmob.com/stories_workmob/config/audio-story-detail/${newPathname}.json`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (apiResponseOne.status == 404) {
            return new NextResponse(htmlContent, {
              status: 404,
              headers: { 'Content-Type': 'text/html' },
            });
          }

        }

        if (apiResponse.ok) {
          const data = await apiResponse.json();
        } else {

        }
      } catch (error) {
        console.error('Error checking URL existence:', error);
      }
    }
  } else if (pathname.startsWith('/tags') || pathname.startsWith('/hindi/tags')) {
    if (currentPathname[0] == 'tags' && currentPathname[1] == undefined || currentPathname[0] == 'hindi' && currentPathname[1] == 'tags' && currentPathname[2] == undefined) {
      return createMiddleware(routing)(request);
    } else {
      let newPathname = currentPathname[0] == 'hindi' ? currentPathname[2] : currentPathname[1];
      let converted = newPathname.replace("-", "_");
      try {
        // const apiResponse = await fetch(`https://cdn.workmob.com/stories_workmob/config/tags/${converted}.json`, {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        // });

        const newArr = ['indian-army', 'education', 'do-good']

        if (!newArr.includes(newPathname)) {
          return new NextResponse(htmlContent, {
            status: 404,
            headers: { 'Content-Type': 'text/html' },
          });
        }

        // if (apiResponse.status == 404) {
        //   return new NextResponse(htmlContent, {
        //     status: 404,
        //     headers: { 'Content-Type': 'text/html' },
        //   });
        // }

        // if (apiResponse.ok) {
        //   const data = await apiResponse.json();
        // } else {

        // }
      } catch (error) {
        console.error('Error checking URL existence:', error);
      }
    }
  } else {
    let newPathname = pathname.startsWith('/hindi') ? pathname.replace(/^\/hindi/, '') : pathname;

    const lookupKey = newPathname.startsWith('/') ? newPathname.slice(1) : newPathname;
    const map = await getRedirectMap();
    if (map.has(lookupKey)) {
      const newSlug = map.get(lookupKey);
      const newUrl = new URL(`/${newSlug}`, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl, { status: 302 }); // 302 for temporary redirect; use 301 for permanent
    }

    try {
      const apiResponse = await fetch(`https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/story-detail/${newPathname}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (apiResponse.status == 404) {
        // return new NextResponse('Not Found', { status: 404 });
        return new NextResponse(htmlContent, {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (apiResponse.ok) {
        const data = await apiResponse.json();
      } else {

      }
    } catch (error) {
      console.error('Error checking URL existence:', error);
    }
  }

  return createMiddleware(routing)(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
