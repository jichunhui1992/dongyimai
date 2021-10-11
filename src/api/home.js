import request from '@/utils/request'
// 推荐品牌返回品牌个数，limit返回个数

export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
// 获取广告轮播图
export const findBanner = () => {
  return request('/home/banner', 'get')
}
// 获取新鲜好物
export const findNew = () => {
  return request('home/new', 'get')
}
// 获取热门好物
export const findHot = () => {
  return request('home/hot', 'get')
}
