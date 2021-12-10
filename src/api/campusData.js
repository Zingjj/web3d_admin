import { web3dSdk } from '../main';
function getCampusList() {
  return web3dSdk.getCampusList();
}
function getCampusVisitCnt(startTime, endTime) {
  return web3dSdk.getCampusVisitCnt();
}

export {
  getCampusList,
  getCampusVisitCnt
};