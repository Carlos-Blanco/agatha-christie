
import json

protagonists = {
    0: "Hercule Poirot",
    1: "Tommy & Tuppence",
    2: "Hercule Poirot",
    3: "Anne Beddingfeld",
    4: "Hercule Poirot",
    5: "Superintendent Battle",
    6: "Hercule Poirot",
    7: "Hercule Poirot",
    8: "Hercule Poirot",
    9: "Tommy & Tuppence",
    10: "Superintendent Battle",
    11: "Miss Marple",
    12: "Harley Quin",
    13: "Emily Trefusis",
    14: "Hercule Poirot",
    15: "Miss Marple",
    16: "Hercule Poirot",
    17: "Bobby Jones",
    18: "Miscellaneous",
    19: "Miscellaneous",
    20: "Hercule Poirot",
    21: "Parker Pyne",
    22: "Hercule Poirot",
    23: "Hercule Poirot",
    24: "Hercule Poirot",
    25: "Hercule Poirot",
    26: "Hercule Poirot",
    27: "Hercule Poirot",
    28: "Hercule Poirot",
    29: "Hercule Poirot",
    30: "Hercule Poirot",
    31: "Hercule Poirot",
    32: "Superintendent Battle",
    33: "Standalone",
    34: "Hercule Poirot",
    35: "Hercule Poirot",
    36: "Hercule Poirot",
    37: "Tommy & Tuppence",
    38: "Hercule Poirot",
    39: "Miss Marple",
    40: "Miss Marple",
    41: "Superintendent Battle",
    42: "Standalone",
    43: "Colonel Race",
    44: "Hercule Poirot",
    45: "Hercule Poirot",
    46: "Hercule Poirot",
    47: "Standalone",
    48: "Miss Marple",
    49: "Standalone",
    50: "Miss Marple",
    51: "Hercule Poirot",
    52: "Hercule Poirot",
    53: "Miss Marple",
    54: "Standalone",
    55: "Hercule Poirot",
    56: "Hercule Poirot",
    57: "Miss Marple",
    58: "Standalone",
    59: "Hercule Poirot",
    60: "Hercule Poirot",
    61: "Standalone",
    62: "Miss Marple",
    63: "Hercule Poirot",
    64: "Miss Marple",
    65: "Miss Marple",
    66: "Hercule Poirot",
    67: "Standalone",
    68: "Tommy & Tuppence",
    69: "Hercule Poirot",
    70: "Standalone",
    71: "Miss Marple",
    72: "Hercule Poirot",
    73: "Tommy & Tuppence",
    74: "Hercule Poirot",
    75: "Hercule Poirot",
    76: "Miss Marple",
    77: "Miss Marple",
    78: "Parker Pyne",
    79: "Hercule Poirot"
}

with open('/Users/carlos/Proyectos/agatha-christie/books.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

for book in books:
    book_id = book.get('id')
    if book_id in protagonists:
        book['protagonist'] = protagonists[book_id]
    else:
        book['protagonist'] = "Standalone"

with open('/Users/carlos/Proyectos/agatha-christie/books.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print("Updated books.json with protagonist information.")
