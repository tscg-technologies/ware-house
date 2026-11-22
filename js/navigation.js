/**
 * WAREHOUSE & STORAGE SOLUTIONS
 * navigation.js — Premium Navigation & Mobile Drawer Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  // 1. Scroll-triggered solid dark navbar transition
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on page load

  // 2. Active Page Indicator detection based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });

  // 3. Mobile Navigation Menu Toggle
  if (menuToggle && mobileDrawer) {
    const toggleMenu = (openState) => {
      const isOpen = openState !== undefined ? openState : !mobileDrawer.classList.contains('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      mobileDrawer.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => {
      toggleMenu();
    });

    // Close when clicking any mobile link
    const mobileLinkItems = mobileDrawer.querySelectorAll('.mobile-link, .btn');
    mobileLinkItems.forEach(item => {
      item.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }
});
