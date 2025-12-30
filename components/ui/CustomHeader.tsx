import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";

interface Props {
    title: string
    subtitle?: string
    showAvatar?: boolean
}

export const CustomHeader = ({title, subtitle, showAvatar = false}: Props) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[
            styles.container,
            {paddingTop: insets.top + 10}
        ]}>
            <View style={styles.leftSection}>
                <TouchableOpacity onPress={() => router.push('/(profile)')}>
                    {showAvatar && (
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{uri: 'https://avatar.iran.liara.run/public/boy'}}
                                style={styles.avatar}
                            />
                            <View style={styles.statusDot}/>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.textContainer}>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.notificationBtn}>
                <Ionicons name="notifications" size={20} color="#1A2533"/>
                <View style={styles.notificationBadge}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        paddingBottom: 10,
        width: '100%',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CD964',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    textContainer: {
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#8E9AAF',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A2533',
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F2A93B',
    }
});