import { View, Text, Image } from 'react-native'
import React from 'react'

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

export default ImagePDF