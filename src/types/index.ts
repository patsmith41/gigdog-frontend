// src/types/index.ts

export interface ApiNeighborhood {
    id: string;
    name: string;
    city: string;
    state: string;
  }
  
  export interface ApiConcertVenue {
    venue_id: string;
    name: string;
    neighborhood_name: string | null; // This will be populated on the client-side
    neighborhood_id?: string; // The ID from the API to look up the name
  }
  
  export interface ApiConcertHeadliner {
    artist_id: string;
    name: string;
    image_url: string | null; // Raw URL: current logic is shows.primary_display_image_url (from shows.event_image_url) || artists.artist_profile_image_url
    // ImageKit URLs will be added later to replace/supplement this:
    // artist_thumbnail_url_imagekit?: string | null;
    // artist_display_image_url_imagekit?: string | null;
    is_hometown_show: boolean;
    short_bio: string | null; // From rich_shows_view (artist_short_bio)
    youtube_video_id_1: string | null; // From rich_shows_view (youtube_video_id_1)
    youtube_video_id_2: string | null; // From rich_shows_view (youtube_video_id_2)
  }
  
  export interface ApiConcertPriceInfo {
    min: number | null;
    currency: string; // Defaulted to 'USD' in API if null
  }
  
  // This type represents a concert object as transformed by the GET /api/shows endpoint in index.js
  // It should match the structure produced by your `formattedShows.map(...)`
  export interface ApiConcert {
    show_id: string;
    show_date: string; // "YYYY-MM-DD"
    show_time: string | null; // "HH:mm:ss" | null
    doors_time: string | null; // "HH:mm:ss" | null - Mapped from rich_shows_view
    venue: ApiConcertVenue; // The mapping in index.js ensures venue is an object
    headliner: ApiConcertHeadliner; // The mapping in index.js ensures headliner is an object
    price_info: ApiConcertPriceInfo; // The mapping in index.js ensures price_info is an object
    description: string | null; // Combined from view's venue_provided_description, generated_blurb, show_notes
    is_featured: boolean;
    ticket_url: string | null;
    event_info_url: string | null;
    event_image_url: string | null; // This is show.show_event_image_url from your mapping
                                     // Note: headliner.image_url also uses a show image (primary_display_image_url) as a primary source.
  }
  
  // For the full GET /api/shows response structure
  export interface ApiShowsResponse {
    page: number;
    limit: number;
    totalCount: number;
    shows: ApiConcert[];
  }
  
  // For the neighborhood map used in page.tsx
  export interface NeighborhoodMap {
    [id: string]: string; // { neighborhood_id: neighborhood_name }
  }