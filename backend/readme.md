# Boldcraft — Portfolio Backend

The backend API for Boldcraft, an artist portfolio. Handles image uploads, processing, and management. Built with Node.js and TypeScript.

---

## Stack

- **Runtime**: Node.js with TypeScript (`tsx` for development)
- **Framework**: Express
- **Image processing**: Sharp
- **Cloud storage**: Cloudinary
- **Database**: PostgreSQL + Prisma 7
- **File handling**: Multer (memory storage)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt
- **Validation**: Multer file filter + `file-type` magic bytes check
- **Rate limiting**: `express-rate-limit`

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma
├── prisma.config.ts
├── src/
│   ├── generated/
│   │   └── prisma/          # Prisma-generated client (do not edit)
│   ├── auth.ts              # JWT sign, verify, requireAuth middleware
│   ├── db.ts                # Prisma client singleton
│   ├── seed.ts              # Creates the owner account
│   ├── sharp.ts             # Image processing pipeline
│   ├── validation.ts        # Multer filter + magic bytes check
│   └── index.ts             # Express app and routes
├── .env
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a hosted instance)
- A Cloudinary account

---

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment variables**

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/boldcraft
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_long_random_secret_here
OWNER_EMAIL=you@example.com
OWNER_PASSWORD=yourpassword
PORT=3001
```

**3. Create the database**

```bash
psql -U postgres -c "CREATE DATABASE boldcraft;"
```

**4. Run migrations**

```bash
npx prisma migrate dev --name init
```

**5. Generate the Prisma client**

```bash
npx prisma generate
```

**6. Seed the owner account**

```bash
npm run seed
```

Only needs to be run once. Creates the owner account using the credentials in `.env`.

**7. Start the dev server**

```bash
npm run dev
```

---

## API

Routes marked 🔒 require an `Authorization: Bearer <token>` header.

---

### Login

```
POST /api/auth/login
Content-Type: application/json
```

**Body**

```json
{ "email": "owner@example.com", "password": "yourpassword" }
```

**Response**

```json
{ "token": "eyJhbGci..." }
```

---

### Upload an image 🔒

```
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form fields**

| Field         | Required | Description                        |
|---------------|----------|------------------------------------|
| `file`        | Yes      | Image file (JPEG, PNG, or WebP)    |
| `title`       | No       | Display title                      |
| `description` | No       | Caption or description             |
| `category`    | No       | Category name e.g. `landscape`     |
| `tags`        | No       | Comma-separated e.g. `oil,canvas`  |

Validates the file at both the Multer level (mimetype, 5MB size limit) and magic bytes level. Processes the image into three variants (thumbnail, medium, full), uploads all three to Cloudinary, and saves the record to the database. Rate limited to 20 requests per 15 minutes.

**Response**

```json
{
  "id": "cmqzslw710000y855njdhri5j",
  "baseId": "1782772314603-4hf8ptmfp5d",
  "filename": "painting.png",
  "mimetype": "image/png",
  "size": 62082,
  "title": "Sunset over Lagos",
  "description": "Oil on canvas, 2026",
  "category": "landscape",
  "tags": ["oil", "canvas", "sunset"],
  "uploadedAt": "2026-06-29T22:31:57.757Z",
  "variants": [
    { "name": "thumbnail", "url": "https://res.cloudinary.com/...", "publicId": "portfolio/thumbnail/..." },
    { "name": "medium",    "url": "https://res.cloudinary.com/...", "publicId": "portfolio/medium/..." },
    { "name": "full",      "url": "https://res.cloudinary.com/...", "publicId": "portfolio/full/..." }
  ]
}
```

---

### List images

```
GET /api/images?page=1&limit=20&category=landscape&tag=oil
```

Public endpoint. Returns paginated images with their variants, ordered by most recent upload. Supports optional filtering by category and tag.

| Query param | Default | Description               |
|-------------|---------|---------------------------|
| `page`      | `1`     | Page number               |
| `limit`     | `20`    | Results per page (max 50) |
| `category`  | —       | Filter by category        |
| `tag`       | —       | Filter by tag             |

**Response**

```json
{
  "data": [
    {
      "id": "cmqzslw710000y855njdhri5j",
      "title": "Sunset over Lagos",
      "category": "landscape",
      "tags": ["oil", "canvas"],
      "uploadedAt": "2026-06-29T22:31:57.757Z",
      "variants": [ ... ]
    }
  ],
  "meta": {
    "total": 43,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get single image

```
GET /api/images/:id
```

Public endpoint. Returns a single image with all its variants and metadata.

**Response**

```json
{
  "id": "cmqzslw710000y855njdhri5j",
  "title": "Sunset over Lagos",
  "description": "Oil on canvas, 2026",
  "category": "landscape",
  "tags": ["oil", "canvas", "sunset"],
  "uploadedAt": "2026-06-29T22:31:57.757Z",
  "variants": [ ... ]
}
```

---

### Delete an image 🔒

```
DELETE /api/images/:id
Authorization: Bearer <token>
```

Deletes all Cloudinary variants first, then removes the database record. `ImageVariant` rows are cascade-deleted automatically.

**Response**

```json
{ "success": true }
```

---

## Image Processing

Each upload is processed by Sharp before being sent to Cloudinary:

| Variant   | Dimensions | Fit    |
|-----------|------------|--------|
| thumbnail | 200 × 200  | cover  |
| medium    | 800 × 800  | inside |
| full      | original   | —      |

All variants are converted to WebP at 85% quality. EXIF metadata is stripped from all outputs. Images are never upscaled beyond their original dimensions.

---

## Database Schema

```prisma
model Owner {
  id       String @id @default(cuid())
  email    String @unique
  password String
}

model Image {
  id          String         @id @default(cuid())
  baseId      String         @unique
  filename    String
  mimetype    String
  size        Int
  title       String?
  description String?
  category    String?
  tags        String[]
  uploadedAt  DateTime       @default(now())
  variants    ImageVariant[]
}

model ImageVariant {
  id       String @id @default(cuid())
  imageId  String
  name     String
  url      String
  publicId String
  image    Image  @relation(fields: [imageId], references: [id], onDelete: Cascade)
}
```

---

## Scripts

| Command          | Description                         |
|------------------|-------------------------------------|
| `npm run dev`    | Start dev server with hot reload    |
| `npm run build`  | Compile TypeScript to `dist/`       |
| `npm start`      | Run compiled production build       |
| `npm run seed`   | Create the owner account (run once) |

---

## Notes

- This project uses Prisma 7 with the new `prisma-client` provider and `@prisma/adapter-pg`. The generated client lives in `src/generated/prisma/` rather than `node_modules`.
- `findFirst` is used instead of `findUnique` for single record lookups due to a known issue with `findUnique` and the `PrismaPg` adapter.
- Cloudinary deletion always runs before database deletion to avoid orphaned files.
- File validation runs at two layers: Multer rejects invalid mimetypes before the buffer is fully read, and `file-type` checks the magic bytes of the buffer to catch spoofed extensions.
- JWT tokens expire after 7 days. The owner simply logs in again to get a new token.
- Never commit `.env` to version control. Use `.env.example` with placeholder values instead.