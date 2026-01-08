import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EVIDENCE_ITEMS, EVIDENCE_TIERS } from './src/constants/evidenceItems';
import {
  MANDATORY_REQUIREMENTS,
  THRESHOLDS,
  COSTS,
  TB_COUNTRIES,
  ENGLISH_EVIDENCE_TYPES
} from './src/constants/mandatoryRequirements';
import { COUNTRIES } from './src/constants/countries';
import ChecklistItem from './src/components/ChecklistItem';
import ScoreIndicator from './src/components/ScoreIndicator';
import MandatoryCard from './src/components/MandatoryCard';

const SCREENS = {
  PREREQUISITES: 'prerequisites',
  CHECKLIST: 'checklist',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.PREREQUISITES);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mandatoryChecks, setMandatoryChecks] = useState([]);

  // Data Inputs
  const [location, setLocation] = useState('INSIDE_UK');
  const [applicantAge, setApplicantAge] = useState('');
  const [sponsorAge, setSponsorAge] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [cashSavings, setCashSavings] = useState('');

  // Passport & Application Dates
  const [passportExpiryDate, setPassportExpiryDate] = useState('');
  const [intendedAppDate, setIntendedAppDate] = useState('');

  // New Inputs
  const [residenceCountry, setResidenceCountry] = useState('');
  const [englishEvidence, setEnglishEvidence] = useState('none');
  const [tbTestCompleted, setTbTestCompleted] = useState(false);

  // Dropdown States
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Derived filtered countries
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Derived auto-fill checks
  const autoCheckedIds = useMemo(() => {
    const ids = [];

    // Age Check
    const ageValid = parseInt(applicantAge) >= 18 && parseInt(sponsorAge) >= 18;
    if (ageValid) ids.push('age_requirement');

    // Financial Check
    const incomeValue = parseFloat(annualIncome) || 0;
    const savingsValue = parseFloat(cashSavings) || 0;
    const financialValid = incomeValue >= THRESHOLDS.MIN_INCOME || savingsValue >= THRESHOLDS.MIN_SAVINGS;
    if (financialValid) ids.push('financial_threshold');

    // Passport Check
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const [d, m, y] = dateStr.split('/').map(Number);
      if (!d || !m || !y || y < 2000) return null;
      return new Date(y, m - 1, d);
    };

    const expiry = parseDate(passportExpiryDate);
    const appDate = parseDate(intendedAppDate);

    if (expiry && appDate && expiry >= appDate) {
      ids.push('passport');
    }

    // TB Test Check
    const requiresTB = TB_COUNTRIES.some(c => c.toLowerCase() === residenceCountry.trim().toLowerCase());
    if (!requiresTB && residenceCountry.trim().length > 0) {
      ids.push('tb_test');
    } else if (requiresTB && tbTestCompleted) {
      ids.push('tb_test');
    }

    // English Check
    if (englishEvidence !== 'none') {
      ids.push('english_language');
    } else if (parseInt(applicantAge) >= 65) {
      ids.push('english_language'); // Auto-exempt if 65+
    }

    return ids;
  }, [applicantAge, sponsorAge, annualIncome, cashSavings, passportExpiryDate, intendedAppDate, residenceCountry, tbTestCompleted, englishEvidence]);

  // Combine manual checks with auto-filled ones
  const allMandatoryCheckedIds = useMemo(() => {
    return Array.from(new Set([...mandatoryChecks, ...autoCheckedIds]));
  }, [mandatoryChecks, autoCheckedIds]);

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleMandatory = (id) => {
    // Prevent manual toggle for auto-filled items if they don't meet criteria
    const item = MANDATORY_REQUIREMENTS.find(i => i.id === id);
    if (item.autoCheckKey) return;

    setMandatoryChecks(prev =>
      prev.includes(id) ? prev.filter(checkId => checkId !== id) : [...prev, id]
    );
  };

  const score = useMemo(() => {
    let total = 0;
    selectedItems.forEach(itemId => {
      const item = EVIDENCE_ITEMS.find(i => i.id === itemId);
      if (item) {
        total += EVIDENCE_TIERS[item.tier.toUpperCase()].points;
      }
    });
    // Cap at 100 for visual purposes
    return Math.min(100, total);
  }, [selectedItems]);

  const allMandatoryChecked = allMandatoryCheckedIds.length === MANDATORY_REQUIREMENTS.length;

  const cost = COSTS[location];

  const renderInputSection = () => {
    const requiresTB = TB_COUNTRIES.some(c => c.toLowerCase() === residenceCountry.trim().toLowerCase());

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputSectionTitle}>Step 1.1: Applicant Details</Text>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Applicant Age</Text>
            <TextInput
              style={styles.textInput}
              value={applicantAge}
              onChangeText={setApplicantAge}
              placeholder="e.g. 25"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sponsor Age</Text>
            <TextInput
              style={styles.textInput}
              value={sponsorAge}
              onChangeText={setSponsorAge}
              placeholder="e.g. 30"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Residence Country</Text>
          <TouchableOpacity
            style={styles.textInput}
            onPress={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
          >
            <Text style={{ color: residenceCountry ? '#333' : '#999' }}>
              {residenceCountry || 'Select Country...'}
            </Text>
            <MaterialCommunityIcons
              name={isCountryPickerOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
              style={{ position: 'absolute', right: 12, top: 12 }}
            />
          </TouchableOpacity>

          {isCountryPickerOpen && (
            <View style={styles.dropdownContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search country..."
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
              <ScrollView style={[styles.countryList, { maxHeight: 250 }]} nestedScrollEnabled>
                {filteredCountries.map(country => (
                  <TouchableOpacity
                    key={country}
                    style={styles.countryItem}
                    onPress={() => {
                      setResidenceCountry(country);
                      setIsCountryPickerOpen(false);
                      setCountrySearch('');
                    }}
                  >
                    <Text style={styles.countryText}>{country}</Text>
                  </TouchableOpacity>
                ))}
                {filteredCountries.length === 0 && (
                  <Text style={styles.noResultsText}>No results</Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={{ marginTop: isCountryPickerOpen ? 10 : 0 }}>
          {requiresTB && (
            <TouchableOpacity
              style={[styles.passportToggle, tbTestCompleted && styles.passportToggleActive, { marginBottom: 12, marginTop: 4 }]}
              onPress={() => setTbTestCompleted(!tbTestCompleted)}
            >
              <MaterialCommunityIcons
                name={tbTestCompleted ? "check-circle" : "alert-circle-outline"}
                size={20}
                color={tbTestCompleted ? "#fff" : "#D32F2F"}
              />
              <Text style={[styles.passportToggleText, tbTestCompleted && styles.passportToggleTextActive]}>
                {tbTestCompleted ? "TB Test Certificate obtained" : "TB Test required for " + residenceCountry}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.inputLabel}>English Language Evidence</Text>
        <View style={styles.evidenceGrid}>
          {ENGLISH_EVIDENCE_TYPES.filter(t => t.id !== 'none').map(type => (
            <TouchableOpacity
              key={type.id}
              style={[styles.evidenceBtn, englishEvidence === type.id && styles.evidenceBtnActive]}
              onPress={() => setEnglishEvidence(englishEvidence === type.id ? 'none' : type.id)}
            >
              <Text style={[styles.evidenceBtnText, englishEvidence === type.id && styles.evidenceBtnTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Annual Income (£)</Text>
            <TextInput
              style={styles.textInput}
              value={annualIncome}
              onChangeText={setAnnualIncome}
              placeholder="e.g. 30000"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cash Savings (£)</Text>
            <TextInput
              style={styles.textInput}
              value={cashSavings}
              onChangeText={setCashSavings}
              placeholder="e.g. 10000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Intended Application Date</Text>
            <TextInput
              style={styles.textInput}
              value={intendedAppDate}
              onChangeText={setIntendedAppDate}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Passport Expiry Date</Text>
            <TextInput
              style={styles.textInput}
              value={passportExpiryDate}
              onChangeText={setPassportExpiryDate}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderCostAssessment = () => (
    <View style={styles.costContainer}>
      <Text style={styles.inputSectionTitle}>Application Location & Cost</Text>
      <View style={styles.locationSelector}>
        {Object.keys(COSTS).map(key => (
          <TouchableOpacity
            key={key}
            style={[styles.locationBtn, location === key && styles.locationBtnActive]}
            onPress={() => setLocation(key)}
          >
            <Text style={[styles.locationBtnText, location === key && styles.locationBtnTextActive]}>
              {COSTS[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.costBreakdown}>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Application Fee</Text>
          <Text style={styles.costValue}>£{cost.fee.toLocaleString()}</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>IHS Health Surcharge</Text>
          <Text style={styles.costValue}>£{cost.ihs.toLocaleString()}</Text>
        </View>
        <View style={[styles.costRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Estimated Cost</Text>
          <Text style={styles.totalValue}>£{(cost.fee + cost.ihs).toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  const renderSection = (tierKey) => {
    const tier = EVIDENCE_TIERS[tierKey.toUpperCase()];
    const items = EVIDENCE_ITEMS.filter(item => item.tier === tierKey);

    return (
      <View key={tierKey} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{tier.title}</Text>
          <Text style={styles.sectionDesc}>{tier.description}</Text>
        </View>
        {items.map(item => (
          <ChecklistItem
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onPress={() => toggleItem(item.id)}
          />
        ))}
      </View>
    );
  };

  const renderPrerequisites = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Step 1: Prerequisites</Text>
          <Text style={styles.appSubtitle}>Mandatory Requirements & Cost Assessment</Text>
        </View>

        {renderCostAssessment()}
        {renderInputSection()}

        <View style={styles.sectionDivider}>
          <Text style={styles.dividerText}>Mandatory Checklist (Auto-filled)</Text>
        </View>

        {MANDATORY_REQUIREMENTS.map(item => (
          <MandatoryCard
            key={item.id}
            item={item}
            isChecked={allMandatoryCheckedIds.includes(item.id)}
            onPress={() => toggleMandatory(item.id)}
          />
        ))}

        <TouchableOpacity
          style={[styles.nextButton, !allMandatoryChecked && styles.nextButtonDisabled]}
          onPress={() => allMandatoryChecked ? setCurrentScreen(SCREENS.CHECKLIST) : null}
        >
          <Text style={styles.nextButtonText}>Next: Evidence Strength</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>

        {!allMandatoryChecked && (
          <Text style={styles.warningText}>Please complete all initial checks to proceed.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderChecklist = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentScreen(SCREENS.PREREQUISITES)}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#5C6BC0" />
        <Text style={styles.backButtonText}>Back to Step 1</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.appTitle}>Step 2: Evidence Strength</Text>
        <Text style={styles.appSubtitle}>Highlighting the "Strength of Evidence"</Text>
      </View>

      <ScoreIndicator score={score} />

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Select your available evidence to gauge how strong your application is in the eyes of the Home Office.
        </Text>
      </View>

      {Object.keys(EVIDENCE_TIERS).map(key => {
        const tier = EVIDENCE_TIERS[key.toUpperCase()];
        const items = EVIDENCE_ITEMS.filter(item => item.tier === tier.id);
        return (
          <View key={key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{tier.title}</Text>
              <Text style={styles.sectionDesc}>{tier.description}</Text>
            </View>
            {items.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onPress={() => toggleItem(item.id)}
              />
            ))}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => setSelectedItems([])}
      >
        <Text style={styles.resetButtonText}>Reset Evidence</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="dark-content" />
      {currentScreen === SCREENS.PREREQUISITES ? renderPrerequisites() : renderChecklist()}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A237E',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#5C6BC0',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  costContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  locationSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F0F2F9',
    borderRadius: 8,
    padding: 4,
  },
  locationBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  locationBtnActive: {
    backgroundColor: '#fff',
    elevation: 1,
  },
  locationBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  locationBtnTextActive: {
    color: '#1A237E',
  },
  costBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  costLabel: {
    color: '#666',
    fontSize: 14,
  },
  costValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    color: '#1A237E',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#1A237E',
    fontSize: 18,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#F0F2F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E4F0',
  },
  passportToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E4F0',
  },
  passportToggleActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#43A047',
  },
  passportToggleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  passportToggleTextActive: {
    color: '#fff',
  },
  sectionDivider: {
    marginBottom: 16,
    marginTop: 8,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5C6BC0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    marginTop: 4,
  },
  evidenceBtn: {
    backgroundColor: '#F0F2F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E4F0',
  },
  evidenceBtnActive: {
    backgroundColor: '#1A237E',
    borderColor: '#1A237E',
  },
  evidenceBtnText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  evidenceBtnTextActive: {
    color: '#fff',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E4F0',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  searchBar: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F9',
    fontSize: 14,
    color: '#333',
  },
  countryList: {
    paddingVertical: 4,
  },
  countryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F9',
  },
  countryText: {
    fontSize: 14,
    color: '#333',
  },
  noResultsText: {
    padding: 12,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1A237E',
    lineHeight: 20,
  },
  instructions: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  instructionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  nextButton: {
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  nextButtonDisabled: {
    backgroundColor: '#9FA8DA',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  warningText: {
    color: '#F44336',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#5C6BC0',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  resetButton: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
});
