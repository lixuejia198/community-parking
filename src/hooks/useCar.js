import { CarMobile } from "@/utils/three/loadModel/carModelLocation";

const useCarModel = async ({ car, groupScale = 10, color }) => {
  // 加载模型
  const group = await CarMobile;
  // 复制模型
  const newGroup = group.scene.children[0].clone();
  // 克隆材质
  const material = group.scene.children[0].children
    .find((child) => child.name === "DaimlerV8_Body_50")
    .children.find((child) => child.name === "Object_219")
    .material.clone();
  // 设置材质
  newGroup.children
    .find((child) => child.name === "DaimlerV8_Body_50")
    .children.find((child) => child.name === "Object_219").material = material;
  // 设置名称
  newGroup.name = "car";
  // 保存车辆数据
  newGroup.data = car;
  // 设置缩放比例
  newGroup.scale.set(
    car?.scale?.x ? car.scale.x * groupScale : groupScale,
    car?.scale?.y ? car.scale.y * groupScale : groupScale,
    car?.scale?.z ? car.scale.z * groupScale : groupScale
  );
  // 设置颜色
  material.color.set(color);
  // 返回模型
  return newGroup;
};

export { useCarModel };
