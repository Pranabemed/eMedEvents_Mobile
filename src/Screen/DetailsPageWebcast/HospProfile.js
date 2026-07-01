/**
 * Hosp profile screen module. Renders a React Native screen or a screen-scoped support component. Exported members: searchHospFunction.
 */

export /**
 * Search hosp function utility.
 * @param {*} text - Input value.
 * @param {*} hospgetshow - Input value.
 * @param {*} setHospAll - Input value.
 * @param {*} setSearchhosp - Input value.
 * @param {*} searchHospName - Input value.
 * @returns {void}
 */
const searchHospFunction= (text,hospgetshow,setHospAll,setSearchhosp,searchHospName) => {
    console.log(text, 'text12333');
    if (text) {
        const stateListData = hospgetshow?.filter(function (item) {
            // console.log('item+++++++++++++++++++state', item);
            const itemData = item?.name
                ? item?.name.toUpperCase() + item?.name.toUpperCase()
                : ''.toUpperCase();
            const textData = text.trim().toUpperCase();
            const filteredData = itemData.indexOf(textData) > -1;
            // console.log('filteredDataState', filteredData);
            return filteredData;
        });
        setHospAll(stateListData);
        setSearchhosp(text);
    } else {
        setHospAll(hospgetshow);
        setSearchhosp(text);
        searchHospName(hospgetshow, text)
    }
};