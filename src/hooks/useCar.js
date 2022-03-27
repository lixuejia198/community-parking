// import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
// import { shelfSpacing } from "@/hooks/useShelf";
// import { computed } from "vue";
// import store from "@/store";
import { CarMobile } from "@/utils/three/loadModel/carModelLocation";

const useCarModel = async ({ car, groupScale = 10, color }) => {
  // shelfList = shelfList || computed(() => store.state.shelf.shelfList).value;
  // 加载模型
  const group = await CarMobile;
  console.log(group, group.scene.children[0]);
  // 复制模型
  const newGroup = group.scene.children[0].clone();
  // newGroup.material = group.scene.children[0].material.clone();
  const material = group.scene.children[0].children
    .find((child) => child.name === "SuperV8_Body_40")
    .children.find((child) => child.name === "Object_176")
    .material.clone();
  newGroup.children
    .find((child) => child.name === "SuperV8_Body_40")
    .children.find((child) => child.name === "Object_176").material = material;
  // 设置名称
  newGroup.name = "car";
  // 保存车辆数据
  newGroup.data = car;
  // 查找货架
  // const shelf = shelfList.find((shelf) => shelf.id === goods.shelf_id);
  // 设置车辆的位置
  // newGroup.position.set(
  //   shelf.position.x * shelfSpacing.x +
  //     shelfLocation[goods.shelf_grid_id - 1].x,
  //   shelf.position.y * shelfSpacing.y +
  //     shelfLocation[goods.shelf_grid_id - 1].y,
  //   shelf.position.z * shelfSpacing.z + shelfLocation[goods.shelf_grid_id - 1].z
  // );

  // 设置缩放比例
  newGroup.scale.set(
    car?.scale?.x ? car.scale.x * groupScale : groupScale,
    car?.scale?.y ? car.scale.y * groupScale : groupScale,
    car?.scale?.z ? car.scale.z * groupScale : groupScale
  );
  console.log("material", material);
  // newGroup.material.color.setHex(color.getHex());
  material.color.set(color);
  console.log("newGroup", newGroup);
  // 返回模型
  return newGroup;
};

// 更新车辆模型位置
// const updateGoodsModelPosition = (scene) => {
//   // 货架列表数据
//   const shelfList = computed(() => store.state.shelf.shelfList);
//   scene.children.forEach((item) => {
//     if (item.type === "Mesh" && item.name === "goods") {
//       // 查找货架
//       const shelf = shelfList.value.find(
//         (shelf) => shelf.id === item.data.shelf_id
//       );
//       // 设置车辆的位置
//       item.position.set(
//         shelf.position.x * shelfSpacing.x +
//           shelfLocation[item.data.shelf_grid_id - 1].x,
//         shelf.position.y * shelfSpacing.y +
//           shelfLocation[item.data.shelf_grid_id - 1].y,
//         shelf.position.z * shelfSpacing.z +
//           shelfLocation[item.data.shelf_grid_id - 1].z
//       );
//     }
//   });
// };

// 获取车辆位置
// const getGoodsPosition = (goodsId, shelfId, shelfGridId) => {
//   // 货架列表数据
//   const shelfList = computed(() => store.state.shelf.shelfList);
//   // 查找货架
//   const shelf = shelfList.value.find((shelf) => shelf.id === shelfId);
//   // 设置车辆的位置
//   return {
//     x: shelf.position.x * shelfSpacing.x + shelfLocation[shelfGridId - 1].x,
//     y: shelf.position.y * shelfSpacing.y + shelfLocation[shelfGridId - 1].y,
//     z: shelf.position.z * shelfSpacing.z + shelfLocation[shelfGridId - 1].z,
//   };
// };

export { useCarModel };
