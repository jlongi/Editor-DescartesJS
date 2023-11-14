/**
* @author Joel Espinosa Longi
* @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
*/

var babel = (function(babel) {

 /**
  * Translate to save the configuration
  */
 babel.GUIing = 
 {
	configuration: "Configuration",
	buttons: "Scene",
	spaces: "Spaces",
	controls: "Controls",
	definitions: "Definitions",
	programs: "Programs",
	graphics: "Graphics",
	graphics3D: "3D Graphics",
	animation: "Animation",
	width: "width",
	height: "height",
	about_SCENE: "about button",
	config_SCENE: "config button",
	init_SCENE: "init button",
	clear_SCENE: "clear button",
	rowsNorth: "rows north",
	rowsSouth: "rows south",
	widthWest: "width west",
	widthEast: "width east",
	heightRows: "height rows",
	decimal_symbol: "decimal symbol",
	language: "language",
	español: "spanish",
	english: "english",
	deutsch: "german",
	catalan: "catalan",
	euskera: "basque",
	french: "french",
	gallego: "galician",
	italian: "italian",
	portuguese: "portuguese",
	valencian: "valencian",
	editable_buttons: "show external region",
	expand: "expand scene",
	cover: "cover",
	fit: "fit",
	image_loader: "image loader",
	info: "info",
	id: "id",
	drawif: "draw if",
	x: "x",
	y: "y",
	resizable: "resizable",
	fixed: "fixed",
	scale: "scale",
	"O.x": "O.x",
	"O.y": "O.y",
	image: "image",
	bg_display: "background display",
	topleft: "topleft",
	stretch: "stretch",
	patch: "patch",
	imgcenter: "center",
	background: "background",
	axes: "axes",
	net: "grid",
	net10: "grid10",
	text: "text",
	numbers: "numbers",
	x_axis: "x axis",
	y_axis: "y axis",
	render: "render",
	sort: "sort",
	painter: "painter",
	raytrace: "ray trace",
	split: "split",
	file: "file",
	sensitive_to_mouse_movements: "sensitive to mouse movements",
	border_width: "border width",
	border_color: "border color",
	label_color: "label color",
	label_text_color: "label text color",
	gui: "gui",
	spinner: "spinner",
	textfield: "textfield",
	menu: "menu",
	scrollbar: "scrollbar",
	button: "button",
	checkbox: "checkbox",
	graphic: "graphic",
	audio: "audio",
	video: "video",
	name: "name",
	region: "region",
	north: "north",
	south: "south",
	east: "east",
	west: "west",
	interior: "interior",
	external: "external",
	space: "space",
	activeif: "active if",
	exponentialif: "exponential if",
	expression: "expression",
	value: "value",
	decimals: "decimals",
	visible: "visible",
	discrete: "discrete",
	incr: "incr",
	min: "min",
	max: "max",
	action: "action",
	calculate: "calculate",
	init: "init",
	clear: "clear",
	openURL: "open URL",
	openScene: "open scene",
	playAudio: "play",
	animate: "animate",
	initAnimation: "init animation",
	parameter: "parameter",
	onlyText: "text only",
	evaluate: "evaluate",
	answer: "answer",
	options: "options",
	color_BTN: "text color",
	border: "text border",
	borderColor: "text border",
	colorInt: "inner color",
	flat: "flat",
	extra_style: "extra style",
	font_family: "font",
	font_size: "font size",
	bold: "bold",
	italics: "italics",
	underlined: "underlined",
	text_align: "pos text",
	image_align: "pos image",
	a_top_left: "top-left",
	a_top_center: "top-center",
	a_top_right: "top-right",
	a_center_left: "center-left",
	a_center_center: "center-center",
	a_center_right: "center-right",
	a_bottom_left: "bottom-left",
	a_bottom_center: "bottom-center",
	a_bottom_right: "bottom-right",
	radio_group: "group",
	size: "size",
	constraint: "constraint",
	color: "color",
	btn_pos: "buttons position",
	v_left: "left vertical",
	v_right: "right vertical",
	h_left: "left horizontal",
	h_right: "right horizontal",
	h_left_right: "end horizontal",
	image_dec: "decrement image",
	image_inc: "increment image",
	position: "position",
	keyboard: "keyboard",
	kblayout: "keyboard layout",
	kbexp: "keyboard position",
	array: "array",
	matrix: "matrix",
	"function": "function",
	variable: "variable",
	library: "library",
	algorithm: "algorithm",
	"event": "event",
	onlyOnce: "only once",
	always: "always",
	columns: "columns",
	rows: "rows",
	range: "domain",
	local: "local",
	doExpr: "do",
	whileExpr: "while",
	condition: "condition",
	execution: "execution",
	alternate: "alternate",
	equation: "equation",
	curve: "curve",
	point: "point",
	segment: "segment",
	polygon: "polygon",
	rectangle: "rectangle",
	arrow: "arrow",
	arc: "arc",
	sequence: "sequence",
	fill: "fill",
	macro: "macro",
	trace: "trace",
	abs_coord: "abs coord",
	family: "parameter",
	useFamily: "family",
	family_interval: "interval",
	family_steps: "steps",
	parameter_interval: "interval",
	parameter_steps: "steps",
	fillP: "positive fill",
	fillM: "negative fill",
	lineDash: "line style",
	solid: "solid",
	dot: "· · · ·",
	dash: "− − − −",
	border_radius: "border radius",
	spear: "spear",
	center: "center",
	radius: "radius",
	end: "end",
	vectors: "vectors",
	align: "text align",
	a_center: "center",
	a_left: "left",
	a_right: "right",
	a_justify: "justify",
	anchor: "anchor",
	width_TEXT: "text width",
	inirot_IMG: "rotation",
	opacity: "opacity",
	inipos_MACRO: "position",
	inirot_MACRO: "rotation",
	expression_MACRO: "file",
	border_size: "border size",
	shadowColor: "shadow",
	shadowBlur: "shadow blur",
	shadowOffsetX: "shadow offset X",
	shadowOffsetY: "shadow offset Y",
	clip: "clipping region",
	triangle: "triangle",
	face: "face",
	polireg: "regular polygon",
	surface: "surface",
	cube: "cube",
	box: "box",
	tetrahedron: "tetrahedron",
	octahedron: "octahedron",
	dodecahedron: "dodecahedron",
	icosahedron: "icosahedron",
	sphere: "sphere",
	ellipsoid: "ellipsoid",
	cone: "cone",
	cylinder: "cylinder",
	torus: "torus",
	backcolor: "back color",
	model: "model",
	light: "light",
	metal: "metal",
	wire: "wire",
	inirot: "inirot",
	inipos: "inipos",
	endrot: "endrot",
	endpos: "endpos",
	offset_dist: "offset",
	offset_angle: "angle",
	Nu: "Nu",
	Nv: "Nv",
	edges: "edges",
	length: "length",
	R: "R",
	r: "r",
	useAnimation: "Animation",
	delay: "delay",
	auto: "auto",
	loop: "loop",
	ok_btn: "Ok",
	close_btn: "Close",
	apply_btn: "Apply",
	cancel_btn: "Cancel",
	copy_btn: "Copy",
	paste_btn: "Paste",
	"continue": "Continue",
	"000000": "black",
	"ff00ff": "magenta",
	"0000ff": "blue",
	"00ffff": "cyan",
	"00ff00": "green",
	"ffff00": "yellow",
	"ffc800": "orange",
	"ff0000": "red",
	"ffafaf": "pink",
	"404040": "darkGray",
	"808080": "gray",
	"c0c0c0": "lightGray",
	"ffffff": "white",
	pattern: "Pattern",
	gradient: "Gradient",
	stop: "Stop",
	"new": "New",
	new_window: "New window",
	open: "Open",
	open_url: "Open URL",
	reload: "Reload",
	save: "Save",
	save_as: "Save as",
	container_dir: "Show container folder",
	edit_scene: "Edit scene",
	export_macro: "Descartes macro",
	export_library: "Descartes library",
	export_png: "png",
	export_jpg: "jpg",
	export_svg: "svg",
	export_pdf: "pdf",
	export_pstricks: "pstricks (experimental)",
	close_scene: "Close scene",
	exit: "Exit",
	open_recent: "Recently opened",
	export: "Export",
	internet: "internet",
	portable: "portable",
	project: "project",
	custom: "custom",
	min_type_internet: "internet",
	min_type_portable: "portable",
	min_type_proyecto: "proyect",
	min_type_personalizada: "custom",
	zoom: "Zoom",
	zoom_plus: "Increase",
	zoom_minus: "Decrease",
	zoom_original: "Initial",
	language_menu: "Language",
	language_Esp: "Spanish",
	language_Ing: "English",
	language_Ale: "German",
	language_Cat: "Catalan",
	language_Eus: "Basque",
	language_Fra: "French",
	language_Gal: "Galician",
	language_Ita: "Italian",
	language_Por: "Portuguese",
	language_Val: "Valencian",
	theme: "Color theme",
	theme_light: "Light",
	theme_dark: "Dark",
	theme_blue: "Blue",
	theme_default: "Classic",
	embed_menu: "Add to HTML",
	console: "Show console",
	title_console: "Descartes console",
	documentation: "Documentation",
	about_menu: "About Descartes",
	release_notes_menu: "Release notes",
	file_menu: "File",
	option_menu: "Options",
	help_menu: "Help",
	clear_open_recent: "Empty menu",
	block_0: "Basic Latin",
	block_1: "Latin 1",
	block_2: "Latin Extended A",
	block_3: "Latin Extended B",
	block_4: "Basic Greek",
	block_5: "Cyrillic",
	block_6: "Basic Hebrew",
	block_7: "Basic Arab",
	block_8: "General Punctuation",
	block_9: "Currency Symbols",
	block_10: "Letterlike Symbols",
	block_11: "Number Forms",
	block_12: "Arrows",
	block_13: "Mathematical Operators",
	block_14: "Box Drawing",
	block_15: "Block Elements",
	block_16: "Miscelaneous Symbols",
	add_spaces: "Add space",
	add_controls: "Add control",
	add_definitions: "Add definition",
	add_programs: "Add program",
	add_graphics: "Add graphic",
	add_graphics3D: "Add 3D graphic",
	add_element: "Add",
	remove_spaces: "Remove space",
	remove_controls: "Remove control",
	remove_definitions: "Remove definition",
	remove_programs: "Remove program",
	remove_graphics: "Remove graphic",
	remove_graphics3D: "Remove 3D graphic",
	remove_element: "Remove",
	clone_spaces: "Clone space",
	clone_controls: "Clone control",
	clone_definitions: "Clone definition",
	clone_programs: "Clone program",
	clone_graphics: "Clone graphic",
	clone_graphics3D: "Clone 3D graphic",
	clone_element: "Clone",
	descartes_location_question: "Where is the file <i><b>descartes-min.js</b></i> located?",
	to_grayscale: "Convert colors to grayscale?",
	white_background: "Change the background color (non-transparent) of the spaces to white?",
	pstricks_title: "Export to PSTricks options",
	reload_content: "If you continue your changes will be lost<br>Do you want to continue?",
	save_content: "Do you want to save the changes?",
	update_text: "There are updates available.<br>Do you want to install them?",
	loader_text: "Wait a moment please.",
	parts: "parts",
	"undefined": "---",
  }

  return babel;
})(babel || {});