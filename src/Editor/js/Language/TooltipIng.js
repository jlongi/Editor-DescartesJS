/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var tooltip = (function(tooltip) {

// reemplazar &lt; por < y &gt; >

  /**
   *
   */
  tooltip.ing = {
		/**
		 * Panel tabs
		 */
		Panels: {
			Buttons: 'Selects the general scene settings and rows of numeric controls.',
			Spaces: 'Selects the Spaces editing panel.',
			Controls: 'Selects the Controls editing panel.',
			Definitions: 'Selects the Definitions editing panel.\n\nThe Definitions are the vectors, matrices, functions, variables and libraries of a scene.',
			Programs: 'Selects the Programs editing panel.\n\nThe Programs are the algorithms and events of a scene.',
			Graphics: 'Selects the Graphic 2D editing panel.',
			Graphics3D: 'Selects the Graphic 3D editing panel.',	
			Animation: 'Selects the Animation editing panel.'
		},

		/**
		 * Panel list edit
		 */
		ListEditButtons: {
			add: 'Add a new item to the list.',
			clone: 'Adds a new item to the list that is identical to the one selected.',
			delete: 'Deletes the selected item from the list.',
			list: 'Opens a text window to manually edit all objects in the list.',
			up_down: 'Change the order of the list by swapping the item selected by its neighbor.\n\nIf pressed, it quickly repeats the operation.'
		},

		/**
		 * Buttons
		 */
		Buttons: {
			width: 'The scene\'s width in pixels.',
			height: 'The scene\'s height in pixels.',

			about: 'Determines if the "About" button appears in the scene.\n\nThe "About" button opens a window with the information of the authors of Descartes',
			config: 'It determines if the "Config" button appears in the scene.\n\nThe "Config" button opens a window with scene settings.',
			init: 'It determines if the "Init" button appears in the scene.\n\nThe "Init" button returns the scene to its initial state restoring the controls, definitions and programas.\n\nIf automatic animation is enabled, the animation begins again.',
			clear: 'It determines if the "Clear" button appears in the scene.  The "Clear" button erases the traces left by the graphs that have the "trace" option activated.',
			
			rowsNorth: 'Number of rows that will occupy the numerical controls placed in the north region.\n\nWhen its value is zero then there will be one row if required, otherwise, there will be none.\n\nThe default value is zero.',
			rowsSouth: 'Number of rows that will occupy the numerical controls placed in the south region.\n\nWhen its value is zero then there will be one row if required, otherwise, there will be none.\n\nThe default value is zero.',
			widthWest: 'The width in pixels of the numerical controls in the western region. The default value is 150.\n\nIf the value is 0, but there is at least one numerical control in the western region, then it takes a default value of 125.',
			widthEast: 'The width in pixels of the numerical controls in the eastern region. The default value is 150.\n\nIf the value is 0, but there is at least one numerical control in the eastern region, then it takes a default value of 125.',
			heightRows: 'The height in pixels of the numerical controls in the north and south regions. The default is 40.',

			decimal_symbol: 'Symbol used to separte a whole number from the decimals that follow it.\n\nSome countries use a period others use a comma.',
			language: 'Language in which the scene settings are saved.',
			editable: 'Determines whether the outer space is displayed by clicking the right mouse button on the scene.',
			expand: 'Options to modify the dimensions of the scene.\n\n"Cover": only changes the width and height of scenes that have a value of 100%, so they have the dimensions of its container.\n\n"Scale": modifies the scale of the pixels of the scene to cover the dimensions of its container, giving a general zoom effect throughout the scene.\n\nThe default value is empty, indicating no changes in dimensions.',
			image_loader: 'Image to be used as the loading image of the scene.\n\nThe default value is empty, which indicates that the Descartes logo will be displayed.'
		},

		/**
		 * Spaces
		 */
		Spaces: {
			type: 'Determines the type of space that can be used. It can be a two or three dimensional space or an HTMLIFrame.',
			id: 'Name or identifier of the space.',
			cID: '***.',
			x: 'The abscissa of the top left corner of the window displaying the space. It\'s the distance to the left margin of the scene.\n\nIt can be specified with a number of pixeles (for example 20) or with a percentage (for example 10%) of the total width of the scene.',
			y: 'The ordinate of the top left corner of the window displaying the space.  It\'s the distance to the upper margin of the scene.\n\nIt can be specified with a number of pixeles (for example 20) or with a percentage (for example 10%) of the total height of the scene.',
			width: 'The width of the space.\n\nIt can be specified with a number of pixels (for example 240) or with a percentage (for example 50%) of the total width of the scene.',
			height: 'The height of the space.\n\nIt can be specified with a number of pixeles (for example 180) or with a percentage (for example 50%) of the total height of the scene.',
			drawif: 'Boolean expression used to determine wether the space is visible or not.\n\nThe space is invisible if and only if the value of the expression is zero.\n\nIf left blank this space will always be visible.',
			fixed: 'no_quitar',
			fixed_R2: 'When checked it prevents the user from modifying the scale or the location of the origin by dragging the space with the mouse.',
			fixed_R3: 'When checked it prevents the user from modifying the point of view by dragging the space with the mouse.',
			scale: 'Size in pixels of a unitary segment (or length 1).\n\nTo modify it, one must refer to it as <id>.scale where <id> is the space identifier.\n\nNote: It is important that these identifiers do not contain spaces or operator symbols.',

			"O.x": 'Distance in pixels to the right of the centre of the space, between the centre of the space to the point where the origin of coordinates will be placed.\n\nTo modify it, one must refer to it as <id>.Ox where <id> is the space identifier.\n\nNote: It is important that these identifiers do not contain spaces or operator symbols.',
			"O.y": 'Distance in pixels downwards from the centre of the space, between the centre of the space to the point where the origin of coordinates will be placed.\n\nTo modify it, one must refer to it as <id>.Oy where <id> is the space identifier.\n\nNote: It is important that these identifiers do not contain spaces or operator symbols.',

			image: 'Image used as background of the space.\n\nThe image files must be placed in the same directory where the html file of the scene is placed or in subdirectories from there, in addition it is necessary to include the subdirectories in the file name.\n\nYou can use png, jpg, gif and svg files.',
			bg_display: 'Options to modify the way in which the background image of the space will be displayed.\n\n"topleft": The upper left corner of the image aligns with the upper left corner of the space.\n\n"streth": the image is scaled to cover the space.\n\n"patch": the image is repeated as many times as necessary to cover the space.\n\n"center": the image is drawn centered in space.',
			background: 'Space background color.\n\nThe button calls the color editor.\n\nThe default value is white (#ffffff).',
			axes: 'Color of the coordinate axes.\n\nThe selector allows to decide whether the axes are drawn or not.\n\nThe button calls the color editor.\n\nThe default values are the selector checked and the color dark gray (# 404040).',
			net: 'Color of the grid of lines parallel to the coordinate axes used as reference.\n\nThe selector is used to decide whether the grid is drawn or not.\n\nThe button calls the color editor.\n\nThe default values are the selector checked and the color light gray (#c0c0c0).',
			net10: 'Color of a grid that is drawn every 10 units of the previous grid.\n\nThe selector is used to decide whether the red10 is drawn or not.\n\nThe button calls the color editor.\n\nThe default values are the selector checked and the color gray (#808080).',
			text: 'Color coordinates shown by left-clicking in space.\n\nThe selector is used to decide if the coordinates are written or not.\n\nThe button calls the color editor.\n\nThe default values are the selector not checked.',
			numbers: 'Determines whether to write some values of the coordinates on the axes. When displayed, the coordinates appear in the same color as the axes.\n\nThe coordinates will be displayed only when the axes are drawn.\n\nThe default value is not checked.',
			x_axis: 'Label that will be drawn to the right of the scene, just below the x-axis.\n\nThe label color is the same as the axes.\n\nIf the content of this field is "no", then the axis is not drawn.',
			y_axis: 'Label that will be drawn at the top of the scene, just to the right of the y-axis.\n\nThe label color is the same as the axes.\n\nIf the content of this field is "no", then the axis is not drawn.',
			render: 'Method used to display objects in three dimensions.\n\n"sort": draws three dimensional objects from back to front. It is the fastest, but it has flaws when the objects are composed of large faces.\n\n"painter": is somewhat slower but is much more reliable than the "sort" option.\n\n"ray trace": fills the space pixel by pixel drawing the color of the object that is closest to the observer. It is the most accurate but also the slowest method.',
			split: 'When checked it determines if all the objects of the space are cut to each other.\n\nThe default value is not checked.\n\nIf two surfaces intersect but are not allowed to be cut off, their display is "impossible" and the drawing is incomprehensible.\n\nWhen space objects do not intersect each other, it is not necessary to select this option.',
			sensitive_to_mouse_movements: 'When checked it determines if the scene will detect the movements of the mouse over this space.\n\nThe default value is not checked.',
			file: 'File name referenced by the HTMLIFrame space.',
			info: 'Comments.'
		},

		/**
		 * Controls
		 */
		Controls: {
			id: 'Identifier of the control.\n\nIf the control is numeric, then <id> is the name of the numerical variable that represents it.\n\nIf it is graphic, then <id>.x and <id>.y, are the control\'s coordinates.',
			type: '',
			gui: 'Type of graphical interface of the numerical control. The options are: "spinner", "text field", "menu", "scrollbar" and "button".',
			onlyText: 'When checked it causes the text field not interpret the numbers or variables that are written in it, taking the input as text strings.',
			region: 'Region of the scene where the numerical control is assigned.\n\n"north": is one or several horizontal rows at the top of the scene between the about and config buttons.\n\n"south": is one or several horizontal rows at the bottom of the scene between the init and clear buttons.\n\n"west" and "east": they are columns to the left and to the right of the scene.\n\n"external" is a window that appears when you right click on the scene.\n\n"interior": when a numeric control is associated with the interior region, it can be placed in any of the spaces of the scene and its position there is determined by the parameter "expression".\n\nThe default value is "south".',
			space: 'List with the identifiers of all the spaces defined in the scene.\n\nThis parameter only makes sense in controls assigned to the interior region and graphic controls.',
			color_CTRGRAPHIC: 'Color of the circumference of the disc representing a graphical control.\n\nThe default color of the border is #222222.',
			colorInt_CTRGRAPHIC: 'Color of the circle or inside of the circumference of the disk that represents a graphic control.\n\nThe default color of the interior is # f0f8ff.',
			image_CTRGRAPHIC: "File name of an image that will ve used instead of the cirche that Descartes uses to display this graphic control.",
			size: 'Radius of the graphic control in pixels.\n\nIt can be any number or positive expression.\n\nIts default value is 4.',
			name: 'External name of the control that appears as a label to the left of the numeric control and has no other functions within the program.\n\nIts default value is equal to the control\'s identifier.',
			expression: 'Top left corner of an interior numerical control.\n\nIt is expressed with two numbers in parentheses separated by a comma. Numbers can be constants or expressions involving constants or parameters defined in previous controls.\n\nIn the case of an interior numerical control, an expression of four values (x,y,w,h) can be used where the first two are the coordinates of the top left corner of the control and the last two are the width and the height.\n\nThe default value is (0,0,150,40).',
			expression_CTRGRAPHIC: 'Start point of a graphic control.\n\nIt is expressed with two numbers in parentheses separated by a comma. Numbers can be constants or expressions involving constants or parameters defined in previous controls.\n\nThe default value is (0,0).',
			value: 'Initial value of the variable <id>.\n\nIt can be a decimal expression or a formula in which there are constants or parameters defined in previous controls.\n\nIts default value is 0.\n\nIn the case of buttons, this is the value that is assigned to the variable when the button is pressed.',
			constraint: 'Equation in x or y that the coordinates of the graphical control must satisfy. This restricts the control to move on the graph of its constriction.\n\nIt can be any expression or empty. If it is empty the control is not restricted.\n\nThe default value is empty.',
			text: 'Label attached the control.\n\nIt can be any text and can also include variable numeric values.\n\nThe default value is empty.',
			text_CTRTEXT: 'Initial content of the text area.\n\nThe default value is empty.',
			incr: 'Amount that increases or decreases the value of the variable <id> when the numerical control arrows are pressed.\n\nIt can be a constant or an expression.\n\nThe default value is 0.1.',
			min: 'Minimum value that the control can have.\n\nIt can be a constant, an expression or be empty, in which case there is no minimum value and the control do not have lower bound.\n\nThe default value is empty.',
			max: 'Maximum value that the control can have.\n\nIt can be a constant, an expression or be empty, in which case there is no maximum value and the control do not have upper bond.\n\nThe default value is empty.',
			discrete: 'Forces the numerical control values to differ from the initial value only in exact multiples of the increment.\n\nThis works correctly only if the increment is constant and can also be expressed exactly with the number of decimals chosen.\n\nThe default value is not checked.',
			decimals: 'Number of decimals with which the values of <id> will be written.\n\nIt can be any number or expression.\n\nThe expression is evaluated and rounded to the nearest integer to specify the number of decimals, e.g. 3.5 is rounded to 4.\n\nIts default value is 2.',
			fixed: 'When checked, writes numbers with the specified number of decimals.\n\nIf it is not checked, the adjusted notation is used instead. In this case, unnecessary zeros and unnecessary decimal point are eliminated. For example, instead of 25.3400, 25.34 is written and instead of 13.0, 13 is written (without decimal point).\n\nIf exponential notation is used, the numbers are always written in adjusted notation, that is, the fixed attribute is ignored.\n\nThe default value is checked.',
			exponentialif: 'Boolean expression when satisfied causes the value of the parameter to be written in exponential notation. If the expression is empty, exponential notation is never used. It is important to note that this does not force exponential notation, it only allows it. If the expression is not met there will be no exponential notation.\n\nThe default value is empty.',
			visible: 'Indicates whether or not the parameter value should be displayed (name and spinner buttons are always displayed).\n\nThe default value is checked, i.e. the value of the parameter is displayed.',
			trace: 'Indicates that when the graphic control is moved, it must leave a trace of its path. The trace of the control is only the border.\n\nThe default value not checked.',
			color: 'Text color on the button label.',
			colorInt: 'Background color on the button label.',
			bold: 'When checked, the text on the button label is written in bold.',
			italics: 'When checked, the text on the button label is written in italics.',
			underlined: 'When checked, the text on the button label is underlined.',
			font_size: 'Size of the font in points with which the label of the button is written.\n\nThe font is always SansSerif.',
			image: 'File name of an image to be used as the background of the button.\n\nIf the folder containing the image file has another file with the same name as the image file but followed by "_over" that has the same extension, then the image in this file will appear when the mouse is over the button.\n\nIf the folder containing the image file has another file with the same name as the image file but followed by "_down", that has the same extension, then the image of this file will appear image when clicking with the mouse over the button.',
			options: 'List of options that shows the "menu".\n\nOptions must be texts separated by commas. After each word the value that should be assigned to the parameter, when this option is selected, may come between bracketes []. If the value is not defined, then an integer value corresponding to the index of the option is automatically assigned.',
			action: 'The action that is performed when the user manipulates the control (Press the button, select an item from a menu, move the scroll bar, click a button, or give <enter> in the text field).\n\nThere are the following possible actions: "calculate", "init", "clear", "animate", "open URL", "open Scene" and "play".',
			parameter: 'The parameter of the action.\n\nIf the action is "calculate", then it must contain zero or several assignations separated by a semicolon (;) or line break (\\n), which the program will execute when the action is executed.\n\nIf the action is "open URL", the parameter has to be a URL.\n\nIf the action is "open Scene" the parameter must be a relative address and opens the Descartes scene that is in a text file with that address.\n\nThe other actions do not use the parameter.',
			drawif: 'Boolean expression that determines when the control is visible.\n\nThe default value is empty and in this case the control is always visible.',
			activeif: 'Boolean expression that determines when the control is active.\n\nThe default value is empty and in that case it is possible to interact with the control.',
		evaluate: 'When checked, forces the control to carry out an evaluation.\n\nIt applies only with controls that pose questions and where an answer needs to be evaluated by comparing the user\'s answer with the lesson\'s answer.\n\nIt is not checked by default. In which case, the text fields "answer" and "weight" are inactive.',
		answer: 'Text filed that allows the lesson\'s author to enter the expected answer to the question that appears under the control.\n\nThis field is inactive while the selector "evaluate" is off.\n\nThe expected answer, programmed by the lesson\'s author.  This is the answer against which the user\'s answer is compared with to determine if it is correct.\n\nIt applies only with controls that pose questions and where an answer needs to be evaluated by comparing the user\'s answer with the lesson\'s answer.\n\nIt can consist of one or more text fields separated by |, each one of them is compared with the user\'s answer or selection.\n\nIf there is a match, the answer is marked correct, otherwise is marked wrong.\n\nWhen the expected answer is numeric, the lesson\'s author needs to establish a valid range by specifying an interval, for example, [a,b], (a,b) , (a,b] o [a,a].\n\nWhen the control is of the type "text only", evaluating the response is done by comparing letter by letter.\n\nIf an answer option is ended with *, the user\'s answer is compared only with the beginning of the answer.\n\nIf an answer option begins with *, the user\'s answer most end with the  the answer.\n\nIf an answer option begins and ends with *, e.g. *answer*, the user\'s answer most contain the "answer".\n\nIf the expected answer can be in lower or upper case, the answer option must be written between single quotes, e.g. "answer"\n\nIf accents or n or ñ are not distinguishable, the answer option must be written between left and right accents, e.g. `answer´\n\nSimilarly, `\'answer\'´ would allow Descartes to ignore lower and upper case, accents and n or ñ.\n\nTo make Descartes ignore a letter a ? must be used instead of the letter.\n\nIf the control is a text field and the user leaves it empty, Descartes considers that the question was left unanswered.\n\nIf the control is of type menu, and an empty option appears in the menu, for example if a space is written by the lesson\'s author, and the user selcts this option,Descartes considers that the question was left unanswered.\n\nThe evaluation rules, i.e the rules that determine when an answer is correct or incorrect, or what to do with empty answers, are determined by the evaluation administrator.',
			weight: 'Weight (in the context of a weighted average) given to the answer in the evaluation when calculating the grade.\n\nOnly positive integer values are supported and it is recommended to use 0, 1 or 2.',
			tooltip: 'Text that appears when the mouse pauses more than a second and a half on the label of a numerical control or within the circle of a graphic control.\n\nThe default value is empty.',
			explication: 'Text that appears when the user right-click on the label of a numerical control or within the circle of a graphic control.\n\nThe default value is the value of "tooltip".',
			cID: 'Identifier for the controls that are on the stage.\n\nIt is useful only in Arquimedes or Discurso scenes.\n\nThe value of the identifier is calculated by the program according to the precise moment in which it was created, so that all the identifiers created in the same computer are different.\n\nManipulating this identifier is not recommended.',
			file: 'Name of the multimedia file (audio or video).',
			info: 'Comments.',

			borderColor: 'Button text border color.\n\nWhen activated the button text is drawn with a border of the selected color.\n\nThe default value is disabled.',
			flat: 'When activated the button is drawn without gradient (flat style).\n\nThe default value is disabled, that is, the button is drawn with gradient (traditional Descartes style).',
			text_align: 'Options to choose the alignment of the button label, relative to the rectangular region that occupies the control.',
			image_align: 'Options to choose the alignment of the button image, relative to the rectangular region that occupies the control.',
			cssClass: 'Button CSS classes.\n\nThis lets you change the button style by external style sheets.',
			radio_group: 'If empty, the control is a checkbox.\nIf has a name, the control is a radio button with the espeficied share name. When is a radio button, only one of the controls with the same group is selectected.'			
		},

		/**
		 * Definitions
		 */
		Definitions: {
			id: 'Definition\'s identifier.\n\nIn the case of a function it should include the parameters on which it depends, written between parenthesis and separated by commas. For example: f(x,y,x).',
			expression: 'Value of the constant, variable or function.',
			evaluate: 'Options that allow you to define whether the constant, vector expression or algorithm should be evaluated each time the user modifies a control or only once when the scene starts.\n\nIt is important to select "only once" when it is feasible to make the scene work faster.',
			size: 'Number of components of the vector.',
			rows: 'Number of matrix rows.',
			columns: 'Number of matrix columns.',
			range: 'Boolean expression that determines the function\'s domain.\n\nAttempting to evaluate the function outside its domain will create an exception.\n\nThis will result, for example, in not drawing the function\'s graph at the points outside the function\'s domain.\n\nIts default value is empty, which is interpreted as having and unrestricted domain.',
			algorithm: 'When checked it indicates that the function, to be evaluated, must use an algorithm; That is, use the calculations indicated in "init", "do" and "while".\n\nThe default value is not activated.',
			expression2: 'Assignments to vector values, separated by semicolons (;) or line breaks (\\n).\n\nFor example, if the vector identifier is v and has size 3, then you can write:\n\nv[0]=1\n\nv[1]=2.5\n\nv[2]=-3.1',
			local: 'Declaration of the variables that must be protected during the execution of the function.\n\nTo protect the variables, you have to enter the identifiers separated by commas (,) or semicolons (;).\n\nFor example: i,j;k',
			init: 'Assignments and calls to functions separated by semicolons (;), such that everything in this field is executed at the beginning of the calculation.',
			doExpr: 'Assignments and calls to functions separated by line breaks (\\n), such that everything in this field is executed repeatedly while the condition of the "while" parameter is valid.',
			whileExpr: 'Boolean expression that determines the condition to repeat the statements of the "do" parameter.',
			file: 'Text file (with extension .txt recomended) in which the values of the elements of the vector appear in order, separated by a line break.\n\nThe values can be numeric or string, in which case they must appear in single quotes, for example \'value \'.',
			info: 'Comments.'
		},

		/**
		 * Programs
		 */
		Programs: {
			id: 'Program\'s identifier.',
			evaluate: 'Options that allow you to define whether the constant, vector expression or algorithm should be evaluated each time the user modifies a control or only once when the scene starts.\n\nIt is important to select "only once" when it is feasible to make the scene work faster.',
			init: 'Assignments and calls to functions separated by semicolons (;), such that everything in this field is executed at the beginning of the calculation.',
			doExpr: 'Assignments and calls to functions separated by line breaks (\\n), such that everything in this field is executed repeatedly while the condition of the "while" parameter is valid.',
			whileExpr: 'Boolean expression that determines the condition to repeat the statements of the "do" parameter.',
			condition: 'Boolean expression when met, executes the action.\n\nThe repetition of the action is conditioned by the parameter "execution".',
			action: 'Action that is executed when interacting with the scene and fulfilling the boolean condition of the "condition" parameter.\n\nThere are the following actions: "calculate", "open URL", "open scene", "init", "clear", "animate", "init animation" and "play".',
			parameter: 'Parameter used for the action.\n\nIf the action is "calculate" then it must contain zero or several assignments that the program will perform when the action is executed.\n\nIf the action is "open URL", then it must be any URL.\n\nIf the action is "open scene" then it must be an absolute or relative addresstowards the scene of Descartes that will open.\n\nThe other actions do not use the parameter.',
			execution: 'Determines the mode of execution of the event action.\n\n"only once": the action is only executed the first time the condition is met.\n\n"alternate": the action is executed the first time the condition is fulfilled, but if the condition is no longer valid and then it is valid later, then the action is executed again.\n\n"always": the action is executed whenever the condition is met.\n\nThe default is "only once".',
			info: 'Comments.'
		},

		/**
		 * Graphics
		 */
		Graphics: {
			space: 'List of two dimensional spaces that have been defined.\n\nIt is used to assign the space to which the graphic belongs.',
			type: 'The graph type.',
			background: 'When checked, it indicates that the graphic is drawn only in the background of the scene, and is therefore updated only when "init" is pressed and when the scale or position of the origin (O.x and O.y) is modified.\n\nWhen a graphic is always fixed in the scene, that is not dependent on the controls, definitions or programs, it is advisable to activate this option, thus saving the work of drawing the graphic every time there is a change in the scene.',
			color: 'Color of the graphic.\n\nThe button calls the color editor.\n\nThe default value is #20303a.',
			color_ARROW: 'Color of the edge of the arrow, its interior is drawn in the color of the "arrow" parameter.\n\nThe default value is #20303a.',
			drawif: 'Boolean expression that determines whether the graph is drawn or not.\n\nThe graphic is drawn if the expression is empty or if it has a true value (or greater than zero).\n\nThe default value is empty, which indicates that it is always drawn.',
			drawif_EQUATION: 'Boolean expression that determines whether the graph is drawn or not.\n\nThe graphic is drawn if the expression is empty or if it has a true value (or greater than zero).\n\nIf the expression depends on x or y, and the graph is an equation, then only the points on the graph that satisfy the expression are drawn.\n\nIf the value of x or y does not allow the expression to be fulfilled at the moment an object is to be drawn, then it is not drawn (it is the responsibility of the author to control the value of x and y outside the equations).\n\nThe default value is empty, which indicates that it is always drawn.',
			abs_coord: 'When checked the graphic is interpreted in pixels and in absolute coordinates, with the origin in the upper left corner of the area of the space to which the graph belongs and the scale equal to 1 pixel per unit.\n\nGraphics defined in absolute coordinates do not move when the system\'s origin or scale are changed.',
			expression_EQUATION: 'It must be an equation at x, y. The graphical object associated with an equation is the locus of the points that satisfy it.\n\nThe default value is y=x.',
			expression_CURVE: 'Expression of the form (f(t),g(t)), where f and g are any functions of the parameter t (or that is defined in the "parameter" field).\n\nThe default value is (t,t).',
			expression_SEQUENCE: 'Expression of the type (X,Y), where X and Y are real expressions dependent on n, which represent the abscissa and ordinate of the points of the sequence.\n\nThe default value is (n,1/n).',
			expression_POINT: 'Expression of type (X,Y), where X and Y are any real expressions that represent the abscissa and ordinate of the point.\n\nThe default value is (0,0).',
			expression_SEGMENT: 'Expression of the type (X1,Y1)(X2,Y2), where (X1,Y1) are the coordinates of the beginning of the segment y (X2,Y2) of the end of the segment.\n\nThe default value is (0,0)(1,1), i.e. the segment between the origin and the point (1,1).',
			expression_ARROW: 'Expression of the type (X1,Y1)(X2,Y2), where (X1,Y1) are the coordinates of the beginning of the arrow and (X2,Y2) of the tip.\n\nThe default value is (0,0) (1,1), that is the arrow that goes from the origin to the point (1,1).',
			expression_POLYGON: 'Expression of the type\n\n(X1,y1)(x2,y2)...(xN,yN),\n\nWhere xn and yn are arbitrary real expressions.\n\nThe graphic is the polygon with vertices at the points (xn, yn).\n\nThe default value is (0,0)(1,1)(2,-1).',
			expression_FILL: 'Expression of the type (X,Y), where X and Y are any real expressions that represent the abscissa and ordinate of the point where the closed region having the point (X,Y) inside is filled.\n\nThe default value is (0,0).',
			expression_TEXT: 'Expression of type [X,Y], where X and Y are any real expressions that represent the abscissa and ordinate of the beginning of the text, but measured in pixels from the upper left corner of the scene.\n\nThe default value is [20,20].', 
			expression_IMAGE: 'Expression of type (X,Y), where X and Y are any real expressions that represent the abscissa and ordinate of the upper left corner of the image with respect to the origin of space coordinates.\n\nThe default value is (0,0).',
			expression_MACRO: 'File name containing the macro data. The file must be in the folder where the page containing the scene is located or in subfolders of the scene.',
			expression: '---',
			center: 'Expression of the type (X, Y) representing the center of the arc, where X and Y can be arbitrary real expressions.\n\nThe default value is (0,0).',
			radius: 'Arbitrary real expression, which represents the radius of the arc.',
			init: 'Beginning of the arc.\n\nThere are two options: it can be an arbitrary real expression, that will be interpreted as the initial angle measured in degrees, or it can be an expression of the form (x1,y1) that will be interpreted as the point of coordinates x1, y1. In this case, the arc begins with the segment that joins the center (X,Y) to the point (x1,y1).',
			end: 'End of arc.\n\nThere are two options: it can be an arbitrary real expression, that will be interpreted as the final angle measured in degrees, or it can be an expression of the form (x2,y2) that will be interpreted as the point of coordinates x2, y2. In this case, the arc finishes with the segment that joins the center (X,Y) to the point (x2,y2).',
			vectors: 'When checked, it determines that the initial and final side of the arc are obtained from two vectors that start from the center of the arc and not from two points of the plane.',
			trace: 'When checked the graphic object leaves a trace in the scene with the selected color.\n\nThe button calls the color editor.\n\nWhen a graphic leaves a trace you can see its trajectory in the scene. Press the "clear" button to erase the traces of the graphics.\n\nThe default value is not checked.',
			useFamily: 'When checked, it allows to convert a graphic to an entire family of graphics depending on a parameter. When selecting family, the fields "parameter", "interval" and "steps" are activated.\n\nThe default value is not checked.',
			family: 'Name of the parameter that is used in the definition of the graphic object to define the family.\n\nThe default value is "s".\n\nThe program will draw the graphs, with the values of "s", traversing the interval specified in the chosen number of steps.',
			family_interval: 'Interval over which the family parameter will take the values when traverse in the specified number of steps.\n\nThey are two real expressions in brackets and separated by a comma.\n\nThe default value is [0,1].',
			family_steps: 'Number of equal subintervals in which the family interval is divided and the family parameter passes through the ends of the subintervals.\n\nThe default value is 8.',
			parameter: 'Identifier of the parameter used in the curve. It is recommended to use a short word. The default value is "t".\n\nThe program will draw the polygon with vertices:\n\n(f(t),g(t)) for "t" between the first and last of the interval values, with increments equal to the length of the interval between the number of steps.',
			parameter_interval: 'Interval over which the curve parameter will get the values as it travels in the specified number of steps.\n\nThey are two real expressions ti and tf in brackets and separated by a comma, that is [ti,tf].\n\nThe default value is [0,1].',
			parameter_steps: 'Number of equal subintervals in which the curve interval is divided and the curve parameter passed through the ends of the subintervals.\n\nThe default value is 8.',
			text: 'Label that accompanies the graphic object and is written near its position or something that can be considered as its position.\n\nTexts are drawn in the same color as the graphic object.\n\nTexts can have multiple lines and can also include variable numeric values.\n\nThe default value is empty.',
			decimals: 'Number of decimals with which the numbers included in the text are written.\n\nIt can be a fixed number or an expression. When evaluating the numbers are rounded to decide the number of decimal places.\n\nThe default value is 2.',
			fixed: 'When checked it determines if the number of decimal places is fixed or if, on the contrary, the adjusted notation is used, in which unnecessary zeros or unnecessary decimal point are eliminated.\n\nFor example: instead of 25.3400, 25.34 is writen and instead of 13.0, 13 is written (without decimal point).\n\nIf exponential notation is used always the numbers are written in adjusted form, i.e., the fixed attribute does not intervene in that case.\n\nThe default value is not checked.',
			border: 'Color of the border in the text.',
			font: '***.',
			fill: 'When checked, the program fills the inside of the curve (considered as a polygon) with the selected color. If the curve does not have a well defined interior, the result may be somewhat strange.',
			fillP: 'When checked:\n\nIf the equation is of the form y=f(x) the space between the x-axis and the graph (above the x-axis) is filled with the selected color.\n\nIf the equation is of the form x=g(y) the space between the y-axis and the graph (to the right of the y-axis) is filled with the selected color.\n\nThe default value is not checked.',
			fillM: 'When checked:\n\nIf the equation is of the form y=f(x) the space between the x-axis and the graph (below the x-axis) is filled with the selected color.\n\nIf the equation is of the form x=g(y) the space between the y-axis and the graph (to the left of the y-axis) is filled with the selected color.\n\nThe default value is not checked.',
			size: '---',
			size_POINT: 'Disc radius that is used to represent the point.\n\nIf the value is 0 the point is not drawn. This can be used to draw texts associated with invisible points, using the coordinates of space.\n\nThe default value is 2.',
			size_SEQUENCE: 'Disc radius that is used to represent points of succession.\n\nIf the value is 0 the points are not drawn.\n\nThe default value is 2.',
			size_SEGMENT: 'Disc radius that is used to represent the segment ends.\n\nIf the value is 0 the ends are not drawn.\n\nThe default value is 2.',
			width: '---',
			width_EQUATION: 'Width or thickness of stroke in pixels.\n\nThe default value is 1.\n\nIt is recommended to use moderately widths different from 1, because they slow down the drawing.',
			width_CURVE: 'Width or thickness in pixels, of the segments of the curve.\n\nThe default value is 1.',
			width_SEGMENT: 'Width or thickness in pixels, of the segment.\n\nThe default value is 1.',
			width_POLYGON: 'Width or thickness in pixels, of the segments of the polygon.\n\nThe default value is 1.',
			width_ARC: 'Width or thickness in pixels, of the arc.\n\nThe default value is 1.',
			width_ARROW: 'Width or thickness in pixels, of the arrow.\n\nThe default value is 5.',
			width_TEXT: 'In non-enriched text, specify the maximum width of a line of text before adding line breaks.\n\nIf it is used in rich text or if the value is less than 20, then it is ignored.\n\nThe default value is 1.',
			spear: 'Width of the tip of the arrow. Its default value is 8.',
			arrow: 'Color of the inside of the arrow.\n\nThe default is #ee0022.',
			visible: 'When checked, at the bottom of the scene a text field will appear where you can see the expression of the equation in the same color of the graph and with the background color of the scene.\n\nThe default value is not checked.\n\nIf there are several equations or curves in a scene, below it appear the text fields of each and every one of those that are visible. If they are many, the fields may be too small, so it is not recommended to make visible the text fields of more than three or four equations or curves.',
			editable: 'When checked the content of the text field that appears under the scene with the equation (or curve) can be modified by the user.\n\nThis option is useful when you want the student to practice writing formulas.',
			range: 'Expression of the form [n1,n2] where n1 and n2 are two integers that are interpreted as the beginning and end of the range of integers that "n" will traverse. The program draws the points (X,Y) for each value of "n" between n1 and n2.',
			file: 'Name of the image file that you want to use as a graphic object. Only png, jpg, gif and svg files can be used. The image files should be placed in the same place where the html file of the scene is placed or in subdirectories from there. The subdirectories must be included in the filename.',
			inirot: 'Angle of rotation (counterclockwise) of the graphic object.\n\nIt can be an expression or a fixed number.',
			inipos: 'Expression of type (X,Y), where X and Y are any real expressions that represent the abscissa and ordinate, of the initial point of the macro with respect to the origin of space coordinates.',
			name: 'Macro name, which is used to access its parameters when making calculations.\n\nThe syntax for accessing the parameters is <macro_name>.parameter_name.',

			opacity: 'Opacity of the image, i.e. how much opaque or translucent is.\n\nThe accepted value is a number between 0 and 1, where 0 is completely transparent and 1 is completely opaque.\n\nThe default value is 1.',
			align: 'Alignment of text with respect to a box, whose width is determined by the size of the longest line of text and the height is determined by the height of the text lines.\n\nText can be aligned to the left edge, centered, or to the right edge of the box.\n\nIf the text consists of a single line, the three alignments draw the text in the same way.',
			anchor: 'Anchor point of the text box, whose width is determined by the size of the longest line of text and the height is determined by the height of the text lines.\n\nThe position of the text (given by the expression parameter) and the anchor point, determine how the text box is constructed and therefore the position of the text within the space.',
			lineDash: 'Options that determine the drawing style of the graphic stroke, which can be a "solid", "grated" or "dotted" style.',
			info: 'Comments.'
		},

		/**
		 * Graphics 3D
		 */
		Graphics3D: {
			name: 'Macro name, which is used to access its parameters when making calculations.\n\nThe syntax for accessing the parameters is <macro_name>.parameter_name.',
			space: 'List of three dimensional spaces that have been defined.\n\nIt is used to assign the space to which the graphic belongs.',
			type: 'The graph type.',
			background: 'When checked the 3D graph is calculated only once and is updated only when init is pressed.\n\nWhen a 3D graph does not depend on the controls or the auxiliaries, it is best to define it as a background, as this saves the processor work that will not have to be calculated every time there is a change in the scene.',
			color: 'Color of the graphic.\n\nThe button calls the color editor.\n\nThe default value is #eeffaa.',
			backcolor: 'Back color of the graphic.\n\nThe button calls the color editor.\n\nThe default value is #6090a0.',
			drawif: 'Boolean expression that determines whether the graph is drawn or not.\n\nThe graphic is drawn if the expression is empty or if it has a true value (or greater than zero).\n\nThe default value is empty, which indicates that it is always drawn.',
			expression: '---',
			expression_POINT: 'Expression of form:\n\n(X,Y,Z)\n\nwhere X, Y and Z are any numerical expressions, representing the spatial position of a point in three dimensions.\n\nThe default value is (0,0).',
			expression_SEGMENT: 'Expression of form:\n\n(X1,Y1,Z1)(X2,Y2,Z2)\n\nwhere X1, Y1, Z1, X2, Y2, Z2 are numerical expressions, representing the spatial position of the ends of the segment in three dimensions.\n\nThe default value is (0,0,0)(1,1,1).',
			expression_POLYGON: 'Expression of form:\n\n(X1,Y1,Z1)(X2,Y2,Z2)...(Xn,Yn,Zn)\n\nwhere X1, Y1, Z1, X2, Y2, Z2, ..., Xn, Yn, Zn are numerical expressions, representing several segments representing a polygon (without faces) in three dimensions.\n\nThe default value is (0,0,0)(1,0,0)(1,1,0)(1,1,1).',
			expression_CURVE: 'Expression of form:\n\nx=X(u)\n\ny=Y(u)\n\nz=Z(u)\n\nwhere X, Y and Z are numerical expressions dependent on the parameter u.\n\nThe curve is drawn as a polygon with Nu sides whose Nu+1 vertices are the points:\n\n(X(i/Nu),Y(i/Nu),Z(i/Nu)) for i=0,...,Nu+1.\n\nBefore x, y, z you can define intermediate variables that are only used for the calculations that are made when drawing the curve.',
			expression_TRIANGLE: 'Coordinates three points in space, i.e. an expression of the form:\n\n(X1,Y1,Z1)(X2,Y2,Z2)(X3,Y3,Z3)\n\nwhere Xi, Yi, for i=1,2,3 may be numerical expressions.',
			expression_FACE: 'Coordinates of a polygon in the plane, i.e. an expression of the form:\n\n(X1,Y1)(X2,Y2)...(Xn,Yn)\n\nwhere Xi, Yi, for i=1,...,n are numerical expressions.',
			expression_SURFACE: 'Expression of form:\n\nx=X(u,v)\n\ny=Y(u,v)\n\nz=Z(u,v)\n\nwhere X, Y and Z are numerical expressions dependent on the parameters u and v.\n\nThe surface consists of the grid of quadrilaterals formed by the points:\n\n(X(i/Nu,j/Nv),Y(i/Nu,j/Nv),Z(i/Nu,j/Nv))\n\nfor i=0,...,Nu+1 and j=0,...,Nv+1.\n\nBefore x, y, z you can define intermediate variables that are only used for the calculations that are made when drawing the surface .',
			expression_TEXT: 'Expression of form:\n\n[X,Y]\n\nwhere X and Y are numerical expressions that determine the position of the text in pixels measured from left to right and top to bottom with respect to the upper left corner of the space.',
			expression_MACRO: 'File name containing the macro data. The file must be in the folder where the page containing the scene is located or in subfolders of the scene.',
			useFamily: 'When checked, it allows to convert a graphic to an entire family of graphics depending on a parameter. When selecting family, the fields "parameter", "interval" and "steps" are activated.\n\nThe default value is not checked.',
			family: 'Name of the parameter that is used in the definition of the graphic object to define the family.\n\nThe default value is "s".\n\nThe program will draw the graphs, with the values of "s", traversing the interval specified in the chosen number of steps.',
			family_interval: 'Interval over which the family parameter will take the values when traverse in the specified number of steps.\n\nThey are two real expressions in brackets and separated by a comma.\n\nThe default value is [0,1].',
			family_steps: 'Number of equal subintervals in which the family interval is divided and the family parameter passes through the ends of the subintervals.\n\nThe default value is 8.',
			inirot: 'Vector of three components (A,B,C) representing an initial rotation, whose elements are rotations (in degrees) around the x-axis, y-axis, and z-axis, respectively, that will be applied to the graphic object before To draw.\n\nIf the word "Euler" is added before the terna, i.e. Euler(A, B, C), then the angles A, B and C are interpreted as Euler rotations, i.e. A is a rotation around the z-axis, B around the new x-axis (which is obtained after the first rotation) and C around the new z-axis (which is obtained after the first two rotations).\n\nNote: It is applied before the initial translation.',
			inipos: 'Vector of three components (A,B,C) representing an initial translation, which will be applied to the graphic object before drawing.\n\nNote: It is applied after the initial rotation and before the final rotation.',
			endrot: 'Vector of three components (A,B,C) representing a final rotation, whose elements are rotations (in degrees) around the x-axis, y-axis, and z-axis, respectively, that will be applied to the graphic object before To draw.\n\nIf the word "Euler" is added before the terna, i.e. Euler(A, B, C), then the angles A, B and C are interpreted as Euler rotations, i.e. A is a rotation around the z-axis, B around the new x-axis (which is obtained after the first rotation) and C around the new z-axis (which is obtained after the first two rotations).\n\nNote: It is applied after the initial translation and before the final translation.',
			endpos: 'Vector of three components (A,B,C) representing a final translation, to be applied to the graphic object before drawing.\n\nNote: It is applied after final rotation.',
			split: 'When checked, it indicates if the surface should be cut by the graphics of the same space that precedes it in the list, in case of intersection.\n\nIt is advisable to keep this option always checked, unless you are using a lot of graphics that do not intersect and you want to make the execution a little faster.',
			edges: 'When checked it determines if the edges of the faces that form the object must be drawn or not. The edges are drawn in gray color.',
			text: 'Label that accompanies the graphic object and is written near its position or something that can be considered as its position.\n\nTexts are drawn in the same color as the graphic object.\n\nTexts can have multiple lines and can also include variable numeric values.\n\nThe default value is empty.',
			font: '***.',
			decimals: 'Number of decimals with which the numbers included in the text are written.\n\nIt can be a fixed number or an expression. When evaluating the numbers are rounded to decide the number of decimal places.\n\nThe default value is 2.',
			fixed: 'When checked it determines if the number of decimal places is fixed or if, on the contrary, the adjusted notation is used, in which unnecessary zeros or unnecessary decimal point are eliminated.\n\nFor example: instead of 25.3400, 25.34 is writen and instead of 13.0, 13 is written (without decimal point).\n\nIf exponential notation is used always the numbers are written in adjusted form, i.e., the fixed attribute does not intervene in that case.\n\nThe default value is not checked.',
			model: 'Options for drawing the faces of the graphic object.\n\n"color": causes it to be drawn with solid colors.\n\n"light": makes the color more or less bright according to the orientation, to give a sense of illumination.\n\n"metal": it is like light, but with brighter contrasts to give the impression that the surface is metallic.\n\n"wire": draws only the edges in the selected color.\n\nNote: With wire model the edges are drawn in the selected color and not gray as in the other models.',
			width: '---',
			width_POINT: 'Point size in pixels.\n\nThe default value is 1.',
			width_SEGMENT: 'Width or thickness in pixels, of the segment.\n\nThe default value is 1.',
			width_POLYGON: 'Width or thickness in pixels, of the segments of the polygon.\n\nThe default value is 1.',
			width_CURVE: 'Width or thickness in pixels, of the segments of the curve.\n\nThe default value is 1.',
			width_POLIREG: 'Half the radius of the regular polygon if width=length. If width!=length then the polygon is not regular but is a deformation of a regular one.',
			width_CUBE: 'Size of the cube side in pixels.\n\nThe default value is 2.',
			width_BOX: 'Dimension along the x-axis.\n\nThe default value is 2.',
			width_TETRAHEDRON: 'Size of the tetrahedron side in pixels.\n\nThe default value is 2.',
			width_OCTAHEDRON: 'Size of the octahedron side in pixels.\n\nThe default value is 2.',
			width_DODECAHEDRON: 'Size of the dodecahedron side in pixels.\n\nThe default value is 2.',
			width_ICOSAHEDRON: 'Size of the icosahedron side in pixels.\n\nThe default value is 2.',
			width_SPHERE: 'Size of the diameter of the sphere in pixels.\n\nThe default value is 2.',
			width_ELLIPSOID: 'Dimension along the x-axis.\n\nThe default value is 2.',
			width_CONE: 'Dimension along the x-axis.\n\nThe default value is 2.',
			width_CYLINDER: 'Dimension along the x-axis.\n\nThe default value is 2.',
			length: '---',
			length_POLIREG: 'Half the radius of the regular polygon if width=length. If width!=length then the polygon is not regular but is a deformation of a regular one.',
			length_ELLIPSOID: 'Dimension along the y-axis.\n\nThe default value is 2.',
			length_CONE: 'Dimension along the y-axis.\n\nThe default value is 2.',
			length_CYLINDER: 'Dimension along the y-axis.\n\nThe default value is 2.',
			height: 'Dimension along the z-axis.\n\nThe default value is 2.',
			Nu: 'Number of intervals in which the unit interval [0,1] is divided for the parameter "u".',
			Nv: 'Number of intervals in which the unit interval [0,1] is divided for the parameter "v".',
			offset_dist: 'Translation of the text with respect to the position of the point.',
			offset_angle: 'Angle in which the text is moved relative to the position of the point.',
			info: 'Comments.'
		},	

		Animation: {
			useAnimation: 'When checked all the fields in the animation panel are activated and the author can write to them or choose options to program the animation.',
			delay: 'The time in milliseconds that the program waits at each step of the animation.\n\nThe default value is 40.\n\nSmall values make the animation faster and vice versa. On slow processors, small values do not necessarily produce fast animations.',
			auto: 'When checked it determines if the animation starts automatically when the scene appears on the screen and each time the "init" button is pressed.\n\nWhen not checked, the animation starts only when the user executes an action that initiates the animation.',
			loop: 'When checked it determines if the animation is repeated indefinitely or if it stops when the condition "while" is no longer true.',
			init: 'Assignments and calls to functions separated by semicolons (;), such that everything in this field is executed at the beginning of the calculation.',
			doExpr: 'Assignments and calls to functions separated by line breaks (\\n), such that everything in this field is executed repeatedly while the condition of the "while" parameter is valid.',
			whileExpr: 'Boolean expression that determines the condition to repeat the statements of the "do" parameter.',
			info: 'Comments.'
		},

		Extra: {
			expand: 'Expands the contents of the text field.',
			simple_text_editor: 'Plain text editor.',
			rich_text_editor: 'Rich Text Editor.',
		}
	}

  return tooltip;
})(tooltip || {});
