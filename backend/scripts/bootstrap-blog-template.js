const { connectDatabase, mongoose } = require('../config/database');
const { BlogPost } = require('../models');

function buildSeedPosts() {
  return [
    {
      title: 'Choosing a wheelchair taxi in Belgium: what to ask dispatch',
      slug: 'wheelchair-taxi-belgium-guide',
      excerpt:
        'From vehicle equipment to timing windows—practical questions that help Taxiofany match you with the right accessible van.',
      content:
        'Belgium’s cities mix narrow streets, tram corridors and fast-changing traffic. When you book a wheelchair-accessible taxi, clarity prevents surprises: share whether you use a manual chair, power chair or scooter, approximate width and weight, and whether you need a rear lift versus a side ramp. Mention hospital wings or therapy suites with tight turning circles so dispatch can assign a proven vehicle.',
      contentSecondary:
        'Ask how restraint points will be used and whether a caregiver seat must stay next to the passenger. If you use public reimbursement (TFlex, Mutuelle or similar), request paperwork early—confirmations and structured invoices are easier to produce when mentioned at booking time.',
      quoteText:
        'A five-minute brief with dispatch saves twenty minutes at the kerb—especially in Brussels, Antwerp or Ghent peak hours.',
      quoteAuthor: '— Taxiofany dispatch team',
      contentTertiary:
        'Finally, plan buffer time for first-time pickups. Drivers may need a few extra minutes to position the van, deploy the ramp or lift, and double-check securement. That investment keeps every passenger safe and calm.',
      sectionHeading: 'Checklist before you book',
      sectionParagraphOne:
        'Write down the full address including door codes, and note if you require a bariatric-friendly vehicle or extra luggage space for medical equipment.',
      sectionParagraphTwo:
        'If the passenger is non-verbal or fatigues easily, add that to the notes field—crews use it to modulate speed, lighting and communication during the transfer.',
      category: 'Mobility',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-1.jpg',
      galleryImages: ['/assets/img/post-1.jpg', '/assets/img/post-2.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [
        { icon: 'lab la-facebook-f', url: '#' },
        { icon: 'lab la-twitter', url: '#' },
      ],
      comments: [],
      tags: ['Belgium', 'wheelchair', 'dispatch'],
      isPublished: true,
      publishedAt: new Date('2025-02-10T09:00:00.000Z'),
    },
    {
      title: 'TFlex & Mutuelle: reimbursement basics for taxi rides',
      slug: 'tflex-mutuelle-reimbursement-basics',
      excerpt:
        'How to keep rides eligible for reimbursement schemes—documentation tips that pair with Taxiofany invoices.',
      content:
        'Many Belgian passengers rely on TFlex, Mutuelle or insurer-specific paperwork for mobility support. Start by confirming which scheme applies and whether a GP prescription or social-secretariat validation is required before transport begins.',
      contentSecondary:
        'Keep ride confirmations that include pickup time, destination and tariff breakdown. When Taxiofany issues invoices, match names exactly with beneficiary records—clerical mismatches are the most common reason claims stall.',
      quoteText:
        'File reimbursement bundles within the statutory windows; late packets rarely benefit from goodwill appeals.',
      quoteAuthor: '— Mobility advisers',
      contentTertiary:
        'If your scheme reimburses only certain mileage bands or caps trips per quarter, share those constraints when booking recurring therapies—we can help pace appointments realistically.',
      sectionHeading: 'Paper trail hygiene',
      sectionParagraphOne:
        'Digital receipts are usually acceptable if legible, but some insurers still demand stamped proofs—ask before shredding paper copies.',
      sectionParagraphTwo:
        'When upgrading from regular taxi to handicap transport mid-case, note the medical justification so reviewers understand the higher tariff.',
      category: 'Reimbursement',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-2.jpg',
      galleryImages: ['/assets/img/post-2.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [],
      comments: [],
      tags: ['TFlex', 'Mutuelle', 'Belgium'],
      isPublished: true,
      publishedAt: new Date('2025-02-14T09:00:00.000Z'),
    },
    {
      title: 'Safe wheelchair transfers: what trained drivers rehearse',
      slug: 'safe-wheelchair-transfers-explained',
      excerpt:
        'Inside Taxiofany’s accessibility playbook—boarding angles, braking on slopes and communicating during assisted transfers.',
      content:
        'Transfers combine physics and empathy. Drivers practise deploying ramps on gradients, setting wheel locks, and communicating each movement before it happens so riders can anticipate weight shifts.',
      contentSecondary:
        'Securement comes next: four-point tie-downs or manufacturer-approved systems are rechecked at every stop. If a passenger prefers a specific shoulder strap order, crews document it for the next leg.',
      quoteText:
        'Calm, repeated communication beats rushed muscle—especially for frail or post-operative passengers.',
      quoteAuthor: '— Training lead',
      contentTertiary:
        'When something changes—new medication causing dizziness, for example—tell the driver before rolling into the vehicle. It might mean a longer boarding window, and that is always acceptable.',
      sectionHeading: 'What families can do',
      sectionParagraphOne:
        'Clear snow, leaves or debris from home ramps before pickup; it keeps approach angles predictable for heavy vans.',
      sectionParagraphTwo:
        'If a passenger uses communication cards, show them to the driver during the first meeting so they can mirror the same vocabulary during the trip.',
      category: 'Safety',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-3.jpg',
      galleryImages: ['/assets/img/post-3.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [],
      comments: [],
      tags: ['safety', 'wheelchair', 'training'],
      isPublished: true,
      publishedAt: new Date('2025-02-18T09:00:00.000Z'),
    },
    {
      title: 'Hospital and care-home rides: how dispatch prioritises care traffic',
      slug: 'hospital-and-care-home-rides',
      excerpt:
        'Why 24/7 lines matter for discharge windows, radiology follow-ups and rusthuis transfers across Belgium.',
      content:
        'Care traffic is time-bounded: late discharges, narrow radiology slots and strict medication windows. Taxiofany’s dispatch model keeps spare capacity for medical clusters and escalates when hospitals call with last-minute changes.',
      contentSecondary:
        'For care homes, share both the reception protocol and the resident’s room phone if escorts need to meet you at a side gate. Night rides may require different entrances—include that in the notes field.',
      quoteText:
        'The best handoffs happen when facility staff and drivers share the same clock—use 24h time in written instructions.',
      quoteAuthor: '— Care coordinator',
      contentTertiary:
        'If a return trip might run long because of waiting rooms, build buffer when booking the second leg. Dispatch can often hold a driver nearby for modest standby if you warn them early.',
      sectionHeading: 'Reducing no-shows',
      sectionParagraphOne:
        'Send mobile numbers that actually reach the passenger or escort—landlines in ward rooms are unreliable.',
      sectionParagraphTwo:
        'For recurring dialysis, book standing slots weekly; patterns help roster planners assign the same crew when possible, which calms anxious riders.',
      category: 'Hospital',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-4.jpg',
      galleryImages: ['/assets/img/post-4.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [],
      comments: [],
      tags: ['hospital', 'care', 'Belgium'],
      isPublished: true,
      publishedAt: new Date('2025-02-22T09:00:00.000Z'),
    },
    {
      title: 'Business transport vs regular taxi: when to choose each Taxiofany service',
      slug: 'business-transport-vs-regular-taxi',
      excerpt:
        'Same fleet credibility—different service packages. A concise comparison for mobility buyers and travel desks.',
      content:
        'Business transport shines when invoices, SLAs and predictable chauffeurs matter—think roadshows, diplomatic hospitality or recurring shuttle loops between campuses.',
      contentSecondary:
        'Regular transport suits citizens who simply need a sedan or MPV without accessibility adaptations: dinners, station hops or substitute rides while a personal car is serviced.',
      quoteText:
        'Handicap transport sits beside both categories—it shares booking rails but adds regulated securement and specialised vehicles.',
      quoteAuthor: '— Operations planner',
      contentTertiary:
        'If travellers occasionally need accessibility but mostly ride standard vehicles, keep both profiles on file so switching tiers never surprises finance.',
      sectionHeading: 'Buying tips',
      sectionParagraphOne:
        'Align procurement calendars so quarterly reviews examine blended usage—many employers underestimate how often hybrid teams tap wheelchair vans.',
      sectionParagraphTwo:
        'Train assistants to flag urgent switches—moving from business sedan to accessible van should take only one phone call if passenger conditions flare.',
      category: 'Business',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-1.jpg',
      galleryImages: ['/assets/img/post-1.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [],
      comments: [],
      tags: ['business', 'taxi', 'policy'],
      isPublished: true,
      publishedAt: new Date('2025-02-26T09:00:00.000Z'),
    },
    {
      title: 'Airport transfers in Belgium: terminals, pickup bays and luggage clocks',
      slug: 'airport-transfer-tips-belgium',
      excerpt:
        'Brussels Airport plus regional hubs—what to communicate so Taxiofany meets you at the correct kerb with enough hold time.',
      content:
        'International arrivals mean unpredictable queues. Share flight numbers even for outbound pickups—drivers monitor gates when airlines cooperate.',
      contentSecondary:
        'Declare oversized mobility aids early; some airport bays restrict lift deployment length. If you connect between trains and planes, mention luggage counts so MPVs are dispatched.',
      quoteText:
        'Buffer forty-five minutes between theoretical landing and taxi pickup until you learn your usual customs rhythm.',
      quoteAuthor: '— Frequent flyer desk',
      contentTertiary:
        'Night bans at certain terminals occasionally reroute rides—follow SMS instructions from dispatch rather than crossing active taxi queues.',
      sectionHeading: 'Regional airports too',
      sectionParagraphOne:
        'Charleroi, Ostend-Bruges and Liège each use different rideshare bays—copy terminal maps into booking notes when unsure.',
      sectionParagraphTwo:
        'Eurostar arrivals at Brussels South benefit from specifying platforms—drivers stage differently for Schengen vs UK exits.',
      category: 'Airport',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-2.jpg',
      galleryImages: ['/assets/img/post-2.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [],
      comments: [],
      tags: ['airport', 'Brussels', 'luggage'],
      isPublished: true,
      publishedAt: new Date('2025-03-02T09:00:00.000Z'),
    },
    {
      title: 'Caregiver checklist: before the accessible taxi arrives',
      slug: 'caregiver-checklist-before-the-ride',
      excerpt:
        'Medication windows, comfort items and weather prep—help your loved one feel steady before the first ramp deploys.',
      content:
        'Start with vitals: is the passenger hydrated, warm enough and clear on the destination? Confirm assistive devices are charged and packed, with spare catheters or suction supplies if the day runs long.',
      contentSecondary:
        'Print an emergency contact block in three languages if you cross language zones; Flemish facilities may not know Walloon phone trees and vice versa.',
      quoteText:
        'If something feels off, delay the ride—no penalty equals no regret when health wobbles.',
      quoteAuthor: '— Family advocate',
      contentTertiary:
        'Pack folding ponchos for drizzle—Belgium’s sideways rain soaks wheelchair cushions fast. A dry cushion protects skin integrity across multi-leg trips.',
      sectionHeading: 'Communication cues',
      sectionParagraphOne:
        'Coach quiet breathing exercises before boarding anxiety spikes; drivers appreciate caregivers who stabilise emotions before wheels roll.',
      sectionParagraphTwo:
        'Snap a photo of medications blister packs if swaps occur mid-trip—pharmacists halfway across Brussels appreciate photographic clarity.',
      category: 'Caregiving',
      authorName: 'Taxiofany editorial',
      coverImage: '/assets/img/post-3.jpg',
      galleryImages: ['/assets/img/post-3.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio:
        'Taxiofany publishes practical guidance for passengers, caregivers and employers who book accessible and standard taxi services in Belgium.',
      authorSocialLinks: [],
      comments: [],
      tags: ['caregiver', 'family', 'planning'],
      isPublished: true,
      publishedAt: new Date('2025-03-06T09:00:00.000Z'),
    },
  ];
}

async function shouldBootstrapBlogTemplate() {
  return false;
}

async function bootstrapBlogTemplate() {
  const posts = buildSeedPosts();
  const operations = posts.map((post) => ({
    updateOne: {
      filter: { slug: post.slug },
      update: { $set: post },
      upsert: true,
    },
  }));

  if (!operations.length) {
    return { count: 0 };
  }

  await BlogPost.bulkWrite(operations, { ordered: false });
  return { count: operations.length };
}

async function run() {
  await connectDatabase();
  const result = await bootstrapBlogTemplate();
  console.log(`Blog template posts upserted: ${result.count}`);
}

module.exports = {
  buildSeedPosts,
  shouldBootstrapBlogTemplate,
  bootstrapBlogTemplate,
  run,
};

if (require.main === module) {
  run()
    .catch((error) => {
      console.error('Failed to bootstrap blog template:', error.message);
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
