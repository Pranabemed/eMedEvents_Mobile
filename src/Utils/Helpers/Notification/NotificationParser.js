export const parseNotificationUrl = (url) => {
  if (!url) {
    return { type: 'unknown', route: null, slug: null, conference_url: null, full_url: url };
  }

  const normalized = url.toLowerCase();

  // Extract last segment dynamically without trailing slash or query params
  let lastSegment = null;
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      lastSegment = pathSegments[pathSegments.length - 1];
    }
  } catch (e) {
    // Fallback if URL is invalid parse
    const withoutQuery = url.split('?')[0];
    const pathSegments = withoutQuery.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      lastSegment = pathSegments[pathSegments.length - 1];
    }
  }

  const result = { type: 'unknown', route: null, slug: lastSegment, conference_url: lastSegment, full_url: url };

  if (normalized.includes('/cart')) {
    result.type = 'cart';
    result.route = 'StateWebcast';
    return result;
  }

  if (normalized.includes('/online-cme-courses')) {
    result.type = 'course';
    result.route = 'StateWebcast';
    return result;
  }

  if (
    normalized.includes('/webcast') ||
    normalized.includes('/conference/') ||
    normalized.includes('/conferences/') ||
    normalized.includes('/c/') ||
    normalized.includes('/medical-hybrid-events-')
  ) {
    result.type = 'conference';
    result.route = 'StateWebcast';
    return result;
  }

  if (normalized.includes('/course-bundle')) {
    result.type = 'bundle';
    result.route = 'StateWebcast';
    return result;
  }

  if (normalized.includes('/mandatory-topic')) {
    result.type = 'mandatory';
    result.route = 'StateWebcast';
    return result;
  }

  return result;
};
