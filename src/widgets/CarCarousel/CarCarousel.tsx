import React, { useState, useEffect, useRef } from "react";
import styles from "./CarCarousel.module.scss";
import { CarFilterDto, CarResponseDto } from "@/shared/api/car/types";
import { useGetAllCars } from "@/shared/api/car/hooks";
import bmwFallback from "@/assets/bmw.png";
import SwipeIndicator from "@/features/SwipeIndicator/SwipeIndicator";

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M15 18L9 12L15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M9 18L15 12L9 6" />
  </svg>
);

// Helper function to process car name
const processCarName = (fullName: string) => {
  const parts = fullName.split(' ');
  
  if (parts.length <= 1) {
    return { name: fullName, subModel: "" };
  }
  
  // Handle different naming patterns
  if (parts[0].includes('-')) {
    // "MERCEDES-BENZ GLC 260 L4"
    return {
      name: parts[0],
      subModel: parts.slice(1).join(' ')
    };
  } else if (parts.length >= 3 && (parts[2] === "SPORT" || parts[2] === "L4")) {
    // "TOYOTA CAMRY SPORT"
    return {
      name: `${parts[0]} ${parts[1]}`,
      subModel: parts.slice(2).join(' ')
    };
  } else if (parts.length >= 2) {
    // "BMW X3", "Nissan Teana"
    return {
      name: `${parts[0]} ${parts[1]}`,
      subModel: parts.slice(2).join(' ')
    };
  }
  
  return { name: fullName, subModel: "" };
};

// Helper function to format price
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

interface CarCardProps {
  car: CarResponseDto;
  isActive: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, isActive }) => {
  const { name, subModel } = processCarName(car.name || "");
  const image = car.images && car.images.length > 0 ? car.images[0] : bmwFallback;
  const price = car.price || 0;
  const formattedPrice = formatPrice(price);

  return (
    <div className={`${styles.carCard} ${isActive ? styles.activeCard : ""}`}>
      <div className={styles.cardImage}>
        <img src={image} alt={name} />
      </div>
      <div className={styles.cardDetails}>
        <div className={styles.modelInfo}>
          <span className={styles.modelName}>{name}</span>
          {subModel && <span className={styles.subModel}>{subModel}</span>}
        </div>
        <span className={styles.cardPrice}>{formattedPrice} руб.</span>
      </div>
    </div>
  );
};

interface CarCarouselProps {
  initialFilter?: CarFilterDto;
}

const CarCarousel: React.FC<CarCarouselProps> = ({ initialFilter = {} }) => {
  const [filter] = useState<CarFilterDto>(initialFilter);
  const { data, isLoading, isError } = useGetAllCars(filter);

  // Refs for DOM elements
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  
  // State variables
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(300); // Default in case calculation fails
  const [slideWidth, setSlideWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  // Get car data
  const cars: CarResponseDto[] = data?.content || [];
  const filteredCars = cars.filter((car) => car.isAvailable);
  
  // Check if this is the first visit to show swipe indicator
  useEffect(() => {
    const hasSeenIndicator = localStorage.getItem('hasSeenSwipeIndicator') === 'true';
    setIsFirstVisit(!hasSeenIndicator);
  }, []);
  
  // Calculate dimensions and visibility
  useEffect(() => {
    if (!filteredCars.length) return;
    
    const calculateDimensions = () => {
      if (!trackRef.current || !slideRef.current) return;
      
      // Get track dimensions
      const trackWidth = trackRef.current.clientWidth;
      
      // Get first card dimensions (if it exists)
      const cardElements = document.querySelectorAll(`.${styles.carouselItem}`);
      if (cardElements.length === 0) return;
      
      const firstCard = cardElements[0] as HTMLElement;
      const cardRect = firstCard.getBoundingClientRect();
      const cardFullWidth = firstCard.offsetWidth;
      
      // Set card width
      setCardWidth(cardFullWidth);
      
      // Detect mobile view
      const mobileBreakpoint = 768;
      const isMobileView = window.innerWidth <= mobileBreakpoint;
      setIsMobile(isMobileView);
      
      // Calculate how many cards can be fully visible
      const visibleCount = Math.floor(trackWidth / cardFullWidth);
      setVisibleCards(Math.max(1, visibleCount));
      
      // Set slide width (total width of all cards)
      setSlideWidth(cardFullWidth * filteredCars.length);
    };
    
    // Run calculation after render
    setTimeout(calculateDimensions, 100);
    
    // Add resize listener
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [filteredCars]);
  
  // Slide to a specific index
  const slideTo = (index: number) => {
    if (!slideRef.current) return;
    
    // Ensure index is within bounds
    const maxIndex = Math.max(0, filteredCars.length - visibleCards);
    const safeIndex = Math.min(Math.max(0, index), maxIndex);
    
    setActiveIndex(safeIndex);
    
    // Calculate transform position
    if (isMobile) {
      // For mobile: center the current card
      const trackWidth = trackRef.current?.clientWidth || 0;
      const centerOffset = (trackWidth - cardWidth) / 2;
      const translateX = -(safeIndex * cardWidth) + centerOffset;
      
      slideRef.current.style.transform = `translateX(${translateX}px)`;
    } else {
      // For desktop: normal sliding
      slideRef.current.style.transform = `translateX(${-(safeIndex * cardWidth)}px)`;
    }
  };
  
  // Navigate to next/previous cards
  const goToNext = () => {
    const moveBy = isMobile ? 1 : Math.max(1, visibleCards - 1);
    slideTo(activeIndex + moveBy);
  };
  
  const goToPrev = () => {
    const moveBy = isMobile ? 1 : Math.max(1, visibleCards - 1);
    slideTo(activeIndex - moveBy);
  };
  
  // Check if navigation is possible
  const canGoNext = activeIndex < filteredCars.length - (isMobile ? 1 : visibleCards);
  const canGoPrev = activeIndex > 0;
  
  // Touch gesture handling with enhanced swiping
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchY, setTouchY] = useState(0); // Track vertical movement to distinguish scrolling from swiping
  const [isDragging, setIsDragging] = useState(false);
  const [swipeVelocity, setSwipeVelocity] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    // Record both position and time for velocity calculation
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
    setTouchY(e.touches[0].clientY);
    setLastTouchTime(Date.now());
    setIsDragging(true);
    setSwipeDirection(null);
    
    // Add grab cursor for better UX
    if (slideRef.current) {
      slideRef.current.style.cursor = 'grabbing';
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !slideRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaY = Math.abs(currentY - touchY);
    const deltaX = Math.abs(currentX - touchEnd);
    
    // If vertical movement is significantly more than horizontal, it's likely a scroll
    if (deltaY > deltaX * 1.5 && deltaY > 10) {
      // Let the page scroll naturally
      handleTouchEnd();
      return;
    }
    
    setTouchEnd(currentX);
    
    // Calculate current swipe direction
    if (currentX < touchEnd) {
      setSwipeDirection('left');
    } else if (currentX > touchEnd) {
      setSwipeDirection('right');
    }
    
    // Calculate velocity (pixels per ms)
    const now = Date.now();
    const elapsed = now - lastTouchTime;
    if (elapsed > 0) {
      const instantVelocity = (currentX - touchEnd) / elapsed;
      // Smooth velocity with previous value for better UX
      setSwipeVelocity(prev => prev * 0.7 + instantVelocity * 0.3);
      setLastTouchTime(now);
    }
    
    // Calculate drag distance
    const delta = touchStart - currentX;
    const basePosition = isMobile 
      ? -(activeIndex * cardWidth) + ((trackRef.current?.clientWidth || 0) - cardWidth) / 2
      : -(activeIndex * cardWidth);
    
    // Add resistance at edges for better feel
    let adjustedDelta = delta;
    if ((activeIndex === 0 && delta < 0) || 
        (activeIndex >= filteredCars.length - (isMobile ? 1 : visibleCards) && delta > 0)) {
      // Progressive resistance: the further you pull, the stronger the resistance
      adjustedDelta = delta * (0.5 - 0.2 * (Math.min(Math.abs(delta), 150) / 150));
    }
    
    // Apply transform directly during drag with non-linear response for natural feel
    slideRef.current.style.transition = 'none';
    slideRef.current.style.transform = `translateX(${basePosition - adjustedDelta}px)`;
    
    // Prevent page scrolling during horizontal swipe
    e.preventDefault();
  };
  
  const handleTouchEnd = () => {
    if (!isDragging || !slideRef.current) return;
    
    setIsDragging(false);
    
    // Reset cursor
    if (slideRef.current) {
      slideRef.current.style.cursor = '';
    }
    
    // Restore transition with velocity-based timing for more natural feel
    const velocity = Math.abs(swipeVelocity);
    const transitionSpeed = Math.max(0.3, Math.min(0.5, 0.5 - velocity * 0.2));
    slideRef.current.style.transition = `transform ${transitionSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    
    // Calculate if swipe was decisive
    const delta = touchStart - touchEnd;
    
    // Dynamic threshold based on card width and velocity
    // Fast swipes need less distance to trigger
    const baseThreshold = cardWidth * 0.2;
    const velocityFactor = Math.abs(swipeVelocity) * 300; // Convert to pixels
    const threshold = Math.max(20, baseThreshold - velocityFactor);
    
    if (Math.abs(delta) > threshold || Math.abs(swipeVelocity) > 0.5) {
      if ((delta > 0 || swipeDirection === 'left') && canGoNext) {
        goToNext();
      } else if ((delta < 0 || swipeDirection === 'right') && canGoPrev) {
        goToPrev();
      } else {
        // Snap back if can't navigate
        slideTo(activeIndex);
      }
    } else {
      // Snap back if swipe wasn't decisive
      slideTo(activeIndex);
    }
    
    // Reset velocity
    setSwipeVelocity(0);
  };
  
  // Handle mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setTouchEnd(e.clientX);
    setLastTouchTime(Date.now());
    setIsDragging(true);
    setSwipeDirection(null);
    
    // Add grab cursor
    if (slideRef.current) {
      slideRef.current.style.cursor = 'grabbing';
    }
    
    e.preventDefault();
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !slideRef.current) return;
    
    const currentX = e.clientX;
    setTouchEnd(currentX);
    
    // Calculate direction
    if (currentX < touchEnd) {
      setSwipeDirection('left');
    } else if (currentX > touchEnd) {
      setSwipeDirection('right');
    }
    
    // Calculate velocity
    const now = Date.now();
    const elapsed = now - lastTouchTime;
    if (elapsed > 0) {
      const instantVelocity = (currentX - touchEnd) / elapsed;
      setSwipeVelocity(prev => prev * 0.7 + instantVelocity * 0.3);
      setLastTouchTime(now);
    }
    
    // Calculate drag
    const delta = touchStart - currentX;
    const basePosition = isMobile 
      ? -(activeIndex * cardWidth) + ((trackRef.current?.clientWidth || 0) - cardWidth) / 2
      : -(activeIndex * cardWidth);
    
    // Add resistance
    let adjustedDelta = delta;
    if ((activeIndex === 0 && delta < 0) || 
        (activeIndex >= filteredCars.length - (isMobile ? 1 : visibleCards) && delta > 0)) {
      adjustedDelta = delta * (0.5 - 0.2 * (Math.min(Math.abs(delta), 150) / 150));
    }
    
    // Apply transform
    slideRef.current.style.transition = 'none';
    slideRef.current.style.transform = `translateX(${basePosition - adjustedDelta}px)`;
    
    e.preventDefault();
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    handleTouchEnd();
    e.preventDefault();
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) {
      handleTouchEnd();
    }
    e.preventDefault();
  };
  
  // Apply initial position after cards load
  useEffect(() => {
    if (filteredCars.length > 0 && cardWidth > 0) {
      slideTo(0);
    }
  }, [filteredCars.length, cardWidth]);
  
  // Render loading state
  if (isLoading) {
    return <div className={styles.loadingState}>Loading cars...</div>;
  }
  
  // Render error state
  if (isError) {
    return <div className={styles.errorState}>Error loading cars.</div>;
  }
  
  // Render empty state
  if (filteredCars.length === 0) {
    return <div className={styles.emptyState}>No cars available.</div>;
  }
  
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper} ref={trackRef}>
        <div className={styles.carouselTrack}>
          <div 
            className={styles.carouselSlide} 
            ref={slideRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ width: `${slideWidth}px` }}
          >
            {filteredCars.map((car, index) => (
              <div 
                key={car.id || index} 
                className={styles.carouselItem}
              >
                <CarCard 
                  car={car} 
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>
          
          {/* Show swipe indicator on first visit */}
          {isMobile && <SwipeIndicator isFirstVisit={isFirstVisit} />}
        </div>
      </div>
      
      {/* Navigation buttons */}
      {canGoPrev && (
        <button 
          className={`${styles.carouselNavButton} ${styles.prevButton}`}
          onClick={goToPrev}
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
      )}
      
      {canGoNext && (
        <button 
          className={`${styles.carouselNavButton} ${styles.nextButton}`}
          onClick={goToNext}
          aria-label="Next"
        >
          <ChevronRight />
        </button>
      )}
      
      {/* Indicators for mobile */}
      {isMobile && (
        <div className={styles.dotIndicators}>
          {filteredCars.map((_, index) => (
            <div 
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => slideTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarCarousel;