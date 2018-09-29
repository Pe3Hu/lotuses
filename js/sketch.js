let container, stats, raycaster, mouse;
let camera, scene, renderer, controls;
let edgeLength = 25;
let h = Math.sqrt(3)/2*edgeLength*2;
let meshs, lotuses, rhombuses;
let leftMesh, rightMesh, layer;

init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x909090 );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 600 );
	scene.add( camera );
	let light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

  let divisions = 1000, s = 25*divisions;
  let gridHelper = new THREE.GridHelper( s, divisions );
  gridHelper.rotateX(Math.PI/2)
  scene.add( gridHelper );

	controls = new THREE.OrbitControls( camera);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );

	game();

	//
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mousedown', onMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onMouseDown( event )		{
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}
function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	render();
}
function render() {
	renderer.render( scene, camera );
}
function game(){

	let geometry = new THREE.BufferGeometry();
	let vertices = new Float32Array( [
		0, -edgeLength, 0,
		0, edgeLength, 0,
		-edgeLength*Math.cos(Math.PI/3), 0, 0,
	] );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	let material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	leftMesh = new THREE.Mesh( geometry, material );

	material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
	geometry = new THREE.BufferGeometry();
	vertices = new Float32Array( [
		edgeLength*Math.cos(Math.PI/3), 0, 1,
		0, edgeLength, 0,
		0, -edgeLength, 0,
	] );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	rightMesh = new THREE.Mesh( geometry, material );


	layer = 0;
	meshs = [];
	rhombuses = [];
	lotuses = [];

	createLayer(meshs, layer, 6); layer++;
	createLayer(meshs, layer, 6); layer++;
	createLayer(meshs, layer, 6);
	for (let i=0; i<meshs.length; i++)
		for (let j=0; j<meshs[i].length; j++)
			rhombuses.push({meshs: meshs[i][j], hidden: true, count: 0});
	//console.log(rhombuses);

	correctMumbering();


	for (let i=0; i<rhombuses.length; i++)
		if (!rhombuses[i].hidden){
				scene.add(rhombuses[i].meshs);
		}
	console.log(lotuses);

}
function createLayer(array, a, maxA){
	let angle = Math.PI/3, offsetZ = 1;
	let l = edgeLength*layer, extraAngle = 0, extraRotateZ = 3;
	switch (a){
		case 0: {
			l = edgeLength;
			extraAngle = 0;
			extraRotateZ = 0;
    	break;
		}
		case 1: {
			l = h;
			extraAngle = 0.5;
			extraRotateZ = 5;
	    break;
		}
	}

	array.push([]);
	if ((layer==0) || (layer%2==1))
		for (let j=0; j<6; j++)
			//for (let i=0; i<layer+1; i++)
			{
					let x = Math.sin((j+extraAngle)*angle)*l;
					let y = Math.cos((j+extraAngle)*angle)*l;
					let Vec3 = new THREE.Vector3(x,y,offsetZ);
					let rotateZ = -angle*(j*Math.ceil((a+1)/2)+extraRotateZ);
					createRhombus(array, Vec3, rotateZ, "lr");
			}
		else
		for (let j=0; j<3; j++){
			for (let u=0; u<layer; u++){
				let x = Math.sin((u+j*2)*Math.PI/3)*edgeLength*(layer);
				let y = Math.cos((u+j*2)*Math.PI/3)*edgeLength*(layer);
				let move = new THREE.Vector3(x,y,0);
				if (u==0){
					let Vec3 = new THREE.Vector3(
						move.x+Math.sin((-1+2*j)*Math.PI/3)*edgeLength,
						move.y+Math.cos((-1+2*j)*Math.PI/3)*edgeLength,
						offsetZ);
					let rotateZ = -Math.PI/3*(j*2+2);
					createRhombus(array, Vec3, rotateZ, "rl");
				}
				for (let k=0; k<2; k++){
					let Vec3 = new THREE.Vector3(
						move.x+Math.sin((k+j*2)*Math.PI/3)*edgeLength,
						move.y+Math.cos((k+j*2)*Math.PI/3)*edgeLength,
						offsetZ);
					let rotateZ = -Math.PI/3*(3+k+j*2);
					createRhombus(array, Vec3, rotateZ, "rl");
				}

				if (u==layer-1){
					let Vec3 = new THREE.Vector3(
						move.x+Math.sin((2+2*j)*Math.PI/3)*edgeLength,
						move.y+Math.cos((2+2*j)*Math.PI/3)*edgeLength,
						offsetZ);
					let rotateZ = -Math.PI/3*(j*2-1);
					createRhombus(array, Vec3, rotateZ, "rl");
				}
			}
		}
	}
function createRhombus(array, pos, rotate, string){
		let a = array.length-1;
		if (string == "lr"){
			array[a].push(leftMesh.clone());
			array[a].push(rightMesh.clone());
		}
		if (string == "rl"){
			array[a].push(rightMesh.clone());
			array[a].push(leftMesh.clone());
		}
		//scene.add(meshs[a][meshs[a].length-1]);
		array[a][meshs[a].length-2].position.set(pos.x, pos.y, pos.z);
		array[a][meshs[a].length-2].rotateZ(rotate);

		//scene.add(meshs[a][meshs[a].length-1]);
		array[a][meshs[a].length-1].position.set(pos.x, pos.y, pos.z);
		array[a][meshs[a].length-1].rotateZ(rotate);
}
function correctMumbering(){
	for (let i=0; i<7; i++){
		lotuses.push([]);
		for (let j=0; j<12; j++){
			let flag = false;
			if (i==0){
				flag = true;
				rhombuses[j].hidden = false;
			}
			let petal = new Petal(i*12+j, i, j, flag);
			lotuses[i].push(petal);
		}
	}

	for (let i=0; i<6; i++)
			for (let j=0; j<2; j++){
				let index = i*2+j;
				let a = (4*i+7-index)%12;
				lotuses[(i+1)%7][a].id = index;
				lotuses[(i+1)%7][a].currectID = true;
			}

	for (let i=0; i<6; i++)
		for (let j=0; j<2; j++){
			let index = 12+i*2+j;
			let b = (index-2)%12;
			let a = (17+4*i-index)%12;
			lotuses[(i+1)%7][a].id = index;
			lotuses[(i+1)%7][a].currectID = true;
			lotuses[(i+1)%6+1][b].id = index;
			lotuses[(i+1)%6+1][b].currectID = true;
			rhombuses[index].hidden = false;
		}

	for (let i=0; i<6; i++)
		for (let j=0; j<6; j++){
			let index = 24+i*6+j;
			let a = (10+j+2*i)%12;
			lotuses[i+1][a].id = index;
			lotuses[i+1][a].currectID = true;
			rhombuses[index].hidden = false;
			//console.log(i+1, a);
		}

	//let sum = 0; 	sum+=rhombuses[i].count;
	for (let i=0; i<lotuses.length; i++)
		for (let j=0; j<lotuses[i].length; j++)
			if (lotuses[i][j].currectID)
				rhombuses[lotuses[i][j].id].count++;
}
