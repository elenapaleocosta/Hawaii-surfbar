/**
 * Hawaii Surfbar - Main Application Logic
 * Interactive Dark Mode Nightlife Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Element References
  const header = document.getElementById('main-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileBottomBtns = document.querySelectorAll('.mobile-bar-btn');
  const sections = document.querySelectorAll('section[id]');
  
  // Drinks Menu Elements
  const drinksModal = document.getElementById('drinks-menu-modal');
  const closeDrinksModalBtn = document.getElementById('close-drinks-modal-btn');
  const toggleDrinksMenuBtn = document.getElementById('toggle-drinks-menu-btn');
  const drinksMenuLinks = document.querySelectorAll('a[href="#drinks"]');
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const drinkCards = document.querySelectorAll('.drink-card-item');
  const searchInput = document.getElementById('menu-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const noResultsBox = document.getElementById('no-search-results');

  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Build Lightbox array from feature images
  const featureImages = document.querySelectorAll('.feature-img[data-lightbox-src], .bar-hero-img[data-lightbox-src], .drinks-banner-img[data-lightbox-src]');
  
  let galleryData = [];
  let currentGalleryIndex = 0;

  featureImages.forEach((img) => {
    img.style.cursor = 'pointer';
    galleryData.push({
      src: img.getAttribute('data-lightbox-src') || img.getAttribute('src'),
      caption: img.getAttribute('alt') || 'Hawaii Surfbar'
    });
  });

  // --------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Header Blur Effect
  // --------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    // Update Scroll Progress Bar
    if (scrollProgress) {
      scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }

    // Toggle Header Scrolled State
    if (scrollTop > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Highlight active section in desktop navigation & mobile bottom bar
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });

      mobileBottomBtns.forEach(btn => {
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
          if (href === `#${currentSectionId}`) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer Toggle & Overlay
  // --------------------------------------------------------------------------
  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileMenu?.classList.contains('is-open');
    if (shouldOpen) {
      mobileMenu?.classList.add('is-open');
      mobileOverlay?.classList.add('is-open');
      mobileToggleBtn?.classList.add('is-active');
      mobileToggleBtn?.setAttribute('aria-expanded', 'true');
      mobileMenu?.setAttribute('aria-hidden', 'false');
      mobileOverlay?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu?.classList.remove('is-open');
      mobileOverlay?.classList.remove('is-open');
      mobileToggleBtn?.classList.remove('is-active');
      mobileToggleBtn?.setAttribute('aria-expanded', 'false');
      mobileMenu?.setAttribute('aria-hidden', 'true');
      mobileOverlay?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  mobileToggleBtn?.addEventListener('click', () => toggleMobileMenu());
  mobileOverlay?.addEventListener('click', () => toggleMobileMenu(false));

  // Close mobile drawer when link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close drawer on Outside click or Escape key
  document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('is-open') && 
        !mobileMenu.contains(e.target) && 
        !mobileToggleBtn?.contains(e.target) &&
        !mobileOverlay?.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
      toggleMobileMenu(false);
    }
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Drinks Menu Filtering, Search & Modal Overlay Tab Control
  // --------------------------------------------------------------------------
  const openDrinksMenu = () => {
    if (!drinksModal) return;
    drinksModal.classList.add('is-open');
    drinksModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (toggleDrinksMenuBtn) {
      toggleDrinksMenuBtn.setAttribute('aria-expanded', 'true');
    }
  };

  const closeDrinksMenu = () => {
    if (!drinksModal) return;
    drinksModal.classList.remove('is-open');
    drinksModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (toggleDrinksMenuBtn) {
      toggleDrinksMenuBtn.setAttribute('aria-expanded', 'false');
    }
  };

  toggleDrinksMenuBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrinksMenu();
  });

  closeDrinksModalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrinksMenu();
  });

  // Close when clicking modal backdrop overlay
  drinksModal?.addEventListener('click', (e) => {
    if (e.target === drinksModal) {
      closeDrinksMenu();
    }
  });

  // Close when pressing Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drinksModal?.classList.contains('is-open')) {
      closeDrinksMenu();
    }
  });

  // Auto-open menu modal when any 'Drinks Menu' button / nav link is clicked
  drinksMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openDrinksMenu();
    });
  });

  let activeCategory = 'all';
  let searchQuery = '';

  const filterDrinksMenu = () => {
    let visibleCount = 0;

    drinkCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const textContent = card.textContent?.toLowerCase() || '';

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !searchQuery || textContent.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        card.classList.add('fade-in-up', 'appeared');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle Empty Search State
    if (noResultsBox) {
      noResultsBox.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Tab Buttons Switch
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      filterDrinksMenu();
    });
  });

  // Real-time Search Input Filter
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    }
    filterDrinksMenu();
  });

  clearSearchBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    filterDrinksMenu();
  });

  // --------------------------------------------------------------------------
  // 5. Lightbox Modal Integration & Touch Gestures
  // --------------------------------------------------------------------------
  const openLightbox = (index) => {
    if (!lightboxModal || galleryData.length === 0) return;
    currentGalleryIndex = index;
    const item = galleryData[currentGalleryIndex];
    if (!item) return;

    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;

    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    if (galleryData.length === 0) return;
    if (direction === 'next') {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    } else {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    }
    openLightbox(currentGalleryIndex);
  };

  // Feature Image Click Handlers
  featureImages.forEach((img, idx) => {
    img.addEventListener('click', () => openLightbox(idx));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', () => navigateLightbox('next'));
  lightboxPrev?.addEventListener('click', () => navigateLightbox('prev'));

  // Close Lightbox on overlay click
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Lightbox Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  });

  // Touch Swipe Gestures for Mobile Lightbox
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  lightboxModal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightboxModal?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleLightboxSwipe();
  }, { passive: true });

  const handleLightboxSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 45;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          navigateLightbox('next');
        } else {
          navigateLightbox('prev');
        }
      }
    } else {
      if (deltaY > minSwipeDistance * 1.5) {
        closeLightbox();
      }
    }
  };

  // --------------------------------------------------------------------------
  // 6. Scroll Triggered Entrance Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const animatedElements = document.querySelectorAll('.fade-in-up, .borderless-img-card, .card-glass-body');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    animationObserver.observe(el);
  });
});
