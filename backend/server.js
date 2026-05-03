const http = require('http');
const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./config/database');
const { ensureSuperAdmin } = require('./features/admin/auth/bootstrap');
const { shouldBootstrapNl, bootstrapNlTranslations } = require('./scripts/bootstrap-nl-translations');
const { shouldBootstrapCmsTemplate, bootstrapCmsTemplate } = require('./scripts/bootstrap-cms-content');
const { shouldBootstrapCarsTemplate, bootstrapCarsTemplate } = require('./scripts/bootstrap-cars-template');
const { shouldBootstrapEmailTemplates, bootstrapEmailTemplates } = require('./scripts/bootstrap-email-templates');
const { shouldBootstrapPublicContent, bootstrapPublicContent } = require('./scripts/bootstrap-public-content');

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDatabase();

    if (await shouldBootstrapNl()) {
      const bootstrapResult = await bootstrapNlTranslations();
      console.log(
        `Auto-bootstrapped UI locales (nl: ${bootstrapResult.semanticCount} semantic keys, ${bootstrapResult.translatedCount} extracted NL strings; en+fr dictionary upserts: ${bootstrapResult.enFrSeeded}).`
      );
    }

    if (await shouldBootstrapCmsTemplate()) {
      const cmsResult = await bootstrapCmsTemplate();
      console.log(
        `Auto-bootstrapped CMS content (${cmsResult.servicesCount} services, ${cmsResult.postsCount} blog posts, ${cmsResult.translations.totalOperations} translation upserts).`
      );
    }

    if (await shouldBootstrapCarsTemplate()) {
      const carsBootstrapResult = await bootstrapCarsTemplate();
      console.log(`Auto-bootstrapped car template records (${carsBootstrapResult.count} records).`);
    }

    if (await shouldBootstrapEmailTemplates()) {
      const emailsBootstrapResult = await bootstrapEmailTemplates();
      console.log(`Auto-bootstrapped email template records (${emailsBootstrapResult.count} records).`);
    }

    if (await shouldBootstrapPublicContent()) {
      const contentBootstrapResult = await bootstrapPublicContent();
      console.log(`Auto-bootstrapped public content (${contentBootstrapResult.testimonials} testimonials, ${contentBootstrapResult.packages} packages).`);
    }

    const seedResult = await ensureSuperAdmin(config);
    if (seedResult.created) {
      console.log('Default super admin created from environment variables.');
    } else if (seedResult.updated) {
      console.log('Existing user upgraded to super admin from environment variables.');
    }

    server.listen(config.port, () => {
      console.log(`Server listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = server;
