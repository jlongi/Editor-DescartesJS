/**
* @author Joel Espinosa Longi
* @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
*/

var babel = (function(babel) {

 /**
  * Translate to save the configuration
  */
 babel.GUIcat = 
 {
	configuration: "Configuració",
	buttons: "Escena",
	spaces: "Espais",
	controls: "Controls",
	definitions: "Definicions",
	programs: "Programa",
	graphics: "Gràfics",
	graphics3D: "Gràfics 3D",
	animation: "Animació",
	width: "amplada",
	height: "alçada",
	about_SCENE: "botó crèdits",
	config_SCENE: "botó config",
	init_SCENE: "botó inici",
	clear_SCENE: "botó neteja",
	rowsNorth: "files al nord",
	rowsSouth: "files al sud",
	widthWest: "ample oest",
	widthEast: "ample est",
	heightRows: "alçada files",
	decimal_symbol: "signe decimal",
	language: "idioma",
	español: "espanyol",
	english: "anglès",
	deutsch: "alemany",
	catalan: "català",
	euskera: "eusquera",
	french: "francès",
	gallego: "gallec",
	italian: "italià",
	portuguese: "portuguès",
	valencian: "valencià",
	editable_buttons: "mostra regió exterior",
	expand: "expandeix escena",
	cover: "cobreix",
	fit: "escalar",
	image_loader: "imatge del carregador",
	info: "info",
	id: "id",
	drawif: "dibuixa si",
	x: "x",
	y: "y",
	resizable: "de mida variable",
	fixed: "fix",
	scale: "escala",
	"O.x": "O.x",
	"O.y": "O.y",
	image: "imatge",
	bg_display: "desplegament d´imatge",
	topleft: "dalt-esq",
	stretch: "expandeix",
	patch: "mosaic",
	imgcenter: "centrada",
	background: "fons",
	axes: "eixos",
	net: "xarxa",
	net10: "xarxa10",
	text: "text",
	numbers: "nombres",
	x_axis: "eix x",
	y_axis: "eix y",
	render: "desplegament",
	sort: "ordre",
	painter: "pintor",
	raytrace: "traçat de raigs",
	split: "tallar",
	file: "fitxer",
	sensitive_to_mouse_movements: "sensible als moviments del ratolí",
	gui: "interfície",
	spinner: "polsador",
	textfield: "camp de text",
	menu: "menú",
	scrollbar: "barra",
	button: "botó",
	checkbox: "casella de verificació",
	graphic: "gràfic",
	audio: "àudio",
	video: "vídeo",
	name: "nom",
	region: "regió",
	north: "nord",
	south: "sud",
	east: "est",
	west: "oest",
	interior: "interior",
	external: "exterior",
	space: "espai",
	activeif: "actiu si",
	exponentialif: "exponencial si",
	expression: "expressió",
	value: "valor",
	decimals: "decimals",
	visible: "visible",
	discrete: "discret",
	incr: "incr",
	min: "min",
	max: "max",
	action: "acció",
	calculate: "calcula",
	init: "inici",
	clear: "neteja",
	openURL: "obre URL",
	openScene: "obre escena",
	playAudio: "reprodueix",
	animate: "anima",
	initAnimation: "reinicia animació",
	parameter: "paràmetre",
	onlyText: "només text",
	evaluate: "avalua",
	answer: "resposta",
	options: "opcions",
	color_BTN: "color text",
	border: "vora text",
	borderColor: "vora text",
	colorInt: "color interior",
	flat: "sense degradat",
	font_family: "font",
	font_size: "mida font",
	bold: "negreta",
	italics: "cursiva",
	underlined: "subratllat",
	text_align: "pos text",
	image_align: "pos imatge",
	a_top_left: "dalt-esquerra",
	a_top_center: "dalt-centre",
	a_top_right: "dalt-dreta",
	a_center_left: "centre-esquerra",
	a_center_center: "centre-centre",
	a_center_right: "centre-dreta",
	a_bottom_left: "avall-esquerra",
	a_bottom_center: "avall-centre",
	a_bottom_right: "avall-dreta",
	radio_group: "grup",
	size: "grandària",
	constraint: "constricció",
	color: "color",
	array: "vector",
	matrix: "matriu",
	"function": "funció",
	variable: "variable",
	library: "biblioteca",
	algorithm: "algorisme",
	"event": "esdeveniment",
	onlyOnce: "només una vegada",
	always: "sempre",
	columns: "columnes",
	rows: "files",
	range: "domini",
	local: "local",
	doExpr: "fes",
	whileExpr: "mentre",
	condition: "condició",
	execution: "execució",
	alternate: "alterna",
	equation: "equació",
	curve: "corba",
	point: "punt",
	segment: "segment",
	polygon: "polígon",
	rectangle: "rectangle",
	arrow: "fletxa",
	arc: "arc",
	sequence: "successió",
	fill: "ple",
	macro: "macro",
	trace: "rastre",
	abs_coord: "coord abs",
	family: "paràmetre",
	useFamily: "família",
	family_interval: "interval",
	family_steps: "passes",
	parameter_interval: "interval",
	parameter_steps: "passes",
	fillP: "ple positiu",
	fillM: "ple negatiu",
	lineDash: "estil de línia",
	solid: "sòlida",
	dot: "· · · ·",
	dash: "− − − −",
	border_radius: "radi de la vora",
	spear: "punta",
	center: "centre",
	radius: "radi",
	end: "fi",
	vectors: "vectors",
	align: "alineació del text",
	a_center: "centre",
	a_left: "esquerra",
	a_right: "dreta",
	a_justify: "justificar",
	anchor: "punt d´ancoratge",
	width_TEXT: "amplada del text",
	inirot_IMG: "rotació",
	opacity: "opacitat",
	inipos_MACRO: "posició",
	inirot_MACRO: "rotació",
	expression_MACRO: "fitxer",
	triangle: "triangle",
	face: "cara",
	polireg: "polígon regular",
	surface: "superfície",
	cube: "cub",
	box: "paral·lelepípede",
	tetrahedron: "tetraedre",
	octahedron: "octaedre",
	dodecahedron: "dodecaedre",
	icosahedron: "icosaedre",
	sphere: "esfera",
	ellipsoid: "el·lipsoide",
	cone: "con",
	cylinder: "cilindre",
	torus: "tor",
	backcolor: "color revers",
	model: "model",
	light: "llum",
	metal: "metall",
	wire: "filferro",
	inirot: "rotini",
	inipos: "posini",
	endrot: "rotfin",
	endpos: "posfin",
	offset_dist: "distància",
	offset_angle: "angle",
	Nu: "Nu",
	Nv: "Nv",
	edges: "arestes",
	length: "llarg",
	R: "R",
	r: "r",
	useAnimation: "Animació",
	delay: "pausa",
	auto: "auto",
	loop: "repeteix",
	ok_btn: "Accepta",
	close_btn: "Tanca",
	apply_btn: "Aplica",
	cancel_btn: "Cancel·la",
	copy_btn: "Copia",
	paste_btn: "Enganxa",
	"continue": "Segueix",
	"000000": "negre",
	"ff00ff": "magenta",
	"0000ff": "blau",
	"00ffff": "turquesa",
	"00ff00": "verd",
	"ffff00": "groc",
	"ffc800": "taronja",
	"ff0000": "vermell",
	"ffafaf": "rosa",
	"404040": "grisFosc",
	"808080": "gris",
	"c0c0c0": "grisClar",
	"ffffff": "blanc",
	"new": "Nou",
	new_window: "Finestra nova",
	open: "Obre",
	open_url: "Obre URL",
	reload: "Torna a carregar",
	save: "Desa",
	save_as: "Desa com",
	container_dir: "Mostra carpeta contenidora",
	export_macro: "macro de Descartes",
	export_library: "biblioteca de Descartes",
	export_png: "png",
	export_jpg: "jpg",
	export_svg: "svg",
	export_pdf: "pdf",
	export_pstricks: "pstricks (experimental)",
	close_scene: "Tanca escena",
	exit: "Surt",
	open_recent: "Obre recent",
	export: "Exporta a ",
	internet: "a internet",
	portable: "portable",
	project: "de projecte",
	custom: "personalitzada",
	min_type_internet: "internet",
	min_type_portable: "portable",
	min_type_proyecto: "projecte",
	min_type_personalizada: "personalitzada",
	zoom: "Zoom",
	zoom_plus: "Augmentar",
	zoom_minus: "Disminuir",
	zoom_original: "Inicial",
	language_menu: "Llenguatge",
	language_Esp: "Espanyol",
	language_Ing: "Anglès",
	language_Ale: "Alemany",
	language_Cat: "Català",
	language_Eus: "Eusquera",
	language_Fre: "Francès",
	language_Gal: "Gallec",
	language_Ita: "Italià",
	language_Por: "Portuguès",
	language_Val: "Valencià",
	theme: "Tema de color",
	theme_light: "Clar",
	theme_dark: "Fosc",
	theme_blue: "Blau",
	theme_default: "Clàssic",
	console: "Mostra consola",
	title_console: "Consola Descartes",
	documentation: "Documentació",
	about_menu: "Sobre Descartes",
	release_notes_menu: "Notes de la versió",
	file_menu: "Fitxer",
	option_menu: "Opcions",
	help_menu: "Ajuda",
	clear_open_recent: "Buidar menú",
	block_0: "Llatí bàsic",
	block_1: "Llatí 1",
	block_2: "Llatí estès A",
	block_3: "Llatí estès B",
	block_4: "Grec bàsic",
	block_5: "Ciríl·lic",
	block_6: "Hebreu bàsic",
	block_7: "Àrab bàsic",
	block_8: "Puntuació general",
	block_9: "Símbols de monedes",
	block_10: "Símbols tipus cartes",
	block_11: "Formats de nombres",
	block_12: "Fletxes",
	block_13: "Operadors matemàtics",
	block_14: "Vores de quadres",
	block_15: "Elements de bloc",
	block_16: "Símbols variats",
	add_spaces: "Afegeix espai",
	add_controls: "Afegeix control",
	add_definitions: "Afegeix definició",
	add_programs: "Afegeix programa",
	add_graphics: "Afegeix gràfic",
	add_graphics3D: "Afegeix gràfic 3D",
	add_element: "Afegeix",
	remove_spaces: "Elimina espai",
	remove_controls: "Elimina control",
	remove_definitions: "Elimina definició",
	remove_programs: "Elimina programa",
	remove_graphics: "Elimina gràfic",
	remove_graphics3D: "Elimina gràfic 3D",
	remove_element: "Elimina",
	clone_spaces: "Clona espai",
	clone_controls: "Clona control",
	clone_definitions: "Clona definició",
	clone_programs: "Clona programa",
	clone_graphics: "Clona gràfic",
	clone_graphics3D: "Clona gràfic 3D",
	clone_element: "Clona",
	descartes_location_question: "Quina és la ubicació del fitxer <i><b>descartes-min.js</b></i> que voleu utilitzar?",
	to_grayscale: "Convertir els colors a escala de grisos?",
	white_background: "Canviar el color de fons (no transparent) dels espais a blanc?",
	pstricks_title: "Opcions d´exportació a PSTricks",
	reload_content: "Si seguiu es perdran els canvis<br> Voleu continuar?",
	save_content: "Voleu desar els canvis?",
	"undefined": "---",
  }

  return babel;
})(babel || {});