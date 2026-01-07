export const searchStateLicNamePraticeFunction = (text,selectStatepratice,setSlistpratice,setSearchpratice,searchStateNamePratice) => {
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