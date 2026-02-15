const fs = require('fs');
const path = require('path');
const https = require('https');

const booksPath = path.join(__dirname, '../public/books.json');
const coversDir = path.join(__dirname, '../public/covers');

// Helper for fuzzy matching titles
function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/^(the|a|an)\s+/i, '') // Remove articles
        .split(':')[0] // Remove subtitles
        .split('(')[0] // Remove parentheses
        .replace(/ and other stories/i, '')
        .replace(/ mystery/i, '')
        .replace(/ collection/i, '')
        .replace(/ paperback/i, '')
        .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric
}

function fetchBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const url = `https://openlibrary.org/isbn/${isbn}.json`;
        const options = {
            headers: {
                'User-Agent': 'AgathaChristieBookApp/1.0 (carlos@example.com)'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            // Follow redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                const newUrl = res.headers.location;
                // console.log(`  Following redirect to ${newUrl}`);
                https.get(newUrl, options, (res2) => {
                    let data2 = '';
                    res2.on('data', chunk => data2 += chunk);
                    res2.on('end', () => {
                        try {
                            resolve(JSON.parse(data2));
                        } catch (e) { resolve(null); }
                    });
                }).on('error', reject);
                return;
            }

            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    // console.log(`  API Error ${res.statusCode} for ${isbn}`);
                    resolve(null);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mapCovers() {
    console.log('Starting cover mapping...');
    const files = fs.readdirSync(coversDir);
    const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
    let updatedCount = 0;

    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png|avif|webp)$/)) continue;

        // Match ISBN 13 or 10, prioritize 13
        const isbnMatch = file.match(/^(\d{13}|\d{10})/);
        if (!isbnMatch) {
            console.log(`Skipping file without ISBN: ${file}`);
            continue;
        }

        const isbn = isbnMatch[0];
        // console.log(`Processing ISBN: ${isbn} (${file})`);

        try {
            const data = await fetchBookByISBN(isbn);
            if (!data || !data.title) {
                console.log(`  No data found for ISBN ${isbn}`);
                continue;
            }

            const title = data.title;
            const normTitle = normalize(title);

            // Find in books.json
            const book = books.find(b => {
                if (!b.title_en) return false;
                const bTitle = normalize(b.title_en);
                return bTitle === normTitle || bTitle.includes(normTitle) || normTitle.includes(bTitle);
            });

            if (book) {
                if (book.image_en !== `/covers/${file}`) {
                    const oldImage = book.image_en;
                    book.image_en = `/covers/${file}`;
                    updatedCount++;
                    console.log(`  MATCH: "${title}" (${normTitle}) -> "${book.title_en}"`);
                } else {
                    // console.log(`  Already mapped: "${title}"`);
                }
            } else {
                console.log(`  NO MATCH in books.json for "${title}" (${normTitle})`);
            }

            // Be nice to API
            await timeout(200);

        } catch (error) {
            console.error(`  Error processing ${isbn}:`, error.message);
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
        console.log(`\nUpdated ${updatedCount} books in books.json`);
    } else {
        console.log('\nNo updates made.');
    }
}

mapCovers();
