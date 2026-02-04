import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

let novelsCache = null;

export default {
  async getNovels() {
    if (novelsCache) {
      return Promise.resolve({ data: novelsCache });
    }
    const response = await apiClient.get("");
    novelsCache = response.data;
    return response;
  },
  async getNovelBySlug(slug) {
    try {
      let books;
      if (novelsCache) {
        books = novelsCache;
      } else {
        const response = await apiClient.get("");
        books = response.data;
        novelsCache = books;
      }

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

      return foundNovel || null;
    } catch (error) {
      console.error("Error fetching novel by slug:", error);
      return null;
    }
  },
  postNovels(novel) {
    // Invalidate cache on new post just in case (though context implies read-heavy)
    novelsCache = null;
    return apiClient.post('/novels', novel)
  }
};
