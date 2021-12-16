import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import tw from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "../components/ChatRow"

const ChartList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("userMatched", "array-contains", user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  console.log(matches);

  return matches.length > 0 ? (
    <FlatList 
    style={tw("h-full")}
    data ={matches}
    keyExtractor={item=>item.id}
    renderItem={({item})=><ChatRow matchDetails={item}/>}
    />
  ) : (
    <View style={tw("p-5")}>
      <Text style={tw("text-center text-lg")}>目前沒有配對！</Text>
    </View>
  );
};

export default ChartList;
