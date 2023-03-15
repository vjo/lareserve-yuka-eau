import * as cheerio from 'cheerio';
import type { Entities, Region, Map } from 'src';

const fetchRegionBaseURL =
  'https://orobnat.sante.gouv.fr/orobnat/afficherPage.do?methode=menu&usd=AEP&idRegion=';
const fetchAllRegionsURL =
  'https://sante.gouv.fr/sante-et-environnement/eaux/eau';

const getAllRegions = async () => {
  const regions: Map<Region> = {};

  const response = await fetch(fetchAllRegionsURL, {
    credentials: 'include',
    method: 'GET',
    mode: 'cors',
  });

  const htmlPage = await response.text();
  const $ = cheerio.load(htmlPage);

  const selectedRegionsMetro = $('#m_cartefrance area');
  selectedRegionsMetro.map((k, v) => {
    const name = $(v).attr('title');
    const id = $(v).attr('href').split('idRegion=')[1];
    console.log(`Add region ${id} ${name}`);
    regions[id] = {
      id,
      name,
      departements: [],
    };
  });

  const selectedRegionsDom = $('#m_cartedom area');
  selectedRegionsDom.map((k, v) => {
    const name = $(v).attr('title');
    const id = $(v).attr('href').split('idRegion=')[1];
    console.log(`Add region ${id} ${name}`);
    regions[id] = {
      id,
      name,
      departements: [],
    };
  });

  return regions;
};

const getRegionDetails = async (regionId: string, entities: Entities) => {
  const fetchRegionURL = `${fetchRegionBaseURL}${regionId}`;

  const response = await fetch(fetchRegionURL, {
    credentials: 'include',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-site',
      'Sec-Fetch-User': '?1',
    },
    method: 'GET',
    mode: 'cors',
  });

  const htmlPage = await response.text();
  const $ = cheerio.load(htmlPage);
  const selectedDepartementId = $(
    'select[name=departement] option[selected]',
  ).val();
  const selectedCommuneId = $(
    'select[name=communeDepartement] option[selected]',
  ).val();
  const selectedReseauId =
    $('select[name=reseau] option[selected]').val() ||
    $('select[name=reseau] option').val();

  const departements = $('select[name=departement]').children();
  departements.map((k, v) => {
    const name = $(v).html();
    const id = $(v).val();
    console.log(`Add departement ${id} ${name}`);
    entities.departements[id] = { id, name, communes: [] };
    entities.regions[regionId].departements.push(id);
  });

  console.log(
    `# Departement ${selectedDepartementId} ${entities.departements[selectedDepartementId].name}`,
  );

  const communes = $('select[name=communeDepartement]').children();
  communes.map((k, v) => {
    const name = $(v).html();
    const id = $(v).val();
    console.log(`  Add commune ${id} ${name}`);
    entities.communes[id] = { id, name, reseaux: [] };
    entities.departements[selectedDepartementId].communes.push(id);
  });

  const reseaux = $('select[name=reseau]').children();
  reseaux.map((k, v) => {
    const name = $(v).html();
    const id = $(v).val();
    console.log(`    Add reseau ${id} ${name}`);
    entities.reseaux[id] = { id, name };
    entities.communes[selectedCommuneId].reseaux.push(id);
  });

  for (let communeId in entities.communes) {
    console.log(`## Commune ${communeId} ${entities.communes[communeId].name}`);
    if (entities.communes[communeId].reseaux.length === 0) {
      const response = await fetch(
        'https://orobnat.sante.gouv.fr/orobnat/rechercherResultatQualite.do',
        {
          credentials: 'include',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            Cookie:
              'JSESSIONID=EDE0ECD6904AF3610F7F95921822B0C9.or-orobnatc1; TS0167b815=012337f68da8c43a8ae6a21568cac555b756c225a6791b87f943fb7692e5b279e906c153b01e3180033d9d615061088953157456a1e003802176e02938b46bc58c180624da; BIGipServerE29bqBgQAHgS7elPrr1mpw=947562688.20480.0000; TS01298773=012337f68d8e811100f6a1c7d30d20d62316013c89c5d2cfeefa5ff02cc0908684ebbc615c8b3cb50d4feb231309ba96617ecd5d15796c92dc009f5923e646ede3a38820c9; _pk_id.40.a3d0=7ece1bfc76025c3f.1678183438.; _pk_ses.40.a3d0=1',
          },
          referrer:
            'https://orobnat.sante.gouv.fr/orobnat/rechercherResultatQualite.do',
          body: `methode=changerCommune&idRegion=${regionId}&usd=AEP&posPLV=0&departement=${selectedDepartementId}&communeDepartement=${communeId}&reseau=${selectedReseauId}`,
          method: 'POST',
          mode: 'cors',
        },
      );

      const htmlPage = await response.text();
      const $ = cheerio.load(htmlPage);

      const reseaux = $('select[name=reseau]').children();
      reseaux.map((k, v) => {
        const name = $(v).html();
        const id = $(v).val();
        console.log(`    Add reseau ${id} ${name}`);
        entities.reseaux[id] = { id, name };
        entities.communes[communeId].reseaux.push(id);
      });
    }
    // TODO: loop over `departements`
  }

  console.log('entities: ', entities);
};

export { getAllRegions, getRegionDetails };
