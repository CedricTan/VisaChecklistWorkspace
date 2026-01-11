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
  ENGLISH_EVIDENCE_TYPES,
  ENGLISH_EXEMPT_COUNTRIES,
  SPONSOR_STATUS_OPTIONS
} from './src/constants/mandatoryRequirements';
import { COUNTRIES } from './src/constants/countries';
import ChecklistItem from './src/components/ChecklistItem';
import ScoreIndicator from './src/components/ScoreIndicator';
import MandatoryCard from './src/components/MandatoryCard';
import EvidenceDetailModal from './src/components/EvidenceDetailModal';
import DatePicker from './src/components/DatePicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const SCREENS = {
  LANDING: 'landing',
  PREREQUISITES: 'prerequisites',
  CHECKLIST: 'checklist',
  SUMMARY: 'summary',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LANDING);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mandatoryChecks, setMandatoryChecks] = useState([]);

  // Data Inputs
  const [location, setLocation] = useState('INSIDE_UK');
  const [sponsorStatus, setSponsorStatus] = useState('');
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
  const [isSponsorStatusPickOpen, setIsSponsorStatusPickOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Info Modal State
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEnglishPickerOpen, setIsEnglishPickerOpen] = useState(false);

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

    // Sponsor Age Check
    if (parseInt(sponsorAge) >= 18) ids.push('sponsor_age');

    // Applicant Age Check
    if (parseInt(applicantAge) >= 18) ids.push('applicant_age');

    // Sponsor Status Check
    if (sponsorStatus) ids.push('sponsor_status');

    // Financial Check
    const incomeValue = parseFloat(annualIncome) || 0;
    const savingsValue = parseFloat(cashSavings) || 0;
    const financialValid = incomeValue >= THRESHOLDS.MIN_INCOME || savingsValue >= THRESHOLDS.MIN_SAVINGS;
    if (financialValid) ids.push('financial_threshold');

    // Passport Check
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;

      let [d, m, y] = parts.map(Number);
      if (!d || !m || !y) return null;

      // Handle 2-digit years (e.g., '26' -> 2026)
      // Assume 2000s for anything 0-99
      if (y < 100) {
        y += 2000;
      }

      // Basic year range check
      if (y < 1900 || y > 2100) return null;

      const date = new Date(y, m - 1, d);

      // Validate the date is real (prevents rollover like Feb 30 -> March 2)
      if (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
      ) {
        return date;
      }
      return null;
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
    const isExemptCountry = ENGLISH_EXEMPT_COUNTRIES.some(c => c.toLowerCase() === residenceCountry.trim().toLowerCase());
    if (englishEvidence !== 'none' || isExemptCountry) {
      ids.push('english_language');
    } else if (parseInt(applicantAge) >= 65) {
      ids.push('english_language'); // Auto-exempt if 65+
    }

    return ids;
  }, [applicantAge, sponsorAge, sponsorStatus, annualIncome, cashSavings, passportExpiryDate, intendedAppDate, residenceCountry, tbTestCompleted, englishEvidence]);

  // Combine manual checks with auto-filled ones
  const allMandatoryCheckedIds = useMemo(() => {
    return Array.from(new Set([...mandatoryChecks, ...autoCheckedIds]));
  }, [mandatoryChecks, autoCheckedIds]);

  const handleDateChange = (text, setter) => {
    // Strip everything except numbers
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 10)}`;
    }

    setter(formatted);
  };

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

  const handleShowDetail = (item) => {
    setSelectedItemForDetail(item);
    setIsDetailModalVisible(true);
  };

  const exportToPDF = async () => {
    const selectedEvidence = EVIDENCE_ITEMS.filter(item => selectedItems.includes(item.id));
    const mandatoryCompleted = MANDATORY_REQUIREMENTS.filter(item => allMandatoryCheckedIds.includes(item.id));

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #1A237E; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 28px; color: #1A237E; margin: 0; font-weight: bold; }
            .subtitle { font-size: 16px; color: #5C6BC0; margin-top: 5px; }
            .score-box { background: #1A237E; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
            .score-value { font-size: 48px; font-weight: bold; }
            .section-title { font-size: 18px; font-weight: bold; color: #1A237E; border-bottom: 1px solid #E0E4F0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px; }
            .item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #F0F2F9; }
            .item-label { flex: 1; font-size: 14px; }
            .status { font-weight: bold; font-size: 14px; }
            .checked { color: #4CAF50; }
            .unchecked { color: #F44336; }
            .tier-badge { font-size: 10px; background: #E8EAF6; color: #1A237E; padding: 2px 8px; border-radius: 4px; margin-left: 10px; text-transform: uppercase; }
            .cost-box { background: #F8F9FE; border: 1px solid #E0E4F0; padding: 20px; border-radius: 12px; margin-top: 30px; }
            .cost-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total-row { border-top: 2px solid #1A237E; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; color: #1A237E; }
            .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">UK Partner Visa Checklist</h1>
            <p class="subtitle">Evidence Strength & Readiness Report</p>
          </div>

          <div class="score-box">
            <div class="subtitle">Relationship Strength Score</div>
            <div class="score-value">${score}%</div>
          </div>

          <div class="section-title">Mandatory Requirements</div>
          ${MANDATORY_REQUIREMENTS.map(item => {
      const isChecked = allMandatoryCheckedIds.includes(item.id);
      return `
              <div class="item">
                <span class="item-label">${item.label}</span>
                <span class="status ${isChecked ? 'checked' : 'unchecked'}">${isChecked ? '✓ VERIFIED' : '✗ MISSING'}</span>
              </div>
            `;
    }).join('')}

          <div class="section-title">Relationship Evidence</div>
          ${selectedEvidence.length > 0 ? selectedEvidence.map(item => `
            <div class="item">
              <span class="item-label">${item.label}</span>
              <span class="tier-badge">${EVIDENCE_TIERS[item.tier.toUpperCase()].title}</span>
            </div>
          `).join('') : '<p>No evidence selected.</p>'}

          <div class="cost-box">
            <div class="section-title" style="margin-top: 0; border: none;">Estimated Application Costs</div>
            <div class="cost-row">
              <span>Location</span>
              <span>${location === 'INSIDE_UK' ? 'Inside UK' : 'Outside UK'}</span>
            </div>
            <div class="cost-row">
              <span>Application Fee</span>
              <span>£${cost.fee.toLocaleString()}</span>
            </div>
            <div class="cost-row">
              <span>IHS Surcharge</span>
              <span>£${cost.ihs.toLocaleString()}</span>
            </div>
            <div class="cost-row total-row">
              <span>Total Estimated Cost</span>
              <span>£${(cost.fee + cost.ihs).toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} via VisaEvidence UK Prototype. Always consult GOV.UK for official rules.
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const allMandatoryChecked = allMandatoryCheckedIds.length === MANDATORY_REQUIREMENTS.length;

  const cost = COSTS[location];

  const renderInputSection = () => {
    const requiresTB = TB_COUNTRIES.some(c => c.toLowerCase() === residenceCountry.trim().toLowerCase());
    const isAnyDropdownOpen = isCountryPickerOpen || isSponsorStatusPickOpen || isEnglishPickerOpen;

    return (
      <View style={[styles.inputContainer, { zIndex: isAnyDropdownOpen ? 3000 : 1 }]}>
        <Text style={styles.inputSectionTitle}>Application Location</Text>
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

        {/* --- SPONSOR SECTION --- */}
        <View style={[styles.splitSection, { zIndex: isSponsorStatusPickOpen ? 3000 : 1 }]}>
          <Text style={styles.splitSectionHeader}>1. Sponsor's Details</Text>

          <View style={[styles.inputGroup, { zIndex: isSponsorStatusPickOpen ? 3000 : 1 }]}>
            <Text style={styles.inputLabel}>Sponsor Status in UK</Text>
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => setIsSponsorStatusPickOpen(!isSponsorStatusPickOpen)}
            >
              <Text style={{ color: sponsorStatus ? '#333' : '#999' }}>
                {SPONSOR_STATUS_OPTIONS.find(o => o.id === sponsorStatus)?.label || 'Select Status...'}
              </Text>
              <MaterialCommunityIcons
                name={isSponsorStatusPickOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
                style={{ position: 'absolute', right: 12, top: 12 }}
              />
            </TouchableOpacity>
            {isSponsorStatusPickOpen && (
              <View style={[styles.dropdownContainer, { zIndex: 3001 }]}>
                <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                  {SPONSOR_STATUS_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.id}
                      style={styles.countryItem}
                      onPress={() => {
                        setSponsorStatus(opt.id);
                        setIsSponsorStatusPickOpen(false);
                      }}
                    >
                      <Text style={styles.countryText}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
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
        </View>

        {/* --- APPLICANT SECTION --- */}
        <View style={[styles.splitSection, { zIndex: (isCountryPickerOpen || isEnglishPickerOpen) ? 2000 : 1 }]}>
          <Text style={styles.splitSectionHeader}>2. Applicant's Details</Text>

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

          <View style={[styles.inputGroup, { zIndex: isCountryPickerOpen ? 3000 : 1 }]}>
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

          <View style={{ marginTop: 12, marginBottom: 12, zIndex: -1 }}>
            {requiresTB && (
              <TouchableOpacity
                style={[styles.passportToggle, tbTestCompleted && styles.passportToggleActive, { marginTop: 0 }]}
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

          {/* Only show English evidence options if country is selected AND not exempt */}
          {
            residenceCountry && !ENGLISH_EXEMPT_COUNTRIES.some(c => c.toLowerCase() === residenceCountry.trim().toLowerCase()) && (
              <View style={{ marginTop: 12, zIndex: isEnglishPickerOpen ? 2000 : 1 }}>
                <Text style={styles.inputLabel}>English Language Evidence</Text>
                <View style={styles.inputGroup}>
                  <TouchableOpacity
                    style={styles.textInput}
                    onPress={() => setIsEnglishPickerOpen(!isEnglishPickerOpen)}
                  >
                    <Text style={{ color: englishEvidence !== 'none' ? '#333' : '#999' }}>
                      {ENGLISH_EVIDENCE_TYPES.find(t => t.id === englishEvidence)?.label || 'Select Evidence Type...'}
                    </Text>
                    <MaterialCommunityIcons
                      name={isEnglishPickerOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                      style={{ position: 'absolute', right: 12, top: 12 }}
                    />
                  </TouchableOpacity>

                  {isEnglishPickerOpen && (
                    <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
                      <ScrollView style={[styles.countryList, { maxHeight: 250 }]} nestedScrollEnabled>
                        {ENGLISH_EVIDENCE_TYPES.filter(t => t.id !== 'none').map(type => (
                          <TouchableOpacity
                            key={type.id}
                            style={styles.countryItem}
                            onPress={() => {
                              setEnglishEvidence(type.id);
                              setIsEnglishPickerOpen(false);
                            }}
                          >
                            <Text style={styles.countryText}>{type.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            )
          }

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Intended Application Date</Text>
              <DatePicker
                value={intendedAppDate}
                onChangeText={(text) => handleDateChange(text, setIntendedAppDate)}
                placeholder="DD/MM/YYYY"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Passport Expiry Date</Text>
              <DatePicker
                value={passportExpiryDate}
                onChangeText={(text) => handleDateChange(text, setPassportExpiryDate)}
                placeholder="DD/MM/YYYY"
              />
            </View>
          </View>
        </View>

      </View >
    );
  };


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

  const renderLandingScreen = () => (
    <View style={styles.landingContainer}>
      <View style={styles.landingContent}>
        <View style={styles.landingIconContainer}>
          <MaterialCommunityIcons name="shield-check" size={80} color="#fff" />
        </View>
        <Text style={styles.landingTitle}>UK Partner Visa</Text>
        <Text style={styles.landingSubtitle}>Evidence Strength Assessment</Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color="#C5CAE9" />
            <Text style={styles.featureText}>Verify Mandatory Prerequisites</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="trending-up" size={24} color="#C5CAE9" />
            <Text style={styles.featureText}>Calculate Application Strength</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color="#C5CAE9" />
            <Text style={styles.featureText}>Estimate Application & IHS Costs</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => setCurrentScreen(SCREENS.PREREQUISITES)}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#1A237E" />
        </TouchableOpacity>
      </View>
      <Text style={styles.versionText}>v1.1 Prototype</Text>
    </View>
  );

  const renderSummaryScreen = () => {
    const selectedEvidence = EVIDENCE_ITEMS.filter(item => selectedItems.includes(item.id));
    const mandatoryCompleted = MANDATORY_REQUIREMENTS.filter(item => allMandatoryCheckedIds.includes(item.id));

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen(SCREENS.CHECKLIST)}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#5C6BC0" />
          <Text style={styles.backButtonText}>Back to Checklist</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.appTitle}>Application Summary</Text>
          <Text style={styles.appSubtitle}>Review your readiness for the Home Office</Text>
        </View>

        <ScoreIndicator score={score} />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Mandatory Requirements</Text>
          {MANDATORY_REQUIREMENTS.map(item => (
            <View key={item.id} style={styles.summaryItem}>
              <MaterialCommunityIcons
                name={allMandatoryCheckedIds.includes(item.id) ? "check-circle" : "alert-circle"}
                size={20}
                color={allMandatoryCheckedIds.includes(item.id) ? "#4CAF50" : "#F44336"}
              />
              <Text style={[styles.summaryItemText, !allMandatoryCheckedIds.includes(item.id) && { color: '#F44336' }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Relationship Evidence Checklist</Text>
          {selectedEvidence.length > 0 ? (
            selectedEvidence.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <MaterialCommunityIcons name="file-document-outline" size={20} color="#1A237E" />
                <Text style={styles.summaryItemText}>{item.label}</Text>
                <View style={[styles.tierBadge, { backgroundColor: EVIDENCE_TIERS[item.tier.toUpperCase()].color + '20' }]}>
                  <Text style={[styles.tierBadgeText, { color: EVIDENCE_TIERS[item.tier.toUpperCase()].color }]}>
                    {EVIDENCE_TIERS[item.tier.toUpperCase()].title}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noEvidenceText}>No evidence selected yet.</Text>
          )}
        </View>

        <View style={styles.costSummaryCard}>
          <Text style={styles.costSummaryTitle}>Estimated Total Costs</Text>
          <Text style={styles.costSummaryAmount}>£{(cost.fee + cost.ihs).toLocaleString()}</Text>
          <Text style={styles.costSummarySub}>Based on {location === 'INSIDE_UK' ? 'Inside UK' : 'Outside UK'} application</Text>
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={exportToPDF}
        >
          <MaterialCommunityIcons name="file-pdf-box" size={24} color="#fff" />
          <Text style={styles.exportButtonText}>Export Checklist as PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setSelectedItems([]);
            setMandatoryChecks([]);
            setCurrentScreen(SCREENS.LANDING);
          }}
        >
          <Text style={styles.resetButtonText}>Start Fresh</Text>
        </TouchableOpacity>
      </ScrollView>
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
          <Text style={styles.appSubtitle}>Mandatory Requirements & Details</Text>
        </View>

        {renderInputSection()}

        <View style={styles.sectionDivider}>
          <Text style={styles.dividerText}>Mandatory Checklist (Read-only)</Text>
          <Text style={styles.dividerSubtext}>These items update automatically as you fill the form</Text>
        </View>

        <View style={styles.checklistSplit}>
          {/* Sponsor Checklist */}
          <View style={styles.checklistBox}>
            <Text style={styles.checklistSplitTitle}>Sponsor</Text>
            {MANDATORY_REQUIREMENTS.filter(i => i.type === 'sponsor').map(item => (
              <MandatoryCard
                key={item.id}
                item={item}
                isChecked={allMandatoryCheckedIds.includes(item.id)}
                onPress={() => toggleMandatory(item.id)}
              />
            ))}
          </View>

          {/* Applicant Checklist */}
          <View style={styles.checklistBox}>
            <Text style={styles.checklistSplitTitle}>Applicant</Text>
            {MANDATORY_REQUIREMENTS.filter(i => i.type === 'applicant').map(item => (
              <MandatoryCard
                key={item.id}
                item={item}
                isChecked={allMandatoryCheckedIds.includes(item.id)}
                onPress={() => toggleMandatory(item.id)}
              />
            ))}
          </View>
        </View>

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
                onInfoPress={handleShowDetail}
              />
            ))}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentScreen(SCREENS.SUMMARY)}
      >
        <Text style={styles.nextButtonText}>Review Summary</Text>
        <MaterialCommunityIcons name="clipboard-check" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => setSelectedItems([])}
      >
        <Text style={styles.resetButtonText}>Clear Selections</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="dark-content" />
      {currentScreen === SCREENS.LANDING && renderLandingScreen()}
      {currentScreen === SCREENS.PREREQUISITES && renderPrerequisites()}
      {currentScreen === SCREENS.CHECKLIST && renderChecklist()}
      {currentScreen === SCREENS.SUMMARY && renderSummaryScreen()}
      <EvidenceDetailModal
        item={selectedItemForDetail}
        isVisible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
      />
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
  splitSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E4F0',
  },
  splitSectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F9',
    paddingBottom: 8,
  },
  checklistSplit: {
    flexDirection: 'column', // Stack vertically on mobile, could be row on tablet
    gap: 16,
  },
  checklistBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  checklistSplitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5C6BC0',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  dividerSubtext: {
    fontSize: 12,
    color: '#7986CB',
    marginTop: 2,
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
    elevation: 5,
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
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
  // Landing Styles
  landingContainer: {
    flex: 1,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    padding: 30,
  },
  landingContent: {
    alignItems: 'center',
  },
  landingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#C5CAE9',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  featureList: {
    width: '100%',
    marginBottom: 50,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  getStartedText: {
    color: '#1A237E',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 10,
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  // Summary Styles
  summaryCard: {
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
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F9',
    paddingBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  summaryItemText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  noEvidenceText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  costSummaryCard: {
    backgroundColor: '#1A237E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  costSummaryTitle: {
    color: '#C5CAE9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  costSummaryAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
  },
  costSummarySub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
