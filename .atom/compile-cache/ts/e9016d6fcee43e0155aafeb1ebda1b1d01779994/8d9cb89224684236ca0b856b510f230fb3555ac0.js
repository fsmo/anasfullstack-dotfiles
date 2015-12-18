/**
 * Take a look at :
 * https://github.com/reactjs/react-magic
 * https://www.npmjs.com/package/htmltojsx
 */
var HTMLtoJSX = require("htmltojsx");
function convert(content, indentSize) {
    var indent = Array(indentSize + 1).join(' ');
    var converter = new HTMLtoJSX({ indent: indent, createClass: false });
    var output = converter.convert(content);
    return output;
}
exports.convert = convert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL3JlYWN0L2h0bWx0b3RzeC50cyIsInNvdXJjZXMiOlsiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL3JlYWN0L2h0bWx0b3RzeC50cyJdLCJuYW1lcyI6WyJjb252ZXJ0Il0sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsSUFBTyxTQUFTLFdBQVcsV0FBVyxDQUFDLENBQUM7QUFDeEMsU0FBZ0IsT0FBTyxDQUFDLE9BQWUsRUFBRSxVQUFrQjtJQUN2REEsSUFBSUEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0EsVUFBVUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDN0NBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLFNBQVNBLENBQUNBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFdBQVdBLEVBQUVBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBO0lBQ3RFQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUN4Q0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDbEJBLENBQUNBO0FBTGUsZUFBTyxHQUFQLE9BS2YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGFrZSBhIGxvb2sgYXQgOlxuICogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmVhY3QtbWFnaWNcbiAqIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2h0bWx0b2pzeFxuICovXG5cbmltcG9ydCBIVE1MdG9KU1ggPSByZXF1aXJlKFwiaHRtbHRvanN4XCIpO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnQoY29udGVudDogc3RyaW5nLCBpbmRlbnRTaXplOiBudW1iZXIpIHtcbiAgICB2YXIgaW5kZW50ID0gQXJyYXkoaW5kZW50U2l6ZSArIDEpLmpvaW4oJyAnKTtcbiAgICB2YXIgY29udmVydGVyID0gbmV3IEhUTUx0b0pTWCh7IGluZGVudDogaW5kZW50LCBjcmVhdGVDbGFzczogZmFsc2UgfSk7XG4gICAgdmFyIG91dHB1dCA9IGNvbnZlcnRlci5jb252ZXJ0KGNvbnRlbnQpO1xuICAgIHJldHVybiBvdXRwdXQ7XG59XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/atom-typescript/lib/main/react/htmltotsx.ts
