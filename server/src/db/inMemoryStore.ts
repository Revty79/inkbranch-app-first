import type { Book, ReaderRun, SceneResult } from "@inkbranch/types";
import { sampleBooks } from "@inkbranch/core";

export interface StoredRun {
  bookId: string;
  run: ReaderRun;
  scene: SceneResult;
}

export class InMemoryStore {
  private readonly books = new Map<string, Book>();
  private readonly runs = new Map<string, StoredRun>();

  constructor(books: Book[] = sampleBooks) {
    books.forEach((book) => {
      this.books.set(book.id, book);
    });
  }

  listBooks(): Book[] {
    return [...this.books.values()];
  }

  getBook(bookId: string): Book | undefined {
    return this.books.get(bookId);
  }

  saveRun(run: ReaderRun, scene: SceneResult): StoredRun {
    const record = {
      bookId: run.bookId,
      run,
      scene
    };

    this.runs.set(run.id, record);
    return record;
  }

  getRun(runId: string): StoredRun | undefined {
    return this.runs.get(runId);
  }
}
