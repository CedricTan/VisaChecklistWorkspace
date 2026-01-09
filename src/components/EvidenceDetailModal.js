import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const IMAGE_MAP = {
    'marriage_cert': require('../../assets/marriage_certificate_mockup.png'),
    'joint_utility_bills': require('../../assets/utility_bill_water.png'),
    'joint_bank_statements': require('../../assets/bank_statement_mockup.png'),
    'joint_mortgage_tenancy': require('../../assets/tenancy_agreement_mockup.png'),
};

const EvidenceDetailModal = ({ item, isVisible, onClose }) => {
    if (!item) return null;

    const hasImage = IMAGE_MAP[item.id];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <MaterialCommunityIcons name={item.icon} size={28} color="#1A237E" />
                            <Text style={styles.title}>{item.label}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.sectionTitle}>What is this?</Text>
                        <Text style={styles.description}>{item.description}</Text>

                        <Text style={styles.sectionTitle}>Specific Requirements</Text>
                        <View style={styles.guidanceBox}>
                            <MaterialCommunityIcons name="information" size={20} color="#5C6BC0" style={styles.infoIcon} />
                            <Text style={styles.guidanceText}>{item.specifics}</Text>
                        </View>

                        {hasImage && (
                            <>
                                <Text style={styles.sectionTitle}>Example Visual</Text>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={IMAGE_MAP[item.id]}
                                        style={styles.exampleImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.imageCaption}>Sample {item.label} format</Text>
                                </View>
                            </>
                        )}

                        {!hasImage && item.tier === 'tier3' && (
                            <View style={styles.tipBox}>
                                <Text style={styles.tipTitle}>💡 Pro Tip</Text>
                                <Text style={styles.tipText}>
                                    Tier 3 evidence is best used to support Tiers 1 and 2. Ensure they are well-organized and clearly labeled with dates and names.
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                        <Text style={styles.doneButtonText}>Got it</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A237E',
        marginLeft: 12,
        flexShrink: 1,
    },
    closeButton: {
        padding: 4,
    },
    scrollBody: {
        padding: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#5C6BC0',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginTop: 16,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    guidanceBox: {
        backgroundColor: '#F5F7FF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        marginTop: 8,
    },
    infoIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    guidanceText: {
        fontSize: 14,
        color: '#444',
        flex: 1,
        lineHeight: 20,
    },
    imageContainer: {
        marginTop: 12,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#f9f9f9',
    },
    exampleImage: {
        width: '100%',
        height: 300,
        backgroundColor: '#fff',
    },
    imageCaption: {
        padding: 8,
        textAlign: 'center',
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    tipBox: {
        backgroundColor: '#FFF9C4',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    tipTitle: {
        fontWeight: '700',
        color: '#F57F17',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    doneButton: {
        backgroundColor: '#1A237E',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EvidenceDetailModal;
