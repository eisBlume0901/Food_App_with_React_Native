import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { Link} from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text 
        style={{ 
          fontSize: 20, fontWeight: "bold" 
        }}>
        I want to eat carrot cake</Text>

      <TouchableOpacity>
        <Text
          style={{
            color: "green",
            textDecorationLine: "underline",
          }}
        >Click this button for more details</Text>
      </TouchableOpacity>

      <Link
        href="/about"
      >
        Visit about page
      </Link>

      <Image source={{
          uri: "https://plus.unsplash.com/premium_photo-1714669889975-90386fbb03e4?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }}
        style={{
           width: 200, height: 200, borderRadius: 10 
        }}
      />

    <Image 
      source={
        require("../assets/images/react-logo.png")
      }
      style={{ 
        width: 200, height: 200, borderRadius: 10 
      }}
     />

     <TextInput 
      placeholder="Type here..." 
      style={{
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        padding: 10,
      }}
     />

     <TextInput 
      placeholder="Enter your email"
      style={{
        borderWidth: 1,
        padding: 10
      }}
      secureTextEntry=
      {
        false
      }
     />

    </View>
  );
}


const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  }
)