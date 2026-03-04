// ─── VTT Timestamp → seconds ────────────────────────────────────────────────
const parseVttTimestamp = (value) => {
  if (!value) return 0;
  const normalized = String(value).replace(',', '.').trim();
  const parts = normalized.split(':').map(Number);
  if (parts.length === 3) {
    return (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0);
  }
  if (parts.length === 2) {
    return (parts[0] * 60) + (parts[1] || 0);
  }
  const single = parseFloat(normalized);
  return isNaN(single) ? 0 : single;
};

// ─── Safely resolve relative/absolute URLs ───────────────────────────────────
const resolveUrl = (baseUrl, target) => {
  if (!target) return null;
  const cleanTarget = String(target).trim().replace(/&amp;/g, '&');
  if (!cleanTarget) return null;
  if (/^https?:\/\//i.test(cleanTarget)) return cleanTarget;
  if (cleanTarget.startsWith('//')) return `https:${cleanTarget}`;
  if (cleanTarget.startsWith('file://')) return cleanTarget;
  if (!baseUrl) return cleanTarget;
  // Only attempt URL resolution when baseUrl looks like a real URL
  const cleanBase = String(baseUrl).trim();
  if (/^https?:\/\//i.test(cleanBase)) {
    try {
      return new URL(cleanTarget, cleanBase).toString();
    } catch (_) {
      // fall through to manual join
    }
  }
  // Manual join as a safe fallback
  const base = cleanBase.replace(/\/+$/, '');
  const relative = cleanTarget.replace(/^\/+/, '');
  return `${base}/${relative}`;
};

// ─── Parse a single cue payload line (URL + optional #xywh crop) ─────────────
const parseVttPayload = (payload, baseUrl) => {
  if (!payload) return null;
  const cleanPayload = payload.trim();
  if (!cleanPayload) return null;
  const payloadLines = cleanPayload
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const bestLine =
    payloadLines.find((line) => /\.(jpg|jpeg|png|webp|avif)(\?|#|$)/i.test(line)) ||
    payloadLines[0] ||
    cleanPayload;
  const [rawUrl, fragment] = bestLine.split('#');
  const uri = resolveUrl(baseUrl, rawUrl);
  if (!uri) return null;
  let crop = null;
  if (fragment && fragment.startsWith('xywh=')) {
    const [x, y, width, height] = fragment
      .replace('xywh=', '')
      .split(',')
      .map((n) => Number(n));
    if ([x, y, width, height].every((n) => Number.isFinite(n))) {
      crop = { x, y, width, height };
    }
  }
  return { uri, crop };
};

// ─── Full WebVTT parser (handles NOTE / STYLE / REGION blocks) ───────────────
const parseThumbnailVtt = (vttText, vttUrl) => {
  if (!vttText) return [];
  const lines = vttText.replace(/\r/g, '').split('\n');
  const cues = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]?.trim();

    // Skip blank lines, the file header, and metadata blocks
    if (
      !line ||
      line === 'WEBVTT' ||
      line.startsWith('NOTE') ||
      line.startsWith('STYLE') ||
      line.startsWith('REGION')
    ) {
      i += 1;
      continue;
    }

    // Skip optional cue identifier (any non-arrow, non-blank line before timing)
    if (!line.includes('-->') && i + 1 < lines.length && lines[i + 1]?.includes('-->')) {
      i += 1;
    }

    const timeLine = lines[i]?.trim();
    if (!timeLine || !timeLine.includes('-->')) {
      i += 1;
      continue;
    }

    const [startRaw, endRawWithSettings] = timeLine.split('-->');
    const endRaw = (endRawWithSettings || '').trim().split(/\s/)[0];
    const start = parseVttTimestamp(startRaw);
    const end = parseVttTimestamp(endRaw);

    i += 1;
    // Collect payload lines until blank line or end of file
    let payload = '';
    while (i < lines.length && lines[i].trim() !== '') {
      const pLine = lines[i].trim();
      payload = payload ? `${payload}\n${pLine}` : pLine;
      i += 1;
    }

    const parsed = parseVttPayload(payload, vttUrl);
    if (parsed && Number.isFinite(start) && Number.isFinite(end) && end > start) {
      cues.push({
        start,
        end,
        uri: parsed.uri,
        crop: parsed.crop,
      });
    }
  }
  return cues;
};

// ─── Infer a VTT sidecar URL from a plain video URL ─────────────────────────
// Only for direct-extension video URLs (mp4, m4v, mov, webm, m3u8)
const inferVttFromVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;
  const clean = String(videoUrl).trim();
  if (!/^https?:\/\//i.test(clean)) return null;
  const noQuery = clean.split('?')[0];
  if (!/\.(mp4|m4v|mov|webm|m3u8)$/i.test(noQuery)) return null;
  return noQuery.replace(/\.(mp4|m4v|mov|webm|m3u8)$/i, '.vtt');
};

// ─── Extract the best available thumbnail-VTT URL ────────────────────────────
// Checks (in order): route param → activity data fields → description HTML →
// inferred sidecar. YouTube video IDs are intentionally skipped (no VTT exists).
const extractVttCandidates = ({
  routeVtt,
  activityData = {},
  descriptionHtml = '',
  baseUrl,
  videoUrl,
}) => {
  const candidates = [];
  const pushUnique = (value) => {
    if (!value) return;
    const clean = String(value).trim();
    if (!clean) return;
    if (!candidates.includes(clean)) candidates.push(clean);
  };

  const directCandidates = [
    routeVtt,
    activityData?.thumbnail_vtt,
    activityData?.thumbnails_vtt,
    activityData?.vtt_file,
    activityData?.vtt,
    activityData?.seek_preview_vtt,
    activityData?.sprite_vtt,
    activityData?.thumb_vtt,
    activityData?.youtube_thumbnail_vtt,
  ];

  directCandidates.forEach((candidate) => {
    if (!candidate) return;
    const resolved = /^https?:\/\//i.test(baseUrl)
      ? resolveUrl(baseUrl, candidate)
      : candidate;
    pushUnique(resolved);
  });

  // 2. Absolute .vtt URL embedded in HTML description
  const absoluteMatch = descriptionHtml.match(
    /https?:\/\/[^"'\s>]+\.vtt(?:\?[^"'\s>]*)?/i,
  );
  if (absoluteMatch?.[0]) {
    pushUnique(absoluteMatch[0]);
  }

  // 3. Relative .vtt path from description HTML (only when we have a real baseUrl)
  if (/^https?:\/\//i.test(baseUrl)) {
    const relativeMatch = descriptionHtml.match(/["']([^"']+\.vtt(?:\?[^"']*)?)['"]/i);
    if (relativeMatch?.[1]) {
      pushUnique(resolveUrl(baseUrl, relativeMatch[1]));
    }
  }

  // 4. Infer a sidecar .vtt from the video URL extension
  // Skip YouTube video IDs (11-char alphanumeric) — they have no VTT sidecar
  const isYouTubeId = videoUrl && /^[\w-]{11}$/.test(String(videoUrl).trim());
  if (!isYouTubeId) {
    const inferred = inferVttFromVideoUrl(videoUrl || baseUrl);
    if (inferred) pushUnique(inferred);
  }

  return candidates;
};

const extractVttUrl = (args) => {
  const candidates = extractVttCandidates(args);
  return candidates[0] || null;
};

// ─── Binary-search–style cue lookup ─────────────────────────────────────────
const findCueForTime = (cues, timeValue) => {
  if (!Array.isArray(cues) || cues.length === 0) return null;
  const t = typeof timeValue === 'number' && isFinite(timeValue) ? timeValue : 0;

  // Exact range match
  const idx = cues.findIndex((cue) => t >= cue.start && t < cue.end);
  if (idx >= 0) return { cue: cues[idx], index: idx };

  // Past the last cue → clamp to last
  if (t >= cues[cues.length - 1].end) {
    return { cue: cues[cues.length - 1], index: cues.length - 1 };
  }

  // Before the first cue → clamp to first
  if (t < cues[0].start) {
    return { cue: cues[0], index: 0 };
  }

  return null;
};

export {
  resolveUrl,
  parseThumbnailVtt,
  extractVttCandidates,
  extractVttUrl,
  findCueForTime,
};
