import React, { useEffect, useRef } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

export default function Slider({ children, onSlideChange, speed = 1, initialSlide = 0 }) {
  const cursorXRef = useRef();
  const scrollLeftRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const currSlideRef = useRef();
  const prevSlideRef = useRef();
  const sliderRef = useRef();
  const isInitialScrollRef = useRef(false);

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  useEffect(() => {
    if (!children) return;

    function listenScroll() {
      const slider = sliderRef.current;
      const initialSlideScroll = Math.round(slider.querySelector('.Slider-element')?.offsetWidth * initialSlide);

      if (Math.abs(slider.scrollLeft - initialSlideScroll) < 2) {
        isInitialScrollRef.current = true;
        slider.removeEventListener('scroll', listenScroll);
      }
    }

    const slider = sliderRef.current;

    slider.addEventListener('scroll', listenScroll);

    return () => slider.removeEventListener('scroll', listenScroll);
  }, [children]);

  useEffect(() => {
    if (children && !isInitialScrollRef.current) {
      const slider = sliderRef.current;
      const initialSlideScroll = Math.round(slider.querySelector('.Slider-element')?.offsetWidth * initialSlide);
  
      if (initialSlide) {
        slider.scrollLeft = initialSlideScroll;
      }
  
      centerSlide(slider, true);
    }

  }, [children]);

  useEffect(() => {
    const slider = sliderRef.current;

    function adjustSlide() {
      centerSlide(slider, true);
    }

    window.addEventListener('resize', adjustSlide);

    return () => window.removeEventListener('resize', adjustSlide);
  }, [children]);

  function centerSlide(slider, auto) {
    const sliderWidth = slider.offsetWidth;
    const sliderScrollValue = slider.scrollLeft;
    const sliderLeftPos = slider.getBoundingClientRect().left;
    const slideCenterPos = sliderLeftPos + sliderWidth / 2;
    const slideNodes = slider.querySelectorAll('.Slider-element');

    if (slideNodes.length === 0) {
      return;
    }

    const idealLeftPos = slideCenterPos - slideNodes[0].offsetWidth / 2
    const gap =
      slideNodes.length === 1
        ? 0
        : slideNodes[1].getBoundingClientRect().left - slideNodes[0].getBoundingClientRect().right;

    let currentSlide = [...slideNodes].find(slide => {
      const slideLeftPos = slide.getBoundingClientRect().left;
      const slideRightPos = slide.getBoundingClientRect().right;

      return slideLeftPos < (slideCenterPos + gap) && slideRightPos > (slideCenterPos - gap);
    });

    if (sliderScrollValue === 0) {
      currentSlide = slideNodes[0];
    }

    else if (Math.abs(sliderScrollValue - (slider.scrollWidth - sliderWidth)) <= 2) {
      currentSlide = slideNodes[slideNodes.length - 1];
    }

    const scrollValue = Math.round(currentSlide.getBoundingClientRect().left - idealLeftPos);

    slider.scrollBy({
      top: 0,
      left: scrollValue,
      behavior: auto ? 'auto' : 'smooth',
    });

    prevSlideRef.current = currSlideRef.current;
    prevSlideRef.current?.classList.remove('Slider-activeSlide');
    currSlideRef.current = currentSlide;
    currSlideRef.current.classList.add('Slider-activeSlide');

    if (onSlideChange && currSlideRef.current !== prevSlideRef.current) {
      onSlideChange(currentSlide);
    }
  }

  function startDrag(event) {
    const pageX = event.pageX || event.nativeEvent.touches[0].pageX;

    cursorXRef.current = pageX - event.currentTarget.offsetLeft;
    scrollLeftRef.current = event.currentTarget.scrollLeft;
    isMouseDownRef.current = true;
  }

  function handleMouseMove(event) {
    if (isMouseDownRef.current) {
      const pageX = event.pageX || event.nativeEvent.touches[0].pageX;
      const cursorX = pageX - event.currentTarget.offsetLeft;
      const scroll = (cursorX - cursorXRef.current)*speed;

      event.currentTarget.scrollLeft = scrollLeftRef.current - scroll;
    }
  }

  function stopDrag(event) {
    isMouseDownRef.current = false;
    centerSlide(event.currentTarget);

    // if (isMouseDownRef.current) {
    //   isMouseDownRef.current = false;
    //   centerSlide(event.currentTarget);
    // }
  }

  return (
    <div
      className='Slider d-flex align-items-center overflow-hidden noScrollbar'
      ref={sliderRef}
      onMouseDown={startDrag}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchStart={startDrag}
      onTouchMove={handleMouseMove}
      onTouchEnd={stopDrag}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { className: `${child.props.className || ''} Slider-element` })
      )}
    </div>
  );
}
