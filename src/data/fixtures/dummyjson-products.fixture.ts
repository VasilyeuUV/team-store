/** @file Тестовые товары в формате ответа сервера (DummyJSON). */

import type { ProductDummyJsonDto } from '../api/product-dummyjson-dto';

/**
 * 12 товаров в 4 категориях — реальные данные DummyJSON.
 * Используются при разработке без обращения к сети.
 */
export const PRODUCTS_FIXTURE: readonly ProductDummyJsonDto[] = [
  // ── smartphones ──────────────────────────────────────────────
  {
    id: 129,
    title: 'Realme X',
    description:
      'The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.',
    category: 'smartphones',
    price: 299.99,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/realme-x/thumbnail.webp',
  },
  {
    id: 133,
    title: 'Samsung Galaxy S10',
    description:
      'The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.',
    category: 'smartphones',
    price: 699.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp',
  },
  {
    id: 134,
    title: 'Vivo S1',
    description:
      'The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.',
    category: 'smartphones',
    price: 249.99,
    thumbnail: 'https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/thumbnail.webp',
  },

  // ── laptops ──────────────────────────────────────────────────
  {
    id: 78,
    title: 'Apple MacBook Pro 14 Inch Space Grey',
    description:
      "The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.",
    category: 'laptops',
    price: 1999.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
  },
  {
    id: 79,
    title: 'Asus Zenbook Pro Dual Screen Laptop',
    description:
      'The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.',
    category: 'laptops',
    price: 1799.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp',
  },
  {
    id: 80,
    title: 'Huawei Matebook X Pro',
    description:
      'The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.',
    category: 'laptops',
    price: 1399.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp',
  },

  // ── tablets ──────────────────────────────────────────────────
  {
    id: 159,
    title: 'iPad Mini 2021 Starlight',
    description:
      'The iPad Mini 2021 in Starlight is a compact and powerful tablet from Apple. Featuring a stunning Retina display, powerful A-series chip, and a sleek design, it offers a premium tablet experience.',
    category: 'tablets',
    price: 499.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp',
  },
  {
    id: 160,
    title: 'Samsung Galaxy Tab S8 Plus Grey',
    description:
      "The Samsung Galaxy Tab S8 Plus in Grey is a high-performance Android tablet by Samsung. With a large AMOLED display, powerful processor, and S Pen support, it's ideal for productivity and entertainment.",
    category: 'tablets',
    price: 599.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp',
  },
  {
    id: 161,
    title: 'Samsung Galaxy Tab White',
    description:
      'The Samsung Galaxy Tab in White is a sleek and versatile Android tablet. With a vibrant display, long-lasting battery, and a range of features, it offers a great user experience for various tasks.',
    category: 'tablets',
    price: 349.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/thumbnail.webp',
  },

  // ── mobile-accessories ───────────────────────────────────────
  {
    id: 99,
    title: 'Amazon Echo Plus',
    description:
      'The Amazon Echo Plus is a smart speaker with built-in Alexa voice control. It features premium sound quality and serves as a hub for controlling smart home devices.',
    category: 'mobile-accessories',
    price: 99.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp',
  },
  {
    id: 100,
    title: 'Apple Airpods',
    description:
      'The Apple Airpods offer a seamless wireless audio experience. With easy pairing, high-quality sound, and Siri integration, they are perfect for on-the-go listening.',
    category: 'mobile-accessories',
    price: 129.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp',
  },
  {
    id: 101,
    title: 'Apple AirPods Max Silver',
    description:
      'The Apple AirPods Max in Silver are premium over-ear headphones with high-fidelity audio, adaptive EQ, and active noise cancellation. Experience immersive sound in style.',
    category: 'mobile-accessories',
    price: 549.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp',
  },
];
