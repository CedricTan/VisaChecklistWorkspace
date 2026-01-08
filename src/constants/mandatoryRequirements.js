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
    },
    {
        id: 'tb_test',
        label: 'TB Test (If applicable)',
        description: 'If you are applying from a country on the TB test list, do you have a valid certificate?',
        icon: 'medical-bag',
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
