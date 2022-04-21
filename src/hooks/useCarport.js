// 车位
import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export const useCarportModel = (name) => {
  const carportGroup = new Group();

  // 长边
  const lengthMesh = new Mesh(
    // 几何对象
    new BoxBufferGeometry(10, 2, 510),
    // 网格标准材质
    new MeshStandardMaterial({ color: 0xffc700, metalness: 1 })
  );

  // 左侧
  const leftLengthMesh = lengthMesh.clone();
  leftLengthMesh.position.set(-100, 0, 0);
  carportGroup.add(leftLengthMesh);

  // 右侧
  const rightLengthMesh = lengthMesh.clone();
  rightLengthMesh.position.set(100, 0, 0);
  carportGroup.add(rightLengthMesh);

  // 短边
  const shortMesh = new Mesh(
    // 几何对象
    new BoxBufferGeometry(200, 2, 10),
    // 网格标准材质
    new MeshStandardMaterial({ color: 0xffc700, metalness: 1 })
  );

  // 前面
  const leftShortMesh = shortMesh.clone();
  leftShortMesh.position.set(0, 0, 250);
  carportGroup.add(leftShortMesh);

  // 后面
  const rightShortMesh = shortMesh.clone();
  rightShortMesh.position.set(0, 0, -250);
  carportGroup.add(rightShortMesh);

  // 车位地面
  const groundMesh = new Mesh(
    // 几何对象
    new BoxBufferGeometry(200, 1, 510),
    // 网格标准材质
    new MeshStandardMaterial({ color: 0x88ff88, metalness: 1 })
  );
  groundMesh.position.set(0, -0.2, 0);
  carportGroup.add(groundMesh);

  // 添加文字geometry
  async function createTextGeometry(text, size) {
    const loader = new FontLoader();
    const font = await loader.loadAsync(
      "/three/fonts/helvetiker_regular.typeface.json"
    );

    const geometry = new TextGeometry(text, {
      font, // 字体格式
      size, // 字体大小
      height: 4, // 字体厚度
      curveSegments: 12, // 曲线控制点数
      bevelEnabled: true, // 斜角
      bevelThickness: 1, // 斜角的深度
      bevelSize: 1, // 斜角的大小
      // bevelSegments: 1, // 斜角段数
    });
    const mat = new MeshPhongMaterial({
      color: "white",
      opacity: 0.8,
      shininess: 1,
    });
    const mesh = new Mesh(geometry, mat);
    mesh.name = name;
    return mesh;
  }

  // 车位编号
  createTextGeometry(name, 30).then((mesh) => {
    const textMesh1 = mesh.clone();
    textMesh1.position.set((name.length / 2.4) * -30, 4, 250);
    carportGroup.add(textMesh1);

    const textMesh2 = mesh.clone();
    textMesh2.position.set((name.length / 2.4) * 30, -3, -240);
    textMesh2.rotation.x = Math.PI / 2;
    textMesh2.rotation.y = Math.PI;
    carportGroup.add(textMesh2);
  });

  return carportGroup;
};
