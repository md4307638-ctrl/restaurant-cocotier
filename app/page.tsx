'use client';

import { useState, useRef, useCallback } from 'react';
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import {
  MapPin, Phone, Star, ArrowRight, ArrowLeft,
  Fish, Menu, X,
} from 'lucide-react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  jungle:    '#0D2B1D',
  jungleMid: '#1A4A2E',
  gold:      '#C9A84C',
  goldLight: '#E0C06A',
  cream:     '#FAFAF5',
  warmBg:    '#F4EFE6',
  text:      '#1A1A1A',
  muted:     '#6B7260',
  white:     '#FFFFFF',
  footerBg:  '#090F0C',
  fresh:     '#16A34A',
};

const SERIF: React.CSSProperties = { fontFamily: "var(--font-playfair,'Playfair Display SC',serif)" };
const SANS:  React.CSSProperties = { fontFamily: "var(--font-karla,'Karla',sans-serif)" };

// ─── View type ────────────────────────────────────────────────────────────────
type View = 'landing' | 'menu' | 'reservation' | 'apropos' | 'experience';

// ─── Menu data ────────────────────────────────────────────────────────────────
type MenuItem = { id: number; name: string; desc: string; price: string; img: string; tag?: string; fresh?: boolean };

type DrinkItem = { name: string; price: string; tag?: string };
type DrinkSub  = { title: string; items: DrinkItem[] };

type MenuSection = {
  id: string;
  title: string;
  subtitle: string;
  items: MenuItem[];
  supplements?: string[];
  subcategories?: DrinkSub[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'entrees',
    title: 'Entrées',
    subtitle: 'Froides & Chaudes',
    items: [
      { id: 1,  name: 'Salade Niçoise',              desc: "Thon, œufs, olives, haricots verts, tomates, anchois, vinaigrette maison",         price: '5 000 FCFA',  img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80' },
      { id: 2,  name: 'Salade Océane',               desc: "Crevettes pochées, avocat, mangue fraîche, vinaigrette citronnée",                  price: '6 000 FCFA',  img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', fresh: true },
      { id: 3,  name: 'Salade Caprese',              desc: "Mozzarella di bufala, tomates cœur de bœuf, basilic, huile d'olive extra vierge",   price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80' },
      { id: 4,  name: 'Poulpe aux Pommes de Terre',  desc: "Poulpe fondant, pommes de terre, paprika fumé, herbes fraîches",                    price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80', fresh: true },
      { id: 5,  name: 'Hommos',                      desc: "Purée de pois chiches maison, tahini, huile d'olive, paprika, pain pita",           price: '5 000 FCFA',  img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80' },
      { id: 6,  name: 'Salade Libanaise',            desc: "Taboulé maison, persil, menthe, tomates, concombre, jus de citron",                 price: '5 000 FCFA',  img: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80' },
      { id: 7,  name: 'Poke Bowl Saumon',            desc: "Saumon mariné, riz vinaigré, avocat, edamame, graines de sésame",                   price: '7 500 FCFA',  img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', fresh: true },
      { id: 8,  name: "Parmesan d'Aubergine",        desc: "Aubergines gratinées, sauce tomate, parmesan, mozzarella, basilic",                  price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=800&q=80' },
      { id: 9,  name: 'Poulpe Diabola',              desc: "Poulpe grillé, sauce épicée diabola, poivrons, herbes du jardin",                   price: '9 000 FCFA',  img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80', fresh: true, tag: 'Signature' },
      { id: 10, name: 'Croustillant de Chèvre Chaud',desc: "Chèvre fondu sur toast, miel de fleurs, noix, mesclun, vinaigrette balsamique",     price: '6 500 FCFA',  img: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=800&q=80' },
      { id: 11, name: 'Soupe du Jour',               desc: "Préparée selon le marché du matin — demandez au serveur",                           price: '4 000 FCFA',  img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', fresh: true },
    ],
  },
  {
    id: 'mer',
    title: 'Poissons et Crustacés',
    subtitle: 'Poissons & Crustacés — Pêche du jour',
    items: [
      { id: 30, name: 'Marmite du Pêcheur',                desc: 'Poissons du jour, légumes de saison, bouillon maison parfumé',                  price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80', fresh: true },
      { id: 31, name: 'Brochette de Gambas Grillées',      desc: 'Grosses crevettes marinées aux herbes, grillées, beurre ail-persil',             price: '10 500 FCFA', img: 'https://images.unsplash.com/photo-1565680018093-ebb6b9dea6e7?w=600&q=80', fresh: true },
      { id: 32, name: 'Brochette de Lotte',                desc: 'Lotte marinée aux herbes de Provence, grillée sur brochette, citron',            price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', fresh: true },
      { id: 33, name: "Crevettes Sautées à l'Ail",         desc: 'Crevettes fraîches, beurre aillé, persil haché, citron vert pressé',             price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1606851091851-e8c8c71b6b0d?w=800&q=80', fresh: true },
      { id: 34, name: 'Calamars Frits',                    desc: 'Calamars frais, panure légère croustillante, sauce tartare maison',              price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600&q=80', fresh: true },
      { id: 35, name: 'Thiof Braisé',                      desc: 'Thiof entier braisé, sauce tomate-oignon fondante, riz ou frites',               price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80', tag: 'Signature', fresh: true },
      { id: 36, name: 'Assiette de Brochettes Terre et Mer',desc: 'Brochettes mixtes viande et fruits de mer, sauce béarnaise ou diabola',         price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80' },
      { id: 37, name: 'Roulades de Soles aux Gambas',      desc: 'Filets de sole farcis aux gambas, sauce crème citronnée, légumes vapeur',        price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1485921325833-c519793a4f53?w=800&q=80', fresh: true, tag: 'Chef' },
      { id: 38, name: 'Daurade Grillée',                   desc: 'Daurade entière grillée, herbes de Provence, huile d\u2019olive, citron',        price: '9 000 FCFA',  img: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80', fresh: true },
      { id: 39, name: 'Sole Meunière',                     desc: 'Sole fraîche, beurre noisette, câpres, persil ciselé, citron',                   price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=800&q=80', fresh: true },
      { id: 40, name: 'Assiette de Gambas Flambées',       desc: 'Gambas royales flambées au cognac, sauce américaine maison',                     price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1548940740-204726a19be3?w=800&q=80', fresh: true, tag: 'Premium' },
      { id: 41, name: 'Brochette Océane',                  desc: 'Lotte, calamar, gambas — marinade citronnée aux herbes, grillée',                price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', fresh: true },
      { id: 42, name: 'Filet de Thiof à la Légurée',       desc: 'Filet de thiof, sauce légumière maison, légumes frais du marché',                price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80', fresh: true },
      { id: 43, name: 'Mix de la Mer à la Plancha',        desc: 'Calamar, poulpe, gambas — cuits à la plancha, sauce au choix',                   price: '15 000 FCFA', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80', tag: "Chef's Choice", fresh: true },
    ],
    supplements: [
      'Supplément Garniture (Riz, frites maison, pommes de terre sautées, légumes sautés, attiéké, alloco, ignames frites, salade, tomates, gratin dauphinois) : 2 000 FCFA',
      'Supplément Sauce (Sauce diable, poivre vert, champignon des bois, roquefort, sauce verte, sauce oignon) : 1 000 FCFA',
    ],
  },
  {
    id: 'pates',
    title: 'Les Pâtes',
    subtitle: "Fraîches, maison, cuisinées à la minute",
    items: [
      { id: 70, name: 'Spaghetti pomodoro e basilico fresco', desc: 'Spaghetti, sauce tomate fraîche, basilic du jardin',                              price: '5 000 FCFA',  img: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=800&q=80' },
      { id: 71, name: 'Spaghetti bolognese',                  desc: 'Ragù de bœuf mijoté, sauce tomate, parmesan',                                    price: '6 000 FCFA',  img: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800&q=80' },
      { id: 72, name: 'Spaghetti alla carbonara',             desc: 'Guanciale, œuf, pecorino, poivre noir — recette romaine',                         price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80' },
      { id: 73, name: 'Pennette salmone',                     desc: 'Saumon fumé, crème légère, aneth, citron',                                        price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80' },
      { id: 74, name: "Pennette all'arrabiata",               desc: 'Sauce tomate épicée, ail, piment de Cayenne, basilic',                            price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80' },
      { id: 75, name: 'Spaghetti alla vongole locali',        desc: 'Palourdes locales fraîches, ail, vin blanc, persil',                              price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1551183053-bf91798d9dc8?w=800&q=80', fresh: true },
      { id: 76, name: 'Spaghetti alla bottarga di muggine',   desc: 'Bottarga de mulet râpée, huile d’olive, ail, persil',                        price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&q=80' },
      { id: 77, name: 'Gnocchetti malloreddus alla sarda',    desc: 'Gnocchetti sardes, sauce saucisse et safran, pecorino',                           price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1473093226555-0b893a8bfb96?w=800&q=80' },
      { id: 78, name: 'Linguine gamberi e pesto',             desc: 'Crevettes fraîches, pesto génois maison, pignons de pin',                         price: '9 000 FCFA',  img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80', fresh: true },
      { id: 79, name: 'Tagliatelle ai funghi porcini',        desc: 'Champignons porcini, beurre, ail, thym, crème légère',                            price: '9 000 FCFA',  img: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=800&q=80' },
      { id: 80, name: 'Tagliatelle ai granchi',               desc: 'Crabes frais, tomate fraîche, ail, vin blanc, persil',                            price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80', fresh: true },
      { id: 81, name: 'Linguine ai frutti di mare',           desc: 'Fruits de mer variés, sauce tomate ou crème, herbes fraîches',                    price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', fresh: true },
      { id: 82, name: 'Linguine vongole et bottarga',         desc: 'Palourdes locales, bottarga de mulet, huile d’olive, ail',                   price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=800&q=80', fresh: true },
      { id: 83, name: 'Ravioli au poisson sauce crevettes',   desc: 'Ravioli farcis de poisson frais, sauce bisque de crevettes',                      price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80', fresh: true, tag: 'Chef' },
      { id: 84, name: 'Ravioli ricotta tomate ou beurre sauge',desc: 'Ravioli di ricotta, sauce tomate fraîche ou beurre et sauge',                    price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80' },
      { id: 85, name: 'Risotto aux fruits de mer',            desc: 'Risotto crémeux, fruits de mer du jour — minimum 2 personnes',                    price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80', fresh: true, tag: '2 pers.' },
    ],
  },
  {
    id: 'pizzas',
    title: 'Les Pizzas',
    subtitle: 'Cuites au four à bois, pâte maison',
    items: [
      { id: 90, name: 'Romana',     desc: 's. tomate, mozza, anchois',                                            price: '4 500 / 6 500 FCFA', img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&q=80' },
      { id: 91, name: 'Napoli',     desc: 's. tomate, mozza, câpres, anchois',                                    price: '4 500 / 6 500 FCFA', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 92, name: 'Margherita', desc: 's. tomate, mozzarella',                                                price: '5 000 / 7 000 FCFA', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80' },
      { id: 93, name: 'Veneziana',  desc: 's. tomate, mozza, jambon',                                             price: '5 000 / 7 500 FCFA', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80' },
      { id: 94, name: 'Ortolana',   desc: 'mozza, aubergine, courgette, poivron',                                 price: '5 000 / 6 500 FCFA', img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80' },
      { id: 95, name: 'Reine',      desc: 's. tomate, mozza, jambon, champignon, olive',                          price: '5 500 / 7 500 FCFA', img: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=800&q=80' },
      { id: 96, name: 'Cardinale',  desc: 's. tomate, mozza, jambon',                                             price: '5 500 / 7 500 FCFA', img: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80' },
      { id: 97, name: '4 Stagioni', desc: 's. tomate, mozza, jambon, champignon, olive, artichaut',               price: '5 500 / 7 500 FCFA', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80' },
      { id: 98, name: 'Primavera',  desc: 's. tomate, mozza, tomate cerise, basilic',                             price: '5 500 / 7 000 FCFA', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80' },
      { id: 99, name: 'Vege',       desc: 's. tomate, courgette, carotte, oignon, poivron, emmental',             price: '5 500 / 8 000 FCFA', img: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&q=80' },
      { id: 100, name: 'Completa',  desc: 's. tomate, mozza, un peu de tout',                                     price: '6 000 / 8 000 FCFA', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80' },
      { id: 101, name: 'Marina',    desc: 's. tomate, ail, origan',                                               price: '7 000 FCFA',         img: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=800&q=80' },
      { id: 102, name: 'Sarda',     desc: 's. tomate, mozza, saucisson, olive',                                   price: '7 000 / 8 500 FCFA', img: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&q=80' },
      { id: 103, name: '4 Formaggi',desc: 'mozza, gorgonzola, emmental, fontina',                                 price: '7 000 / 9 000 FCFA', img: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=800&q=80' },
      { id: 104, name: 'Boscaiola', desc: 's. tomate, mozza, champignons cèpes',                                  price: '7 000 / 8 500 FCFA', img: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80' },
    ],
  },
  {
    id: 'viande',
    title: 'Viandes et Volailles',
    subtitle: 'Grillées à la perfection, au feu de bois',
    items: [
      { id: 50, name: 'Filet de Bœuf Gorgonzola et Noix',           desc: "Filet grillé, sauce gorgonzola crémeuse, cerneaux de noix torréfiés",          price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80', tag: 'Premium' },
      { id: 51, name: 'Filet de Bœuf au Poivre Vert',               desc: "Filet de bœuf tendre, sauce poivre vert flambée, frites maison",               price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80' },
      { id: 52, name: 'Taillade de Bœuf',                           desc: "Fines tranches de bœuf marinées aux herbes, grillées à la plancha",             price: '10 000 FCFA', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
      { id: 53, name: 'Filet Brésilien',                            desc: "Filet de bœuf brésilien d’exception, sauce au choix, garniture",           price: '15 000 FCFA', img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', tag: 'Brésil' },
      { id: 54, name: 'Entrecôte du Brésil',                        desc: "Entrecôte persillée du Brésil, grillée, jus de viande réduit",                  price: '15 000 FCFA', img: 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=800&q=80', tag: 'Brésil' },
      { id: 55, name: 'Brochette Taouk',                            desc: "Brochettes de poulet mariné au yaourt, épices orientales, sauce blanche",        price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80' },
      { id: 56, name: 'Wok Bœuf ou Poulet',                         desc: "Émincé sauté au wok, légumes croquants, sauce soja-gingembre, riz basmati",     price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80' },
      { id: 57, name: "Côtelette d'Agneau du Brésil aux Herbes",    desc: "Côtelettes d’agneau brésilien, herbes fines, ail confit, pommes sarladaises", price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', tag: 'Brésil' },
      { id: 58, name: 'Brochette de Bœuf',                          desc: "Brochettes de bœuf mariné, oignons, poivrons grillés, sauce chimichurri",       price: '8 000 FCFA',  img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
      { id: 59, name: 'Poulet Entier',                               desc: "Poulet entier rôti aux herbes de Provence, jus de cuisson, frites ou riz",      price: '9 000 FCFA',  img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=800&q=80' },
      { id: 60, name: 'Demi-Poulet Sauce Diable',                    desc: "Demi-poulet grillé, sauce diable épicée maison, frites dorées",                 price: '7 000 FCFA',  img: 'https://images.unsplash.com/photo-1585325701956-60dd9c8b3c38?w=800&q=80' },
    ],
    supplements: [
      'Supplément Garniture (Riz, frites maison, pommes de terre sautées, légumes sautés, attiéké, alloco, ignames frites, salade, tomates, gratin dauphinois) : 2 000 FCFA',
      'Supplément Sauce (Sauce diable, poivre vert, champignon des bois, roquefort, sauce verte, sauce oignon) : 1 000 FCFA',
    ],
  },
  {
    id: 'boissons',
    title: 'Boissons',
    subtitle: "Softs, cocktails, spiritueux & vins",
    items: [],
    subcategories: [
      {
        title: "Softs, Jus & Eaux",
        items: [
          { name: "Eau plate 50 cl",               price: "1 500 FCFA" },
          { name: "Eau pétillante 50 cl",           price: "1 500 FCFA" },
          { name: "Coca-Cola / Fanta / Sprite",     price: "1 500 FCFA" },
          { name: "Jus Bissap",                     price: "1 500 FCFA", tag: "Local" },
          { name: "Jus Bouye",                      price: "1 500 FCFA", tag: "Local" },
          { name: "Jus Ditakh",                     price: "1 500 FCFA", tag: "Local" },
          { name: "Jus de Fruit (orange, ananas…)", price: "2 500 FCFA" },
          { name: "Eau minérale 1,5 L",             price: "3 000 FCFA" },
        ],
      },
      {
        title: "Bières",
        items: [
          { name: "Flag (33 cl)",                   price: "1 500 FCFA", tag: "Local" },
          { name: "Gazelle (33 cl)",                price: "1 500 FCFA", tag: "Local" },
          { name: "Castel (33 cl)",                 price: "2 000 FCFA" },
          { name: "Heineken (33 cl)",               price: "3 000 FCFA" },
        ],
      },
      {
        title: "Cocktails Sans & Avec Alcool",
        items: [
          { name: "Mojito Virgin",                  price: "4 000 FCFA" },
          { name: "Pina Colada Virgin",             price: "4 000 FCFA" },
          { name: "Jus de Bissap Pétillant",        price: "4 000 FCFA", tag: "Local" },
          { name: "Citronnade à la Menthe",         price: "4 000 FCFA" },
          { name: "Ginger Lemonade",                price: "4 000 FCFA" },
          { name: "Smoothie Tropical",              price: "4 000 FCFA" },
          { name: "Mojito",                         price: "5 000 FCFA" },
          { name: "Daiquiri Fraise",                price: "5 000 FCFA" },
          { name: "Sex on the Beach",               price: "5 000 FCFA" },
          { name: "Tequila Sunrise",                price: "5 000 FCFA" },
          { name: "Pina Colada",                    price: "5 000 FCFA" },
          { name: "Blue Lagoon",                    price: "5 000 FCFA" },
          { name: "Aperol Spritz",                  price: "6 000 FCFA" },
          { name: "Long Island Iced Tea",           price: "6 000 FCFA" },
          { name: "Margarita",                      price: "6 000 FCFA" },
          { name: "Negroni",                        price: "6 000 FCFA" },
          { name: "Moscow Mule",                    price: "6 000 FCFA" },
          { name: "Old Fashioned",                  price: "6 000 FCFA" },
          { name: "Cosmopolitan",                   price: "6 000 FCFA" },
          { name: "Gin Tonic",                      price: "6 000 FCFA" },
          { name: "Le Cocotier (rhum, coco, citron vert)", price: "8 000 FCFA", tag: "Signature" },
        ],
      },
      {
        title: "Spiritueux, Apéritifs & Rhums",
        items: [
          { name: "Pastis 51 / Ricard",             price: "3 000 FCFA" },
          { name: "Campari",                        price: "3 000 FCFA" },
          { name: "Martini Blanc / Rouge",          price: "3 000 FCFA" },
          { name: "Porto",                          price: "3 000 FCFA" },
          { name: "Rhum Clément VSOP",              price: "4 000 FCFA" },
          { name: "Rhum J.M. Blanc",               price: "4 000 FCFA" },
          { name: "Vodka Absolut",                  price: "4 000 FCFA" },
          { name: "Gin Hendrick's",                 price: "5 000 FCFA" },
          { name: "Cointreau",                      price: "5 000 FCFA" },
          { name: "Rhum Zacapa 23",                 price: "5 000 FCFA" },
          { name: "Tequila Patron Silver",          price: "5 000 FCFA" },
          { name: "Amaretto Disaronno",             price: "5 000 FCFA" },
          { name: "Baileys",                        price: "5 000 FCFA" },
          { name: "Cognac Hennessy VS",             price: "6 000 FCFA" },
          { name: "Rum Diplomatico Reserva",        price: "6 000 FCFA" },
          { name: "Whisky Jack Daniel's",           price: "6 000 FCFA" },
          { name: "Whisky Jameson",                 price: "6 000 FCFA" },
          { name: "Whisky Chivas 12 ans",           price: "8 000 FCFA" },
          { name: "Cognac Hennessy VSOP",           price: "8 000 FCFA" },
          { name: "Tequila Don Julio",              price: "8 000 FCFA" },
          { name: "Whisky Johnnie Walker Black",    price: "8 000 FCFA" },
          { name: "Cognac Hennessy XO",             price: "12 000 FCFA", tag: "Prestige" },
        ],
      },
      {
        title: "Vins & Champagnes",
        items: [
          { name: "Vin Rouge (verre)",              price: "4 000 FCFA" },
          { name: "Vin Blanc (verre)",              price: "4 000 FCFA" },
          { name: "Vin Rosé (verre)",               price: "4 000 FCFA" },
          { name: "Bouteille Vin (sélection maison)", price: "20 000 FCFA" },
          { name: "Champagne Moët & Chandon (75 cl)", price: "45 000 FCFA", tag: "Prestige" },
          { name: "Champagne Laurent-Perrier Rosé (75 cl)", price: "70 000 FCFA", tag: "Prestige" },
        ],
      },
      {
        title: "Caféterie",
        items: [
          { name: "Café Espresso",                  price: "1 500 FCFA" },
          { name: "Café Allongé / Americano",       price: "1 500 FCFA" },
          { name: "Thé (menthe, citron, nature)",   price: "1 500 FCFA" },
          { name: "Cappuccino",                     price: "2 500 FCFA" },
          { name: "Café Latte",                     price: "4 500 FCFA" },
        ],
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    subtitle: "Pour finir en douceur",
    items: [],
    subcategories: [
      {
        title: "Nos Desserts",
        items: [
          { name: "Salade de Fruits",                        price: "3 000 FCFA" },
          { name: "Crêpe Nutella",                           price: "4 000 FCFA" },
          { name: "Crêpe Nutella Banane",                    price: "4 000 FCFA" },
          { name: "Panacotta Framboise (Mangue ou Fraise)",  price: "4 000 FCFA" },
          { name: "Chocolat Liégeois",                       price: "4 000 FCFA" },
          { name: "Fondant au Chocolat",                     price: "5 000 FCFA" },
          { name: "Tiramisu à l'italienne",                  price: "5 000 FCFA" },
          { name: "Mousse au Chocolat",                      price: "6 000 FCFA" },
          { name: "Harris Coffee",                           price: "6 000 FCFA" },
          { name: "Banana Split",                            price: "6 000 FCFA" },
        ],
      },
    ],
  },
];

// ─── Testimonials data ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Neske Beks',
    role: 'Cliente fidèle',
    quote: "La meilleure table des Almadies, sans hésitation. Le Thiof braisé était d'une fraîcheur absolue, la terrasse face à l'Atlantique est tout simplement magique.",
    stars: 5,
  },
  {
    name: 'Nomad USA',
    role: 'Voyageur américain',
    quote: "Unforgettable dinner by the ocean. The seafood mix was extraordinary and the staff incredibly welcoming. A true gem of Dakar.",
    stars: 5,
  },
  {
    name: 'Marion J.',
    role: 'Blogueuse gastronomique',
    quote: "Une soirée parfaite. Cocktail Cocotier en apéritif, Gambas en plat — j'y retourne dès que je reviens à Dakar. Une adresse qui ne se partage pas facilement !",
    stars: 5,
  },
];

// ─── i18n ─────────────────────────────────────────────────────────────────────
type Lang = 'fr' | 'en';

const UI = {
  fr: {
    nav: { apropos: 'À Propos', lacarte: 'La Carte', experience: 'Expérience', reserver: 'Réserver' },
    hero: { cta1: 'Voir la Carte', cta2: 'Réserver une Table', badge: 'Poissons frais du jour', h1: ["L'Art de", 'Savourer', "l'Océan"] },
    menu: { back: 'Retour', header: 'La Carte', supplements: 'Suppléments disponibles' },
    apropos: {
      tag: 'Notre Histoire', h1: 'Aux Portes de', h2: "l'Atlantique",
      p1: "Depuis plus de 20 ans, Le Cocotier est un repère de saveurs à la Pointe des Almadies — l'endroit le plus occidental de l'Afrique continentale, là où la terre sénégalaise touche définitivement l'Atlantique.",
      p2: "Fondé avec la conviction que la mer offre les meilleurs produits qui soient, notre restaurant s'est construit sur une règle simple : rien n'arrive dans vos assiettes sans être passé par la criée du matin.",
      p3: "Ici, on ne sert pas de cartes figées. On cuisine ce que la mer donne, ce que le maraîcher livre, ce que l'artisan prépare avec soin. Chaque plat est une histoire de fraîcheur, d'honnêteté et de générosité.",
      p4: "La terrasse face à l'Atlantique, le son des vagues en toile de fond, la lumière dorée du couchant — voilà notre décor. Le reste, c'est votre appétit qui le raconte.",
      imgCaption: 'Terrasse · Pointe des Almadies',
      findUs: 'Nous trouver', addr: 'Route de la Pointe des Almadies, Dakar',
      pills: ['Ouvert 7j/7', 'Vue Atlantique', 'Terrasse & Salle', 'Poissons du jour'],
    },
    experience: {
      tag: 'Témoignages', h1: "Ce Qu'ils Vivent", h2: 'au Cocotier',
      roles: ['Cliente fidèle', 'Voyageur américain', 'Blogueuse gastronomique'],
    },
    reservation: {
      tag: "Table d'Exception", h: 'Réservez Votre Table', sub: 'Terrasse vue mer · Pointe des Almadies · 33 820 33 31',
      firstName: 'Prénom *', lastName: 'Nom *', email: 'Email *', phone: 'Téléphone *',
      date: 'Date *', time: 'Heure *', guests: 'Nombre de personnes *',
      guestsPh: 'Sélectionner', guestUnit: (n: number) => `${n} personne${n > 1 ? 's' : ''}`,
      message: 'Message (optionnel)', messagePh: 'Occasion spéciale, allergies, demande particulière...',
      submit: 'Confirmer la Réservation →', callUs: 'Ou appelez-nous directement · ',
      okTitle: 'Merci !', okMsg: 'Votre demande de réservation a bien été envoyée.\nNous vous confirmons votre table dans les plus brefs délais.',
      backBtn: "Retour à l'accueil",
    },
  },
  en: {
    nav: { apropos: 'About', lacarte: 'Menu', experience: 'Experience', reserver: 'Book' },
    hero: { cta1: 'View the Menu', cta2: 'Book a Table', badge: 'Fresh fish daily', h1: ['The Art of', 'Savoring', 'the Ocean'] },
    menu: { back: 'Back', header: 'The Menu', supplements: 'Extras & Sides' },
    apropos: {
      tag: 'Our Story', h1: 'At the Gates of', h2: 'the Atlantic',
      p1: "For over 20 years, Le Cocotier has been a haven of flavors at the Pointe des Almadies — the westernmost point of continental Africa, where Senegalese land finally meets the Atlantic.",
      p2: "Founded on the conviction that the sea offers the finest produce, our restaurant is built on a simple rule: nothing reaches your plate without first passing through the morning fish market.",
      p3: "We don't serve fixed menus here. We cook what the sea gives, what the farmer brings, what the craftsman carefully prepares. Every dish is a story of freshness, honesty, and generosity.",
      p4: "The terrace facing the Atlantic, the sound of waves as a backdrop, the golden light of dusk — that's our setting. The rest, your appetite will tell.",
      imgCaption: 'Terrace · Pointe des Almadies',
      findUs: 'Find Us', addr: 'Route de la Pointe des Almadies, Dakar',
      pills: ['Open 7 days', 'Ocean View', 'Terrace & Dining', 'Fresh Fish Daily'],
    },
    experience: {
      tag: 'Testimonials', h1: 'What They Experience', h2: 'at Le Cocotier',
      roles: ['Regular Guest', 'American Traveler', 'Food Blogger'],
    },
    reservation: {
      tag: 'Exceptional Table', h: 'Book Your Table', sub: 'Ocean-view terrace · Pointe des Almadies · 33 820 33 31',
      firstName: 'First Name *', lastName: 'Last Name *', email: 'Email *', phone: 'Phone *',
      date: 'Date *', time: 'Time *', guests: 'Number of guests *',
      guestsPh: 'Select', guestUnit: (n: number) => `${n} ${n > 1 ? 'people' : 'person'}`,
      message: 'Message (optional)', messagePh: 'Special occasion, allergies, special request...',
      submit: 'Confirm Reservation →', callUs: 'Or call us directly · ',
      okTitle: 'Thank you!', okMsg: 'Your reservation request has been received.\nWe will confirm your table as soon as possible.',
      backBtn: 'Back to Home',
    },
  },
} as const;

const SECTION_EN: Record<string, { title: string; subtitle: string }> = {
  entrees: { title: 'Starters',        subtitle: 'Cold & Hot Starters' },
  mer:     { title: 'Fish & Seafood',  subtitle: 'Fish & Seafood — Fresh daily catch' },
  pates:   { title: 'Pasta',           subtitle: 'Fresh, homemade, cooked to order' },
  pizzas:  { title: 'Pizzas',          subtitle: 'Wood-fired oven, homemade dough' },
  viande:  { title: 'Meat & Poultry', subtitle: 'Grilled to perfection, wood-fired' },
  boissons:{ title: 'Drinks',          subtitle: 'Soft drinks, cocktails, spirits & wines' },
  desserts:{ title: 'Desserts',        subtitle: 'The perfect ending' },
};

const SUBCATS_EN: Record<string, string> = {
  'Softs, Jus & Eaux':            'Soft Drinks, Juices & Water',
  'Bières':                       'Beers',
  'Cocktails Sans & Avec Alcool': 'Cocktails With & Without Alcohol',
  'Spiritueux, Apéritifs & Rhums':'Spirits, Aperitifs & Rums',
  'Vins & Champagnes':            'Wines & Champagne',
  'Caféterie':                    'Coffee & Tea',
  'Nos Desserts':                 'Our Desserts',
};

const SUPPS_EN: Record<string, string> = {
  'Supplément Garniture': 'Side Garnish',
  'Supplément Sauce':     'Sauce Extra',
};

const DRINK_EN: Record<string, string> = {
  'Salade de Fruits':                        'Fruit Salad',
  'Crêpe Nutella':                           'Nutella Crêpe',
  'Crêpe Nutella Banane':                    'Nutella Banana Crêpe',
  'Panacotta Framboise (Mangue ou Fraise)':  'Raspberry Panna Cotta (Mango or Strawberry)',
  'Chocolat Liégeois':                       'Chocolate Liégeois',
  'Fondant au Chocolat':                     'Chocolate Lava Cake',
  "Tiramisu à l'italienne":                  "Tiramisu all'italiana",
  'Mousse au Chocolat':                      'Chocolate Mousse',
};

const ITEMS_EN: Record<number, { name: string; desc: string }> = {
  // Entrées
  1:  { name: 'Niçoise Salad',             desc: 'Tuna, eggs, olives, green beans, tomatoes, anchovies, house vinaigrette' },
  2:  { name: 'Ocean Salad',               desc: 'Poached shrimp, avocado, fresh mango, lemon vinaigrette' },
  3:  { name: 'Caprese Salad',             desc: 'Buffalo mozzarella, beef heart tomatoes, basil, extra virgin olive oil' },
  4:  { name: 'Octopus & Potatoes',        desc: 'Tender octopus, potatoes, smoked paprika, fresh herbs' },
  5:  { name: 'Hummus',                    desc: 'Homemade chickpea purée, tahini, olive oil, paprika, pita bread' },
  6:  { name: 'Lebanese Salad',            desc: 'Homemade tabbouleh, parsley, mint, tomatoes, cucumber, lemon juice' },
  7:  { name: 'Salmon Poke Bowl',          desc: 'Marinated salmon, seasoned rice, avocado, edamame, sesame seeds' },
  8:  { name: 'Eggplant Parmigiana',       desc: 'Gratinated eggplant, tomato sauce, parmesan, mozzarella, basil' },
  9:  { name: 'Diabola Octopus',           desc: 'Grilled octopus, spicy diabola sauce, peppers, garden herbs' },
  10: { name: 'Warm Goat Cheese Crouton',  desc: 'Melted goat cheese on toast, flower honey, walnuts, mesclun, balsamic vinaigrette' },
  11: { name: 'Soup of the Day',           desc: 'Prepared from the morning market — ask your server' },
  // Poissons et Crustacés
  30: { name: "Fisherman's Pot",           desc: 'Daily catch fish, seasonal vegetables, homemade fragrant broth' },
  31: { name: 'Grilled Prawn Skewers',     desc: 'Large herb-marinated prawns, grilled, garlic-parsley butter' },
  32: { name: 'Monkfish Skewers',          desc: 'Monkfish marinated in Provençal herbs, grilled on skewer, lemon' },
  33: { name: 'Garlic Sautéed Shrimp',     desc: 'Fresh shrimp, garlic butter, chopped parsley, pressed lime' },
  34: { name: 'Fried Calamari',            desc: 'Fresh calamari, crispy light batter, homemade tartar sauce' },
  35: { name: 'Braised Thiof',             desc: 'Whole braised thiof, melt-in-mouth tomato-onion sauce, rice or fries' },
  36: { name: 'Surf & Turf Skewers',       desc: 'Mixed meat and seafood skewers, béarnaise or diabola sauce' },
  37: { name: 'Sole & Prawn Rolls',        desc: 'Sole fillets stuffed with prawns, creamy lemon sauce, steamed vegetables' },
  38: { name: 'Grilled Sea Bream',         desc: 'Whole grilled sea bream, Provençal herbs, olive oil, lemon' },
  39: { name: 'Sole Meunière',             desc: 'Fresh sole, hazelnut butter, capers, chopped parsley, lemon' },
  40: { name: 'Flambéed Royal Prawns',     desc: 'Royal prawns flambéed in cognac, homemade American sauce' },
  41: { name: 'Ocean Skewer',              desc: 'Monkfish, squid, prawns — herb lemon marinade, grilled' },
  42: { name: 'Thiof Fillet',              desc: 'Thiof fillet, homemade vegetable sauce, fresh market vegetables' },
  43: { name: 'Seafood Plancha',           desc: "Squid, octopus, prawns — cooked on the plancha, sauce of your choice" },
  // Les Pâtes (Italian names unchanged per user request)
  70: { name: 'Spaghetti pomodoro e basilico fresco', desc: 'Spaghetti, fresh tomato sauce, garden basil' },
  71: { name: 'Spaghetti bolognese',       desc: 'Slow-cooked beef ragù, tomato sauce, parmesan' },
  72: { name: 'Spaghetti alla carbonara',  desc: 'Guanciale, egg, pecorino, black pepper — Roman recipe' },
  73: { name: 'Pennette salmone',          desc: 'Smoked salmon, light cream, dill, lemon' },
  74: { name: "Pennette all'arrabiata",    desc: 'Spicy tomato sauce, garlic, cayenne pepper, basil' },
  75: { name: 'Spaghetti alla vongole locali', desc: 'Local fresh clams, garlic, white wine, parsley' },
  76: { name: 'Spaghetti alla bottarga di muggine', desc: 'Grated mullet bottarga, olive oil, garlic, parsley' },
  77: { name: 'Gnocchetti malloreddus alla sarda', desc: 'Sardinian gnocchetti, sausage and saffron sauce, pecorino' },
  78: { name: 'Linguine gamberi e pesto',  desc: 'Fresh prawns, homemade Genoese pesto, pine nuts' },
  79: { name: 'Tagliatelle ai funghi porcini', desc: 'Porcini mushrooms, butter, garlic, thyme, light cream' },
  80: { name: 'Tagliatelle ai granchi',    desc: 'Fresh crab, fresh tomato, garlic, white wine, parsley' },
  81: { name: 'Linguine ai frutti di mare', desc: 'Assorted seafood, tomato or cream sauce, fresh herbs' },
  82: { name: 'Linguine vongole et bottarga', desc: 'Local clams, mullet bottarga, olive oil, garlic' },
  83: { name: 'Ravioli au poisson sauce crevettes', desc: 'Fish-stuffed ravioli, prawn bisque sauce' },
  84: { name: 'Ravioli ricotta tomate ou beurre sauge', desc: 'Ricotta ravioli, fresh tomato sauce or sage butter' },
  85: { name: 'Risotto aux fruits de mer', desc: 'Creamy risotto, daily fresh seafood — minimum 2 persons' },
  // Les Pizzas (Italian names unchanged)
  90: { name: 'Romana',     desc: 'tomato sauce, mozza, anchovies' },
  91: { name: 'Napoli',     desc: 'tomato sauce, mozza, capers, anchovies' },
  92: { name: 'Margherita', desc: 'tomato sauce, mozzarella' },
  93: { name: 'Veneziana',  desc: 'tomato sauce, mozza, ham' },
  94: { name: 'Ortolana',   desc: 'mozza, eggplant, zucchini, bell pepper' },
  95: { name: 'Reine',      desc: 'tomato sauce, mozza, ham, mushroom, olive' },
  96: { name: 'Cardinale',  desc: 'tomato sauce, mozza, ham' },
  97: { name: '4 Stagioni', desc: 'tomato sauce, mozza, ham, mushroom, olive, artichoke' },
  98: { name: 'Primavera',  desc: 'tomato sauce, mozza, cherry tomato, basil' },
  99: { name: 'Vege',       desc: 'tomato sauce, zucchini, carrot, onion, bell pepper, emmental' },
  100:{ name: 'Completa',   desc: 'tomato sauce, mozza, a little of everything' },
  101:{ name: 'Marina',     desc: 'tomato sauce, garlic, oregano' },
  102:{ name: 'Sarda',      desc: 'tomato sauce, mozza, sausage, olive' },
  103:{ name: '4 Formaggi', desc: 'mozza, gorgonzola, emmental, fontina' },
  104:{ name: 'Boscaiola',  desc: 'tomato sauce, mozza, porcini mushrooms' },
  // Viandes et Volailles
  50: { name: 'Beef Fillet Gorgonzola & Walnuts', desc: 'Grilled fillet, creamy gorgonzola sauce, toasted walnut halves' },
  51: { name: 'Beef Fillet Green Pepper',  desc: 'Tender beef fillet, flambéed green pepper sauce, homemade fries' },
  52: { name: 'Beef Slices',               desc: 'Thinly sliced marinated beef, grilled on the plancha with herbs' },
  53: { name: 'Brazilian Fillet',          desc: 'Premium Brazilian beef fillet, sauce of your choice, garnish' },
  54: { name: 'Brazilian Ribeye',          desc: 'Marbled Brazilian ribeye, grilled, reduced meat jus' },
  55: { name: 'Taouk Skewers',             desc: 'Chicken skewers marinated in yogurt, oriental spices, white sauce' },
  56: { name: 'Beef or Chicken Wok',       desc: 'Stir-fried strips, crunchy vegetables, soy-ginger sauce, basmati rice' },
  57: { name: 'Brazilian Herb Lamb Chops', desc: 'Brazilian lamb chops, fine herbs, confit garlic, sarladaise potatoes' },
  58: { name: 'Beef Skewers',              desc: 'Marinated beef skewers, onions, grilled peppers, chimichurri sauce' },
  59: { name: 'Whole Roast Chicken',       desc: 'Whole roasted chicken with Provençal herbs, cooking juices, fries or rice' },
  60: { name: 'Half Chicken Devil Sauce',  desc: 'Grilled half chicken, homemade spicy devil sauce, golden fries' },
};

// ─── Shared components ────────────────────────────────────────────────────────
function MagneticButton({ children, dark = false, onClick }: { children: React.ReactNode; dark?: boolean; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 18, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 160, damping: 18, mass: 0.1 });
  const shouldReduce = useReducedMotion();

  const onMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  }, [shouldReduce, x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button ref={ref} onClick={onClick}
      style={{ x: sx, y: sy, backgroundColor: dark ? 'transparent' : C.gold, color: dark ? C.gold : C.jungle, borderColor: C.gold, ...SANS }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase overflow-hidden cursor-pointer border"
    >
      <motion.span className="absolute inset-0 rounded-full"
        style={{ backgroundColor: dark ? `${C.gold}18` : C.goldLight }}
        initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }}
      />
      <span className="relative z-10">{children}</span>
      <ArrowRight size={15} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
    </motion.button>
  );
}

// Language toggle button
function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="text-[10px] font-bold tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer px-3 rounded border border-white/20 hover:border-white/40 min-h-[44px] min-w-[44px] flex items-center justify-center"
      style={SANS}
      aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}

// Shared page header bar
function PageHeader({ title, lang, onLangToggle, onBack }: { title: string; lang: Lang; onLangToggle: () => void; onBack: () => void }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 lg:px-10 h-16 border-b"
      style={{ backgroundColor: C.jungle, borderColor: `${C.gold}20` }}
    >
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-wide min-h-[44px] px-1">
        <ArrowLeft size={16} /> {lang === 'fr' ? 'Retour' : 'Back'}
      </button>
      <span className="text-base font-bold text-white" style={SERIF}>{title}</span>
      <LangToggle lang={lang} onToggle={onLangToggle} />
    </div>
  );
}

// Page fade transition
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

// ─── LANDING VIEW ─────────────────────────────────────────────────────────────
function LandingView({
  onMenu, onReservation, onApropos, onExperience, lang, onLangToggle,
}: {
  onMenu: () => void; onReservation: () => void; onApropos: () => void; onExperience: () => void;
  lang: Lang; onLangToggle: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = UI[lang];

  const navLinks = [
    { label: t.nav.apropos,    action: onApropos },
    { label: t.nav.lacarte,    action: onMenu },
    { label: t.nav.experience, action: onExperience },
    { label: t.nav.reserver,   action: onReservation },
  ];

  return (
    <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ backgroundColor: C.jungle }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/image_7.jpg')" }}
        initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: 'easeOut' }}
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(13,43,29,0.45) 0%, rgba(13,43,29,0.82) 100%)` }} />

      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 lg:px-10 h-14">
        {/* Brand wordmark */}
        <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-light" style={SANS}>Le Cocotier</span>

        {/* Desktop nav links + lang toggle */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, action }) => (
            <button key={label} onClick={action}
              className="text-[10px] tracking-[0.25em] uppercase font-semibold text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
              style={SANS}
            >
              {label}
            </button>
          ))}
          <LangToggle lang={lang} onToggle={onLangToggle} />
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden w-11 h-11 flex items-center justify-center text-white/60 hover:text-white cursor-pointer transition-colors" aria-label="Ouvrir le menu">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile full-screen nav overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div key="mobile-nav"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: `${C.jungle}F8`, backdropFilter: 'blur(12px)' }}
          >
            <button onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-6 text-white/60 hover:text-white cursor-pointer transition-colors"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map(({ label, action }, i) => (
                <motion.button key={label}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  onClick={() => { setMenuOpen(false); action(); }}
                  className="text-2xl font-bold text-white/80 hover:text-white cursor-pointer tracking-wide transition-colors"
                  style={SERIF}
                >
                  {label}
                </motion.button>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <LangToggle lang={lang} onToggle={onLangToggle} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-2xl mx-auto">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-col items-center mb-10"
        >
          <span className="text-[11px] tracking-[0.45em] uppercase text-white/50 font-light mb-1">Restaurant</span>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={SERIF}>Le Cocotier</h1>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Restaurant+Le+Cocotier+Dakar&query_place_id=ChIJKxCztt4SwQ4RZf5p7rZBinU"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 transition-colors duration-300 group"
            style={{ color: `${C.gold}99` }}
          >
            <div className="h-px w-8 transition-colors duration-300" style={{ backgroundColor: C.gold }} />
            <MapPin size={11} className="group-hover:text-red-400 transition-colors duration-300" style={{ color: C.gold }} />
            <span className="text-[10px] tracking-[0.22em] uppercase font-light group-hover:text-red-400 transition-colors duration-300 min-h-[44px] flex items-center" style={{ color: C.gold }}>Pointe des Almadies · Dakar</span>
            <div className="h-px w-8 transition-colors duration-300" style={{ backgroundColor: C.gold }} />
          </a>
        </motion.div>

        {/* Headline */}
        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-white leading-[0.9] mb-4"
          style={{ ...SERIF, fontSize: 'clamp(3rem, 10vw, 6.5rem)', fontWeight: 700 }}
        >
          {t.hero.h1[0]}<br />
          <span style={{ color: C.gold }}>{t.hero.h1[1]}</span><br />
          {t.hero.h1[2]}
        </motion.h2>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.7 }}
          className="origin-center h-px w-16 my-8" style={{ backgroundColor: `${C.gold}70` }}
        />

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <MagneticButton onClick={onMenu}>{t.hero.cta1}</MagneticButton>
          <MagneticButton dark onClick={onReservation}>{t.hero.cta2}</MagneticButton>
        </motion.div>

        {/* Fresh badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.5 }}
          className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ backgroundColor: `${C.fresh}20`, border: `1px solid ${C.fresh}40` }}
        >
          <Fish size={12} style={{ color: C.fresh }} />
          <span className="text-xs font-medium tracking-wide" style={{ color: C.fresh }}>{t.hero.badge}</span>
        </motion.div>
      </div>

      {/* Phone bottom */}
      <motion.a href="tel:+221338203331" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors cursor-pointer"
        style={{ ...SANS, fontSize: '12px', letterSpacing: '0.08em' }}
      >
        <Phone size={12} /> 33 820 33 31
      </motion.a>
    </motion.div>
  );
}

// ─── À PROPOS VIEW ────────────────────────────────────────────────────────────
function AProposView({ onBack, lang, onLangToggle }: { onBack: () => void; lang: Lang; onLangToggle: () => void }) {
  const t = UI[lang].apropos;
  return (
    <motion.div key="apropos" variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 flex flex-col" style={{ backgroundColor: C.cream, ...SANS }}
    >
      <PageHeader title={lang === 'fr' ? 'À Propos' : 'About'} lang={lang} onLangToggle={onLangToggle} onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">

          {/* Two-column layout: image left, text right */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full lg:w-[46%] flex-shrink-0"
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ height: '460px' }}>
                <img
                  src="/image_6.jpg"
                  alt="Terrasse du Restaurant Le Cocotier face à l'Atlantique, Pointe des Almadies Dakar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {/* Subtle gold frame accent */}
                <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 0 1px ${C.gold}25` }} />
              </div>
              {/* Caption */}
              <p className="mt-3 text-center text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: C.gold }}>
                {t.imgCaption}
              </p>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full lg:w-[54%]"
            >
              <p className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-3" style={{ color: C.gold }}>
                {t.tag}
              </p>
              <h2 className="font-bold leading-tight mb-7"
                style={{ ...SERIF, fontSize: 'clamp(1.9rem, 3.5vw, 3rem)', color: C.jungle }}
              >
                {t.h1}<br />{t.h2}
              </h2>

              <div className="space-y-5 text-sm leading-[1.95] font-light" style={{ color: C.muted }}>
                <p>{t.p1}</p>
                <p>{t.p2}</p>
                <p>{t.p3}</p>
                <p>{t.p4}</p>
              </div>

              {/* Divider with location */}
              <div className="mt-9 flex items-center gap-4">
                <div className="h-px flex-1" style={{ backgroundColor: `${C.gold}35` }} />
                <div className="flex items-center gap-2">
                  <MapPin size={13} style={{ color: C.gold }} />
                  <span className="text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: C.gold }}>
                    Pointe des Almadies · Dakar
                  </span>
                </div>
                <div className="h-px flex-1" style={{ backgroundColor: `${C.gold}35` }} />
              </div>

              {/* Key info pills */}
              <div className="mt-8 flex flex-wrap gap-3">
                {t.pills.map((label) => (
                  <span key={label}
                    className="px-4 py-1.5 rounded-full text-[10px] tracking-wide font-semibold uppercase"
                    style={{ backgroundColor: `${C.jungle}0C`, color: C.jungle, border: `1px solid ${C.jungle}18` }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom contact bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-14 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: C.jungle }}
          >
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-1" style={{ color: `${C.gold}90` }}>{t.findUs}</p>
              <p className="text-sm font-light text-white/80">{t.addr}</p>
            </div>
            <a href="tel:+221338203331"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase cursor-pointer hover:opacity-85 transition-opacity"
              style={{ backgroundColor: C.gold, color: C.jungle, ...SANS }}
            >
              <Phone size={13} /> 33 820 33 31
            </a>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

// ─── EXPERIENCE VIEW (Témoignages) ────────────────────────────────────────────
function ExperienceView({ onBack, lang, onLangToggle }: { onBack: () => void; lang: Lang; onLangToggle: () => void }) {
  const t = UI[lang].experience;
  return (
    <motion.div key="experience" variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 flex flex-col" style={{ backgroundColor: C.cream, ...SANS }}
    >
      <PageHeader title={lang === 'fr' ? 'Expérience' : 'Experience'} lang={lang} onLangToggle={onLangToggle} onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 lg:py-16">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-3" style={{ color: C.gold }}>
              {t.tag}
            </p>
            <h2 className="font-bold leading-tight"
              style={{ ...SERIF, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: C.jungle }}
            >
              {t.h1}<br />{t.h2}
            </h2>
            <div className="h-px w-12 mx-auto mt-6" style={{ backgroundColor: `${C.gold}60` }} />
          </motion.div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div key={testimonial.name}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.6 }}
                className="rounded-2xl p-7 flex flex-col"
                style={{
                  backgroundColor: C.white,
                  boxShadow: '0 4px 28px rgba(13,43,29,0.07), 0 1px 4px rgba(13,43,29,0.04)',
                  border: `1px solid ${C.gold}14`,
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array(testimonial.stars).fill(0).map((_, j) => (
                    <Star key={j} size={13} fill={C.gold} style={{ color: C.gold }} />
                  ))}
                </div>

                {/* Opening quote mark */}
                <span className="text-4xl leading-none font-bold mb-2 -mt-1" style={{ color: `${C.gold}30`, fontFamily: 'Georgia, serif' }}>&ldquo;</span>

                {/* Quote */}
                <p className="text-sm leading-[1.85] font-light flex-1 mb-7" style={{ color: C.muted }}>
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${C.gold}18` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ backgroundColor: `${C.jungle}12`, color: C.jungle }}
                  >
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight" style={{ color: C.text }}>{testimonial.name}</p>
                    <p className="text-[10px] font-light mt-0.5" style={{ color: C.muted }}>{t.roles[i]}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }}
            className="text-center mt-16"
          >
            <div className="h-px w-12 mx-auto mb-7" style={{ backgroundColor: `${C.gold}50` }} />
            <p className="text-sm font-light italic" style={{ color: C.muted }}>
              {lang === 'fr' ? '"Chaque table est une promesse d’Atlantique."' : '"Every table is a promise of the Atlantic."'}
            </p>
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold mt-2.5" style={{ color: C.gold }}>
              — Restaurant Le Cocotier
            </p>
          </motion.div>

          {/* CTA to reserve */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5 }}
            className="flex justify-center mt-10"
          >
            <button onClick={onBack}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase cursor-pointer hover:opacity-85 transition-opacity"
              style={{ backgroundColor: C.jungle, color: C.gold, ...SANS }}
            >
              {lang === 'fr' ? 'Réserver une Table' : 'Book a Table'} <ArrowRight size={13} />
            </button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

// ─── MENU VIEW ────────────────────────────────────────────────────────────────
function GoldSeparator() {
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="h-px flex-1" style={{ backgroundColor: `${C.gold}30` }} />
      <div className="flex gap-1.5">
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${C.gold}60` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.gold }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${C.gold}60` }} />
      </div>
      <div className="h-px flex-1" style={{ backgroundColor: `${C.gold}30` }} />
    </div>
  );
}

function MenuCard({ item, idx, lang }: { item: MenuItem; idx: number; lang: Lang }) {
  const en = ITEMS_EN[item.id];
  const name = lang === 'en' && en ? en.name : item.name;
  const desc = lang === 'en' && en ? en.desc : item.desc;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.45 }}
      className="group rounded-2xl overflow-hidden cursor-default"
      style={{ boxShadow: '0 2px 18px rgba(13,43,29,0.07)', border: `1px solid ${C.gold}10` }}
      whileHover="hovered"
    >
      <div className="relative overflow-hidden" style={{ height: '168px' }}>
        <motion.img
          src={item.img}
          alt={`${name} — Restaurant Le Cocotier Dakar`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
          variants={{ hovered: { scale: 1.07 } }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(9,15,12,0.88) 0%,transparent 60%)' }} />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">

          {item.tag && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide" style={{ backgroundColor: C.gold, color: C.jungle }}>
              {item.tag}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h4 className="text-white font-bold text-sm leading-snug" style={SERIF}>{name}</h4>
        </div>
      </div>
      <div className="px-4 py-3.5" style={{ backgroundColor: C.white }}>
        <p className="text-xs leading-relaxed font-light mb-3" style={{ color: C.muted }}>{desc}</p>
        <span className="text-sm font-bold" style={{ color: C.gold, ...SANS }}>{item.price}</span>
      </div>
    </motion.div>
  );
}

function MenuView({ onBack, onReservation, lang, onLangToggle }: { onBack: () => void; onReservation: () => void; lang: Lang; onLangToggle: () => void }) {
  const [activeId, setActiveId] = useState(MENU_SECTIONS[0].id);
  const section = MENU_SECTIONS.find(s => s.id === activeId)!;
  const t = UI[lang].menu;
  const secEn = SECTION_EN[activeId];;

  return (
    <motion.div key="menu" variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 flex flex-col" style={{ backgroundColor: C.cream, ...SANS }}
    >
      {/* ── Top bar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 lg:px-10 h-14 border-b"
        style={{ backgroundColor: C.jungle, borderColor: `${C.gold}20` }}
      >
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-wide">
          <ArrowLeft size={15} /> {t.back}
        </button>
        <span className="text-sm font-bold text-white" style={SERIF}>{t.header}</span>
        <LangToggle lang={lang} onToggle={onLangToggle} />
      </div>

      {/* ── Category tabs ── */}
      <div className="flex-shrink-0 border-b overflow-x-auto" style={{ borderColor: `${C.gold}22`, backgroundColor: C.warmBg }}>
        <div className="flex items-center gap-1 px-4 py-3 min-w-max mx-auto">
          {MENU_SECTIONS.map(s => {
            const active = s.id === activeId;
            return (
              <button key={s.id} onClick={() => setActiveId(s.id)}
                className="relative px-4 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-250 cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: active ? C.jungle : 'transparent',
                  color: active ? C.gold : C.muted,
                  border: `1px solid ${active ? C.jungle : `${C.muted}25`}`,
                }}
              >
                {lang === 'en' && SECTION_EN[s.id] ? SECTION_EN[s.id].title : s.title}
                {active && (
                  <motion.span layoutId="tab-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: C.jungle, zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeId}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-5xl mx-auto px-6 lg:px-10 py-8"
          >
            {/* Section heading */}
            <div className="mb-6 text-center">
              <h2 className="font-bold leading-none mb-2 uppercase tracking-wide"
                style={{ ...SERIF, fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: C.jungle }}
              >
                {lang === 'en' && secEn ? secEn.title : section.title}
              </h2>
              <p className="text-xs font-light italic" style={{ color: C.muted }}>{lang === 'en' && secEn ? secEn.subtitle : section.subtitle}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-px w-10" style={{ backgroundColor: `${C.gold}40` }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: C.gold }} />
                <div className="h-px w-10" style={{ backgroundColor: `${C.gold}40` }} />
              </div>
            </div>

            {/* Subcategories list (Boissons) */}
            {section.subcategories ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {section.subcategories.map((sub) => (
                  <div key={sub.title} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.gold}20`, backgroundColor: `${C.warmBg}` }}>
                    <div className="px-5 py-3" style={{ backgroundColor: `${C.gold}18`, borderBottom: `1px solid ${C.gold}25` }}>
                      <h4 className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.gold, ...SANS }}>
                        {lang === 'en' && SUBCATS_EN[sub.title] ? SUBCATS_EN[sub.title] : sub.title}
                      </h4>
                    </div>
                    <ul className="divide-y" style={{ borderColor: `${C.gold}12` }}>
                      {sub.items.map((drink) => (
                        <li key={drink.name} className="flex items-center justify-between px-5 py-2.5 gap-3 group">
                          <span className="text-sm font-light flex-1 min-w-0" style={{ color: C.jungle, ...SANS }}>
                            {lang === 'en' && DRINK_EN[drink.name] ? DRINK_EN[drink.name] : drink.name}
                            {drink.tag && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide"
                                style={{ backgroundColor: `${C.gold}20`, color: C.gold }}>
                                {drink.tag}
                              </span>
                            )}
                          </span>
                          <span className="text-xs font-medium whitespace-nowrap tabular-nums" style={{ color: C.gold, ...SANS }}>{drink.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            ) : (
              <>
                {/* Cards grid */}
                <div className={`grid gap-4 ${
                  section.items.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : section.items.length === 4
                    ? 'grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {section.items.map((item, idx) => (
                    <MenuCard key={item.id} item={item} idx={idx} lang={lang} />
                  ))}
                </div>

                {/* Supplements block — bottom of section */}
                {section.supplements && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="mt-8 rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${C.gold}25`, backgroundColor: `${C.warmBg}` }}
                  >
                    <div className="px-4 py-2" style={{ backgroundColor: `${C.gold}15`, borderBottom: `1px solid ${C.gold}20` }}>
                      <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: C.gold, ...SANS }}>{t.supplements}</p>
                    </div>
                    {section.supplements.map(s => {
                      const parts = s.split(' : ');
                      const frLabel = parts[0];
                      const price = parts[1] ?? '';
                      const enKey = Object.keys(SUPPS_EN).find(k => frLabel.startsWith(k));
                      const label = lang === 'en' && enKey ? frLabel.replace(enKey, SUPPS_EN[enKey]) : frLabel;
                      return (
                        <div key={s} className="flex items-start justify-between gap-4 px-4 py-2.5" style={{ borderBottom: `1px solid ${C.gold}10` }}>
                          <p className="text-xs font-light flex-1" style={{ color: C.jungle, ...SANS }}>{label}</p>
                          <p className="text-xs font-semibold whitespace-nowrap tabular-nums" style={{ color: C.gold, ...SANS }}>+ {price}</p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </motion.div>
  );
}

// ─── RESERVATION VIEW ─────────────────────────────────────────────────────────
function ReservationView({ onBack, lang, onLangToggle }: { onBack: () => void; lang: Lang; onLangToggle: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const t = UI[lang].reservation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div key="reservation" variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="fixed inset-0 flex flex-col" style={{ backgroundColor: C.cream, ...SANS }}
    >
      <PageHeader title={lang === 'fr' ? 'Réservation' : 'Reservation'} lang={lang} onLangToggle={onLangToggle} onBack={onBack} />

      {/* Scrollable form area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-6 py-10">

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${C.gold}20` }}>
                  <span className="text-2xl" aria-hidden>✓</span>
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ ...SERIF, color: C.jungle }}>{t.okTitle}</h2>
                <p className="text-sm leading-7 font-light mb-8" style={{ color: C.muted }}>
                  {t.okMsg.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
                </p>
                <button onClick={onBack}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold tracking-widest uppercase cursor-pointer hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: C.gold, color: C.jungle, ...SANS }}
                >
                  <ArrowLeft size={14} /> {t.backBtn}
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Intro */}
                <div className="text-center mb-10">
                  <p className="text-xs tracking-[0.3em] uppercase font-medium mb-2" style={{ color: C.gold }}>{t.tag}</p>
                  <h2 className="font-bold leading-tight mb-3" style={{ ...SERIF, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: C.jungle }}>
                    {t.h}
                  </h2>
                  <p className="text-xs font-light" style={{ color: C.muted }}>{t.sub}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row: Prénom + Nom */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.firstName}</label>
                      <input required type="text" placeholder="Prénom" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-shadow focus:ring-2"
                        style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                        onFocus={e => e.currentTarget.style.borderColor = C.gold}
                        onBlur={e => e.currentTarget.style.borderColor = `${C.gold}28`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.lastName}</label>
                      <input required type="text" placeholder="Nom" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                        onFocus={e => e.currentTarget.style.borderColor = C.gold}
                        onBlur={e => e.currentTarget.style.borderColor = `${C.gold}28`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.email}</label>
                    <input required type="email" placeholder="exemple@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                      onFocus={e => e.currentTarget.style.borderColor = C.gold}
                      onBlur={e => e.currentTarget.style.borderColor = `${C.gold}28`}
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.phone}</label>
                    <input required type="tel" placeholder="77 000 00 00" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                      onFocus={e => e.currentTarget.style.borderColor = C.gold}
                      onBlur={e => e.currentTarget.style.borderColor = `${C.gold}28`}
                    />
                  </div>

                  {/* Row: Date + Heure */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.date}</label>
                      <input required type="date" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                        onFocus={e => e.currentTarget.style.borderColor = C.gold}
                        onBlur={e => e.currentTarget.style.borderColor = `${C.gold}28`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.time}</label>
                      <select required className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                      >
                        <option value="">--:--</option>
                        {['12:00','12:30','13:00','13:30','14:00','14:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30'].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Personnes */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.guests}</label>
                    <select required className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                    >
                      <option value="">{t.guestsPh}</option>
                      {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{t.guestUnit(n)}</option>)}
                      <option value="9+">{lang === 'fr' ? '9+ personnes' : '9+ people'}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: C.muted }}>{t.message}</label>
                    <textarea rows={3} placeholder={t.messagePh}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ backgroundColor: C.white, border: `1px solid ${C.gold}28`, color: C.text, fontFamily: "var(--font-karla,sans-serif)" }}
                      onFocus={e => e.currentTarget.style.borderColor = C.gold}
                      onBlur={e => e.currentTarget.style.borderColor = `${C.gold}28`}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-semibold text-sm tracking-widest uppercase cursor-pointer mt-2"
                    style={{ backgroundColor: C.jungle, color: C.gold, ...SANS }}
                  >
                    {t.submit}
                  </motion.button>

                  <p className="text-center text-[10px] font-light pt-1" style={{ color: C.muted }}>
                    {t.callUs}<a href="tel:+221338203331" className="underline">33 820 33 31</a>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>('landing');
  const [lang, setLang] = useState<Lang>('fr');
  const onLangToggle = () => setLang(l => l === 'fr' ? 'en' : 'fr');

  return (
    <div className="fixed inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingView
            key="landing"
            onMenu={() => setView('menu')}
            onReservation={() => setView('reservation')}
            onApropos={() => setView('apropos')}
            onExperience={() => setView('experience')}
            lang={lang}
            onLangToggle={onLangToggle}
          />
        )}
        {view === 'menu' && (
          <MenuView key="menu" onBack={() => setView('landing')} onReservation={() => setView('reservation')} lang={lang} onLangToggle={onLangToggle} />
        )}
        {view === 'reservation' && (
          <ReservationView key="reservation" onBack={() => setView('landing')} lang={lang} onLangToggle={onLangToggle} />
        )}
        {view === 'apropos' && (
          <AProposView key="apropos" onBack={() => setView('landing')} lang={lang} onLangToggle={onLangToggle} />
        )}
        {view === 'experience' && (
          <ExperienceView key="experience" onBack={() => setView('landing')} lang={lang} onLangToggle={onLangToggle} />
        )}
      </AnimatePresence>
    </div>
  );
}
