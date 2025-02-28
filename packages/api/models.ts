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
  favoriteSongs?: FavoriteSong[];
}

export interface FavoriteSong {
  userId: number;
  songId: number;
  song?: Song;
  user?: User;
  createdAt: Date;
}
