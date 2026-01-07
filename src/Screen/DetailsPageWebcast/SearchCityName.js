export const searchCityNameFunction= (text,cityshow,setCityAll,setSearchcity,searchCityName) => {
    console.log(text, 'text12333');
    if (text) {
        const stateListData = cityshow?.filter(function (item) {
            // console.log('item+++++++++++++++++++state', item);
            const itemData = item?.name
                ? item?.name.toUpperCase() + item?.name.toUpperCase()
                : ''.toUpperCase();
            const textData = text.trim().toUpperCase();
            const filteredData = itemData.indexOf(textData) > -1;
            // console.log('filteredDataState', filteredData);
            return filteredData;
        });
        setCityAll(stateListData);
        setSearchcity(text);
    } else {
        setCityAll(cityshow);
        setSearchcity(text);
        searchCityName(cityshow, text)
    }
};