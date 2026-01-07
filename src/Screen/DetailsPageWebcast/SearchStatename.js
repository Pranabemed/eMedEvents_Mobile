
export const searchStateNameFunction = (text, selectState, setSlist, setSearchState, searchStateName) => {
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