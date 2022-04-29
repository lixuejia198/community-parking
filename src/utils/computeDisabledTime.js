// 计算日期选择框的禁用时间
import dayjs from "dayjs";

export const computeDisabledTime = (list, current, type, startDate) => {
  // 获取范围内的整数
  const range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };
  // 当前选择的日期
  const currentSelectDate = dayjs(current);
  // 需要禁用的小时
  let disabledHours = [];
  // 需要禁用的分钟
  let disabledMinutes = [];
  // 需要禁用的秒数
  let disabledSeconds = [];
  // 最大可选结束时间;
  let recentStartDate = null;

  if (type === "start" || type === "end") {
    // 判断当前选择的日期是否小于当前日期
    if (currentSelectDate.isBefore(dayjs(), "day")) {
      console.log("当前选择的日期小于当前日期");
      // 如果小于 则禁用所有 时分秒
      disabledHours = range(0, 23);
      disabledMinutes = range(0, 59);
      disabledSeconds = range(0, 59);
    } else if (currentSelectDate.isSame(dayjs(), "day")) {
      console.log("当前选择的日期等于当前日期");
      // 如果等于 则禁用当前时间之前的 时分秒
      disabledHours = range(0, dayjs().hour());
      // disabledMinutes = range(0, dayjs().minute());
      // disabledSeconds = range(0, dayjs().second());
    } else if (currentSelectDate.isAfter(dayjs(), "day")) {
      console.log("当前选择的日期大于当前日期");
    }
  }

  if (type === "start") {
    const sameStartDate = list
      .filter((item) => currentSelectDate.isSame(dayjs(item.starttime), "day"))
      .sort((a, b) => dayjs(a.starttime) - dayjs(b.starttime))[0];
    const sameEndDate = list
      .filter((item) => currentSelectDate.isSame(dayjs(item.endtime), "day"))
      .sort((a, b) => dayjs(a.endtime) - dayjs(b.endtime))[0];
    // 判断当前选择的日期是否在日期列表中
    if (
      list.some(
        (item) =>
          currentSelectDate.isBefore(dayjs(item.endtime), "day") &&
          currentSelectDate.isAfter(dayjs(item.starttime), "day")
      )
    ) {
      // 如果在 则禁用所有 时分秒
      disabledHours = range(0, 23);
      disabledMinutes = range(0, 59);
      disabledSeconds = range(0, 59);
    } else if (sameStartDate) {
      disabledHours = range(dayjs(sameStartDate.starttime).hour(), 23);
      disabledMinutes = range(dayjs(sameStartDate.starttime).minute(), 59);
      disabledSeconds = range(dayjs(sameStartDate.starttime).second(), 59);
    } else if (sameEndDate) {
      disabledHours = range(0, dayjs(sameEndDate.endtime).hour());
      disabledMinutes = range(0, dayjs(sameEndDate.endtime).minute());
      disabledSeconds = range(0, dayjs(sameEndDate.endtime).second());
    }
  } else if (type === "end") {
    // 判断是否选择了开始时间
    if (startDate) {
      // 判断当前选择的日期是否在日期列表中
      if (
        list.some(
          (item) =>
            currentSelectDate.isBefore(dayjs(item.endtime), "day") &&
            currentSelectDate.isAfter(dayjs(item.starttime), "day")
        )
      ) {
        // 如果存在 则禁用所有 时分秒
        disabledHours = range(0, 23);
        disabledMinutes = range(0, 59);
        disabledSeconds = range(0, 59);
      }
      // 查找离当前选择日期最近的开始日期
      recentStartDate = list
        .filter((item) => startDate.isBefore(dayjs(item.starttime), "day"))
        .sort((a, b) => dayjs(a.starttime) - dayjs(b.starttime))[0];
      // 判断是否找到
      if (recentStartDate) {
        if (
          currentSelectDate.isAfter(dayjs(recentStartDate.starttime), "day")
        ) {
          console.log("===当前选择的日期大于开始日期");
          disabledHours = range(0, 23);
          disabledMinutes = range(0, 59);
          disabledSeconds = range(0, 59);
        } else if (
          currentSelectDate.isSame(dayjs(recentStartDate.starttime), "day")
        ) {
          console.log("===当前选择的日期等于开始日期");
          disabledHours = range(dayjs(recentStartDate.starttime).hour(), 23);
          // disabledMinutes = range(dayjs(recentStartDate.starttime).minute(), 59);
          // disabledSeconds = range(dayjs(recentStartDate.starttime).second(), 59);
        } else if (
          currentSelectDate.isBefore(dayjs(recentStartDate.starttime), "day")
        ) {
          console.log("===当前选择的日期小于开始日期");
        }
      }
    }
  }
  return {
    startDate: type === "start" ? currentSelectDate : null,
    maxEndDate: recentStartDate ? recentStartDate.starttime : null,
    disabled: {
      disabledHours: () => disabledHours,
      disabledMinutes: () => disabledMinutes,
      disabledSeconds: () => disabledSeconds,
    },
  };
};
