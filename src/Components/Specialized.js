import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import ArrowUp from 'react-native-vector-icons/AntDesign';
import TextFieldIn from '../Components/Textfield';
export default function Specialized(props) {
  const [modalVisible, setModalVisible] = useState(props.modalVisible);
  const [search, setSearch] = useState('');
  const [tempDataList, setTempDataList] = useState([]);

  const searchData = text => {
    if (Array.isArray(props.dataList)) {
      if (text == '') {
        setTempDataList(props.dataList);
      } else {
        let tempData = props.dataList.filter(item => {
          const itemData =
            item?.name || item?.dial_code
              ? item?.name.toUpperCase() + item?.dial_code.replace(/^\+/, '')
              : ''.toUpperCase();
          const textData = text.trim().toUpperCase();
          const filteredData = itemData.indexOf(textData) > -1;
          console.log('filteredData', filteredData);
          return filteredData;
        });
        setTempDataList(tempData);
      }
    }
  };
  useEffect(() => {
    if (props.search == true) {
      setTempDataList(props.dataList);
      setSearch('');
    }
  }, [props.dataList]);

  const [country_with_Flag, setCountry_with_Flag] = useState(
    props.initialValue,
  );

  function onSelectData(data) {
    if (props.onSelectData) {
      props.onSelectData(data);
    }
  }
  function renderData(data) {
    return (
      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
          onSelectData(data.item);
          setCountry_with_Flag(data.item.name);
        }}
        style={{
          marginVertical: normalize(3),
          paddingLeft: normalize(18),
          borderWidth: 0.8,
          width: '90%',
          alignSelf: 'center',
          padding: normalize(9),
          borderColor: Colorpath.grey,
          borderRadius: normalize(5)
        }}>
        <Text
          numberOfLines={1}
          style={{
            textAlign: "center",
            fontSize: normalize(13),
            width: normalize(220),
            color: Colorpath.black,
            fontFamily: Fonts.InterBold
          }}>
          {data.item.flag != undefined ?
            <>
              {data?.item?.flag + "  " + data?.item?.name}
            </>
            :
            <>
              {data?.item?.name}
            </>
          }

        </Text>
      </TouchableOpacity>
    );
  }

  function openModal() {
    return (
      <Modal
        style={{ margin: 0 }}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={modalVisible}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: Colorpath.white,
            borderRadius: normalize(7),
            height: props.height ? props.height : normalize(200),
            paddingBottom: normalize(15),
            paddingTop: normalize(10),
          }}>
          {props.search == true ? (
            <>
              <View
                style={{
                  backgroundColor: '#F8F8F8',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: normalize(9),
                  alignSelf: 'center',
                  marginTop: normalize(15),
                }}>
                <TextFieldIn
                  placeholder={'Search'}
                  value={search}
                  height={normalize(40)}
                  width={normalize(285)}
                  backgroundColor={Colorpath.textField}
                  onChangeText={text => {
                    setSearch(text);
                    searchData(text?.trim() ?? text);
                  }}
                  borderRadius={normalize(9)}
                  fontSize={normalize(12)}
                  color="black"
                  placeholderTextColor={Colorpath.placeholder}
                  paddingHorizontal={normalize(10)}
                />
              </View>
            </>
          ) : null}

          <View style={{ paddingTop: normalize(8) }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: normalize(60) }}
              data={search == false ? props.dataList : tempDataList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderData}
              ListEmptyComponent={
                <Text
                  style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    color: Colorpath.grey,
                    fontWeight: 'bold',
                    fontFamily: Fonts.PlusJakartaSansExtraBold,
                    fontSize: normalize(20),
                    paddingTop: normalize(30),
                  }}>
                  No country found
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: normalize(46),
        width: normalize(290),
        // borderColor: Colorpath.grey,
        borderRadius: normalize(5),
        marginTop: normalize(3),
        marginBottom: normalize(4),
        // borderWidth: 0.7,
        backgroundColor: Colorpath.white,
      }}
      onPress={() => { 
        if (props.changeFocus) {
          props.changeFocus();
        }
        setModalVisible(true)
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          marginHorizontal:
            Platform.OS == 'ios' ? normalize(11) : normalize(10),
        }}>
        <Text
          style={{
            fontSize: normalize(12),
            color: props.textColor ? props.textColor : Colorpath.exitPlace,
            fontFamily: Fonts.InterBold,
          }}>
          {country_with_Flag}
        </Text>
        {/* <ArrowUp name="down" color="rgb(0,26,114)" size={30} 
        style={{
            right: normalize(20),
            position: 'absolute',
            top: normalize(-3),
            transform: [{ rotate: modalVisible ? '180deg' : '0deg' }]
            }}/> */}
      </View>
      {openModal()}
    </TouchableOpacity>
  );
}

Specialized.propTypes = {
  dataList: PropTypes.array,
  onSelectData: PropTypes.func,
  modalVisible: PropTypes.bool,
  onChangeText: PropTypes.func,
  value: PropTypes.any,
  initialValue: PropTypes.string,
};

Specialized.defaultProps = {
  dataList: [],
  onSelectData: PropTypes.func,
  modalVisible: false,
  onChangeText: null,
  value: null,
  initialValue: '',
  search: true,
};