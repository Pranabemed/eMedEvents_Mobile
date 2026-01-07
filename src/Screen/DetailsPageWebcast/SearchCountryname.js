export const searchCountryNameFunction = (text,countryshow,setCountryall,setSearchcountry,searchCountryName) => {
    console.log(text, 'text12333');
    if (text) {
        const stateListData = countryshow?.filter(function (item) {
            // console.log('item+++++++++++++++++++state', item);
            const itemData = item?.name
                ? item?.name.toUpperCase() + item?.name.toUpperCase()
                : ''.toUpperCase();
            const textData = text.trim().toUpperCase();
            const filteredData = itemData.indexOf(textData) > -1;
            // console.log('filteredDataState', filteredData);
            return filteredData;
        });
        setCountryall(stateListData);
        setSearchcountry(text);
    } else {
        setCountryall(countryshow);
        setSearchcountry(text);
        searchCountryName(countryshow, text);
    }
};