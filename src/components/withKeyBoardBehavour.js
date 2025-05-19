import {useEffect, useState} from "react";
import {Keyboard, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function withKeyBoardBehavour(WrappedComponent) {
    return (props) => {
        const [keyboardHeight, setKeyboardHeight] = useState(0);

        useEffect(() => {
            const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            });
            const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardHeight(0);
            });

            return () => {
                showSubscription.remove();
                hideSubscription.remove();
            };
        }, []);

        // Lógica adicional aquí (ej: manejo de estado, contexto, etc.)
        return (
            <SafeAreaView style={styles.container}>
                <View style={{paddingBottom: keyboardHeight}}>
                    <WrappedComponent {...props}/>
                </View>
            </SafeAreaView>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
});
