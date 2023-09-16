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

/**
 * 添加车辆
 * @param uid 用户id
 * @param cname 车牌号
 * @param color 车颜色
 * @returns {Promise}
 */
export function addCarByUserIDApi({ uid, cname, color }) {
  return requestWithToken("/car/add", "post", { uid, cname, color });
}

/**
 * 解绑车辆
 * @param id 车辆id
 * @returns {Promise}
 */
export function untieCarByIDApi({ id }) {
  return requestWithToken("/car/untie", "post", { id });
}

/**
 * 查询车辆日志
 * @param uid 用户id
 * @param cid 车辆id
 * @param page_num 页码
 * @param page_size 每页数量
 * @returns {Promise}
 */
export function getCarLogApi({ uid, cid, page_num, page_size }) {
  return requestWithToken("/car/log", "get", { uid, cid, page_num, page_size });
}
