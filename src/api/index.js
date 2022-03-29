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
 * 查询车位信息
 * @param uid 用户id
 * @returns {Promise}
 */
export function getCarport({ uid }) {
  return requestWithToken("/carport", "get", { uid });
}

/***
 * 查询车信息
 * @param uid 用户id
 * @returns {Promise}
 */
export function getCarInfo({ uid }) {
  return requestWithToken("/car", "get", { uid });
}
