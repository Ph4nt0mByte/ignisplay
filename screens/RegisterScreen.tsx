import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { register, login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const success = register(username, password);
            if (success) {
                // Auto login on success
                login(username, password);
                setLoading(false);
            } else {
                setLoading(false);
                Alert.alert("Error", "Username likely taken");
            }
        }, 500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.content, { paddingTop: insets.top + Spacing.xl }]}>
                    <StatusBar barStyle="light-content" />

                    <View style={styles.header}>
                        <ThemedText type="h1" style={styles.title}>Create Account</ThemedText>
                        <ThemedText type="body" style={styles.subtitle}>Join Ignisplay today</ThemedText>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Feather name="user" size={20} color={Colors.dark.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor={Colors.dark.textSecondary}
                                autoCapitalize="none"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Feather name="lock" size={20} color={Colors.dark.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={Colors.dark.textSecondary}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Feather name="lock" size={20} color={Colors.dark.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor={Colors.dark.textSecondary}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <Pressable
                            onPress={handleRegister}
                            style={({ pressed }) => [
                                styles.loginButton,
                                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                            ]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.dark.text} />
                            ) : (
                                <ThemedText type="body" style={styles.loginButtonText}>Register</ThemedText>
                            )}
                        </Pressable>
                    </View>

                    <View style={styles.footer}>
                        <ThemedText type="small" style={styles.footerText}>Already have an account?</ThemedText>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <ThemedText type="small" style={styles.linkText}>Sign In</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.backgroundRoot,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        justifyContent: "center",
    },
    header: {
        marginBottom: Spacing["3xl"],
        alignItems: "center",
        gap: Spacing.xs,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 32,
        fontWeight: "700",
    },
    subtitle: {
        color: Colors.dark.textSecondary,
    },
    form: {
        gap: Spacing.lg,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.dark.backgroundSecondary,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 56,
        gap: Spacing.md,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
        height: "100%",
    },
    loginButton: {
        backgroundColor: Colors.dark.primary,
        height: 56,
        borderRadius: BorderRadius.md,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.md,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: Spacing.xs,
        marginTop: Spacing.xl,
    },
    footerText: {
        color: Colors.dark.textSecondary,
    },
    linkText: {
        color: Colors.dark.primary,
        fontWeight: "600",
    },
});
