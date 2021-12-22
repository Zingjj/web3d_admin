import { web3dSdk } from '../main';
function getBuildingList(campusId) {
  return web3dSdk.getBuildingList(campusId);
}

export {
  getBuildingList
}