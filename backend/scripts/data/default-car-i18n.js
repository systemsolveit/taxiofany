/**
 * Default fleet vehicles: titles + long descriptions for EN / NL / FR.
 * Keys match public templates: t('car.<slug>.title'), t('car.<slug>.description').
 */

const MERCEDES_EN = `Accessible, Fully Equipped Transport for Comfortable International Travel

Our specially adapted vehicle is designed to provide safe, comfortable, and inclusive transportation for passengers with reduced mobility. It features seating for up to eight passengers and accommodates up to three wheelchairs with secure, easy-access positioning.

The vehicle is fully air-conditioned and equipped with onboard Wi-Fi to ensure a pleasant and connected journey. With a strong focus on comfort and reliability, our service is ideal for both local trips and long-distance travel.

We proudly offer transportation from Belgium to destinations across Europe, with professional drivers ready to ensure a smooth and stress-free experience every step of the way.`;

const MERCEDES_NL = `Toegankelijk, volledig uitgerust vervoer voor comfortabel internationaal reizen

Onze speciaal aangepaste wagen is ontworpen om veilige, comfortabele en inclusieve vervoersoplossingen te bieden voor passagiers met beperkte mobiliteit. Er is plaats voor tot acht passagiers en tot drie rolstoelen met een vaste, eenvoudig bereikbare positionering.

De wagen is volledig voorzien van airconditioning en onboard Wi-Fi voor een aangename en verbonden reis. Met nadruk op comfort en betrouwbaarheid is onze dienst ideaal voor zowel lokale ritten als lange afstanden.

We verzorgen vervoer vanuit België naar bestemmingen in heel Europa, met professionele chauffeurs die elke stap van uw reis vlot en zorgeloos begeleiden.`;

const MERCEDES_FR = `Transport accessible et entièrement équipé pour des voyages internationaux confortables

Notre véhicule spécialement aménagé offre un transport sûr, confortable et inclusif aux passagers à mobilité réduite. Il accueille jusqu’à huit passagers et jusqu’à trois fauteuils roulants, avec fixation sécurisée et accès facilité.

Entièrement climatisé et doté du Wi-Fi à bord, il garantit un trajet agréable et connecté. Axé sur le confort et la fiabilité, notre service convient aussi bien aux déplacements locaux qu’aux longues distances.

Nous assurons des trajets depuis la Belgique vers toute l’Europe, avec des chauffeurs professionnels pour une expérience fluide et sans stress du début à la fin.`;

const SUZUKI_EN = `The Suzuki SX4 is a practical and comfortable car that combines reliable performance with modern convenience. It features a spacious interior designed to enhance driving comfort, along with a panoramic roof that brings in natural light and creates a more open and enjoyable cabin experience.

The car is equipped with a powerful air conditioning system to ensure a pleasant atmosphere in all weather conditions, as well as a built-in Wi-Fi system to keep you connected throughout your journey.

The Suzuki SX4 is an excellent choice for daily commuting and long trips, offering a perfect balance of reliability, comfort, and modern features in one well-rounded vehicle.`;

const SUZUKI_NL = `De Suzuki SX4 is een praktische en comfortabele wagen die betrouwbare prestaties combineert met modern comfort. De ruime binnenruimte ondersteunt een aangenaam rijgevoel, en het panoramadak laat veel natuurlijk licht binnen voor een open en prettige sfeer in de cabine.

De wagen heeft een krachtige airconditioning voor een aangenaam klimaat in alle weersomstandigheden, plus ingebouwde Wi-Fi zodat u onderweg verbonden blijft.

De Suzuki SX4 is een uitstekende keuze voor pendelen en langere ritten: een evenwicht tussen betrouwbaarheid, comfort en moderne uitrusting.`;

const SUZUKI_FR = `La Suzuki SX4 est une voiture pratique et confortable qui allie performances fiables et équipements modernes. Son habitacle spacieux améliore le confort de conduite, et le toit panoramique laisse entrer la lumière naturelle pour une ambiance plus ouverte et agréable.

Elle dispose d’une climatisation puissante pour un confort thermique dans toutes les conditions, ainsi que du Wi-Fi embarqué pour rester connecté pendant le trajet.

La Suzuki SX4 est un excellent choix pour les trajets quotidiens comme les longs parcours, avec un bon équilibre entre fiabilité, confort et technologies.`;

const TOYOTA_EN = `The Toyota Proace Verso is a premium passenger van designed for group transportation, airport transfers, and executive travel services.

It offers a spacious and highly comfortable interior, making it ideal for both business professionals and group travel. The cabin is kept exceptionally clean and well-maintained, ensuring a pleasant experience on every trip.

Equipped with a powerful air conditioning system and onboard Wi-Fi, it allows passengers to stay comfortable and connected throughout the journey. The tinted windows enhance privacy, creating a more secure and discreet travel environment.

The Toyota Proace Verso is the perfect choice for airport service and corporate transport, combining comfort, privacy, and reliability in one professional vehicle.`;

const TOYOTA_NL = `De Toyota Proace Verso is een premium personenbus, geschikt voor groepsvervoer, luchthaventransfers en zakelijke ritten.

De ruime en comfortabele binnenruimte is ideaal voor professionals en groepen. De cabine wordt zorgvuldig schoon en onderhouden gehouden voor een aangename ervaring bij elke rit.

Met krachtige airconditioning en Wi-Fi aan boord blijven passagiers comfortabel en verbonden. Getinte ruiten zorgen voor extra privacy en een rustiger reisklimaat.

De Toyota Proace Verso is de ideale keuze voor luchthaven- en zakelijke diensten: comfort, privacy en betrouwbaarheid in één professioneel voertuig.`;

const TOYOTA_FR = `Le Toyota Proace Verso est un monospace premium conçu pour le transport de groupes, les transferts aéroport et les services de mobilité d’affaires.

Son habitacle spacieux et très confortable convient aux professionnels comme aux déplacements collectifs. L’intérieur est tenu particulièrement propre et entretenu pour une expérience agréable à chaque trajet.

Équipé d’une climatisation performante et du Wi-Fi à bord, il permet de voyager confortablement et connecté. Les vitres teintées renforcent la confidentialité et la discrétion.

Le Toyota Proace Verso est le choix idéal pour l’aéroport et le transport d’entreprise, alliant confort, intimité et fiabilité dans un véhicule professionnel.`;

module.exports = {
  en: {
    'car.mercedes-sprinter.title': 'Mercedes Sprinter',
    'car.mercedes-sprinter.description': MERCEDES_EN,
    'car.suzuki-sx4.title': 'Suzuki SX4',
    'car.suzuki-sx4.description': SUZUKI_EN,
    'car.toyota-proace-verso.title': 'Toyota Proace Verso',
    'car.toyota-proace-verso.description': TOYOTA_EN,
  },
  nl: {
    'car.mercedes-sprinter.title': 'Mercedes Sprinter',
    'car.mercedes-sprinter.description': MERCEDES_NL,
    'car.suzuki-sx4.title': 'Suzuki SX4',
    'car.suzuki-sx4.description': SUZUKI_NL,
    'car.toyota-proace-verso.title': 'Toyota Proace Verso',
    'car.toyota-proace-verso.description': TOYOTA_NL,
  },
  fr: {
    'car.mercedes-sprinter.title': 'Mercedes Sprinter',
    'car.mercedes-sprinter.description': MERCEDES_FR,
    'car.suzuki-sx4.title': 'Suzuki SX4',
    'car.suzuki-sx4.description': SUZUKI_FR,
    'car.toyota-proace-verso.title': 'Toyota Proace Verso',
    'car.toyota-proace-verso.description': TOYOTA_FR,
  },
};
