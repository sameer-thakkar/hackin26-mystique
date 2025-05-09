export const COMPANY_DETAILS = {
  LEGAL_INFO: {
    ENTITY_NAME: 'Headout Inc.',
    ADDRESS: ['82 Nassau Street, #60351', 'New York, NY 10038', 'USA'],
    AUTH_REP: 'Uttam Garodia, Ekank Mehra',
    REG_NO: '5541011',
    TIN: '38-3933450',
  },
  LEGAL_NOTICE: {
    EMAIL_ADD: 'legal@headout.com',
    POSTAL_ADD: [
      'Legal Department',
      'Headout Inc.',
      '82 Nassau Street, #60351',
      'New York, NY 10038',
      'USA',
    ],
  },
  ODR_LINK: 'https://ec.europa.eu/consumers/odr',
};

export const LEGAL_INFO_FIELDS: {
  key: keyof typeof COMPANY_DETAILS.LEGAL_INFO;
  isArray?: boolean;
}[] = [
  { key: 'ENTITY_NAME' },
  { key: 'ADDRESS', isArray: true },
  { key: 'AUTH_REP' },
  { key: 'REG_NO' },
  { key: 'TIN' },
];

export const LEGAL_NOTICE_FIELDS: {
  key: keyof typeof COMPANY_DETAILS.LEGAL_NOTICE;
  isArray?: boolean;
  isLink?: boolean;
}[] = [
  { key: 'EMAIL_ADD', isLink: true },
  { key: 'POSTAL_ADD', isArray: true },
];
