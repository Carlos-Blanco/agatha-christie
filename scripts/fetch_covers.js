const fs = require('fs');
const https = require('https');
const path = require('path');

const booksPath = path.join(__dirname, '../public/books.json');
const books = require(booksPath);

const fetchCover = (title) => {
    return new Promise((resolve, reject) => {
        const query = encodeURIComponent(title);
        const url = `https://openlibrary.org/search.json?title=${query}&author=Agatha%20Christie&limit=1`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.docs && response.docs.length > 0) {
                        const book = response.docs[0];
                        if (book.cover_i) {
                            const cover = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
                            resolve(cover);
                        } else {
                            console.log(`Title: ${title} - Found in OL but no cover_i`);
                            resolve(null);
                        }
                    } else {
                        console.log(`Title: ${title} - Not found in OL`);
                        resolve(null);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
};

const processBooks = async () => {
    let updatedCount = 0;
    for (const book of books) {
        if (book.title_en && !book.image_en) {
            console.log(`Fetching cover for: ${book.title_en}...`);
            try {
                const coverUrl = await fetchCover(book.title_en);
                if (coverUrl) {
                    book.image_en = coverUrl;
                    updatedCount++;
                    console.log(`  Found: ${coverUrl}`);
                } else {
                    console.log(`  No cover found.`);
                }
                // Be nice to the API
                await new Promise(r => setTimeout(r, 200));
            } catch (err) {
                console.error(`  Error fetching ${book.title_en}:`, err.message);
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(booksPath, JSON.stringify(books, null, 4));
        console.log(`Updated ${updatedCount} books with English covers.`);
    } else {
        console.log('No new covers found or updated.');
    }
};

processBooks();
