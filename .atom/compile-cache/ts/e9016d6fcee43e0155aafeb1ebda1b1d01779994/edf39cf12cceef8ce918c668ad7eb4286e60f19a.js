var os = require('os');
function defaultFormatCodeOptions() {
    return {
        IndentSize: 4,
        TabSize: 4,
        NewLineCharacter: os.EOL,
        ConvertTabsToSpaces: true,
        IndentStyle: ts.IndentStyle.Smart,
        InsertSpaceAfterCommaDelimiter: true,
        InsertSpaceAfterSemicolonInForStatements: true,
        InsertSpaceBeforeAndAfterBinaryOperators: true,
        InsertSpaceAfterKeywordsInControlFlowStatements: true,
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        PlaceOpenBraceOnNewLineForFunctions: false,
        PlaceOpenBraceOnNewLineForControlBlocks: false,
    };
}
exports.defaultFormatCodeOptions = defaultFormatCodeOptions;
function makeFormatCodeOptions(config) {
    var options = defaultFormatCodeOptions();
    if (!config) {
        return options;
    }
    if (typeof config.insertSpaceAfterCommaDelimiter === "boolean") {
        options.InsertSpaceAfterCommaDelimiter = config.insertSpaceAfterCommaDelimiter;
    }
    if (typeof config.insertSpaceAfterSemicolonInForStatements === "boolean") {
        options.InsertSpaceAfterSemicolonInForStatements = config.insertSpaceAfterSemicolonInForStatements;
    }
    if (typeof config.insertSpaceBeforeAndAfterBinaryOperators === "boolean") {
        options.InsertSpaceBeforeAndAfterBinaryOperators = config.insertSpaceBeforeAndAfterBinaryOperators;
    }
    if (typeof config.insertSpaceAfterKeywordsInControlFlowStatements === "boolean") {
        options.InsertSpaceAfterKeywordsInControlFlowStatements = config.insertSpaceAfterKeywordsInControlFlowStatements;
    }
    if (typeof config.insertSpaceAfterFunctionKeywordForAnonymousFunctions === "boolean") {
        options.InsertSpaceAfterFunctionKeywordForAnonymousFunctions = config.insertSpaceAfterFunctionKeywordForAnonymousFunctions;
    }
    if (typeof config.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis === "boolean") {
        options.InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = config.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis;
    }
    if (typeof config.placeOpenBraceOnNewLineForFunctions === "boolean") {
        options.PlaceOpenBraceOnNewLineForFunctions = config.placeOpenBraceOnNewLineForFunctions;
    }
    if (typeof config.placeOpenBraceOnNewLineForControlBlocks === "boolean") {
        options.PlaceOpenBraceOnNewLineForControlBlocks = config.placeOpenBraceOnNewLineForControlBlocks;
    }
    if (typeof config.indentSize === "number") {
        options.IndentSize = config.indentSize;
    }
    if (typeof config.tabSize === "number") {
        options.TabSize = config.tabSize;
    }
    if (typeof config.newLineCharacter === "string") {
        options.NewLineCharacter = config.newLineCharacter;
    }
    if (typeof config.convertTabsToSpaces === "boolean") {
        options.ConvertTabsToSpaces = config.convertTabsToSpaces;
    }
    return options;
}
exports.makeFormatCodeOptions = makeFormatCodeOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL3RzY29uZmlnL2Zvcm1hdHRpbmcudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi90c2NvbmZpZy9mb3JtYXR0aW5nLnRzIl0sIm5hbWVzIjpbImRlZmF1bHRGb3JtYXRDb2RlT3B0aW9ucyIsIm1ha2VGb3JtYXRDb2RlT3B0aW9ucyJdLCJtYXBwaW5ncyI6IkFBRUEsSUFBTyxFQUFFLFdBQVcsSUFBSSxDQUFDLENBQUM7QUFvQjFCLFNBQWdCLHdCQUF3QjtJQUNwQ0EsTUFBTUEsQ0FBQ0E7UUFDSEEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDYkEsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDVkEsZ0JBQWdCQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQTtRQUN4QkEsbUJBQW1CQSxFQUFFQSxJQUFJQTtRQUN6QkEsV0FBV0EsRUFBRUEsRUFBRUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0E7UUFDakNBLDhCQUE4QkEsRUFBRUEsSUFBSUE7UUFDcENBLHdDQUF3Q0EsRUFBRUEsSUFBSUE7UUFDOUNBLHdDQUF3Q0EsRUFBRUEsSUFBSUE7UUFDOUNBLCtDQUErQ0EsRUFBRUEsSUFBSUE7UUFDckRBLG9EQUFvREEsRUFBRUEsS0FBS0E7UUFDM0RBLHVEQUF1REEsRUFBRUEsS0FBS0E7UUFDOURBLDBEQUEwREEsRUFBRUEsS0FBS0E7UUFDakVBLG1DQUFtQ0EsRUFBRUEsS0FBS0E7UUFDMUNBLHVDQUF1Q0EsRUFBRUEsS0FBS0E7S0FDakRBLENBQUNBO0FBQ05BLENBQUNBO0FBakJlLGdDQUF3QixHQUF4Qix3QkFpQmYsQ0FBQTtBQUdELFNBQWdCLHFCQUFxQixDQUFDLE1BQXlCO0lBQzNEQyxJQUFJQSxPQUFPQSxHQUFHQSx3QkFBd0JBLEVBQUVBLENBQUNBO0lBQ3pDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNWQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUNuQkEsQ0FBQ0E7SUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsTUFBTUEsQ0FBQ0EsOEJBQThCQSxLQUFLQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3REEsT0FBT0EsQ0FBQ0EsOEJBQThCQSxHQUFHQSxNQUFNQSxDQUFDQSw4QkFBOEJBLENBQUNBO0lBQ25GQSxDQUFDQTtJQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxNQUFNQSxDQUFDQSx3Q0FBd0NBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3ZFQSxPQUFPQSxDQUFDQSx3Q0FBd0NBLEdBQUdBLE1BQU1BLENBQUNBLHdDQUF3Q0EsQ0FBQ0E7SUFDdkdBLENBQUNBO0lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLE1BQU1BLENBQUNBLHdDQUF3Q0EsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdkVBLE9BQU9BLENBQUNBLHdDQUF3Q0EsR0FBR0EsTUFBTUEsQ0FBQ0Esd0NBQXdDQSxDQUFDQTtJQUN2R0EsQ0FBQ0E7SUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsTUFBTUEsQ0FBQ0EsK0NBQStDQSxLQUFLQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5RUEsT0FBT0EsQ0FBQ0EsK0NBQStDQSxHQUFHQSxNQUFNQSxDQUFDQSwrQ0FBK0NBLENBQUNBO0lBQ3JIQSxDQUFDQTtJQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxNQUFNQSxDQUFDQSxvREFBb0RBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQ25GQSxPQUFPQSxDQUFDQSxvREFBb0RBLEdBQUdBLE1BQU1BLENBQUNBLG9EQUFvREEsQ0FBQ0E7SUFDL0hBLENBQUNBO0lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLE1BQU1BLENBQUNBLDBEQUEwREEsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDekZBLE9BQU9BLENBQUNBLDBEQUEwREEsR0FBR0EsTUFBTUEsQ0FBQ0EsMERBQTBEQSxDQUFDQTtJQUMzSUEsQ0FBQ0E7SUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsTUFBTUEsQ0FBQ0EsbUNBQW1DQSxLQUFLQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNsRUEsT0FBT0EsQ0FBQ0EsbUNBQW1DQSxHQUFHQSxNQUFNQSxDQUFDQSxtQ0FBbUNBLENBQUNBO0lBQzdGQSxDQUFDQTtJQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxNQUFNQSxDQUFDQSx1Q0FBdUNBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3RFQSxPQUFPQSxDQUFDQSx1Q0FBdUNBLEdBQUdBLE1BQU1BLENBQUNBLHVDQUF1Q0EsQ0FBQ0E7SUFDckdBLENBQUNBO0lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLE1BQU1BLENBQUNBLFVBQVVBLEtBQUtBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1FBQ3hDQSxPQUFPQSxDQUFDQSxVQUFVQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsTUFBTUEsQ0FBQ0EsT0FBT0EsS0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDckNBLE9BQU9BLENBQUNBLE9BQU9BLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO0lBQ3JDQSxDQUFDQTtJQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLEtBQUtBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1FBQzlDQSxPQUFPQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0E7SUFDdkRBLENBQUNBO0lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLE1BQU1BLENBQUNBLG1CQUFtQkEsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbERBLE9BQU9BLENBQUNBLG1CQUFtQkEsR0FBR0EsTUFBTUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQTtJQUM3REEsQ0FBQ0E7SUFFREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7QUFDbkJBLENBQUNBO0FBM0NlLDZCQUFxQixHQUFyQixxQkEyQ2YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQgb3MgPSByZXF1aXJlKCdvcycpO1xuXG4vLy8gVGhlIGZvbGxvd2luZyB0d28gaW50ZXJmYWNlcyBjb21lIGZyb20gdHlwZXNjcmlwdC5kLnRzIGJ1dCBjYW1lbENhc2VkIGZvciBKU09OIHBhcnNpbmdcbmludGVyZmFjZSBFZGl0b3JPcHRpb25zIHtcbiAgICBpbmRlbnRTaXplOiBudW1iZXI7XG4gICAgdGFiU2l6ZTogbnVtYmVyO1xuICAgIG5ld0xpbmVDaGFyYWN0ZXI6IHN0cmluZztcbiAgICBjb252ZXJ0VGFic1RvU3BhY2VzOiBib29sZWFuO1xufVxuZXhwb3J0IGludGVyZmFjZSBGb3JtYXRDb2RlT3B0aW9ucyBleHRlbmRzIEVkaXRvck9wdGlvbnMge1xuICAgIGluc2VydFNwYWNlQWZ0ZXJDb21tYURlbGltaXRlcjogYm9vbGVhbjtcbiAgICBpbnNlcnRTcGFjZUFmdGVyU2VtaWNvbG9uSW5Gb3JTdGF0ZW1lbnRzOiBib29sZWFuO1xuICAgIGluc2VydFNwYWNlQmVmb3JlQW5kQWZ0ZXJCaW5hcnlPcGVyYXRvcnM6IGJvb2xlYW47XG4gICAgaW5zZXJ0U3BhY2VBZnRlcktleXdvcmRzSW5Db250cm9sRmxvd1N0YXRlbWVudHM6IGJvb2xlYW47XG4gICAgaW5zZXJ0U3BhY2VBZnRlckZ1bmN0aW9uS2V5d29yZEZvckFub255bW91c0Z1bmN0aW9uczogYm9vbGVhbjtcbiAgICBpbnNlcnRTcGFjZUFmdGVyT3BlbmluZ0FuZEJlZm9yZUNsb3NpbmdOb25lbXB0eVBhcmVudGhlc2lzOiBib29sZWFuO1xuICAgIHBsYWNlT3BlbkJyYWNlT25OZXdMaW5lRm9yRnVuY3Rpb25zOiBib29sZWFuO1xuICAgIHBsYWNlT3BlbkJyYWNlT25OZXdMaW5lRm9yQ29udHJvbEJsb2NrczogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRGb3JtYXRDb2RlT3B0aW9ucygpOiB0cy5Gb3JtYXRDb2RlT3B0aW9ucyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSW5kZW50U2l6ZTogNCxcbiAgICAgICAgVGFiU2l6ZTogNCxcbiAgICAgICAgTmV3TGluZUNoYXJhY3Rlcjogb3MuRU9MLFxuICAgICAgICBDb252ZXJ0VGFic1RvU3BhY2VzOiB0cnVlLFxuICAgICAgICBJbmRlbnRTdHlsZTogdHMuSW5kZW50U3R5bGUuU21hcnQsXG4gICAgICAgIEluc2VydFNwYWNlQWZ0ZXJDb21tYURlbGltaXRlcjogdHJ1ZSxcbiAgICAgICAgSW5zZXJ0U3BhY2VBZnRlclNlbWljb2xvbkluRm9yU3RhdGVtZW50czogdHJ1ZSxcbiAgICAgICAgSW5zZXJ0U3BhY2VCZWZvcmVBbmRBZnRlckJpbmFyeU9wZXJhdG9yczogdHJ1ZSxcbiAgICAgICAgSW5zZXJ0U3BhY2VBZnRlcktleXdvcmRzSW5Db250cm9sRmxvd1N0YXRlbWVudHM6IHRydWUsXG4gICAgICAgIEluc2VydFNwYWNlQWZ0ZXJGdW5jdGlvbktleXdvcmRGb3JBbm9ueW1vdXNGdW5jdGlvbnM6IGZhbHNlLFxuICAgICAgICBJbnNlcnRTcGFjZUFmdGVyT3BlbmluZ0FuZEJlZm9yZUNsb3NpbmdOb25lbXB0eUJyYWNrZXRzOiBmYWxzZSxcbiAgICAgICAgSW5zZXJ0U3BhY2VBZnRlck9wZW5pbmdBbmRCZWZvcmVDbG9zaW5nTm9uZW1wdHlQYXJlbnRoZXNpczogZmFsc2UsXG4gICAgICAgIFBsYWNlT3BlbkJyYWNlT25OZXdMaW5lRm9yRnVuY3Rpb25zOiBmYWxzZSxcbiAgICAgICAgUGxhY2VPcGVuQnJhY2VPbk5ld0xpbmVGb3JDb250cm9sQmxvY2tzOiBmYWxzZSxcbiAgICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRm9ybWF0Q29kZU9wdGlvbnMoY29uZmlnOiBGb3JtYXRDb2RlT3B0aW9ucyk6IHRzLkZvcm1hdENvZGVPcHRpb25zIHtcbiAgICB2YXIgb3B0aW9ucyA9IGRlZmF1bHRGb3JtYXRDb2RlT3B0aW9ucygpO1xuICAgIGlmICghY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5pbnNlcnRTcGFjZUFmdGVyQ29tbWFEZWxpbWl0ZXIgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIG9wdGlvbnMuSW5zZXJ0U3BhY2VBZnRlckNvbW1hRGVsaW1pdGVyID0gY29uZmlnLmluc2VydFNwYWNlQWZ0ZXJDb21tYURlbGltaXRlcjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb25maWcuaW5zZXJ0U3BhY2VBZnRlclNlbWljb2xvbkluRm9yU3RhdGVtZW50cyA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgb3B0aW9ucy5JbnNlcnRTcGFjZUFmdGVyU2VtaWNvbG9uSW5Gb3JTdGF0ZW1lbnRzID0gY29uZmlnLmluc2VydFNwYWNlQWZ0ZXJTZW1pY29sb25JbkZvclN0YXRlbWVudHM7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uZmlnLmluc2VydFNwYWNlQmVmb3JlQW5kQWZ0ZXJCaW5hcnlPcGVyYXRvcnMgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIG9wdGlvbnMuSW5zZXJ0U3BhY2VCZWZvcmVBbmRBZnRlckJpbmFyeU9wZXJhdG9ycyA9IGNvbmZpZy5pbnNlcnRTcGFjZUJlZm9yZUFuZEFmdGVyQmluYXJ5T3BlcmF0b3JzO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5pbnNlcnRTcGFjZUFmdGVyS2V5d29yZHNJbkNvbnRyb2xGbG93U3RhdGVtZW50cyA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgb3B0aW9ucy5JbnNlcnRTcGFjZUFmdGVyS2V5d29yZHNJbkNvbnRyb2xGbG93U3RhdGVtZW50cyA9IGNvbmZpZy5pbnNlcnRTcGFjZUFmdGVyS2V5d29yZHNJbkNvbnRyb2xGbG93U3RhdGVtZW50cztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb25maWcuaW5zZXJ0U3BhY2VBZnRlckZ1bmN0aW9uS2V5d29yZEZvckFub255bW91c0Z1bmN0aW9ucyA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgb3B0aW9ucy5JbnNlcnRTcGFjZUFmdGVyRnVuY3Rpb25LZXl3b3JkRm9yQW5vbnltb3VzRnVuY3Rpb25zID0gY29uZmlnLmluc2VydFNwYWNlQWZ0ZXJGdW5jdGlvbktleXdvcmRGb3JBbm9ueW1vdXNGdW5jdGlvbnM7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uZmlnLmluc2VydFNwYWNlQWZ0ZXJPcGVuaW5nQW5kQmVmb3JlQ2xvc2luZ05vbmVtcHR5UGFyZW50aGVzaXMgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIG9wdGlvbnMuSW5zZXJ0U3BhY2VBZnRlck9wZW5pbmdBbmRCZWZvcmVDbG9zaW5nTm9uZW1wdHlQYXJlbnRoZXNpcyA9IGNvbmZpZy5pbnNlcnRTcGFjZUFmdGVyT3BlbmluZ0FuZEJlZm9yZUNsb3NpbmdOb25lbXB0eVBhcmVudGhlc2lzO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5wbGFjZU9wZW5CcmFjZU9uTmV3TGluZUZvckZ1bmN0aW9ucyA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgb3B0aW9ucy5QbGFjZU9wZW5CcmFjZU9uTmV3TGluZUZvckZ1bmN0aW9ucyA9IGNvbmZpZy5wbGFjZU9wZW5CcmFjZU9uTmV3TGluZUZvckZ1bmN0aW9ucztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb25maWcucGxhY2VPcGVuQnJhY2VPbk5ld0xpbmVGb3JDb250cm9sQmxvY2tzID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICBvcHRpb25zLlBsYWNlT3BlbkJyYWNlT25OZXdMaW5lRm9yQ29udHJvbEJsb2NrcyA9IGNvbmZpZy5wbGFjZU9wZW5CcmFjZU9uTmV3TGluZUZvckNvbnRyb2xCbG9ja3M7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uZmlnLmluZGVudFNpemUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgb3B0aW9ucy5JbmRlbnRTaXplID0gY29uZmlnLmluZGVudFNpemU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uZmlnLnRhYlNpemUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgb3B0aW9ucy5UYWJTaXplID0gY29uZmlnLnRhYlNpemU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uZmlnLm5ld0xpbmVDaGFyYWN0ZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgb3B0aW9ucy5OZXdMaW5lQ2hhcmFjdGVyID0gY29uZmlnLm5ld0xpbmVDaGFyYWN0ZXI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uZmlnLmNvbnZlcnRUYWJzVG9TcGFjZXMgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIG9wdGlvbnMuQ29udmVydFRhYnNUb1NwYWNlcyA9IGNvbmZpZy5jb252ZXJ0VGFic1RvU3BhY2VzO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xufVxuIl19
//# sourceURL=/Users/anas/.atom/packages/atom-typescript/lib/main/tsconfig/formatting.ts
