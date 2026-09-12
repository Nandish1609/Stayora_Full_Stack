# Stayora

**Find a place. Make it yours.**

Stayora is a full-stack accommodation-listing web application. Visitors can explore places to stay, while registered users can publish and manage their own listings, upload photos, save favourites, and leave reviews. The application renders server-side views with EJS and stores application data and sessions in MongoDB.

## Features

- Browse accommodation listings with pricing in INR
- Create, edit, and delete listings with owner-only access control
- Upload listing images to Cloudinary
- Convert a listing's location and country to map coordinates with OpenStreetMap Nominatim
- Display listing locations with Leaflet and OpenStreetMap tiles
- Sign up, log in, and log out with Passport local authentication
- Persist login sessions in MongoDB
- Save and remove favourite listings
- Add ratings and reviews; only the review author can remove a review
- Validate listing and review input with Joi and show flash messages for key actions

## Technology

| Area | Tools |
| --- | --- |
| Runtime | Node.js 24.13.0 |
| Server | Express 5 |
| Views | EJS with ejs-mate |
| Database | MongoDB with Mongoose |
| Authentication | Passport, passport-local, passport-local-mongoose |
| Sessions | express-session and connect-mongo |
| Uploads | Multer, Cloudinary, multer-storage-cloudinary |
| Validation | Joi |
| Maps & geocoding | Leaflet, OpenStreetMap, Nominatim |

## Requirements

- Node.js `24.13.0` (as specified in `package.json`)
- A MongoDB deployment (MongoDB Atlas or a compatible instance)
- A Cloudinary account for listing-image uploads

## Getting started

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd Stayora
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root. Use the following template, replacing every placeholder with your own credentials:

   ```env
   ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
   SECRET=<a-long-random-session-secret>
   CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUD_API_KEY=<your-cloudinary-api-key>
   CLOUD_API_SECRET=<your-cloudinary-api-secret>
   PORT=4040
   ```

4. Start the application.

   ```bash
   npm start
   ```

   For development with automatic server restarts:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:4040](http://localhost:4040).

> Keep `.env` private. It is already ignored by Git and must never be committed with real database, Cloudinary, or session credentials.

## Application routes

| Method | Route | Description | Access |
| --- | --- | --- | --- |
| GET | `/` | Redirects to listings | Public |
| GET | `/listings` | Browse all listings | Public |
| GET | `/listings/new` | New-listing form | Signed in |
| POST | `/listings` | Create a listing and upload its image | Signed in |
| GET | `/listings/:id` | View a listing, its reviews, and map | Public |
| GET | `/listings/:id/edit` | Edit-listing form | Listing owner |
| PUT | `/listings/:id` | Update a listing | Listing owner |
| DELETE | `/listings/:id` | Delete a listing and its reviews | Listing owner |
| POST | `/listings/:id/reviews` | Add a review | Signed in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review author |
| GET | `/favourites` | View saved listings | Signed in |
| POST | `/listings/:id/favourite` | Save a listing | Signed in |
| DELETE | `/listings/:id/favourite` | Remove a saved listing | Signed in |
| GET / POST | `/signup` | Registration form / create account | Public |
| GET / POST | `/login` | Sign-in form / authenticate | Public |
| GET | `/logout` | End the current session | Signed in |

HTML forms use `?_method=PUT` and `?_method=DELETE` for update and delete actions through `method-override`.

## Project structure

```text
Stayora/
|-- controllers/       # Request handlers for listings, reviews, users, and favourites
|-- models/            # Mongoose models: Listing, Review, User
|-- routes/            # Express routers
|-- views/             # EJS layouts, partials, and page templates
|-- public/            # CSS, client-side JavaScript, and static images
|-- utils/             # Async wrapper and custom error class
|-- init/              # Optional local data-seeding source
|-- cloudConfig.js     # Cloudinary/Multer storage configuration
|-- middleware.js      # Authentication, authorization, and validation middleware
|-- schema.js          # Joi request schemas
`-- server.js          # Application entry point
```

## Data model

- **User** - email, Passport-managed username/password hash, and favourite listings.
- **Listing** - title, description, photo metadata, nightly price, location, country, GeoJSON point, owner, and reviews.
- **Review** - rating (1-5), comment, creation time, and author.

Deleting a listing also removes its associated reviews and removes that listing from users' favourites.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Run the production server with Node.js |
| `npm run dev` | Run the server in watch mode |
| `npm test` | Reports that automated tests have not yet been configured |

## Notes for deployment

- Set `NODE_ENV=production` and provide all environment variables through your hosting provider.
- Use a production MongoDB connection string in `ATLASDB_URL`; it is also used by the session store.
- Make sure the deployment platform permits outbound connections to Cloudinary and OpenStreetMap/Nominatim.
- Configure a strong, unique `SECRET` before deploying.

## License

This project is licensed under the [ISC License](https://opensource.org/license/isc-license-txt/), as declared in `package.json`.
