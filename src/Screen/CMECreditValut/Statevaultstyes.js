import { Dimensions, StyleSheet } from "react-native";
import Colorpath from "../../Themes/Colorpath";
import Fonts from "../../Themes/Fonts";
import normalize from '../../Utils/Helpers/Dimen';
const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        backgroundColor: "#FFFFFF",
        borderRadius: normalize(9),
        alignSelf: 'center',
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(10),
        // backgroundColor: "red",
        paddingHorizontal: normalize(0),
    },
    stateNameText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 17,
        color: "#000000",
        width:normalize(150)
    },
    addButtonText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: Colorpath.ButtonColr,
        textAlign: 'right',
    },
    leftContent: {
        width:normalize(190)
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    stateNameContainer: {
        paddingVertical: normalize(5),
    },
    stateNameTextboard: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 17,
        color: "#000000",
        width: "100%",
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    labelText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: '#666',
    },
    valueText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    countdownRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: normalize(0),
    },
    countdownText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#FF5E62',
        marginLeft: 3,
    },
    countdownRowUpdate: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent:"space-between",
        paddingHorizontal: normalize(2),
    },
    progressContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
    },
    progressBar: {
        height: 2,
        width: (windowWidth * 0.3 - 40) / 14,
        backgroundColor: "#DDDDDD",
    },
    creditsContainer: {
        backgroundColor: "#FFF2E0",
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    creditsText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        paddingVertical: normalize(10),
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
        fontSize: normalize(14),
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        // textTransform: 'capitalize',
    },
});