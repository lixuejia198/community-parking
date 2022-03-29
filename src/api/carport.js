import { requestWithToken } from "@/utils/request";

/***
 * 查询车位信息
 * @param uid 用户id
 * @param comId 小区id
 * @returns {Promise}
 */
export function getCarport({ uid, comid }) {
  return requestWithToken("/carport", "get", { uid, comid });
}
