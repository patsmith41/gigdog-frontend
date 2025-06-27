// src/types/index.ts

// --- Interfaces for Filter Data (used in page.tsx for dropdowns) ---
export interface ApiNeighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ApiFilterVenue { // Was 'ApiVenue' in your file, renamed for clarity
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ApiFilterGenre { // Was 'ApiGenre' in your file, renamed for clarity
  id: string;
  name: string;
}

// --- Interfaces for the actual Concert Data Structure from /api/shows ---

// For the venue object nested within an ApiConcert object
export interface ApiConcertVenue {
  venue_id: string;
  name: string;
  city: string;    // Provided by API, useful for map links
  state: string;   // Provided by API, useful for map links
  neighborhood_name: string | null;
  neighborhood_id?: string; // Provided by API
  // street_address?: string | null; // API does not send this for /api/shows list
}

// For individual opener objects in the openers_media array
export interface OpenerMedia {
  name: string;
  youtube_id_1: string | null; // Opener's primary YouTube ID
}

// For the headliner object nested within an ApiConcert object
export interface ApiConcertHeadliner {
  artist_id: string;
  name: string;
  hometown: string | null; // Actual hometown from artist record
  is_hometown_show: boolean;
  artist_thumbnail_url: string | null; // ImageKit URL for 64x64 thumbnail (from API)
  artist_display_image_url: string | null; // ImageKit URL for 16:9 landscape (from API)
  short_bio: string | null;          // 100-125 word bio (from API)
  youtube_video_id_1: string | null; // Headliner's primary YouTube video ID
  youtube_video_id_2: string | null; // Headliner's secondary YouTube video ID
  openers_string?: string | null;   // Generated string like "w/ Opener A, Opener B"
  image_url?: string | null; // Fallback: if your components still use this for raw headliner image_url from artist record
                             // Ideally, components should transition to artist_thumbnail_url/artist_display_image_url
}

// For the price_info object nested within an ApiConcert object
export interface ApiConcertPriceInfo {
  min: number | null;
  currency: string; // Defaults to 'USD' in API if null
  // max_price is not sent by /api/shows list for MVP
}

// Main concert object type received for each show from the /api/shows endpoint
export interface ApiConcert {
  show_id: string;
  show_date: string; // "YYYY-MM-DD"
  show_time: string | null; // "HH:mm:ss" | null
  doors_time: string | null; // "HH:mm:ss" | null
  age_restriction?: string | null; // Available from API (can be null)

  venue: ApiConcertVenue;
  headliner: ApiConcertHeadliner;
  openers_media: OpenerMedia[]; // Array of {name, youtube_id_1} for up to 3 openers

  price_info: ApiConcertPriceInfo;
  description: string | null;
  is_featured: boolean;
  ticket_url: string | null;
  event_info_url: string | null;
  event_image_url: string | null; // This is the raw primary_display_image_url from the view (original show image)
}

// For the full GET /api/shows response structure (includes pagination info)
export interface ApiShowsResponse {
  page: number;
  limit: number;
  totalCount: number;
  shows: ApiConcert[];
}

// For the neighborhood map (if still used client-side, though API provides neighborhood_name in venue)
export interface NeighborhoodMap {
  [id: string]: string;
}

export interface NowPlayingInfo {
  artistName: string;
  //videoTitle?: string;    // Optional: e.g., "Primary Preview", "Live at Venue X"
  showId?: string;        // For linking to a specific show details page (future)
  showDate?: string;      // For display "Playing at [Venue] on [Date]"
  venueName?: string;     // For display
  ticketUrl?: string | null;// For a direct "Get Tickets for this Show" link
  //hometown?: string | null; // Artist's hometown (primarily for headliner)
  // You could add artist_id here if you want to fetch more artist details for the sidebar later
  // artistId?: string;
}

// ADD THIS NEW TYPE for the festival artist data
export interface FestivalArtist extends ApiConcert {
  day_playing: string | null;
}

// ADD THIS NEW TYPE for the overall festival page data
export interface FestivalPageData {
  name: string;
  year: number;
  heroImageUrl: string;
  dates: string;
  location: string;
  lineup: FestivalArtist[];
}