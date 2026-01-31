'use client';
import React, { useEffect, useRef, useState } from 'react';
import CustomStyle from '../components/common/CustomStyle';
import ReactHlsPlayer from '../components/HSL';
import AboutHeader from '../components/common/AboutHeader';
import useWindowSize from '../utils/useWindowSize';
import { useDispatch, useSelector } from 'react-redux';
import { setHindiView } from '../lib/features/blogSlice';
import { ABOUT_PAGE, HOST } from '../constants/localString';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import { usePathname, useRouter } from 'next/navigation';

const AboutStories = (props) => {
  const pathname = usePathname();
  const { width } = useWindowSize();
  let dispatch = useDispatch();
  let router = useRouter();
  const state = useSelector((state) => state.blog);

  const playerRef = useRef();

  useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi' : '/');
    // router.back();
  }

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? 'वर्कमोब मेरी कहानी | भारत के कर्मयोगियों की आवाज़' : ABOUT_PAGE.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? 'वर्कमोब मेरी कहानी के बारे में जानें। यह एक ऐसा प्लेटफॉर्म हैं जहाँ आप देख सकते हैं भारत के अपने प्रोफेशनल्स, स्टार्टअप्स, बिज़नेस ओनर्स, सामाजिक कार्यकर्ताओं और अन्य लोगों की प्रेरक कहानियाँ।' : ABOUT_PAGE.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? 'वर्कमोब मेरी कहानी के बारे में जानें। यह एक ऐसा प्लेटफॉर्म हैं जहाँ आप देख सकते हैं भारत के अपने प्रोफेशनल्स, स्टार्टअप्स, बिज़नेस ओनर्स, सामाजिक कार्यकर्ताओं और अन्य लोगों की प्रेरक कहानियाँ।' : ABOUT_PAGE.description;
      document.head.appendChild(metaDesc);
    }
    // Update Open Graph tags
    const updateOrCreateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };
    updateOrCreateMeta('og:title', state.isHindi ? 'वर्कमोब मेरी कहानी | भारत के कर्मयोगियों की आवाज़' : ABOUT_PAGE.title);
    updateOrCreateMeta('og:description', state.isHindi ? 'वर्कमोब मेरी कहानी के बारे में जानें। यह एक ऐसा प्लेटफॉर्म हैं जहाँ आप देख सकते हैं भारत के अपने प्रोफेशनल्स, स्टार्टअप्स, बिज़नेस ओनर्स, सामाजिक कार्यकर्ताओं और अन्य लोगों की प्रेरक कहानियाँ।' : ABOUT_PAGE.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', ABOUT_PAGE.ogImage);
    updateOrCreateMeta('og:site_name', ABOUT_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? 'वर्कमोब मेरी कहानी | भारत के कर्मयोगियों की आवाज़' : ABOUT_PAGE.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? 'वर्कमोब मेरी कहानी के बारे में जानें। यह एक ऐसा प्लेटफॉर्म हैं जहाँ आप देख सकते हैं भारत के अपने प्रोफेशनल्स, स्टार्टअप्स, बिज़नेस ओनर्स, सामाजिक कार्यकर्ताओं और अन्य लोगों की प्रेरक कहानियाँ।' : ABOUT_PAGE.description);
    updateOrCreateMeta('twitter:image', ABOUT_PAGE.ogImage);
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', HOST + pathname);
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = HOST + pathname;
      document.head.appendChild(canonical);
    }
    // Optional: Update robots meta if needed
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow';
      document.head.appendChild(robots);
    }
  }, [state.isHindi, pathname]);

  return (
    <>
      {/* For background video play */}
      <ReactHlsPlayer
        className='aboutbackgroundPage'
        url='https://cdn.workmob.com/stories_workmob/web_home/earth_bg/earth_bg.m3u8'
        controls={false}
        autoPlay={true}
        preload='auto'
        muted={true}
        playsInline={true}
        loop={true}
        height='100%'
      />
      <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
        <i
          style={{ pointerEvents: 'auto' }}
          onClick={handleBackClick}
          className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
        />
        <div
          onClick={handleBackClick}
          className="closeBtnWave d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#DF625C', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          &nbsp;
        </div>
      </div>
      <div className='aboutpage'>
        <CustomStyle>{styles}</CustomStyle>
        <div className='container'>
          <AboutHeader />
          <div className='aboutmaindiv'>
            <div className='row'>
              <div className='col-12 col-sm-12 col-md-12 col-lg-11 mx-auto'>
                <div className='videocontainer position-relative topVideoContainer zeroDiv'>
                  <div className='mainVideoContabout'>
                    <img
                      src='https://cdn.workmob.com/stories_workmob/images/frame.png'
                      alt="Landscape Frame"
                      className='about_frame'
                    />
                    <ReactHlsPlayer
                      className='homePageBannerVideo'
                      url='https://cdn.workmob.com/stories_workmob/promotional/workmob_intro_ads/workmob_intro_ads.m3u8'
                      poster='https://cdn.workmob.com/stories_workmob/promotional/workmob_intro_ads.jpg'
                      controls={false}
                      autoPlay={true}
                      preload='auto'
                      muted={true}
                      playsInline={true}
                      loop={true}
                    />
                  </div>
                </div>
                <div className='textcontainer mt-1'>
                  <div className={`text-center BrandHeading ${state.isHindi ? 'font-khand mt-3' : 'montserrat-regular'}`}>
                    {state.isHindi ? <span>प्रभावशाली <span className={`txtOrange ${state.isHindi ? 'font-khand' : 'montserrat-regular'}`}>वीडियो</span> के माध्यम से अपने <span className={`txtOrange ${state.isHindi ? 'font-khand' : 'montserrat-regular'}`}>ब्रांड</span> के लिए <span className={`txtOrange ${state.isHindi ? 'font-khand' : 'montserrat-regular'}`}>विश्वास </span>बनाएँ।</span> :
                      <span>BUILD <span className={`txtOrange ${state.isHindi ? 'font-khand' : 'montserrat-regular'}`}>TRUST</span> AND <span className={`txtOrange ${state.isHindi ? 'font-khand' : 'montserrat-regular'}`}>LOVE</span> FOR YOUR <span className={`txtOrange ${state.isHindi ? 'font-khand' : 'montserrat-regular'}`}>BRAND </span>WITH THE POWER OF VIDEO.</span>}
                  </div>
                  <div className='firstDiv'>
                    <h4 className={`description ${state.isHindi ? 'font-khand font-600' : ''}`}>{state.isHindi ? 'सुनाओ अपनी कहानी, बनाओ अपनी पहचान' : 'Tell your story, inspire, and build your brand.'}</h4>
                    {state.isHindi ? <p className={`span1 ${state.isHindi ? 'font-khand lh-1-6' : ''}`}>वर्कमोब बन रहा है भारत के कर्मयोगियों की आवाज़। एक ऐसा प्लेटफॉर्म जो भारत के अपने प्रोफेशनल्स, स्टार्टअप्स, बिज़नेस ऑनर्स, सामाजिक कार्यकर्ताओं और अन्य लोगों की प्रेरक कहानियों को डिजिटल रूप में प्रभावशाली वीडियो के माध्यम से उनके जीवन के अनुभवों, कार्यक्षेत्रों, और अपने उत्पादों एवं सेवाओं के बारे में देशवासियों तक पहुँचाने में मदद करता है और उन्हें प्रेरित करता है। आप भी अपने अनुभवों को शेयर करें, प्रेरित करें और अपने ब्रांड के लिए विश्वास बनाएं।</p> :
                      <p className="span1">Our mission is to become the voice of India&apos;s professional community. To celebrate professionals, creators, startups, business owners, social workers and YOU. To make digital storytelling easy and bring to forefront the power of sharing life experiences, career journeys, and the real story behind your products and services.</p>}
                    <div className='d-flex justify-content-center position-relative portraitvideoRow'>
                      <div className='position-relative widthvideos'>
                        <div style={{ paddingTop: '178%' }}></div>
                        <div className='mainVideoContabout'>
                          <img
                            src='https://cdn.workmob.com/stories_workmob/images/mobile-portrait.png'
                            alt="Portrait Frame"
                            className='portraitFrame'
                          />
                          <ReactHlsPlayer
                            className='aboutPagePortraitClass'
                            id='aboutpageportrait'
                            url='https://cdn.workmob.com/stories_workmob/promotion_videos/story_about_one/story_premium_one.m3u8'
                            poster=''
                            controls={false}
                            autoPlay={true}
                            preload='auto'
                            muted={true}
                            playsInline={true}
                            loop={true}
                          />
                        </div>
                      </div>
                      <div className='position-relative widthvideos'>
                        <div style={{ paddingTop: '178%' }}></div>
                        <div className='mainVideoContabout'>
                          <img
                            src='https://cdn.workmob.com/stories_workmob/images/mobile-portrait.png'
                            alt="Portrait Frame"
                            className='portraitFrame'
                          />
                          <ReactHlsPlayer
                            className='aboutPagePortraitClass1'
                            id='aboutpageportrait'
                            url='https://cdn.workmob.com/stories_workmob/promotion_videos/story_about_two/story_premium_two.m3u8'
                            poster=''
                            controls={false}
                            autoPlay={true}
                            preload='auto'
                            muted={true}
                            playsInline={true}
                            loop={true}
                          />
                        </div>
                      </div>
                      <div className='position-relative widthvideos'>
                        <div style={{ paddingTop: '178%' }}></div>
                        <div className='mainVideoContabout'>
                          <img
                            src='https://cdn.workmob.com/stories_workmob/images/mobile-portrait.png'
                            alt="Portrait Frame"
                            className='portraitFrame'
                          />
                          <ReactHlsPlayer
                            className='aboutPagePortraitClass2'
                            id='aboutpageportrait'
                            url='https://cdn.workmob.com/stories_workmob/promotion_videos/story_about_three/story_premium_three.m3u8'
                            poster=''
                            controls={false}
                            autoPlay={true}
                            preload='auto'
                            muted={true}
                            playsInline={true}
                            loop={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='secondDiv'>
                    {state.isHindi ? <h4 className={`description ${state.isHindi ? 'font-khand font-600' : ''}`}>आपकी डिजिटल पहचान । सुनाओ अपनी कहानी, बनाओ अपनी पहचान</h4> : <h4 className="description d-flex flex-row"><span>Aapki Digital Pehchan. <span className='ml-2 font-khand font-600'>सुनाओ अपनी कहानी, बनाओ अपनी पहचान</span></span></h4>}
                    <div className='flexContainer'>
                      <div className='videocontainer topVideoContainer position-relative'>
                        <div className='mainVideoContabout'>
                          <img
                            src='https://cdn.workmob.com/stories_workmob/images/frame.png'
                            alt="Small Landscape Frame"
                            className='portraitFrame'
                          />
                          <ReactHlsPlayer
                            className='qrPageLandscapeClass'
                            id='qrpagelandscape'
                            url='https://cdn.workmob.com/stories_workmob/promotional/scan-qr-code/scan-qr-code.m3u8'
                            poster=''
                            controls={false}
                            autoPlay={true}
                            preload='auto'
                            muted={true}
                            playsInline={true}
                            loop={true}
                          />
                        </div>
                      </div>
                      {state.isHindi ? <p className={`span2 ${state.isHindi ? 'font-khand lh-1-6' : ''}`}>प्रभावशाली वीडियो के माध्यम से अपने ब्रांड को आगे बढ़ाएँ, अपना सिंगल ब्रांडिंग पेज और QR कोड प्राप्त करें और अपनी एक नयी डिजिटल पहचान बनाएँ। आपके सभी सोशल मीडिया लिंक एक ही प्लेटफॉर्म पर पाएँ। QR कोड की सहायता से ऑफ़लाइन दर्शकों को भी इसे स्कैन करके आपके ब्रांडिंग पेज पर पहुँचने में आसानी होगी।</p> :
                        <p className="span2">Get your own single branding page and QR code to help showcase your brand with the power of video. Your video intro, bio and all your social media links in one place. Your own personal QR code to help drive offline audiences to your video powered branding page. Let your voice be heard with Workmob.</p>}
                    </div>
                  </div>
                  <div className='thirdDiv'>
                    {state.isHindi ? <h4 className={`description ${state.isHindi ? 'font-khand font-600' : ''}`}>भारत में निर्मित । भारतवासियों के लिए ।</h4> :
                      <h4 className="description d-flex flex-row align-items-baseline">Made in&nbsp;<span className='font-khand font-600'>भारत.</span>&nbsp;For&nbsp;<span className='font-khand font-600'>भारत.</span></h4>}
                    {state.isHindi ? <p className={`span1 ${state.isHindi ? 'font-khand lh-1-6' : ''}`}>वर्कमोब का उद्देश्य प्रभावशाली वीडियो के माध्यम से हर भारतीय को एक डिजिटल पहचान दिलाना और उनके व्यक्तिगत एवं व्यावसायिक ब्रांड को आगे बढ़ाने में उनकी मदद करना है।</p> :
                      <p className="span1">Our vision is to enable every Indian to amplify their personal and business brand using the authenticity and engagement of video. A place that will make it super easy for you to create your video introduction, impress, and get the attention of your audience.</p>}
                  </div>
                  <div className='fourthDiv'>
                    {state.isHindi ? <h4 className={`description ${state.isHindi ? 'font-khand font-600' : ''}`}>हमारे बारे में जानें</h4> :
                      <h4 className="description">Who are we</h4>}
                    {state.isHindi ? <p className={`span1 ${state.isHindi ? 'font-khand lh-1-6' : ''}`}>वर्कमोब के अंतर्गत 30+ लोगों की एक टीम हैं जो भारत की प्रोफेशनल कम्युनिटी की आवाज़ को देशवासियों तक पहुँचाने और उन्हें एक नयी डिजिटल पहचान दिलाने के लिए एकजुट होकर कार्य कर रही हैं। हमारा उद्देश्य एक ऐसा प्लेटफ़ॉर्म तैयार करना है जो बन जाए <span className="hinditxt">"भारत के अपने कर्मयोगियों की आवाज़"।</span> हमारा ऑफिस राजस्थान के सुंदर झीलों के शहर, उदयपुर में है। हमारे फाउंडर <a className="storyLink" href="https://stories.workmob.com/kunal-bagla-founder-ceo-arcgate">कुणाल बागला</a>, एक टेक्नोलॉजी एंटरप्रेन्योर हैं, जिन्हें भारत और अमेरिका में 2 दशकों से अधिक का इंडस्ट्री एक्सपीरियंस है।</p> :
                      <p className="span1">We are a team of 30+ people passionate about building a platform that will be the voice for India&apos;s professional community. A place that will become <span className="hinditxt font-khand font-600">‘भारत के अपने कर्मयोगियों की आवाज’</span>. We are headquartered in the beautiful &quot;City of Lakes&quot; Udaipur, Rajasthan. Our founder is <a className="storyLink" href="https://stories.workmob.com/kunal-bagla-founder-ceo-arcgate"> Kunal Bagla</a>, a technology entrepreneur with more than two decades of industry experience in the US and India.</p>}
                    {state.isHindi ? <h4 className={`description ${state.isHindi ? 'font-khand font-600' : ''}`}>हमें आपसे बात करके खुशी होगी।</h4> :
                      <h4 className="description">We&apos;d love to hear from you</h4>}
                    {state.isHindi ? <p className={`span1 ${state.isHindi ? 'font-khand lh-1-6' : ''}`}>अगर आप उदयपुर में हों, तो हमें संदेश भेजें या हमारे स्टूडियो में पधारें!</p> :
                      <p className="span1">Drop us a message or stop by our studio if you happen to be in Udaipur!</p>}
                    <div className='videocontainer position-relative topVideoContainer'>
                      <div className='mainVideoContabout'>
                        <img
                          src="https://cdn.workmob.com/stories_workmob/images/frame.png"
                          alt="Landscape Frame"
                          className='landscapeFrame'
                        />
                        <ReactHlsPlayer
                          className='brandingLandscapeClass'
                          id='brandingLandscape'
                          url='https://cdn.workmob.com/stories_workmob/promotional/workmob-studio/workmob-studio.m3u8'
                          poster=''
                          controls={false}
                          autoPlay={true}
                          preload='auto'
                          muted={true}
                          playsInline={true}
                          loop={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row text-center mt-4">
                    <div className="col-12">
                      <a className="homeLink" target="_blank" href="https://wa.me/919001985566?text= + I want to join your movement.">
                        {state.isHindi ? <div className={`brandbtn ${state.isHindi ? 'font-khand' : ''}`}>अपना ब्रांडिंग पेज प्राप्त करें</div> :
                          <div className="brandbtn">Get your branding page</div>}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row mt-4 mt-md-3 mb-0">
                  <div className="col-12 text-center bottom-section">
                    <div className={`address className ${state.isHindi ? 'font-khand' : ''}`}>
                      {state.isHindi ? <span>पता : वर्कमोब प्राइवेट लिमिटेड, G1-10, आईटी पार्क, एमआईए (एक्सटेंशन), ​​उदयपुर 313003, राजस्थान, भारत</span> :
                        <span>Workmob Private Limited, GI-10, IT Park, MIA(Ext.), Udaipur 313003, Rajasthan, India</span>}
                      <div className="d-md-flex d-grid justify-content-center">
                        <span className="contact">{state.isHindi ? 'फोन नंबर' : 'T'}: +91 9001985566</span>
                        <span className="contact">{state.isHindi ? 'ईमेल' : 'E'}: <a href="mailto:support@workmob.com" className="aboutEmail">support@workmob.com</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER  */}
        <StoryDetailPageFooterNew />
      </div>
    </>
  );
};

export default AboutStories;

const styles = `
.aboutbackgroundPage{
    position: fixed;
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
}
.aboutmaindiv{
    display: block;
    padding: 4.5rem 0 0rem;
    width: 100%;
}
.videocontainer {
    width: 100%;
    margin: 0 auto;
    height: auto;
    overflow: hidden;
    border-radius: 20px;
}
.zeroDiv .mainVideoContabout {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.topVideoContainer:before {
    content: "";
    padding-top: 56.3%;
    display: block;
}
.about_frame {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    position: absolute;
    object-fit: contain;
}
.homePageBannerVideo {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 12px 18px 12px 18px;
    border-radius: 84px;
}
.textcontainer {
    width: 100%;
    color: #fff;
}
.BrandHeading {
    color: #fff;
    font-size: 33px;
    font-weight: 600;
    padding-left: 4px;
    padding-right: 5px;
}
.txtOrange {
    color: #f96332;
    font-size: 40px;
    font-weight: 700;
}
.firstDiv .description {
    line-height: 1.5;
    color: #fd0;
    font-size: 28px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    margin-top: 23px;
    font-family: Alata, sans-serif;
}
.firstDiv .span1 {
    font-size: 22px;
    font-weight: 500;
    color: #fff;
    line-height: 1.3;
    margin-bottom: 30px;
    font-family: Alata, sans-serif;
}
.firstDiv .portraitvideoRow {
    margin: 53px 0;
}
.firstDiv .widthvideos {
    width: 28% !important;
    z-index: 1;
    margin-bottom: 55px;
}
.firstDiv .mainVideoContabout {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.firstDiv .mainVideoContabout .portraitFrame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    object-fit: contain;
}
#aboutpageportrait {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 13px 6px 13px 6px;
    border-radius: 44px;
}
.widthvideos:nth-child(2) {
    z-index: 2;
    transform: scale(1.2);
}
.secondDiv .description {
    line-height: 1.5;
    color: #fd0;
    font-size: 28px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    margin-top: 23px;
    margin-bottom: 13px;
    font-family: Alata, sans-serif;
}
.secondDiv .flexContainer {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    justify-content: space-evenly;
}
.secondDiv .flexContainer .videocontainer {
    width: 100%;
    margin: 0 auto;
    height: auto;
    overflow: hidden;
    border-radius: 20px;
}
.secondDiv .flexContainer .topVideoContainer:before {
    content: "";
    padding-top: 56.3%;
    display: block;
}
.secondDiv .flexContainer .videocontainer .mainVideoContabout {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.secondDiv .flexContainer .videocontainer .mainVideoContabout .portraitFrame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}
.secondDiv .flexContainer .videocontainer .mainVideoContabout .qrPageLandscapeClass {
    position: absolute;
    top: 0;
    left: 0;
    padding: 6px 4px;
    border-radius: 29px;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.secondDiv .flexContainer .span2 {
    width: 183%;
    font-size: 22px;
    font-weight: 500;
    color: #fff;
    font-family: Alata, sans-serif;
    line-height: 1.3;
}
.thirdDiv .description {
    line-height: 1.5;
    color: #fd0;
    font-size: 28px;
    font-weight: 500;
    display: flex;
    margin-top: 23px;
    font-family: Alata, sans-serif;
}
.thirdDiv .span1 {
    font-size: 22px;
    font-weight: 500;
    color: #fff;
    line-height: 1.3;
    margin-bottom: 30px;
    font-family: Alata, sans-serif;
}
.fourthDiv .description {
    line-height: 1.5;
    color: #fd0;
    font-size: 28px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    margin-top: 23px;
    font-family: Alata, sans-serif;
}
.fourthDiv .span1 {
    font-size: 22px;
    font-weight: 400;
    color: #fff;
    line-height: 1.3;
    margin-bottom: 30px;
    font-family: Alata, sans-serif;
}
.fourthDiv .span1 .hinditxt {
    font-size: 22px;
    font-weight: 400;
    font-family: Khand, serif;
}
.fourthDiv .span1 .storyLink {
    color: #fff;
    font-weight: 700;
    text-decoration: none;
}
.fourthDiv .videocontainer .mainVideoContabout {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.fourthDiv .videocontainer .mainVideoContabout .landscapeFrame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}
.fourthDiv .videocontainer .mainVideoContabout .brandingLandscapeClass {
    position: absolute;
    top: 0;
    left: 0;
    padding: 15px 9px;
    border-radius: 60px;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.homeLink {
    text-decoration: none !important;
    display: inline-block;
}
.brandbtn {
    background-color: #00388b80;
    background-position: 50%;
    border-radius: 30px;
    box-shadow: 0 3px 6px #00000029;
    color: #fff;
    cursor: pointer;
    font-family: Montserrat, sans-serif;
    font-size: 17px;
    font-weight: 700;
    padding: .7rem 1.7rem;
    text-decoration: none;
    white-space: nowrap;
    transition: transform .3s ease-in-out;
}
.bottom-section .address {
    color: #fd0;
    font-size: 19px;
    font-weight: 400;
    letter-spacing: 1px;
    text-align: center;
    line-height: 2;
    font-family: Alata, sans-serif;
}
.bottom-section .address .contact {
    flex-direction: column;
    color: #fd0;
    margin-right: 30px;
}
.bottom-section .address .contact .aboutEmail {
    color: #fd0;
    text-decoration: none;
}
@media only screen and (max-width: 992px) {
  .secondDiv .flexContainer {
     flex-direction: column;
  }
  .secondDiv .flexContainer .span2 {
     width: 100%;
  }
}
@media only screen and (min-width: 992px) and (max-width: 1200px) {
.homePageBannerVideo {
     border-radius: 74px;
  }
#aboutpageportrait {
     padding: 11px 5px 11px 6px;
     border-radius: 40px;
}
.firstDiv .widthvideos {
     margin-bottom: 25px;
}
}
@media only screen and (min-width: 768px) and (max-width: 992px) {
  .homePageBannerVideo {
     padding: 8px 16px 8px 16px;
     border-radius: 47px;
  }
  #aboutpageportrait {
     padding: 8px 4px 8px 4px;
     border-radius: 29px;
  }
  .secondDiv .flexContainer .videocontainer .mainVideoContabout .qrPageLandscapeClass {
     border-radius: 55px;
  }
  .fourthDiv .videocontainer .mainVideoContabout .brandingLandscapeClass {
     padding: 10px 7px;
     border-radius: 55px;
  }
  .BrandHeading {
     font-size: 28px;
  }
  .txtOrange {
     font-size: 32px;
  }
  .firstDiv .description {
     line-height: 1.3;
  }
  .firstDiv .widthvideos {
     margin-bottom: 20px;
  }
  .secondDiv .description {
     line-height: 1.3;
  }
}
@media only screen and (min-width: 476px) and (max-width: 768px) {
  .homePageBannerVideo {
     padding: 6px 11px 6px 11px;
     border-radius: 37px;
  }
  #aboutpageportrait {
     padding: 5px 3px 5px 3px;
     border-radius: 20px;
  }
  .secondDiv .flexContainer .videocontainer .mainVideoContabout .qrPageLandscapeClass {
     border-radius: 41px;
  }
  .fourthDiv .videocontainer .mainVideoContabout .brandingLandscapeClass {
     padding: 7px 5px;
     border-radius: 36px;
  }
  .BrandHeading {
     font-size: 24px;
  }
  .txtOrange {
     font-size: 29px;
  }
  .firstDiv .description {
     line-height: 1.3;
  }
  .secondDiv .description {
     line-height: 1.3;
  }
  .thirdDiv .description {
     line-height: 1.3;
  }
  .fourthDiv .description {
     line-height: 1.3;
  }
}
@media only screen and (min-width: 387px) and (max-width: 476px) {
  .homePageBannerVideo {
     padding: 5px 8px 5px 8px;
     border-radius: 31px;
  }
   #aboutpageportrait {
     padding: 5px 3px 5px 3px;
     border-radius: 16px;
  }
  .fourthDiv .videocontainer .mainVideoContabout .brandingLandscapeClass {
     padding: 6px 4px;
     border-radius: 26px;
  }
  .BrandHeading {
     font-size: 21px;
  }
  .txtOrange {
     font-size: 27px;
  }
  .firstDiv .description {
     line-height: 1.3;
  }
  .secondDiv .description {
     line-height: 1.3;
  }
  .thirdDiv .description {
     line-height: 1.1;
  }
  .fourthDiv .description {
     line-height: 1.1;
  }
}
@media only screen and (max-width: 387px) {
  .homePageBannerVideo {
     padding: 3px 6px 3px 6px;
     border-radius: 33px;
  }
  #aboutpageportrait {
     padding: 4px 2px 4px 2px;
     border-radius: 15px;
  }
  .fourthDiv .videocontainer .mainVideoContabout .brandingLandscapeClass {
     padding: 4px 3px;
     border-radius: 29px;
  }
  .BrandHeading {
     font-size: 19px;
  }
  .txtOrange {
     font-size: 23px;
  }
  .firstDiv .description {
     line-height: 1.1;
     font-size: 25px;
  }
  .secondDiv .description {
     line-height: 1.4;
     font-size: 25px;
  }
  .thirdDiv .description {
     line-height: 1.1;
     font-size: 25px;
  }
  .fourthDiv .description {
     line-height: 1.1;
     font-size: 25px;
  }
  .firstDiv .widthvideos {
     margin-bottom: 0px !important;
  }
  .firstDiv .portraitvideoRow {
     margin-bottom: 40px;
     margin-top: 40px;
  }
  .secondDiv .flexContainer {
     gap: 10px;
  }
  .bottom-section .address {
     font-size: 15px;
     line-height: 1.8;
  }
  .bottom-section .address .contact {
     margin-right: 2px;
  }
}
@media (max-width: 767px) {
  .workmob-logo {
     max-width: unset !important;
     min-width: unset !important;
  }
.firstDiv .widthvideos {
     margin-bottom: 11px;
  }
}
.aboutpage {
   position: relative;
   background-color: rgba(0, 0, 0, 0.5) !important;
}
.font-600 {
   font-weight: 600 !important;
}
.lh-1-6 {
   line-height: 1.6 !important;
}
`;
