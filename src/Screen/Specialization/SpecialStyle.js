import { StyleSheet } from "react-native";
import Colorpath from "../../Themes/Colorpath";
import Fonts from "../../Themes/Fonts";
import normalize from '../../Utils/Helpers/Dimen';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:"center",
        marginBottom: normalize(8),
        // width:normalize(300)
    },
    button: {
        padding: normalize(10),
        borderRadius: normalize(13),
        backgroundColor: Colorpath.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: normalize(10),
        borderWidth: 1,
        borderColor: '#AAAAAA',
    },
    selectedButton: {
        backgroundColor: Colorpath.ButtonColr,
    },
    unselectedButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
        fontFamily: Fonts.InterRegular,
    },
    AmText: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Fonts.InterSemiBold,
        color: "#000000"
    },
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
    },
    dropDownItemText: {
        fontSize: 16,
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize',
        fontFamily:Fonts.InterMedium
    },
    dropdown: {
        height: normalize(45),
        width: normalize(280),
        alignSelf: 'center',
        backgroundColor: Colorpath.textField,
        marginTop: normalize(9),
        borderRadius: normalize(8),
    },
    placeholderStyle: {
        fontSize: 13,
        color: Colorpath.placeholder,
        paddingHorizontal: normalize(15),
        fontFamily: Fonts.InterMedium,
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: Fonts.InterRegular,
        color: Colorpath.black,
    },
});