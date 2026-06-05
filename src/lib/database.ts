import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'bookings.json');

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  turf: string;
  sport: string;
  datetime: string;
  players: number;
  price: number;
  status: 'pending' | 'booked' | 'rejected' | 'canceled';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
  batch: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredLocation: string;
  dealNotes: string;
  called: boolean;
}

interface Database {
  bookings: Booking[];
  lockedTimeSlots: string[];
}

const DEFAULT_DB: Database = {
  bookings: [],
  lockedTimeSlots: []
};

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readDB(): Promise<Database> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_DB;
  }
}

async function writeDB(db: Database): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

export async function getBookings(): Promise<Booking[]> {
  const db = await readDB();
  return db.bookings;
}

export async function addBooking(booking: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt' | 'called'>): Promise<Booking> {
  const db = await readDB();
  const newBooking: Booking = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
    called: false,
  };
  db.bookings.unshift(newBooking);
  await writeDB(db);
  return newBooking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const db = await readDB();
  const index = db.bookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  db.bookings[index] = { ...db.bookings[index], ...updates };
  await writeDB(db);
  return db.bookings[index];
}

export async function deleteBooking(id: string): Promise<boolean> {
  const db = await readDB();
  const initialLength = db.bookings.length;
  db.bookings = db.bookings.filter(b => b.id !== id);
  if (db.bookings.length === initialLength) return false;
  await writeDB(db);
  return true;
}

export async function getLockedTimeSlots(): Promise<string[]> {
  const db = await readDB();
  return db.lockedTimeSlots;
}

export async function lockTimeSlot(datetime: string): Promise<void> {
  const db = await readDB();
  if (!db.lockedTimeSlots.includes(datetime)) {
    db.lockedTimeSlots.push(datetime);
    await writeDB(db);
  }
}

export async function unlockTimeSlot(datetime: string): Promise<void> {
  const db = await readDB();
  db.lockedTimeSlots = db.lockedTimeSlots.filter(t => t !== datetime);
  await writeDB(db);
}
