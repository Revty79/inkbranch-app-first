import type { Book } from "@inkbranch/types";
import { sampleBooks } from "../constants/sampleBook";

export interface StorySummary {
  id: string;
  title: string;
  author: string;
  logline: string;
  genre: string[];
}

export function listStorySummaries(books: Book[] = sampleBooks): StorySummary[] {
  return books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    logline: book.logline,
    genre: book.genre
  }));
}

export function findBookById(bookId: string, books: Book[] = sampleBooks): Book | undefined {
  return books.find((book) => book.id === bookId);
}
