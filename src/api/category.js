// 分类模块api接口定义
import request from '@/utils/request'
// 获取商品分类
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
