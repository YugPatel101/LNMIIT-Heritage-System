# API

This project has **no backend and exposes no API endpoints**. It contains no route handlers, server actions or middleware. Every page is pre-rendered to a static file.

## External request made by the browser

The 3D campus map requests satellite imagery directly from Esri. No key or authentication is used, and the tiles are not stored in this repository.

| Method | URL | Purpose | Authentication |
| --- | --- | --- | --- |
| GET | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | Ground and roof imagery | None |

- **Response:** a map tile image.
- **On failure:** the buildings still show on a plain ground with a notice.
- **Defined in:** `src/components/campus-imagery.js`.

Everything else on the site that points outside it is an ordinary link for the visitor to follow.
