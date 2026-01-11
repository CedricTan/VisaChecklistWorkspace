export const SPONSOR_STATUS_OPTIONS = [
    { id: 'british_citizen', label: 'British Citizen' },
    { id: 'ilr', label: 'Indefinite Leave to Remain (ILR)' },
    { id: 'eu_settled', label: 'EU Settled Status' },
    { id: 'refugee', label: 'Refugee Status' },
    { id: 'protection', label: 'Humanitarian Protection' },
];

export const MANDATORY_REQUIREMENTS = [
    // Sponsor Requirements
    {
        id: 'sponsor_status',
        label: 'Sponsor Status',
        description: 'Does the sponsor have British Citizenship, ILR, or Settled Status?',
        icon: 'account-check',
        type: 'sponsor',
        autoCheckKey: 'sponsorStatusValid',
    },
    {
        id: 'sponsor_age',
        label: 'Sponsor Age (18+)',
        description: 'Is the sponsor aged 18 or over?',
        icon: 'numeric-1-box',
        type: 'sponsor',
        autoCheckKey: 'sponsorAgeValid',
    },
    {
        id: 'financial_threshold',
        label: 'Financial Requirement',
        description: 'Do you meet the £29,000 income threshold or have £88,500 in savings?',
        icon: 'currency-gbp',
        isFinancial: true,
        type: 'sponsor',
        autoCheckKey: 'financialValid',
    },

    // Applicant Requirements
    {
        id: 'applicant_age',
        label: 'Applicant Age (18+)',
        description: 'Is the applicant aged 18 or over?',
        icon: 'numeric-2-box',
        type: 'applicant',
        autoCheckKey: 'applicantAgeValid',
    },
    {
        id: 'passport',
        label: 'Valid Passport',
        description: 'Does the applicant have a valid passport?',
        icon: 'passport',
        type: 'applicant',
        autoCheckKey: 'passportValid',
    },
    {
        id: 'english_language',
        label: 'English Language',
        description: 'Can you prove you meet the English language requirement?',
        icon: 'translate',
        type: 'applicant',
        autoCheckKey: 'englishValid',
    },
    {
        id: 'tb_test',
        label: 'TB Test',
        description: 'If applicable, has the TB test certificate been obtained?',
        icon: 'medical-bag',
        type: 'applicant',
        autoCheckKey: 'tbValid',
    },
];

export const FINANCIAL_STATUS = {
    INCOME: 'income',
    SAVINGS: 'savings',
    BOTH: 'both',
    EXEMPT: 'exempt',
    NONE: 'none',
};

export const THRESHOLDS = {
    MIN_INCOME: 29000,
    MIN_SAVINGS: 88500,
    SAVINGS_BASE: 16000,
};

export const COSTS = {
    INSIDE_UK: {
        label: 'Inside UK',
        fee: 1321,
        ihs: 2587.50,
    },
    OUTSIDE_UK: {
        label: 'Outside UK',
        fee: 1938,
        ihs: 3105.00,
    },
};

export const TB_COUNTRIES = [
    'Afghanistan', 'Algeria', 'Angola', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Benin', 'Bhutan',
    'Bolivia', 'Botswana', 'Brunei', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde',
    'Central African Republic', 'Chad', 'China', 'Congo', 'Côte d’Ivoire', 'DR Congo', 'Djibouti',
    'Dominican Republic', 'Ecuador', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
    'Gambia', 'Georgia', 'Ghana', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Hong Kong',
    'India', 'Indonesia', 'Iraq', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (North)', 'Korea (South)',
    'Kyrgyzstan', 'La Laos', 'Lesotho', 'Liberia', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Mali',
    'Marshall Islands', 'Mauritania', 'Micronesia', 'Moldova', 'Mongolia', 'Morocco', 'Mozambique',
    'Namibia', 'Nepal', 'Niger', 'Nigeria', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay',
    'Peru', 'Philippines', 'Russia', 'Rwanda', 'São Tomé and Principe', 'Senegal', 'Sierra Leone',
    'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan', 'Suriname',
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Turkmenistan', 'Tuvalu', 'Uganda',
    'Ukraine', 'Uzbekistan', 'Vanuatu', 'Vietnam', 'Zambia', 'Zimbabwe'
];

export const ENGLISH_EVIDENCE_TYPES = [
    { id: 'none', label: 'Select Evidence Type...' },
    { id: 'selt', label: 'Approved English Test (SELT)' },
    { id: 'degree_uk', label: 'UK University Degree' },
    { id: 'degree_int', label: 'International Degree (with Ecctis)' },
    { id: 'nationality', label: 'Exempt Nationality' },
    { id: 'age_exemption', label: 'Exemption (Age 65+)' },
    { id: 'medical_exemption', label: 'Exemption (Medical)' },
    { id: 'other', label: 'Other/Manual' },
];

export const ENGLISH_EXEMPT_COUNTRIES = [
    'Antigua and Barbuda', 'Australia', 'Bahamas', 'Barbados', 'Belize',
    'British Overseas Territories', 'Canada', 'Dominica', 'Grenada', 'Guyana',
    'Ireland', 'Jamaica', 'Malta', 'New Zealand', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago',
    'United States of America'
];
