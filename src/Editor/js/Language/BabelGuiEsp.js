/**
* @author Joel Espinosa Longi
* @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
*/

var babel = (function(babel) {

 /**
  * Translate to save the configuration
  */
 babel.GUIesp = 
 {
	configuration: "Configuración",
	buttons: "Escena",
	spaces: "Espacios",
	controls: "Controles",
	definitions: "Definiciones",
	programs: "Programa",
	graphics: "Gráficos",
	graphics3D: "Gráficos 3D",
	animation: "Animación",
	width: "ancho",
	height: "alto",
	about_SCENE: "botón créditos",
	config_SCENE: "botón config",
	init_SCENE: "botón inicio",
	clear_SCENE: "botón limpiar",
	rowsNorth: "filas al norte",
	rowsSouth: "filas al sur",
	widthWest: "ancho oeste",
	widthEast: "ancho este",
	heightRows: "alto filas",
	decimal_symbol: "signo decimal",
	language: "idioma",
	español: "español",
	english: "inglés",
	deutsch: "alemán",
	catalan: "catalán",
	euskera: "euskera",
	french: "francés",
	gallego: "gallego",
	italian: "italiano",
	portuguese: "portugués",
	valencian: "valenciano",
	editable_buttons: "mostrar región exterior",
	expand: "expandir escena",
	cover: "cubrir",
	fit: "escalar",
	image_loader: "imagen del cargador",
	info: "info",
	id: "id",
	drawif: "dibujar si",
	x: "x",
	y: "y",
	resizable: "redimensionable",
	fixed: "fijo",
	scale: "escala",
	"O.x": "O.x",
	"O.y": "O.y",
	image: "imagen",
	bg_display: "despliegue de imagen",
	topleft: "arr-izq",
	stretch: "expandir",
	patch: "mosaico",
	imgcenter: "centrada",
	background: "fondo",
	axes: "ejes",
	net: "red",
	net10: "red10",
	text: "texto",
	numbers: "números",
	x_axis: "eje x",
	y_axis: "eje y",
	render: "despliegue",
	sort: "orden",
	painter: "pintor",
	raytrace: "trazado de rayos",
	split: "cortar",
	file: "archivo",
	sensitive_to_mouse_movements: "sensible a los movimientos del ratón",
	border_width: "ancho del borde",
	border_color: "color del borde",
	label_color: "color etiqueta",
	label_text_color: "color texto etiqueta",
	gui: "interfaz",
	spinner: "pulsador",
	textfield: "campo de texto",
	menu: "menú",
	scrollbar: "barra",
	button: "botón",
	checkbox: "casilla de verificación",
	graphic: "gráfico",
	audio: "audio",
	video: "video",
	name: "nombre",
	region: "región",
	north: "norte",
	south: "sur",
	east: "este",
	west: "oeste",
	interior: "interior",
	external: "exterior",
	space: "espacio",
	activeif: "activo si",
	exponentialif: "exponencial si",
	expression: "expresión",
	value: "valor",
	decimals: "decimales",
	visible: "visible",
	discrete: "discreto",
	incr: "incr",
	min: "min",
	max: "max",
	action: "acción",
	calculate: "calcular",
	init: "inicio",
	clear: "limpiar",
	openURL: "abrir URL",
	openScene: "abrir escena",
	playAudio: "reproducir",
	animate: "animar",
	initAnimation: "reiniciar animación",
	parameter: "parámetro",
	onlyText: "solo texto",
	evaluate: "evaluar",
	answer: "respuesta",
	options: "opciones",
	color_BTN: "color texto",
	border: "borde texto",
	borderColor: "borde texto",
	colorInt: "color interior",
	flat: "sin degradado",
	extra_style: "estilo extra",
	font_family: "fuente",
	font_size: "tam fuente",
	bold: "negrita",
	italics: "cursiva",
	underlined: "subrayada",
	text_align: "pos texto",
	image_align: "pos imagen",
	a_top_left: "arriba-izquierda",
	a_top_center: "arriba-centro",
	a_top_right: "arriba-derecha",
	a_center_left: "centro-izquierda",
	a_center_center: "centro-centro",
	a_center_right: "centro-derecha",
	a_bottom_left: "abajo-izquierda",
	a_bottom_center: "abajo-centro",
	a_bottom_right: "abajo-derecha",
	radio_group: "grupo",
	size: "tamaño",
	constraint: "constricción",
	color: "color",
	btn_pos: "posición de botones",
	v_left: "vertical izquierda",
	v_right: "vertical derecha",
	h_left: "horizontal izquierda",
	h_right: "horizontal derecha",
	h_left_right: "horizontal extremos",
	image_dec: "imagen decremento",
	image_inc: "imagen incremento",
	array: "vector",
	matrix: "matriz",
	"function": "función",
	variable: "variable",
	library: "biblioteca",
	algorithm: "algoritmo",
	"event": "evento",
	onlyOnce: "una sola vez",
	always: "siempre",
	columns: "columnas",
	rows: "filas",
	range: "dominio",
	local: "local",
	doExpr: "hacer",
	whileExpr: "mientras",
	condition: "condición",
	execution: "ejecución",
	alternate: "alternar",
	equation: "ecuación",
	curve: "curva",
	point: "punto",
	segment: "segmento",
	polygon: "polígono",
	rectangle: "rectángulo",
	arrow: "flecha",
	arc: "arco",
	sequence: "sucesión",
	fill: "relleno",
	macro: "macro",
	trace: "rastro",
	abs_coord: "coord abs",
	family: "parámetro",
	useFamily: "familia",
	family_interval: "intervalo",
	family_steps: "pasos",
	parameter_interval: "intervalo",
	parameter_steps: "pasos",
	fillP: "relleno positivo",
	fillM: "relleno negativo",
	lineDash: "estilo de línea",
	solid: "solida",
	dot: "· · · ·",
	dash: "− − − −",
	border_radius: "radio del borde",
	spear: "punta",
	center: "centro",
	radius: "radio",
	end: "fin",
	vectors: "vectores",
	align: "alineación del texto",
	a_center: "centro",
	a_left: "izquierda",
	a_right: "derecha",
	a_justify: "justificar",
	anchor: "punto de anclaje",
	width_TEXT: "ancho del texto",
	inirot_IMG: "rotación",
	opacity: "opacidad",
	inipos_MACRO: "posición",
	inirot_MACRO: "rotación",
	expression_MACRO: "archivo",
	border_size: "tamaño del borde",
	shadowColor: "sombra",
	shadowBlur: "desenfoque sombra",
	shadowOffsetX: "desplazamiento de sombra X",
	shadowOffsetY: "desplazamiento de sombra Y",
	triangle: "triángulo",
	face: "cara",
	polireg: "polígono regular",
	surface: "superficie",
	cube: "cubo",
	box: "paralelepípedo",
	tetrahedron: "tetraedro",
	octahedron: "octaedro",
	dodecahedron: "dodecaedro",
	icosahedron: "icosaedro",
	sphere: "esfera",
	ellipsoid: "elipsoide",
	cone: "cono",
	cylinder: "cilindro",
	torus: "toro",
	backcolor: "color reverso",
	model: "modelo",
	light: "luz",
	metal: "metal",
	wire: "alambre",
	inirot: "rotini",
	inipos: "posini",
	endrot: "rotfin",
	endpos: "posfin",
	offset_dist: "distancia",
	offset_angle: "ángulo",
	Nu: "Nu",
	Nv: "Nv",
	edges: "aristas",
	length: "largo",
	R: "R",
	r: "r",
	useAnimation: "Animación",
	delay: "pausa",
	auto: "auto",
	loop: "repetir",
	ok_btn: "Aceptar",
	close_btn: "Cerrar",
	apply_btn: "Aplicar",
	cancel_btn: "Cancelar",
	copy_btn: "Copiar",
	paste_btn: "Pegar",
	"continue": "Continuar",
	"000000": "negro",
	"ff00ff": "magenta",
	"0000ff": "azul",
	"00ffff": "turquesa",
	"00ff00": "verde",
	"ffff00": "amarillo",
	"ffc800": "naranja",
	"ff0000": "rojo",
	"ffafaf": "rosa",
	"404040": "grisObscuro",
	"808080": "gris",
	"c0c0c0": "grisClaro",
	"ffffff": "blanco",
	"new": "Nuevo",
	new_window: "Nueva ventana",
	open: "Abrir",
	open_url: "Abrir URL",
	reload: "Recargar",
	save: "Guardar",
	save_as: "Guardar como",
	container_dir: "Mostrar carpeta contenedora",
	export_macro: "macro de Descartes",
	export_library: "biblioteca de Descartes",
	export_png: "png",
	export_jpg: "jpg",
	export_svg: "svg",
	export_pdf: "pdf",
	export_pstricks: "pstricks (experimental)",
	close_scene: "Cerrar escena",
	exit: "Salir",
	open_recent: "Abrir reciente",
	export: "Exportar a",
	internet: "en internet",
	portable: "portable",
	project: "de proyecto",
	custom: "personalizada",
	min_type_internet: "internet",
	min_type_portable: "portable",
	min_type_proyecto: "proyecto",
	min_type_personalizada: "personalizada",
	zoom: "Zoom",
	zoom_plus: "Aumentar",
	zoom_minus: "Reducir",
	zoom_original: "Inicial",
	language_menu: "Lenguaje",
	language_Esp: "Español",
	language_Ing: "Inglés",
	language_Ale: "Alemán",
	language_Cat: "Catalán",
	language_Eus: "Euskera",
	language_Fre: "Francés",
	language_Gal: "Gallego",
	language_Ita: "Italiano",
	language_Por: "Portugués",
	language_Val: "Valenciano",
	theme: "Tema de color",
	theme_light: "Claro",
	theme_dark: "Obscuro",
	theme_blue: "Azul",
	theme_default: "Clásico",
	embed_menu: "Agregar al HTML",
	console: "Mostrar consola",
	title_console: "Consola Descartes",
	documentation: "Documentación",
	about_menu: "Acerca de Descartes",
	release_notes_menu: "Notas de la versión",
	file_menu: "Archivo",
	option_menu: "Opciones",
	help_menu: "Ayuda",
	clear_open_recent: "Vaciar menú",
	block_0: "Latino básico",
	block_1: "Latino 1",
	block_2: "Latino extendido A",
	block_3: "Latino extendido B",
	block_4: "Griego básico",
	block_5: "Cirílico",
	block_6: "Hebreo básico",
	block_7: "Árabe básico",
	block_8: "Puntuación general",
	block_9: "Símbolos de moneda",
	block_10: "Símbolos tipo carta",
	block_11: "Formatos de números",
	block_12: "Flechas",
	block_13: "Operadores matemáticos",
	block_14: "Bordes de cuadros",
	block_15: "Elementos de bloque",
	block_16: "Símbolos variados",
	add_spaces: "Agregar espacio",
	add_controls: "Agregar control",
	add_definitions: "Agregar definición",
	add_programs: "Agregar programa",
	add_graphics: "Agregar gráfico",
	add_graphics3D: "Agregar gráfico 3D",
	add_element: "Agregar",
	remove_spaces: "Eliminar espacio",
	remove_controls: "Eliminar control",
	remove_definitions: "Eliminar definición",
	remove_programs: "Eliminar programa",
	remove_graphics: "Eliminar gráfico",
	remove_graphics3D: "Eliminar gráfico 3D",
	remove_element: "Eliminar",
	clone_spaces: "Clonar espacio",
	clone_controls: "Clonar control",
	clone_definitions: "Clonar definición",
	clone_programs: "Clonar programa",
	clone_graphics: "Clonar gráfico",
	clone_graphics3D: "Clonar gráfico 3D",
	clone_element: "Clonar",
	descartes_location_question: "¿Cuál es la ubicación del archivo <i><b>descartes-min.js</b></i> que desea utilizar?",
	to_grayscale: "¿Convertir los colores a escala de grises?",
	white_background: "¿Cambiar el color de fondo (no transparente) de los espacios a blanco?",
	pstricks_title: "Opciones de exportación a PSTricks",
	reload_content: "Si continua se perderan los cambios<br>¿Desea continuar?",
	save_content: "¿Desea guardar los cambios?",
	update_text: "Hay actualizaciones disponibles.<br>¿Desea instalarlas?",
	loader_text: "Espere un momento por favor.",
	"undefined": "---",
  }

  return babel;
})(babel || {});