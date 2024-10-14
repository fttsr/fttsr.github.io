import * as THREE from 'three';
import init from './init';
import './style.css';

const { sizes, camera, scene, canvas, renderer } = init();

camera.position.z = 3;

// Объект
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 'green',
    wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const clock = new THREE.Clock();

// Полосы
const stripWidth = 30;
let stripHeight = 0.1;
const maxNarrow = 3.5;
let currNarrow = 2;

// Функция создания полосы
const createStrip = (yPos) => {
    const stripGeometry = new THREE.PlaneGeometry(stripWidth, stripHeight);
    const stripMaterial = new THREE.MeshBasicMaterial( {color: 'brown'} );
    const strip = new THREE.Mesh(stripGeometry, stripMaterial);

    strip.position.y = yPos;
    strip.position.x = -Math.PI / 2 // Поворачиваем полосы для правильного отображения

    return strip;
}

const topStrip = createStrip(1);
const bottomStrip = createStrip(-1);
scene.add(topStrip, bottomStrip);

// Массив цветов
const colors = ['red', 'cyan', 'blue', 'yellow', 'purple', 
						'brown', 'cyan', 'white', 'orange']

// Счётчик пойманных кубок
let scoreCatched = 0;

// Click-event
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const handleClick = () => {
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / sizes.width) * 2 - 1;
        mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    
        // Установка камеры
        raycaster.setFromCamera(mouse, camera);
    
        // Проверка пересечении луча с кубом
        const intersects = raycaster.intersectObject(cube);


    
        if (intersects.length > 0) {
            // Находится ли куб между полосами
            if (cube.position.y < topStrip.position.y + stripHeight / 2
                && cube.position.y > bottomStrip.position.y - stripHeight / 2
            ) {
                alert('Поймал!');
                scoreCatched++;
                document.getElementById('score').innerText = `Поймано: ${scoreCatched}`;

                cube.material.color.set(colors[Math.floor(Math.random() * colors.length)]);

                // Сужаем полосы
                if (currNarrow < maxNarrow) {
                    currNarrow += -0.1;
                    topStrip.position.y = (currNarrow / 2);
                    bottomStrip.position.y = -(currNarrow / 2); 
                }
                
                    
            } else {
                alert('Мимо!');
                location.reload();
            }
        } else {
            alert('Мимо!');
            location.reload();
        }
    });
};
handleClick();


const tick = () => {
	renderer.render(scene, camera);

    const elapsedTime = clock.getElapsedTime();

    cube.position.x = Math.cos(elapsedTime) * 3;
    cube.position.y = Math.sin(elapsedTime) * 2;

	window.requestAnimationFrame(tick);
};
tick();

/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});
