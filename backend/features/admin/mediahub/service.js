const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const uploadsDirectory = path.join(__dirname, '../../../uploads/mediahub');
const dataDirectory = path.join(__dirname, '../../../data/mediahub');
const metadataFile = path.join(dataDirectory, 'media-index.json');

function normalizeFilename(filename) {
  return path.basename(filename || '');
}

function inferKind(mimetype = '') {
  if (mimetype.startsWith('image/')) {
    return 'image';
  }
  if (mimetype.startsWith('video/')) {
    return 'video';
  }
  if (mimetype.startsWith('audio/')) {
    return 'audio';
  }
  if (
    mimetype.includes('pdf') ||
    mimetype.includes('document') ||
    mimetype.includes('sheet') ||
    mimetype.includes('text') ||
    mimetype.includes('zip')
  ) {
    return 'document';
  }
  return 'other';
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function decorateRecord(record) {
  return {
    ...record,
    kind: record.kind || inferKind(record.mimetype),
    url: `/mediahub/uploads/${encodeURIComponent(record.filename)}`,
    extension: record.extension || path.extname(record.originalname || record.filename).replace(/^\./, '').toLowerCase(),
    tags: normalizeTags(record.tags),
  };
}

async function ensureStorage() {
  await Promise.all([
    fsp.mkdir(uploadsDirectory, { recursive: true }),
    fsp.mkdir(dataDirectory, { recursive: true }),
  ]);
}

async function readMetadata() {
  await ensureStorage();

  if (!fs.existsSync(metadataFile)) {
    return [];
  }

  try {
    const content = await fsp.readFile(metadataFile, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function writeMetadata(records) {
  await ensureStorage();
  await fsp.writeFile(metadataFile, JSON.stringify(records, null, 2), 'utf8');
}

async function syncRecords() {
  const [savedRecords, dirEntries] = await Promise.all([
    readMetadata(),
    ensureStorage().then(() => fsp.readdir(uploadsDirectory, { withFileTypes: true })),
  ]);

  const fileNames = dirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const recordMap = new Map(savedRecords.map((record) => [record.filename, record]));
  const syncedRecords = [];

  for (const fileName of fileNames) {
    const absolutePath = path.join(uploadsDirectory, fileName);
    const stats = await fsp.stat(absolutePath);
    const existingRecord = recordMap.get(fileName);

    syncedRecords.push(
      decorateRecord({
        filename: fileName,
        originalname: existingRecord?.originalname || fileName,
        mimetype: existingRecord?.mimetype || 'application/octet-stream',
        size: Number(existingRecord?.size) || stats.size,
        title: existingRecord?.title || '',
        altText: existingRecord?.altText || '',
        description: existingRecord?.description || '',
        tags: existingRecord?.tags || [],
        uploadedAt: existingRecord?.uploadedAt || stats.birthtime.toISOString(),
        kind: existingRecord?.kind || inferKind(existingRecord?.mimetype),
      }),
    );
  }

  syncedRecords.sort((left, right) => new Date(right.uploadedAt) - new Date(left.uploadedAt));
  await writeMetadata(syncedRecords);
  return syncedRecords;
}

function buildSummary(items) {
  return items.reduce(
    (summary, item) => {
      summary.totalItems += 1;
      summary.storageBytes += item.size || 0;
      summary.byKind[item.kind] = (summary.byKind[item.kind] || 0) + 1;
      return summary;
    },
    {
      totalItems: 0,
      storageBytes: 0,
      byKind: {
        image: 0,
        video: 0,
        audio: 0,
        document: 0,
        other: 0,
      },
    },
  );
}

async function listMedia(filters = {}) {
  const allItems = await syncRecords();
  const query = String(filters.q || '').trim().toLowerCase();
  const type = String(filters.type || 'all').toLowerCase();
  const hasPaging = filters.page !== undefined || filters.pageSize !== undefined;
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(filters.pageSize) || 24));

  const filtered = allItems.filter((item) => {
    const matchesType = type === 'all' || item.kind === type;
    const haystack = [item.title, item.altText, item.description, item.originalname, item.filename, ...(item.tags || [])]
      .join(' ')
      .toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesType && matchesQuery;
  });

  const items = hasPaging ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered;
  const totalPages = hasPaging ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const hasMore = hasPaging ? page < totalPages : false;

  return {
    items,
    summary: buildSummary(allItems),
    filteredCount: filtered.length,
    filters: {
      q: filters.q || '',
      type: type || 'all',
    },
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems: filtered.length,
      hasMore,
      isPaginated: hasPaging,
    },
  };
}

async function uploadMedia(file, meta) {
  const records = await syncRecords();
  const record = decorateRecord({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    title: String(meta.title || '').trim(),
    altText: String(meta.altText || '').trim(),
    description: String(meta.description || '').trim(),
    tags: normalizeTags(meta.tags),
    uploadedAt: new Date().toISOString(),
    kind: inferKind(file.mimetype),
  });

  const nextRecords = [record, ...records.filter((item) => item.filename !== record.filename)];
  await writeMetadata(nextRecords);
  return record;
}

async function updateMedia(filename, changes = {}) {
  const safeFilename = normalizeFilename(filename);
  const records = await syncRecords();
  const index = records.findIndex((item) => item.filename === safeFilename);

  if (index === -1) {
    const error = new Error('Media item not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedRecord = decorateRecord({
    ...records[index],
    title: String(changes.title || '').trim(),
    altText: String(changes.altText || '').trim(),
    description: String(changes.description || '').trim(),
    tags: normalizeTags(changes.tags),
  });

  records[index] = updatedRecord;
  await writeMetadata(records);
  return updatedRecord;
}

async function deleteMedia(filename) {
  const safeFilename = normalizeFilename(filename);
  const records = await syncRecords();
  const record = records.find((item) => item.filename === safeFilename);

  if (!record) {
    const error = new Error('Media item not found.');
    error.statusCode = 404;
    throw error;
  }

  const absolutePath = path.join(uploadsDirectory, safeFilename);
  if (fs.existsSync(absolutePath)) {
    await fsp.unlink(absolutePath);
  }

  await writeMetadata(records.filter((item) => item.filename !== safeFilename));
  return record;
}

module.exports = {
  listMedia,
  uploadMedia,
  updateMedia,
  deleteMedia,
};
