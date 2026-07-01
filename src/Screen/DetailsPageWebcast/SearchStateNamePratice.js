/**
 * Search state name pratice screen module. Renders a React Native screen or a screen-scoped support component. Exported members: searchStateNamePraticeFunction.
 */

export /**
 * Search state name pratice function utility.
 * @param {*} text - Input value.
 * @param {*} selectStatepratice - Input value.
 * @param {*} setSlistpratice - Input value.
 * @param {*} setSearchpratice - Input value.
 * @param {*} searchStateNamePratice - Input value.
 * @returns {void}
 */
const searchStateNamePraticeFunction = (text,selectStatepratice,setSlistpratice,setSearchpratice,searchStateNamePratice) => {
    console.log(text, 'text12333');
    if (text) {
        const praticeState = selectStatepratice?.filter(function (item) {
            // console.log('item+++++++++++++++++++state', item);
            const itemData = item?.name
                ? item?.name.toUpperCase() + item?.name.toUpperCase()
                : ''.toUpperCase();
            const textDataPratice = text.trim().toUpperCase();
            const praticeStateFiltered = itemData.indexOf(textDataPratice) > -1;
            // console.log('praticeStateFilteredState', praticeStateFiltered);
            return praticeStateFiltered;
        });
        setSlistpratice(praticeState);
        setSearchpratice(text);
    } else {
        setSlistpratice(selectStatepratice);
        setSearchpratice(text);
        searchStateNamePratice(selectStatepratice, text)
    }
};