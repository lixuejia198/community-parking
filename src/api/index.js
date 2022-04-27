import { requestWithoutToken, requestWithToken } from "@/utils/request";

/***
 * 分页查询出租车位列表
 * @param page 当前页数
 * @param limit 每页显示多少条数据
 * @returns {Promise}
 */
export function getRentlist({ page = 1, limit = 6 }) {
  return requestWithoutToken("/rentlist", "get", { page, limit });
}

/***
 * 分页查询寻找车位列表
 * @param page 当前页数
 * @param limit 每页显示多少条数据
 * @returns {Promise}
 */
export function getSeeklist({ page = 1, limit = 6 }) {
  return requestWithoutToken("/seeklist", "get", { page, limit });
}

/***
 * 查询小区列表
 * @param areaid 区id 默认是查询全部
 * @returns {Promise}
 */
export function getCommunityList({ areaid }) {
  return requestWithToken("/citylist", "get", { areaid });
}
