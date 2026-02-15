
const fs = require('fs');
const path = require('path');
const https = require('https');

const booksFilePath = path.join(__dirname, '../public/books.json');
const books = JSON.parse(fs.readFileSync(booksFilePath, 'utf8'));

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Status Code: ${res.statusCode}`));
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.setTimeout(timeout, () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
};

async function fetchHarperCover(title) {
    // Search specifically for HarperCollins editions
    // We try variations of the publisher name to be safe
    const query = encodeURIComponent(`title:${title} publisher:Harper Collins`);
    const url = `https://openlibrary.org/search.json?q=${query}&limit=5`;

    try {
        const data = await fetchWithTimeout(url);
        const response = JSON.parse(data);

        if (response.docs && response.docs.length > 0) {
            // Look for a doc with a cover_i
            const docWithCover = response.docs.find(doc => doc.cover_i);

            if (docWithCover) {
                console.log(`Found Harper Collins cover for: ${title}`);
                // Use 'L' for large size cover
                return `https://covers.openlibrary.org/b/id/${docWithCover.cover_i}-L.jpg`;
            }
        }

        // Fallback: simple search if specific publisher search fails (maybe it's listed as just "Harper")
        console.log(`No specific Harper Collins cover found, trying broader search for: ${title}`);
        const fallbackQuery = encodeURIComponent(`title:${title} publisher:Harper`);
        const fallbackUrl = `https://openlibrary.org/search.json?q=${fallbackQuery}&limit=5`;

        const fallbackData = await fetchWithTimeout(fallbackUrl);
        const fallbackResponse = JSON.parse(fallbackData);

        if (fallbackResponse.docs && fallbackResponse.docs.length > 0) {
            const fallbackDoc = fallbackResponse.docs.find(doc => doc.cover_i);
            if (fallbackDoc) {
                console.log(`Found 'Harper' cover for: ${title}`);
                return `https://covers.openlibrary.org/b/id/${fallbackDoc.cover_i}-L.jpg`;
            }
        }

        console.log(`No cover found for: ${title}`);
        return null;
    } catch (error) {
        console.error(`Error fetching cover for ${title}:`, error.message);
        return null;
    }
}

async function updateBooks() {
    let updatedCount = 0;

    for (const book of books) {
        // Use title_en if available (it should be from previous step), otherwise title
        const searchTitle = book.title_en || book.title;
        console.log(`Processing: ${searchTitle}...`);

        const coverUrl = await fetchHarperCover(searchTitle);

        if (coverUrl) {
            book.image_en = coverUrl;
            updatedCount++;
        } else {
            // If we already have an image_en from the previous run (generic English), keep it or prompt?
            // The requirement is to 'Utiliza las portadas de Harper Collins', implies replacement.
            // If we really can't find a HC one, maybe we should keep the old one if it exists, or leave it.
            // For now, if we don't find a new one, we don't overwrite if it exists, OR we could accept the fallback.
            // The script already tries to find *something*. 
            console.log(`Skipping update for ${searchTitle} (no new cover found)`);
        }

        // Be nice to the API
        await wait(1000);
    }

    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
    console.log(`Updated ${updatedCount} books with new covers.`);
}

updateBooks();
