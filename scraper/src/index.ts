import { getAllRegions, getRegionDetails } from './regions';

export interface Map<Type> {
  [key: string]: Type;
}

export interface Entities {
  regions?: Map<Region>;
  departements?: Map<Department>;
  communes?: Map<Commune>;
  reseaux?: Map<Reseau>;
}

export interface Region {
  id: string;
  name: string;
  departements: Array<DepartmentId>;
}

type DepartmentId = string;
interface Department {
  id: DepartmentId;
  name: string;
  communes: Array<CommuneId>;
}

type CommuneId = string;
interface Commune {
  id: CommuneId;
  name: string;
  reseaux: Array<ReseauId>;
}

type ReseauId = string;
interface Reseau {
  id: ReseauId;
  name: string;
}

class EntitiesService {
  entities: Entities = {
    regions: {},
    departements: {},
    communes: {},
    reseaux: {},
  };

  async getRegions(): Promise<Map<Region>> {
    return await getAllRegions();
  }

  async getAllRegions() {
    const regions = await getAllRegions();
    this.entities.regions = regions;
    for (let [regionId, _] of Object.entries(this.entities.regions)) {
      const entities = await getRegionDetails(regionId, this.entities);
      // TODO: Need to merge data back into this.entites
    }
  }
}

const entitiesService = new EntitiesService();
entitiesService.getAllRegions();
