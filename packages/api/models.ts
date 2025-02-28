export interface User {
  id: number;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  favoriteSongs?: FavoriteSong[];
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  year: number;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
}

export interface FavoriteSong {
  userId: number;
  songId: number;
  song?: Song;
  user?: User;
  createdAt: Date;
}

export interface ResponsePagination<T> {
  data: T[];
  meta: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
}

export interface ResponseList<T> {
  data: T[];
}

export interface ResponseSingle<T> {
  data: T;
}
