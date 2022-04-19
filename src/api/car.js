import { requestWithToken } from "@/utils/request";

/***
 * 查询车信息
 * @param uid 用户id
 * @returns {Promise}
 */
export function getCar({ uid, comid }) {
  return requestWithToken("/car", "get", { uid, comid });
}
