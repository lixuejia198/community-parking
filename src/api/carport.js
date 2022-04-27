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

/**
 * 查询车位被被共享的时间
 * @param pid
 * @param time
 * @returns {Promise}
 */
export function getCarportRentTime({ pid, time }) {
  return requestWithToken("/carport/rent_time", "get", { pid, time });
}

/**
 * 共享车位
 * @param starttime 开始时间
 * @param endtime 结束时间
 * @param comid 小区id
 * @param pid 车位id
 * @returns {Promise}
 */
export function rentCarportApi({ starttime, endtime, comid, pid }) {
  return requestWithToken("/carport/rent", "post", {
    starttime,
    endtime,
    comid,
    pid,
  });
}
