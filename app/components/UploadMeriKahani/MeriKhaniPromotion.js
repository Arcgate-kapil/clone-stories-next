// app/meri-khani-promotion/page.js

'use client';

import React, { useEffect, useState, useRef } from 'react';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import StoryDetailPageFooterNew from '../StoryDetail/StoryDetailPageFooterNew';
import axios from 'axios';
import useWindowSize from '../../utils/useWindowSize';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import CustomStyle from '../common/CustomStyle';

const MeriKhaniPromotion = () => {
  const [stories, setStories] = useState({});
  const [local, setLocal] = useState({});
  const [gyanmanch, setGyanmanch] = useState({});
  const [motivation, setMotivation] = useState({});
  const [greetings, setGreetings] = useState({});
  const [digitalPehchan, setDigitalPehchan] = useState({});
  const [digitalMomento, setDigitalMomento] = useState({});
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { width } = useWindowSize();
  const containerFluid = useRef();
  const playerRef = useRef(null);
  const state = useSelector(state => state.blog);

  useEffect(() => {
    // Try to play programmatically on mount
    if (playerRef.current) {
      playerRef.current.play().catch(() => {
        // Auto-play might fail without user interaction
        // You can handle fallback here if needed
      });
    }
  }, []);

  useEffect(() => {
    window.scroll(0, 0);

    // restoring scroll position.
    const observer = new MutationObserver((mutations, observer) => {
      const blogPath = sessionStorage.getItem('blogPath');
      const lastScroll = sessionStorage.getItem('lastScroll');
      if (blogPath && lastScroll) {
        window.scroll(0, lastScroll);
      }

      setTimeout(() => {
        sessionStorage.removeItem('blogPath');
      }, 2000);
    });

    observer.observe(containerFluid?.current, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // saving scroll position on unmount
    return () => {
      sessionStorage.setItem('lastScroll', window.scrollY);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const bottomThreshold = 20;
      const atBottom = scrollTop + windowHeight >= docHeight - bottomThreshold;
      if (scrollTop > lastScrollTop || atBottom) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/stories_premium');
        const flatArray = response?.data?.data?.reduce((acc, curr) => acc.concat(curr), []);

        const storiesItems = flatArray.find(section => section.type === "stories");
        const localItems = flatArray.find(section => section.type === "local");
        const gyanmanchItems = flatArray.find(section => section.type === "gyanmanch");
        const motivationItems = flatArray.find(section => section.type === "motivation");
        const greetingsItems = flatArray.find(section => section.type === "greetings");
        const digitalPehchanItems = flatArray.find(section => section.type === "digital pehchan");
        const digitalMomentoItems = flatArray.find(section => section.type === "digital momento");
        setStories(storiesItems);
        setLocal(localItems);
        setGyanmanch(gyanmanchItems);
        setMotivation(motivationItems);
        setGreetings(greetingsItems);
        setDigitalPehchan(digitalPehchanItems);
        setDigitalMomento(digitalMomentoItems);
      } catch (err) {
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { ref: refLocal, inView: inViewLocal } = useInView({ threshold: 0.5 });
  const { ref: refGyanmanch, inView: inViewGyanmanch } = useInView({ threshold: 0.5 });
  const { ref: refMotivation, inView: inViewMotivation } = useInView({ threshold: 0.5 });
  const { ref: refGreetings, inView: inViewGreetings } = useInView({ threshold: 0.5 });
  const { ref: refDigitalPehchan, inView: inViewDigitalPehchan } = useInView({ threshold: 0.5 });

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <div style={styles.logo_container}>
        <img
          width="172px"
          height="auto"
          src='https://cdn.workmob.com/stories_workmob/images/common/logo.png'
          alt='logo'
        />
      </div>
      {/* Paid plan section start */}
      <section className="plan-section mt-47" ref={containerFluid}>
        <div className="container">
          <div className='row justify-content-center'>
            <div className='col-lg-9'>
              <div className='top-title mb-4 d-flex justify-content-center'>
                <img className='img-fluid' src={state.isHindi ? 'https://cdn.workmob.com/intro_workmob/images/build-trust-and-love-for-your-brand-hindi.png' : 'https://cdn.workmob.com/market_workmob/config/Udaipur/build-trust-and-love-for-your-personal-brand.png'} />
              </div>
            </div>
          </div>
          <div className="plan-item">
            <div className="row">
              <div className="col-lg-12">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className='main-banner'>
                      <img className="img-fluid" src={state.isHindi ? 'https://cdn.workmob.com/stories_workmob/promotional/get-your-video-powered-single-branding-page-hindi.png' : 'https://cdn.workmob.com/stories_workmob/images/common/get-you-video-powered-single-branding-page.png'} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-md-7 col-sm-7 col-7 below-510">
                    <div className='first-sec'>
                      <div className='plans mb-3'>
                        <span className='first hpSimplified'>{state.isHindi ? 'प्रीमियम प्लान' : 'Premium Plan'}</span>
                        <span className='second montserrat-regular'>{state.isHindi ? 'लाइफ टाइम' : 'Lifetime'}</span>
                      </div>
                      <div className='price'>
                        <div className='payment'>
                          <span className='first mr-3 hpSimplified'>₹ 0</span>
                          <span className='second mr-2 hpSimplified'><span>₹</span> <span>2,499</span></span>
                          <span className='third mt-1 montserrat-regular'>{state.isHindi ? 'एकमुश्त भुगतान' : 'ONE-TIME PAYMENT'}</span>
                        </div>
                        <span className='limited montserrat-regular'>{state.isHindi ? 'ऑफ़र सीमित समय के लिए!' : 'Limited time promotional offer!'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-5 col-5 below-510">
                    <div className='second-sec'>
                      <a target='_blank'
                        href={
                          `https://wa.me/919001985566?text=` + 'I want to join your movement.'
                        }
                        className="btn montserrat-regular">{state.isHindi ? 'शुरुआत करें' : 'Get Started'}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Paid plan section end  */}
      {/* Benefits Section start  */}
      <section className="benefits-section">
        <div className="container-fluid">
          <div className={`text-center ${width < 768 ? 'mb-0' : 'mb-50'}`}>
            <h2 className="section-title hpSimplified">{state.isHindi ? 'आपको क्या विशेष सुविधाएँ उपलब्ध होंगी ?' : 'What benefits do you get?'}</h2>
          </div>

          <div className={`benefit-item first-section ${width < 768 ? 'mb-50' : ''}`}>
            <div className="row align-items-center d-flex justify-content-start">
               <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? '' : 'd-none'}`}>
                <div className={`benefit-content ${width < 768 ? 'ptr-1' : ''}`}>
                  <img className='img-fluid mb-2 mx-auto' src={state.isHindi ? stories?.logo_hindi : stories?.logo} />
                  <p className="benefit-description font-alata mb-1">
                    {state.isHindi ? stories?.description_hindi : stories?.description}
                  </p>
                  <p className="benefit-description font-alata mb-1">
                    {state.isHindi ? stories?.description_one_hindi : stories?.description_one}
                  </p>
                  <p className="benefit-description font-alata">
                    {state.isHindi ? stories?.note_hindi : stories?.note}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="benefit-images d-flex">
                  {stories?.items?.map((item, index) => (
                    <div key={index} className={`phone-mockup position-relative h-100 w-26 ${index == 1 ? 'latest-transform cust-z-index' : ''}`}>
                      <img loading="lazy" className="w-100 h-100 frame" src="https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png" alt="frame" />
                      <ReactHlsPlayer
                        ref={playerRef}
                        className={`benefitVideoPlayer${index}`}
                        url={item?.video}
                        poster=''
                        id='VideoPlayerComman'
                        preload='auto'
                        loop={true}
                        controls={false}
                        autoPlay
                        width='100%'
                        height='100%'
                        muted={true}
                        playsInline={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? 'd-none' : ''}`}>
                <div className={`benefit-content ${width > 575 && width < 768 ? 'mt-40' : ''}`}>
                  <img className='img-fluid mb-2 mx-auto' src={state.isHindi ? stories?.logo_hindi : stories?.logo} />
                  <p className="benefit-description font-alata mb-1">
                    {state.isHindi ? stories?.description_hindi : stories?.description}
                  </p>
                  <p className="benefit-description font-alata mb-1">
                    {state.isHindi ? stories?.description_one_hindi : stories?.description_one}
                  </p>
                  <p className="benefit-description font-alata">
                    {state.isHindi ? stories?.note_hindi : stories?.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={`benefit-item second-section ${width < 768 ? 'mb-50' : ''}`}>
            <div className="row align-items-center d-flex justify-content-end">
              <div className="col-lg-5 col-md-5 col-sm-12 col-12">
                <div className={`benefit-content ${width > 575 && width < 768 ? 'mb-40' : ''}`}>
                  <img className={`img-fluid mb-2 mx-auto ${width < 576 ? 'mx-width-280' : 'mx-width'}`} src={state.isHindi ? local?.logo_hindi : local?.logo} />
                  <p className="benefit-description font-alata">
                    {state.isHindi ? local?.description_hindi : local?.description}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="benefit-images d-flex">
                  {local?.items?.map((item, index) => (
                    <div key={index} ref={refLocal} className={`phone-mockup position-relative h-100 w-26 ${index == 1 ? 'latest-transform cust-z-index' : ''}`}>
                      <img loading="lazy" className="w-100 h-100 frame" src="https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png" alt="frame" />
                      <ReactHlsPlayer
                        className={`benefitVideoPlayerLocal${index}`}
                        url={inViewLocal ? item?.video : ''}
                        poster=''
                        id='VideoPlayerComman'
                        preload='auto'
                        loop={true}
                        controls={false}
                        autoPlay
                        width='100%'
                        height='100%'
                        muted={true}
                        playsInline={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={`benefit-item third-section ${width < 768 ? 'mb-50' : ''}`}>
            <div className="row align-items-center d-flex justify-content-start">
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? '' : 'd-none'}`}>
                <div className="benefit-content">
                  <img className={`img-fluid mb-2 mx-auto ${width < 576 ? 'mx-width-280' : 'mx-width'}`} src={state.isHindi ? gyanmanch?.logo_hindi : gyanmanch?.logo} />
                  <p className="benefit-description font-alata">
                    {state.isHindi ? gyanmanch?.description_hindi : gyanmanch?.description}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="benefit-images d-flex">
                  {gyanmanch?.items?.map((item, index) => (
                    <div key={index} ref={refGyanmanch} className={`phone-mockup position-relative h-100 w-78`}>
                      <img loading="lazy" className="w-100 h-100 frame" src="https://cdn.workmob.com/stories_workmob/images/common/landscape_frame_image.webp" alt="frame" />
                      <ReactHlsPlayer
                        className={`benefitVideoPlayerGyanmanch${index}`}
                        url={inViewGyanmanch ? item.video : ''}
                        poster={item.poster_image}
                        id='VideoPlayerCommanGyanmanch'
                        preload='auto'
                        loop={true}
                        controls={false}
                        autoPlay
                        width='100%'
                        height='100%'
                        muted={true}
                        playsInline={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? 'd-none' : ''}`}>
                <div className="benefit-content">
                  <img className={`img-fluid mb-2 mx-auto ${width < 576 ? 'mx-width-280' : 'mx-width'}`} src={state.isHindi ? gyanmanch?.logo_hindi : gyanmanch?.logo} />
                  <p className="benefit-description font-alata">
                    {state.isHindi ? gyanmanch?.description_hindi : gyanmanch?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={`benefit-item fourth-section ${width < 768 ? 'mb-50' : ''}`}>
            <div className="row align-items-center d-flex justify-content-end">
              <div className="col-lg-5 col-md-5 col-sm-12 col-12">
                <div className={`benefit-content ${width > 575 && width < 768 ? 'mb-40' : ''}`}>
                  <img className={`img-fluid mb-2 mx-auto ${width < 576 ? 'mx-width-280' : 'mx-width'}`} src={state.isHindi ? motivation?.logo_hindi : motivation?.logo} />
                  <p className="benefit-description font-alata">
                    {state.isHindi ? motivation?.description_hindi : motivation?.description}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="benefit-images d-flex">
                  {motivation?.items?.map((item, index) => (
                    <div key={index} ref={refMotivation} className={`phone-mockup position-relative h-100 w-26 ${index == 1 ? 'latest-transform cust-z-index' : ''}`}>
                      <img loading="lazy" className="w-100 h-100 frame" src="https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png" alt="frame" />
                      <ReactHlsPlayer
                        className={`benefitVideoPlayerPrerna${index}`}
                        url={inViewMotivation ? item.video : ''}
                        poster={item.poster_image}
                        id='VideoPlayerComman'
                        preload='auto'
                        loop={true}
                        controls={false}
                        autoPlay
                        width='100%'
                        height='100%'
                        muted={true}
                        playsInline={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="benefit-item fifth-section">
            <div className="row align-items-center d-flex justify-content-start">
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? '' : 'd-none'}`}>
                <div className="benefit-content">
                  <img className={`img-fluid mb-2 mx-auto ${width < 576 ? 'mx-width-280' : 'mx-width'}`} src={greetings?.logo} />
                  <p className="benefit-description font-alata mb-5">
                    {state.isHindi ? greetings?.description_hindi : greetings?.description}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div ref={refGreetings} className={`benefit-images d-flex ${width > 575 && width < 768 ? 'mb-10' : ''}`}>
                  {greetings?.items?.map((item, index) => (
                    <div key={index} className={`phone-mockup position-relative h-100 w-26 ${index == 1 ? 'latest-transform cust-z-index' : ''}`}>
                      <img loading="lazy" className="w-100 h-100 frame" src='https://cdn.workmob.com/stories_workmob/images/common/GoldenFramegt.png' alt="frame" />
                      <ReactHlsPlayer
                        className={`benefitVideoPlayerGreetings${index}`}
                        url={inViewGreetings ? item.video : ''}
                        poster={item.poster_image}
                        id='VideoPlayerCommanGreetings'
                        preload='auto'
                        loop={true}
                        controls={false}
                        autoPlay
                        width='100%'
                        height='100%'
                        muted={true}
                        playsInline={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? 'd-none' : ''}`}>
                <div className="benefit-content">
                  <img className={`img-fluid mb-2 mx-auto ${width < 576 ? 'mx-width-280' : 'mx-width'}`} src={greetings?.logo} />
                  <p className="benefit-description font-alata">
                    {state.isHindi ? greetings?.description_hindi : greetings?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="benefit-item sixth-section">
            <div className="row align-items-center d-flex justify-content-start">
              <div className='col-lg-12'>
                <div className='pehchan-title d-flex justify-content-center hpSimplified'>
                  <p className='mb-0'>{state.isHindi ? 'आपकी डिजिटल पहचान' : 'Aapki Digital Pehchan'}</p>
                </div>
              </div>
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? '' : 'd-none'}`}>
                <div className={`benefit-content ${width < 768 ? 'pt-0' : ''}`}>
                  <p className="benefit-description font-alata">
                    {state.isHindi ? digitalPehchan?.description_hindi : digitalPehchan?.description}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="benefit-images d-flex">
                  {digitalPehchan?.items?.map((item, index) => (
                    <div key={index} ref={refDigitalPehchan} className={`phone-mockup position-relative h-100 w-78`}>
                      <img loading="lazy" className="w-100 h-100 frame" src="https://cdn.workmob.com/stories_workmob/images/common/landscape_frame_image.webp" alt="frame" />
                      <ReactHlsPlayer
                        className={`benefitVideoPlayerDigitalPehchan${index}`}
                        url={inViewDigitalPehchan ? item?.video : ''}
                        poster={item.poster_image}
                        id='VideoPlayerCommanDigitalPehchan'
                        preload='auto'
                        loop={true}
                        controls={false}
                        autoPlay
                        width='100%'
                        height='100%'
                        muted={true}
                        playsInline={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`col-lg-5 col-md-5 col-sm-12 col-12 ${width < 768 ? 'd-none' : ''}`}>
                <div className="benefit-content">
                  <p className="benefit-description font-alata">
                    {state.isHindi ? digitalPehchan?.description_hindi : digitalPehchan?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits Section end */}

      {/* Digital Memnto start  */}
      <section className="digital-momento-section">
        <div className="container-fluid">
          <div className="text-center mb-3">
            <p className="section-title hpSimplified">#MeriKahani Digital Memento - Power of Video, QR Code and NFC</p>
            {/* <p className="section-subtitle font-alata">Your very own momento frame with QR code</p> */}
          </div>

          <div className="row justify-content-center">
            <div className='col-lg-10'>
              <div className='memento-content mb-5'>
                <ul style={{ paddingLeft: '45px' }}>
                  <li>QR code and momento frame which will allow easy access to your video powered branding page.</li>
                  <li>Display memento frames prominently in the office lobby.</li>
                  <li>Enable customers to easily scan the QR code to watch your videos, get to know you, and share with their friends.</li>
                  <li>Add your QR code in newspaper and billboard advertisements, marketing brochures, visiting cards, and any other promotion material.</li>
                </ul>
              </div>
            </div>
            <div className='col-lg-10'>
              <div className='row justify-content-center'>
                {digitalMomento?.items?.map((momento, index) => (
                  <div key={index} className="col-lg-4 col-md-4 col-sm-6 col-6 mb-4">
                    <div className="momento-frame">
                      <img className='img-fluid' src={momento?.poster_image} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Digital Memnto end  */}
      {/* Footer start  */}
      <StoryDetailPageFooterNew />
      {/* Footer end  */}
      {/* Sticky bottom bar start  */}
      <div className={`${isAtBottom ? 'footer-static' : 'footer-fixed'} ${showFooter ? 'footer-visible' : 'footer-hidden'}`} style={{
        position: isAtBottom ? 'static' : 'fixed',
        bottom: isAtBottom ? 'auto' : 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
      }}>
        <div className={`container-fluid ${width < 676 ? 'px-3' : 'px-5'}`}>
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-8 col-sm-9 col-9 top-below-479">
              <div className='first-sec'>
                <div className='internal-first mr-5'>
                  <h3 className="sticky-premium-title hpSimplified">{state.isHindi ? 'प्रीमियम प्लान' : 'Premium Plan'}</h3>
                  <p className="sticky-premium-duration montserrat-regular">{state.isHindi ? 'लाइफ टाइम' : 'Lifetime'}</p>
                </div>
                <div className='internal-second'>
                  <div className="sticky-pricing">
                    <span className="sticky-current-price hpSimplified mr-3">₹ 0</span>
                    <span className="sticky-original-price hpSimplified mr-2"><span>₹</span> <span>2,499</span></span>
                    <span className="third mt-1 montserrat-regular">{state.isHindi ? 'एकमुश्त भुगतान' : 'ONE-TIME PAYMENT'}</span>
                  </div>
                  <p className="sticky-offer-text">{state.isHindi ? 'ऑफ़र सीमित समय के लिए!' : 'Limited time promotional offer!'}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-4 col-sm-3 col-3 below-below-479">
              <div className='second-sec'>
                <a target='_blank'
                  href={
                    `https://wa.me/919001985566?text=` + 'I want to join your movement.'
                  }
                  className="btn montserrat-regular">{state.isHindi ? 'शुरुआत करें' : 'Get Started'}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky bottom bar end  */}
    </>
  );
};

export default MeriKhaniPromotion;

const styles = {
  logo_container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
  }
};

const styleString = `

.kahani_container {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  position: relative;
}

.plan-item {
  background-image: url(https://cdn.workmob.com/stories_workmob/promotional/premium-card-BG.webp);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 205px;
  padding: 22px 35px 15px 35px;
  border-radius: 12px;
}
.main-banner p {
  color: yellow;
  font-size: 26px;
  font-weight: 700;
  justify-content: center;
  display: flex;
  line-height: 1.4;
}
.first-sec .plans {
  display: grid;
}
.first-sec .plans .first {
  color: #ffffff;
  font-size: 25px;
}
.first-sec .plans .second {
  color: #ffffff;
  opacity: 0.5;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
}
.first-sec .price .payment {
  color: #ffffff;
  align-items: center;
  display: flex;
  line-height: 1.3;
;
}
.first-sec .price .payment .second {
  opacity: 0.5;
  font-size: 22px;
}
.first-sec .price .payment .second span:nth-child(2) {
  text-decoration: line-through;
}
.first-sec .price .payment .third {
  opacity: 0.5;
  font-size: 11px;
  font-weight: 600;
}
.first-sec .price .payment .first {
  font-size: 27px;
  font-weight: bold;
}
.first-sec .price .limited {
  color: #ffffff;
  opacity: 0.75;
  font-size: 13px;
  font-weight: 600;
}
.mt-47 {
  margin-top: 47px;
}
.plan-item .second-sec {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
}
.plan-item .second-sec .btn {
  background-image: url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png);
  background-size: 110%;
  background-position: center center;
  color: rgb(255, 255, 255);
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px;
  white-space: nowrap;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 34px 8px 34px;
}
.mb-50 {
  margin-bottom: 50px;
}
.sixth-section .pehchan-title {
  font-size: 3.1rem;
  color: rgb(253, 203, 92);
}
.digital-momento-section .section-title {
  font-size: 3.1rem;
  color: rgb(253, 203, 92);
  line-height: 1.2;
  margin-bottom: 5px;
}
.sixth-section {
  margin-bottom: 3rem;
}
.fifth-section {
  margin-bottom: 4rem;
}
.mt-40 {
  margin-top: 40px;
}
.mb-40 {
  margin-bottom: 40px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-8 {
  margin-bottom: 8rem;
}
.mb-9 {
  margin-bottom: 9rem;
}
.memento-content ul {
  font-size: 21px;
  line-height: 1.4;
  color: #ffffff;
  margin-bottom: 0;
  list-style: none;
  font-family: 'Alata';
}
`