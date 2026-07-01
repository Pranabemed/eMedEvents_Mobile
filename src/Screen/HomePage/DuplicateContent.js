/**
 * Duplicate content screen module. Renders a React Native screen or a screen-scoped support component. Exported members: parseHtmlContent.
 */

export /**
 * Parses html content.
 * @param {*} htmlContent - Input value.
 * @returns {Object}
 */
const parseHtmlContent = (htmlContent) => {
    const titleMatch = htmlContent.match(/<h2 class='orange-color'>(.*?)<\/h2>/i);
    const dateMatch = htmlContent.match(/<p class='paratex sliderthreecredits[^>]*'>\s*<img[^>]*>\s*(.*?)<\/p>/i);
    const locationMatch = htmlContent.match(/<p class='d-flex credits'>\s*<img[^>]*>\s*(.*?)<\/p>/i);
    const creditMatch = htmlContent.match(/<p[^>]*>\s*<img[^>]*credits_orange_icon[^>]*>?\s*([^<]+)<\/p>/i);
    let content = [];
    if (dateMatch) {
      content.push({ date: dateMatch[1].trim() });
    }
    if (locationMatch && !content.some(item => item.location)) {
      content.push({ location: locationMatch[1].trim() });
    }
    if (creditMatch && !content.some(item => item.credit) && !content.some(item => item.location === creditMatch[1].trim())) {
      content.push({ credit: creditMatch[1].trim() });
    }
    return {
      title: titleMatch ? titleMatch[1].trim() : 'Title Unavailable',
      content: content,
    };
  };