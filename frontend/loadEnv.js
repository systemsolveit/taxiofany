/**
 * Load .env files without adding a dependency (parent repo .env is often ignored by Node when cwd is frontend/).
 * Order: repo root first, then frontend/.env (local overrides).
 */
const fs = require('fs');
const path = require('path');

function parseLine(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }
  const eq = trimmed.indexOf('=');
  if (eq <= 0) {
    return null;
  }
  const key = trimmed.slice(0, eq).trim();
  let val = trimmed.slice(eq + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  return { key, val };
}

function loadEnvFile(filePath, overrideExisting) {
  try {
    if (!fs.existsSync(filePath)) {
      return;
    }
    const text = fs.readFileSync(filePath, 'utf8');
    text.split(/\r?\n/).forEach((line) => {
      const parsed = parseLine(line);
      if (!parsed) {
        return;
      }
      if (overrideExisting || process.env[parsed.key] === undefined) {
        process.env[parsed.key] = parsed.val;
      }
    });
  } catch (error) {
    /* ignore */
  }
}

const rootEnv = path.join(__dirname, '..', '.env');
const localEnv = path.join(__dirname, '.env');
loadEnvFile(rootEnv, false);
loadEnvFile(localEnv, true);
