import {Stack} from 'expo-router';
import { StyleSheet } from 'react-native';
import {Colors} from "@/constants/Colors";


export default function ProfileLayout() {


    return (
        <Stack screenOptions={{
            headerShown: false,
            headerTintColor: Colors.secondary,
            headerShadowVisible: false,
            headerTitle: 'qwe',
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: Colors.background }
        }}>
            <Stack.Screen name="index" options={{ headerShown: true }}/>
        </Stack>
    );
}

const styles = StyleSheet.create({

});