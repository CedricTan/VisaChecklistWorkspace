import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MandatoryCard = ({ item, isChecked, onPress }) => {
    const isAutoFilled = !!item.autoCheckKey;

    const Content = (
        <View style={styles.content}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={isChecked ? '#2E7D32' : (isAutoFilled ? '#7986CB' : '#1A237E')}
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.labelRow}>
                    <Text style={[styles.label, isAutoFilled && styles.autoFilledLabel]}>{item.label}</Text>
                    {isAutoFilled && (
                        <View style={styles.autoBadge}>
                            <MaterialCommunityIcons name="lock-outline" size={12} color="#7986CB" />
                            <Text style={styles.autoBadgeText}>Auto-filled</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.statusContainer}>
                <MaterialCommunityIcons
                    name={isChecked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                    size={24}
                    color={isChecked ? '#4CAF50' : '#CCC'}
                />
            </View>
        </View>
    );

    if (isAutoFilled) {
        return (
            <View style={[styles.container, styles.autoFilledContainer, isChecked && styles.checkedContainer]}>
                {Content}
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.container, isChecked && styles.checkedContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {Content}
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
    autoFilledContainer: {
        backgroundColor: '#F5F6FA',
        borderColor: '#E8EAF6',
        shadowOpacity: 0.02,
        elevation: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginRight: 16,
        width: 40,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        color: '#333',
    },
    autoFilledLabel: {
        color: '#5C6BC0',
    },
    autoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8EAF6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    autoBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#7986CB',
        marginLeft: 4,
        textTransform: 'uppercase',
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
