import { web3dSdk } from '../main';
function getCollegeList(campusId, pageIndex, pageSize, collegeTypeId , key) {
  return web3dSdk.getCollegeList(campusId, pageIndex, pageSize, collegeTypeId, key);
}
function getCollegeTypeList(pageIndex, pageSize, key) {
  return web3dSdk.getCollegeTypeList(pageIndex, pageSize, key);
}
function updateCollegeData(params) {
  return web3dSdk.updateCollegeData(params);
}
function updateCollegeType(params) {
  return web3dSdk.updateCollegeType(params);
}
function insertCollegeData(params) {
  return web3dSdk.insertCollegeData(params);
}
function insertCollegeType(params) {
  return web3dSdk.insertCollegeType(params);
}
export {
  getCollegeList,
  getCollegeTypeList,
  insertCollegeData,
  insertCollegeType,
  updateCollegeData,
  updateCollegeType,
  
};