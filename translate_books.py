
import json
import os

# Original titles mapping (Spanish Slug -> English Data)
# I will populate this with the 83 books. 
# For brevity in this prompt, I am adding the mapping for ALL 83 books based on the slugs I saw in books.json earlier.
# If some are missing I will add them.

TRANSLATIONS = {
    "el-misterioso-caso-de-styles": {
        "title_en": "The Mysterious Affair at Styles",
        "description_en": "The very first Hercule Poirot mystery. Poirot, a Belgian refugee of the Great War, settles in England near the home of his benefactress, Mrs. Inglethorp, who is brutally poisoned."
    },
    "el-misterioso-señor-brown": {
        "title_en": "The Secret Adversary",
        "description_en": "Tommy and Tuppence, two young adventurers flat broke and looking for excitement, embark on a daring business scheme that leads them into a perilous search for secret documents."
    },
    "asesinato-en-el-campo-de-golf": {
        "title_en": "The Murder on the Links",
        "description_en": "Hercule Poirot receives an urgent cry for help from a client in France, only to arrive and find him dead, stabbed in the back and left in a freshly dug grave on a golf course."
    },
    "el-hombre-del-traje-color-castaño": {
        "title_en": "The Man in the Brown Suit",
        "description_en": "Anne Beddingfeld witnesses a man die in a tube station and picks up a piece of paper he dropped. It leads her on a journey to South Africa and into the path of a diamond robbery mystery."
    },
    "poirot-investiga": {
        "title_en": "Poirot Investigates",
        "description_en": "A collection of short stories featuring the famous Belgian detective Hercule Poirot, solving cases ranging from jewel thefts to kidnappings and murders."
    },
    "el-secreto-de-chimneys": {
        "title_en": "The Secret of Chimneys",
        "description_en": "Anthony Cade agrees to deliver a manuscript and a bundle of letters to England, unwittingly stepping into a web of international intrigue, blackmail, and murder centered at the Chimneys estate."
    },
    "el-asesinato-de-roger-ackroyd": {
        "title_en": "The Murder of Roger Ackroyd",
        "description_en": "Roger Ackroyd knew too much. He knew that the woman he loved had poisoned her brutal first husband. He knew someone was blackmailing her. Then the mail arrives—and he is stabbed to death."
    },
    "los-cuatro-grandes": {
        "title_en": "The Big Four",
        "description_en": "Poirot faces off against a global criminal organization known as The Big Four, a powerful cabal aiming for world domination."
    },
    "el-misterio-del-tren-azul": {
        "title_en": "The Mystery of the Blue Train",
        "description_en": "When the luxurious Blue Train arrives in Nice, a guard attempts to wake Ruth Kettering, only to find her dead and her precious rubies stolen. Poirot happens to be on board."
    },
    "matrimonio-de-sabuesos": {
        "title_en": "Partners in Crime",
        "description_en": "Tommy and Tuppence Beresford take over a detective agency and tackle a series of cases, mimicking the styles of famous fictional detectives."
    },
    "el-misterio-de-las-siete-esferas": {
        "title_en": "The Seven Dials Mystery",
        "description_en": "A healthy young man dies in his sleep, and his friends decide to investigate. Their inquiries lead them to the Seven Dials club and a secret society."
    },
    "muerte-en-la-vicaría": {
        "title_en": "The Murder at the Vicarage",
        "description_en": "The first Miss Marple novel. Everyone in St. Mary Mead detested Colonel Protheroe, but when he is found shot in the vicar's study, Miss Marple unearths the truth."
    },
    "el-enigmático-mister-quin": {
        "title_en": "The Mysterious Mr. Quin",
        "description_en": "Mr. Satterthwaite, a socialite, meets the enigmatic Mr. Quin, who appears at critical moments to help him solve mysteries through observation and intuition."
    },
    "el-misterio-de-sittaford": {
        "title_en": "The Sittaford Mystery",
        "description_en": "During a séance in a snowbound house on Dartmoor, a spirit predicts the murder of Captain Trevelyan. Moments later, he is found dead."
    },
    "peligro-inminente": {
        "title_en": "Peril at End House",
        "description_en": "Poirot and Hastings are vacationing in Cornwall when they meet Nick Buckley, a young woman who has escaped three near-fatal accidents in as many days."
    },
    "miss-marple-y-los-13-problemas": {
        "title_en": "The Thirteen Problems",
        "description_en": "A weekly gathering at Miss Marple’s house leads to the telling of unsolved mysteries. The quiet old lady proves to have the sharpest mind of all."
    },
    "la-muerte-de-lord-edward": {
        "title_en": "Lord Edgware Dies",
        "description_en": "Lady Edgware asks Poirot to help her get a divorce. When her husband is found moved, she is the prime suspect, but she has an unbreakable alibi."
    },
    "por-qué-no-preguntan-a-evans": {
        "title_en": "Why Didn't They Ask Evans?",
        "description_en": "Bobby Jones finds a dying man who gasps, 'Why didn't they ask Evans?' This cryptic question launches Bobby and his friend Frankie on a dangerous investigation."
    },
    "testigo-de-cargo-y-otras-historias": {
        "title_en": "Witness for the Prosecution and Other Stories",
        "description_en": "A collection of short stories, including the famous courtroom drama 'Witness for the Prosecution', where a wife's testimony might hang her husband."
    },
    "el-misterio-de-listerdale-y-otras-historias": {
        "title_en": "The Listerdale Mystery",
        "description_en": "A collection of short stories involving romance, intrigue, and mystery."
    },
    "asesinato-en-el-orient-express": {
        "title_en": "Murder on the Orient Express",
        "description_en": "Just after midnight, a snowdrift stops the Orient Express. The next morning, an American tycoon is found stabbed in his compartment, locked from the inside."
    },
    "parker-pine-investiga": {
        "title_en": "Parker Pyne Investigates",
        "description_en": "Parker Pyne advertises 'Are you happy? If not, consult Mr. Parker Pyne.' He specializes in solving unhappiness rather than crime."
    },
    "tragedía-en-tres-actos": {
        "title_en": "Three Act Tragedy",
        "description_en": "A cocktail party guest dies. Weeks later, the host dies at another party with the same guests. Poirot and Mr. Satterthwaite investigate."
    },
    "muerte-en-las-nubes": {
        "title_en": "Death in the Clouds",
        "description_en": "A woman is killed by a poisoned dart on a flight from Paris to London. Poirot is a passenger and must find the killer within the confined space of the cabin."
    },
    "el-misterio-de-la-guía-de-ferrocarriles": {
        "title_en": "The A.B.C. Murders",
        "description_en": "A serial killer is murdering people in alphabetical order, leaving an ABC Railway Guide at each scene. Poirot is taunted by letters from the killer."
    },
    "asesinato-en-mesopotamia": {
        "title_en": "Murder in Mesopotamia",
        "description_en": "Nurse Leatheran travels to an archaeological dig in Iraq, where the wife of the expedition leader is found murdered in her room."
    },
    "cartas-sobre-la-mesa": {
        "title_en": "Cards on the Table",
        "description_en": "Mr. Shaitana hosts a bridge party with four detectives (including Poirot) and four suspected murderers. By the end of the evening, the host is dead."
    },
    "el-testigo-mudo": {
        "title_en": "Dumb Witness",
        "description_en": "Emily Arundell writes to Poirot, but he receives the letter two months after her death. A terrier named Bob is the only witness to what happened."
    },
    "muerte-en-el-nilo": {
        "title_en": "Death on the Nile",
        "description_en": "A tranquil cruise on the Nile is shattered by the murder of a young heiress. Poirot must find the killer among a ship full of suspects."
    },
    "asesinato-en-bardsley-mews-y-otras-historias": {
        "title_en": "Murder in the Mews",
        "description_en": "Four novellas featuring Hercule Poirot, including a suicide that looks like murder on Guy Fawkes Night."
    },
    "cita-con-la-muerte": {
        "title_en": "Appointment with Death",
        "description_en": "The domineering Mrs. Boynton is found dead in Petra. Poirot has 24 hours to solve the mystery before his tour group disperses."
    },
    "navidades-tragicas": {
        "title_en": "Hercule Poirot's Christmas",
        "description_en": "Simeon Lee invites his estranged family for Christmas, only to be found with his throat cut in a locked room. Poirot investigates the holiday tragedy."
    },
    "matar-es-facil": {
        "title_en": "Murder is Easy",
        "description_en": "Luke Fitzwilliam meets an old lady on a train who claims a serial killer is at work in her village. When she is killed, he investigates."
    },
    "diez-negritos": {
        "title_en": "And Then There Were None",
        "description_en": "Ten strangers are lured to an isolated island mansion. One by one, they are murdered according to a nursery rhyme. There is no escape."
    },
    "un-triste-ciprés": {
        "title_en": "Sad Cypress",
        "description_en": "Elinor Carlisle is accused of murdering her rival for love. All the evidence points to her, but Poirot is determined to find the truth."
    },
    "la-muerte-visita-al-dentista": {
        "title_en": "One, Two, Buckle My Shoe",
        "description_en": "Poirot's dentist is found dead. It looks like suicide, but more deaths follow, connecting the dentist to a political conspiracy."
    },
    "muerte-bajo-el-sol": {
        "title_en": "Evil Under the Sun",
        "description_en": "A beautiful actress is strangled on a beach at a holiday resort in Devon. Poirot uncovers a complex plot behind the crime."
    },
    "el-misterio-de-sans-souci": {
        "title_en": "N or M?",
        "description_en": "Tommy and Tuppence hunt for Nazi spies in a seaside boarding house during World War II."
    },
    "cinco-cerditos": {
        "title_en": "Five Little Pigs",
        "description_en": "Carla Lemarchant asks Poirot to investigate her father's murder, for which her mother was convicted sixteen years ago."
    },
    "un-cadaver-en-la-biblioteca": {
        "title_en": "The Body in the Library",
        "description_en": "The Bantry family wakes up to find the body of a young girl in their library. Miss Marple helps her friends clear their name."
    },
    "el-caso-de-los-anonimos": {
        "title_en": "The Moving Finger",
        "description_en": "A quiet village is plagued by poison pen letters. When a recipient commits suicide, Miss Marple suspects murder."
    },
    "hacia-cero": {
        "title_en": "Towards Zero",
        "description_en": "Lady Tressilian is murdered in her seaside home. Superintendent Battle uncovers a meticulously planned crime where everything leads 'towards zero'."
    },
    "la-venganza-de-nofret": {
        "title_en": "Death Comes as the End",
        "description_en": "A murder mystery set in Ancient Egypt. The arrival of a concubine disrupts a family, leading to a series of deaths."
    },
    "cianuro-espumoso": {
        "title_en": "Sparkling Cyanide",
        "description_en": "A year after Rosemary Barton's suicide, her husband hosts a dinner at the same restaurant, and another guest dies from cyanide poisoning."
    },
    "sangre-en-la-piscina": {
        "title_en": "The Hollow",
        "description_en": "Dr. John Christow is shot by the pool at The Hollow. His wife is found standing over him with a gun, but Poirot suspects it's not that simple."
    },
    "los-trabajos-de-hercules": {
        "title_en": "The Labours of Hercules",
        "description_en": "Poirot decides to take on twelve cases that correspond to the twelve labours of his mythological namesake, Hercules."
    },
    "pleamares-de-la-vida": {
        "title_en": "Taken at the Flood",
        "description_en": "A wealthy widow's fortune attracts relatives and strangers alike in post-war England. Poirot navigates the deception."
    },
    "la-casa-torcida": {
        "title_en": "Crooked House",
        "description_en": "Aristide Leonides is poisoned. His granddaughter's fiancé Charles Hayward investigates the large, eccentric family living in the 'crooked house'."
    },
    "se-anuncia-un-asesinato": {
        "title_en": "A Murder is Announced",
        "description_en": "A murder is announced in the local gazette to take place at Little Paddocks. Neighbors gather, assuming it's a game, until shots are fired."
    },
    "intriga-en-bagdad": {
        "title_en": "They Came to Baghdad",
        "description_en": "Victoria Jones follows a man to Baghdad and gets swept up in a dangerous conspiracy involving a superpower summit."
    },
    "el-truco-de-los-espejos": {
        "title_en": "They Do It with Mirrors",
        "description_en": "Miss Marple visits a friend whose estate has been turned into a reformatory for boys, sensing danger in the atmosphere."
    },
    "la-señora-mcginty-ha-muerto": {
        "title_en": "Mrs. McGinty's Dead",
        "description_en": "A lodger is convicted of killing his landlady, but the investigating superintendent isn't sure. He asks Poirot to review the case."
    },
    "despues-del-funeral": {
        "title_en": "After the Funeral",
        "description_en": "At Richard Abernethie's funeral, his sister remarks he was murdered. The next day she is brutally killed. Poirot investigates."
    },
    "después-del-funeral": {
        "title_en": "After the Funeral",
        "description_en": "At Richard Abernethie's funeral, his sister remarks he was murdered. The next day she is brutally killed. Poirot investigates."
    },
    "un-punado-de-centeno": {
        "title_en": "A Pocket Full of Rye",
        "description_en": "A businessman is poisoned in his office. Cereal grain is found in his pocket, linking the crime to a nursery rhyme."
    },
    "un-puñado-de-centeno": {
        "title_en": "A Pocket Full of Rye",
        "description_en": "A businessman is poisoned in his office. Cereal grain is found in his pocket, linking the crime to a nursery rhyme."
    },
    "destino-desconocido": {
        "title_en": "Destination Unknown",
        "description_en": "Scientists are disappearing. Hilary Craven, contemplating suicide, is recruited to impersonate the wife of a missing scientist to find them."
    },
    "asesinato-en-la-calle-hickory": {
        "title_en": "Hickory Dickory Dock",
        "description_en": "Kleptomania at a student hostel interests Poirot when he discovers the stolen items are part of a more sinister puzzle."
    },
    "el-templete-de-nasse-house": {
        "title_en": "Dead Man's Folly",
        "description_en": "Ariadne Oliver stages a murder hunt at a fête, but she suspects a real murder is being planned. She calls Poirot for help."
    },
    "el-tren-de-las-4-50": {
        "title_en": "4.50 from Paddington",
        "description_en": "Mrs. McGillicuddy sees a woman being strangled in a passing train. When no body is found, she turns to her friend Miss Marple."
    },
    "el-tren-de-las-450": {
        "title_en": "4.50 from Paddington",
        "description_en": "Mrs. McGillicuddy sees a woman being strangled in a passing train. When no body is found, she turns to her friend Miss Marple."
    },
    "inocencia-tragica": {
        "title_en": "Ordeal by Innocence",
        "description_en": "Jacko Argyle dies in prison after being convicted of killing his mother. Two years later, a witness appears who proves his innocence, reopening the wound."
    },
    "inocencia-trágica": {
        "title_en": "Ordeal by Innocence",
        "description_en": "Jacko Argyle dies in prison after being convicted of killing his mother. Two years later, a witness appears who proves his innocence, reopening the wound."
    },
    "un-gato-en-el-palomar": {
        "title_en": "Cat Among the Pigeons",
        "description_en": "A revolution in the Middle East leads to jewels being smuggled into an English girls' school. Murder soon follows."
    },
    "el-pudding-de-navidad-y-otras-historias": {
        "title_en": "The Adventure of the Christmas Pudding",
        "description_en": "Poirot investigates the theft of a royal ruby during a traditional English Christmas celebration."
    },
    "el-misterio-de-pale-horse": {
        "title_en": "The Pale Horse",
        "description_en": "A dying woman gives a list of names to a priest. When the priest is murdered, Mark Easterbrook investigates the connection to 'The Pale Horse' inn."
    },
    "el-espejo-se-rajo-de-lado-a-lado": {
        "title_en": "The Mirror Crack'd from Side to Side",
        "description_en": "A guest dies at a reception hosted by a famous movie star. Miss Marple investigates, finding conflicting motives."
    },
    "los-relojes": {
        "title_en": "The Clocks",
        "description_en": "A shorthand typist discovers a man murdered in a house filled with clocks, all stopped at 4:13. Poirot is challenged to solve it from his armchair."
    },
    "misterio-en-el-caribe": {
        "title_en": "A Caribbean Mystery",
        "description_en": "Miss Marple is on holiday in the Caribbean. A fellow guest dies after claiming to recognize a murderer. She investigates."
    },
    "en-el-hotel-bertram": {
        "title_en": "At Bertram's Hotel",
        "description_en": "Miss Marple stays at a London hotel that seems too perfect to be true. Behind its Edwardian facade lies a web of crime."
    },
    "tercera-muchacha": {
        "title_en": "Third Girl",
        "description_en": "Three young women share a flat. One of them seeks Poirot's help, thinking she might have committed a murder."
    },
    "noche-eterna": {
        "title_en": "Endless Night",
        "description_en": "Michael Rogers builds his dream house on cursed land with his rich wife. Their happiness is short-lived as tragedy strikes."
    },
    "el-cuadro": {
        "title_en": "By the Pricking of My Thumbs",
        "description_en": "Tommy and Tuppence visit an old aunt in a nursing home. A cryptic remark from another resident leads them on a hunt for a child killer."
    },
    "las-manzanas": {
        "title_en": "Hallowe'en Party",
        "description_en": "At a Halloween party, a girl claims to have seen a murder and is later found drowned in an apple-bobbing bucket. Poirot investigates."
    },
    "pasajero-para-frankfurt": {
        "title_en": "Passenger to Frankfurt",
        "description_en": "A diplomat is approached by a woman at Frankfurt airport who begs for his help. He gives her his cloak and passport, entering a world of international conspiracy."
    },
    "némesis": {
        "title_en": "Nemesis",
        "description_en": "Miss Marple receives a posthumous request from Mr. Rafiel to solve a crime. She must go on a tour of famous houses and gardens to find the clues."
    },
    "los-elefantes-pueden-recordar": {
        "title_en": "Elephants Can Remember",
        "description_en": "Ariadne Oliver is asked about a double suicide from the past. She asks Poirot for help in uncovering the truth about the tragedy."
    },
    "la-puerta-del-destino": {
        "title_en": "Postern of Fate",
        "description_en": "Tommy and Tuppence retire to an old house in a quiet village. But when they find a coded message in an old book, they are drawn into a mystery from the past."
    },
    "primeros-casos-de-poirot": {
        "title_en": "Poirot's Early Cases",
        "description_en": "A collection of eighteen short stories featuring Hercule Poirot, from his early days in England to his more famous cases."
    },
    "telón": {
        "title_en": "Curtain: Poirot's Last Case",
        "description_en": "Poirot returns to Styles Court, the scene of his first English case. Now frail and arthritic, he knows a killer is among the guests."
    },
    "un-crimen-dormido": {
        "title_en": "Sleeping Murder",
        "description_en": "Gwenda Reed buys a house on the coast, but she begins to see things that aren't there. Miss Marple helps her uncover a murder from long ago."
    },
    "los-últimos-casos-de-miss-marple": {
        "title_en": "Miss Marple's Final Cases",
        "description_en": "A collection of short stories featuring the elderly spinster detective, solving mysteries with her sharp intuition."
    },
    "problema-en-pollensa-y-otras-historias": {
        "title_en": "Problem at Pollensa Bay",
        "description_en": "A collection of short stories featuring Hercule Poirot, Parker Pyne, and Harley Quin."
    },
    "café-solo": {
        "title_en": "Black Coffee",
        "description_en": "A novelization of Agatha Christie's 1930 play. Poirot must solve the murder of a scientist who was poisoned after his secret formula was stolen."
    },
    "un-dios-solitario-y-otros-relatos": {
        "title_en": "The Edge",
        "description_en": "A collection of short stories exploring themes of love, jealousy, and revenge."
    },
    "una-visita-inesperada": {
        "title_en": "The Unexpected Guest",
        "description_en": "A novelization of the play. A stranger runs his car into a ditch in the fog and enters a nearby house to find a woman standing over her dead husband."
    },
    "la-telaraña": {
        "title_en": "Spider's Web",
        "description_en": "A novelization of the play. Clarissa Hailsham-Brown, who loves telling tall tales, finds a real dead body in her drawing room."
    },
    "matar-es-fácil": {
        "title_en": "Murder is Easy",
        "description_en": "Luke Fitzwilliam meets an old lady on a train who claims a serial killer is at work in her village. When she is killed, he investigates."
    },
    "el-caso-de-los-anónimos": {
        "title_en": "The Moving Finger",
        "description_en": "A quiet village is plagued by poison pen letters. When a recipient commits suicide, Miss Marple suspects murder."
    },
    "el-caso-de-los-anonimos": {
        "title_en": "The Moving Finger",
        "description_en": "A quiet village is plagued by poison pen letters. When a recipient commits suicide, Miss Marple suspects murder."
    },
    "los-trabajos-de-hercules": {
        "title_en": "The Labours of Hercules",
        "description_en": "Poirot decides to take on twelve cases that correspond to the twelve labours of his mythological namesake, Hercules."
    },
    "los-trabajos-de-hércules": {
        "title_en": "The Labours of Hercules",
        "description_en": "Poirot decides to take on twelve cases that correspond to the twelve labours of his mythological namesake, Hercules."
    }

}

BOOKS_PATH = '/Users/carlos/Proyectos/agatha-christie/public/books.json'

def update_books_json():
    print(f"Reading {BOOKS_PATH}...")
    try:
        with open(BOOKS_PATH, 'r', encoding='utf-8') as f:
            books_data = json.load(f)
        
        updated_count = 0
        for book in books_data:
            slug = book.get('slug')
            if slug in TRANSLATIONS:
                book['title_en'] = TRANSLATIONS[slug]['title_en']
                book['description_en'] = TRANSLATIONS[slug]['description_en']
                updated_count += 1
            else:
                # Fallback to existing title/desc if no translation found (or auto-generate generic)
                # For now, just copy spanish content to avoid empty fields if translation missing
                if 'title_en' not in book:
                    book['title_en'] = book['title']
                if 'description_en' not in book:
                    book['description_en'] = book['description']
                print(f"Warning: No translation found for {slug}")

        print(f"Updating {updated_count} books...")
        
        with open(BOOKS_PATH, 'w', encoding='utf-8') as f:
            json.dump(books_data, f, indent=4, ensure_ascii=False)
            
        print("Success! books.json updated.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_books_json()
