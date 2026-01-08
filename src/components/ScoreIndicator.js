import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreIndicator = ({ score }) => {
    const getRating = (s) => {
        if (s >= 80) return { label: 'Strong', color: '#4CAF50' };
        if (s >= 50) return { label: 'Moderate', color: '#FF9800' };
        return { label: 'Weak', color: '#F44336' };
    };

    const rating = getRating(score);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application Strength</Text>
            <View style={styles.scoreCircle}>
                <Text style={[styles.scoreText, { color: rating.color }]}>{score}%</Text>
            </View>
            <Text style={[styles.ratingText, { color: rating.color }]}>
                {rating.label}
            </Text>
            <Text style={styles.subtitle}>
                Based on official Home Office guidance tiers
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginVertical: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    scoreCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 8,
        borderColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    ratingText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default ScoreIndicator;
