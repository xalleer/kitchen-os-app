import {Stack} from 'expo-router';
import {Colors} from '@/constants/Colors';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            headerTitle: '',

            contentStyle: {backgroundColor: Colors.background}
        }}>
            <Stack.Screen name="welcome"/>
            <Stack.Screen name="login"/>
            <Stack.Screen name="register/step1"
                          options={{
                              headerShown: true,
                              headerTitle: '',
                              headerTintColor: Colors.secondary,
                              headerShadowVisible: false,
                              headerStyle: {backgroundColor: Colors.background}
                          }}/>


            <Stack.Screen
                name="register/step2"
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerStyle: {backgroundColor: Colors.background}
                }}

            />
            <Stack.Screen
                name="register/step3"
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerStyle: {backgroundColor: Colors.background}
                }}
            />


            <Stack.Screen
                name="register/step4"
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTintColor: Colors.secondary,
                    headerShadowVisible: false,
                    headerStyle: {backgroundColor: Colors.background}
                }}
            />
        </Stack>
    );
}