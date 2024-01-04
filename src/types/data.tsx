import SvgIcons from '../assets/SvgIcons';
import {iconSize, tabIcon} from '../styles';

// export const BASE_URL = `http://192.168.29.168:12344`;
export const BASE_URL = `http://146.190.140.18:3000`;

export const PROFILE_LIST = [
  {
    name: 'Personal Detail',
    icon: <SvgIcons.Profile width={iconSize} height={iconSize} />,
  },
  {
    name: 'Company Detail',
    icon: <SvgIcons.CompanyDetail width={iconSize} height={iconSize} />,
  },
  {
    name: 'My Address',
    icon: <SvgIcons.Pin width={iconSize} height={iconSize} />,
  },
  // {
  //   name: 'Privacy Policy',
  //   icon: <SvgIcons.Policy width={iconSize} height={iconSize} />,
  // },
  // {
  //   name: 'Terms & Condition',
  //   icon: <SvgIcons.Term width={iconSize} height={iconSize} />,
  // },
  // {
  //   name: 'About us',
  //   icon: <SvgIcons.AboutUs width={iconSize} height={iconSize} />,
  // },
  // {
  //   name: 'Contact us',
  //   icon: <SvgIcons.ContactUs width={iconSize} height={iconSize} />,
  // },
  {
    name: 'Log out',
    icon: <SvgIcons.Logout width={iconSize} height={iconSize} />,
  },
];
// export const ORDERTYPE = ['All Order', 'Pending', 'On going', 'Completed', 'Cancel'];

export const ORDERTYPE = [
  {label: 'All Order', value: 'all'},
  {label: 'Pending', value: 'pending'},
  {label: 'On going', value: 'processing'},
  {label: 'Completed', value: 'delivered'},
  {label: 'Cancelled', value: 'cancelled'},
];
// export const ORDERTYPE = [
//   {
//     label: 'All Order',
//     value: 'all',
//   },
//   {
//     label: 'Pending',
//     value: 'pending',
//   },
//   {
//     label: 'On going',
//     value: 'all',
//   },
//   {
//     label: 'Completed',
//     value: 'all',
//   },
//   {
//     label: 'All Order',
//     value: 'all',
//   },
// ];

export const HISTORY_LIST = [
  {
    name: 'Open Order',
    icon: <SvgIcons.OrderBox width={tabIcon} height={tabIcon} />,
  },
  // {
  //   name: 'This month Order',
  //   icon: <SvgIcons.OrderTick width={tabIcon} height={tabIcon} />,
  // },
  {
    name: 'Supplier',
    icon: <SvgIcons.Supply width={tabIcon} height={tabIcon} />,
  },
];

export const ADDRESS_TYPE = [
  {label: 'Home', value: 'Home'},
  {label: 'Company', value: 'Company'},
];

export const NUMBER_TYPE = [
  {label: 'GST Number', value: 1},
  {label: 'PAN Number', value: 2},
];

export const STATES_LIST = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry',
];

export const STATES_DATA = [
  {
    value: 'AN',
    label: 'Andaman and Nicobar Islands',
  },
  {
    value: 'AP',
    label: 'Andhra Pradesh',
  },
  {
    value: 'AR',
    label: 'Arunachal Pradesh',
  },
  {
    value: 'AS',
    label: 'Assam',
  },
  {
    value: 'BR',
    label: 'Bihar',
  },
  {
    value: 'CG',
    label: 'Chandigarh',
  },
  {
    value: 'CH',
    label: 'Chhattisgarh',
  },
  {
    value: 'DH',
    label: 'Dadra and Nagar Haveli',
  },
  {
    value: 'DD',
    label: 'Daman and Diu',
  },
  {
    value: 'DL',
    label: 'Delhi',
  },
  {
    value: 'GA',
    label: 'Goa',
  },
  {
    value: 'GJ',
    label: 'Gujarat',
  },
  {
    value: 'HR',
    label: 'Haryana',
  },
  {
    value: 'HP',
    label: 'Himachal Pradesh',
  },
  {
    value: 'JK',
    label: 'Jammu and Kashmir',
  },
  {
    value: 'JH',
    label: 'Jharkhand',
  },
  {
    value: 'KA',
    label: 'Karnataka',
  },
  {
    value: 'KL',
    label: 'Kerala',
  },
  {
    value: 'LD',
    label: 'Lakshadweep',
  },
  {
    value: 'MP',
    label: 'Madhya Pradesh',
  },
  {
    value: 'MH',
    label: 'Maharashtra',
  },
  {
    value: 'MN',
    label: 'Manipur',
  },
  {
    value: 'ML',
    label: 'Meghalaya',
  },
  {
    value: 'MZ',
    label: 'Mizoram',
  },
  {
    value: 'NL',
    label: 'Nagaland',
  },
  {
    value: 'OR',
    label: 'Odisha',
  },
  {
    value: 'PY',
    label: 'Puducherry',
  },
  {
    value: 'PB',
    label: 'Punjab',
  },
  {
    value: 'RJ',
    label: 'Rajasthan',
  },
  {
    value: 'SK',
    label: 'Sikkim',
  },
  {
    value: 'TN',
    label: 'Tamil Nadu',
  },
  {
    value: 'TS',
    label: 'Telangana',
  },
  {
    value: 'TR',
    label: 'Tripura',
  },
  {
    value: 'UK',
    label: 'Uttarakhand',
  },
  {
    value: 'UP',
    label: 'Uttar Pradesh',
  },
  {
    value: 'WB',
    label: 'West Bengal',
  },
];

export const COUNTRY_LIST = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombi',
  'Comoros',
  'Congo (Brazzaville)',
  'Congo',
  'Costa Rica',
  "Cote d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor (Timor Timur)',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia, The',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia and Montenegro',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];
