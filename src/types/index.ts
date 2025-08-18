// src/types/index.ts

// --- Interfaces for Filter Data (used in page.tsx for dropdowns) ---
export interface ApiNeighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ApiFilterVenue {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ApiFilterGenre {
  id: string;
  name: string;
}

// --- Interfaces for the actual Concert Data Structure from /api/shows ---

export interface ApiConcertVenue {
  venue_id: string;
  name: string;
  city: string;
  state: string;
  neighborhood_name: string | null;
  neighborhood_id?: string;
}

// --- FIX: Corrected to match the actual database schema ---
export interface OpenerMedia {
  name: string;
  youtube_id_1: string | null; // Restored this field
  // videos array removed as it's not in the DB
}

// --- FIX: Corrected to match the actual database schema ---
export interface ApiConcertHeadliner {
  artist_id: string;
  name: string;
  hometown: string | null;
  spotify_url: string | null; 
  instagram_url?: string | null;
  tiktok_url?: string | null;
  is_hometown_show: boolean;
  artist_thumbnail_url: string | null;
  artist_display_image_url: string | null;
  short_bio: string | null;
  youtube_video_id_1: string | null; // Restored this field
  youtube_video_id_2: string | null; // Restored this field
  openers_string?: string | null;
  image_url?: string | null;
}

export interface ApiConcertPriceInfo {
  min: number | null;
  currency: string;
}

export interface ApiConcert {
  show_id: string;
  show_date: string;
  show_time: string | null;
  doors_time: string | null;
  age_restriction?: string | null;

  venue: ApiConcertVenue;
  headliner: ApiConcertHeadliner;
  openers_media: OpenerMedia[];

  price_info: ApiConcertPriceInfo;
  description: string | null;
  is_featured: boolean;
  is_hometown_show: boolean;
  ticket_url: string | null;
  event_info_url: string | null;
  event_image_url: string | null;
}

export interface RichShow {
  show_id: string;
  show_date: string;
  artist_name: string;
  artist_id: string;
  min_price: number | null;
}

export interface ApiShowsResponse {
  page: number;
  limit: number;
  totalCount: number;
  shows: ApiConcert[];
}

export interface NeighborhoodMap {
  [id: string]: string;
}

export interface NowPlayingInfo {
  artistName: string;
  showId?: string;
  showDate?: string;
  venueName?: string;
  ticketUrl?: string | null;
}

export interface FestivalArtist extends ApiConcert {
  day_playing: string | null;
  stage_name?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  tier?: string | null;
}

export interface FestivalPageData {
  name: string;
  year: number;
  heroImageUrl: string;
  dates: string;
  location: string;
  lineup: FestivalArtist[];
}