import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_WHATSAPP = '923341406111';

/**
 * Fixed bottom-right WhatsApp CTA.
 * Fades out when the site footer enters the viewport (footer has its own WhatsApp link).
 */
const FloatingWhatsApp = ({ footerSelector = 'footer.footer' }) => {
  const [hiddenByFooter, setHiddenByFooter] = useState(false);
  const location = useLocation();
  const onProductDetail = location.pathname.startsWith('/products/');

  const phone =
    (import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP).replace(
      /\D/g,
      ''
    ) || DEFAULT_WHATSAPP;
  const href = `https://wa.me/${phone}`;

  useEffect(() => {
    const footer = document.querySelector(footerSelector);
    if (!footer || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHiddenByFooter(entry.isIntersecting);
      },
      { root: null, threshold: 0.15, rootMargin: '0px' }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [footerSelector]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        'fixed z-[1100] flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg',
        'transition-all duration-300 ease-out',
        'hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2',
        'right-3 h-12 w-12 sm:right-6 sm:h-14 sm:w-14',
        onProductDetail
          ? 'bottom-[calc(6.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6'
          : 'bottom-[calc(1.15rem+env(safe-area-inset-bottom,0px))] sm:bottom-6',
        hiddenByFooter
          ? 'pointer-events-none invisible translate-y-2 opacity-0'
          : 'pointer-events-auto visible translate-y-0 opacity-100'
      )}
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
    </a>
  );
};

export default FloatingWhatsApp;
