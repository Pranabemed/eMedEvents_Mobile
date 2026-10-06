// Stop when the API is exhausted or repeats a page without adding results.
export const mergeConferencePage = (previous, incoming, page, limit) => {
    const base = page === 0 ? [] : previous;
    const seen = new Set(base.map(item => String(item?.id)));
    const added = incoming.filter(item => {
        const id = String(item?.id);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
    return {
        items: [...base, ...added],
        hasMore: incoming.length >= limit && added.length > 0,
    };
};
