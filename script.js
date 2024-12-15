// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// キャンバスにテキストを描画
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = 256;
canvas.height = 256;
context.font = "30px Arial";
context.fillStyle = "white";
context.fillText("Block #123456", 10, 50);

// テクスチャを作成
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "black";
context.fillText("Block #123456", 10, 50);

const textureBlockHeight = new THREE.CanvasTexture(canvas);
const materialWithTextBlockHeight = new THREE.MeshBasicMaterial({ map: textureBlockHeight });

context.fillStyle = "blue";
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "white";
context.fillText("Block Hash", 10, 50);

const textureBlockHash = new THREE.CanvasTexture(canvas);
const materialWithTextBlockHash = new THREE.MeshBasicMaterial({ map: textureBlockHash });

context.fillStyle = "green";
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "white";
context.fillText("Block Data", 10, 50);

const textureBlockData = new THREE.CanvasTexture(canvas);
const materialWithTextBlockData = new THREE.MeshBasicMaterial({ map: textureBlockData });

// キューブを作成
const geometry = new THREE.BoxGeometry(2, 2, 2);
const materials = [
    materialWithTextBlockHeight,
    materialWithTextBlockHash,
    materialWithTextBlockData,
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 5;


async function fetchBlockData() {
    const response = await fetch('http://localhost:8000/latest_block');
    const data = await response.json();
    console.log(data);
    return data;
}

async function updateText() {
    const data = await fetchBlockData();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = "30px Arial";
    context.fillStyle = "white";
    
    context.fillStyle = "white";
    context.fillText(`Block Height ${data.block_height}`, 10, 50);

    const textureBlockHeight = new THREE.CanvasTexture(canvas);
    const materialWithTextBlockHeight = new THREE.MeshBasicMaterial({ map: textureBlockHeight });

    context.fillStyle = "blue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillText(`Block Hash ${data.block_hash}`, 10, 50);

    const textureBlockHash = new THREE.CanvasTexture(canvas);
    const materialWithTextBlockHash = new THREE.MeshBasicMaterial({ map: textureBlockHash });

    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillText(`Block Data : difficulty ${data.block_data.difficulty}`, 10, 50);

    const textureBlockData = new THREE.CanvasTexture(canvas);
    const materialWithTextBlockData = new THREE.MeshBasicMaterial({ map: textureBlockData });

    const texture = new THREE.CanvasTexture(canvas);
    let materialWithText = new THREE.MeshBasicMaterial({ map: texture });
    
    materials[0] = materialWithTextBlockHeight;
    materials[1] = materialWithTextBlockHash;
    materials[2] = materialWithTextBlockData;
}

async function init() {
    await updateText();
    animate();
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    // キューブを回転させる
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

init();

setInterval(updateText, 5000);