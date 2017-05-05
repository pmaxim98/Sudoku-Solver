class Sudoku {
    constructor(/*gridElements*/) {
        this.sideLength = this.squareCount = 9;
        this.squareLength = this.sideLength / 3;

        this.cells = this.initMatrix(/*gridElements */);
    }
    
    changeCellValue(element, value) {
        var squareIndex = element.parent().index();
        var cellIndex = element.index();

        var row = Math.floor(squareIndex / this.squareLength) * this.squareLength + Math.floor(cellIndex / this.squareLength);
        var col = (squareIndex % this.squareLength) * this.squareLength + cellIndex % this.squareLength;

        if (this.cells[row][col].initial)
            return false;

        var finalValue = value == "" ? 0 : value;
        this.cells[row][col].value = parseInt(finalValue);
        //this.cells[cellRow][cellCol].initial = false;

        console.log(Utils.stringifyMatrix(this.cells));
        return true;
    }

    initMatrix() {
        var matrix = [];
        for (var row = 0; row < this.sideLength; ++row)
            matrix[row] = [];

        for (var square = 0; square < this.squareCount; ++square)
            for (var row = 0; row < this.squareLength; ++row)
                for (var col = 0; col < this.squareLength; ++col) {
                    var alignedRow = row + this.squareLength * (Math.floor(square / this.squareLength));
                    var alignedCol = col + this.squareLength * (square % this.squareLength);
                    var currentCellIndex = this.squareCount * square + row * this.squareLength + col;

                    matrix[alignedRow][alignedCol] = { "value": 0, "initial" : false };
                }

        return matrix;
    }

    changeMatrix(sudoku) {
        var tempMatrix = this.initMatrix();

        if (typeof sudoku === 'string') {
            for (var row = 0; row < this.sideLength; ++row) {
                for (var col = 0; col < this.sideLength; ++col) {
                    var cellValue = "0";
                    if (row * this.sideLength + col < sudoku.length)
                        cellValue = sudoku[row * this.sideLength + col];

                    if (cellValue >= "1" && cellValue <= "9") {
                        tempMatrix[row][col].value = parseInt(cellValue);
                        tempMatrix[row][col].initial = true;
                    }
                    else if (cellValue == "0") {
                        tempMatrix[row][col].value = 0;
                        tempMatrix[row][col].initial = false;
                    }
                    else {
                        return false;
                    }
                }
            }

            this.cells = tempMatrix;
            return true;
        }
        else {
            throw "Invalid object passed to changeMatrix() function.";
        }
    }

    getMatrix() {
        return this.cells;
    }

    validChoice(row, col) {
        if (this.cells[row][col].value > 9)
            return false;

        for (var r = 0; r < row; ++r)
            if (this.cells[row][col].value == this.cells[r][col].value)
                return false;
        for (var r = row + 1; r < this.sideLength; ++r)
            if (this.cells[row][col].value == this.cells[r][col].value)
                return false;
        for (var c = 0; c < col; ++c)
            if (this.cells[row][col].value == this.cells[row][c].value)
                return false;
        for (var c = col + 1; c < this.sideLength; ++c)
            if (this.cells[row][col].value == this.cells[row][c].value)
                return false;

        var ri = Math.floor(row / this.squareLength) * this.squareLength;
        var ci = Math.floor(col / this.squareLength) * this.squareLength;
        for (var r = ri; r < this.squareLength + ri; ++r)
            for (var c = ci; c < this.squareLength + ci; ++c)
                if (row != r && col != c)
                    if (this.cells[r][c].value == this.cells[row][col].value)
                        return false;

        return true;
    }

    nextEmptyCellIndex(startRow, startCol) {
        var pos = { "row": 0, "col": 0 };

        for (var row = startRow; row < this.sideLength; ++row)
            for (var col = (row == startRow ? startCol : 0); col < this.sideLength; ++col)
                if (!this.cells[row][col].initial && !this.cells[row][col].value) {
                    pos.row = row;
                    pos.col = col;
                    return pos;
                }

        return { "row": -1, "col": -1 };
    }

    solve() {
        var cellsLeft = this.sideLength * this.sideLength;
        for (var row = 0; row < this.sideLength; ++row)
            for (var col = 0; col < this.sideLength; ++col)
                cellsLeft -= !!this.cells[row][col].value;

        var stack = [];
        stack.push($.extend({}, { "digit": 1 }, this.nextEmptyCellIndex(0, 0)));

        if (stack[0].row == -1 && stack[0].col == -1)
            return true;

        this.cells[stack[0].row][stack[0].col].value = stack[0].digit;
        --cellsLeft;

        while (true) {
            var top = stack.length - 1;
            if (stack[top].digit > 9) {
                this.cells[stack[top].row][stack[top].col].value = 0;
                stack.pop();
                ++cellsLeft;

                if (top - 1 < 0)
                    return false;
                ++stack[top - 1].digit;
                this.cells[stack[top - 1].row][stack[top - 1].col].value = stack[top - 1].digit;
                continue;
            }

            if (this.validChoice(stack[top].row, stack[top].col)) {
                if (cellsLeft < 1) {
                    return true;
                }
                else {
                    stack.push($.extend({}, { "digit": 1 }, this.nextEmptyCellIndex(stack[top].row, stack[top].col)));
                    this.cells[stack[top + 1].row][stack[top + 1].col].value = stack[top + 1].digit;
                    --cellsLeft;
                }
            }
            else {
                ++stack[top].digit;
                this.cells[stack[top].row][stack[top].col].value = stack[top].digit;
            }
        }
    }
}
