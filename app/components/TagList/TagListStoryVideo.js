'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFetch } from '../../utils/useFetch';
import Slider from '../common/Slider';
import CustomStyle from '../common/CustomStyle';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import ListTitle from '../common/ListTitle';
import SocialShare from '../common/SocialShare';
import { COMMON_HASHTAG } from '../../constants/localString';
import CloseBtn from '../common/CloseBtn';

function StoryDetailPageMoreVideos({ singleCardData }) { // Added storyDetail as prop, assuming it's passed from parent
  let singleCardValue = singleCardData?.current?.org_member;

   const storyDetail = {
    user_id: '9460086126',
    name: 'Rakhi Sharma',
    job_title: 'Yog Guru',
    company_name: 'Spiritual Yoga',
    location: 'Udaipur',
    mobile_no: '9460086126',
    story: [
      {
        storyHeading:
          'Rakhi Sharma, a Highly Learned Yoga Instructor Whose Will to Seek Her Identity and Life Path Gravitated Her Towards Yoga',
        quote:
          'Have faith in yourself, work hard with utmost sincerity and move forward towards your destination',
        slug: 'rakhi-sharma-health-wellness-fitness',
        category: 'stories',
        storyType: 'Health, Wellness & Fitness',
        storySlug: 'health-wellness-fitness',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/stories/thumb/rakhi-sharma-health-wellness-fitness-udaipur-thumb.jpg',
        full:
          'https://cdn.workmob.com/stories_workmob/images/stories/full/rakhi-sharma-health-wellness-fitness-udaipur-full.jpg',
        videoThumb: '',
        mobileThumb:
          'https://cdn.workmob.com/stories_workmob/images/stories/mobile_thumb/rakhi-sharma-health-wellness-fitness-udaipur-mobilethumb.png',
        videoUrl:
          'https://cdn.workmob.com/stories_workmob/videos/rakhi-sharma-health-wellness-fitness-udaipur-video/rakhi-sharma-health-wellness-fitness-udaipur-video.m3u8',
        video_url_landscape: '',
        video_landscape_thumb: '',
        date: 'October 20, 2021',
        name: 'Rakhi Sharma',
        workmobUserId: '',
        workmobUserName: 'RakhiSharma',
        profile_pic:
          'https://cdn.workmob.com/stories_workmob/images/stories/profile_pic/rakhi-sharma-health-wellness-fitness-udaipur-profilepic.jpg',
        industry: 'Health, Wellness & Fitness',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb:
          'https://cdn.workmob.com/stories_workmob/images/stories/thumb/rakhi-sharma-health-wellness-fitness-udaipur-thumb.jpg',
        author: '',
        location: 'udaipur',
        storyHeading_hindi:
          'राखी शर्मा, एक उच्च शिक्षित योग प्रशिक्षक, जिनकी पहचान और जीवन पथ की तलाश करने की इच्छा ने उन्हें योग की ओर प्रेरित किया',
        quote_hindi:
          'अपने आप पर विश्वास रखें, पूरी ईमानदारी से मेहनत करें और अपनी मंजिल की ओर आगे बढ़ें',
        mobileThumb_hindi:
          'https://cdn.workmob.com/stories_workmob/images/stories/mobile_thumb/rakhi-sharma-health-wellness-fitness-udaipur-mobilethumb.png',
        date_hindi: 'अक्टूबर 20, 2021',
        name_hindi: 'राखी शर्मा',
        industry_hindi: 'स्वास्थ्य, तंदुरुस्ती और फ़िटनेस',
        company_name_hindi: 'स्पिरिचुअल योगा',
        location_hindi: 'उदयपुर',
        is_hindi_translated: '1',
        job_title_hindi: 'योग गुरु',
        tags:
          'Yoga Instructor, Yoga, Healthy Lifestyle, Spiritual Health, Spiritual Healing, Fitness Trainer',
        tags_hindi:
          'योग प्रशिक्षक, योग, स्वस्थ जीवन शैली, आध्यात्मिक स्वास्थ्य, आध्यात्मिक उपचार, फिटनेस ट्रेनर',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: null,
        instructor: '9460086126',
        short_video: '',
        short_video_thumb: '',
        view_count: '',
        share_count: '',
      },
    ],
    audio: [],
    gyan: [],
    hope: [],
    namaste: [
      {
        storyHeading: 'Wishing everyone a very Happy Fathers Day | Rakhi Sharma',
        quote: '',
        slug: 'rakhi-sharma-best-wishes-greetings-fathers-day',
        category: 'Best Wishes',
        storyType: 'Greetings',
        storySlug: 'greetings',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/greeting/thumb/rakhi-sharma-best-wishes-greetings-fathers-day-thumb.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl:
          'https://cdn.workmob.com/stories_workmob/greeting-video/rakhi-sharma-best-wishes-greetings-fathers-day-short-greeting-video/rakhi-sharma-best-wishes-greetings-fathers-day-short-greeting-video.m3u8',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/videos-greetings-landscape/rakhi-sharma-best-wishes-greetings-fathers-day-greetings-landscape-video/rakhi-sharma-best-wishes-greetings-fathers-day-greetings-landscape-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/stories/videos-thumb-greetings-landscape/rakhi-sharma-best-wishes-greetings-fathers-day-thumb-greetings-landscape.jpg',
        date: '',
        name: 'Rakhi Sharma',
        workmobUserId: '9460086126',
        workmobUserName: '',
        profile_pic: '',
        industry: 'Greetings',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: '',
        instructor: '9460086126',
        short_video:
          'https://cdn.workmob.com/stories_workmob/greeting-video/rakhi-sharma-best-wishes-greetings-fathers-day-short-greeting-video/rakhi-sharma-best-wishes-greetings-fathers-day-short-greeting-video.m3u8',
        short_video_thumb:
          'https://cdn.workmob.com/stories_workmob/images/greeting/short_video_thumb/rakhi-sharma-best-wishes-greetings-fathers-day-short-video-thumb.jpg',
        view_count: '',
        share_count: '',
      },
      {
        storyHeading: 'Wishing everyone a very Happy Independence Day | Rakhi Sharma',
        quote: '',
        slug: 'rakhisharma-wish-independence-day',
        category: 'greetings',
        storyType: 'Independence Day',
        storySlug: 'independence day',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/greeting/thumb/rakhisharma-wish-independence-day.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl: '',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/videos-greetings-landscape/rakhisharma-wish-independence-day-full-video/rakhisharma-wish-independence-day-full-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/stories/videos-thumb-greetings-landscape/rakhisharma-wish-independence-day-landscape-thumb.jpg',
        date: '',
        name: 'Rakhi Sharma',
        workmobUserId: '9460086126',
        workmobUserName: '',
        profile_pic: '',
        industry: 'Independence Day',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: '',
        instructor: '9460086126',
        short_video:
          'https://cdn.workmob.com/stories_workmob/greeting-video/rakhisharma-wish-independence-day-short-video/rakhisharma-wish-independence-day-short-video.m3u8',
        short_video_thumb:
          'https://cdn.workmob.com/stories_workmob/images/greeting/thumb/rakhisharma-wish-independence-day-short-thumb.jpg',
        view_count: '',
        share_count: '',
      },
      {
        storyHeading: 'Wishing everyone a very Happy Raksha Bandhan | Rakhi Sharma',
        quote: '',
        slug: 'rakhisharma-wish-raksha-bandhan',
        category: 'greetings',
        storyType: 'Raksha Bandhan',
        storySlug: 'raksha bandhan',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/greeting/thumb/rakhisharma-wish-raksha-bandhan.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl: '',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/videos-greetings-landscape/rakhisharma-wish-raksha-bandhan-full-video/rakhisharma-wish-raksha-bandhan-full-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/stories/videos-thumb-greetings-landscape/rakhisharma-wish-raksha-bandhan-landscape-thumb.jpg',
        date: '',
        name: 'Rakhi Sharma',
        workmobUserId: '9460086126',
        workmobUserName: '',
        profile_pic: '',
        industry: 'Raksha Bandhan',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: '',
        instructor: '9460086126',
        short_video:
          'https://cdn.workmob.com/stories_workmob/greeting-video/rakhisharma-wish-raksha-bandhan-short-video/rakhisharma-wish-raksha-bandhan-short-video.m3u8',
        short_video_thumb:
          'https://cdn.workmob.com/stories_workmob/images/greeting/thumb/rakhisharma-wish-raksha-bandhan-short-thumb.jpg',
        view_count: '',
        share_count: '',
      },
    ],
    name_hindi: '',
    job_title_hindi: '',
    company_name_hindi: '',
    location_hindi: '',
    allow_go_live: false,
    live_profile_pic_card: '',
    user_name: 'rakhisharma',
    promotion: [
      {
        storyHeading: 'Yoga type of poses | Rakhi Sharma',
        quote: '',
        slug: 'yoga-type-of-poses',
        category: 'Promotion',
        storyType: 'Services',
        storySlug: 'services',
        thumb: 'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/type-of-poses.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl: '',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/promotion_videos/yoga-type-of-poses-video/yoga-type-of-poses-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/type-of-poses.jpg',
        date: '',
        name: 'Rakhi Sharma',
        workmobUserId: '',
        workmobUserName: '',
        profile_pic: '',
        industry: '',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: '',
        instructor: '9460086126',
        short_video: '',
        short_video_thumb: '',
        view_count: '',
        share_count: '',
      },
      {
        storyHeading: 'Yoga benifits part one | Rakhi Sharma',
        quote: '',
        slug: 'yoga-benifits-part-one',
        category: 'Promotion',
        storyType: 'Services',
        storySlug: 'services',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/benifits-part-one.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl: '',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/promotion_videos/yoga-benifits-part-one-video/yoga-benifits-part-one-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/benifits-part-one.jpg',
        date: 'August 27,2022',
        name: 'Rakhi Sharma',
        workmobUserId: '',
        workmobUserName: '',
        profile_pic: '',
        industry: '',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: null,
        instructor: '9460086126',
        short_video: '',
        short_video_thumb: '',
        view_count: '',
        share_count: '',
      },
      {
        storyHeading: 'Yoga benifits part two | Rakhi Sharma',
        quote: '',
        slug: 'yoga-benifits-part-two',
        category: 'Promotion',
        storyType: 'Services',
        storySlug: 'services',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/benifits-part-two.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl: '',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/promotion_videos/yoga-benifits-part-two-video/yoga-benifits-part-two-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/benifits-part-two.jpg',
        date: 'August 27,2022',
        name: 'Rakhi Sharma',
        workmobUserId: '',
        workmobUserName: '',
        profile_pic: '',
        industry: '',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: '',
        instructor: '9460086126',
        short_video: '',
        short_video_thumb: '',
        view_count: '',
        share_count: '',
      },
      {
        storyHeading: 'Yoga benifits part three | Rakhi Sharma',
        quote: '',
        slug: 'yoga-benifits-part-three',
        category: 'Promotion',
        storyType: 'Services',
        storySlug: 'services',
        thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/benifits-part-three.jpg',
        full: '',
        videoThumb: '',
        mobileThumb: '',
        videoUrl: '',
        video_url_landscape:
          'https://cdn.workmob.com/stories_workmob/promotion_videos/yoga-benifits-part-three-video/yoga-benifits-part-three-video.m3u8',
        video_landscape_thumb:
          'https://cdn.workmob.com/stories_workmob/images/promotion_thumbs/benifits-part-three.jpg',
        date: 'August 27,2022',
        name: 'Rakhi Sharma',
        workmobUserId: '',
        workmobUserName: '',
        profile_pic: '',
        industry: '',
        job_title: 'Yog Guru',
        company_name: 'Spiritual Yoga',
        mobileVideoThumb: '',
        author: '',
        location: 'udaipur',
        storyHeading_hindi: '',
        quote_hindi: '',
        mobileThumb_hindi: '',
        date_hindi: '',
        name_hindi: '',
        industry_hindi: '',
        company_name_hindi: '',
        location_hindi: '',
        is_hindi_translated: '',
        job_title_hindi: '',
        tags: '',
        tags_hindi: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        website: '',
        ebook: '',
        intro_video: '',
        instagarm: '',
        keywords: '',
        video_format: 'portrait',
        sub_categories: null,
        instructor: '9460086126',
        short_video: '',
        short_video_thumb: '',
        view_count: '',
        share_count: '',
      },
    ],
  };
 
  const playerRef = useRef();
  const router = useRouter();
  const params = useParams();
  const pathname = router.pathname; // Note: In Next.js App Router, this might need adjustment based on your routing setup
  const { videoSlug, id } = params;
  const { metaDesc, storyHeading } = storyDetail;

  const userData = useFetch(
    // `https://cdn.workmob.com/stories_workmob/config/instructor/${singleCardValue}.json`
    `https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/instructors/${singleCardValue}`
  );
  const videoUrls =
    userData &&
    []
      .concat(
        userData.gyan || [],
        userData.hope || [],
        userData.namaste || [],
        userData.promotion || []
      )
      .filter(v => v.video_url_landscape);

  const videoSlugObj = videoUrls?.find(v => v.slug === videoSlug);
  const [isOverlayVideoPlaying, setIsOverlayVideoPlaying] = useState(true);
  const [isOverlayVideoMute, setIsOverlayVideoMute] = useState(true);
  const overlayVideoRef = useRef();
  const [currentSlide, setCurrentSlide] = useState();
  const [isMute, setIsMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareBtns, setShowShareBtns] = useState(false);
  const playIconRef = useRef([]);
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    const player = playerRef.current;
    const checkVisibility = () => {
      if (
          player?.getBoundingClientRect()?.top < 592 && player?.getBoundingClientRect()?.top > 0
      ) {
        if (player?.paused) {
          player?.play();
          setIsPlaying(true);
          playIconRef?.current?.forEach(v => (v.style.opacity = 0));
        }
      } else {
        player?.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('scroll', checkVisibility);

    return () => document.removeEventListener('scroll', checkVisibility);
  }, [playerRef.current]);

  useEffect(() => {
    if (videoSlugObj) {
      document.querySelector('#storyVideo').pause();
      overlayVideoRef.current.play();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [videoSlugObj]);

  function togglePlay(event, i) {
    const video = event.target;
    const playIcon = playIconRef.current;
    if (!video.parentElement.className.includes('Slider-activeSlide')) {
      return;
    }

    playIcon.forEach(v => (v.style.opacity = 1));

    setTimeout(() => {
      playIcon[i].style.opacity = 0;
    }, 1000);

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    video.muted = isMute;
  }

  function toggleMute() {
    const video = currentSlide;
    const muteChange = !video.muted;

    setIsMute(muteChange);
    video.muted = muteChange;
  }

  function handleSlideChange(slide) {
    const previousVideo = currentSlide;
    const currentVideo = slide.querySelector('video');
    const allSlides = [...document.querySelectorAll('.Slider-element')];

    if (previousVideo) {
      previousVideo.pause();
    }

    if (isPlaying) {
      currentVideo.play();
      playIconRef.current.forEach(v => (v.style.opacity = 0));
    } else {
      currentVideo.pause();
    }

    currentVideo.muted = isMute;
    setCurrentSlide(currentVideo);
    setShowShareBtns(false);
    setSlideIndex(allSlides.findIndex(slide => slide.className.includes('Slider-activeSlide')));
  }

  function closeOverlay() {
    router.push(pathname.replace(`/${videoSlug}`, ''));
    document.body.style.overflow = '';
  }

  function toggleOverlayPlay() {
    const overlayVideo = overlayVideoRef.current;
    if (overlayVideo.paused) {
      overlayVideo.play();
      setIsOverlayVideoPlaying(true);
    } else {
      overlayVideo.pause();
      setIsOverlayVideoPlaying(false);
    }
  }

  function toggleOverlayVideoMute() {
    const overlayVideo = overlayVideoRef.current;

    if (isOverlayVideoMute) {
      overlayVideo.muted = false;
      setIsOverlayVideoMute(false);
    } else {
      overlayVideo.muted = true;
      setIsOverlayVideoMute(true);
    }
  }

  function getCopyLink(slug) {
    if (!userData) return '';

    let videoType = Object.keys(userData).find(key => {
      if (!Array.isArray(userData[key])) return false;

      return userData[key].some(v => v.slug === slug);
    });

    if (videoType === 'namaste') {
      videoType = 'greetings';
    } else if (videoType === 'hope') {
      videoType = 'motivation';
    } else if (videoType === 'promotion') {
      return window.location.href.replace(/\/$/, '') + `/${slug}`;
    }

    return `https://www.workmob.com/${videoType}/${slug}`;
  }

  const videoTitleName = id.replace(/-/g,' ')
  const videoTitleMain =  videoTitleName
  .split(" ")
  .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
  .join(" ");

  return (
    videoUrls?.length > 0 && (
      <>
        <CustomStyle>{styles}</CustomStyle>
        <div className='px-md-5 mx-auto container taglistStoryMainDiv'>
          <ListTitle title={`More Videos from ${videoTitleMain}`} type='small' />
        </div>
        <div className='detailPageMoreVideos'>
          {!!userData && (
            <Slider
              speed={1.75}
              onSlideChange={handleSlideChange}
              initialSlide={videoUrls.length > 2 ? 1 : 0}
            >
              {videoUrls?.map((v, i) => (
                <div
                  className='detailPageMoreVideos-item'
                  key={v.video_url_landscape}
                  style={{ '--item-width': videoUrls.length === 1 ? '90%' : '' }}
                >
                  <ReactHlsPlayer
                    onClick={event => togglePlay(event, i)}
                    draggable='false'
                    className={`detailPageMoreVideo-${i}`}
                    url={v.video_url_landscape}
                    poster={v.video_landscape_thumb}
                    controls={false}
                    playsInline
                    preload='metadata'
                    playerRef={playerRef}
                    muted={true}
                    autoplay={false}
                  />
                  <i
                    ref={elem => {
                      elem && (playIconRef.current[i] = elem);
                    }}
                    className={
                      'detailPageMoreVideos-playIcon icon-' + (isPlaying ? 'pause-1' : 'play')
                    }
                  ></i>
                  <div className='detailPageMoreVideos-muteContainer'>
                    <div className='d-flex align-items-center' onClick={toggleMute}>
                      <span>Tap to {isMute ? 'unmute' : 'mute'}</span>
                      <i
                        className={'detailPageMoreVideos-icon icon-' + (isMute ? 'mute' : 'unmute')}
                      ></i>
                    </div>
                    <div
                      className='detailPageMoreVideos-icon'
                      onClick={() => currentSlide.requestFullscreen()}
                    >
                      <svg viewBox='0 0 448 512' fill='white'>
                        <path d='M144 32h-128C7.156 32 0 39.16 0 48v128C0 184.8 7.156 192 16 192S32 184.8 32 176V64h112C152.8 64 160 56.84 160 48S152.8 32 144 32zM144 448H32v-112C32 327.2 24.84 320 16 320S0 327.2 0 336v128C0 472.8 7.156 480 16 480h128C152.8 480 160 472.8 160 464S152.8 448 144 448zM432 320c-8.844 0-16 7.156-16 16V448h-112c-8.844 0-16 7.156-16 16s7.156 16 16 16h128c8.844 0 16-7.156 16-16v-128C448 327.2 440.8 320 432 320zM432 32h-128C295.2 32 288 39.16 288 48S295.2 64 304 64H416v112C416 184.8 423.2 192 432 192S448 184.8 448 176v-128C448 39.16 440.8 32 432 32z' />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
          <SocialShare
            customClass={
              `d-md-none detailPageMoreVideos-shareBtnsMobile ` +
              (showShareBtns
                ? 'detailPageMoreVideos-shareBtnsVisible'
                : 'detailPageMoreVideos-shareBtnsHidden')
            }
            customStyle={{ right: videoUrls.length === 1 ? '2%' : '' }}
            emailText={metaDesc}
            storyHeading={storyHeading}
            emailSub='Watch this inspiring video'
            fbTitle={COMMON_HASHTAG.inspiringStories}
            twitterTitle={`${storyHeading}. Watch an inspiring story. ${COMMON_HASHTAG.common}`}
            embedLink={`https://stories.workmob.com${pathname}`}
            copyLink={!!videoUrls?.length ? getCopyLink(videoUrls[slideIndex]?.slug) : ''}
          />
        </div>
        {!!videoSlugObj && (
          <>
            <CloseBtn closeModalOnly={true} handleClick={closeOverlay} />
            <div className='detailPageMoreVideos-videoSlugOverlay'>
              <div className='detailPageMoreVideos-videoSlugBox'>
                <div className='detailPageMoreVideos-videoSlugContainer'>
                  <ReactHlsPlayer
                    onClick={toggleOverlayPlay}
                    playerRef={overlayVideoRef}
                    draggable='false'
                    className={`detailPageMoreVideos-overlayVideo`}
                    url={videoSlugObj.video_url_landscape}
                    poster={videoSlugObj.video_landscape_thumb}
                    controls={false}
                    playsInline
                    preload='metadata'
                    muted={true}
                    autoplay={true}
                  />
                  <i
                    style={{ opacity: isOverlayVideoPlaying ? '0' : '1' }}
                    className={
                      'detailPageMoreVideos-playIcon icon-' +
                      (isOverlayVideoPlaying ? 'pause-1' : 'play')
                    }
                  ></i>
                  <div
                    className='detailPageMoreVideos-muteContainer'
                    onClick={toggleOverlayVideoMute}
                  >
                    <span>Tap to {isOverlayVideoMute ? 'unmute' : 'mute'}</span>
                    <i
                      className={
                        'detailPageMoreVideos-icon icon-' + (isOverlayVideoMute ? 'mute' : 'unmute')
                      }
                    ></i>
                  </div>
                </div>
                <p className='detailPageMoreVideos-overlayPara'>{videoSlugObj.storyHeading}</p>
              </div>
            </div>
          </>
        )}
      </>
    )
  );
}

export default StoryDetailPageMoreVideos;

const styles = `
  .detailPageMoreVideos {
    margin-bottom: 2em;
    color: #fff;
    position: relative;
  }
  .taglistStoryMainDiv{
    margin-top:5rem;
  }

  .detailPageMoreVideos-item:not(:last-child) {
    margin-right: 0em;
  }

  .detailPageMoreVideos-item:not(.Slider-activeSlide) > video {
    transform: scale(0.92);
  }

  .detailPageMoreVideos-item {
    --item-width: 70%;
    --item-max-width: 1050px;
    position: relative;
    // overflow: hidden;
    border-radius: 1vw;
    flex-shrink: 0;
    width: var(--item-width);
    max-width: var(--item-max-width);
    filter: brightness(0.6);
  }

  .detailPageMoreVideos-item.Slider-activeSlide {
    filter: brightness(1);
  }

  .detailPageMoreVideos-item:first-child {
    margin-left: calc((100% - var(--item-width))/2);
  }

  .detailPageMoreVideos-item:last-child {
    margin-right: calc((100% - var(--item-width))/2);
  }

  @media(min-width: 1200px) {
    .detailPageMoreVideos-item:first-child {
      margin-left: calc((100% - var(--item-max-width))/2);
    }
  
    .detailPageMoreVideos-item:last-child {
      margin-right: calc((100% - var(--item-max-width))/2);
    }
  }

  .detailPageMoreVideos-item::before {
    content: '';
    padding-top: 56.25%;  
    display: block;
  }

  .detailPageMoreVideos-item > video {
    user-select: none;
    -webkit-user-select: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    border-radius: 1vw;
    background: #1c1c1c;
    transition: transform linear 200ms;
  }

  .detailPageMoreVideos-playIcon {
    width: 2.5em;
    height: 2.5em;
    padding: 1em;
    border-radius: 50%;
    color: white;
    background: rgba(0, 0, 0, 0.45);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    opacity: 1;
    transition: opacity linear 150ms;
  }

  .detailPageMoreVideos-muteContainer {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 1em;
    display: none;
    align-items: center;
  }

  .detailPageMoreVideos-icon {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    margin-left: 0.8em;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.45em;
  }

  .detailPageMoreVideos-item.Slider-activeSlide .detailPageMoreVideos-playIcon {
    display: flex;
  }

  .detailPageMoreVideos-item.Slider-activeSlide .detailPageMoreVideos-muteContainer {
    display: flex;
  }

  .detailPageMoreVideos-shareBtns {
    transition: opacity linear 100ms;
    position: absolute;
    bottom: 135% !important;
    right: initial;
    left: -4%;
    background: transparent;
  }

  .detailPageMoreVideos-shareBtnsMobile {
    transition: opacity linear 100ms;
    position: absolute;
    bottom: 21% !important;
    right: 12%;
    left: initial;
    background: transparent;
  }

  .detailPageMoreVideos-shareBtns ul,
  .detailPageMoreVideos-shareBtnsMobile ul {
    flex-direction: column !important;
  }

  .detailPageMoreVideos-shareBtnsVisible {
    opacity: 1;
    pointer-events: auto;
  }

  .detailPageMoreVideos-shareBtnsHidden {
    opacity: 0;
    pointer-events: none;
  }

  /* videoSlug overlay */

  .detailPageMoreVideos-videoSlugOverlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 8;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.9);
    overflow: auto;
    color: white;
  }

  .detailPageMoreVideos-videoSlugBox {
    max-width: 1050px;
    margin: 1.5em 1.5em 0;
  }

  .detailPageMoreVideos-videoSlugContainer {
    position: relative;
    margin-bottom: 0.5em;
  }

  .detailPageMoreVideos-videoSlugContainer > video {
    border-radius: 1vw;
  }

  .detailPageMoreVideos-videoSlugContainer > :nth-child(n + 2) {
    display: flex;
  }

  .detailPageMoreVideos-videoSlugContainer > [class*='muteContainer'] {
    bottom: 100%;
    margin: 0.5em;
  }

  .detailPageMoreVideos-overlayPara {
    font-size: 18px;
    text-align: center;
    margin: 0;
  }

  @media(max-width: 768px) {
    .taglistStoryMainDiv{
      margin-top:0rem;
    }
  }

  @media(max-width: 760px) {
    .detailPageMoreVideos-item:not(:last-child) {
      margin-right: 0em;
    }

    .detailPageMoreVideos-muteContainer {
      font-size: 11px;
      margin: 0.5em;
    }
  }
`;