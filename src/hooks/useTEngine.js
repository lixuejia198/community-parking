import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
import cameraControls from "@/utils/three/CameraControls";
import TRaycaster from "@/utils/three/TRaycaster";
import Outline from "@/utils/three/TOutline";
// import TDragControls from "@/utils/three/TDragControls";
// import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";

let ThreeJS = null;
const useTEngine = (threeRef) => {
  // 实例化 ThreeJs
  const TE = new TEngine(threeRef);

  ThreeJS = TE;

  // 辅助工具
  // TE.addObject(...helperList);
  // 光源
  TE.addObject(...lightsList);
  // 基本网格模型
  TE.addObject(...basicObjectList);
  // 相机辅助
  // TE.addObject(new CameraHelper(TE.camera));

  // 相机控制器
  const TCameraControls = cameraControls(TE.renderer, TE.scene, TE.camera);
  // 添加相机控制器到渲染列表
  TE.addRenderAnim(TCameraControls.renderCamera);

  // 射线投射器(鼠标选中模型对象)
  const raycaster = TRaycaster(TE.dom, TE.renderer, TE.scene, TE.camera);

  // 轮廓线渲染
  const outline = Outline(TE.renderer, TE.scene, TE.camera);
  // 添加轮廓线到渲染列表
  TE.addRenderAnim(outline.renderOutline);

  // 货物
  let goodsObjects = [];
  // 与射线相交的物体
  let intersectObjects = [];

  // 监听鼠标指针移动事件
  TE.renderer.domElement.addEventListener("pointermove", (event) => {
    // 获取与射线相交的物体
    intersectObjects = raycaster.updateIntersects(event);

    // 判断是否有与射线相交的模型
    if (intersectObjects.length > 0) {
      // 遍历相交的模型
      intersectObjects.forEach((intersect) => {
        // 判断是否是货物
        if (intersect?.object?.name === "goods") {
          goodsObjects.push(intersect);
        }
      });

      // 判断是否捕获到货物
      if (goodsObjects.length > 0) {
        // 当前货物
        const selectedObject = goodsObjects[0].object;
        // 添加到描边列表
        outline.outlinePass.selectedObjects = [selectedObject];
      } else {
        // 清除描边效果
        outline.outlinePass.selectedObjects = [];
      }
      // 清空货物列表
      goodsObjects = [];
    } else {
      // 清除描边效果
      outline.outlinePass.selectedObjects = [];
    }
  });

  console.log("TE", TE);
  return TE;
};

export { useTEngine, ThreeJS };
