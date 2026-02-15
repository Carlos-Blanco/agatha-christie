const fs = require('fs');
const path = require('path');

const booksPath = path.join(__dirname, '../public/books.json');
const coversDir = path.join(__dirname, '../public/covers');

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
        .replace(/_/g, ' ') // Replace underscores with spaces (for filenames)
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/\b(us|pb|jacket|cover|revisedart|finalart|vfai)\b/g, '') // Remove common filename junk
        .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric
}

const manualMap = {
    "The Murder of Roger Ackroyd": "Jacket_MORAUS21.avif",
    "Death on the Nile": "Jacket_DOTN_US_24.avif",
    "They Came to Baghdad": "ThayCameToBaghdad_pb-c.avif",
    "A Caribbean Mystery": "Jacket_ACMUS.avif", // ACM = A Caribbean Mystery
    "Hercule Poirot's Christmas": "Jacket_HCPUS21.avif", // HCP = Hercule Christmas Poirot? Or Hercule Poirot's Christmas? - Assuming this based on matching letters.
    "Hallowe'en Party": "Halloween-Part-v2.avif", // 'Part' instead of 'Party'
    "The Regatta Mystery": "regatta_mystery.avif",
    "Double Sin": "double_sin_PB.avif",
    "Three Blind Mice": "three-blind-mice-and-other-stories-PB.avif",
    "The Under Dog": "the_under_dog_PB.avif",
    "The Monogram Murders": "monogram-murders.avif",
    "Closed Casket": "Jacket_ClosedCasketUS.avif",
    "The Mystery of Three Quarters": "Mystery-of-Three-Quarters-US-cover-reveal-small.avif",
    "The Killings at Kingfisher Hill": "TKAKH_USPB.avif",
    "Hercule Poirot's Silent Night": "Hercule-Poirots-Silent-Night-2.avif",
    "The Thirteen Problems": "Jacket_MissMarpleTheCompleteShortStories_US.avif",
    "The Listerdale Mystery": "listerdale-mistery.jpg",
    "Poirot's Early Cases": "early-cases.jpg",
    "Miss Marple's Final Cases": "final-cases.jpg",
    "Problem at Pollensa Bay": "problem-at-pollensa.jpg",
    "The Edge": "the-edge.jpg",
    "The Adventure of the Christmas Pudding": "christmas-pudding.jpg"
};

function updateEnglishCovers() {
    console.log('Starting English cover update...');

    if (!fs.existsSync(booksPath)) {
        console.error(`books.json not found at ${booksPath}`);
        return;
    }

    if (!fs.existsSync(coversDir)) {
        console.error(`Covers directory not found at ${coversDir}`);
        return;
    }

    const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
    const covers = fs.readdirSync(coversDir).filter(file => file.match(/\.(jpg|jpeg|png|avif|webp)$/));

    console.log(`Found ${books.length} books and ${covers.length} covers.`);

    let updatedCount = 0;
    let matchedCount = 0;

    books.forEach(book => {
        if (!book.title_en) return;

        const normTitle = normalize(book.title_en);
        let match = null;

        // Check manual map first
        if (manualMap[book.title_en]) {
            const mappedFile = manualMap[book.title_en];
            if (covers.includes(mappedFile)) {
                match = mappedFile;
            }
        }

        if (!match) {
            // Try to find a match in covers
            for (const cover of covers) {
                const normCover = normalize(cover);

                // basic containment check
                if (normCover.length > 3 && (normCover.includes(normTitle) || normTitle.includes(normCover))) {
                    match = cover;
                    break;
                }
            }
        }

        const currentImage = book.image_en;
        let newImage = "";

        if (match) {
            newImage = `/covers/${match}`;
            matchedCount++;
            // console.log(`MATCH: "${book.title_en}" -> ${match}`);
        } else {
            // console.log(`NO MATCH: "${book.title_en}"`);
        }

        if (currentImage !== newImage) {
            book.image_en = newImage;
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
        console.log(`\nUpdated ${updatedCount} books in books.json`);
        console.log(`Total matched: ${matchedCount}`);
    } else {
        console.log('\nNo updates made.');
    }
}

updateEnglishCovers();
