import type { Metadata } from 'next';
import { Playfair_Display_SC, Karla } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-karla',
  display: 'swap',
});

const SITE_URL = 'https://lecocotier-dakar.com';

export const metadata: Metadata = {
  title: 'Le Cocotier — Restaurant & Plage Privée à Dakar | Cuisine Italienne et Fruits de Mer',
  description:
    "Découvrez Le Cocotier à Dakar : une expérience culinaire pieds dans l'eau. Pizzas au feu de bois, poissons frais et cocktails exotiques sur la plage à la Pointe des Almadies.",
  keywords: [
    'restaurant Dakar', 'restaurant plage Dakar', 'Le Cocotier Dakar',
    'restaurant fruits de mer Dakar', 'pizza feu de bois Dakar',
    'restaurant Pointe des Almadies', 'restaurant vue mer Dakar',
    'restaurant italien Dakar', 'thiof Dakar', 'gambas Dakar',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    locale: 'fr_SN',
    title: 'Le Cocotier — Restaurant & Plage Privée à Dakar',
    description:
      "Poissons frais du jour, pizzas au feu de bois et cocktails exotiques face à l'Atlantique. La meilleure table de la Pointe des Almadies.",
    siteName: 'Restaurant Le Cocotier',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Restaurant Le Cocotier — Vue terrasse face à l\'Atlantique, Dakar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Cocotier — Restaurant Dakar',
    description: "Cuisine italienne & fruits de mer face à l'Atlantique. Pointe des Almadies, Dakar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Le Cocotier',
  description:
    "Restaurant gastronomique face à l'Atlantique à la Pointe des Almadies. Spécialiste des poissons frais, pizzas au feu de bois et fruits de mer.",
  telephone: '+221338203331',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Route de la Pointe des Almadies',
    addressLocality: 'Dakar',
    addressRegion: 'Dakar',
    addressCountry: 'SN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.7456,
    longitude: -17.5322,
  },
  servesCuisine: ['Italienne', 'Fruits de mer', 'Méditerranéenne', 'Française'],
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '23:00',
    },
  ],
  hasMenu: 'https://lecocotier-dakar.com/#menu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${karla.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
