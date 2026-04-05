const { connectDatabase, mongoose } = require('../config/database');
const { BlogPost } = require('../models');

function buildSeedPosts() {
  return [
    {
      title: 'How To Start Initiating An Startup In Few Days.',
      slug: 'how-to-start-initiating-an-startup-in-few-days',
      excerpt: 'Practical startup planning tips for transportation and taxi operations.',
      content: 'Financial experts support or help you figure out how to raise more money. Arkit a trusted name for providing assistants. Initially, their main goal was to ensure that the service they provide, these people are loyal, experienced and professional to their industry.',
      contentSecondary: 'Unless you are the one who really cares about this, it is not terribly important. What all matters are how your hybrid mobile application development is going to work in the long run as no one will care about how it was built.',
      quoteText: 'There are no secrets to success. It is the result preparation, hard work and learning from failure.',
      quoteAuthor: '- Winston Churchill.',
      contentTertiary: 'There are some big shifts taking place in the field of construction equipment mathematics. Starting with the integration of mathematics devices in vehicles right from the manufacturers, to the standardization and integration of mathematics data across various business functions, the future of mathematics has never seemed so full of potential for fleet-based businesses.',
      sectionHeading: 'Creative approach to every project',
      sectionParagraphOne: 'Financial experts support or help you to to find out which way you can raise your funds more. Arkit a trusted name for providing assistants. Initially their main objective was to ensure the service they provide these people are loyal to their industry, experienced and professional.',
      sectionParagraphTwo: 'Another speaker, John Meuse, senior director of heavy equipment at Waste Management Inc., echoed this, citing a cost-saving of $17,000 for the company when it cut idling time of a single Caterpillar 966 wheel loader.',
      category: 'Business',
      authorName: 'Elliot Alderson',
      coverImage: '/assets/img/post-1.jpg',
      galleryImages: ['/assets/img/post-1.jpg', '/assets/img/post-2.jpg'],
      authorAvatar: '/assets/img/auhtor.png',
      authorBio: 'Our versatile team is built of designers, developers and digital marketers who all bring unique experience.',
      authorSocialLinks: [
        { icon: 'lab la-facebook-f', url: '#' },
        { icon: 'lab la-twitter', url: '#' },
        { icon: 'lab la-instagram', url: '#' },
        { icon: 'lab la-behance', url: '#' },
      ],
      comments: [
        {
          name: 'Ashton Porter',
          dateLabel: 'January 1, 2022 at 8:00 am',
          avatar: '/assets/img/comment-1.png',
          message: 'You guys have put so much work, effort, and time while designing this awesome theme I can see that passion when I incorporated it into my website.',
          approved: true,
          replies: [
            {
              name: 'Melania Trump',
              dateLabel: 'Jan 01, 2022 at 8:00',
              avatar: '/assets/img/comment-2.png',
              message: 'The only thing I LOVE more than this theme and its incredible options is the support team! They are freaking amazable!',
              approved: true,
            },
          ],
        },
        {
          name: 'Elliot Alderson',
          dateLabel: 'Jan 01, 2022 at 8:00',
          avatar: '/assets/img/comment-3.png',
          message: 'Outstanding quality in this theme, brilliant Effects and perfect crafted Code. We absolutely love it and can highly recommend DynamicLayers!',
          approved: true,
          replies: [],
        },
      ],
      tags: ['Business', 'Marketing', 'Startup', 'Design'],
      isPublished: true,
      publishedAt: new Date('2024-01-04T09:00:00.000Z'),
    },
    {
      title: 'Fresh Startup Ideas For Digital Business',
      slug: 'fresh-startup-ideas-for-digital-business',
      excerpt: 'Explore practical tactics to scale digital-first transportation services.',
      content: 'This post explores modern growth ideas for digital businesses operating in transport and ride services.',
      category: 'Startup',
      authorName: 'Elliot Alderson',
      coverImage: '/assets/img/post-2.jpg',
      tags: ['Startup', 'Digital'],
      isPublished: true,
      publishedAt: new Date('2024-01-08T09:00:00.000Z'),
    },
    {
      title: 'Taxi Marketing Playbook For City Growth',
      slug: 'taxi-marketing-playbook-for-city-growth',
      excerpt: 'A focused marketing playbook to grow local taxi demand and retention.',
      content: 'Learn how to run geo-targeted campaigns, optimize referral loops, and improve rider retention in competitive city markets.',
      category: 'Marketing',
      authorName: 'Elliot Alderson',
      coverImage: '/assets/img/post-1.jpg',
      tags: ['Marketing', 'Taxi'],
      isPublished: true,
      publishedAt: new Date('2024-01-12T09:00:00.000Z'),
    },
    {
      title: 'Airport Transfer Operations Checklist',
      slug: 'airport-transfer-operations-checklist',
      excerpt: 'An operations-first checklist to run dependable airport transfer services.',
      content: 'From dispatch timing to driver handoff and rider communication, this checklist helps airport transfer teams reduce delays and improve passenger confidence.',
      category: 'Operations',
      authorName: 'Operations Team',
      coverImage: '/assets/img/post-3.jpg',
      tags: ['Operations', 'Airport'],
      isPublished: true,
      publishedAt: new Date('2024-01-16T09:00:00.000Z'),
    },
    {
      title: 'Building Trust With Transparent Pricing',
      slug: 'building-trust-with-transparent-pricing',
      excerpt: 'How clear fare communication increases conversions and repeat rides.',
      content: 'Transparent fare cards, upfront route estimates, and clear policy wording reduce rider hesitation and improve retention.',
      category: 'Business',
      authorName: 'Growth Team',
      coverImage: '/assets/img/post-4.jpg',
      tags: ['Business', 'Pricing'],
      isPublished: true,
      publishedAt: new Date('2024-01-20T09:00:00.000Z'),
    },
    {
      title: 'Driver Retention Strategies That Work',
      slug: 'driver-retention-strategies-that-work',
      excerpt: 'Practical retention tactics for high-performing taxi fleets.',
      content: 'Retention improves when compensation transparency, training cadence, and predictable scheduling are treated as core operating systems.',
      category: 'People',
      authorName: 'HR Team',
      coverImage: '/assets/img/post-2.jpg',
      tags: ['Drivers', 'People'],
      isPublished: true,
      publishedAt: new Date('2024-01-24T09:00:00.000Z'),
    },
    {
      title: 'SEO Basics For Local Taxi Companies',
      slug: 'seo-basics-for-local-taxi-companies',
      excerpt: 'A local SEO guide to increase inbound leads from city searches.',
      content: 'Optimize service pages by district, keep NAP data consistent, and refresh content monthly to stay competitive in local map packs.',
      category: 'Marketing',
      authorName: 'Marketing Team',
      coverImage: '/assets/img/post-1.jpg',
      tags: ['SEO', 'Marketing'],
      isPublished: true,
      publishedAt: new Date('2024-01-28T09:00:00.000Z'),
    },
  ];
}

async function shouldBootstrapBlogTemplate() {
  const count = await BlogPost.countDocuments({});
  return count === 0;
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