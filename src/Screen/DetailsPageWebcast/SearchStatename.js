
/**
 * Search statename screen module. Renders a React Native screen or a screen-scoped support component. Exported members: searchStateNameFunction.
 */

export /**
 * Search state name function utility.
 * @param {*} text - Input value.
 * @param {*} selectState - Input value.
 * @param {*} setSlist - Input value.
 * @param {*} setSearchState - Input value.
 * @param {*} searchStateName - Input value.
 * @returns {void}
 */
const searchStateNameFunction = (text, selectState, setSlist, setSearchState, searchStateName) => {
    if (text) {
        const stateListData = selectState?.filter(function (item) {
            const itemData = item?.name
                ? item?.name.toUpperCase() + item?.name.toUpperCase()
                : ''.toUpperCase();
            const textData = text.trim().toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setSlist(stateListData); 
        setSearchState(text); 
        searchStateName(stateListData, text);
    } else {
        setSlist(selectState); 
        setSearchState(text);  
        searchStateName(selectState, text); 
    }
};