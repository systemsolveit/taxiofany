/**
 * NL / FR / EN copy for CMS-seeded services and blog posts (keys match Mongo slugs).
 * English strings align with BASE_SERVICES and buildSeedPosts in bootstrap scripts.
 */

const SERVICE_BUNDLES = {
  'handicap-transport': {
    en: {
      title: 'Handicap Transport',
      shortDescription:
        'Wheelchair-accessible vans with ramps or lifts, trained drivers, secure restraint systems and 24/7 dispatch for hospital and care-home rides across Belgium.',
      description:
        'Taxiofany specialises in handicap and wheelchair-accessible transport. Our adapted fleet includes low-floor entry, side ramps and wheelchair lifts with ISO-compatible anchorage and four-point restraints. Drivers are trained for safe transfers and communication with passengers and caregivers. TFlex and Mutuelle billing paperwork can be prepared on request. We prioritise medical appointments, therapy visits and dignified daily mobility.',
      features: [
        {
          title: 'Ramps, lifts and securement',
          description:
            'Vehicles equipped with access ramps or lifts, plus correct wheelchair tie-downs for every trip.',
        },
        {
          title: 'Trained accessibility drivers',
          description:
            'Crews rehearse boarding angles, restraint checks and calm assistance for reduced mobility.',
        },
        {
          title: 'TFlex / Mutuelle on request',
          description:
            'Ask when booking—we provide confirmations and invoicing useful for many reimbursement schemes.',
        },
      ],
      benefitPoints: [
        'Companion seating when you book ahead',
        'Dispatch tuned for clinics, hospitals and care homes',
        'Same booking flow as business and regular taxi',
      ],
    },
    nl: {
      title: 'Gehandicaptenvervoer',
      shortDescription:
        'Rolstoeltoegankelijke busjes met plaat of lift, opgeleide chauffeurs, veilige bevestiging en 24/7-regeling voor ziekenhuis- en rusthuisritten in heel België.',
      description:
        'Taxiofany is gespecialiseerd in gehandicapten- en rolstoelvervoer. Onze aangepaste vloot heeft verlaagde instap, zijplaten en rolstoelliften met ISO-compatibele ankerpunten en vierpuntsbevestiging. Chauffeurs worden opgeleid voor veilige transfers en heldere communicatie met passagiers en zorgers. TFlex- en Mutuelle-documentatie kan op aanvraag worden voorbereid. We geven prioriteit aan medische afspraken, therapie en waardige dagelijkse mobiliteit.',
      features: [
        {
          title: 'Platen, liften en vastzetting',
          description:
            'Voertuigen met toegangsplaat of lift en correcte rolstoelophanging bij elke rit.',
        },
        {
          title: 'Opgeleide toegankelijkheidschauffeurs',
          description:
            'Teams oefenen instaphellingen, controle van bevestiging en rustige hulp bij beperkte mobiliteit.',
        },
        {
          title: 'TFlex / Mutuelle op aanvraag',
          description:
            'Vraag het bij het boeken — ritbevestigingen en facturen bruikbaar voor veel terugbetalingsregelingen.',
        },
      ],
      benefitPoints: [
        'Begeleidersplaats als u vooraf reserveert',
        'Regeling afgestemd op klinieken, ziekenhuizen en rusthuizen',
        'Zelfde boekingsflow als zakelijk en regulier taxi',
      ],
    },
    fr: {
      title: 'Transport handicap',
      shortDescription:
        'Véhicules accessibles avec rampes ou élévateurs, chauffeurs formés, arrimage sécurisé et régulation 24/7 pour hôpitaux et maisons de soins en Belgique.',
      description:
        'Taxiofany est spécialisé dans le transport handicap et accessible en fauteuil. Notre flotte adaptée comprend accès surbaissé, rampes latérales et élévateurs avec ancrages compatibles ISO et sangles quatre points. Les chauffeurs sont formés aux transferts sécurisés et à la communication avec passagers et aidants. Les dossiers TFlex et Mutuelle peuvent être préparés sur demande. Nous priorisons les rendez-vous médicaux, les séances de rééducation et la mobilité quotidienne dans la dignité.',
      features: [
        {
          title: 'Rampes, élévateurs et arrimage',
          description:
            'Véhicules équipés de rampes ou d’élévateurs et arrimage correct du fauteuil à chaque trajet.',
        },
        {
          title: 'Chauffeurs formés à l’accessibilité',
          description:
            'Les équipes répètent les angles d’embarquement, les contrôles de sangles et l’assistance posée.',
        },
        {
          title: 'TFlex / Mutuelle sur demande',
          description:
            'Demandez à la réservation — confirmations et factures utiles pour de nombreux régimes de remboursement.',
        },
      ],
      benefitPoints: [
        'Siège accompagnant si vous réservez à l’avance',
        'Régulation orientée cliniques, hôpitaux et maisons de soins',
        'Même parcours de réservation que transport professionnel et régulier',
      ],
    },
  },
  'business-transport': {
    en: {
      title: 'Business Transport',
      shortDescription:
        'Executive and corporate rides across Belgium—airport transfers, client visits and account-ready invoicing.',
      description:
        'Business transport delivers punctual, discreet mobility for teams and executives. Schedule airport transfers, multi-stop itineraries and recurring shuttle patterns with predictable service levels. Ideal for meetings, roadshows and airport corridors serving Brussels and regional hubs.',
      features: [
        {
          title: 'Priority scheduling',
          description: 'Book recurring routes and hold slots for critical appointments.',
        },
        {
          title: 'Airport and station coverage',
          description: 'Flight-aware pickup windows and luggage-friendly vehicles.',
        },
        {
          title: 'Invoice-ready trips',
          description: 'Structured confirmations for finance teams and corporate policies.',
        },
      ],
      benefitPoints: [
        'Executive comfort and professional presentation',
        'Central coordination for multiple travellers',
        'Combine with handicap fleet when colleagues need accessible vehicles',
      ],
    },
    nl: {
      title: 'Zakelijk vervoer',
      shortDescription:
        'Executive en zakelijke ritten in heel België — luchthaven, klantbezoeken en facturatie klaar voor uw administratie.',
      description:
        'Zakelijk vervoer levert stipte, discrete mobiliteit voor teams en directies. Plan luchthaventransfers, routes met meerdere stops en terugkerende shuttlepatronen met voorspelbare service. Ideaal voor vergaderingen, roadshows en luchthaven-assen rond Brussel en regionale knooppunten.',
      features: [
        {
          title: 'Prioriteit in planning',
          description: 'Reserveer terugkerende routes en tijdsloten voor kritieke afspraken.',
        },
        {
          title: 'Luchthaven en stations',
          description: 'Opstaan volgens vluchtvensters en voertuigen met bagageruimte.',
        },
        {
          title: 'Facturatieklare ritten',
          description: 'Gestructureerde bevestigingen voor finance en bedrijfsrichtlijnen.',
        },
      ],
      benefitPoints: [
        'Executive comfort en professionele uitstraling',
        'Centrale coördinatie voor meerdere reizigers',
        'Combineer met gehandicaptenvloot als collega’s een toegankelijk voertuig nodig hebben',
      ],
    },
    fr: {
      title: 'Transport professionnel',
      shortDescription:
        'Courses cadres et entreprises en Belgique — transferts aéroport, visites clients et facturation structurée.',
      description:
        'Le transport professionnel assure une mobilité ponctuelle et discrète pour équipes et dirigeants. Planifiez transferts aéroport, itinéraires multi-arrêts et navettes récurrentes avec un niveau de service stable. Idéal pour réunitions, roadshows et axes aéroportuaires desservant Bruxelles et les hubs régionaux.',
      features: [
        {
          title: 'Planification prioritaire',
          description: 'Réservez des lignes récurrentes et des créneaux pour rendez-vous critiques.',
        },
        {
          title: 'Couverture aéroports et gares',
          description: 'Fenêtres d’enlèvement synchronisées aux vols et véhicules adaptés au bagage.',
        },
        {
          title: 'Trajets prêts pour facturation',
          description: 'Confirmations structurées pour les équipes finance et les politiques internes.',
        },
      ],
      benefitPoints: [
        'Confort exécutif et présentation soignée',
        'Coordination centrale pour plusieurs voyageurs',
        'Combinable avec la flotte handicap lorsque des collègues ont besoin d’un véhicule accessible',
      ],
    },
  },
  'regular-transport': {
    en: {
      title: 'Regular Transport',
      shortDescription:
        'Everyday taxi rides with transparent pricing—city errands, evenings out and quick hops across Belgium.',
      description:
        'Regular transport covers standard taxi demand: shopping trips, social visits, station runs and late-night journeys. Use the same trusted Taxiofany dispatch and drivers when you do not need a wheelchair-accessible vehicle—simple booking and clear communication.',
      features: [
        {
          title: 'Fast urban pickups',
          description: 'Dispatch optimised for dense Belgian cities and suburbs.',
        },
        {
          title: 'Clear fares',
          description: 'Straightforward pricing with digital receipts when you need them.',
        },
        {
          title: 'Friendly support',
          description: 'Reach dispatch for changes, delays or extra stops.',
        },
      ],
      benefitPoints: [
        'Ideal when mobility aids are not required',
        'Same booking channels as handicap and business transport',
        'Evening and weekend coverage subject to availability',
      ],
    },
    nl: {
      title: 'Regulier vervoer',
      shortDescription:
        'Gewone taxiritten met duidelijke tarieven — boodschappen, avondjes uit en korte ritten in heel België.',
      description:
        'Regulier vervoer dekt standaard taxivraag: boodschappen, bezoeken, stationsritten en nachtelijke ritten. Gebruik dezelfde betrouwbare Taxiofany-regeling en chauffeurs wanneer u geen rolstoelbusje nodig heeft — eenvoudig boeken en duidelijke communicatie.',
      features: [
        {
          title: 'Snelle stedelijke ophaling',
          description: 'Regeling afgestemd op drukke Belgische steden en buitenwijken.',
        },
        {
          title: 'Heldere tarieven',
          description: 'Transparante prijs en digitale bonnetjes wanneer nodig.',
        },
        {
          title: 'Vriendelijke ondersteuning',
          description: 'Bel de regeling bij wijzigingen, vertraging of extra stops.',
        },
      ],
      benefitPoints: [
        'Ideaal wanneer geen hulpmiddelen nodig zijn',
        'Zelfde boekingskanalen als gehandicapten- en zakelijk vervoer',
        'Avond en weekend afhankelijk van beschikbaarheid',
      ],
    },
    fr: {
      title: 'Transport régulier',
      shortDescription:
        'Courses taxi quotidiennes avec tarifs clairs — courses, sorties et trajets courts en Belgique.',
      description:
        'Le transport régulier couvre la demande taxi standard : courses, visites, gares et trajets nocturnes. Utilisez la même répartition Taxiofany de confiance lorsque vous n’avez pas besoin d’un véhicule accessible — réservation simple et communication claire.',
      features: [
        {
          title: 'Prises en charge rapides en ville',
          description: 'Régulation optimisée pour les centres urbains et banlieues belges.',
        },
        {
          title: 'Tarifs transparents',
          description: 'Prix lisibles avec reçus numériques sur demande.',
        },
        {
          title: 'Assistance réactive',
          description: 'Contactez la répartition pour changements, retards ou arrêts supplémentaires.',
        },
      ],
      benefitPoints: [
        'Idéal lorsqu’aucun équipement médical n’est requis',
        'Mêmes canaux que transport handicap et professionnel',
        'Soir et week-end selon disponibilité',
      ],
    },
  },
};

/** Blog slugs must match bootstrap-blog-template.js */
const BLOG_BUNDLES = {
  'wheelchair-taxi-belgium-guide': {
    en: {
      title: 'Choosing a wheelchair taxi in Belgium: what to ask dispatch',
      excerpt:
        'From vehicle equipment to timing windows—practical questions that help Taxiofany match you with the right accessible van.',
      content:
        'Belgium’s cities mix narrow streets, tram corridors and fast-changing traffic. When you book a wheelchair-accessible taxi, clarity prevents surprises: share whether you use a manual chair, power chair or scooter, approximate width and weight, and whether you need a rear lift versus a side ramp. Mention hospital wings or therapy suites with tight turning circles so dispatch can assign a proven vehicle.',
      contentSecondary:
        'Ask how restraint points will be used and whether a caregiver seat must stay next to the passenger. If you use public reimbursement (TFlex, Mutuelle or similar), request paperwork early—confirmations and structured invoices are easier to produce when mentioned at booking time.',
      contentTertiary:
        'Finally, plan buffer time for first-time pickups. Drivers may need a few extra minutes to position the van, deploy the ramp or lift, and double-check securement. That investment keeps every passenger safe and calm.',
      sectionHeading: 'Checklist before you book',
      sectionParagraphOne:
        'Write down the full address including door codes, and note if you require a bariatric-friendly vehicle or extra luggage space for medical equipment.',
      sectionParagraphTwo:
        'If the passenger is non-verbal or fatigues easily, add that to the notes field—crews use it to modulate speed, lighting and communication during the transfer.',
      quoteText:
        'A five-minute brief with dispatch saves twenty minutes at the kerb—especially in Brussels, Antwerp or Ghent peak hours.',
      quoteAuthor: '— Taxiofany dispatch team',
    },
    nl: {
      title: 'Een rolstoeltaxi in België kiezen: wat vraagt u aan dispatch?',
      excerpt:
        'Van voertuiguitrusting tot tijdsvensters — praktische vragen zodat Taxiofany u de juiste toegankelijke bus kan geven.',
      content:
        'Belgische steden combineren smalle straten, tramcorridors en snel veranderend verkeer. Bij een rolstoeltoegankelijke taxi voorkomt duidelijkheid verrassingen: deel of u een handrolstoel, elektrische rolstoel of scooter gebruikt, geschatte breedte en gewicht, en of u een achterlift of zijplaat nodig heeft. Vermeld ziekenhuizen of therapieruimtes met krappe bochten zodat dispatch een bewezen voertuig kan toewijzen.',
      contentSecondary:
        'Vraag hoe bevestigingspunten worden gebruikt en of een begeleidersplaats naast de passagier moet blijven. Bij terugbetaling (TFlex, Mutuelle of gelijkaardig): vraag documentatie tijdig — bevestigingen en gestructureerde facturen zijn eenvoudiger als u ze bij het boeken meldt.',
      contentTertiary:
        'Plan buffer bij eerste ophalingen. Chauffeurs hebben soms extra minuten nodig om het busje te plaatsen, plaat of lift te gebruiken en de bevestiging te controleren. Dat houdt elke rit veilig en rustig.',
      sectionHeading: 'Checklist voor u boekt',
      sectionParagraphOne:
        'Noteer het volledige adres inclusief deurbellen en of u een geschikt voertuig voor zwaardere rolstoelen of extra ruimte voor medische hulpmiddelen nodig heeft.',
      sectionParagraphTwo:
        'Als de passagier niet verbale communicatie gebruikt of snel moe wordt, vermeld dit — crews passen tempo, licht en communicatie aan.',
      quoteText:
        'Vijf minuten briefing bij dispatch bespaart twintig minuten aan de stoeprand — vooral in Brussel, Antwerpen of Gent op piekmomenten.',
      quoteAuthor: '— Taxiofany dispatch',
    },
    fr: {
      title: 'Choisir un taxi fauteuil en Belgique : questions à poser à la répartition',
      excerpt:
        'De l’équipement aux créneaux horaires — les bonnes questions pour que Taxiofany vous attribue le bon véhicule accessible.',
      content:
        'Les villes belges mélangent rues étroites, couloirs de tram et trafic changeant. Pour un taxi accessible, la clarté évite les surprises : précisez fauteuil manuel, électrique ou scooter, largeur et poids approximatifs, et si vous imposez un élévateur arrière ou une rampe latérale. Mentionnez les ailes d’hôpital ou salles de rééducation avec rayons de braquage serrés.',
      contentSecondary:
        'Demandez comment les points d’ancrage seront utilisés et si un siège accompagnant doit rester à côté du passager. Pour les remboursements (TFlex, Mutuelle…), demandez les documents tôt — confirmations et factures structurées sont plus simples si vous le signalez à la réservation.',
      contentTertiary:
        'Prévoyez une marge pour les premières prises en charge : positionnement du véhicule, rampe ou lift, double contrôle des sangles. Ce temps protège passagers et équipages.',
      sectionHeading: 'Liste avant réservation',
      sectionParagraphOne:
        'Indiquez l’adresse complète avec codes et si vous avez besoin d’un véhicule adapté aux fauteuils lourds ou de place pour du matériel médical.',
      sectionParagraphTwo:
        'Si la personne est fatiguée ou non verbale, ajoutez-le dans les notes — l’équipe adapte vitesse, éclairage et communication.',
      quoteText:
        'Cinq minutes avec la répartition évitent vingt minutes au trottoir — surtout à Bruxelles, Anvers ou Gand aux heures de pointe.',
      quoteAuthor: '— Équipe dispatch Taxiofany',
    },
  },
  'tflex-mutuelle-reimbursement-basics': {
    en: {
      title: 'TFlex & Mutuelle: reimbursement basics for taxi rides',
      excerpt:
        'How to keep rides eligible for reimbursement schemes—documentation tips that pair with Taxiofany invoices.',
      content:
        'Many Belgian passengers rely on TFlex, Mutuelle or insurer-specific paperwork for mobility support. Start by confirming which scheme applies and whether a GP prescription or social-secretariat validation is required before transport begins.',
      contentSecondary:
        'Keep ride confirmations that include pickup time, destination and tariff breakdown. When Taxiofany issues invoices, match names exactly with beneficiary records—clerical mismatches are the most common reason claims stall.',
      contentTertiary:
        'If your scheme reimburses only certain mileage bands or caps trips per quarter, share those constraints when booking recurring therapies—we can help pace appointments realistically.',
      sectionHeading: 'Paper trail hygiene',
      sectionParagraphOne:
        'Digital receipts are usually acceptable if legible, but some insurers still demand stamped proofs—ask before shredding paper copies.',
      sectionParagraphTwo:
        'When upgrading from regular taxi to handicap transport mid-case, note the medical justification so reviewers understand the higher tariff.',
      quoteText:
        'File reimbursement bundles within the statutory windows; late packets rarely benefit from goodwill appeals.',
      quoteAuthor: '— Mobility advisers',
    },
    nl: {
      title: 'TFlex & Mutuelle: basis voor terugbetaling van taxiritten',
      excerpt:
        'Hoe ritten in aanmerking blijven — documentatietips die passen bij Taxiofany-facturen.',
      content:
        'Veel Belgische passagiers vertrouwen op TFlex, Mutuelle of verzekeraars voor mobiliteitssteun. Bevestig eerst welk regime geldt en of een voorschrift of validatie door het sociaal secretariaat nodig is vóór transport.',
      contentSecondary:
        'Bewaar ritbevestigingen met ophaaltijd, bestemming en tariefopbouw. Bij Taxiofany-facturen: namen exact gelijk aan begunstigden — administratieve fouten zijn de meest voorkomende reden voor vertraging.',
      contentTertiary:
        'Als uw regeling alleen bepaalde kilometers of een maximum per kwartaal vergoedt, meld dat bij terugkerende therapie — we helpen schema’s realistisch te plannen.',
      sectionHeading: 'Documentatie netjes houden',
      sectionParagraphOne:
        'Digitale bonnen zijn meestal oké als ze leesbaar zijn; sommige verzekeraars eisen gestempelde bewijzen — vraag het voor u papier vernietigt.',
      sectionParagraphTwo:
        'Als u overstapt van regulier naar gehandicaptenvervoer, noteer de medische reden zodat controleurs het hogere tarief begrijpen.',
      quoteText:
        'Dien bundels tijdig in; late dossiers krijgen zelden coulance.',
      quoteAuthor: '— Mobiliteitsadviseurs',
    },
    fr: {
      title: 'TFlex & Mutuelle : bases de remboursement pour courses en taxi',
      excerpt:
        'Rendre les trajets éligibles — conseils documentaires assortis aux factures Taxiofany.',
      content:
        'Nombreux Belges s’appuient sur TFlex, Mutuelle ou contrats assureurs. Confirmez le régime applicable et si une prescription ou validation préalable est exigée.',
      contentSecondary:
        'Conservez les confirmations avec horaires, destination et détail tarifaire. Sur les factures Taxiofany, les noms doivent correspondre exactement aux dossiers — erreurs administratives = blocages fréquents.',
      contentTertiary:
        'Si votre convention plafonne kilomètres ou trajets trimestriels, indiquez-le pour des thérapies récurrentes — nous adaptons le rythme.',
      sectionHeading: 'Hygiène documentaire',
      sectionParagraphOne:
        'Les reçus numériques suffisent souvent ; certaines mutuelles exigent encore des tampons — renseignez-vous avant destruction.',
      sectionParagraphTwo:
        'Si vous passez du taxi classique au transport handicap, citez la justification médicale pour expliquer le tarif majoré.',
      quoteText:
        'Déposez les dossiers dans les délais légaux ; les envois tardifs sont rarement acceptés.',
      quoteAuthor: '— Conseillers mobilité',
    },
  },
  'safe-wheelchair-transfers-explained': {
    en: {
      title: 'Safe wheelchair transfers: what trained drivers rehearse',
      excerpt:
        'Inside Taxiofany’s accessibility playbook—boarding angles, braking on slopes and communicating during assisted transfers.',
      content:
        'Transfers combine physics and empathy. Drivers practise deploying ramps on gradients, setting wheel locks, and communicating each movement before it happens so riders can anticipate weight shifts.',
      contentSecondary:
        'Securement comes next: four-point tie-downs or manufacturer-approved systems are rechecked at every stop. If a passenger prefers a specific shoulder strap order, crews document it for the next leg.',
      contentTertiary:
        'When something changes—new medication causing dizziness, for example—tell the driver before rolling into the vehicle. It might mean a longer boarding window, and that is always acceptable.',
      sectionHeading: 'What families can do',
      sectionParagraphOne:
        'Clear snow, leaves or debris from home ramps before pickup; it keeps approach angles predictable for heavy vans.',
      sectionParagraphTwo:
        'If a passenger uses communication cards, show them to the driver during the first meeting so they can mirror the same vocabulary during the trip.',
      quoteText:
        'Calm, repeated communication beats rushed muscle—especially for frail or post-operative passengers.',
      quoteAuthor: '— Training lead',
    },
    nl: {
      title: 'Veilige rolstoeltransfers: wat opgeleide chauffeurs oefenen',
      excerpt:
        'Het Taxiofany-toegankelijkheidsprotocol — instaphellingen, remmen op hellingen en communicatie tijdens transfers.',
      content:
        'Transfers combineren fysica en empathie. Chauffeurs oefenen het plaatsen van platen op hellingen, het vastzetten van wielen en het communiceren vóór elke beweging.',
      contentSecondary:
        'Daarna bevestiging: vierpuntsystemen of goedgekeurde fabriekssystemen worden bij elke stop gecontroleerd. Bij voorkeur voor een bepaalde riemvolgorde wordt dat genoteerd voor de volgende rit.',
      contentTertiary:
        'Verandert er iets — bijvoorbeeld nieuwe medicatie met duizeligheid — meld het vóór het instappen. Een langere instap is altijd oké.',
      sectionHeading: 'Wat gezinnen kunnen doen',
      sectionParagraphOne:
        'Ruim sneeuw, bladeren of rommel van hellingen thuis zodat zware busjes een voorspelbare aanloop hebben.',
      sectionParagraphTwo:
        'Gebruikt de passagier communicatiekaarten? Toon ze bij de eerste kennismaking zodat de chauffeur dezelfde woorden gebruikt.',
      quoteText:
        'Rustige, herhaalde communicatie wint van haast — vooral bij kwetsbare of postoperatieve passagiers.',
      quoteAuthor: '— Trainingsverantwoordelijke',
    },
    fr: {
      title: 'Transferts fauteuil sécurisés : ce que répètent les chauffeurs',
      excerpt:
        'Le playbook accessibilité Taxiofany — angles de rampe, freinage et communication.',
      content:
        'Les transferts mélangent physique et empathie. Les chauffeurs répètent rampes sur pente, freins de fauteuil et annonces avant chaque mouvement.',
      contentSecondary:
        'Puis l’arrimage : sangles quatre points ou systèmes homologués revérifiés à chaque arrêt. Ordre des sangles préféré ? Il est consigné pour la suite.',
      contentTertiary:
        'Quelque chose change — nouveau médicament, vertiges ? Prévenez avant d’embarquer ; une montée plus lente est toujours acceptable.',
      sectionHeading: 'Ce que les familles peuvent faire',
      sectionParagraphOne:
        'Dégager neige et feuilles sur les rampes domestiques pour sécuriser l’approche des vans.',
      sectionParagraphTwo:
        'Cartes de communication ? Montrez-les au premier contact pour harmoniser le vocabulaire.',
      quoteText:
        'Une communication calme et répétée bat la précipitation — surtout pour les passagers fragiles.',
      quoteAuthor: '— Responsable formation',
    },
  },
  'hospital-and-care-home-rides': {
    en: {
      title: 'Hospital and care-home rides: how dispatch prioritises care traffic',
      excerpt:
        'Why 24/7 lines matter for discharge windows, radiology follow-ups and rusthuis transfers across Belgium.',
      content:
        'Care traffic is time-bounded: late discharges, narrow radiology slots and strict medication windows. Taxiofany’s dispatch model keeps spare capacity for medical clusters and escalates when hospitals call with last-minute changes.',
      contentSecondary:
        'For care homes, share both the reception protocol and the resident’s room phone if escorts need to meet you at a side gate. Night rides may require different entrances—include that in the notes field.',
      contentTertiary:
        'If a return trip might run long because of waiting rooms, build buffer when booking the second leg. Dispatch can often hold a driver nearby for modest standby if you warn them early.',
      sectionHeading: 'Reducing no-shows',
      sectionParagraphOne:
        'Send mobile numbers that actually reach the passenger or escort—landlines in ward rooms are unreliable.',
      sectionParagraphTwo:
        'For recurring dialysis, book standing slots weekly; patterns help roster planners assign the same crew when possible, which calms anxious riders.',
      quoteText:
        'The best handoffs happen when facility staff and drivers share the same clock—use 24h time in written instructions.',
      quoteAuthor: '— Care coordinator',
    },
    nl: {
      title: 'Ziekenhuis- en rusthuisritten: hoe dispatch zorgverkeer prioriteit geeft',
      excerpt:
        'Waarom 24/7-lijnen belangrijk zijn voor ontslagvensters, radiologie en rusthuistransfers.',
      content:
        'Zorgverkeer heeft harde tijdslimieten: late ontslagen, smalle radiologie-slots en strikte medicatievensters. Taxiofany houdt reservecapaciteit voor medische clusters en escaleert bij last-minute wijzigingen.',
      contentSecondary:
        'Voor rusthuizen: deel receptieprotocol én GSM van de kamer als begeleiders aan een zijingang moeten zijn. Nachtritten gebruiken soms andere ingangen — noteer dat.',
      contentTertiary:
        'Als een terugrit uitloopt door wachtkamers, plan marge bij het tweede deel. Dispatch kan vaak een chauffeur in de buurt houden bij vroege waarschuwing.',
      sectionHeading: 'No-shows verminderen',
      sectionParagraphOne:
        'Stuur GSM-nummers die de passagier of begeleider écht bereiken — vaste lijnen op kamers falen vaak.',
      sectionParagraphTwo:
        'Dialyse? Reserveer vaste wekelijkse slots; patronen helpen om dezelfde crew toe te wijzen wat angst vermindert.',
      quoteText:
        'De beste overdracht is als zorg en chauffeur dezelfde klok gebruiken — schrijf in 24-uurs tijd.',
      quoteAuthor: '— Zorgcoördinator',
    },
    fr: {
      title: 'Trajets hôpital et maisons de soins : priorité au trafic médical',
      excerpt:
        'Pourquoi les lignes 24/7 comptent pour sorties d’hospitalisation et transferts maison de repos.',
      content:
        'Le trafic médical est ultra horodaté : sorties tardives, créneaux radiologie étroits, fenêtres médicamenteuses. Taxiofany conserve de la marge pour clusters médicaux et escalade les urgences hospitalières.',
      contentSecondary:
        'Pour les résidences : protocole d’accueil et GSM de chambre si les accompagnants doivent se retrouver à une porte latérale. Les trajets nocturnes utilisent parfois d’autres entrées — notez-le.',
      contentTertiary:
        'Si le retour risque de s’allonger à cause des salles d’attente, prévoyez une marge ; la répartition peut garder un chauffeur proche si vous prévenez tôt.',
      sectionHeading: 'Limiter les lapins',
      sectionParagraphOne:
        'Donnez des mobiles joignables — les lignes fixes des chambres sont peu fiables.',
      sectionParagraphTwo:
        'Dialyse récurrente ? Réservez des créneaux fixes ; les planners peuvent garder la même équipe pour rassurer.',
      quoteText:
        'Les meilleures passations alignent horloge établissement et chauffeur — utilisez le format 24 h.',
      quoteAuthor: '— Coordinateur soins',
    },
  },
  'business-transport-vs-regular-taxi': {
    en: {
      title: 'Business transport vs regular taxi: when to choose each Taxiofany service',
      excerpt:
        'Same fleet credibility—different service packages. A concise comparison for mobility buyers and travel desks.',
      content:
        'Business transport shines when invoices, SLAs and predictable chauffeurs matter—think roadshows, diplomatic hospitality or recurring shuttle loops between campuses.',
      contentSecondary:
        'Regular transport suits citizens who simply need a sedan or MPV without accessibility adaptations: dinners, station hops or substitute rides while a personal car is serviced.',
      contentTertiary:
        'If travellers occasionally need accessibility but mostly ride standard vehicles, keep both profiles on file so switching tiers never surprises finance.',
      sectionHeading: 'Buying tips',
      sectionParagraphOne:
        'Align procurement calendars so quarterly reviews examine blended usage—many employers underestimate how often hybrid teams tap wheelchair vans.',
      sectionParagraphTwo:
        'Train assistants to flag urgent switches—moving from business sedan to accessible van should take only one phone call if passenger conditions flare.',
      quoteText:
        'Handicap transport sits beside both categories—it shares booking rails but adds regulated securement and specialised vehicles.',
      quoteAuthor: '— Operations planner',
    },
    nl: {
      title: 'Zakelijk vs regulier taxi: wanneer kiest u welke Taxiofany-dienst?',
      excerpt:
        'Dezelfde betrouwbare vloot — verschillende pakketten. Kort voor inkopers en travel desks.',
      content:
        'Zakelijk vervoer blinkt uit bij facturen, SLA’s en vaste chauffeurs — roadshows, diplomatieke gasten of pendels tussen campussen.',
      contentSecondary:
        'Regulier vervoer past bij sedan of MPV zonder aanpassingen: diners, stationsritten of vervangtransport tijdens onderhoud.',
      contentTertiary:
        'Als reizigers soms toegankelijkheid nodig hebben maar meestal standaard rijden: bewaar beide profielen zodat financiële teams niet verrast worden bij een switch.',
      sectionHeading: 'Tips voor inkopers',
      sectionParagraphOne:
        'Stem inkoopkalenders af zodat kwartaalreviews ook gemengd gebruik tonen — werkgevers onderschatten vaak hoe vaak teams rolstoelbusjes nodig hebben.',
      sectionParagraphTwo:
        'Train planners om urgente switches te melden — van zakelijke sedan naar toegankelijk busje moet met één telefoontje kunnen.',
      quoteText:
        'Gehandicaptenvervoer staat naast beide — dezelfde boeking maar met erkende bevestiging en gespecialiseerde voertuigen.',
      quoteAuthor: '— Operations planner',
    },
    fr: {
      title: 'Transport pro vs taxi régulier : quel service Taxiofany choisir ?',
      excerpt:
        'Même flotte de confiance — offres différentes. Synthèse pour acheteurs mobilité.',
      content:
        'Le transport professionnel prend le relais quand factures, SLA et chauffeurs stables comptent — roadshows, protocoles diplomatiques ou navettes inter-sites.',
      contentSecondary:
        'Le transport régulier convient aux berlines ou monospace sans adaptation : dîners, gares ou véhicule de substitution.',
      contentTertiary:
        'Si vos voyageurs alternent accessibilité et véhicules standards, conservez deux profils pour éviter les surprises financières lors des bascules.',
      sectionHeading: 'Conseils achats',
      sectionParagraphOne:
        'Alignez les revues trimestrielles sur l’usage mixte — les RH sous-estiment souvent les besoins en vans accessibles.',
      sectionParagraphTwo:
        'Formez les assistants à signaler les urgences : passer de berline à van accessible doit prendre un seul appel.',
      quoteText:
        'Le transport handicap complète les deux — même réservation mais arrimage encadré et véhicules spécialisés.',
      quoteAuthor: '— Planificateur opérations',
    },
  },
  'airport-transfer-tips-belgium': {
    en: {
      title: 'Airport transfers in Belgium: terminals, pickup bays and luggage clocks',
      excerpt:
        'Brussels Airport plus regional hubs—what to communicate so Taxiofany meets you at the correct kerb with enough hold time.',
      content:
        'International arrivals mean unpredictable queues. Share flight numbers even for outbound pickups—drivers monitor gates when airlines cooperate.',
      contentSecondary:
        'Declare oversized mobility aids early; some airport bays restrict lift deployment length. If you connect between trains and planes, mention luggage counts so MPVs are dispatched.',
      contentTertiary:
        'Night bans at certain terminals occasionally reroute rides—follow SMS instructions from dispatch rather than crossing active taxi queues.',
      sectionHeading: 'Regional airports too',
      sectionParagraphOne:
        'Charleroi, Ostend-Bruges and Liège each use different rideshare bays—copy terminal maps into booking notes when unsure.',
      sectionParagraphTwo:
        'Eurostar arrivals at Brussels South benefit from specifying platforms—drivers stage differently for Schengen vs UK exits.',
      quoteText:
        'Buffer forty-five minutes between theoretical landing and taxi pickup until you learn your usual customs rhythm.',
      quoteAuthor: '— Frequent flyer desk',
    },
    nl: {
      title: 'Luchthaventransfers in België: terminals, ophaalstroken en bagage',
      excerpt:
        'Brussels Airport en regionale hubs — wat door te geven zodat Taxiofany u correct oppikt.',
      content:
        'Internationale aankomsten betekenen onvoorspelbare rijen. Deel vluchtnummers ook bij vertrek — chauffeurs volgen gates wanneer airlines meewerken.',
      contentSecondary:
        'Meld grote hulpmiddelen tijdig; sommige ophaalstroken beperken liftlengte. Combineert u trein en vliegtuig? Vermeld bagage zodat MPV’s worden ingezet.',
      contentTertiary:
        'Nachtverboden bij terminals kunnen omleidingen vragen — volg SMS van dispatch i.p.v. actieve taxirijen te kruisen.',
      sectionHeading: 'Regionale luchthavens',
      sectionParagraphOne:
        'Charleroi, Oostende-Brugge en Luik hebben elk andere zones — plattegronden in de boekingsnotities helpen.',
      sectionParagraphTwo:
        'Eurostar Brussel-Zuid: vermeld perron — chauffeurs positioneren anders voor Schengen vs UK.',
      quoteText:
        'Plan 45 minuten tussen landing en taxi tot u uw douaneritme kent.',
      quoteAuthor: '— Frequent flyer desk',
    },
    fr: {
      title: 'Transferts aéroport en Belgique : terminaux, zones et bagages',
      excerpt:
        'Brussels Airport et plateformes régionales — infos à transmettre pour un enlèvement fiable.',
      content:
        'Les arrivées internationales sont imprévisibles. Donnez les numéros de vol même au départ — les chauffeurs suivent les portes si les compagnies coopèrent.',
      contentSecondary:
        'Signalez tôt les aides volumineuses ; certaines zones limitent la longueur d’élévateur. Correspondances train/avion ? Indiquez les bagages pour envoyer des monospace.',
      contentTertiary:
        'Des restrictions nocturnes peuvent dérouter — suivez les SMS plutôt que de traverser les files actives.',
      sectionHeading: 'Aéroports régionaux',
      sectionParagraphOne:
        'Charleroi, Ostende-Bruges et Liège ont des zones différentes — joignez un plan si besoin.',
      sectionParagraphTwo:
        'Eurostar Bruxelles-Midi : précisez les quais — positionnement différent Schengen vs UK.',
      quoteText:
        'Prévoyez 45 minutes entre atterrissage et taxi jusqu’à connaître vos habitudes douanières.',
      quoteAuthor: '— Desk voyageurs',
    },
  },
  'caregiver-checklist-before-the-ride': {
    en: {
      title: 'Caregiver checklist: before the accessible taxi arrives',
      excerpt:
        'Medication windows, comfort items and weather prep—help your loved one feel steady before the first ramp deploys.',
      content:
        'Start with vitals: is the passenger hydrated, warm enough and clear on the destination? Confirm assistive devices are charged and packed, with spare catheters or suction supplies if the day runs long.',
      contentSecondary:
        'Print an emergency contact block in three languages if you cross language zones; Flemish facilities may not know Walloon phone trees and vice versa.',
      contentTertiary:
        'Pack folding ponchos for drizzle—Belgium’s sideways rain soaks wheelchair cushions fast. A dry cushion protects skin integrity across multi-leg trips.',
      sectionHeading: 'Communication cues',
      sectionParagraphOne:
        'Coach quiet breathing exercises before boarding anxiety spikes; drivers appreciate caregivers who stabilise emotions before wheels roll.',
      sectionParagraphTwo:
        'Snap a photo of medications blister packs if swaps occur mid-trip—pharmacists halfway across Brussels appreciate photographic clarity.',
      quoteText:
        'If something feels off, delay the ride—no penalty equals no regret when health wobbles.',
      quoteAuthor: '— Family advocate',
    },
    nl: {
      title: 'Zorg-checklist: voor de toegankelijke taxi arriveert',
      excerpt:
        'Medicatie, comfort en weer — help uw naaste rustig te zijn vóór de eerste plaat.',
      content:
        'Start met basiszaken: voldoende drinken, warm genoeg, bestemming helder? Controleer dat hulpmiddelen opgeladen zijn en reserve voor lange dagen.',
      contentSecondary:
        'Print noodcontacten in drie talen bij taalgrenzen; Vlaamse diensten kennen geen Waalse lijnnummers en omgekeerd.',
      contentTertiary:
        'Neem opvouwbare poncho’s mee — Belgische windregen doorweekt snel kussens. Een droog kussen beschermt de huid op meer etappes.',
      sectionHeading: 'Communicatie',
      sectionParagraphOne:
        'Oefen rustige ademhaling vóór paniek bij het instappen; chauffeurs waarderen zorgers die emoties stabiliseren.',
      sectionParagraphTwo:
        'Foto van medicatieblisters bij wissels onderweg — apothekers in een andere stad snappen sneller wat u bedoelt.',
      quoteText:
        'Voelt iets niet goed? Stel de rit uit — gezondheid gaat voor.',
      quoteAuthor: '— familievereniging',
    },
    fr: {
      title: 'Checklist aidant : avant l’arrivée du taxi accessible',
      excerpt:
        'Médicaments, confort et météo — stabiliser la personne avant la rampe.',
      content:
        'Vérifiez hydratation, chaleur et compréhension de la destination. Chargez aides et prévoyez rechanges pour longues journées.',
      contentSecondary:
        'Imprimez contacts d’urgence en trois langues si vous traversez des zones linguistiques méconnues.',
      contentTertiary:
        'Emportez ponchos pliables — la pluie oblique belge imbibe vite les coussins ; un coussin sec protège la peau sur trajets multi-segments.',
      sectionHeading: 'Communication',
      sectionParagraphOne:
        'Apprenez respiration calme avant l’angoisse d’embarquement ; les chauffeurs aiment les aidants qui apaisent.',
      sectionParagraphTwo:
        'Photographiez les plaquettes médicamenteuses en cas de changement en route — les pharmaciens comprennent vite.',
      quoteText:
        'Si quelque chose cloche, reportez la course — la santé passe avant l’horaire.',
      quoteAuthor: '— Association familles',
    },
  },
};

/** Keys match `blog.category.<slug>` after normalising category labels (lowercase, hyphenated). */
const CATEGORY_LABELS = {
  mobility: { en: 'Mobility', nl: 'Mobiliteit', fr: 'Mobilité' },
  reimbursement: { en: 'Reimbursement', nl: 'Terugbetaling', fr: 'Remboursement' },
  safety: { en: 'Safety', nl: 'Veiligheid', fr: 'Sécurité' },
  hospital: { en: 'Hospital', nl: 'Ziekenhuis', fr: 'Hôpital' },
  business: { en: 'Business', nl: 'Zakelijk', fr: 'Affaires' },
  airport: { en: 'Airport', nl: 'Luchthaven', fr: 'Aéroport' },
  caregiving: { en: 'Caregiving', nl: 'Zorg', fr: 'Aidance' },
};

module.exports = {
  SERVICE_BUNDLES,
  BLOG_BUNDLES,
  CATEGORY_LABELS,
};
