const { connectDatabase, mongoose } = require('../config/database');
const { Translation, Locale } = require('../models');
const defaultCarI18n = require('./data/default-car-i18n');

/** French UI copy aligned with public marketing “handicap transport first” positioning. */
const entries = {
  'meta.title': 'Taxiofany — Transport handicap & taxi accessible en fauteuil roulant',
  'meta.description':
    'Taxiofany — taxis accessibles aux fauteuils roulants et transport handicap en Belgique. Véhicules adaptés avec rampes, élévateurs et chauffeurs formés. Transport professionnel et taxi classique.',
  'meta.author': 'Taxiofany',
  'meta.browserUpgrade.before': 'Vous utilisez un navigateur obsolète. Veuillez',
  'meta.browserUpgrade.link': 'mettre à jour votre navigateur',
  'meta.browserUpgrade.after': 'pour une meilleure expérience.',
  'header.topTagline': 'Taxis accessibles aux fauteuils roulants partout en Belgique.',
  'header.help': 'Aide',
  'header.support': 'Assistance',
  'header.faq': 'FAQ',
  'header.callNow': 'Appelez-nous',
  'header.emailNow': 'Écrivez-nous',
  'header.locationLabel': 'Adresse',
  'header.fallbackPhone': '+32484262105',
  'header.fallbackEmail': 'info@taxiofany.com',
  'header.fallbackLocation': 'Wemmel Brussels Belgium',
  'header.searchPlaceholder': 'Rechercher transport handicap, réservations…',
  'header.nav.home': 'Accueil',
  'header.nav.about': 'À propos',
  'header.nav.homeDefault': 'Accueil classique',
  'header.nav.homeModern': 'Accueil moderne',
  'header.nav.company': 'Entreprise',
  'header.nav.aboutUs': 'À propos de nous',
  'header.nav.aboutCompany': "À propos de l'entreprise",
  'header.nav.services': 'Services',
  'header.nav.serviceDetails': 'Détail du service',
  'header.nav.bookRide': 'Réserver une course',
  'header.nav.taxi': 'Flotte',
  'header.nav.taxiList': 'Véhicules',
  'header.nav.taxiDetails': 'Détail véhicule',
  "header.nav.pages": 'Pages',
  'header.nav.drivers': 'Chauffeurs',
  'header.nav.driverDetails': 'Chauffeur',
  'header.nav.reviews': 'Avis',
  'header.nav.helpFaq': 'Aide & FAQ',
  'header.nav.error404': '404',
  'header.nav.blog': 'Blog',
  'header.nav.blogGrid': 'Blog grille',
  'header.nav.blogClassic': 'Blog classique',
  'header.nav.blogDetails': 'Article',
  'header.nav.contact': 'Contact',
  'header.nav.bookTaxi': 'Réserver une course',
  'header.sidebox.description':
    'Taxiofany est spécialisé dans le transport accessible en Belgique : véhicules avec rampe ou élévateur, chauffeurs formés aux transferts sécurisés, ainsi que transport professionnel et taxi classique. Documents TFlex/Mutuelle sur demande.',
  'header.sidebox.callForRide': 'Appelez pour une course :',
  'header.sidebox.findUs': 'Nous trouver :',
  'header.sidebox.emailNow': 'Email :',
  'header.sidebox.fallbackPhone': '+32484262105',
  'header.sidebox.fallbackAddress': 'Wemmel Brussels Belgium',
  'header.sidebox.fallbackEmail': 'info@taxiofany.com',
  'footer.description':
    'Taxiofany — transport handicap et accessible fiable en Belgique. Nos véhicules adaptés offrent rampes, élévateurs, sangles 4 points et chauffeurs formés. 24/7 pour hôpitaux, soins et trajets du quotidien. Transport professionnel et taxi classique également.',
  'footer.callForTaxi': 'Appelez pour un transport accessible',
  'footer.workingHours': 'Disponibilité',
  'footer.openEveryDay': 'Chaque jour :',
  'footer.hours.alwaysOpen': '24/7',
  'footer.mondayFriday': 'Lundi - Vendredi :',
  'footer.saturday': 'Samedi :',
  'footer.sunday': 'Dimanche :',
  'footer.closeDay': 'Fermé !',
  'footer.usefulLinks': 'Liens utiles',
  'footer.taxiBooking': 'Réserver une course',
  'footer.helpCenter': "Centre d'aide",
  'footer.privacyPolicy': 'Confidentialité',
  'footer.terms': 'Conditions',
  'footer.contactUs': 'Contact',
  'footer.headOffice': 'Siège',
  'footer.location': 'Lieu :',
  'footer.joinUs': 'Email :',
  'footer.newsletter': 'Newsletter',
  'footer.yourEmail': 'Votre email',
  'footer.subscribeNow': "S'inscrire",
  'footer.fallbackPhone': '+32484262105',
  'footer.fallbackAddress': 'Wemmel Brussels Belgium',
  'footer.fallbackEmail': 'info@taxiofany.com',
  'footer.rightsReserved': 'Tous droits réservés.',
  'footer.developedBy': 'Développé par',
  'footer.whatsapp.defaultMessage':
    'Bonjour Taxiofany, je souhaite un transport accessible ou handicap.',
  'footer.whatsapp.ariaLabel': 'Discuter avec Taxiofany sur WhatsApp',
  'footer.copyrightSiteName': 'SystemSolveIT',
  'footer.copyrightSiteUrl': 'https://systemsolveit.com',
  'footer.copyrightNotice': 'Tous droits réservés.',
  'footer.copyrightSuffix': 'Tous droits réservés.',
  'booking.package.regular': 'Transport régulier',
  'booking.package.business': 'Transport professionnel',
  'booking.package.handicap': 'Transport handicap',
  'booking.passengersWordOne': 'personne',
  'booking.passengersWordMany': 'personnes',
  'home.hero.tagline': 'Taxis accessibles aux fauteuils roulants partout en Belgique.',
  'home.hero.title': 'Transport handicap fiable avec véhicules adaptés.',
  'home.hero.description':
    'Taxiofany est spécialisé dans le transport accessible. Nos véhicules — accès surbaissé, rampes latérales, élévateurs et ancrages 4 points — sont conduits par des chauffeurs formés à la mobilité. Transport professionnel et taxi classique. TFlex/Mutuelle sur demande.',
  'home.hero.ctaBookNow': 'Réserver',
  'home.hero.prev': 'Précédent',
  'home.hero.next': 'Suivant',
  'home.about.eyebrow': 'À propos de Taxiofany',
  'home.about.title': 'Une mobilité digne pour chaque passager',
  'home.about.description':
    'Nous plaçons le transport handicap et accessible en priorité : chauffeurs formés, véhicules avec rampe ou élévateur, et répartition 24/7 pour hôpitaux, maisons de soins et trajets quotidiens en Belgique. Navettes professionnelles et taxi classique également.',
  'home.about.founderTitle': 'Planification & accessibilité',
  'home.about.callForTaxi': 'Appelez pour un transport accessible',
  'home.services.eyebrow': 'Ce que nous offrons',
  'home.services.titleStart': 'Transport handicap en premier',
  'home.services.titleEnd': '— puis taxi professionnel & classique',
  'home.services.description':
    'Priorité : véhicules fauteuil avec rampe, élévateur et sangles. Ensuite : courses professionnelles et taxi standard. Aéroport et rendez-vous médicaux.',
  'home.services.handicapTransport': 'Transport handicap',
  'home.services.regularTransport': 'Transport régulier',
  'home.services.airportTransport': 'Aéroport',
  'home.services.luggageTransport': 'Bagages',
  'home.services.cityTransport': 'Ville',
  'home.services.businessTransport': 'Transport professionnel',
  'home.services.itemDescription':
    'Véhicules accessibles avec rampes, élévateurs et chauffeurs formés — hôpital, travail et quotidien.',
  'home.services.readMore': 'En savoir plus',
  'home.booking.onlineBooking': 'Réservation en ligne',
  'home.booking.bookTaxiRide': 'Réservez votre course accessible',
  'home.booking.yourName': 'Votre nom',
  'home.booking.email': 'Email',
  'home.booking.packageStandard': 'Standard',
  'home.booking.packageBusiness': 'Professionnel',
  'home.booking.packageEconomy': 'Économique',
  'home.booking.packageVip': 'VIP',
  'home.booking.packageComfort': 'Confort',
  'home.booking.person1': '1 personne',
  'home.booking.person2': '2 personnes',
  'home.booking.person3': '3 personnes',
  'home.booking.person4': '4 personnes',
  'home.booking.person5': '5 personnes',
  'home.booking.startDestination': 'Adresse de départ',
  'home.booking.endDestination': 'Destination',
  'home.booking.selectDate': 'Date de course',
  'home.booking.selectTime': 'Heure de course',
  'home.booking.submit': 'Demander une course',
  'home.pricing.eyebrow': 'Notre flotte',
  'home.pricing.title': 'Véhicules adaptés & taxis accessibles',
  'home.pricing.description':
    'Découvrez des véhicules accessibles avec rampe ou élévateur, ainsi que taxis professionnels et standard. Les admins peuvent publier photos et fiches.',
  'home.pricing.hybridTaxi': 'Véhicules fauteuil',
  'home.pricing.townTaxi': 'Transport professionnel',
  'home.pricing.limousineTaxi': 'Taxi classique',
  'home.pricing.initialCharge': 'Prise en charge :',
  'home.pricing.perMile': 'Par km :',
  'home.pricing.perStoppedTraffic': 'Arrêt :',
  'home.pricing.passengers': 'Passagers :',
  'home.pricing.bookTaxiNow': 'Réserver une course accessible',
  'home.pricing.noCars':
    'Aucun véhicule publié. Ajoutez-les dans le panneau admin.',
  'home.download.eyebrow': 'Réservation en ligne',
  'home.download.title': 'Réservez votre course sur le site',
  'home.download.description': 'Service fiable et trajets confortables.',
  'home.download.featureSearchLine1': 'Recherche simple',
  'home.download.featureSearchLine2': 'vers Taxiofany !',
  'home.download.featurePickupLine1': 'Prise en charge rapide',
  'home.download.featurePickupLine2': 'pour gagner du temps !',
  'home.download.featureRatesLine1': 'Tarifs clairs',
  'home.download.featureRatesLine2': 'pour rouler l’esprit tranquille !',
  'home.testimonial.eyebrow': 'Témoignages',
  'home.testimonial.title': 'Une confiance pour les courses accessibles',
  'home.testimonial.description':
    'Les familles et aidants comptent sur Taxiofany pour un transport handicap ponctuel et respectueux en Belgique.',
  'home.testimonial.reviewText':
    'Chauffeur attentionné, trajet calme et aide pour arrimer le fauteuil.',
  'home.testimonial.reviewerName': 'Passager',
  'home.testimonial.reviewerCompany': 'Belgique',
  'home.features.eyebrow': 'Pourquoi Taxiofany',
  'home.features.title': 'Conçu pour l’accessibilité',
  'home.features.description':
    'Véhicules avec rampe ou élévateur, sangles 4 points, siège accompagnant, et régulation qui comprend les rendez-vous médicaux.',
  'home.features.safeGuarantee': 'Formés aux transferts fauteuil sécurisés',
  'home.features.fastPickups': 'Courses hôpital & maisons de soins',
  'home.features.quickRide': 'Véhicules adaptés',
  'home.features.itemDescription':
    'Chauffeurs entraînés à l’embarquement, à l’arrimage et à l’assistance mobilité réduite.',
  'home.cta.callUsNow': 'Appelez',
  'home.cta.bookYourTaxi': 'réservez un transport accessible',
  'home.cta.forYourNextRide': 'pour votre prochain trajet',
  'home.cta.description':
    'Véhicules fauteuil dans toute la Belgique. Transport professionnel et taxi classique. TFlex/Mutuelle sur demande.',
  'home.cta.callForTaxi': 'Appelez pour un transport accessible',
  'home.cta.serviceLabel': 'Taxiofany transport accessible',
  'home.cta.feelYourJourney': 'Avancez en confiance',
  'home.cta.bookTaxiBtn': 'Réserver une course accessible',
  'home.cta2.item1': 'Véhicules avec rampe ou élévateur',
  'home.cta2.item2': 'Chauffeurs formés aux transferts fauteuil',
  'home.cta2.item3': 'Documents TFlex / Mutuelle sur demande',
  'home.cta2.item4': 'Régulation 24/7 pour soins et hôpitaux',
  'home.blog.eyebrow': 'Actualités mobilité',
  'home.blog.title': 'Regards sur le transport accessible',
  'home.blog.description':
    'Actualités transport handicap, adaptations véhicules et sécurité routière en Belgique.',
  'home.blog.categoryBusiness': 'Professionnel',
  'home.blog.categoryStartup': 'Mobilité',
  'home.blog.categoryFinance': 'Soins',
  'home.blog.postDate': '01 janv. 2026',
  'home.blog.author': 'Taxiofany',
  'home.blog.post1Title': 'Choisir un taxi fauteuil en Belgique',
  'home.blog.post2Title': 'Quoi dire à la répartition',
  'home.blog.post3Title': 'TFlex et remboursement : bases',
  'home.blog.postExcerpt': 'Conseils pratiques pour passagers et aidants…',
  'home.blog.readMore': 'Lire la suite',
  'home.team.title': 'Chauffeurs formés à l’accessibilité',
  'home.team.description':
    'Notre équipe apprend les transferts sécurisés, l’arrimage du matériel et la communication apaisée avec passagers et aidants.',
  'home.team.noDrivers':
    'Aucun chauffeur publié — ajoutez-les dans le panneau admin.',
  'home.empty.noPublishedServices':
    'Aucun service publié. Publiez au moins un service dans le panneau admin.',
  'home.empty.noPublishedBlog':
    'Aucun article — publiez un billet dans le panneau admin.',
  'home.professional.eyebrow': 'Accessibilité d’abord',
  'home.professional.title': 'Un transport handicap sur lequel vous comptez',
  'home.professional.description':
    'Le transport handicap passe en premier : véhicules adaptés, chauffeurs formés et régulation 24/7 pour hôpitaux et maisons de soins. Taxi professionnel et classique aussi — réservez sur le web, sans appli.',
  'home.professional.point1': 'Transferts fauteuil sécurisés',
  'home.professional.point1sub': 'Rampes, élévateurs, sangles — et chauffeurs qui les maîtrisent.',
  'home.professional.point2': 'TFlex & Mutuelle',
  'home.professional.point2sub': 'Demandez les justificatifs de remboursement à la réservation.',
  'home.professional.point3': 'Taxi professionnel & classique aussi',
  'home.professional.point3sub':
    'Même flux de réservation — choisissez handicap, professionnel ou régulier.',
  'home.professional.ctaBook': 'Réservez votre course',
  'pages.users.home.modern.1_person': '1 personne',
  'pages.users.home.modern.2_person': '2 personnes',
  'pages.users.home.modern.3_person': '3 personnes',
  'pages.users.home.modern.4_person': '4 personnes',
  'pages.users.home.modern.5_person': '5 personnes',
  'pages.users.home.modern.hybrid_taxi': 'Véhicules fauteuil',
  'pages.users.home.modern.town_taxi': 'Transport professionnel',
  'pages.users.home.modern.limousine_taxi': 'Taxi classique',
  'pages.company.aboutUs.header.eyebrow': 'À propos de Taxiofany',
  'pages.company.aboutUs.header.titleLine1': 'Transport accessible fauteuil',
  'pages.company.aboutUs.header.titleLine2': 'avec',
  'pages.company.aboutUs.header.titleBrand': 'Taxiofany',
  'pages.company.aboutUs.header.description':
    'Réseau taxi « handicap d’abord » en Belgique — véhicules adaptés, chauffeurs formés, accompagnement TFlex/Mutuelle sur demande.',
  'pages.company.aboutCompany.header.eyebrow': 'Notre entreprise',
  'pages.company.aboutCompany.header.titleLine1': 'Transport accessible',
  'pages.company.aboutCompany.header.titleLine2': 'avec',
  'pages.company.aboutCompany.header.titleBrand': 'Taxiofany',
  'pages.company.aboutCompany.header.description':
    'Nous opérons un transport handicap centré sur la Belgique : flotte adaptée, équipes formées et aide administrative lorsque c’est possible.',
  'pages.users.company.about-us.recent_posts': 'Articles récents',
  'pages.users.company.about-us.news_and_insights': 'Actualités & regards mobilité',
  'pages.users.company.about-us.we_successfully_cope_with_tasks_of_varying_compl':
    'Récits de transport accessible en Belgique',
  'pages.users.company.about-us.guarantees_and_regularly_master_new_technologies':
    'adaptations véhicules, conseils aidants et voyage en sécurité.',
  'pages.users.company.about-us.business': 'Mobilité',
  'pages.users.company.about-us.read_more': 'Lire la suite',
  'pages.users.company.about-company.recent_posts': 'Articles récents',
  'pages.users.company.about-company.news_and_insights': 'Actualités & regards mobilité',
  'pages.users.company.about-company.we_successfully_cope_with_tasks_of_varying_compl':
    'Récits de transport accessible en Belgique',
  'pages.users.company.about-company.guarantees_and_regularly_master_new_technologies':
    'adaptations véhicules, conseils aidants et voyage en sécurité.',
  'pages.users.company.about-company.business': 'Mobilité',
  'pages.users.company.about-company.read_more': 'Lire la suite',
  'pages.services.list.header.eyebrow': 'Nos services',
  'pages.services.list.header.titleLine1': 'Transport handicap',
  'pages.services.list.header.titleBrand': 'Taxiofany',
  'pages.services.list.header.titleLine2': '& plus',
  'pages.services.list.header.description':
    'Courses accessibles d’abord — puis transport professionnel, taxi classique et trajets aéroport/soins.',
  'pages.services.list.noServices':
    'Aucun service publié. Ajoutez handicap, professionnel ou régulier dans le panneau admin.',
  'pages.services.list.localTransport': 'Transport local',
  'pages.services.details.header.eyebrow': 'Détail du service',
  'pages.services.details.header.titleLine1': 'Handicap &',
  'pages.services.details.header.titleLine2': 'transport accessible',
  'pages.services.details.header.titleBrand': 'Taxiofany',
  'pages.services.details.header.description':
    'Transport accessible avec chauffeurs formés, véhicules adaptés et accompagnement TFlex/Mutuelle en option.',
  'pages.services.details.title': 'Taxi accessible & transport handicap',
  'pages.services.details.paragraph1':
    'Taxiofany met en priorité les passagers en fauteuil ou avec aide à la marche. Nos véhicules offrent accès surbaissé, rampe ou élévateur, points d’ancrage et siège accompagnant.',
  'pages.services.details.paragraph2':
    'Outre le transport handicap, nous proposons transferts professionnels et taxi classique — réservez en ligne ou appelez la répartition pour urgences hôpital ou maison de soins.',
  'pages.services.details.features.fastPickups.title': 'Prise en charge accessible',
  'pages.services.details.features.fastPickups.description':
    'Aide porte-à-porte pour monter en sécurité et arrimer dans le véhicule.',
  'pages.services.details.features.instantCar.title': 'Bon véhicule',
  'pages.services.details.features.instantCar.description':
    'Le bon véhicule pour votre fauteuil et vos accompagnants.',
  'pages.services.details.features.safeDrive.title': 'Course professionnelle sûre',
  'pages.services.details.features.safeDrive.description':
    'Chauffeurs formés à l’assistance mobilité.',
  'pages.services.details.features.support247.title': 'Assistance 24/7',
  'pages.services.details.features.support247.description':
    'Régulation pour soins et urgences.',
  'pages.services.details.paragraph3':
    'Remboursement ? Indiquez TFlex ou Mutuelle à la réservation — nous aidons avec les documents possibles.',
  'pages.services.details.benefits.title': 'Avantages pour les passagers',
  'pages.services.details.benefits.description':
    'Confort, clarté et respect — pour thérapie ou aéroport.',
  'pages.services.details.benefits.item1': 'Systèmes d’arrimage vérifiés à chaque course',
  'pages.services.details.benefits.item2': 'Chauffeurs formés à l’assistance mobilité',
  'pages.services.details.benefits.item3':
    'La régulation priorise les rendez-vous médicaux',
  'pages.services.details.categories.title': 'Nos services',
  'pages.services.details.categories.longJourney': 'Long trajet',
  'pages.services.details.banner.titleLine1': 'Planifiez votre',
  'pages.services.details.banner.titleBrand': 'course accessible',
  'pages.services.details.banner.description':
    'Indiquez si vous avez besoin d’un lève-personne, de temps supplémentaire ou d’un siège accompagnant.',
  'pages.services.details.banner.discountSuffix': 'régulation soins & hôpital',
  'pages.services.details.banner.cta': 'Contacter la répartition',
  'pages.services.details.tagsTitle': 'Tags',
  'pages.users.services.details.business': 'transport handicap',
  'pages.users.services.details.marketing': 'taxi fauteuil',
  'pages.users.services.details.startup': 'Belgique',
  'service.handicap.title': 'Transport handicap',
  'service.handicap.shortDescription':
    'Véhicules fauteuil avec rampe ou élévateur et chauffeurs formés pour soins, travail et quotidien.',
  'service.handicap.description':
    'Taxiofany planifie le transport handicap avec transferts sécurisés et aide documentaire lorsque possible.',
  'service.handicap.feature.0.title': 'Embarquement sûr',
  'service.handicap.feature.0.description': 'Rampe ou élévateur et arrimage conforme.',
  'service.handicap.benefitPoint.0': 'Arrimage fauteuil correct à chaque fois',
  'driver.availability.available': 'Disponible',
  'driver.availability.busy': 'Occupé',
  'driver.availability.offline': 'Hors ligne',
  'drivers.card.alt': 'Chauffeur formé accessibilité',
  'drivers.fallback.roleTitle': 'Chauffeur formé accessibilité',
  'drivers.fallback.vehicle': 'Véhicule fauteuil',
  'drivers.fallback.plate': 'Attribué par la répartition',
  'drivers.fallback.languages': 'NL / FR / EN',
  'drivers.signatureText': 'Taxiofany',
  'pages.users.drivers.list.service_details': 'Nos chauffeurs',
  'pages.users.drivers.list.our_expert_drivers_will': 'Formés pour',
  'pages.users.drivers.list.make_your': 'des transferts fauteuil',
  'pages.users.drivers.list.ride_safe': 'sécurisés',
  'pages.users.drivers.list.everything_your_taxi_business':
    'Découvrez l’équipe Taxiofany — centrée sur le transport handicap et une assistance respectueuse',
  'pages.users.drivers.list.needs_is_already_here': 'et une régulation fiable en Belgique.',
  'pages.users.drivers.list.no_driver_profiles_are_published_yet':
    'Aucun chauffeur publié — ajoutez votre équipe accessibilité dans le panneau admin.',
  'pages.users.drivers.details.service_details': 'Profil chauffeur',
  'pages.users.drivers.details.our_expert_drivers_will': 'Votre partenaire',
  'pages.users.drivers.details.make_your': 'accessibilité sur la',
  'pages.users.drivers.details.ride_safe': 'route',
  'pages.users.drivers.details.everything_your_taxi_business':
    'Chaque chauffeur est briefé sur l’embarquement sûr, les sangles et la communication avec',
  'pages.users.drivers.details.needs_is_already_here':
    'passagers et aidants — le transport handicap est notre quotidien.',
  'pages.users.drivers.details.about_the_driver': 'À propos du chauffeur',
  'pages.users.drivers.details.mauricio_fern_ndez': 'Chauffeur mis en avant',
  'pages.users.drivers.details.we_successfully_cope_with_tasks_of_varying_compl':
    'Ce chauffeur Taxiofany est spécialisé dans le transport accessible — transferts sûrs, aide posée et trajets autour des hôpitaux et thérapies.',
  'pages.users.drivers.details.founder_ceo': 'Chauffeur formé accessibilité',
  'pages.users.drivers.details.call_for_taxi': 'Appelez pour un transport accessible',
  'pages.users.drivers.details.vehicle': 'Véhicule :',
  'pages.users.drivers.details.plate': 'Plaque :',
  'pages.users.drivers.details.languages': 'Langues :',
  'pages.users.drivers.details.experience': 'Expérience :',
  'pages.users.drivers.details.years': 'ans',
  'pages.users.drivers.details.years_of': 'Années de',
  'pages.users.drivers.details.experiences': 'transport accessible',
  'pages.users.drivers.details.status': 'Statut :',
  'pages.users.drivers.details.more_drivers': 'Plus de chauffeurs',
  'pages.users.drivers.details.meet_other_available_drivers':
    'Autres chauffeurs formés accessibilité',
  'pages.users.drivers.details.clients_testimonial': 'Retours passagers',
  'pages.users.drivers.details.taxiofany_passenger_reviews':
    'Ce que disent les voyageurs sur Taxiofany',
  'pages.users.drivers.details.guarantees_and_regularly_master_technologies':
    'transport handicap — aide bienveillante à chaque étape.',
  'pages.users.taxi.list.our_taxi_lists': 'Nos véhicules',
  'pages.users.taxi.list.feel_your_journey': 'Flotte accessible',
  'pages.users.taxi.list.with': 'avec',
  'pages.users.taxi.list.taxiofany': 'Taxiofany',
  'pages.users.taxi.list.everything_your_taxi_business':
    'Véhicules avec rampe, élévateur, arrimage et siège accompagnant — plus taxi professionnel et classique',
  'pages.users.taxi.list.needs_is_already_here': 'quand vous avez besoin d’une course standard.',
  'pages.users.taxi.list.initial_charge': 'Prise en charge :',
  'pages.users.taxi.list.per_mile_km': 'Par km :',
  'pages.users.taxi.list.per_stopped_trafic': 'Arrêt :',
  'pages.users.taxi.list.passengers': 'Passagers :',
  'pages.users.taxi.list.4_person': 'pers.',
  'pages.users.taxi.list.book_taxi_now': 'Réserver',
  'pages.users.taxi.list.noCars':
    'Aucun véhicule — ajoutez des véhicules accessibles dans le panneau admin.',
  'pages.users.taxi.details.service_details': 'Détail véhicule',
  'pages.users.taxi.details.feel_your_journey': 'Transport accessible',
  'pages.users.taxi.details.with': 'avec',
  'pages.users.taxi.details.taxiofany': 'Taxiofany',
  'pages.users.taxi.details.everything_your_taxi_business':
    'Chaque véhicule listé est entretenu pour un transport handicap et fauteuil sûr',
  'pages.users.taxi.details.needs_is_already_here':
    'avec les fiches publiées par notre équipe flotte.',
  'pages.users.taxi.details.introducing': 'Mise en avant flotte',
  'pages.users.taxi.details.mercedes_maybach_haute_voiture_2024':
    'Renault Trafic Access (exemple)',
  'pages.users.taxi.details.we_successfully_cope_with_tasks_of_varying_compl':
    'Exemple de fiche : plancher surbaissé, rampe latérale ou élévateur arrière, ancrages ISO, sangles 4 points, siège accompagnant et clim pour trajets médicaux et quotidiens confortables.',
  'pages.users.taxi.details.car_id': 'ID véhicule :',
  'pages.users.taxi.details.transmission': 'Transmission :',
  'pages.users.taxi.details.auto': 'Automatique',
  'pages.users.taxi.details.mileage': 'Kilométrage :',
  'pages.users.taxi.details.170k': 'Flotte entretenue',
  'pages.users.taxi.details.engine': 'Motorisation :',
  'pages.users.taxi.details.6_5l_lp_petrol':
    'Diesel Euro / hybride (selon région)',
  'pages.users.taxi.details.air_condition': 'Climat :',
  'pages.users.taxi.details.luggage_carry': 'Bagages / équipement :',
  'pages.users.taxi.details.book_your_ride': 'Réserver une course accessible',
  'pages.users.taxi.details.our_more_taxis': 'Plus d’options flotte',
  'pages.users.taxi.details.related_taxis_to_ride': 'Véhicules associés',
  'pages.users.taxi.details.relatedIntroLine1':
    'Parcourez d’autres véhicules fauteuil — la même répartition de confiance',
  'pages.users.taxi.details.guarantees_and_regularly_master_new_technologies':
    'et aide documentaire lorsque possible.',
  'pages.users.taxi.details.initial_charge': 'Prise en charge :',
  'pages.users.taxi.details.per_mile_km': 'Par km :',
  'pages.users.taxi.details.per_stopped_trafic': 'Arrêt :',
  'pages.users.taxi.details.passengers': 'Passagers :',
  'pages.users.taxi.details.4_person': 'pers.',
  'pages.users.taxi.details.book_taxi_now': 'Réserver',
  'pages.users.contact.have_any': 'Vous planifiez une',
  'pages.users.contact.questions': 'course accessible ?',
  'pages.users.contact.get_in_touch_to_discuss_your_employee_wellbeing_':
    'Contactez-nous pour transport handicap, véhicules fauteuil, questions TFlex/Mutuelle, ou réservations taxi professionnel et classique. Appelez, écrivez ou utilisez le formulaire — nous répondons vite.',
  'pages.users.contact.contact_with_us': 'Message à Taxiofany',
  'pages.users.contact.headOffice': 'Siège',
  'pages.users.contact.send_massage': 'Envoyer le message',
  'contact.form.firstName': 'Prénom',
  'contact.form.lastName': 'Nom',
  'contact.form.email': 'Email',
  'contact.form.phone': 'Téléphone',
  'contact.form.message':
    'Indiquez prise en charge, besoins mobilité, dimensions fauteuil, accompagnant…',
  'pages.users.support.faqs.help_faqs': 'Aide & FAQ',
  'pages.users.support.faqs.frequently_asked': 'Transport accessible',
  'pages.users.support.faqs.questions': 'questions',
  'pages.users.support.faqs.everything_your_taxi_business':
    'Réponses sur véhicules fauteuil, réservation, remboursement et sécurité',
  'pages.users.support.faqs.needs_is_already_here': 'pour passagers et aidants en Belgique.',
  'pages.users.support.faqs.what_makes_a_good_taxi_service':
    'Quel équipement ont vos véhicules handicap ?',
  'pages.users.support.faqs.the_restaurants_in_hangzhou_also_catered_to_many':
    'Nos véhicules ont en général rampe ou élévateur, plancher surbaissé, ancrages ISO, sangles 4 points et siège accompagnant. Indiquez la taille du fauteuil et si vous avez besoin de temps d’embarquement supplémentaire.',
  'pages.users.support.faqs.what_is_the_purpose_of_a_taxi_service':
    'Un accompagnant peut-il monter ?',
  'pages.users.support.faqs.answer2':
    'Oui. Précisez le nombre d’accompagnants à la réservation pour réserver le bon véhicule.',
  'pages.users.support.faqs.how_to_download_the_taxiofany_taxi_app_online':
    'Proposez-vous des documents TFlex ou Mutuelle pour remboursement ?',
  'pages.users.support.faqs.answer3':
    'Nous pouvons fournir confirmations de course et facturation utiles pour de nombreux régimes — demandez à la réservation.',
  'pages.users.support.faqs.what_should_i_be_asking_for_first_ride':
    'Comment réserver une course hôpital ou thérapie ?',
  'pages.users.support.faqs.answer4':
    'Utilisez le formulaire en ligne ou appelez avec heure de RDV, fenêtre de prise en charge et notes mobilité. Nous priorisons la planification médicale si possible.',
  'pages.users.support.faqs.how_many_cars_does_taxiofany_taxi_service_have':
    'Proposez-vous aussi taxi classique ou professionnel — pas seulement handicap ?',
  'pages.users.support.faqs.answer5':
    'Oui. Le transport handicap est notre cœur de métier, mais vous pouvez réserver professionnel et classique sur les mêmes canaux — choisissez le forfait à la réservation.',
  'pages.users.support.faqs.categories': 'Catégories',
  'pages.users.support.faqs.business_strategy': 'Transport handicap',
  'pages.users.support.faqs.project_management': 'Taxi fauteuil',
  'pages.users.support.faqs.digital_marketing': 'Courses médicales',
  'pages.users.support.faqs.customer_experience': 'Conseils aidants',
  'pages.users.support.faqs.partnership_system': 'Mobilité Belgique',
  'pages.users.support.faqs.recent_articles': 'Articles récents',
  'pages.users.support.faqs.how_to_go_about_initiating_an_startup_in_few_day':
    'Choisir un taxi fauteuil en Belgique.',
  'pages.users.support.faqs.financial_experts_support_help_you_to_find_out':
    'Quoi dire à la répartition pour votre première course.',
  'pages.users.support.faqs.innovative_helping_business_all_over_the_world':
    'TFlex, Mutuelle et remboursement : bases.',
  'pages.users.support.faqs.jan_01_2022': 'janv. 2026',
  'pages.users.support.faqs.tags': 'Tags',
  'pages.users.support.faqs.business': 'handicap',
  'pages.users.support.faqs.marketing': 'fauteuil',
  'pages.users.support.faqs.startup': 'TFlex',
  'pages.users.support.faqs.design': 'Mutuelle',
  'pages.users.support.faqs.consulting': 'hôpital',
  'pages.users.support.faqs.strategy': 'maison de soins',
  'pages.users.support.faqs.development': 'Bruxelles',
  'pages.users.support.faqs.tips': 'Wemmel',
  'pages.users.support.faqs.seo': 'Belgique',
  'pages.users.packages.packages': 'Forfaits courses',
  'packages.header.title': 'Handicap, pro &',
  'packages.header.highlight': 'transport régulier',
  'packages.header.description':
    'Les forfaits publiés se configurent dans l’admin — souvent bundles accessibles fauteuil, affaires ou taxi standard.',
  'packages.bookNow': 'Réserver ce forfait',
  'packages.empty':
    'Aucun forfait publié — créez des bundles handicap, professionnel ou régulier dans le panneau admin.',
  'pages.users.solutions.solutions': 'Solutions',
  'solutions.header.title': 'Transport',
  'solutions.header.highlight': 'accessible',
  'solutions.header.description':
    'Le transport handicap et fauteuil passe en premier — puis navette professionnelle et taxi classique, même parcours de réservation.',
  'pages.users.blog.grid.blog_grid': 'Blog',
  'pages.users.blog.grid.feel_your_journey': 'Récits mobilité',
  'pages.users.blog.grid.with': 'avec',
  'pages.users.blog.grid.taxiofany': 'Taxiofany',
  'pages.users.blog.grid.everything_your_taxi_business':
    'Actualités transport accessible, conseils aidants',
  'pages.users.blog.grid.needs_is_already_here': 'et sécurité routière en Belgique.',
  'pages.users.blog.grid.business': 'Mobilité',
  'pages.users.blog.grid.read_more': 'Lire la suite',
  'pages.users.blog.grid.elliot_alderson': 'Rédaction Taxiofany',
  'pages.users.blog.grid.categories': 'Catégories',
  'pages.users.blog.grid.recent_articles': 'Articles récents',
  'pages.users.blog.grid.tags': 'Tags',
  'pages.users.blog.classic.blog_classic': 'Blog',
  'pages.users.blog.classic.feel_your_journey': 'Récits mobilité',
  'pages.users.blog.classic.with': 'avec',
  'pages.users.blog.classic.taxiofany': 'Taxiofany',
  'pages.users.blog.classic.everything_your_taxi_business':
    'Actualités transport accessible, conseils aidants',
  'pages.users.blog.classic.needs_is_already_here': 'et sécurité routière en Belgique.',
  'pages.users.blog.classic.business': 'Mobilité',
  'pages.users.blog.classic.read_more': 'Lire la suite',
  'pages.users.blog.classic.elliot_alderson': 'Rédaction Taxiofany',
  'pages.users.blog.classic.categories': 'Catégories',
  'pages.users.blog.classic.recent_articles': 'Articles récents',
  'pages.users.blog.classic.tags': 'Tags',
  'pages.users.blog.details.blog_details': 'Blog mobilité',
  'pages.users.blog.details.fresh_startup_ideas_for': 'Transport accessible',
  'pages.users.blog.details.digital_business': 'analyses',
  'pages.users.blog.details.our_versatile_team_is_built_of_designers_develop':
    'Guides et actualités sur taxis fauteuil, conseils aidants et voyage en sécurité',
  'pages.users.blog.details.digital_marketers_who_all_bring_unique_experienc':
    'partout en Belgique.',
  'pages.users.blog.details.elliot_alderson': 'Rédaction Taxiofany',
  'pages.users.blog.details.comments_0': 'Pas encore de commentaires',
  'pages.users.blog.details.comments_prefix': 'Commentaires',
  'pages.users.blog.details.financial_experts_support_or_help_you_to_to_find':
    'Planifier une course accessible commence par une communication claire : besoins mobilité, dimensions fauteuil, utilisation d’un lève-personne, contraintes horaires pour thérapies ou hôpital.',
  'pages.users.blog.details.unless_you_are_the_one_who_really_cares_about_th':
    'Taxiofany combine une répartition « handicap d’abord » avec taxi professionnel et classique — familles, employeurs et particuliers réservent la même flotte de confiance.',
  'pages.users.blog.details.there_are_no_secrets_to_success_it_is_the_result':
    'La dignité à chaque trajet — ce dont les familles se souviennent le plus.',
  'pages.users.blog.details.winston_churchill': '— Passager Taxiofany',
  'pages.users.blog.details.there_are_some_big_shifts_taking_place_in_the_fi':
    'En Belgique, la demande croît pour des flottes accessibles ponctuelles médicalement et respectueuses humainement — nous investissons dans véhicules et formation chauffeurs.',
  'pages.users.blog.details.creative_approach_to_every_project':
    'Sécurité dans le véhicule',
  'pages.users.blog.details.sectionParagraphOneFallback':
    'Un bon arrimage du fauteuil protège passager et chauffeur. Nos équipes répètent angles de rampe, freinage en pente et communication quand une aide supplémentaire est nécessaire.',
  'pages.users.blog.details.another_speaker_john_meuse_senior_director_of_he':
    'Demandez siège accompagnant, bagage pour équipement et priorité si les cliniques retardent — nous adaptons quand c’est possible.',
  'pages.users.blog.details.business': 'transport handicap',
  'pages.users.blog.details.marketing': 'taxi fauteuil',
  'pages.users.blog.details.startup': 'Belgique',
  'pages.users.blog.details.design': 'TFlex',
  'pages.users.blog.details.previous': 'Précédent',
  'pages.users.blog.details.next': 'Suivant',
  'pages.users.blog.details.how_to_start_initiating_an_startup_in_few_days':
    'Article précédent',
  'pages.users.blog.details.fresh_startup_ideas_for_digital_business':
    'Article suivant',
  'pages.users.blog.details.author_bio_fallback':
    'Taxiofany publie des guides pratiques pour passagers, aidants et employeurs qui réservent du transport accessible en Belgique.',
  'pages.users.blog.details.form_name_placeholder': 'Nom*',
  'pages.users.blog.details.form_email_placeholder': 'Email*',
  'pages.users.blog.details.form_comment_placeholder': 'Votre commentaire*',
  'pages.users.blog.details.post_comments': 'Commentaires',
  'pages.users.blog.details.reply': 'Répondre',
  'pages.users.blog.details.no_comments_yet': 'Pas encore de commentaires',
  'pages.users.blog.details.be_the_first_to_share_feedback':
    'Soyez le premier à laisser un avis sur cet article.',
  'pages.users.blog.details.leave_a_comment': 'Laisser un commentaire',
  'pages.users.blog.details.submit_comment': 'Envoyer le commentaire',
  'pages.users.blog.details.comment_pending_moderation':
    'Merci ! Votre commentaire a été envoyé et attend modération.',
  'pages.users.blog.details.comment_validation_error':
    'Veuillez remplir nom, email et commentaire avant envoi.',
  'pages.users.blog.details.comment_submit_failed':
    'Impossible d’envoyer le commentaire pour le moment. Réessayez.',
  'pages.users.testimonials.testimonials': 'Témoignages',
  'pages.users.testimonials.our_passengers': 'Passagers & aidants',
  'pages.users.testimonials.reviews': 'avis',
  'pages.users.testimonials.everything_your_taxi_business':
    'Retours réels sur transport handicap, ponctualité',
  'pages.users.testimonials.needs_is_already_here': 'et chauffeurs attentionnés en Belgique.',
  'testimonials.authorAlt': 'Passager',
  'testimonials.empty':
    'Aucun témoignage — ajoutez des expériences passagers dans le panneau admin.',
  'pages.users.errors.not-found.oops_where_are_we': 'Perdu sur la carte ?',
  'pages.users.errors.not-found.404_page': '404',
  'pages.users.errors.not-found.not_found': 'page introuvable',
  'pages.users.errors.not-found.page_not_found_the_page_you_are_looking_for_was_':
    'Cette URL a peut-être bougé — comme une course détournée.',
  'pages.users.errors.not-found.removed_renamed_or_might_never_existed':
    'Essayez l’accueil ou réservez une course accessible depuis le menu.',
  'pages.users.errors.not-found.back_to_homepage': "Retour à l'accueil",
  'blog.postImageAlt': 'Blog',
  'blog.empty': 'Aucun article disponible.',
  'blog.authorFallbackName': 'Taxiofany',
  'common.dateUnavailable': 'Date indisponible',
  'common.emDash': '—',
  'common.search': 'Rechercher',
  'common.yes': 'Oui',
  'common.no': 'Non',
  'taxi.carImageAlt': 'Taxi accessible fauteuil',
  'taxi.imageAlt': 'Taxi ou véhicule accessible',
  'taxi.priceOnReservation': 'Tarif sur réservation',
  'service.imageAlt': 'Service de transport accessible',
  ...defaultCarI18n.fr,
};

async function ensureLocale() {
  const existing = await Locale.findOne({ code: 'fr' }).lean();
  if (existing) {
    if (!existing.isActive || existing.baseLocale) {
      await Locale.updateOne(
        { code: 'fr' },
        { $set: { isActive: true, baseLocale: null, label: existing.label || 'Français' } }
      );
    }
    return;
  }

  await Locale.create({ code: 'fr', label: 'Français', baseLocale: null, isActive: true });
}

async function run() {
  await connectDatabase();
  await ensureLocale();

  const operations = Object.entries(entries).map(([key, value]) => ({
    updateOne: {
      filter: { locale: 'fr', key },
      update: { $set: { value } },
      upsert: true,
    },
  }));

  await Translation.bulkWrite(operations, { ordered: false });
  console.log(`Seeded ${operations.length} ui translation keys for fr.`);
}

module.exports = {
  entries,
  ensureLocale,
  run,
};

if (require.main === module) {
  run()
    .catch((error) => {
      console.error('Failed to seed fr UI translations:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      try {
        await mongoose.connection.close();
      } catch (error) {
        // Ignore close errors.
      }
    });
}
