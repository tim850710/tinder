import React, { useState, useLayoutEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { db } from "../firebase";


const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const incompoleteForm = !image || !job || !age;

  console.log(user)
  const updateUserProfile = () => {
    setDoc(doc(db,"users",user.uid),{
      id:user.uid,
      displayName:user.displayName,
      photoURL:image,
      job:job,
      age:age,
      timestamp:serverTimestamp()
    }).then(()=>{
      navigation.navigate("Home")
    }).catch(error=>alert(error.message))
  };

  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        步驟 1： 選擇照片
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="輸入資料網址"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        步驟 2： 職稱
      </Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="輸入職稱"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        步驟 3： 年齡
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="請輸入年齡"
      />
      <TouchableOpacity
        onPress={updateUserProfile}
        disabled={incompoleteForm}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-400"),
          incompoleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
      >
        <Text style={tw("text-center text-white text-xl")}>更新個人資料</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
