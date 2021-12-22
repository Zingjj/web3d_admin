import { web3dSdk } from '../main';
function getCampusList() {
  return web3dSdk.getCampusList();
}

export {
  getCampusList
}