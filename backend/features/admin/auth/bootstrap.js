const bcrypt = require('bcryptjs');
const { User } = require('../../../models');

async function ensureSuperAdmin(config) {
  if (!config.superAdminEmail || !config.superAdminPassword) {
    return { created: false, reason: 'missing_env' };
  }

  const email = config.superAdminEmail.toLowerCase();
  const existing = await User.findOne({ email }).select('+passwordHash');

  if (existing) {
    let updated = false;

    if (existing.role !== 'super_admin') {
      existing.role = 'super_admin';
      updated = true;
    }

    if (existing.status !== 'active') {
      existing.status = 'active';
      updated = true;
    }

    if (config.superAdminFullName && existing.fullName !== config.superAdminFullName) {
      existing.fullName = config.superAdminFullName;
      updated = true;
    }

    if (typeof config.superAdminPhone === 'string' && existing.phone !== config.superAdminPhone) {
      existing.phone = config.superAdminPhone;
      updated = true;
    }

    const passwordMatches = await bcrypt.compare(config.superAdminPassword, existing.passwordHash);
    if (!passwordMatches) {
      existing.passwordHash = await bcrypt.hash(config.superAdminPassword, 10);
      updated = true;
    }

    if (updated) {
      await existing.save();
      return { created: false, updated: true, reason: 'synced_existing_user' };
    }

    return { created: false, reason: 'already_exists' };
  }

  const passwordHash = await bcrypt.hash(config.superAdminPassword, 10);

  await User.create({
    fullName: config.superAdminFullName || 'Super Admin',
    email,
    passwordHash,
    role: 'super_admin',
    status: 'active',
    phone: config.superAdminPhone,
  });

  return { created: true };
}

module.exports = {
  ensureSuperAdmin,
};
