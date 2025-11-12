/**
 * File Name: SettingsScreen.tsx
 * Author: Alexandre Kévin DE FREITAS MARTINS
 * Creation Date: 29/10/2025
 * Description: This is the SettingsScreen.tsx
 * Copyright (c) 2025 Epitech
 * Version: 1.0.0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import intraAuth from "../services/intraAuth";
import soundService from "../services/soundService";
import { useTheme } from "../contexts/ThemeContext";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    Alert,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Login: undefined;
    Activities: undefined;
    Presence: undefined;
    Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { theme, isDark, setTheme } = useTheme();
    const [hasCustomSuccess, setHasCustomSuccess] = useState(false);
    const [hasCustomError, setHasCustomError] = useState(false);
    const [manualCookie, setManualCookie] = useState("");
    const [showDevSection, setShowDevSection] = useState(__DEV__);

    useEffect(() => {
        // Check if custom sounds are configured
        setHasCustomSuccess(soundService.hasCustomSuccessSound());
        setHasCustomError(soundService.hasCustomErrorSound());
    }, []);

    const handleImportSuccessSound = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["audio/*"],
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];
            await soundService.importSuccessSound(file.uri);
            setHasCustomSuccess(true);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to import sound");
        }
    };

    const handleImportErrorSound = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["audio/*"],
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];
            await soundService.importErrorSound(file.uri);
            setHasCustomError(true);

            Alert.alert("Success", "Custom error sound imported!");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to import sound");
        }
    };

    const handleResetSuccessSound = () => {
        Alert.alert("Reset Success Sound", "Reset to default sound?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Reset",
                style: "destructive",
                onPress: async () => {
                    await soundService.resetSuccessSound();
                    setHasCustomSuccess(false);
                    Alert.alert("Success", "Sound reset to default");
                },
            },
        ]);
    };

    const handleResetErrorSound = () => {
        Alert.alert("Reset Error Sound", "Reset to default sound?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Reset",
                style: "destructive",
                onPress: async () => {
                    await soundService.resetErrorSound();
                    setHasCustomError(false);
                    Alert.alert("Success", "Sound reset to default");
                },
            },
        ]);
    };

    const handleTestSuccessSound = async () => {
        await soundService.playSuccessSound();
    };

    const handleTestErrorSound = async () => {
        await soundService.playErrorSound();
    };

    const handleSetManualCookie = async () => {
        if (!manualCookie.trim()) {
            Alert.alert("Error", "Please enter a cookie value");
            return;
        }

        try {
            await intraAuth.setTestCookie(manualCookie.trim());
            Alert.alert(
                "Success",
                "Cookie set successfully! You can now use the app.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Activities"),
                    },
                ],
            );
            setManualCookie("");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to set cookie");
        }
    };

    const handleClearCookie = async () => {
        Alert.alert("Clear Cookie", "This will log you out. Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Clear",
                style: "destructive",
                onPress: async () => {
                    await intraAuth.clearIntraCookie();
                    Alert.alert("Success", "Cookie cleared");
                    navigation.navigate("Login");
                },
            },
        ]);
    };

    return (
        <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="bg-primary px-4 py-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3"
                    >
                        <Text className="text-2xl text-white">←</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        Settings
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 bg-background">
                {/* Theme Section */}
                <View className="m-4 rounded-lg border border-card-border bg-card-bg shadow-sm">
                    <View className="border-b border-border p-4">
                        <Text className="text-lg font-bold text-text-primary">
                            🌓 Theme
                        </Text>
                        <Text className="mt-1 text-xs text-text-secondary">
                            Choose your preferred theme
                        </Text>
                    </View>

                    <View className="p-4">
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => setTheme("light")}
                                className={`flex-1 rounded-lg border-2 px-4 py-3 ${
                                    theme === "light"
                                        ? "border-primary bg-status-info-bg"
                                        : "border-border bg-background-secondary"
                                }`}
                            >
                                <Text
                                    className={`text-center text-sm font-semibold ${
                                        theme === "light"
                                            ? "text-primary"
                                            : "text-text-secondary"
                                    }`}
                                >
                                    ☀️ Light
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setTheme("dark")}
                                className={`flex-1 rounded-lg border-2 px-4 py-3 ${
                                    theme === "dark"
                                        ? "border-primary bg-status-info-bg"
                                        : "border-border bg-background-secondary"
                                }`}
                            >
                                <Text
                                    className={`text-center text-sm font-semibold ${
                                        theme === "dark"
                                            ? "text-primary"
                                            : "text-text-secondary"
                                    }`}
                                >
                                    🌙 Dark
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setTheme("system")}
                                className={`flex-1 rounded-lg border-2 px-4 py-3 ${
                                    theme === "system"
                                        ? "border-primary bg-status-info-bg"
                                        : "border-border bg-background-secondary"
                                }`}
                            >
                                <Text
                                    className={`text-center text-sm font-semibold ${
                                        theme === "system"
                                            ? "text-primary"
                                            : "text-text-secondary"
                                    }`}
                                >
                                    📱 System
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {theme === "system" && (
                            <Text className="mt-2 text-center text-xs text-text-tertiary">
                                Using {isDark ? "dark" : "light"} mode from system settings
                            </Text>
                        )}
                    </View>
                </View>

                {/* Sounds Section */}
                <View className="m-4 rounded-lg border border-card-border bg-card-bg shadow-sm">
                    <View className="border-b border-border p-4">
                        <Text className="text-lg font-bold text-text-primary">
                            🔊 Sound Settings
                        </Text>
                        <Text className="mt-1 text-xs text-text-secondary">
                            Customize success and error sounds
                        </Text>
                    </View>

                    {/* Success Sound */}
                    <View className="border-b border-border p-4">
                        <View className="mb-3 flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="font-semibold text-text-primary">
                                    Success Sound
                                </Text>
                                <Text className="mt-0.5 text-xs text-text-tertiary">
                                    {hasCustomSuccess ? "Custom" : "Default"}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleTestSuccessSound}
                                className="rounded-lg bg-primary px-4 py-2"
                            >
                                <Text className="text-sm font-semibold text-white">
                                    🔊 Test
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={handleImportSuccessSound}
                                className="flex-1 rounded-lg border border-status-success bg-status-success-bg px-4 py-3"
                            >
                                <Text className="text-center text-sm font-semibold text-status-success">
                                    📁 Import Sound
                                </Text>
                            </TouchableOpacity>

                            {hasCustomSuccess && (
                                <TouchableOpacity
                                    onPress={handleResetSuccessSound}
                                    className="flex-1 rounded-lg border border-status-error bg-status-error-bg px-4 py-3"
                                >
                                    <Text className="text-center text-sm font-semibold text-status-error">
                                        ↺ Reset
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Error Sound */}
                    <View className="p-4">
                        <View className="mb-3 flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="font-semibold text-text-primary">
                                    Error Sound
                                </Text>
                                <Text className="mt-0.5 text-xs text-text-tertiary">
                                    {hasCustomError ? "Custom" : "Default"}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleTestErrorSound}
                                className="rounded-lg bg-status-error px-4 py-2"
                            >
                                <Text className="text-sm font-semibold text-white">
                                    🔊 Test
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={handleImportErrorSound}
                                className="flex-1 rounded-lg border border-status-success bg-status-success-bg px-4 py-3"
                            >
                                <Text className="text-center text-sm font-semibold text-status-success">
                                    📁 Import Sound
                                </Text>
                            </TouchableOpacity>

                            {hasCustomError && (
                                <TouchableOpacity
                                    onPress={handleResetErrorSound}
                                    className="flex-1 rounded-lg border border-status-error bg-status-error-bg px-4 py-3"
                                >
                                    <Text className="text-center text-sm font-semibold text-status-error">
                                        ↺ Reset
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Developer Section - Manual Cookie Input */}
                {showDevSection && (
                    <View className="m-4 rounded-lg border border-card-border bg-card-bg shadow-sm">
                        <TouchableOpacity
                            onPress={() => setShowDevSection(!showDevSection)}
                            className="border-b border-border p-4"
                        >
                            <Text className="text-lg font-bold text-text-primary">
                                🛠️ DEVELOPER OPTIONS
                            </Text>
                            <Text className="mt-1 text-xs text-text-secondary">
                                Manual authentication for testing
                            </Text>
                        </TouchableOpacity>

                        <View className="p-4">
                            <Text className="mb-2 font-semibold text-text-primary">
                                MANUAL COOKIE INPUT
                            </Text>
                            <Text className="mb-3 text-xs text-text-secondary">
                                If automatic cookie extraction fails (HttpOnly
                                cookies), you can manually input your Intranet
                                cookie here.
                            </Text>

                            <View className="mb-3 rounded-lg border border-border bg-background p-3">
                                <Text className="mb-2 text-xs font-semibold text-text-tertiary">
                                    HOW TO GET YOUR COOKIE:
                                </Text>
                                <Text className="text-xs leading-relaxed text-text-secondary">
                                    1. Login to intra.epitech.eu in your browser
                                    {"\n"}
                                    2. Open DevTools (F12 or Cmd+Option+I){"\n"}
                                    3. Go to Application → Cookies{"\n"}
                                    4. Find intra.epitech.eu{"\n"}
                                    5. Copy the &apos;user&apos; cookie value
                                </Text>
                            </View>

                            <TextInput
                                value={manualCookie}
                                onChangeText={setManualCookie}
                                placeholder="Paste your cookie value here..."
                                placeholderTextColor={isDark ? "#666" : "#999"}
                                multiline
                                numberOfLines={3}
                                className="mb-3 rounded-lg border border-border bg-background p-3 text-sm text-text-primary"
                            />

                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={handleSetManualCookie}
                                    disabled={!manualCookie.trim()}
                                    className={`flex-1 rounded-lg px-4 py-3 ${
                                        manualCookie.trim()
                                            ? "bg-status-success"
                                            : "bg-border"
                                    }`}
                                >
                                    <Text
                                        className={`text-center text-sm font-semibold ${
                                            manualCookie.trim()
                                                ? "text-white"
                                                : "text-text-tertiary"
                                        }`}
                                    >
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={16}
                                        />{" "}
                                        SET COOKIE
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleClearCookie}
                                    className="flex-1 rounded-lg border border-status-error bg-status-error-bg px-4 py-3"
                                >
                                    <Text className="text-center text-sm font-semibold text-status-error">
                                        <Ionicons name="trash" size={16} />{" "}
                                        CLEAR COOKIE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Info Card */}
                <View className="m-4 rounded-lg border border-status-info bg-status-info-bg p-4">
                    <Text className="mb-2 font-semibold text-status-info">
                        💡 Tips
                    </Text>
                    <Text className="text-xs leading-relaxed text-status-info">
                        • Supported formats: MP3, WAV, M4A{"\n"}• Custom sounds
                        are stored locally{"\n"}• Test sounds before using in
                        production{"\n"}• Reset to default anytime
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
