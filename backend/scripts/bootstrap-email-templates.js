const { EmailTemplate } = require('../models');

const templates = [
  {
    title: 'Ride Booking Confirmation',
    slug: 'ride-booking-confirmation',
    category: 'Transactional',
    audience: 'Customers',
    subject: 'Your Taxiofany ride request is confirmed',
    previewText: 'Reference code, route summary, and next steps for the booked trip.',
    summary: 'Used after a ride request is accepted and moved into dispatch.',
    heroTitle: 'Your ride is booked',
    heroDescription: 'We have locked in your request and shared it with our dispatch team for final driver assignment.',
    bodyTitle: 'What happens next',
    bodyContent: 'Share the booking reference, pickup time, route summary, driver contact details, and a support fallback if plans change.',
    ctaLabel: 'View Booking Details',
    ctaUrl: '/bookings',
    tone: 'Assuring',
    isPublished: true,
    displayOrder: 1,
  },
  {
    title: 'Newsletter Welcome',
    slug: 'newsletter-welcome',
    category: 'Marketing',
    audience: 'Subscribers',
    subject: 'Welcome to Taxiofany updates',
    previewText: 'Latest offers, service launches, and operational updates from our fleet.',
    summary: 'Used after a visitor joins the newsletter list.',
    heroTitle: 'Thanks for joining our email list',
    heroDescription: 'You will receive seasonal ride offers, new vehicle announcements, and product updates from our team.',
    bodyTitle: 'What subscribers receive',
    bodyContent: 'Highlights of new services, city availability updates, rider tips, and promotional campaigns crafted for returning customers.',
    ctaLabel: 'Explore Services',
    ctaUrl: '/services',
    tone: 'Welcoming',
    isPublished: true,
    displayOrder: 2,
  },
  {
    title: 'Dispatch Follow-up',
    slug: 'dispatch-follow-up',
    category: 'Operational',
    audience: 'Operations',
    subject: 'Follow up with pending ride requests',
    previewText: 'Reminder template for the dispatch team to close the loop on pending requests.',
    summary: 'Internal template for staff chasing open ride requests.',
    heroTitle: 'Pending request follow-up',
    heroDescription: 'Use this when a ride request has been waiting too long for manual confirmation.',
    bodyTitle: 'Recommended response',
    bodyContent: 'Confirm availability, propose the next available pickup slot, mention alternate vehicles when demand is high, and attach customer support contact details.',
    ctaLabel: 'Open Dashboard',
    ctaUrl: '/admin',
    tone: 'Operational',
    isPublished: true,
    displayOrder: 3,
  },
];

async function shouldBootstrapEmailTemplates() {
  const count = await EmailTemplate.countDocuments();
  return count === 0;
}

async function bootstrapEmailTemplates() {
  let count = 0;
  for (const template of templates) {
    await EmailTemplate.updateOne({ slug: template.slug }, { $set: template }, { upsert: true });
    count += 1;
  }

  return { count };
}

module.exports = {
  shouldBootstrapEmailTemplates,
  bootstrapEmailTemplates,
};
