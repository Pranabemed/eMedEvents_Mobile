

import {View } from "react-native";
import styles from "./StyleSticky"
import CustomFlatList from "../../Utils/Helpers/CustomFlat";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context'

const data = Array(10).fill(1);
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

export default StickyFlatList
