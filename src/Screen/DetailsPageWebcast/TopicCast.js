
import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from "../../Themes/Fonts";
import Colorpath from "../../Themes/Colorpath";
const TopicCast = ({ topics, expandedtopic, toggleTopic, topiccast }) => {
  console.log(topiccast, "topiccast")
  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
        <Text
          style={{
            fontFamily: Fonts.InterBold,
            fontWeight: "bold",
            fontSize: 18,
            color: '#000000',
          }}>
          {'State-required Topic(s)'}
        </Text>
      </View>
      <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(5) }}>
        <Text numberOfLines={3} style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000", flexWrap: "wrap" }}>{"This course fulfills the state-required mandatory topic(s) credit requirements for license renewal."}</Text>
      </View>
      <View style={{ paddingVertical: normalize(10),paddingHorizontal:normalize(10) }}>
        <FlatList
          data={topics?.slice(0, 3)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.topicContainer}>
              <Text style={styles.topicTitle}>{item?.topicName}</Text>
              {item.professionStatedata.length > 0 ? (
                item.professionStatedata.map((data, index) => (
                  <View key={index} style={styles.professionContainer}>
                    <Text style={styles.professionText}>{data?.profession}</Text>
                    <FlatList
                      data={data.states}
                      keyExtractor={(state, idx) => idx.toString()}
                      renderItem={({ item: state }) => (
                        <Text style={styles.stateText}>• {state}</Text>
                      )}
                    />
                  </View>
                ))
              ) : (
                ""
              )}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
        {topics?.length > 4 && <FlatList
          data={expandedtopic ? topics?.slice(3) : []}
          renderItem={({ item }) => (
            <View style={styles.topicContainer}>
              <Text style={styles.topicTitle}>{item?.topicName}</Text>
              {item.professionStatedata.length > 0 ? (
                item.professionStatedata.map((data, index) => (
                  <View key={index} style={styles.professionContainer}>
                    <Text style={styles.professionText}>{data?.profession}</Text>
                    <FlatList
                      data={data.states}
                      keyExtractor={(state, idx) => idx.toString()}
                      renderItem={({ item: state }) => (
                        <Text style={styles.stateText}>• {state}</Text>
                      )}
                    />
                  </View>
                ))
              ) : (
                ""
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity onPress={toggleTopic}>
              <View style={{
                paddingHorizontal: normalize(5),
                paddingVertical: normalize(10),
                width: "100%"
              }}>
                <Text
                  style={{
                    fontFamily: Fonts.InterSemiBold,
                    fontSize: 16,
                    color: Colorpath.ButtonColr,
                  }}>
                  {expandedtopic ? "View less" : "View more"}
                </Text>
              </View>
            </TouchableOpacity>
          }
        />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  topicContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
    borderColor: "#DADADA",
    borderWidth: 0.8
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    fontFamily: Fonts.InterBold
  },
  professionContainer: {
    marginBottom: 10,
  },
  professionText: {
    fontSize: 16,
    fontFamily: Fonts.InterBold,
    color: "#000000",
    marginBottom: 5,
    paddingHorizontal: normalize(1)
  },
  stateText: {
    fontSize: 14,
    color: "#666",
    marginLeft: normalize(10),
    fontFamily: Fonts.InterMedium
  },
  noDataText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
  },
});

export default TopicCast;
