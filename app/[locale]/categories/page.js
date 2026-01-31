
import CategoriesListPage from "@/app/components/CategoriesListPage";
import { CATEGORY_LIST_PAGE, HOST } from "@/app/constants/localString";

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? CATEGORY_LIST_PAGE.title_hi : CATEGORY_LIST_PAGE.title,
    description: locale == 'hindi' ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description,
    openGraph: {
      title: locale == 'hindi' ? CATEGORY_LIST_PAGE.title_hi : CATEGORY_LIST_PAGE.title,
      description: locale == 'hindi' ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/categories' : HOST + '/categories',
      siteName: CATEGORY_LIST_PAGE.siteName,
      images: [
        {
          url: CATEGORY_LIST_PAGE.ogImage,
          width: 800,
          height: 400,
          alt: CATEGORY_LIST_PAGE.title,
          secure_url: CATEGORY_LIST_PAGE.ogImage,
        },
        {
          url: CATEGORY_LIST_PAGE.ogImage,
          width: 1800,
          height: 1600,
          alt: CATEGORY_LIST_PAGE.title,
          secure_url: CATEGORY_LIST_PAGE.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: locale == 'hindi' ? CATEGORY_LIST_PAGE.title_hi : CATEGORY_LIST_PAGE.title,
      description: locale == 'hindi' ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description,
      url: locale == 'hindi' ? HOST + '/hindi/categories' : HOST + '/categories',
      images: {
        url: CATEGORY_LIST_PAGE.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/categories' : HOST + '/categories',
      languages: {
        'en-US': `${HOST}/categories`,
        'x-default': `${HOST}/categories`,
      },
    },
  };
}

export default function page() {

  return( 
    <CategoriesListPage />
)}
