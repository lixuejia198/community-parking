// 车位
import { BoxBufferGeometry, Group, Mesh, MeshStandardMaterial } from "three";

export const carportGroup = new Group();

// 长边
const lengthMesh = new Mesh(
  // 几何对象
  new BoxBufferGeometry(10, 4, 500),
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
  new BoxBufferGeometry(200, 4, 10),
  // 网格标准材质
  new MeshStandardMaterial({ color: 0xffc700, metalness: 1 })
);

// 前面
const leftShortMesh = shortMesh.clone();
leftShortMesh.position.set(0, 0, 245);
carportGroup.add(leftShortMesh);

// 后面
const rightShortMesh = shortMesh.clone();
rightShortMesh.position.set(0, 0, -245);
carportGroup.add(rightShortMesh);
