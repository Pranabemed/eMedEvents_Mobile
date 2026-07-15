/**
 * Parse activity url utility helper.
 * @param {*} activity_url - Input value.
 * @returns {void}
 */
export const parseActivityUrl = (activity_url) => {
  if (!activity_url) return null;

  try {
    const urlObj = new URL(activity_url);
    const conference_id = urlObj.searchParams.get('con');
    const activity_id = urlObj.searchParams.get('act');
    
    if (conference_id && activity_id) {
      return {
        conference_id: parseInt(conference_id, 10),
        activity_id: parseInt(activity_id, 10),
      };
    }
    
    return null;
  } catch (error) {
    // If URL parsing fails (e.g. invalid URL), fallback to regex
    const conMatch = activity_url.match(/[?&]con=([^&]+)/);
    const actMatch = activity_url.match(/[?&]act=([^&]+)/);
    
    if (conMatch && actMatch) {
      return {
        conference_id: parseInt(conMatch[1], 10),
        activity_id: parseInt(actMatch[1], 10),
      };
    }
    
    return null;
  }
};
