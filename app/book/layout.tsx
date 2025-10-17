import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The MERN Stack Alchemist by Harsh Srivastava | Official Book Page",
  description: "Official page for The MERN Stack Alchemist by Harsh Srivastava. Learn MERN with real projects, interview prep, and production best practices.",
  keywords: [
    'The MERN Stack Alchemist',
    'MERN book',
    'Harsh Srivastava book',
    'learn MERN',
    'full-stack MERN',
    'React Node MongoDB Express',
    'FAANG interview prep'
  ],
  alternates: {
    canonical: 'https://www.harshsrivastava.in/book',
  },
  openGraph: {
    type: 'book',
    url: 'https://www.harshsrivastava.in/book',
    title: 'The MERN Stack Alchemist – Official Page',
    description:
      'Master the MERN stack through real-world projects and production-ready patterns. By Harsh Srivastava.',
    images: [
      {
        url: '/1.png',
        width: 1200,
        height: 630,
        alt: 'The MERN Stack Alchemist by Harsh Srivastava',
      },
    ],
    siteName: 'Harsh Srivastava',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The MERN Stack Alchemist – Official Page',
    description:
      'Master the MERN stack through real-world projects and production-ready patterns. By Harsh Srivastava.',
    images: ['/1.png'],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'The MERN Stack Alchemist',
    alternativeHeadline: 'Master MERN to Crack FAANG',
    author: {
      '@type': 'Person',
      name: 'Harsh Srivastava',
      url: 'https://www.harshsrivastava.in',
      sameAs: [
        'https://github.com/Harrsh777',
        'https://www.linkedin.com/in/harrshh/',
        'https://twitter.com/harrshh',
      ],
      image: 'https://www.harshsrivastava.in/profile.jpg',
      jobTitle: 'AWS Certified Solutions Architect',
    },
    image: 'https://www.harshsrivastava.in/1.png',
    inLanguage: 'en',
    genre: ['Technology', 'Programming', 'Web Development'],
    keywords: [
      'MERN',
      'React',
      'Node.js',
      'MongoDB',
      'Express',
      'Full-Stack',
      'DevOps',
      'Interview Prep',
    ],
    description:
      'A practical, project-first guide to mastering the MERN stack with production best practices and interview preparation.',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0.00',
      priceCurrency: 'USD',
      url: 'https://www.harshsrivastava.in/payment',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Harsh Srivastava',
    },
    url: 'https://www.harshsrivastava.in/book',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.harshsrivastava.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Book',
        item: 'https://www.harshsrivastava.in/book',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <link rel="canonical" href="https://www.harshsrivastava.in/book" />
      </head>
      <body>{children}</body>
    </html>
  );
}


