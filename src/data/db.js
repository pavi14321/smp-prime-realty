// Simple localStorage-backed "database" for demo purposes.
// Replace this layer with real API calls when you connect a backend.

const STORAGE_KEY = 'smp_properties_db';
const ID_COUNTER_KEY = 'smp_property_id_counter';
const EVENT_NAME = 'smp-db-change';

const placeholderImg = (label, w = 900, h = 650) =>
  `https://placehold.co/${w}x${h}/1B4B3A/FBF8F1?text=${encodeURIComponent(label)}`;

const seedData = [
  {
    id: 'SMP1000',
    title: 'Luxury 4BHK Villa',
    location: 'Sarjapur Road, Bengaluru, Karnataka',
    price: 27500000,
    priceLabel: '₹2,75,00,000',
    negotiable: true,
    status: 'For Sale',
    featured: true,
    category: 'Villas',
    beds: 4,
    baths: 4,
    sqft: 3200,
    parking: '2 Car Parking',
    facing: 'East Facing',
    readyToMove: true,
    description:
      'This beautiful 4BHK villa is located in a prime area of Sarjapur Road, offering modern amenities, spacious rooms, and a peaceful environment. Perfect for families looking for comfort and luxury.',
    amenities: ['Gated Community', '24/7 Security', 'Club House & Swimming Pool', "Children's Play Area"],
    images: [
      placeholderImg('4BHK Villa - Main'),
      placeholderImg('4BHK Villa - View 2'),
      placeholderImg('4BHK Villa - View 3'),
      placeholderImg('4BHK Villa - View 4'),
    ],
    lat: 12.9010,
    lng: 77.6870,
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'SMP1001',
    title: 'Luxury 3BHK Apartment',
    location: 'Whitefield, Bengaluru',
    price: 8500000,
    priceLabel: '₹85,00,000',
    status: 'For Sale',
    featured: true,
    category: 'Apartments',
    beds: 3,
    baths: 3,
    sqft: 1650,
    parking: '1 Car Parking',
    facing: 'North Facing',
    readyToMove: true,
    description:
      'A modern 3BHK apartment in the heart of Whitefield with excellent connectivity, premium amenities, and a vibrant community lifestyle.',
    amenities: ['Gated Community', 'Gym & Clubhouse', 'Power Backup', 'Covered Parking'],
    images: [placeholderImg('3BHK Apartment - Main'), placeholderImg('3BHK Apartment - View 2')],
    lat: 12.9698,
    lng: 77.7500,
    createdAt: Date.now() - 900000,
  },
  {
    id: 'SMP1002',
    title: 'Modern Villa For Rent',
    location: 'Sarjapur Road, Bengaluru',
    price: 45000,
    priceLabel: '₹45,000 / Month',
    status: 'For Rent',
    featured: true,
    category: 'Rental Properties',
    beds: 4,
    baths: 4,
    sqft: 2400,
    parking: '2 Car Parking',
    facing: 'East Facing',
    readyToMove: true,
    description:
      'Spacious modern villa available for rent, ideal for families, with a private garden, ample parking, and 24/7 security.',
    amenities: ['24/7 Security', 'Private Garden', 'Modular Kitchen', 'Servant Room'],
    images: [placeholderImg('Modern Villa - Main'), placeholderImg('Modern Villa - View 2')],
    lat: 12.9010,
    lng: 77.6870,
    createdAt: Date.now() - 800000,
  },
  {
    id: 'SMP1003',
    title: 'Premium Apartments',
    location: 'Electronic City, Bengaluru',
    price: 6200000,
    priceLabel: '₹62,00,000',
    status: 'New Launch',
    featured: true,
    category: 'Apartments',
    beds: 2,
    baths: 2,
    sqft: 1250,
    parking: '1 Car Parking',
    facing: 'West Facing',
    readyToMove: false,
    description:
      'A new launch premium apartment project in Electronic City with world-class amenities and flexible payment plans.',
    amenities: ['Swimming Pool', 'Gym', 'Landscaped Garden', 'Kids Play Area'],
    images: [placeholderImg('Premium Apartments - Main'), placeholderImg('Premium Apartments - View 2')],
    lat: 12.8452,
    lng: 77.6602,
    createdAt: Date.now() - 700000,
  },
  {
    id: 'SMP1004',
    title: 'DTCP Approved Plot',
    location: 'Devanahalli, Bengaluru',
    price: 2600000,
    priceLabel: '₹26,00,000',
    status: 'Plot',
    featured: true,
    category: 'Lands / Plots',
    beds: 0,
    baths: 0,
    sqft: 1200,
    dimensions: '30x40',
    facing: 'North Facing',
    parking: '-',
    readyToMove: true,
    description:
      'DTCP approved residential plot in the fast-developing Devanahalli area, close to the international airport and major highways.',
    amenities: ['DTCP Approved', 'Clear Title', 'Gated Layout', 'Water & Electricity'],
    images: [placeholderImg('DTCP Plot - Main'), placeholderImg('DTCP Plot - View 2')],
    lat: 13.2437,
    lng: 77.7128,
    createdAt: Date.now() - 600000,
  },
];

function notify() {
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeDB(callback) {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      localStorage.setItem(ID_COUNTER_KEY, '1005');
      return seedData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('DB read error', e);
    return seedData;
  }
}

function writeRaw(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  notify();
}

export function getAllProperties() {
  return readRaw().sort((a, b) => b.createdAt - a.createdAt);
}

export function getPropertyById(id) {
  return readRaw().find((p) => p.id === id) || null;
}

export function getFeaturedProperties() {
  return getAllProperties().filter((p) => p.featured);
}

function nextId() {
  let counter = parseInt(localStorage.getItem(ID_COUNTER_KEY) || '1005', 10);
  const id = `SMP${counter}`;
  counter += 1;
  localStorage.setItem(ID_COUNTER_KEY, String(counter));
  return id;
}

export function addProperty(data) {
  const list = readRaw();
  const id = nextId();
  const newProperty = {
    id,
    createdAt: Date.now(),
    featured: false,
    images: data.images && data.images.length ? data.images : [placeholderImg(data.title || 'New Property')],
    amenities: data.amenities || [],
    lat: data.lat ? parseFloat(data.lat) : 12.9716,
    lng: data.lng ? parseFloat(data.lng) : 77.5946,
    ...data,
    id, // ensure generated id wins
  };
  list.push(newProperty);
  writeRaw(list);
  return newProperty;
}

export function updateProperty(id, data) {
  const list = readRaw();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data, id };
  writeRaw(list);
  return list[idx];
}

export function deleteProperty(id) {
  const list = readRaw().filter((p) => p.id !== id);
  writeRaw(list);
}

export function resetDB() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  localStorage.setItem(ID_COUNTER_KEY, '1005');
  notify();
}

export const CATEGORIES = [
  { name: 'Apartments', count: '120+ Properties' },
  { name: 'Villas', count: '85+ Properties' },
  { name: 'Lands / Plots', count: '150+ Properties' },
  { name: 'Rental Properties', count: '200+ Properties' },
  { name: 'Resale Properties', count: '180+ Properties' },
  { name: 'Commercial', count: '90+ Properties' },
];
