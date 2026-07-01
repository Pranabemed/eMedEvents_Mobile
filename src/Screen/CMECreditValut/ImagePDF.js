/**
 * Image pdf screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ImagePDF.
 */

import { View, Text, Image } from 'react-native'
import React from 'react'

/**
 * Reusable ImagePDF component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const ImagePDF = (props) => {
    console.log(props?.route?.params?.pdffile)
    return (
        <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignContent: "center" }}>
            <View style={{marginTop:40}}>

                <Image
                    source={{ uri: 'file://' + props?.route?.params?.pdffile }}
                    style={{ height: 200, width: 420, resizeMode: "contain" }}
                    resizeMode="contain" 
                />
            </View>
        </View>
    )
}

/**
 * Image pdf default export.
 *
 * @returns {*}
 */
export default ImagePDF