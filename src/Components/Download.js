import React, { Component } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Colorpath from "../Themes/Colorpath";
import PageHeader from "./PageHeader";
import MyStatusBar from "../Utils/MyStatusBar";
import Fonts from "../Themes/Fonts";
import normalize from "../Utils/Helpers/Dimen";

export default class PDFViewer extends Component {
  state = {
    loading: false, // State to manage the loader
  };

  onPress = async () => {
    const { route } = this.props;
    this.setState({ loading: true }); // Show loader
    try {
      const url = route?.params?.pdf
        ? `https://static.emedevents.com/uploads/conferences/certificates/${route?.params?.pdf}`
        : route?.params?.pdfMul || route?.params?.courseHand;

      const f2 = url.split("/");
      const fileName = f2[f2.length - 1];
      const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
        toFile: localFile,
      };

      await RNFS.downloadFile(options).promise;

      this.setState({ loading: false }); // Hide loader
      await FileViewer.open(localFile);
    } catch (error) {
      this.setState({ loading: false }); // Hide loader if error occurs
      console.log(error, "error");
    }
  };

  downPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <>
        <MyStatusBar
          barStyle={"light-content"}
          backgroundColor={Colorpath.Pagebg}
        />
        {Platform.OS === "ios" ? (
          <PageHeader
            title="Download Certificate"
            onBackPress={this.downPress}
          />
        ) : (
          <View>
            <PageHeader
              title="Download Certificate"
              onBackPress={this.downPress}
            />
          </View>
        )}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colorpath.Pagebg,
            flex: 1,
          }}
        >
          {this.state.loading ? (
            <ActivityIndicator
              size="large"
              color={Colorpath.ButtonColr} // Loader color
            />
          ) : (
            <TouchableOpacity
              onPress={this.onPress}
              style={{
                backgroundColor: Colorpath.ButtonColr,
                padding: 20,
                borderRadius: normalize(10),
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: Fonts.InterMedium,
                  color: Colorpath.white,
                }}
              >
                {"Download Certificate"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }
}
