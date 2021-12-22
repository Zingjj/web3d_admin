import $axios from './index';
import { web3dSdk } from '../main';
export function getCardsData() {
  const url = '/getCardsData'
  return $axios.get(url)
}
export function getLineData() {
  const url = '/getLineData'
  return $axios.get(url)
}
export function getTableData() {
  const url = '/getTableList'
  return $axios.get(url)
}
export function getBarData() {
  const url = '/getBarData'
  return $axios.get(url)
}

export function getCampusVisitCnt(startTime, endTime) {
  return web3dSdk.getCampusVisitCnt(startTime, endTime);
}

export function getModuleVisitCnt(startTime, endTime) {
  return web3dSdk.getModuleVisitCnt(startTime, endTime);
}

export function getBuildingModelVisitCnt(campusId, startTime, endTime) {
  return web3dSdk.getBuildingModelVisitCnt(campusId, startTime, endTime);
}