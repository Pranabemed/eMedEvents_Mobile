export const searchHospFunction= (text,hospgetshow,setHospAll,setSearchhosp,searchHospName) => {
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