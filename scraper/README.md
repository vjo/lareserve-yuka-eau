# scraper

Scraping data from https://sante.gouv.fr/sante-et-environnement/eaux/eau for LaReserve.tech.

Eventuallyyou would get something like this:
```
entities:  {
  regions: {
    '11': { id: '11', name: 'Ile-de-France', departements: [Array<DepartementId>] },
    '24': { id: '24', name: 'Centre-Val-de-Loire', departements: [Array<DepartementId>] },
    ...
  },
  departements: {
    '091': { id: '091', name: 'ESSONNE', communes: [Array<CommuneId>] },
    '092': { id: '092', name: 'HAUTS-DE-SEINE', communes: [Array<CommuneId>] },
    ...
  },
  communes: {
    '91001': { id: '91001', name: 'ABBEVILLE-LA-RIVIERE', reseaux: [Array<ReseauId>] },
    '91016': { id: '91016', name: 'ANGERVILLE', reseaux: [Array<ReseauId>] },
    ...
  },
  reseaux: {
    '091000569_091': { id: '091000569_091', name: 'PLATEAU DE BEAUCE SUD' },
    '091000228_091': { id: '091000228_091', name: 'ANGERVILLE' },
    ...
  }
}
```

You are then able to query for the water quality of given a "region > departement > commune > reseau" group.

## How to

### Install dependencies

`yarn`

### Run the project

`yarn start`
