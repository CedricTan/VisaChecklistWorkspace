import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MandatoryCard = ({ item, isChecked, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, isChecked && styles.checkedContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={isChecked ? '#2E7D32' : '#1A237E'}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.statusContainer}>
                <MaterialCommunityIcons
                    name={isChecked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                    size={24}
                    color={isChecked ? '#4CAF50' : '#CCC'}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    checkedContainer: {
        backgroundColor: '#F1F8E9',
        borderColor: '#C5E1A5',
    },
    iconContainer: {
        marginRight: 16,
        width: 40,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    statusContainer: {
        marginLeft: 12,
    },
});

export default MandatoryCard;
