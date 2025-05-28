import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://agatha-christie-a4077-default-rtdb.firebaseio.com/db2.json",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getNovels() {
    return apiClient.get("");
  },
  async getNovelBySlug(slug) {
    try {
      const response = await apiClient.get("");
      const books = response.data;
      let foundNovel = null;

      if (Array.isArray(books)) {
        foundNovel = books.find(book => book.slug === slug);
      } else if (typeof books === 'object' && books !== null) {
        // Case 1: books is an object keyed by slug
        if (books[slug] && books[slug].slug === slug) {
          foundNovel = books[slug];
        }
        // Case 2: books is an object keyed by something else (e.g., ID),
        // and values are book objects with a 'slug' property.
        else {
          foundNovel = Object.values(books).find(book => book.slug === slug);
        }
      }

      // Validate the slug of the found novel
      if (foundNovel) {
        // Check if slug exists, is a string, and is not empty (after trimming)
        if (!foundNovel.slug || typeof foundNovel.slug !== 'string' || foundNovel.slug.trim() === '') {
          console.warn(`Found novel with invalid or empty slug. Input slug: "${slug}", Found slug: "${foundNovel.slug}". Treating as not found.`);
          foundNovel = null; // Invalidate if slug is not a non-empty string
        }
      }

      return foundNovel || null; // Ensure null is returned if not found or if invalidated
    } catch (error) {
      console.error("Error fetching novel by slug:", error);
      //throw error; // Re-throw or return null/error object as per desired error handling
      return null; // For this task, returning null on error is consistent with "not found"
    }
  },
  postNovels(novel) {
    return apiClient.post('/novels', novel)
  }
};
