export const EVIDENCE_TIERS = {
  TIER1: {
    id: 'tier1',
    title: 'Tier 1: Strong Evidence',
    points: 15,
    description: 'Official documents from organizations that conduct identity/address checks.',
  },
  TIER2: {
    id: 'tier2',
    title: 'Tier 2: Acceptable Evidence',
    points: 7,
    description: 'Dated domestic bills or receipts for joint purchases.',
  },
  TIER3: {
    id: 'tier3',
    title: 'Tier 3: Supporting Evidence',
    points: 3,
    description: 'Supplementary evidence that supports stronger documentation.',
  },
};

export const EVIDENCE_ITEMS = [
  // Tier 1
  {
    id: 'marriage_cert',
    tier: 'tier1',
    label: 'Marriage or Civil Partnership Certificate',
    icon: 'certificate',
  },
  {
    id: 'joint_mortgage_tenancy',
    tier: 'tier1',
    label: 'Joint Mortgage or Tenancy Agreement',
    icon: 'home',
  },
  {
    id: 'joint_utility_bills',
    tier: 'tier1',
    label: 'Joint Utility Bills (Gas, Water, Electric, Council Tax)',
    icon: 'lightning-bolt',
  },
  {
    id: 'joint_bank_statements',
    tier: 'tier1',
    label: 'Joint Bank Statements',
    icon: 'bank',
  },
  {
    id: 'official_correspondence',
    tier: 'tier1',
    label: 'Official Correspondence (NHS, HMRC, DVLA)',
    icon: 'mail',
  },
  // Tier 2
  {
    id: 'other_domestic_bills',
    tier: 'tier2',
    label: 'Other Domestic Bills (Vet, home repairs)',
    icon: 'file-document',
  },
  {
    id: 'joint_purchases',
    tier: 'tier2',
    label: 'Receipts for Significant Joint Purchases',
    icon: 'cart',
  },
  // Tier 3
  {
    id: 'letters_support',
    tier: 'tier3',
    label: 'Letters of Support (Friends/Family)',
    icon: 'account-group',
  },
  {
    id: 'written_statements',
    tier: 'tier3',
    label: 'Written Statements (Relationship History)',
    icon: 'fountain-pen-tip',
  },
  {
    id: 'photographs',
    tier: 'tier3',
    label: 'Photographs together',
    icon: 'camera',
  },
  {
    id: 'comms_records',
    tier: 'tier3',
    label: 'Communication Records (Chat logs, emails)',
    icon: 'chat',
  },
  {
    id: 'travel_history',
    tier: 'tier3',
    label: 'Travel History (Flight bookings, hotels)',
    icon: 'airplane',
  },
];
