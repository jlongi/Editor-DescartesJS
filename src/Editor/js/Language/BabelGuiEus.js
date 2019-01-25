/**
* @author Joel Espinosa Longi
* @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
*/

var babel = (function(babel) {

 /**
  * Translate to save the configuration
  */
 babel.GUIeus = 
 {
	configuration: "Konfigurazio",
	buttons: "Eszena",
	spaces: "Espazioak",
	controls: "Kontrolak",
	definitions: "Definizioak",
	programs: "Programa",
	graphics: "Grafikoak",
	graphics3D: "3D grafikoak",
	animation: "Animazio",
	width: "zabalera",
	height: "altuera",
	about_SCENE: "kreditu botoia",
	config_SCENE: "konfigurazio botoia",
	init_SCENE: "hasiera botoia",
	clear_SCENE: "garbiketa botoia",
	rowsNorth: "lerroak iparraldera",
	rowsSouth: "lerroak hegoaldera",
	widthWest: "zabalera mendealdea",
	widthEast: "zabalera ekialdea",
	heightRows: "lerro altuera",
	decimal_symbol: "ikur hamartarra",
	language: "hizkuntza",
	español: "gaztelania",
	english: "ingelesa",
	deutsch: "alemaniako",
	catalan: "katalana",
	euskera: "euskara",
	french: "frantsesa",
	gallego: "galegoa",
	italian: "italiarra",
	portuguese: "portuguesa",
	valencian: "valentziarra",
	editable_buttons: "kanpoko eremua erakutsi",
	expand: "eszena zabaldu",
	cover: "estali",
	fit: "eskalatu",
	image_loader: "kargatzailearen irudia",
	info: "info",
	id: "id",
	drawif: "marraztu baldin eta",
	x: "x",
	y: "y",
	resizable: "birdimentsionagarria",
	fixed: "finko",
	scale: "eskala",
	"O.x": "O.x",
	"O.y": "O.y",
	image: "irudia",
	bg_display: "irudia zabaldu",
	topleft: "gora-ezk",
	stretch: "hedatu",
	patch: "mosaikoa",
	imgcenter: "zentratuta",
	background: "hondoa",
	axes: "ardatzak",
	net: "sarea",
	net10: "sarea10",
	text: "testua",
	numbers: "zenbakiak",
	x_axis: "x ardatza",
	y_axis: "y ardatza",
	render: "zabaldu",
	sort: "ordena",
	painter: "margolaria",
	raytrace: "izpi marraztu",
	split: "moztu",
	file: "artxiboa",
	sensitive_to_mouse_movements: "xaguaren mugimenduarekiko sentikorra",
	gui: "interface",
	spinner: "sakagailu",
	textfield: "testu-eremua",
	menu: "menua",
	scrollbar: "barra",
	button: "sakagailu",
	checkbox: "egiaztatze-laukitxoa",
	graphic: "grafikoa",
	audio: "audioa",
	video: "bideoa",
	name: "izena",
	region: "eremua",
	north: "iparraldea",
	south: "hegoaldea",
	east: "ekialdea",
	west: "mendebaldea",
	interior: "barne",
	external: "kanpo",
	space: "espazioa",
	activeif: "aktiboa baldin eta",
	exponentialif: "esponentziala baldin eta",
	expression: "adierazpen",
	value: "balio",
	decimals: "hamartarrak",
	visible: "ikusgai",
	discrete: "diskretu",
	incr: "gehi",
	min: "min",
	max: "max",
	action: "ekintza",
	calculate: "kalkulatu",
	init: "hasiera",
	clear: "garbitu",
	openURL: "URL ireki",
	openScene: "eszena ireki",
	playAudio: "erreproduzitu",
	animate: "animatu",
	initAnimation: "berrabiarazi animazioa",
	parameter: "parametroa",
	onlyText: "testu soilik",
	evaluate: "ebaluatu",
	answer: "erantzuna",
	options: "aukerak",
	color_BTN: "testu-kolore",
	border: "ertz-kolore",
	borderColor: "ertz-kolore",
	colorInt: "barne-kolore",
	flat: "degradaturik gabe",
	font_family: "letra-tipoa",
	font_size: "letra-tipo tamaina",
	bold: "lodia",
	italics: "etzana",
	underlined: "azpimarratua",
	text_align: "pos testua",
	image_align: "pos irudia",
	a_top_left: "gora-ezker",
	a_top_center: "gora-zentro",
	a_top_right: "gora-eskuin",
	a_center_left: "zentro-ezker",
	a_center_center: "zentro-zentro",
	a_center_right: "zentro-eskuin",
	a_bottom_left: "behe-ezkerra",
	a_bottom_center: "behe-zentro",
	a_bottom_right: "behe-eskuin",
	radio_group: "talde",
	size: "tamaina",
	constraint: "mugatze",
	color: "kolore",
	array: "bektore",
	matrix: "matrize",
	"function": "funtzio",
	variable: "aldagai",
	library: "liburutegia",
	algorithm: "algoritmo",
	"event": "gertaera",
	onlyOnce: "behin bakarrik",
	always: "beti",
	columns: "zutabeak",
	rows: "lerroak",
	range: "izate-eremua",
	local: "lokala",
	doExpr: "egin",
	whileExpr: "bitartean",
	condition: "baldintza",
	execution: "gauzatze",
	alternate: "aldizkatu",
	equation: "ekuazio",
	curve: "kurba",
	point: "puntu",
	segment: "zuzenki",
	polygon: "poligono",
	rectangle: "laukizuzen",
	arrow: "gezi",
	arc: "arku",
	sequence: "segida",
	fill: "betea",
	macro: "makro",
	trace: "arrasto",
	abs_coord: "Koord abs",
	family: "parametro",
	useFamily: "familia",
	family_interval: "tarte",
	family_steps: "pausoak",
	parameter_interval: "tarte",
	parameter_steps: "pausoak",
	fillP: "bete positibo",
	fillM: "bete negatibo",
	lineDash: "lerro-estilo",
	solid: "solidoa",
	dot: "· · · ·",
	dash: "− − − −",
	border_radius: "ertz-erradio",
	spear: "mutur",
	center: "zentro",
	radius: "erradio",
	end: "bukaera",
	vectors: "bektoreak",
	align: "testu-lerrokatze",
	a_center: "zentro",
	a_left: "ezker",
	a_right: "eskuin",
	a_justify: "justifikatzeko",
	anchor: "ainguratze-puntu",
	width_TEXT: "testu zabalera",
	inirot_IMG: "errotazio",
	opacity: "opakutasun",
	inipos_MACRO: "posizio",
	inirot_MACRO: "errotazio",
	expression_MACRO: "artxibo",
	triangle: "hiruki",
	face: "aurpegi",
	polireg: "poligono erregularra",
	surface: "azalera",
	cube: "kubo",
	box: "paralelepipedo",
	tetrahedron: "tetraedro",
	octahedron: "oktaedro",
	dodecahedron: "dodekaedro",
	icosahedron: "ikosaedro",
	sphere: "esfera",
	ellipsoid: "elipsoide",
	cone: "kono",
	cylinder: "zilindro",
	torus: "toro",
	backcolor: "atzealde-kolore",
	model: "eredu",
	light: "argia",
	metal: "metal",
	wire: "alanbre",
	inirot: "rotini",
	inipos: "posini",
	endrot: "rotbuk",
	endpos: "bukpos",
	offset_dist: "distantzia",
	offset_angle: "angelu",
	Nu: "Nu",
	Nv: "Nv",
	edges: "ertzak",
	length: "luzera",
	R: "R",
	r: "r",
	useAnimation: "Animazio",
	delay: "etenaldi",
	auto: "auto",
	loop: "errepikatu",
	ok_btn: "Onartu",
	close_btn: "Itxi",
	apply_btn: "Aplikatu",
	cancel_btn: "Deuseztatu",
	copy_btn: "Kopiatu",
	paste_btn: "Itsatsi",
	"continue": "Jarraitu",
	"000000": "beltza",
	"ff00ff": "magenta",
	"0000ff": "urdina",
	"00ffff": "turkesa",
	"00ff00": "berdea",
	"ffff00": "horia",
	"ffc800": "laranja",
	"ff0000": "gorria",
	"ffafaf": "arrosa",
	"404040": "gris iluna",
	"808080": "grisa ",
	"c0c0c0": "gris argia",
	"ffffff": "zuria",
	"new": "Berria",
	new_window: "Lehio berria",
	open: "Ireki",
	open_url: "URL ireki",
	reload: "Berriro kargatu",
	save: "Gorde",
	save_as: "Gorde horrela",
	container_dir: "Erakutsi edukiontziaren karpeta",
	export_macro: "Descartes-en makroa",
	export_library: "Descarte-sen liburutegia",
	export_png: "png",
	export_jpg: "jpg",
	export_svg: "svg",
	export_pdf: "pdf",
	export_pstricks: "pstricks(esperimentala)",
	close_scene: "Eszena itxi",
	exit: "Atera",
	open_recent: "Ireki arestikoa",
	export: "Esportatu",
	internet: "interneten",
	portable: "portablea",
	project: "proiektuko",
	custom: "pertsonalizatu",
	min_type_internet: "internet",
	min_type_portable: "portablea",
	min_type_proyecto: "proiektua",
	min_type_personalizada: "pertsonalizatua",
	zoom: "Zoom",
	zoom_plus: "Handitu",
	zoom_minus: "Atzeratu",
	zoom_original: "Hasierako",
	language_menu: "hizkuntz",
	language_Esp: "Gaztelania",
	language_Ing: "Ingelesa",
	language_Ale: "Alemaniako",
	language_Cat: "Katalana",
	language_Eus: "Euskera",
	language_Fre: "Frantsesa",
	language_Gal: "Galego",
	language_Ita: "Italiera",
	language_Por: "Portuges",
	language_Val: "Valentziera",
	theme: "Kolore-gaia",
	theme_light: "Argi",
	theme_dark: "Ilun",
	theme_blue: "Urdina",
	theme_default: "Classic",
	console: "Kontsola erakutsi",
	title_console: "Descartes kontsola",
	documentation: "Dokumentazio",
	about_menu: "Descartes-i buruz",
	release_notes_menu: "Bertsioaren oharrak",
	file_menu: "Fitxategia",
	option_menu: "Aukerak",
	help_menu: "Laguntza",
	clear_open_recent: "Menua hustu",
	block_0: "Oinarrizko latindarra",
	block_1: "Latindarra 1",
	block_2: "Latindar zabaldua A",
	block_3: "Latindar zabaldua B",
	block_4: "Oinarrizko  Grekera",
	block_5: "Ziriliko",
	block_6: "Oinarrizko hebrear",
	block_7: "Oinarrizko arabiarra",
	block_8: "Puntuazio orokorra",
	block_9: "Txanpon sinboloak",
	block_10: "Gutun mota sinboloak",
	block_11: "Zenbaki formatuak",
	block_12: "Geziak",
	block_13: "Operadore matematikoak",
	block_14: "Lauki ertzak",
	block_15: "Bloke elementuak",
	block_16: "Askotariko sinboloak",
	add_spaces: "Espazioa erantsi",
	add_controls: "Kontrola erantsi",
	add_definitions: "Definizio erantsi",
	add_programs: "Programa erantsi",
	add_graphics: "Grafikoa erantsi",
	add_graphics3D: "3D grafikoa erantsi",
	add_element: "Erantsi",
	remove_spaces: "Espazioa ezabatu",
	remove_controls: "Kontrola ezabatu",
	remove_definitions: "Definizioa ezabatu",
	remove_programs: "Programa ezabatu",
	remove_graphics: "Grafikoa ezabatu",
	remove_graphics3D: "3D grafikoa ezabatu",
	remove_element: "Ezabatu",
	clone_spaces: "Espazioa klonatu",
	clone_controls: "Kontrola klonatu",
	clone_definitions: "Definizioa klonatu",
	clone_programs: "Programa klonatu",
	clone_graphics: "Grafikoa klonatu",
	clone_graphics3D: "3D grafikoa klonatu",
	clone_element: "Klonatu",
	descartes_location_question: "Non dago erabili nahi duzun  <i><b>descartes-min.js</b></i>? fitxategia?",
	to_grayscale: "Koloreak gris-eskalara bihurtu?",
	white_background: "Espazioen hondoaren kolorea (ez gardena) aldatu, txuriz jarriz? ",
	pstricks_title: "PSTricks-era esportazio aukerak",
	reload_content: "Jarraitzen baduzu aldaketak<br> galduko dira. Jarraitu nahi al duzu?",
	save_content: "Aldaketak gorde nahi al dituzu?",
	"undefined": "---",
  }

  return babel;
})(babel || {});