# Sports Pitch Shared API

Shared backend API for both customer site and admin panel.

## Tech Stack
- Express.js
- Node.js

## Development

```bash
npm install
npm run dev
```

Runs on http://localhost:3002

## API Endpoints

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/time-slots/check?datetime=...` - Check if time slot is locked
- `POST /api/time-slots/lock` - Lock a time slot
- `DELETE /api/time-slots/unlock` - Unlock a time slot

## Database

Uses JSON file storage in `data/bookings.json`.

## Deployment

Deploy to Vercel as a separate project with its own URL.
