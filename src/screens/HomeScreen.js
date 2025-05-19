import {ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {auth, db} from "../config/firebase";
import {signOut} from 'firebase/auth';
import {useEffect, useState} from "react";
import {doc, getDoc, setDoc} from 'firebase/firestore';
import withKeyBoardBehavour from "../components/withKeyBoardBehavour";

function HomeScreen({navigation}) {


    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        comidaFavorita: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const docRef = doc(db, 'usuarios', auth.currentUser.uid);
            console.log(auth.currentUser);
            console.log(docRef);
            const docSnap = await getDoc(docRef);
            console.log(docSnap);
            if (docSnap.exists()) {
                console.log(docSnap.data());
                setProfile(docSnap.data());
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
        }
        setIsLoading(false);
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
            alert('Perfil actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert('Error al actualizar perfil');
        }
        setIsLoading(false);
    };
    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        setIsLoading(false);
    };


    return (
        <>
            <Text h4 style={styles.title}>Mi Perfil</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={profile.nombre}
                onChangeText={(text) => setProfile({...profile, nombre: text})}/>
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={profile.apellido}
                onChangeText={(text) => setProfile({...profile, apellido: text})}/>
            <TextInput
                style={styles.input}
                placeholder="Comida Favorita"
                value={profile.comidaFavorita}
                onChangeText={(text) => setProfile({...profile, comidaFavorita: text})}/>
            {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : (<><Pressable style={styles.button}
                                                                                           onPress={handleUpdate}>
                <Text style={styles.textStyle}>Actualizar Perfil</Text>
            </Pressable>
                <View style={{marginTop: 20}}/>
                <Pressable style={styles.button} onPress={handleSignOut}>
                    <Text style={styles.textStyle}>Cerrar Sesion</Text>
                </Pressable></>)
            }
        </>
    );
};

const styles = StyleSheet.create({
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
});

export default withKeyBoardBehavour(HomeScreen);
