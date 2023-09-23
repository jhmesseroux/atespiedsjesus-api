const songsCategories = [
  {
    id: 1,
    uuid: '63c7077f7e0b612ee4c7e96c',
    name: 'Mélodies Joyeuses',
    slug: 'melodies-joyeuses',
    abbreviation: 'MJ',
    createdAt: '2023-02-11T14:13:21.480Z',
    updatedAt: '2023-02-11T14:13:21.480Z'
  },
  {
    id: 2,
    uuid: '63c707807e0b612ee4c7e96e',
    name: 'La Voix du Réveil',
    slug: 'la-voix-du-reveil',
    abbreviation: 'VR',
    createdAt: '2023-02-11T14:13:21.481Z',
    updatedAt: '2023-02-11T14:13:21.481Z'
  },
  {
    id: 3,
    uuid: '63c707807e0b612ee4c7e970',
    name: 'Échos des Élus',
    slug: 'echos-des-elus',
    abbreviation: 'EE',
    createdAt: '2023-02-11T14:13:21.482Z',
    updatedAt: '2023-02-11T14:13:21.482Z'
  },
  {
    id: 4,
    uuid: '63c707807e0b612ee4c7e972',
    name: 'Haïti Chante avec Radio Lumière',
    slug: 'haiti-chante-avec-radio-lumiere',
    abbreviation: 'HC',
    createdAt: '2023-02-11T14:13:21.484Z',
    updatedAt: '2023-02-11T14:13:21.484Z'
  },
  {
    id: 5,
    uuid: '63c707807e0b612ee4c7e974',
    name: 'Réveillons-nous Chrétiens',
    slug: 'reveillons-nous-chretiens',
    abbreviation: 'RN',
    createdAt: '2023-02-11T14:13:21.485Z',
    updatedAt: '2023-02-11T14:13:21.485Z'
  },
  {
    id: 6,
    uuid: '63c707807e0b612ee4c7e976',
    name: "Gloire à l'agneau",
    slug: "gloire-a-l'agneau",
    abbreviation: 'GA',
    createdAt: '2023-02-11T14:13:21.485Z',
    updatedAt: '2023-02-11T14:13:21.485Z'
  },
  {
    id: 7,
    uuid: '63c7077f7e0b612ee4c7e96a',
    name: "Chant d'Espérance",
    slug: "chant-d'esperance",
    abbreviation: 'CE',
    createdAt: '2023-02-11T14:13:21.477Z',
    updatedAt: '2023-02-11T14:13:21.477Z'
  }
]

const versions =
   [
     {
       language: 'ht',
       longLanguage: 'Creole',
       name: 'HCV',
       description: 'Haitian Creole Version',
       file: 'HCV.SQLite3'
     },
     {
       language: 'ht',
       longLanguage: 'Creole',
       name: 'HCB',
       description: 'Bib La, Haitian Creole Bible, 1985',
       file: 'HCB.SQLite3'
     },

     {
       language: 'fr',
       longLanguage: 'Français',
       name: 'NBS',
       description: 'Nouvelle Bible Segond, 2002',
       file: 'NBS.SQLite3'
     },
     {
       language: 'fr',
       longLanguage: 'Français',
       name: 'LSG',
       description: 'Bible Segond 1910',
       file: 'LSG.SQLite3'
     }
   ]

module.exports = { songsCategories, versions }
