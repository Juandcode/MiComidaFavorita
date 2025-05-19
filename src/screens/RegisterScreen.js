import {StyleSheet, TextInput, View, Text, Pressable, ActivityIndicator} from "react-native";
import {useEffect, useState} from "react";
import {createUserWithEmailAndPassword, validatePassword} from "firebase/auth";
import {auth} from "../config/firebase";
import {SafeAreaView} from "react-native-safe-area-context";
import withKeyBoardBehavour from "../components/withKeyBoardBehavour";
import {MaterialIcons} from "@expo/vector-icons";


function RegisterScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (password === password2) {
            validatePasswordUser(password);
        }
    }, [password, password2]);

    const validateEmail = (text) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid(regex.test(text));
        setEmail(text);
    };

    const validatePasswordUser = async (password) => {
        const status = await validatePassword(auth, password);
        console.log(status);
        setPassword(password);
        setIsValidPassword(status.isValid);
    }

    const handleRegister = async () => {
        try {
            if (!isValid || !isValidPassword) {
                return;
            }
            setIsLoading(true);
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
        setIsLoading(false);
    };
    return (
        <>
            <Text h3 style={styles.title}>Registro</Text>
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
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmacion Contraseña"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry
            />
            {error ? <Text>{error}</Text> : null}
            {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : (<><Pressable
                style={getButtonStyle(isValid && isValidPassword)} onPress={handleRegister}>
                <Text style={styles.textStyle}>Registrarse</Text>
            </Pressable>
                <View style={{marginTop: 20}}/>
                <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.textStyle}>Volver al login</Text>
                </Pressable></>)
            }
        </>
    )
}

export default withKeyBoardBehavour(RegisterScreen);

const getButtonStyle = (isActive) => ({
    ...styles.button,
    backgroundColor: isActive ? "#2f95dc" : "#838383",
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    }, title: {
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: "bold",
        fontSize: 18,
    }, input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,

    }, button: {
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 2,
        backgroundColor: "#2f95dc",
    }, textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

})

