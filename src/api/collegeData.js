import { web3dSdk } from '../main';
function getCollegeList(campusId, pageIndex, pageSize, collegeTypeId , key) {
  return web3dSdk.getCollegeList(campusId, pageIndex, pageSize, collegeTypeId, key);
}

function getCollegeTypeList(campusId, pageIndex, pageSize) {
  return web3dSdk.getCollegeTypeList(campusId, pageIndex, pageSize);
}


export {
  getCollegeList,
  getCollegeTypeList
};