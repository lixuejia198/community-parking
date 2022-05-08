import { requestWithToken } from "@/utils/request";

/***
 * 查询车信息
 * @param uid 用户id
 * @param comid 小区id
 * @returns {Promise}
 */
export function getCar({ uid, comid }) {
  return requestWithToken("/car", "get", { uid, comid });
}
/**
 * 查询车位被被共享的时间
 * @param cid 车辆ID
 * @returns {Promise}
 */
export function getCarportSeekTime({ cid }) {
  return requestWithToken("/car/seek_time", "get", { cid });
}

/**
 * 寻找车位
 * @param starttime 开始时间
 * @param endtime 结束时间
 * @param cid 车辆ID
 * @returns {Promise}
 */
export function seekCarportApi({ starttime, endtime, cid }) {
  return requestWithToken("/car/seek", "post", {
    starttime,
    endtime,
    cid,
  });
}
