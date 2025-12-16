import {
  View,
  Text,
  Button,
  useColorScheme,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import { Link, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import FormScreen from "@/components/custom/FormScreen";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const { colors } = useTheme();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <>
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]} // 🔥 Gradient colors
        style={{ flex: 1, padding: 10 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            // contentContainerStyle={{ paddingBottom: 10 }}
            // showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: keyboardHeight > 0 ? keyboardHeight * 0.35 : 20, // smart padding
            }}
            showsVerticalScrollIndicator={false}
          >
            <Stack.Screen
              options={{
                headerTransparent: false,
                headerStyle: {
                  backgroundColor: "rgb(15, 32, 39)",
                },
                statusBarStyle:"light",
                headerShadowVisible: false, // remove bottom border
                headerTitle: () => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      source={require("@/assets/images/company-logo.png")}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6, // optional for rounded icon look
                        marginRight: 5
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      SDB ENGINEERING
                    </Text>
                    
                  </View>
                ),
                // headerRight: () => (
                //   <Image
                //     source={require("@/assets/images/logo.png")}
                //     style={{
                //       width: 50,
                //       height: 30,
                //       borderRadius: 20,
                //       marginRight: 2, // spacing from edge
                //     }}
                //     resizeMode="contain"
                //   />
                // ),
              }}
            />
            <View
              style={{
                flex: 1,
                gap: 20,
                overflowY: "auto",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 23,
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                Inclined Conveyor Calculation Desk
              </Text>

              <FormScreen />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 2,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
