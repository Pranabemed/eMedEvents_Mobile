

/**
 * Sticky flat list screen module. Renders a React Native screen or a screen-scoped support component. Exported members: data, StickyFlatList.
 */

import {View } from "react-native";
import styles from "./StyleSticky"
import CustomFlatList from "../../Utils/Helpers/CustomFlat";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable StickyFlatList component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const data = Array(10).fill(1);
/**
 * Sticky flat list component.
 * @returns {JSX.Element}
 */
const StickyFlatList = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomFlatList
        data={data}
        style={styles.list}
        renderItem={() => <View style={styles.item} />}
        HeaderComponent={<View style={styles.header} />}
        StickyElementComponent={<View style={styles.sticky}>
            <TextInput style={{height:40,width:250,borderColor:"aqua",borderWidth:1}}/>
        </View>}
        TopListElementComponent={<View style={styles.topList} />}
      />
    </SafeAreaView>
  )
}

/**
 * Sticky flat list default export.
 *
 * @returns {*}
 */
export default StickyFlatList
