import {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Button,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Keyboard,
    Animated
} from "react-native";
import {Input} from "react-native-elements";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../config/firebase";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, Platform} from 'react-native';
import withCredentialsAndKeyBoard from "../components/withKeyBoardBehavour";
import withKeyBoardBehavour from "../components/withKeyBoardBehavour";

function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isValidEmail) {
            setError('Email no valido.');
        } else {
            setError("");
        }

        if (isValidEmail && !isValidPassword) {
            setError('La contraseña esta vacia.');
        } else if (isValidEmail && isValidPassword) {
            setError('');
        }
    }, [email, password]);


    const validateEmail = (text) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(regex.test(text));
        setEmail(text);
    };

    const validatePassword = (password) => {
        if (password.length > 0) {
            setIsValidPassword(true);
            setPassword(password);
        } else {
            setPassword("");
            setIsValidPassword(false);
        }
    }

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (error) {
            setError('Error al iniciar sesión: ' + error.message);
        }
        setIsLoading(false);
    };

    return (
        <>
            <Text style={styles.title}>Mi comida favorita</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                textContentType="emailAddress"
                onChangeText={validateEmail}/>
            <TextInput
                editable={isValidEmail}
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry
            />
            {error ? <Text>{error}</Text> : null}
            {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : (<><Pressable
                style={getButtonStyle(isValidEmail && isValidPassword)} onPress={() => {
                if (isValidEmail) {
                    handleLogin();
                }
            }}>
                <Text style={styles.textStyle}>Iniciar Sesion</Text>
            </Pressable>
                <View style={{marginTop: 20}}/>
                <Pressable style={styles.button} onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.textStyle}>Registrarse</Text>
                </Pressable></>)
            }
        </>
    )
}

const getButtonStyle = (isActive) => ({
    ...styles.button,
    backgroundColor: isActive ? "#2f95dc" : "#838383",
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: "bold",
        fontSize: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,

    },
    button: {
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 2,
        backgroundColor: "#2f95dc",
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

})

export default withKeyBoardBehavour(LoginScreen);
