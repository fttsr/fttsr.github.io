import * as THREE from 'three';

const init = () => {
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	const scene = new THREE.Scene();
	const loader = new THREE.TextureLoader(); // Для заднего фона
	loader.load(require('./grad2.jpg'), (texture) => {
    	scene.background = texture;
	})
	const canvas = document.querySelector('.canvas');
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
	scene.add(camera);

	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(sizes.width, sizes.height);
	renderer.render(scene, camera);

	return { sizes, scene, canvas, camera, renderer};
};

export default init;
