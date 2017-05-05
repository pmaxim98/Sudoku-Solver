var App = (function() {
    const UserCellColor = "rgb(243, 247, 243)";
    const InitialCellColor = "rgb(200, 200, 200)";
    const SelectedCellColor = "rgb(51, 153, 255)";

    return {
        updateHtmlSudoku: function(sudokuMatrix) {
            var $cells = $(this.gridElementSelector);

            for (var row = 0; row < App.sudoku.sideLength; ++row) {
                for (var col = 0; col < App.sudoku.sideLength; ++col) {
                    var squareIndex = $($cells[row * App.sudoku.sideLength + col]).parent().index();
                    var cellIndex = $($cells[row * App.sudoku.sideLength + col]).index();

                    var cellRow = Math.floor(squareIndex / App.sudoku.squareLength) * App.sudoku.squareLength + Math.floor(cellIndex / App.sudoku.squareLength);
                    var cellCol = (squareIndex % App.sudoku.squareLength) * App.sudoku.squareLength + cellIndex % App.sudoku.squareLength;
                    var htmlCellIndex = cellRow * App.sudoku.sideLength + cellCol;

                    var cellValue = "";
                    if (sudokuMatrix[row][col].value != 0)
                        cellValue = sudokuMatrix[row][col].value;
                    $($cells[htmlCellIndex]).text(cellValue);

                    if (sudokuMatrix[row][col].initial) {
                        $($cells[htmlCellIndex]).css("background-color", InitialCellColor);
                        $($cells[htmlCellIndex]).css("border", "1px solid rgb(128, 128, 128, 0.25)");
                        $($cells[htmlCellIndex]).css("color", "rgb(50, 50, 50)");
                    }
                    else {
                        $($cells[htmlCellIndex]).css("background-color", UserCellColor);
                        $($cells[htmlCellIndex]).css("border", "1px solid rgb(0, 128, 0, 0.25)");
                        $($cells[htmlCellIndex]).css("color", "rgb(0, 128, 0)");
                    }
                }
            }
        },

        generateHtmlGrid: function(selector) {
            var $gridContainer = $("<div/>", {
                class: this.gridContainerSelector.substring(1)
            }).appendTo(selector);

            for (var square = 0; square < App.sudoku.squareCount; ++square) {
                var $gridSquare = $("<div/>", {
                    class: this.gridSquareSelector.substring(1)
                }).appendTo(this.gridContainerSelector);
            }

            for (var cell = 0; cell < App.sudoku.squareCount; ++cell) {
                var $gridCell = $("<div/>", {
                    class: this.gridElementSelector.substring(1)
                })
                .keydown(function (event) {
                    if (event.which in keyCodeToText)
                        if (App.sudoku.changeCellValue($(this), keyCodeToText[event.which]))
                            this.textContent = keyCodeToText[event.which];
                })
                .focus(function() {
                    if ($(this).css("background-color") != SelectedCellColor && $(this).css("background-color") != InitialCellColor)
                        $(this).transition({background: 'rgb(128, 191, 255)', easing: 'linear', duration: 200, queue: false});
                })
                .blur(function() {
                    if ($(this).css("background-color") != SelectedCellColor && $(this).css("background-color") != InitialCellColor)
                        $(this).transition({background: UserCellColor, easing: 'linear', duration: 150, queue: false});
                })
                .click(function () {
                    $(this).attr("tabindex", -1).focus();
                })
                .mouseover(function () {
                    if (!$(this).is(":focus") && $(this).css("background-color") != InitialCellColor)
                        $(this).transition({background: 'rgb(100, 200, 100)', easing: 'linear', duration: 200, queue: false});
                })
                .mouseleave(function () {
                    if (!$(this).is(":focus") && $(this).css("background-color") != InitialCellColor)
                        $(this).transition({background: UserCellColor, easing: 'linear', duration: 200, queue: false});
                })
                .appendTo(this.gridSquareSelector);
            }
        },

        generateInputControls: function(selector) {
            var $inputContainer = $("<div/>", {
                class: "input-container",
                hide: true
            })
            .appendTo(selector);

            var $inputHeader = $("<h1/>", {
                class: "input-header",
                text: "Please enter your Sudoku below."
            })
            .appendTo(".input-container");

            var $inputTextArea = $("<textarea/>", {
                class: "input-text-area",
                spellcheck: false,
                maxlength: (App.sudoku.sideLength * App.sudoku.sideLength),
                placeholder: "Zeroes represent empty cells. Don't use any separators."
            })
            .on("input", function () {
                Utils.resizeTextArea($(this));
                Utils.centerControl($inputContainer);
            })
            .appendTo(".input-container");

            var $inputButtonsContainer = $("<div/>", {
                class: "input-buttons-container"
            }).appendTo(".input-container");

            var $inputValidateButton = $("<button/>", {
                type: "button",
                text: "OK",
            })
            .click(function() {
                if (App.sudoku.changeMatrix($inputTextArea.val())) {
                    App.updateHtmlSudoku(App.sudoku.getMatrix());
                    $inputContainer.hide();
                }
                else {
                    alert("Invalid input introduced. Try using only digits and no separators between them.");
                }
            })
            .appendTo(".input-buttons-container");

            var $inputCancelButton = $("<button/>", {
                type: "button",
                text: "Cancel",
            })
            .click(function() {
                $inputContainer.hide();
            })
            .appendTo(".input-buttons-container");

            var $mainButtonsContainer = $("<div/>", {
                class: "main-buttons-container"
            }).appendTo(selector);

            var $inputMainButton = $("<button/>", {
                type: "button",
                text: "Input"
            })
            .click(function() {
                $inputTextArea.val("");
                $inputTextArea.css("height", "auto");
                $inputContainer.show();
                Utils.centerControl($inputContainer);
            })
            .appendTo(".main-buttons-container");

            var $solveButton = $("<button/>", {
                type: "button",
                text: "Solve"
            })
            .click(function() {
                if (App.sudoku.solve())
                    App.updateHtmlSudoku(App.sudoku.getMatrix());
            })
            .appendTo(".main-buttons-container");

            $inputContainer.css("position", "absolute");
            $inputContainer.css("top", $(window).height() / 2 - $inputContainer.height() / 2);
            //$inputContainer.css("left", $(window).width() / 2 - $inputContainer.width() / 2);
        }
    };
})();

Object.defineProperty(App, 'sudoku', {
    value: new Sudoku(/*$(".grid-element")*/),
    writable: false
});

Object.defineProperty(App, 'gridElementSelector', {
    value: ".grid-element",
    writable: false
});

Object.defineProperty(App, 'gridSquareSelector', {
    value: ".grid-square",
    writable: false
});

Object.defineProperty(App, 'gridContainerSelector', {
    value: ".grid-container",
    writable: false
});
