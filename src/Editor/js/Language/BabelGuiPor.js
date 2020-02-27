/**
* @author Joel Espinosa Longi
* @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
*/

var babel = (function(babel) {

 /**
  * Translate to save the configuration
  */
 babel.GUIpor = 
 {
	configuration: "Configuração",
	buttons: "Cena",
	spaces: "Espaços",
	controls: "Controles",
	definitions: "Definições",
	programs: "Programa",
	graphics: "Gráficos",
	graphics3D: "Gráficos 3D",
	animation: "Animação",
	width: "largura",
	height: "alto",
	about_SCENE: "botão de créditos",
	config_SCENE: "botão config",
	init_SCENE: "botão Iniciar",
	clear_SCENE: "botão Limpar",
	rowsNorth: "filas para o norte",
	rowsSouth: "filas para o sul",
	widthWest: "largura oeste",
	widthEast: "largura leste",
	heightRows: "alto filas",
	decimal_symbol: "sinal decimal",
	language: "línguas",
	español: "Espanhol",
	english: "inglês",
	deutsch: "alemão",
	catalan: "catalão",
	euskera: "basco",
	french: "francês",
	gallego: "Galego",
	italian: "italiano",
	portuguese: "português",
	valencian: "valenciano",
	editable_buttons: "mostrar a região exterior",
	expand: "expandir cena",
	cover: "cobrir",
	fit: "escalar",
	image_loader: "Imagem do carregador",
	info: "info",
	id: "id",
	drawif: "desenhar se",
	x: "x",
	y: "y",
	resizable: "redimensionável",
	fixed: "fixo",
	scale: "escala",
	"O.x": "O.x",
	"O.y": "O.y",
	image: "imagem",
	bg_display: "exibição de imagem",
	topleft: "arr-izq",
	stretch: "expandir",
	patch: "mosaico",
	imgcenter: "centrado",
	background: "fundo",
	axes: "eixos",
	net: "rede",
	net10: "rede10",
	text: "texto",
	numbers: "números",
	x_axis: "eixo x",
	y_axis: "eixo Y",
	render: "desdobre ",
	sort: "comando",
	painter: "pintor",
	raytrace: " traçado de raios",
	split: "cortar",
	file: "arquivo",
	sensitive_to_mouse_movements: "sensível aos movimentos do mouse",
	border_width: "largura da borda",
	border_color: "cor da borda",
	gui: "interface",
	spinner: "botão de pressão",
	textfield: "campo de texto",
	menu: "menu",
	scrollbar: "barra",
	button: "botão",
	checkbox: "check box",
	graphic: "gráfico",
	audio: "áudio",
	video: "vídeo",
	name: "nome",
	region: "região",
	north: "norte",
	south: "sul",
	east: "leste",
	west: "oeste",
	interior: "interior",
	external: "exterior",
	space: "espaço",
	activeif: "ativo se",
	exponentialif: "exponencial se",
	expression: "expressão",
	value: "valor",
	decimals: "decimais",
	visible: "visível",
	discrete: "discreto",
	incr: "incr.",
	min: "min",
	max: "max",
	action: "ação",
	calculate: "calcular",
	init: "início",
	clear: "limpar",
	openURL: "abrir URL",
	openScene: "abrir cena",
	playAudio: "reproduzir",
	animate: "animar",
	initAnimation: "reiniciar a animação",
	parameter: "parâmetro ",
	onlyText: "somente texto",
	evaluate: "avaliar",
	answer: "resposta",
	options: "opções",
	color_BTN: "cor do texto",
	border: "borda do texto",
	borderColor: "borda do texto",
	colorInt: "cor do interior",
	flat: "sem gradiente de cor",
	extra_style: "estilo extra",
	font_family: "fonte",
	font_size: "tam fonte",
	bold: "negrito",
	italics: "itálico",
	underlined: "sublinhada",
	text_align: "pos texto",
	image_align: "pos imagen",
	a_top_left: "acima à esquerda",
	a_top_center: "acima no centro",
	a_top_right: "acima à direita",
	a_center_left: "centro -esquerda",
	a_center_center: "centro-centro",
	a_center_right: "centro -direita",
	a_bottom_left: "abaixo à esquerda",
	a_bottom_center: "abaixo centro",
	a_bottom_right: "abaixo à direita",
	radio_group: "grupo",
	size: "tamanho",
	constraint: "constrição",
	color: "cor",
	btn_pos: "posição dos botões",
	v_left: "esquerda vertical",
	v_right: "direita vertical",
	h_left: "esquerda horizontal",
	h_right: "direita horizontal",
	h_left_right: "horizontal extremos",
	image_dec: "imagem decrescente",
	image_inc: "imagem de aumento",
	array: "vetor",
	matrix: "matriz",
	"function": "função",
	variable: "variáveis",
	library: "biblioteca",
	algorithm: "algoritmo",
	"event": "evento",
	onlyOnce: "uma só vez",
	always: "sempre",
	columns: "colunas",
	rows: "filas",
	range: "domínio",
	local: "local",
	doExpr: "fazer",
	whileExpr: "enquanto",
	condition: "condição",
	execution: "execução",
	alternate: "alternar",
	equation: "equação",
	curve: "curva",
	point: "ponto",
	segment: "segmento",
	polygon: "polígono",
	rectangle: "retângulo",
	arrow: "seta",
	arc: "arco",
	sequence: "sucessão",
	fill: "enchimento",
	macro: "macro",
	trace: "rastro",
	abs_coord: "coord abs",
	family: "parâmetro",
	useFamily: "família",
	family_interval: "intervalo",
	family_steps: "passos",
	parameter_interval: "intervalo",
	parameter_steps: "passos",
	fillP: "recheio positivo",
	fillM: "recheio negativo",
	lineDash: "estilo de linha",
	solid: "sólida",
	dot: "· · · ·",
	dash: "− − − −",
	border_radius: "rádio da aresta",
	spear: "ponta",
	center: "centro",
	radius: "rádio",
	end: "fim",
	vectors: "vectores",
	align: "alinhamento de texto",
	a_center: "centro",
	a_left: "esquerda",
	a_right: "direita",
	a_justify: "justificar",
	anchor: "ponto de ancoragem",
	width_TEXT: "largura do texto",
	inirot_IMG: "rotação",
	opacity: "opacidade",
	inipos_MACRO: "posição",
	inirot_MACRO: "rotação",
	expression_MACRO: "arquivo",
	triangle: "triângulo",
	face: "cara",
	polireg: "polígono regular",
	surface: "superfície",
	cube: "cubo",
	box: "paralelepípedo",
	tetrahedron: "tetraedro",
	octahedron: "octaedro",
	dodecahedron: "dodecaedro",
	icosahedron: "icosaedro",
	sphere: "esfera",
	ellipsoid: "elipsóide",
	cone: "cone",
	cylinder: "cilindro",
	torus: "touro",
	backcolor: "cor reversa",
	model: "modelo",
	light: "luz",
	metal: "metal",
	wire: "arame",
	inirot: "rotini",
	inipos: "posini",
	endrot: "rotfin",
	endpos: "posfin",
	offset_dist: "distância",
	offset_angle: "ângulo",
	Nu: "Nu",
	Nv: "Nv",
	edges: "arestas",
	length: "comprimento",
	R: "R",
	r: "r",
	useAnimation: "Animação",
	delay: "pausa",
	auto: "auto",
	loop: "repetir",
	ok_btn: "Aceitar",
	close_btn: "Fechar",
	apply_btn: "Aplicar",
	cancel_btn: "Cancelar",
	copy_btn: "Copiar",
	paste_btn: "Colar",
	"continue": "Continuar",
	"000000": "preto",
	"ff00ff": "magenta",
	"0000ff": "azul",
	"00ffff": "turquesa",
	"00ff00": "verde",
	"ffff00": "amarelo",
	"ffc800": "laranja",
	"ff0000": "vermelho",
	"ffafaf": "cor de rosa",
	"404040": "cinza escuro",
	"808080": "cinza",
	"c0c0c0": "cinza claro",
	"ffffff": "branco",
	"new": "Novo",
	new_window: "Nova janela",
	open: "Abrir",
	open_url: "Abrir URL",
	reload: "Recarregar",
	save: "Salvar",
	save_as: "Salvar como",
	container_dir: "Mostrar pasta do contêiner",
	export_macro: "macro de Descartes",
	export_library: "biblioteca de Descartes",
	export_png: "png",
	export_jpg: "jpg",
	export_svg: "svg",
	export_pdf: "pdf",
	export_pstricks: "pstricks(experimental)",
	close_scene: "Feche a cena aberta",
	exit: "Sair",
	open_recent: "Abrir recente",
	export: "Exportar para",
	internet: "na internet",
	portable: "portátil",
	project: "do projeto",
	custom: "personalizado",
	min_type_internet: "internet",
	min_type_portable: "portátil",
	min_type_proyecto: "do projeto",
	min_type_personalizada: "personalizado",
	zoom: "Zoom",
	zoom_plus: "Aumentar",
	zoom_minus: "Diminuir",
	zoom_original: "Inicial",
	language_menu: "Idioma",
	language_Esp: "Espanhol",
	language_Ing: "Inglês",
	language_Ale: "Alemão",
	language_Cat: "Catalão",
	language_Eus: "Basco",
	language_Fre: "Francês",
	language_Gal: "Galego",
	language_Ita: "Italiano",
	language_Por: "Português",
	language_Val: "Valenciano",
	theme: "Tema da cor",
	theme_light: "Claro",
	theme_dark: "Escuro",
	theme_blue: "Azul",
	theme_default: "Clássico",
	embed_menu: "Adicionar ao HTML",
	console: "Mostar consola",
	title_console: "Consola Descartes",
	documentation: "Documentação",
	about_menu: "Sobre Descartes",
	release_notes_menu: "Notas na versão do programa",
	file_menu: "Arquivo",
	option_menu: "Opções",
	help_menu: "Ajuda",
	clear_open_recent: "Esvazie o menu",
	block_0: "Latino básico",
	block_1: "Latino 1",
	block_2: "Latino extendido A",
	block_3: "Latino extendido B",
	block_4: "Grego básico",
	block_5: "Cirílico",
	block_6: "Hebraico básico",
	block_7: "Árabe básico",
	block_8: "Pontuação geral",
	block_9: "Símbolos de moeda",
	block_10: "Símbolos do tipo carta",
	block_11: "Formatos numéricos",
	block_12: "Setas",
	block_13: "Operadores matemáticos",
	block_14: "Bordas de quadros",
	block_15: "Elementos de bloco",
	block_16: "Símbolos variados",
	add_spaces: "Adicionar espaço",
	add_controls: "Adicionar controle",
	add_definitions: "Adicionar definição",
	add_programs: "Adicionar programa",
	add_graphics: "Adicionar gráfico",
	add_graphics3D: "Adicionar gráfico 3D",
	add_element: "Adicionar",
	remove_spaces: "Remover espaço",
	remove_controls: "Remover controle",
	remove_definitions: "Remover definição",
	remove_programs: "Remover programa",
	remove_graphics: "Remover gráfico",
	remove_graphics3D: "Remover gráfico 3D",
	remove_element: "Remove",
	clone_spaces: "Clonar espaço",
	clone_controls: "Clonar controle",
	clone_definitions: "Clonar definição",
	clone_programs: "Clonar programa",
	clone_graphics: "Clonar gráfico",
	clone_graphics3D: "Clonar gráfico 3 D",
	clone_element: "Clonar",
	descartes_location_question: "Qual é a localização do arquivo <ixb>descartes-min.js</bxi> que você deseja usar?",
	to_grayscale: "Converter cores para escala de cinza?",
	white_background: "Mudar  a cor de fundo (não transparente) dos espaços para branco?",
	pstricks_title: "Opções de exportação a PSTricks",
	reload_content: "Se você continuar, as alterações serão perdidas<br>.  Deseja continuar?",
	save_content: "Você quer salvar as alterações?",
	update_text: "Há atualizações disponíveis.<br>Você quer instalá-las?",
	loader_text: "Espere um momento por favor.",
	"undefined": "---",
  }

  return babel;
})(babel || {});