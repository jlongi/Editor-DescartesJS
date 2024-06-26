/**
* @author Joel Espinosa Longi
* @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
*/

var babel = (function(babel) {

 /**
  * Translate to save the configuration
  */
 babel.GUIgal = 
 {
	configuration: "Configuración",
	buttons: "Escena",
	spaces: "Espazos",
	controls: "Controis",
	definitions: "Definicións",
	programs: "Programa",
	graphics: "Gráficos",
	graphics3D: "Gráficos 3D",
	animation: "Animación",
	titleTag: "Título da páxina",
	width: "ancho",
	height: "alto",
	about_SCENE: "botón créditos",
	config_SCENE: "botón config",
	init_SCENE: "botón inicio",
	clear_SCENE: "botón limpar",
	rowsNorth: "filas ao norte",
	rowsSouth: "filas ao sur",
	widthWest: "ancho oeste",
	widthEast: "ancho leste",
	heightRows: "alto filas",
	decimal_symbol: "signo decimal",
	language: "idioma",
	español: "castelán",
	english: "inglés",
	deutsch: "alemán",
	catalan: "catalán",
	euskera: "euskera",
	french: "francés",
	gallego: "galego",
	italian: "italiano",
	portuguese: "portugués",
	valencian: "valenciano",
	editable_buttons: "mostrar rexión externa",
	expand: "expandir escea",
	cover: "cubrir",
	fit: "axustar",
	image_loader: "imaxe do cargador",
	info: "info",
	id: "id",
	drawif: "debuxar se",
	x: "x",
	y: "y",
	resizable: "axustable",
	fixed: "fixo",
	scale: "escala",
	"O.x": "O.x",
	"O.y": "O.y",
	image: "imaxe",
	bg_display: "despregamento de imaxe",
	topleft: "arr-esq",
	stretch: "estirar",
	patch: "mosaico",
	imgcenter: "centrada",
	background: "fondo",
	axes: "eixes",
	net: "rede",
	net10: "rede10",
	text: "texto",
	numbers: "números",
	x_axis: "eixe x",
	y_axis: "eixe y",
	render: "despregamento",
	sort: "orde",
	painter: "pintor",
	raytrace: "trazado de raios",
	split: "cortar",
	file: "arquivo",
	sensitive_to_mouse_movements: "sensible aos movementos do rato",
	border_width: "ancho de bordo",
	border_color: "cor da fronteira",
	label_color: "cor da etiqueta",
	label_text_color: "cor de texto da etiqueta",
	gui: "interface",
	spinner: "pulsador",
	slider: "control deslizante",
	textfield: "campo de texto",
	menu: "menú",
	scrollbar: "barra",
	button: "botón",
	checkbox: "casa de verificación",
	graphic: "gráfico",
	audio: "audio",
	video: "vídeo",
	name: "nome",
	region: "rexión",
	north: "norte",
	south: "sur",
	east: "leste",
	west: "oeste",
	interior: "interior",
	external: "exterior",
	space: "espazo",
	activeif: "activo se",
	exponentialif: "exponencial se",
	expression: "expresión",
	value: "valor",
	decimals: "decimais",
	visible: "visible",
	discrete: "discreto",
	incr: "incr",
	min: "min",
	max: "max",
	action: "acción",
	calculate: "calcular",
	init: "inicio",
	clear: "limpar",
	openURL: "abrir URL",
	openScene: "abrir escena",
	playAudio: "reproducir",
	animate: "animar",
	initAnimation: "reiniciar animación",
	parameter: "parámetro",
	onlyText: "só texto",
	evaluate: "avalía",
	answer: "resposta",
	options: "opcións",
	color_BTN: "cor texto",
	border: "borde texto",
	borderColor: "borde texto",
	colorInt: "cor interior",
	flat: "sen degradado",
	extra_style: "estilo adicional",
	font_family: "fonte",
	font_size: "tam fonte",
	bold: "negriña",
	italics: "cursiva",
	underlined: "subliñar",
	text_align: "pos texto",
	image_align: "pos imaxe",
	a_top_left: "arriba-esquerda",
	a_top_center: "arriba-centro",
	a_top_right: "arriba-dereita",
	a_center_left: "centro-esquerda",
	a_center_center: "centro-centro",
	a_center_right: "centro-dereita",
	a_bottom_left: "abaixo-esquerda",
	a_bottom_center: "abaixo-centro",
	a_bottom_right: "abaixo-dereita",
	radio_group: "grupo",
	size: "tamaño",
	constraint: "constricción",
	color: "cor",
	btn_pos: "posición dos botóns",
	v_left: "vertical esquerda",
	v_right: "vertical dereita",
	h_left: "horizontal esquerda",
	h_right: "horizontal dereita",
	h_left_right: "horizontal extremos",
	image_dec: "imaxe de decremento",
	image_inc: "imaxe da aumento",
	position: "posición",
	keyboard: "teclado",
	kblayout: "disposición do teclado",
	kbexp: "posición do teclado",
	array: "vector",
	matrix: "matriz",
	"function": "función",
	variable: "variable",
	library: "biblioteca",
	algorithm: "algoritmo",
	"event": "evento",
	onlyOnce: "unha soa vez",
	always: "sempre",
	columns: "columnas",
	rows: "filas",
	range: "dominio",
	local: "local",
	doExpr: "facer",
	whileExpr: "mentres",
	condition: "condición",
	execution: "execución",
	alternate: "alternar",
	equation: "ecuación",
	curve: "curva",
	point: "punto",
	segment: "segmento",
	polygon: "polígono",
	rectangle: "rectángulo",
	arrow: "frecha",
	arc: "arco",
	sequence: "sucesión",
	fill: "recheo",
	macro: "macro",
	trace: "rastro",
	abs_coord: "coord abs",
	family: "parámetro",
	useFamily: "familia",
	family_interval: "intervalo",
	family_steps: "pasps",
	parameter_interval: "intervalo",
	parameter_steps: "pasos",
	fillP: "recheo positivo",
	fillM: "recheo negativo",
	lineDash: "estilo de liña",
	solid: "sólida",
	dot: "· · · ·",
	dash: "− − − −",
	border_radius: "raio do borde",
	spear: "punta",
	center: "centro",
	radius: "raio do borde",
	end: "fin",
	vectors: "vectores",
	align: "alineación do texto",
	a_center: "centro",
	a_left: "esquerda",
	a_right: "dereita",
	a_justify: "xustificar",
	anchor: "punto de ancoraxe",
	width_TEXT: "ancho de texto",
	inirot_IMG: "rotación",
	opacity: "opacidade",
	inipos_MACRO: "posición",
	inirot_MACRO: "rotación",
	expression_MACRO: "arquivo",
	border_size: "tamaño da fronteira",
	shadowColor: "sombra",
	shadowBlur: "borrosa de sombras",
	shadowOffsetX: "compensación de sombras X",
	shadowOffsetY: "compensación de sombras Y",
	clip: "rexión de recorte",
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
	torus: "touro",
	backcolor: "cor reverso",
	model: "modelo",
	light: "luz",
	metal: "metal",
	wire: "arame",
	inirot: "rotini",
	inipos: "posini",
	endrot: "rotfin",
	endpos: "posfin",
	offset_dist: "distancia",
	offset_angle: "ángulo",
	Nu: "Nu",
	Nv: "Nv",
	edges: "arestas",
	length: "largo",
	R: "R",
	r: "r",
	useAnimation: "Animación",
	delay: "pausa",
	auto: "auto",
	loop: "repetir",
	ok_btn: "Aceptar",
	close_btn: "Pechar",
	apply_btn: "Aplicar",
	cancel_btn: "Cancelar",
	copy_btn: "Copiar",
	paste_btn: "Pegar",
	"continue": "Continuar",
	"000000": "negro",
	"ff00ff": "maxenta",
	"0000ff": "azul",
	"00ffff": "turquesa",
	"00ff00": "verde",
	"ffff00": "amarelo",
	"ffc800": "laranxa",
	"ff0000": "vermello",
	"ffafaf": "rosa",
	"404040": "grisEscuro",
	"808080": "gris",
	"c0c0c0": "grisClaro",
	"ffffff": "branco",
	pattern: "Patrón",
	gradient: "Degradado",
	stop: "Pare",
	"new": "Novo",
	new_window: "Nova xanela",
	open: "Abrir",
	open_url: "Abrir URL",
	reload: "Recargar",
	save: "Gardar",
	save_as: "Gardar como",
	container_dir: "Mostrar o cartafol dos contedores",
	open_in_browser: "Mostrar no navegador web",
	edit_scene: "Editar escena ",
	export_macro: "macro de Descartes",
	export_library: "biblioteca de Descartes",
	export_png: "png",
	export_jpg: "jpg",
	export_svg: "svg",
	export_pdf: "pdf",
	export_pstricks: "pstricks (experimental)",
	close_scene: "Pechar escena",
	exit: "Saír",
	open_recent: "Abrir recente",
	export: "Exportar a",
	internet: "en internet",
	portable: "portable",
	project: "de proxecto",
	custom: "personalizada",
	min_type_internet: "internet",
	min_type_portable: "portable",
	min_type_proyecto: "proxecto",
	min_type_personalizada: "personalizada",
	zoom: "Zoom",
	zoom_plus: "Aumentar",
	zoom_minus: "Diminuír",
	zoom_original: "Inicial",
	language_menu: "Linguaxe",
	language_Esp: "Castelán",
	language_Ing: "Inglés",
	language_Ale: "Alemán",
	language_Cat: "Catalán",
	language_Eus: "Euskera",
	language_Fra: "Francés",
	language_Gal: "Galego",
	language_Ita: "Italiano",
	language_Por: "Portugués",
	language_Val: "Valenciano",
	theme: "Tema de Cor",
	theme_light: "Claro",
	theme_dark: "Escuro",
	theme_blue: "Azul",
	theme_default: "Clásico",
	embed_menu: "Engadir a HTML",
	console: "Mostrar consola",
	title_console: "Consola Descartes",
	documentation: "Documentación",
	about_menu: "Sobre Descartes",
	release_notes_menu: "Notas da versión",
	file_menu: "Arquivo",
	option_menu: "Opcións",
	help_menu: "Axuda",
	clear_open_recent: "Baleirar menú",
	block_0: "Latín básico",
	block_1: "Latín 1",
	block_2: "Latín extendido A",
	block_3: "Latín extendido B",
	block_4: "Grego básico",
	block_5: "Cirílico",
	block_6: "Hebreo básico",
	block_7: "Árabe básico",
	block_8: "Puntuación xeral",
	block_9: "Símbolos de moeda",
	block_10: "Símbolos tipo carta",
	block_11: "Formatos de números",
	block_12: "Frechas",
	block_13: "Operadores matemáticos",
	block_14: "Bordes de cadros",
	block_15: "Elementos de bloque",
	block_16: "Símbolos variados",
	add_spaces: "Engadir espazo",
	add_controls: "Engadir control",
	add_definitions: "Engadir definición",
	add_programs: "Engadir programa",
	add_graphics: "Engadir gráfico",
	add_graphics3D: "Engadir gráfico 3D",
	add_element: "Engadir",
	remove_spaces: "Eliminar espazo",
	remove_controls: "Eliminar control",
	remove_definitions: "Eliminar definición",
	remove_programs: "Eliminar programa",
	remove_graphics: "Eliminar gráfico",
	remove_graphics3D: "Eliminar gráfico 3D",
	remove_element: "Eliminar",
	clone_spaces: "Clonar espazo",
	clone_controls: "Clonar control",
	clone_definitions: "Clonar definición",
	clone_programs: "Clonar programa",
	clone_graphics: "Clonar gráfico",
	clone_graphics3D: "Clonar gráfico 3D",
	clone_element: "Clonar",
	descartes_location_question: "Onde está situado o arquivo <i><b>descartes-min.js</b></i>?",
	to_grayscale: "Convertir as cores a escala de grises?",
	white_background: "Cambiar a cor de fondo (non transparente) dos espazos en branco?",
	pstricks_title: "Opcións de exportación a PSTricks",
	reload_content: "Se continúa vanse perder os cambios<br>Dexesa continuar?",
	save_content: "Desexa gardar os cambios?",
	update_text: "Hai actualizacións dispoñibles.<br>¿Queres instalalas?",
	loader_text: "Agarde un momento, por favor.",
	parts: "pezas",
	"undefined": "---",
  }

  return babel;
})(babel || {});