import $axios from './index'

export function getCampusList(params) {
  const url = '/campus/getData';
  return $axios.get(url, params);
}