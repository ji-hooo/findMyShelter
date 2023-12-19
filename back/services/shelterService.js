import { ShelterModel } from "../db/index";

class ShelterService {
  static async getShelters() {
    const shelters = await ShelterModel.findAll();
    return shelters;
  }
  static async getShelterById(id) {
    const shelter = await ShelterModel.findById(id);
    return shelter;
  }
  static async getShelterByDistrict(district) {
    const district_shelter = await ShelterModel.findByDistrict(district);
    return district_shelter;
  }
}

export default ShelterService;
