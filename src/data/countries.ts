export type Country = {
  /**
   * Short name of the country, in English
   */
  shortName: string
  /**
   * Alias, if the short name is too cumbersume
   */
  alias?: string
  /**
   * Short name of the country, in French
   * Example: "Norvège (la)"
   */
  shortNameFR: string
  /**
   * Two-letter ISO code for the country.
   * Example: "NO"
   */
  countrycode: string
  /**
   * Three-letter ISO code for the country.
   * Example: "NOR"
   */
  countryCode3: string
  /**
   * Numeric country idenitifier
   * Example: 578
   */
  numeric: number
}
/**
 * @source https://www.iso.org/obp/ui/#search
 */
export const countries: Readonly<Country[]> = [
  {
    shortName: 'Afghanistan',
    shortNameFR: "Afghanistan (l')",
    countrycode: 'AF',
    countryCode3: 'AFG',
    numeric: 4,
  },
  {
    shortName: 'Albania',
    shortNameFR: "Albanie (l')",
    countrycode: 'AL',
    countryCode3: 'ALB',
    numeric: 8,
  },
  {
    shortName: 'Algeria',
    shortNameFR: "Algérie (l')",
    countrycode: 'DZ',
    countryCode3: 'DZA',
    numeric: 12,
  },
  {
    shortName: 'American Samoa',
    shortNameFR: 'Samoa américaines (les)',
    countrycode: 'AS',
    countryCode3: 'ASM',
    numeric: 16,
  },
  {
    shortName: 'Andorra',
    shortNameFR: "Andorre (l')",
    countrycode: 'AD',
    countryCode3: 'AND',
    numeric: 20,
  },
  {
    shortName: 'Angola',
    shortNameFR: "Angola (l')",
    countrycode: 'AO',
    countryCode3: 'AGO',
    numeric: 24,
  },
  {
    shortName: 'Anguilla',
    shortNameFR: 'Anguilla',
    countrycode: 'AI',
    countryCode3: 'AIA',
    numeric: 660,
  },
  {
    shortName: 'Antarctica',
    shortNameFR: "Antarctique (l')",
    countrycode: 'AQ',
    countryCode3: 'ATA',
    numeric: 10,
  },
  {
    shortName: 'Antigua and Barbuda',
    shortNameFR: 'Antigua-et-Barbuda',
    countrycode: 'AG',
    countryCode3: 'ATG',
    numeric: 28,
  },
  {
    shortName: 'Argentina',
    shortNameFR: "Argentine (l')",
    countrycode: 'AR',
    countryCode3: 'ARG',
    numeric: 32,
  },
  {
    shortName: 'Armenia',
    shortNameFR: "Arménie (l')",
    countrycode: 'AM',
    countryCode3: 'ARM',
    numeric: 51,
  },
  {
    shortName: 'Aruba',
    shortNameFR: 'Aruba',
    countrycode: 'AW',
    countryCode3: 'ABW',
    numeric: 533,
  },
  {
    shortName: 'Australia',
    shortNameFR: "Australie (l')",
    countrycode: 'AU',
    countryCode3: 'AUS',
    numeric: 36,
  },
  {
    shortName: 'Austria',
    shortNameFR: "Autriche (l')",
    countrycode: 'AT',
    countryCode3: 'AUT',
    numeric: 40,
  },
  {
    shortName: 'Azerbaijan',
    shortNameFR: "Azerbaïdjan (l')",
    countrycode: 'AZ',
    countryCode3: 'AZE',
    numeric: 31,
  },
  {
    shortName: 'Bahamas (the)',
    shortNameFR: 'Bahamas (les)',
    countrycode: 'BS',
    countryCode3: 'BHS',
    numeric: 44,
  },
  {
    shortName: 'Bahrain',
    shortNameFR: 'Bahreïn',
    countrycode: 'BH',
    countryCode3: 'BHR',
    numeric: 48,
  },
  {
    shortName: 'Bangladesh',
    shortNameFR: 'Bangladesh (le)',
    countrycode: 'BD',
    countryCode3: 'BGD',
    numeric: 50,
  },
  {
    shortName: 'Barbados',
    shortNameFR: 'Barbade (la)',
    countrycode: 'BB',
    countryCode3: 'BRB',
    numeric: 52,
  },
  {
    shortName: 'Belarus',
    shortNameFR: 'Bélarus (le)',
    countrycode: 'BY',
    countryCode3: 'BLR',
    numeric: 112,
  },
  {
    shortName: 'Belgium',
    shortNameFR: 'Belgique (la)',
    countrycode: 'BE',
    countryCode3: 'BEL',
    numeric: 56,
  },
  {
    shortName: 'Belize',
    shortNameFR: 'Belize (le)',
    countrycode: 'BZ',
    countryCode3: 'BLZ',
    numeric: 84,
  },
  {
    shortName: 'Benin',
    shortNameFR: 'Bénin (le)',
    countrycode: 'BJ',
    countryCode3: 'BEN',
    numeric: 204,
  },
  {
    shortName: 'Bermuda',
    shortNameFR: 'Bermudes (les)',
    countrycode: 'BM',
    countryCode3: 'BMU',
    numeric: 60,
  },
  {
    shortName: 'Bhutan',
    shortNameFR: 'Bhoutan (le)',
    countrycode: 'BT',
    countryCode3: 'BTN',
    numeric: 64,
  },
  {
    shortName: 'Bolivia (Plurinational State of)',
    shortNameFR: 'Bolivie (État plurinational de)',
    countrycode: 'BO',
    countryCode3: 'BOL',
    numeric: 68,
  },
  {
    shortName: 'Bonaire, Sint Eustatius and Saba',
    shortNameFR: 'Bonaire, Saint-Eustache et Saba',
    countrycode: 'BQ',
    countryCode3: 'BES',
    numeric: 535,
  },
  {
    shortName: 'Bosnia and Herzegovina',
    shortNameFR: 'Bosnie-Herzégovine (la)',
    countrycode: 'BA',
    countryCode3: 'BIH',
    numeric: 70,
  },
  {
    shortName: 'Botswana',
    shortNameFR: 'Botswana (le)',
    countrycode: 'BW',
    countryCode3: 'BWA',
    numeric: 72,
  },
  {
    shortName: 'Bouvet Island',
    shortNameFR: "Bouvet (l'Île)",
    countrycode: 'BV',
    countryCode3: 'BVT',
    numeric: 74,
  },
  {
    shortName: 'Brazil',
    shortNameFR: 'Brésil (le)',
    countrycode: 'BR',
    countryCode3: 'BRA',
    numeric: 76,
  },
  {
    shortName: 'British Indian Ocean Territory (the)',
    shortNameFR: "Indien (le Territoire britannique de l'océan)",
    countrycode: 'IO',
    countryCode3: 'IOT',
    numeric: 86,
  },
  {
    shortName: 'Brunei Darussalam',
    shortNameFR: 'Brunéi Darussalam (le)',
    countrycode: 'BN',
    countryCode3: 'BRN',
    numeric: 96,
  },
  {
    shortName: 'Bulgaria',
    shortNameFR: 'Bulgarie (la)',
    countrycode: 'BG',
    countryCode3: 'BGR',
    numeric: 100,
  },
  {
    shortName: 'Burkina Faso',
    shortNameFR: 'Burkina Faso (le)',
    countrycode: 'BF',
    countryCode3: 'BFA',
    numeric: 854,
  },
  {
    shortName: 'Burundi',
    shortNameFR: 'Burundi (le)',
    countrycode: 'BI',
    countryCode3: 'BDI',
    numeric: 108,
  },
  {
    shortName: 'Cabo Verde',
    shortNameFR: 'Cabo Verde',
    countrycode: 'CV',
    countryCode3: 'CPV',
    numeric: 132,
  },
  {
    shortName: 'Cambodia',
    shortNameFR: 'Cambodge (le)',
    countrycode: 'KH',
    countryCode3: 'KHM',
    numeric: 116,
  },
  {
    shortName: 'Cameroon',
    shortNameFR: 'Cameroun (le)',
    countrycode: 'CM',
    countryCode3: 'CMR',
    numeric: 120,
  },
  {
    shortName: 'Canada',
    shortNameFR: 'Canada (le)',
    countrycode: 'CA',
    countryCode3: 'CAN',
    numeric: 124,
  },
  {
    shortName: 'Cayman Islands (the)',
    shortNameFR: 'Caïmans (les Îles)',
    countrycode: 'KY',
    countryCode3: 'CYM',
    numeric: 136,
  },
  {
    shortName: 'Central African Republic (the)',
    shortNameFR: 'République centrafricaine (la)',
    countrycode: 'CF',
    countryCode3: 'CAF',
    numeric: 140,
  },
  {
    shortName: 'Chad',
    shortNameFR: 'Tchad (le)',
    countrycode: 'TD',
    countryCode3: 'TCD',
    numeric: 148,
  },
  {
    shortName: 'Chile',
    shortNameFR: 'Chili (le)',
    countrycode: 'CL',
    countryCode3: 'CHL',
    numeric: 152,
  },
  {
    shortName: 'China',
    shortNameFR: 'Chine (la)',
    countrycode: 'CN',
    countryCode3: 'CHN',
    numeric: 156,
  },
  {
    shortName: 'Christmas Island',
    shortNameFR: "Christmas (l'Île)",
    countrycode: 'CX',
    countryCode3: 'CXR',
    numeric: 162,
  },
  {
    shortName: 'Cocos (Keeling) Islands (the)',
    shortNameFR: 'Cocos (les Îles)/ Keeling (les Îles)',
    countrycode: 'CC',
    countryCode3: 'CCK',
    numeric: 166,
  },
  {
    shortName: 'Colombia',
    shortNameFR: 'Colombie (la)',
    countrycode: 'CO',
    countryCode3: 'COL',
    numeric: 170,
  },
  {
    shortName: 'Comoros (the)',
    shortNameFR: 'Comores (les)',
    countrycode: 'KM',
    countryCode3: 'COM',
    numeric: 174,
  },
  {
    shortName: 'Congo (the Democratic Republic of the)',
    shortNameFR: 'Congo (la République démocratique du)',
    countrycode: 'CD',
    countryCode3: 'COD',
    numeric: 180,
  },
  {
    shortName: 'Congo (the)',
    shortNameFR: 'Congo (le)',
    countrycode: 'CG',
    countryCode3: 'COG',
    numeric: 178,
  },
  {
    shortName: 'Cook Islands (the)',
    shortNameFR: 'Cook (les Îles)',
    countrycode: 'CK',
    countryCode3: 'COK',
    numeric: 184,
  },
  {
    shortName: 'Costa Rica',
    shortNameFR: 'Costa Rica (le)',
    countrycode: 'CR',
    countryCode3: 'CRI',
    numeric: 188,
  },
  {
    shortName: 'Croatia',
    shortNameFR: 'Croatie (la)',
    countrycode: 'HR',
    countryCode3: 'HRV',
    numeric: 191,
  },
  {
    shortName: 'Cuba',
    shortNameFR: 'Cuba',
    countrycode: 'CU',
    countryCode3: 'CUB',
    numeric: 192,
  },
  {
    shortName: 'Curaçao',
    shortNameFR: 'Curaçao',
    countrycode: 'CW',
    countryCode3: 'CUW',
    numeric: 531,
  },
  {
    shortName: 'Cyprus',
    shortNameFR: 'Chypre',
    countrycode: 'CY',
    countryCode3: 'CYP',
    numeric: 196,
  },
  {
    shortName: 'Czechia',
    shortNameFR: 'Tchéquie (la)',
    countrycode: 'CZ',
    countryCode3: 'CZE',
    numeric: 203,
  },
  {
    shortName: "Côte d'Ivoire",
    shortNameFR: "Côte d'Ivoire (la)",
    countrycode: 'CI',
    countryCode3: 'CIV',
    numeric: 384,
  },
  {
    shortName: 'Denmark',
    shortNameFR: 'Danemark (le)',
    countrycode: 'DK',
    countryCode3: 'DNK',
    numeric: 208,
  },
  {
    shortName: 'Djibouti',
    shortNameFR: 'Djibouti',
    countrycode: 'DJ',
    countryCode3: 'DJI',
    numeric: 262,
  },
  {
    shortName: 'Dominica',
    shortNameFR: 'Dominique (la)',
    countrycode: 'DM',
    countryCode3: 'DMA',
    numeric: 212,
  },
  {
    shortName: 'Dominican Republic (the)',
    shortNameFR: 'dominicaine (la République)',
    countrycode: 'DO',
    countryCode3: 'DOM',
    numeric: 214,
  },
  {
    shortName: 'Ecuador',
    shortNameFR: "Équateur (l')",
    countrycode: 'EC',
    countryCode3: 'ECU',
    numeric: 218,
  },
  {
    shortName: 'Egypt',
    shortNameFR: "Égypte (l')",
    countrycode: 'EG',
    countryCode3: 'EGY',
    numeric: 818,
  },
  {
    shortName: 'El Salvador',
    shortNameFR: 'El Salvador',
    countrycode: 'SV',
    countryCode3: 'SLV',
    numeric: 222,
  },
  {
    shortName: 'Equatorial Guinea',
    shortNameFR: 'Guinée équatoriale (la)',
    countrycode: 'GQ',
    countryCode3: 'GNQ',
    numeric: 226,
  },
  {
    shortName: 'Eritrea',
    shortNameFR: "Érythrée (l')",
    countrycode: 'ER',
    countryCode3: 'ERI',
    numeric: 232,
  },
  {
    shortName: 'Estonia',
    shortNameFR: "Estonie (l')",
    countrycode: 'EE',
    countryCode3: 'EST',
    numeric: 233,
  },
  {
    shortName: 'Eswatini',
    shortNameFR: "Eswatini (l')",
    countrycode: 'SZ',
    countryCode3: 'SWZ',
    numeric: 748,
  },
  {
    shortName: 'Ethiopia',
    shortNameFR: "Éthiopie (l')",
    countrycode: 'ET',
    countryCode3: 'ETH',
    numeric: 231,
  },
  {
    shortName: 'Falkland Islands (the) [Malvinas]',
    shortNameFR: 'Falkland (les Îles)/Malouines (les Îles)',
    countrycode: 'FK',
    countryCode3: 'FLK',
    numeric: 238,
  },
  {
    shortName: 'Faroe Islands (the)',
    shortNameFR: 'Féroé (les Îles)',
    countrycode: 'FO',
    countryCode3: 'FRO',
    numeric: 234,
  },
  {
    shortName: 'Fiji',
    shortNameFR: 'Fidji (les)',
    countrycode: 'FJ',
    countryCode3: 'FJI',
    numeric: 242,
  },
  {
    shortName: 'Finland',
    shortNameFR: 'Finlande (la)',
    countrycode: 'FI',
    countryCode3: 'FIN',
    numeric: 246,
  },
  {
    shortName: 'France',
    shortNameFR: 'France (la)',
    countrycode: 'FR',
    countryCode3: 'FRA',
    numeric: 250,
  },
  {
    shortName: 'French Guiana',
    shortNameFR: 'Guyane française (la )',
    countrycode: 'GF',
    countryCode3: 'GUF',
    numeric: 254,
  },
  {
    shortName: 'French Polynesia',
    shortNameFR: 'Polynésie française (la)',
    countrycode: 'PF',
    countryCode3: 'PYF',
    numeric: 258,
  },
  {
    shortName: 'French Southern Territories (the)',
    shortNameFR: 'Terres australes françaises (les)',
    countrycode: 'TF',
    countryCode3: 'ATF',
    numeric: 260,
  },
  {
    shortName: 'Gabon',
    shortNameFR: 'Gabon (le)',
    countrycode: 'GA',
    countryCode3: 'GAB',
    numeric: 266,
  },
  {
    shortName: 'Gambia (the)',
    shortNameFR: 'Gambie (la)',
    countrycode: 'GM',
    countryCode3: 'GMB',
    numeric: 270,
  },
  {
    shortName: 'Georgia',
    shortNameFR: 'Géorgie (la)',
    countrycode: 'GE',
    countryCode3: 'GEO',
    numeric: 268,
  },
  {
    shortName: 'Germany',
    shortNameFR: "Allemagne (l')",
    countrycode: 'DE',
    countryCode3: 'DEU',
    numeric: 276,
  },
  {
    shortName: 'Ghana',
    shortNameFR: 'Ghana (le)',
    countrycode: 'GH',
    countryCode3: 'GHA',
    numeric: 288,
  },
  {
    shortName: 'Gibraltar',
    shortNameFR: 'Gibraltar',
    countrycode: 'GI',
    countryCode3: 'GIB',
    numeric: 292,
  },
  {
    shortName: 'Greece',
    shortNameFR: 'Grèce (la)',
    countrycode: 'GR',
    countryCode3: 'GRC',
    numeric: 300,
  },
  {
    shortName: 'Greenland',
    shortNameFR: 'Groenland (le)',
    countrycode: 'GL',
    countryCode3: 'GRL',
    numeric: 304,
  },
  {
    shortName: 'Grenada',
    shortNameFR: 'Grenade (la)',
    countrycode: 'GD',
    countryCode3: 'GRD',
    numeric: 308,
  },
  {
    shortName: 'Guadeloupe',
    shortNameFR: 'Guadeloupe (la)',
    countrycode: 'GP',
    countryCode3: 'GLP',
    numeric: 312,
  },
  {
    shortName: 'Guam',
    shortNameFR: 'Guam',
    countrycode: 'GU',
    countryCode3: 'GUM',
    numeric: 316,
  },
  {
    shortName: 'Guatemala',
    shortNameFR: 'Guatemala (le)',
    countrycode: 'GT',
    countryCode3: 'GTM',
    numeric: 320,
  },
  {
    shortName: 'Guernsey',
    shortNameFR: 'Guernesey',
    countrycode: 'GG',
    countryCode3: 'GGY',
    numeric: 831,
  },
  {
    shortName: 'Guinea',
    shortNameFR: 'Guinée (la)',
    countrycode: 'GN',
    countryCode3: 'GIN',
    numeric: 324,
  },
  {
    shortName: 'Guinea-Bissau',
    shortNameFR: 'Guinée-Bissau (la)',
    countrycode: 'GW',
    countryCode3: 'GNB',
    numeric: 624,
  },
  {
    shortName: 'Guyana',
    shortNameFR: 'Guyana (le)',
    countrycode: 'GY',
    countryCode3: 'GUY',
    numeric: 328,
  },
  {
    shortName: 'Haiti',
    shortNameFR: 'Haïti',
    countrycode: 'HT',
    countryCode3: 'HTI',
    numeric: 332,
  },
  {
    shortName: 'Heard Island and McDonald Islands',
    shortNameFR: "Heard-et-Îles MacDonald (l'Île)",
    countrycode: 'HM',
    countryCode3: 'HMD',
    numeric: 334,
  },
  {
    shortName: 'Holy See (the)',
    shortNameFR: 'Saint-Siège (le)',
    countrycode: 'VA',
    countryCode3: 'VAT',
    numeric: 336,
  },
  {
    shortName: 'Honduras',
    shortNameFR: 'Honduras (le)',
    countrycode: 'HN',
    countryCode3: 'HND',
    numeric: 340,
  },
  {
    shortName: 'Hong Kong',
    shortNameFR: 'Hong Kong',
    countrycode: 'HK',
    countryCode3: 'HKG',
    numeric: 344,
  },
  {
    shortName: 'Hungary',
    shortNameFR: 'Hongrie (la)',
    countrycode: 'HU',
    countryCode3: 'HUN',
    numeric: 348,
  },
  {
    shortName: 'Iceland',
    shortNameFR: "Islande (l')",
    countrycode: 'IS',
    countryCode3: 'ISL',
    numeric: 352,
  },
  {
    shortName: 'India',
    shortNameFR: "Inde (l')",
    countrycode: 'IN',
    countryCode3: 'IND',
    numeric: 356,
  },
  {
    shortName: 'Indonesia',
    shortNameFR: "Indonésie (l')",
    countrycode: 'ID',
    countryCode3: 'IDN',
    numeric: 360,
  },
  {
    shortName: 'Iran (Islamic Republic of)',
    shortNameFR: "Iran (République Islamique d')",
    countrycode: 'IR',
    countryCode3: 'IRN',
    numeric: 364,
  },
  {
    shortName: 'Iraq',
    shortNameFR: "Iraq (l')",
    countrycode: 'IQ',
    countryCode3: 'IRQ',
    numeric: 368,
  },
  {
    shortName: 'Ireland',
    shortNameFR: "Irlande (l')",
    countrycode: 'IE',
    countryCode3: 'IRL',
    numeric: 372,
  },
  {
    shortName: 'Isle of Man',
    shortNameFR: 'Île de Man',
    countrycode: 'IM',
    countryCode3: 'IMN',
    numeric: 833,
  },
  {
    shortName: 'Israel',
    shortNameFR: 'Israël',
    countrycode: 'IL',
    countryCode3: 'ISR',
    numeric: 376,
  },
  {
    shortName: 'Italy',
    shortNameFR: "Italie (l')",
    countrycode: 'IT',
    countryCode3: 'ITA',
    numeric: 380,
  },
  {
    shortName: 'Jamaica',
    shortNameFR: 'Jamaïque (la)',
    countrycode: 'JM',
    countryCode3: 'JAM',
    numeric: 388,
  },
  {
    shortName: 'Japan',
    shortNameFR: 'Japon (le)',
    countrycode: 'JP',
    countryCode3: 'JPN',
    numeric: 392,
  },
  {
    shortName: 'Jersey',
    shortNameFR: 'Jersey',
    countrycode: 'JE',
    countryCode3: 'JEY',
    numeric: 832,
  },
  {
    shortName: 'Jordan',
    shortNameFR: 'Jordanie (la)',
    countrycode: 'JO',
    countryCode3: 'JOR',
    numeric: 400,
  },
  {
    shortName: 'Kazakhstan',
    shortNameFR: 'Kazakhstan (le)',
    countrycode: 'KZ',
    countryCode3: 'KAZ',
    numeric: 398,
  },
  {
    shortName: 'Kenya',
    shortNameFR: 'Kenya (le)',
    countrycode: 'KE',
    countryCode3: 'KEN',
    numeric: 404,
  },
  {
    shortName: 'Kiribati',
    shortNameFR: 'Kiribati',
    countrycode: 'KI',
    countryCode3: 'KIR',
    numeric: 296,
  },
  {
    shortName: "Korea (the Democratic People's Republic of)",
    shortNameFR: 'Corée (la République populaire démocratique de)',
    countrycode: 'KP',
    countryCode3: 'PRK',
    numeric: 408,
  },
  {
    shortName: 'Korea (the Republic of)',
    shortNameFR: 'Corée (la République de)',
    countrycode: 'KR',
    countryCode3: 'KOR',
    numeric: 410,
  },
  {
    shortName: 'Kuwait',
    shortNameFR: 'Koweït (le)',
    countrycode: 'KW',
    countryCode3: 'KWT',
    numeric: 414,
  },
  {
    shortName: 'Kyrgyzstan',
    shortNameFR: 'Kirghizistan (le)',
    countrycode: 'KG',
    countryCode3: 'KGZ',
    numeric: 417,
  },
  {
    shortName: "Lao People's Democratic Republic (the)",
    shortNameFR: 'Lao (la République démocratique populaire)',
    countrycode: 'LA',
    countryCode3: 'LAO',
    numeric: 418,
  },
  {
    shortName: 'Latvia',
    shortNameFR: 'Lettonie (la)',
    countrycode: 'LV',
    countryCode3: 'LVA',
    numeric: 428,
  },
  {
    shortName: 'Lebanon',
    shortNameFR: 'Liban (le)',
    countrycode: 'LB',
    countryCode3: 'LBN',
    numeric: 422,
  },
  {
    shortName: 'Lesotho',
    shortNameFR: 'Lesotho (le)',
    countrycode: 'LS',
    countryCode3: 'LSO',
    numeric: 426,
  },
  {
    shortName: 'Liberia',
    shortNameFR: 'Libéria (le)',
    countrycode: 'LR',
    countryCode3: 'LBR',
    numeric: 430,
  },
  {
    shortName: 'Libya',
    shortNameFR: 'Libye (la)',
    countrycode: 'LY',
    countryCode3: 'LBY',
    numeric: 434,
  },
  {
    shortName: 'Liechtenstein',
    shortNameFR: 'Liechtenstein (le)',
    countrycode: 'LI',
    countryCode3: 'LIE',
    numeric: 438,
  },
  {
    shortName: 'Lithuania',
    shortNameFR: 'Lituanie (la)',
    countrycode: 'LT',
    countryCode3: 'LTU',
    numeric: 440,
  },
  {
    shortName: 'Luxembourg',
    shortNameFR: 'Luxembourg (le)',
    countrycode: 'LU',
    countryCode3: 'LUX',
    numeric: 442,
  },
  {
    shortName: 'Macao',
    shortNameFR: 'Macao',
    countrycode: 'MO',
    countryCode3: 'MAC',
    numeric: 446,
  },
  {
    shortName: 'Madagascar',
    shortNameFR: 'Madagascar',
    countrycode: 'MG',
    countryCode3: 'MDG',
    numeric: 450,
  },
  {
    shortName: 'Malawi',
    shortNameFR: 'Malawi (le)',
    countrycode: 'MW',
    countryCode3: 'MWI',
    numeric: 454,
  },
  {
    shortName: 'Malaysia',
    shortNameFR: 'Malaisie (la)',
    countrycode: 'MY',
    countryCode3: 'MYS',
    numeric: 458,
  },
  {
    shortName: 'Maldives',
    shortNameFR: 'Maldives (les)',
    countrycode: 'MV',
    countryCode3: 'MDV',
    numeric: 462,
  },
  {
    shortName: 'Mali',
    shortNameFR: 'Mali (le)',
    countrycode: 'ML',
    countryCode3: 'MLI',
    numeric: 466,
  },
  {
    shortName: 'Malta',
    shortNameFR: 'Malte',
    countrycode: 'MT',
    countryCode3: 'MLT',
    numeric: 470,
  },
  {
    shortName: 'Marshall Islands (the)',
    shortNameFR: 'Marshall (les Îles)',
    countrycode: 'MH',
    countryCode3: 'MHL',
    numeric: 584,
  },
  {
    shortName: 'Martinique',
    shortNameFR: 'Martinique (la)',
    countrycode: 'MQ',
    countryCode3: 'MTQ',
    numeric: 474,
  },
  {
    shortName: 'Mauritania',
    shortNameFR: 'Mauritanie (la)',
    countrycode: 'MR',
    countryCode3: 'MRT',
    numeric: 478,
  },
  {
    shortName: 'Mauritius',
    shortNameFR: 'Maurice',
    countrycode: 'MU',
    countryCode3: 'MUS',
    numeric: 480,
  },
  {
    shortName: 'Mayotte',
    shortNameFR: 'Mayotte',
    countrycode: 'YT',
    countryCode3: 'MYT',
    numeric: 175,
  },
  {
    shortName: 'Mexico',
    shortNameFR: 'Mexique (le)',
    countrycode: 'MX',
    countryCode3: 'MEX',
    numeric: 484,
  },
  {
    shortName: 'Micronesia (Federated States of)',
    shortNameFR: 'Micronésie (États fédérés de)',
    countrycode: 'FM',
    countryCode3: 'FSM',
    numeric: 583,
  },
  {
    shortName: 'Moldova (the Republic of)',
    shortNameFR: 'Moldova (la République de)',
    countrycode: 'MD',
    countryCode3: 'MDA',
    numeric: 498,
  },
  {
    shortName: 'Monaco',
    shortNameFR: 'Monaco',
    countrycode: 'MC',
    countryCode3: 'MCO',
    numeric: 492,
  },
  {
    shortName: 'Mongolia',
    shortNameFR: 'Mongolie (la)',
    countrycode: 'MN',
    countryCode3: 'MNG',
    numeric: 496,
  },
  {
    shortName: 'Montenegro',
    shortNameFR: 'Monténégro (le)',
    countrycode: 'ME',
    countryCode3: 'MNE',
    numeric: 499,
  },
  {
    shortName: 'Montserrat',
    shortNameFR: 'Montserrat',
    countrycode: 'MS',
    countryCode3: 'MSR',
    numeric: 500,
  },
  {
    shortName: 'Morocco',
    shortNameFR: 'Maroc (le)',
    countrycode: 'MA',
    countryCode3: 'MAR',
    numeric: 504,
  },
  {
    shortName: 'Mozambique',
    shortNameFR: 'Mozambique (le)',
    countrycode: 'MZ',
    countryCode3: 'MOZ',
    numeric: 508,
  },
  {
    shortName: 'Myanmar',
    shortNameFR: 'Myanmar (le)',
    countrycode: 'MM',
    countryCode3: 'MMR',
    numeric: 104,
  },
  {
    shortName: 'Namibia',
    shortNameFR: 'Namibie (la)',
    countrycode: 'NA',
    countryCode3: 'NAM',
    numeric: 516,
  },
  {
    shortName: 'Nauru',
    shortNameFR: 'Nauru',
    countrycode: 'NR',
    countryCode3: 'NRU',
    numeric: 520,
  },
  {
    shortName: 'Nepal',
    shortNameFR: 'Népal (le)',
    countrycode: 'NP',
    countryCode3: 'NPL',
    numeric: 524,
  },
  {
    shortName: 'Netherlands (the)',
    shortNameFR: 'Pays-Bas (les)',
    countrycode: 'NL',
    countryCode3: 'NLD',
    numeric: 528,
  },
  {
    shortName: 'New Caledonia',
    shortNameFR: 'Nouvelle-Calédonie (la)',
    countrycode: 'NC',
    countryCode3: 'NCL',
    numeric: 540,
  },
  {
    shortName: 'New Zealand',
    shortNameFR: 'Nouvelle-Zélande (la)',
    countrycode: 'NZ',
    countryCode3: 'NZL',
    numeric: 554,
  },
  {
    shortName: 'Nicaragua',
    shortNameFR: 'Nicaragua (le)',
    countrycode: 'NI',
    countryCode3: 'NIC',
    numeric: 558,
  },
  {
    shortName: 'Niger (the)',
    shortNameFR: 'Niger (le)',
    countrycode: 'NE',
    countryCode3: 'NER',
    numeric: 562,
  },
  {
    shortName: 'Nigeria',
    shortNameFR: 'Nigéria (le)',
    countrycode: 'NG',
    countryCode3: 'NGA',
    numeric: 566,
  },
  {
    shortName: 'Niue',
    shortNameFR: 'Niue',
    countrycode: 'NU',
    countryCode3: 'NIU',
    numeric: 570,
  },
  {
    shortName: 'Norfolk Island',
    shortNameFR: "Norfolk (l'Île)",
    countrycode: 'NF',
    countryCode3: 'NFK',
    numeric: 574,
  },
  {
    shortName: 'North Macedonia',
    shortNameFR: 'Macédoine du Nord (la)',
    countrycode: 'MK',
    countryCode3: 'MKD',
    numeric: 807,
  },
  {
    shortName: 'Northern Mariana Islands (the)',
    shortNameFR: 'Mariannes du Nord (les Îles)',
    countrycode: 'MP',
    countryCode3: 'MNP',
    numeric: 580,
  },
  {
    shortName: 'Norway',
    shortNameFR: 'Norvège (la)',
    countrycode: 'NO',
    countryCode3: 'NOR',
    numeric: 578,
  },
  {
    shortName: 'Oman',
    shortNameFR: 'Oman',
    countrycode: 'OM',
    countryCode3: 'OMN',
    numeric: 512,
  },
  {
    shortName: 'Pakistan',
    shortNameFR: 'Pakistan (le)',
    countrycode: 'PK',
    countryCode3: 'PAK',
    numeric: 586,
  },
  {
    shortName: 'Palau',
    shortNameFR: 'Palaos (les)',
    countrycode: 'PW',
    countryCode3: 'PLW',
    numeric: 585,
  },
  {
    shortName: 'Palestine, State of',
    shortNameFR: 'Palestine, État de',
    countrycode: 'PS',
    countryCode3: 'PSE',
    numeric: 275,
  },
  {
    shortName: 'Panama',
    shortNameFR: 'Panama (le)',
    countrycode: 'PA',
    countryCode3: 'PAN',
    numeric: 591,
  },
  {
    shortName: 'Papua New Guinea',
    shortNameFR: 'Papouasie-Nouvelle-Guinée (la)',
    countrycode: 'PG',
    countryCode3: 'PNG',
    numeric: 598,
  },
  {
    shortName: 'Paraguay',
    shortNameFR: 'Paraguay (le)',
    countrycode: 'PY',
    countryCode3: 'PRY',
    numeric: 600,
  },
  {
    shortName: 'Peru',
    shortNameFR: 'Pérou (le)',
    countrycode: 'PE',
    countryCode3: 'PER',
    numeric: 604,
  },
  {
    shortName: 'Philippines (the)',
    shortNameFR: 'Philippines (les)',
    countrycode: 'PH',
    countryCode3: 'PHL',
    numeric: 608,
  },
  {
    shortName: 'Pitcairn',
    shortNameFR: 'Pitcairn',
    countrycode: 'PN',
    countryCode3: 'PCN',
    numeric: 612,
  },
  {
    shortName: 'Poland',
    shortNameFR: 'Pologne (la)',
    countrycode: 'PL',
    countryCode3: 'POL',
    numeric: 616,
  },
  {
    shortName: 'Portugal',
    shortNameFR: 'Portugal (le)',
    countrycode: 'PT',
    countryCode3: 'PRT',
    numeric: 620,
  },
  {
    shortName: 'Puerto Rico',
    shortNameFR: 'Porto Rico',
    countrycode: 'PR',
    countryCode3: 'PRI',
    numeric: 630,
  },
  {
    shortName: 'Qatar',
    shortNameFR: 'Qatar (le)',
    countrycode: 'QA',
    countryCode3: 'QAT',
    numeric: 634,
  },
  {
    shortName: 'Romania',
    shortNameFR: 'Roumanie (la)',
    countrycode: 'RO',
    countryCode3: 'ROU',
    numeric: 642,
  },
  {
    shortName: 'Russian Federation (the)',
    shortNameFR: 'Russie (la Fédération de)',
    countrycode: 'RU',
    countryCode3: 'RUS',
    numeric: 643,
  },
  {
    shortName: 'Rwanda',
    shortNameFR: 'Rwanda (le)',
    countrycode: 'RW',
    countryCode3: 'RWA',
    numeric: 646,
  },
  {
    shortName: 'Réunion',
    shortNameFR: 'Réunion (La)',
    countrycode: 'RE',
    countryCode3: 'REU',
    numeric: 638,
  },
  {
    shortName: 'Saint Barthélemy',
    shortNameFR: 'Saint-Barthélemy',
    countrycode: 'BL',
    countryCode3: 'BLM',
    numeric: 652,
  },
  {
    shortName: 'Saint Helena, Ascension and Tristan da Cunha',
    shortNameFR: 'Sainte-Hélène, Ascension et Tristan da Cunha',
    countrycode: 'SH',
    countryCode3: 'SHN',
    numeric: 654,
  },
  {
    shortName: 'Saint Kitts and Nevis',
    shortNameFR: 'Saint-Kitts-et-Nevis',
    countrycode: 'KN',
    countryCode3: 'KNA',
    numeric: 659,
  },
  {
    shortName: 'Saint Lucia',
    shortNameFR: 'Sainte-Lucie',
    countrycode: 'LC',
    countryCode3: 'LCA',
    numeric: 662,
  },
  {
    shortName: 'Saint Martin (French part)',
    shortNameFR: 'Saint-Martin (partie française)',
    countrycode: 'MF',
    countryCode3: 'MAF',
    numeric: 663,
  },
  {
    shortName: 'Saint Pierre and Miquelon',
    shortNameFR: 'Saint-Pierre-et-Miquelon',
    countrycode: 'PM',
    countryCode3: 'SPM',
    numeric: 666,
  },
  {
    shortName: 'Saint Vincent and the Grenadines',
    shortNameFR: 'Saint-Vincent-et-les Grenadines',
    countrycode: 'VC',
    countryCode3: 'VCT',
    numeric: 670,
  },
  {
    shortName: 'Samoa',
    shortNameFR: 'Samoa (le)',
    countrycode: 'WS',
    countryCode3: 'WSM',
    numeric: 882,
  },
  {
    shortName: 'San Marino',
    shortNameFR: 'Saint-Marin',
    countrycode: 'SM',
    countryCode3: 'SMR',
    numeric: 674,
  },
  {
    shortName: 'Sao Tome and Principe',
    shortNameFR: 'Sao Tomé-et-Principe',
    countrycode: 'ST',
    countryCode3: 'STP',
    numeric: 678,
  },
  {
    shortName: 'Saudi Arabia',
    shortNameFR: "Arabie saoudite (l')",
    countrycode: 'SA',
    countryCode3: 'SAU',
    numeric: 682,
  },
  {
    shortName: 'Senegal',
    shortNameFR: 'Sénégal (le)',
    countrycode: 'SN',
    countryCode3: 'SEN',
    numeric: 686,
  },
  {
    shortName: 'Serbia',
    shortNameFR: 'Serbie (la)',
    countrycode: 'RS',
    countryCode3: 'SRB',
    numeric: 688,
  },
  {
    shortName: 'Seychelles',
    shortNameFR: 'Seychelles (les)',
    countrycode: 'SC',
    countryCode3: 'SYC',
    numeric: 690,
  },
  {
    shortName: 'Sierra Leone',
    shortNameFR: 'Sierra Leone (la)',
    countrycode: 'SL',
    countryCode3: 'SLE',
    numeric: 694,
  },
  {
    shortName: 'Singapore',
    shortNameFR: 'Singapour',
    countrycode: 'SG',
    countryCode3: 'SGP',
    numeric: 702,
  },
  {
    shortName: 'Sint Maarten (Dutch part)',
    shortNameFR: 'Saint-Martin (partie néerlandaise)',
    countrycode: 'SX',
    countryCode3: 'SXM',
    numeric: 534,
  },
  {
    shortName: 'Slovakia',
    shortNameFR: 'Slovaquie (la)',
    countrycode: 'SK',
    countryCode3: 'SVK',
    numeric: 703,
  },
  {
    shortName: 'Slovenia',
    shortNameFR: 'Slovénie (la)',
    countrycode: 'SI',
    countryCode3: 'SVN',
    numeric: 705,
  },
  {
    shortName: 'Solomon Islands',
    shortNameFR: 'Salomon (les Îles)',
    countrycode: 'SB',
    countryCode3: 'SLB',
    numeric: 90,
  },
  {
    shortName: 'Somalia',
    shortNameFR: 'Somalie (la)',
    countrycode: 'SO',
    countryCode3: 'SOM',
    numeric: 706,
  },
  {
    shortName: 'South Africa',
    shortNameFR: "Afrique du Sud (l')",
    countrycode: 'ZA',
    countryCode3: 'ZAF',
    numeric: 710,
  },
  {
    shortName: 'South Georgia and the South Sandwich Islands',
    shortNameFR: 'Géorgie du Sud-et-les Îles Sandwich du Sud (la)',
    countrycode: 'GS',
    countryCode3: 'SGS',
    numeric: 239,
  },
  {
    shortName: 'South Sudan',
    shortNameFR: 'Soudan du Sud (le)',
    countrycode: 'SS',
    countryCode3: 'SSD',
    numeric: 728,
  },
  {
    shortName: 'Spain',
    shortNameFR: "Espagne (l')",
    countrycode: 'ES',
    countryCode3: 'ESP',
    numeric: 724,
  },
  {
    shortName: 'Sri Lanka',
    shortNameFR: 'Sri Lanka',
    countrycode: 'LK',
    countryCode3: 'LKA',
    numeric: 144,
  },
  {
    shortName: 'Sudan (the)',
    shortNameFR: 'Soudan (le)',
    countrycode: 'SD',
    countryCode3: 'SDN',
    numeric: 729,
  },
  {
    shortName: 'Suriname',
    shortNameFR: 'Suriname (le)',
    countrycode: 'SR',
    countryCode3: 'SUR',
    numeric: 740,
  },
  {
    shortName: 'Svalbard and Jan Mayen',
    shortNameFR: "Svalbard et l'Île Jan Mayen (le)",
    countrycode: 'SJ',
    countryCode3: 'SJM',
    numeric: 744,
  },
  {
    shortName: 'Sweden',
    shortNameFR: 'Suède (la)',
    countrycode: 'SE',
    countryCode3: 'SWE',
    numeric: 752,
  },
  {
    shortName: 'Switzerland',
    shortNameFR: 'Suisse (la)',
    countrycode: 'CH',
    countryCode3: 'CHE',
    numeric: 756,
  },
  {
    shortName: 'Syrian Arab Republic (the)',
    shortNameFR: 'République arabe syrienne (la)',
    countrycode: 'SY',
    countryCode3: 'SYR',
    numeric: 760,
  },
  {
    shortName: 'Taiwan (Province of China)',
    shortNameFR: 'Taïwan (Province de Chine)',
    countrycode: 'TW',
    countryCode3: 'TWN',
    numeric: 158,
  },
  {
    shortName: 'Tajikistan',
    shortNameFR: 'Tadjikistan (le)',
    countrycode: 'TJ',
    countryCode3: 'TJK',
    numeric: 762,
  },
  {
    shortName: 'Tanzania, the United Republic of',
    shortNameFR: 'Tanzanie (la République-Unie de)',
    countrycode: 'TZ',
    countryCode3: 'TZA',
    numeric: 834,
  },
  {
    shortName: 'Thailand',
    shortNameFR: 'Thaïlande (la)',
    countrycode: 'TH',
    countryCode3: 'THA',
    numeric: 764,
  },
  {
    shortName: 'Timor-Leste',
    shortNameFR: 'Timor-Leste (le)',
    countrycode: 'TL',
    countryCode3: 'TLS',
    numeric: 626,
  },
  {
    shortName: 'Togo',
    shortNameFR: 'Togo (le)',
    countrycode: 'TG',
    countryCode3: 'TGO',
    numeric: 768,
  },
  {
    shortName: 'Tokelau',
    shortNameFR: 'Tokelau (les)',
    countrycode: 'TK',
    countryCode3: 'TKL',
    numeric: 772,
  },
  {
    shortName: 'Tonga',
    shortNameFR: 'Tonga (les)',
    countrycode: 'TO',
    countryCode3: 'TON',
    numeric: 776,
  },
  {
    shortName: 'Trinidad and Tobago',
    shortNameFR: 'Trinité-et-Tobago (la)',
    countrycode: 'TT',
    countryCode3: 'TTO',
    numeric: 780,
  },
  {
    shortName: 'Tunisia',
    shortNameFR: 'Tunisie (la)',
    countrycode: 'TN',
    countryCode3: 'TUN',
    numeric: 788,
  },
  {
    shortName: 'Turkey',
    shortNameFR: 'Turquie (la)',
    countrycode: 'TR',
    countryCode3: 'TUR',
    numeric: 792,
  },
  {
    shortName: 'Turkmenistan',
    shortNameFR: 'Turkménistan (le)',
    countrycode: 'TM',
    countryCode3: 'TKM',
    numeric: 795,
  },
  {
    shortName: 'Turks and Caicos Islands (the)',
    shortNameFR: 'Turks-et-Caïcos (les Îles)',
    countrycode: 'TC',
    countryCode3: 'TCA',
    numeric: 796,
  },
  {
    shortName: 'Tuvalu',
    shortNameFR: 'Tuvalu (les)',
    countrycode: 'TV',
    countryCode3: 'TUV',
    numeric: 798,
  },
  {
    shortName: 'Uganda',
    shortNameFR: "Ouganda (l')",
    countrycode: 'UG',
    countryCode3: 'UGA',
    numeric: 800,
  },
  {
    shortName: 'Ukraine',
    shortNameFR: "Ukraine (l')",
    countrycode: 'UA',
    countryCode3: 'UKR',
    numeric: 804,
  },
  {
    shortName: 'United Arab Emirates (the)',
    shortNameFR: 'Émirats arabes unis (les)',
    countrycode: 'AE',
    countryCode3: 'ARE',
    numeric: 784,
  },
  {
    shortName: 'United Kingdom of Great Britain and Northern Ireland (the)',
    shortNameFR: "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord (le)",
    alias: 'UK',
    countrycode: 'GB',
    countryCode3: 'GBR',
    numeric: 826,
  },
  {
    shortName: 'United States Minor Outlying Islands (the)',
    shortNameFR: 'Îles mineures éloignées des États-Unis (les)',
    countrycode: 'UM',
    countryCode3: 'UMI',
    numeric: 581,
  },
  {
    shortName: 'United States of America (the)',
    shortNameFR: "États-Unis d'Amérique (les)",
    countrycode: 'US',
    countryCode3: 'USA',
    numeric: 840,
  },
  {
    shortName: 'Uruguay',
    shortNameFR: "Uruguay (l')",
    countrycode: 'UY',
    countryCode3: 'URY',
    numeric: 858,
  },
  {
    shortName: 'Uzbekistan',
    shortNameFR: "Ouzbékistan (l')",
    countrycode: 'UZ',
    countryCode3: 'UZB',
    numeric: 860,
  },
  {
    shortName: 'Vanuatu',
    shortNameFR: 'Vanuatu (le)',
    countrycode: 'VU',
    countryCode3: 'VUT',
    numeric: 548,
  },
  {
    shortName: 'Venezuela (Bolivarian Republic of)',
    shortNameFR: 'Venezuela (République bolivarienne du)',
    countrycode: 'VE',
    countryCode3: 'VEN',
    numeric: 862,
  },
  {
    shortName: 'Viet Nam',
    shortNameFR: 'Viet Nam (le)',
    countrycode: 'VN',
    countryCode3: 'VNM',
    numeric: 704,
  },
  {
    shortName: 'Virgin Islands (British)',
    shortNameFR: 'Vierges britanniques (les Îles)',
    countrycode: 'VG',
    countryCode3: 'VGB',
    numeric: 92,
  },
  {
    shortName: 'Virgin Islands (U.S.)',
    shortNameFR: 'Vierges des États-Unis (les Îles)',
    countrycode: 'VI',
    countryCode3: 'VIR',
    numeric: 850,
  },
  {
    shortName: 'Wallis and Futuna',
    shortNameFR: 'Wallis-et-Futuna',
    countrycode: 'WF',
    countryCode3: 'WLF',
    numeric: 876,
  },
  {
    shortName: 'Western Sahara*',
    shortNameFR: 'Sahara occidental (le)*',
    countrycode: 'EH',
    countryCode3: 'ESH',
    numeric: 732,
  },
  {
    shortName: 'Yemen',
    shortNameFR: 'Yémen (le)',
    countrycode: 'YE',
    countryCode3: 'YEM',
    numeric: 887,
  },
  {
    shortName: 'Zambia',
    shortNameFR: 'Zambie (la)',
    countrycode: 'ZM',
    countryCode3: 'ZMB',
    numeric: 894,
  },
  {
    shortName: 'Zimbabwe',
    shortNameFR: 'Zimbabwe (le)',
    countrycode: 'ZW',
    countryCode3: 'ZWE',
    numeric: 716,
  },
  {
    shortName: 'Åland Islands',
    shortNameFR: 'Åland(les Îles)',
    countrycode: 'AX',
    countryCode3: 'ALA',
    numeric: 248,
  },
] as const
