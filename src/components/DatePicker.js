import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ value, onChangeText, placeholder }) => {
    const [showPicker, setShowPicker] = useState(false);

    const parseDateForPicker = (str) => {
        if (!str) return new Date();
        const parts = str.split('/');
        if (parts.length !== 3) return new Date();

        let [d, m, y] = parts.map(Number);
        if (!d || !m || !y) return new Date();

        if (y < 100) y += 2000;

        const date = new Date(y, m - 1, d);
        return isNaN(date.getTime()) ? new Date() : date;
    };

    const formatDate = (date) => {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const onDateChange = (event, selectedDate) => {
        // Platform.OS === 'android' requires hiding before setting
        setShowPicker(false);
        if (selectedDate) {
            onChangeText(formatDate(selectedDate));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType="numeric"
                    maxLength={10}
                />
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setShowPicker(true)}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#5C6BC0" />
                </TouchableOpacity>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={parseDateForPicker(value)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FE',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E4F0',
    },
    textInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
    },
    iconButton: {
        padding: 12,
        borderLeftWidth: 1,
        borderLeftColor: '#E0E4F0',
    },
});

export default DatePicker;
