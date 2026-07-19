export const CATEGORIES = [
  {
    id: 1,
    name: 'Rings',
    slug: 'rings',
    description: 'From engagement rings to statement cocktail pieces, discover rings that define your style.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=400&fit=crop',
    productCount: 48,
  },
  {
    id: 2,
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Elegant necklaces and pendants crafted with precision, from delicate chains to statement pieces.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop',
    productCount: 36,
  },
  {
    id: 3,
    name: 'Earrings',
    slug: 'earrings',
    description: 'Studs, hoops, drops and chandeliers — earrings to frame your face with brilliance.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop',
    productCount: 52,
  },
  {
    id: 4,
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Tennis bracelets, bangles and cuffs that add a touch of luxury to every wrist.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop',
    productCount: 28,
  },
  {
    id: 5,
    name: 'Bridal',
    slug: 'bridal',
    description: 'Exquisite bridal sets and wedding jewellery to make your special day unforgettable.',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=400&fit=crop',
    productCount: 15,
  },
  {
    id: 6,
    name: 'Anklets',
    slug: 'anklets',
    description: 'Delicate anklets that add a charming finishing touch to any ensemble.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop',
    productCount: 18,
  },
];

export const getCategoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
