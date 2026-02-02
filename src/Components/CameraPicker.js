import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform, Image } from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import UploadIcon from 'react-native-vector-icons/AntDesign';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import DocumentPicker, { types } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Imagepath from '../Themes/Imagepath';
import CamIcn from 'react-native-vector-icons/Feather';
import { ResizeMode } from 'react-native-video';
export default function CameraPicker(props) {
  // function to open gallery
  async function btnClick_galeryUpload() {
    if (props.btnClick_galeryUpload) {
      try {
        const response = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.ppt, DocumentPicker.types.pptx, 'image/jpeg',
            'image/jpg',
            'image/png',],
          allowMultiSelection: false,
        });

        let fileObj = {
          name: response[0].name,
          type: response[0].type,
          uri: response[0].uri,
        };
        props.btnClick_galeryUpload(fileObj);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User canceled the picker');
        } else {
          console.log(err);
        }
      }
    }
  }
  function btnClick_ImageUpload() {
    if (props.btnClick_ImageUpload) {
      ImagePicker.openPicker({
        width: normalize(300),
        height: normalize(400),
        cropping: props.cropping,
        multiple: props.multiple,
        mediaType: props.mediaType,
        maxFiles: props.maxFiles
      })
        .then(response => {
          let arr = [];
          if (props.multiple) {
            response.filter(data => {
              arr.push({
                name: data.filename
                  ? data.filename
                  : data.path.replace(/^.*[\\\/]/, ''),
                type: data.mime,
                uri: data.path,
              });
            });
            props.btnClick_ImageUpload(arr);
          } else {
            let imageObj = {};
            imageObj.name = response.filename
              ? response.filename
              : response.path.replace(/^.*[\\\/]/, '');
            imageObj.type = response.mime;
            imageObj.uri = response.path;
            props.btnClick_ImageUpload(imageObj);
          }
        })
        .catch(err => console.log(err));
    }
  }
  // function to open camera
  function btnClick_cameraUpload() {
    if (props.btnClick_cameraUpload) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'any',
      })
        .then(response => {
          let imageObj = {
            name: response.filename
              ? response.filename
              : response.path.replace(/^.*[\\\/]/, ''),
            type: response.mime,
            uri: response.path,
          };
          props.btnClick_cameraUpload(imageObj);
        })
        .catch(err => console.log(err));
    }
  }

  function onBackdropPress() {
    if (props.onBackdropPress) {
      props.onBackdropPress();
    }
  }

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={props.pickerVisible}
      style={{ width: '100%', alignSelf: 'center', margin: 0 }}
      animationInTiming={800}
      animationOutTiming={1000}
      onBackdropPress={() => onBackdropPress()}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopRightRadius: normalize(20),
          borderTopLeftRadius: normalize(20),
          paddingVertical: normalize(10),
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ height: 7, width: normalize(100), backgroundColor: "#DDDDDD", borderRadius: normalize(5) }} />
        </View>
        <View>
          <View style={styles.container}>
            {props?.profilehit ? <TouchableOpacity onPress={btnClick_cameraUpload} style={styles.header}>
              <CamIcn name="camera" size={25} color={Colorpath.black} />
              <Text style={styles.title}>{"Take Image"}</Text>
            </TouchableOpacity> : <TouchableOpacity onPress={btnClick_galeryUpload} style={styles.header}>
              <UploadIcon name="upload" size={25} color={Colorpath.black} />
              <Text style={styles.title}>{"Upload Certificate (e.g. .docx,.pptx,.word,.jpg,.png,.jpeg)"}</Text>
            </TouchableOpacity>}
          </View>
          {!props?.profilehit ? <></>:<View style={{
            paddingVertical: props?.profilehit ? normalize(10) : normalize(20),
            paddingHorizontal: normalize(30),
          }}>
            <TouchableOpacity onPress={btnClick_ImageUpload} style={styles.header}>
              {props.profilehit ? <Image source={Imagepath.Folder} style={{ height: normalize(23), width: normalize(23), tintColor: "#000000" }} resizeMode="contain" /> : <UploadIcon name="upload" size={25} color={Colorpath.black} />}
              <Text style={styles.title}>{props.profilehit ? "Upload the Image From Gallery" : "Upload the Image"}</Text>
            </TouchableOpacity>
          </View>}
          {!props?.profilehit && <View style={styles.scancontainer}>
            <TouchableOpacity onPress={btnClick_cameraUpload} style={styles.header}>
              <UploadIcon color={Colorpath.black} size={30} name="scan1" />
              <Text style={styles.title}>{"Scan the Document"}</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </View>
    </Modal>
  );
}

// Proptypes
CameraPicker.propTypes = {
  pickerVisible: PropTypes.bool,
  btnClick_galeryUpload: PropTypes.func,
  btnClick_cameraUpload: PropTypes.func,
  onBackdropPress: PropTypes.func,
  multiple: PropTypes.bool,
  mediaType: PropTypes.string,
  cropping: PropTypes.bool,
  maxFiles: PropTypes.number,
  profilehit: PropTypes.string
};

// // defaultPropsvalue
CameraPicker.defaultProps = {
  pickerVisible: false,
  btnClick_galeryUpload: () => { },
  btnClick_cameraUpload: () => { },
  btnClick_ImageUpload: () => { },
  onBackdropPress: () => { },
  multiple: false,
  // cropping: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(30),
  },
  imagecontainer: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(30),
  },
  scancontainer: {
    paddingVertical: normalize(0),
    paddingHorizontal: normalize(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  title: {
    fontFamily: Fonts.InterRegular,
    fontSize: 18,
    color: Colorpath.black,
    marginLeft: normalize(5),
  },
});
