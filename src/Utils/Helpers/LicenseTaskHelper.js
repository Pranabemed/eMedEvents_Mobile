import moment from 'moment';

const EXPIRY_FORMATS = [
    moment.ISO_8601,
    'YYYY-MM-DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
    'DD.MM.YYYY',
    'MM.DD.YYYY',
    'YYYY/MM/DD',
    'MM/DD/YYYY',
    'MMM DD, YYYY',
    'MMM D, YYYY',
];

/**
 * Extract raw expiry date string from a license/credit object.
 * @param {Object|null} creditObj - License or credit object.
 * @returns {string} Raw expiry date string or empty string.
 */
export const getLicenseExpiryValue = (creditObj) => {
    if (!creditObj || typeof creditObj !== 'object') return '';
    return (
        creditObj.to_date ||
        creditObj.expiry_date ||
        creditObj.license_expiry_date ||
        creditObj.licence_expiry_date ||
        ''
    );
};

/**
 * Compute whole days from today (start of day) until license expiry (start of day).
 * Negative means already expired; <= 90 means due within 30/60/90 days.
 * @param {Object|null} creditObj - License or credit object (or date string).
 * @returns {number|null} Day delta or null when no valid date is present.
 */
export const getLicenseDaysUntilExpiry = (creditObj) => {
    const expiryValue = typeof creditObj === 'string' ? creditObj : getLicenseExpiryValue(creditObj);
    if (!expiryValue || typeof expiryValue !== 'string' || expiryValue.startsWith('0000-00-00')) {
        return null;
    }

    const trimmed = expiryValue.trim();
    if (!trimmed) return null;

    let parsed = moment(trimmed, EXPIRY_FORMATS, true);
    if (!parsed.isValid()) {
        parsed = moment(trimmed);
    }
    if (!parsed.isValid()) return null;

    return parsed.startOf('day').diff(moment().startOf('day'), 'days');
};

/**
 * Map days until expiry to the matching dashboard task bucket key.
 * @param {number|null} daysUntilExpiry - Day delta from today.
 * @returns {'due_in_30_days'|'due_in_60_days'|'due_in_90_days'|null} Bucket key or null if > 90 days.
 */
export const getLicenseDueBucketKey = (daysUntilExpiry) => {
    if (daysUntilExpiry === null || daysUntilExpiry === undefined) return null;
    if (daysUntilExpiry <= 30) return 'due_in_30_days';
    if (daysUntilExpiry <= 60) return 'due_in_60_days';
    if (daysUntilExpiry <= 90) return 'due_in_90_days';
    return null;
};

const isUpdateTask = (task) => task?.button_display_text === 'Update';

/**
 * Synchronize dashboard tasks_data buckets (30/60/90 days) with active license expiry date
 * so dashboard cards immediately reflect updates without manual refresh.
 * @param {Object|null} tasksData - Backend tasks_data object.
 * @param {Object|null} activeLicense - Active state license object.
 * @returns {Object} Synchronized tasks_data object.
 */
export const syncTasksDataWithLicense = (tasksData, activeLicense) => {
    const base = tasksData && typeof tasksData === 'object' ? tasksData : {};
    const daysUntilExpiry = getLicenseDaysUntilExpiry(activeLicense);
    const targetBucket = daysUntilExpiry !== null ? getLicenseDueBucketKey(daysUntilExpiry) : null;
    const stateName = activeLicense?.state_name || activeLicense?.state || '';
    const buckets = ['due_in_30_days', 'due_in_60_days', 'due_in_90_days'];

    let existingUpdateTask = null;
    buckets.forEach((key) => {
        const list = Array.isArray(base[key]) ? base[key] : [];
        const found = list.find(isUpdateTask);
        if (found && !existingUpdateTask) {
            existingUpdateTask = found;
        }
    });

    const next = { ...base };
    buckets.forEach((key) => {
        const list = Array.isArray(base[key]) ? base[key] : [];
        const withoutUpdate = list.filter((t) => !isUpdateTask(t));
        if (targetBucket === key) {
            const updateTask = existingUpdateTask
                ? { ...existingUpdateTask, title: stateName || existingUpdateTask.title || '' }
                : { title: stateName, button_display_text: 'Update' };
            next[key] = [...withoutUpdate, updateTask];
        } else {
            next[key] = withoutUpdate;
        }
    });

    return next;
};

/**
 * Synchronize a specific task list rendered in Mytasks with the license expiry window.
 * @param {Array} rawTasks - Tasks passed to Mytasks.
 * @param {Object|null} activeLicense - Active license/creditID object.
 * @param {string} stateName - Fallback state name.
 * @param {string|null} bucketKey - Optional bucket key ('due_in_30_days' | 'due_in_60_days' | 'due_in_90_days').
 * @returns {Array} Synchronized task array.
 */
export const syncBucketTasksWithLicense = (rawTasks, activeLicense, stateName = '', bucketKey = null) => {
    const list = Array.isArray(rawTasks) ? rawTasks : [];
    const daysUntilExpiry = getLicenseDaysUntilExpiry(activeLicense);
    const targetBucket = daysUntilExpiry !== null ? getLicenseDueBucketKey(daysUntilExpiry) : null;
    const withoutUpdate = list.filter((t) => !isUpdateTask(t));

    if (!targetBucket) {
        return withoutUpdate;
    }

    if (bucketKey && bucketKey !== targetBucket) {
        return withoutUpdate;
    }

    const existingUpdate = list.find(isUpdateTask);
    const resolvedName = stateName || activeLicense?.state_name || activeLicense?.state || '';
    const updateTask = existingUpdate
        ? { ...existingUpdate, title: resolvedName || existingUpdate.title || '' }
        : { title: resolvedName, button_display_text: 'Update' };

    return [...withoutUpdate, updateTask];
};

