export const MANDATORY_REQUIREMENTS = [
    {
        id: 'passport',
        label: 'Valid Passport',
        description: 'Do you and your partner have valid passports/travel documents?',
        icon: 'passport',
        autoCheckKey: 'passportValid',
    },
    {
        id: 'age_requirement',
        label: 'Age Requirement (18+)',
        description: 'Are both the applicant and the sponsor aged 18 or over?',
        icon: 'account-clock',
        autoCheckKey: 'ageValid',
    },
    {
        id: 'english_language',
        label: 'English Language Requirement',
        description: 'Can you prove you meet the English language requirement (e.g., A1 level test, degree in English, or exempt nationality)?',
        icon: 'translate',
        autoCheckKey: 'englishValid',
    },
    {
        id: 'tb_test',
        label: 'TB Test (If applicable)',
        description: 'If you are applying from a country on the TB test list, do you have a valid certificate?',
        icon: 'medical-bag',
        autoCheckKey: 'tbValid',
    },
    {
        id: 'financial_threshold',
        label: 'Financial Requirement',
        description: 'Do you meet the £29,000 income threshold or have £88,500 in savings?',
        icon: 'currency-gbp',
        isFinancial: true,
        autoCheckKey: 'financialValid',
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
