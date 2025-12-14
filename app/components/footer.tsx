'use client';

import { Space_Grotesk } from 'next/font/google';
import { useRouter } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const TestimonialFooter = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(path);
    }
  };

  return (
    <footer className="w-full bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Top Section - Promotional Message and Navigation */}
        <div className="relative z-10 mb-16 md:mb-20">
          {/* Promotional Message */}
          <div className="mb-12 md:mb-16">
            <p className={`text-xs md:text-sm uppercase tracking-[0.2em] mb-4 ${spaceGrotesk.className}`}>
              BUILD EXCEPTIONAL, BUILD WITH PURPOSE
            </p>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight max-w-3xl ${spaceGrotesk.className}`}>
              Discover a refined approach where innovation, expertise, and world-class development come together.
            </h2>
          </div>

          {/* Three Column Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {/* Column 1: PORTFOLIO */}
            <div>
              <h3 className={`text-sm md:text-base uppercase tracking-[0.15em] mb-6 font-semibold ${spaceGrotesk.className}`}>
                PORTFOLIO
              </h3>
              <nav className="flex flex-col gap-3 md:gap-4">
                <button
                  onClick={() => handleNavigation('#about')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  About Me
                </button>
                <button
                  onClick={() => handleNavigation('#case-study')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Case Studies
                </button>
                <button
                  onClick={() => handleNavigation('#skills')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Services
                </button>
              </nav>
            </div>

            {/* Column 2: RESOURCES */}
            <div>
              <h3 className={`text-sm md:text-base uppercase tracking-[0.15em] mb-6 font-semibold ${spaceGrotesk.className}`}>
                RESOURCES
              </h3>
              <nav className="flex flex-col gap-3 md:gap-4">
                <button
                  onClick={() => router.push('/book')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  My Book
                </button>
                <button
                  onClick={() => handleNavigation('#certifications')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Certifications
                </button>
                <button
                  onClick={() => handleNavigation('#skills')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Technical Skills
                </button>
              </nav>
            </div>

            {/* Column 3: CONNECT */}
            <div>
              <h3 className={`text-sm md:text-base uppercase tracking-[0.15em] mb-6 font-semibold ${spaceGrotesk.className}`}>
                CONNECT
              </h3>
              <nav className="flex flex-col gap-3 md:gap-4">
                <button
                  onClick={() => router.push('/contact')}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Get in Touch
                </button>
                <a
                  href="https://www.linkedin.com/in/harrshh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Social Media
                </a>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/Harsh_Resume.pdf';
                    link.download = 'Harsh_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className={`text-left text-sm md:text-base hover:opacity-70 transition-opacity ${spaceGrotesk.className}`}
                >
                  Download Resume
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Large HARSH Text - Bottom Section (Only top portion visible) */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <h1 
          className={`text-[15rem] md:text-[20rem] lg:text-[25rem] xl:text-[30rem] font-black leading-none tracking-tight text-white/10 md:text-white/20 ${spaceGrotesk.className}`}
          style={{
            transform: 'translateY(40%)',
            lineHeight: '0.8',
            letterSpacing: '-0.02em'
          }}
        >
          HARSH
        </h1>
      </div>
    </footer>
  );
};

export default TestimonialFooter;
