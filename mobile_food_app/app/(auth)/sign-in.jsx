import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { authStyles } from "../../assets/styles/auth.styles"
import { Image } from 'expo-image';

const SignInScreen = () => {

    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { email, setEMail } = useState("");
    const { password, setPassword } = useState("");
    const { showPassword, setShowPassword } = useState(false);
    const { loading, setLoading } = useState(false); 

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.")
            return
        }

        if (isLoaded) {
            return;
        }

        setLoading(true);

        try 
        {
            const signInAttempt = await signIn.create({
                identifier: email,
                password: password,
            })

            if (signInAttempt.status === "complete") 
            {
                await setActive({ session: signInAttempt.createSessionId })
            } 
            else 
            {
                Alert.alert("Error", "Sign in failed. Please try again.");
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } 
        catch(error) 
        {
            Alert.alert("Error", error.errors?.[0]?.message || "Sign in failed");
            console.error(JSON.stringify(error, null, 2));
        } 
        finally 
        {
            setLoading(false);
        }

    };


    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView 
                style={authStyles.keyboardView}
                behavior={Platform.OS === 'ios' ? "padding": "height"}
            >
            
            <ScrollView
                contentContainerStyle={authStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={authStyles.imagecontainer}>
                    <Image 
                        source={ require("../../assets/images/i1.png") }
                        style={authStyles.image}
                        contentFit="contain"
                    />
                </View>

                <Text style={authStyles.title}>
                    Welcome Back
                </Text>


                {/* FORM CONTAINER */}
                <View styles={authStyles.formContainer}>

                {/* Email Input */}
                <View style={authStyles.inputContainer}>
                    <TextInput 
                        style={authStyles.textInput}
                        placeholder="Enter email"
                        placeholderTextColor="COLORS.textLight"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                </View>

                {/* Password Input */}
                <View style={authStyles.inputContainer}>
                    
                </View>
            
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignInScreen;