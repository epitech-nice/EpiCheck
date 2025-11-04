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

import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";

import { useState, useEffect } from "react";
import soundService from "../services/soundService";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    const [hasCustomSuccess, setHasCustomSuccess] = useState(false);
    const [hasCustomError, setHasCustomError] = useState(false);

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

            Alert.alert("Success", "Custom success sound imported!");
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

    return (
        <SafeAreaView className="flex-1 bg-epitech-gray">
            {/* Header */}
            <View className="bg-epitech-blue px-4 py-5">
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

            <ScrollView className="flex-1">
                {/* Sounds Section */}
                <View className="m-4 rounded-lg bg-white shadow-sm">
                    <View className="border-b border-gray-200 p-4">
                        <Text className="text-lg font-bold text-epitech-navy">
                            🔊 Sound Settings
                        </Text>
                        <Text className="mt-1 text-xs text-gray-600">
                            Customize success and error sounds
                        </Text>
                    </View>

                    {/* Success Sound */}
                    <View className="border-b border-gray-200 p-4">
                        <View className="mb-3 flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="font-semibold text-epitech-navy">
                                    Success Sound
                                </Text>
                                <Text className="mt-0.5 text-xs text-gray-500">
                                    {hasCustomSuccess ? "Custom" : "Default"}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleTestSuccessSound}
                                className="rounded-lg bg-epitech-blue px-4 py-2"
                            >
                                <Text className="text-sm font-semibold text-white">
                                    🔊 Test
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={handleImportSuccessSound}
                                className="flex-1 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
                            >
                                <Text className="text-center text-sm font-semibold text-green-700">
                                    📁 Import Sound
                                </Text>
                            </TouchableOpacity>

                            {hasCustomSuccess && (
                                <TouchableOpacity
                                    onPress={handleResetSuccessSound}
                                    className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                                >
                                    <Text className="text-center text-sm font-semibold text-red-700">
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
                                <Text className="font-semibold text-epitech-navy">
                                    Error Sound
                                </Text>
                                <Text className="mt-0.5 text-xs text-gray-500">
                                    {hasCustomError ? "Custom" : "Default"}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleTestErrorSound}
                                className="rounded-lg bg-red-500 px-4 py-2"
                            >
                                <Text className="text-sm font-semibold text-white">
                                    🔊 Test
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={handleImportErrorSound}
                                className="flex-1 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
                            >
                                <Text className="text-center text-sm font-semibold text-green-700">
                                    📁 Import Sound
                                </Text>
                            </TouchableOpacity>

                            {hasCustomError && (
                                <TouchableOpacity
                                    onPress={handleResetErrorSound}
                                    className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                                >
                                    <Text className="text-center text-sm font-semibold text-red-700">
                                        ↺ Reset
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Info Card */}
                <View className="m-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <Text className="mb-2 font-semibold text-blue-900">
                        💡 Tips
                    </Text>
                    <Text className="text-xs leading-relaxed text-blue-800">
                        • Supported formats: MP3, WAV, M4A{"\n"}• Custom sounds
                        are stored locally{"\n"}• Test sounds before using in
                        production{"\n"}• Reset to default anytime
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
