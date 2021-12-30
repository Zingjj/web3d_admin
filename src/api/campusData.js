import { web3dSdk } from '../main';
function getCampusList(campusId, pageIndex, pageSize, key) {
  return web3dSdk.getCampusList(campusId, pageIndex, pageSize, key);
}

export {
  getCampusList
}