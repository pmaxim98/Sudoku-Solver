var Utils = (function() {
    return {
        stringifyMatrix: function(matrix) {
            var outputMatrix = "";

            for (var row = 0; row < matrix.length; ++row) {
                if (matrix[row].every(function (obj) {
                    return typeof obj !== 'object';
                })) {
                    outputMatrix += "[" + matrix[row].join(", ") + "]\n";
                }
                else {
                    outputMatrix += "[";
                    for (var col = 0; col < matrix[row].length; ++col) {
                        outputMatrix += "(" + Object.keys(matrix[row][col]).map(key => matrix[row][col][key]).join(", ") + ")";
                        if (col != matrix.length - 1)
                            outputMatrix += ",";
                    }
                    outputMatrix += "]\n";
                }
            }

            return outputMatrix;
        },

        resizeTextArea: function($textArea) {
            $textArea.css("height", "auto");
            $textArea.css("height", $textArea.get(0).scrollHeight);
        },

        centerControl: function($selector) {
            $selector.css("position", "absolute");
            $selector.css("top", $(window).height() / 2 - $selector.height() / 2);
            $selector.css("left", $(window).width() / 2 - $selector.width() / 2);
        }
    };
})();
