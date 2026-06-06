const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Database file path
const DB_PATH = path.join(__dirname, 'data/bookings.json');

// Helper function to read database
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { bookings: [], lockedTimeSlots: [] };
  }
}

// Helper function to write database
async function writeDatabase(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// API Routes

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const data = await readDatabase();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read bookings' });
  }
});

// POST new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const data = await readDatabase();
    const newBooking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    data.bookings.push(newBooking);
    await writeDatabase(data);
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT update booking
app.put('/api/bookings', async (req, res) => {
  try {
    const { id, status, paymentStatus } = req.body;
    const data = await readDatabase();
    const bookingIndex = data.bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (status) data.bookings[bookingIndex].status = status;
    if (paymentStatus) data.bookings[bookingIndex].paymentStatus = paymentStatus;
    
    await writeDatabase(data);
    res.json({ success: true, booking: data.bookings[bookingIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readDatabase();
    data.bookings = data.bookings.filter(b => b.id !== id);
    await writeDatabase(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Check if time slot is locked
app.get('/api/time-slots/check', async (req, res) => {
  try {
    const { datetime } = req.query;
    const data = await readDatabase();
    const isLocked = data.lockedTimeSlots.includes(datetime);
    res.json({ locked: isLocked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check time slot' });
  }
});

// Lock time slot
app.post('/api/time-slots/lock', async (req, res) => {
  try {
    const { datetime } = req.body;
    const data = await readDatabase();
    if (!data.lockedTimeSlots.includes(datetime)) {
      data.lockedTimeSlots.push(datetime);
      await writeDatabase(data);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to lock time slot' });
  }
});

// Unlock time slot
app.delete('/api/time-slots/unlock', async (req, res) => {
  try {
    const { datetime } = req.body;
    const data = await readDatabase();
    data.lockedTimeSlots = data.lockedTimeSlots.filter(ts => ts !== datetime);
    await writeDatabase(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlock time slot' });
  }
});

app.listen(PORT, () => {
  console.log(`Shared API server running on port ${PORT}`);
});
