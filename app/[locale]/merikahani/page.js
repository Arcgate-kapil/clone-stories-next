
import UploadMeriKahani from '@/app/components/UploadMeriKahani';
import { UPLOAD_MERI_KAHANI, HOST } from '@/app/constants/localString';

export async function generateMetadata({ params }) {

  let { locale } = await params;

  return {
    title: locale == 'hindi' ? UPLOAD_MERI_KAHANI.title_hi : UPLOAD_MERI_KAHANI.title,
    description: locale == 'hindi' ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description,
    openGraph: {
      title: locale == 'hindi' ? UPLOAD_MERI_KAHANI.title_hi : UPLOAD_MERI_KAHANI.title,
      description: locale == 'hindi' ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description,
      url: locale == 'hindi' ? HOST + '/hindi/merikahani' : HOST + '/merikahani',
      siteName: UPLOAD_MERI_KAHANI.siteName,
      images: [
        {
          url: UPLOAD_MERI_KAHANI.ogImage,
          width: 800,
          height: 400,
          alt: UPLOAD_MERI_KAHANI.title,
          secure_url: UPLOAD_MERI_KAHANI.ogImage,
        },
        {
          url: UPLOAD_MERI_KAHANI.ogImage,
          width: 1800,
          height: 1600,
          alt: UPLOAD_MERI_KAHANI.title,
          secure_url: UPLOAD_MERI_KAHANI.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: locale == 'hindi' ? UPLOAD_MERI_KAHANI.title_hi : UPLOAD_MERI_KAHANI.title,
      description: locale == 'hindi' ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description,
      url: locale == 'hindi' ? HOST + '/hindi/merikahani' : HOST + '/merikahani',
      images: {
        url: UPLOAD_MERI_KAHANI.ogImage,
      },
    },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    },
    alternates: {
      canonical: locale == 'hindi' ? HOST + '/hindi/merikahani' : HOST + '/merikahani',
      languages: {
        'en': `${HOST}/merikahani`,
        'en-US': `${HOST}/merikahani`,
        'hi': `${HOST}/hindi/merikahani`,
        'hi-IN': `${HOST}/hindi/merikahani`,
        'x-default': `${HOST}/`,
      },
    },
  };
}

export default function page() {

  return( 
    <UploadMeriKahani />
)}
