import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChecklistItem = ({ item, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, isSelected && styles.selectedContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={isSelected ? 'check-circle' : item.icon}
                    size={24}
                    color={isSelected ? '#4CAF50' : '#666'}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                    {item.label}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    selectedContainer: {
        backgroundColor: '#E8F5E9',
        borderColor: '#A5D6A7',
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    selectedLabel: {
        color: '#2E7D32',
    },
});

export default ChecklistItem;
