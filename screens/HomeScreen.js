import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import tw from "tailwind-rn";
import { AntDesign, Entypo, Ionicons, Fontisto } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import generateId from "../lib/generateId";

const DUMMY_DATA = [
  {
    fisrtName: "Lourdes",
    lastName: "Friesen",
    job: "Global",
    photoURL: "https://cdn.fakercloud.com/avatars/gabrielrosser_128.jpg",
    age: 18,
    id: "1",
  },
  {
    fisrtName: "Melissa",
    lastName: "Mueller",
    job: "Regional",
    photoURL: "https://cdn.fakercloud.com/avatars/dhooyenga_128.jpg",
    age: 23,
    id: "2",
  },
  {
    fisrtName: "Roberta",
    lastName: "Shanahan",
    job: "International",
    photoURL: "https://cdn.fakercloud.com/avatars/xravil_128.jpg",
    age: 28,
    id: "3",
  },
  {
    fisrtName: "Gage",
    lastName: "McKenzie",
    job: "Internal",
    photoURL: "https://cdn.fakercloud.com/avatars/darcystonge_128.jpg",
    age: 31,
    id: "4",
  },
  {
    fisrtName: "Katelin",
    lastName: "Kuhlman",
    job: "Principal",
    photoURL: "https://cdn.fakercloud.com/avatars/sindresorhus_128.jpg",
    age: 21,
    id: "5",
  },
  {
    fisrtName: "Alden",
    lastName: "Zboncak",
    job: "Global",
    photoURL: "https://cdn.fakercloud.com/avatars/emmeffess_128.jpg",
    age: 35,
    id: "6",
  },
];

import useAuth from "../hooks/useAuth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  getDocs,
  getDoc,
  DocumentSnapshot,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import { disableExpoCliLogging } from "expo/build/logs/Logs";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);
  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
      console.log([...passedUserIds, ...swipedUserIds]);

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log(`Hooray,You MATCHED with ${userSwiped.displayName}`);
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );

          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            userMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log(
            `You Swiped on ${userSwiped.displayName}(${userSwiped.job})`
          );
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );

    console.log(`You Swiped on ${userSwiped.displayName}(${userSwiped.job})`);
    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Fontisto
            onPress={() => navigation.navigate("Modal")}
            name="tinder"
            size={60}
            color="#FF5864"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            size={30}
            name="chatbubble-sharp"
            color="#FF5864"
            onPress={() => navigation.navigate("Chat")}
          />
        </TouchableOpacity>
      </View>
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          animateCardOpacity
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-3/4 rounded-xl")}
              >
                <Image
                  style={tw("absolute top-0 h-full w-full rounded-xl ")}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0  bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl "
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw("relative bg-white h-3/4 justify-center items-center"),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>沒人ㄌ Q_Q!</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo color="red" size={24} name="cross" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <Entypo color="green" size={24} name="heart" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
