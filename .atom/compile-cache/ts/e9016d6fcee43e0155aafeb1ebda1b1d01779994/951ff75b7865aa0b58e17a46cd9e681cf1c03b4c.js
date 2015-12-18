// Type definitions for es6-promises
// Project: https://github.com/jakearchibald/ES6-Promises
// Definitions by: François de Campredon <https://github.com/fdecampredon/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi90eXBpbmdzL2JsdWViaXJkLmQudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvdHlwaW5ncy9ibHVlYmlyZC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyx5REFBeUQ7QUFDekQsMkVBQTJFO0FBQzNFLDhEQUE4RDtBQTBJN0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUeXBlIGRlZmluaXRpb25zIGZvciBlczYtcHJvbWlzZXNcbi8vIFByb2plY3Q6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYWtlYXJjaGliYWxkL0VTNi1Qcm9taXNlc1xuLy8gRGVmaW5pdGlvbnMgYnk6IEZyYW7Dp29pcyBkZSBDYW1wcmVkb24gPGh0dHBzOi8vZ2l0aHViLmNvbS9mZGVjYW1wcmVkb24vPlxuLy8gRGVmaW5pdGlvbnM6IGh0dHBzOi8vZ2l0aHViLmNvbS9ib3Jpc3lhbmtvdi9EZWZpbml0ZWx5VHlwZWRcblxuLyp0c2xpbnQ6ZGlzYWJsZSB1bnVzZWQqL1xuZGVjbGFyZSBtb2R1bGUgJ2JsdWViaXJkJyB7XG4gICAgY2xhc3MgUHJvbWlzZTxSPiBpbXBsZW1lbnRzIFByb21pc2UuVGhlbmFibGU8Uj4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgeW91IGNhbGwgcmVzb2x2ZSBpbiB0aGUgYm9keSBvZiB0aGUgY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciwgXG4gICAgICAgICAqIHlvdXIgcHJvbWlzZSBpcyBmdWxmaWxsZWQgd2l0aCByZXN1bHQgb2JqZWN0IHBhc3NlZCB0byByZXNvbHZlLlxuICAgICAgICAgKiBJZiB5b3UgY2FsbCByZWplY3QgeW91ciBwcm9taXNlIGlzIHJlamVjdGVkIHdpdGggdGhlIG9iamVjdCBwYXNzZWQgdG8gcmVzb2x2ZS4gXG4gICAgICAgICAqIEZvciBjb25zaXN0ZW5jeSBhbmQgZGVidWdnaW5nIChlZyBzdGFjayB0cmFjZXMpLCBvYmogc2hvdWxkIGJlIGFuIGluc3RhbmNlb2YgRXJyb3IuIFxuICAgICAgICAgKiBBbnkgZXJyb3JzIHRocm93biBpbiB0aGUgY29uc3RydWN0b3IgY2FsbGJhY2sgd2lsbCBiZSBpbXBsaWNpdGx5IHBhc3NlZCB0byByZWplY3QoKS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrOiAocmVzb2x2ZTogKHJlc3VsdDogUikgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3I6IGFueSkgPT4gdm9pZCkgPT4gdm9pZCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB5b3UgY2FsbCByZXNvbHZlIGluIHRoZSBib2R5IG9mIHRoZSBjYWxsYmFjayBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yLCBcbiAgICAgICAgICogeW91ciBwcm9taXNlIHdpbGwgYmUgZnVsZmlsbGVkL3JlamVjdGVkIHdpdGggdGhlIG91dGNvbWUgb2YgdGhlbmFibGUgcGFzc2VkIHRvIHJlc29sdmUuXG4gICAgICAgICAqIElmIHlvdSBjYWxsIHJlamVjdCB5b3VyIHByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCB0aGUgb2JqZWN0IHBhc3NlZCB0byByZXNvbHZlLiBcbiAgICAgICAgICogRm9yIGNvbnNpc3RlbmN5IGFuZCBkZWJ1Z2dpbmcgKGVnIHN0YWNrIHRyYWNlcyksIG9iaiBzaG91bGQgYmUgYW4gaW5zdGFuY2VvZiBFcnJvci4gXG4gICAgICAgICAqIEFueSBlcnJvcnMgdGhyb3duIGluIHRoZSBjb25zdHJ1Y3RvciBjYWxsYmFjayB3aWxsIGJlIGltcGxpY2l0bHkgcGFzc2VkIHRvIHJlamVjdCgpLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoY2FsbGJhY2s6IChyZXNvbHZlOiAodGhlbmFibGU6IFByb21pc2UuVGhlbmFibGU8Uj4pID0+IHZvaWQsIHJlamVjdDogKGVycm9yOiBhbnkpID0+IHZvaWQpID0+IHZvaWQpO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG9uRnVsRmlsbCBpcyBjYWxsZWQgd2hlbi9pZiBcInByb21pc2VcIiByZXNvbHZlcy4gb25SZWplY3RlZCBpcyBjYWxsZWQgd2hlbi9pZiBcInByb21pc2VcIiByZWplY3RzLiBcbiAgICAgICAgICogQm90aCBhcmUgb3B0aW9uYWwsIGlmIGVpdGhlci9ib3RoIGFyZSBvbWl0dGVkIHRoZSBuZXh0IG9uRnVsZmlsbGVkL29uUmVqZWN0ZWQgaW4gdGhlIGNoYWluIGlzIGNhbGxlZC4gXG4gICAgICAgICAqIEJvdGggY2FsbGJhY2tzIGhhdmUgYSBzaW5nbGUgcGFyYW1ldGVyICwgdGhlIGZ1bGZpbGxtZW50IHZhbHVlIG9yIHJlamVjdGlvbiByZWFzb24uIFxuICAgICAgICAgKiBcInRoZW5cIiByZXR1cm5zIGEgbmV3IHByb21pc2UgZXF1aXZhbGVudCB0byB0aGUgdmFsdWUgeW91IHJldHVybiBmcm9tIG9uRnVsZmlsbGVkL29uUmVqZWN0ZWQgYWZ0ZXIgXG4gICAgICAgICAqIGJlaW5nIHBhc3NlZCB0aHJvdWdoIFByb21pc2UucmVzb2x2ZS4gXG4gICAgICAgICAqIElmIGFuIGVycm9yIGlzIHRocm93biBpbiB0aGUgY2FsbGJhY2ssIHRoZSByZXR1cm5lZCBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGF0IGVycm9yLlxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtIG9uRnVsRmlsbCBjYWxsZWQgd2hlbi9pZiBcInByb21pc2VcIiByZXNvbHZlc1xuICAgICAgICAgKiBAcGFyYW0gb25SZWplY3QgY2FsbGVkIHdoZW4vaWYgXCJwcm9taXNlXCIgcmVqZWN0c1xuICAgICAgICAgKi9cbiAgICAgICAgdGhlbjxVPihvbkZ1bGZpbGw6ICh2YWx1ZTogUikgPT4gUHJvbWlzZS5UaGVuYWJsZTxVPiwgIG9uUmVqZWN0OiAoZXJyb3I6IGFueSkgPT4gUHJvbWlzZS5UaGVuYWJsZTxVPik6IFByb21pc2U8VT47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBvbkZ1bEZpbGwgaXMgY2FsbGVkIHdoZW4vaWYgXCJwcm9taXNlXCIgcmVzb2x2ZXMuIG9uUmVqZWN0ZWQgaXMgY2FsbGVkIHdoZW4vaWYgXCJwcm9taXNlXCIgcmVqZWN0cy4gXG4gICAgICAgICAqIEJvdGggYXJlIG9wdGlvbmFsLCBpZiBlaXRoZXIvYm90aCBhcmUgb21pdHRlZCB0aGUgbmV4dCBvbkZ1bGZpbGxlZC9vblJlamVjdGVkIGluIHRoZSBjaGFpbiBpcyBjYWxsZWQuIFxuICAgICAgICAgKiBCb3RoIGNhbGxiYWNrcyBoYXZlIGEgc2luZ2xlIHBhcmFtZXRlciAsIHRoZSBmdWxmaWxsbWVudCB2YWx1ZSBvciByZWplY3Rpb24gcmVhc29uLiBcbiAgICAgICAgICogXCJ0aGVuXCIgcmV0dXJucyBhIG5ldyBwcm9taXNlIGVxdWl2YWxlbnQgdG8gdGhlIHZhbHVlIHlvdSByZXR1cm4gZnJvbSBvbkZ1bGZpbGxlZC9vblJlamVjdGVkIGFmdGVyIFxuICAgICAgICAgKiBiZWluZyBwYXNzZWQgdGhyb3VnaCBQcm9taXNlLnJlc29sdmUuIFxuICAgICAgICAgKiBJZiBhbiBlcnJvciBpcyB0aHJvd24gaW4gdGhlIGNhbGxiYWNrLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhhdCBlcnJvci5cbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSBvbkZ1bEZpbGwgY2FsbGVkIHdoZW4vaWYgXCJwcm9taXNlXCIgcmVzb2x2ZXNcbiAgICAgICAgICogQHBhcmFtIG9uUmVqZWN0IGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlamVjdHNcbiAgICAgICAgICovXG4gICAgICAgIHRoZW48VT4ob25GdWxmaWxsOiAodmFsdWU6IFIpID0+IFByb21pc2UuVGhlbmFibGU8VT4sIG9uUmVqZWN0PzogKGVycm9yOiBhbnkpID0+IFUpOiBQcm9taXNlPFU+O1xuICAgICAgICAvKipcbiAgICAgICAgICogb25GdWxGaWxsIGlzIGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlc29sdmVzLiBvblJlamVjdGVkIGlzIGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlamVjdHMuIFxuICAgICAgICAgKiBCb3RoIGFyZSBvcHRpb25hbCwgaWYgZWl0aGVyL2JvdGggYXJlIG9taXR0ZWQgdGhlIG5leHQgb25GdWxmaWxsZWQvb25SZWplY3RlZCBpbiB0aGUgY2hhaW4gaXMgY2FsbGVkLiBcbiAgICAgICAgICogQm90aCBjYWxsYmFja3MgaGF2ZSBhIHNpbmdsZSBwYXJhbWV0ZXIgLCB0aGUgZnVsZmlsbG1lbnQgdmFsdWUgb3IgcmVqZWN0aW9uIHJlYXNvbi4gXG4gICAgICAgICAqIFwidGhlblwiIHJldHVybnMgYSBuZXcgcHJvbWlzZSBlcXVpdmFsZW50IHRvIHRoZSB2YWx1ZSB5b3UgcmV0dXJuIGZyb20gb25GdWxmaWxsZWQvb25SZWplY3RlZCBhZnRlciBcbiAgICAgICAgICogYmVpbmcgcGFzc2VkIHRocm91Z2ggUHJvbWlzZS5yZXNvbHZlLiBcbiAgICAgICAgICogSWYgYW4gZXJyb3IgaXMgdGhyb3duIGluIHRoZSBjYWxsYmFjaywgdGhlIHJldHVybmVkIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoYXQgZXJyb3IuXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gb25GdWxGaWxsIGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlc29sdmVzXG4gICAgICAgICAqIEBwYXJhbSBvblJlamVjdCBjYWxsZWQgd2hlbi9pZiBcInByb21pc2VcIiByZWplY3RzXG4gICAgICAgICAqL1xuICAgICAgICB0aGVuPFU+KG9uRnVsZmlsbDogKHZhbHVlOiBSKSA9PiBVLCBvblJlamVjdDogKGVycm9yOiBhbnkpID0+IFByb21pc2UuVGhlbmFibGU8VT4pOiBQcm9taXNlPFU+O1xuICAgICAgICAvKipcbiAgICAgICAgICogb25GdWxGaWxsIGlzIGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlc29sdmVzLiBvblJlamVjdGVkIGlzIGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlamVjdHMuIFxuICAgICAgICAgKiBCb3RoIGFyZSBvcHRpb25hbCwgaWYgZWl0aGVyL2JvdGggYXJlIG9taXR0ZWQgdGhlIG5leHQgb25GdWxmaWxsZWQvb25SZWplY3RlZCBpbiB0aGUgY2hhaW4gaXMgY2FsbGVkLiBcbiAgICAgICAgICogQm90aCBjYWxsYmFja3MgaGF2ZSBhIHNpbmdsZSBwYXJhbWV0ZXIgLCB0aGUgZnVsZmlsbG1lbnQgdmFsdWUgb3IgcmVqZWN0aW9uIHJlYXNvbi4gXG4gICAgICAgICAqIFwidGhlblwiIHJldHVybnMgYSBuZXcgcHJvbWlzZSBlcXVpdmFsZW50IHRvIHRoZSB2YWx1ZSB5b3UgcmV0dXJuIGZyb20gb25GdWxmaWxsZWQvb25SZWplY3RlZCBhZnRlciBcbiAgICAgICAgICogYmVpbmcgcGFzc2VkIHRocm91Z2ggUHJvbWlzZS5yZXNvbHZlLiBcbiAgICAgICAgICogSWYgYW4gZXJyb3IgaXMgdGhyb3duIGluIHRoZSBjYWxsYmFjaywgdGhlIHJldHVybmVkIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoYXQgZXJyb3IuXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gb25GdWxGaWxsIGNhbGxlZCB3aGVuL2lmIFwicHJvbWlzZVwiIHJlc29sdmVzXG4gICAgICAgICAqIEBwYXJhbSBvblJlamVjdCBjYWxsZWQgd2hlbi9pZiBcInByb21pc2VcIiByZWplY3RzXG4gICAgICAgICAqL1xuICAgICAgICB0aGVuPFU+KG9uRnVsZmlsbD86ICh2YWx1ZTogUikgPT4gVSwgb25SZWplY3Q/OiAoZXJyb3I6IGFueSkgPT4gVSk6IFByb21pc2U8VT47XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3VnYXIgZm9yIHByb21pc2UudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gb25SZWplY3QgY2FsbGVkIHdoZW4vaWYgXCJwcm9taXNlXCIgcmVqZWN0c1xuICAgICAgICAgKi9cbiAgICAgICAgY2F0Y2g8VT4ob25SZWplY3Q/OiAoZXJyb3I6IGFueSkgPT4gUHJvbWlzZS5UaGVuYWJsZTxVPik6IFByb21pc2U8VT47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdWdhciBmb3IgcHJvbWlzZS50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZClcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSBvblJlamVjdCBjYWxsZWQgd2hlbi9pZiBcInByb21pc2VcIiByZWplY3RzXG4gICAgICAgICAqL1xuICAgICAgICBjYXRjaDxVPihvblJlamVjdD86IChlcnJvcjogYW55KSA9PiBVKTogUHJvbWlzZTxVPjtcbiAgICB9XG5cbiAgICBtb2R1bGUgUHJvbWlzZSB7XG4gICAgICAgIFxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFRoZW5hYmxlPFI+IHtcbiAgICAgICAgICAgIHRoZW48VT4ob25GdWxmaWxsZWQ6ICh2YWx1ZTogUikgPT4gVGhlbmFibGU8VT4sICBvblJlamVjdGVkOiAoZXJyb3I6IGFueSkgPT4gVGhlbmFibGU8VT4pOiBUaGVuYWJsZTxVPjtcbiAgICAgICAgICAgIHRoZW48VT4ob25GdWxmaWxsZWQ6ICh2YWx1ZTogUikgPT4gVGhlbmFibGU8VT4sIG9uUmVqZWN0ZWQ/OiAoZXJyb3I6IGFueSkgPT4gVSk6IFRoZW5hYmxlPFU+O1xuICAgICAgICAgICAgdGhlbjxVPihvbkZ1bGZpbGxlZDogKHZhbHVlOiBSKSA9PiBVLCBvblJlamVjdGVkOiAoZXJyb3I6IGFueSkgPT4gVGhlbmFibGU8VT4pOiBUaGVuYWJsZTxVPjtcbiAgICAgICAgICAgIHRoZW48VT4ob25GdWxmaWxsZWQ/OiAodmFsdWU6IFIpID0+IFUsIG9uUmVqZWN0ZWQ/OiAoZXJyb3I6IGFueSkgPT4gVSk6IFRoZW5hYmxlPFU+O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgcHJvbWlzZSAob25seSBpZiBwcm9taXNlLmNvbnN0cnVjdG9yID09IFByb21pc2UpXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjYXN0PFI+KHByb21pc2U6IFByb21pc2U8Uj4pOiBQcm9taXNlPFI+O1xuICAgICAgICAvKipcbiAgICAgICAgICogTWFrZSBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB0byBvYmouXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjYXN0PFI+KG9iamVjdD86IFIpOiBQcm9taXNlPFI+O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1ha2UgYSBuZXcgcHJvbWlzZSBmcm9tIHRoZSB0aGVuYWJsZS4gXG4gICAgICAgICAqIEEgdGhlbmFibGUgaXMgcHJvbWlzZS1saWtlIGluIGFzIGZhciBhcyBpdCBoYXMgYSBcInRoZW5cIiBtZXRob2QuIFxuICAgICAgICAgKiBUaGlzIGFsc28gY3JlYXRlcyBhIG5ldyBwcm9taXNlIGlmIHlvdSBwYXNzIGl0IGEgZ2VudWluZSBKYXZhU2NyaXB0IHByb21pc2UsIFxuICAgICAgICAgKiBtYWtpbmcgaXQgbGVzcyBlZmZpY2llbnQgZm9yIGNhc3RpbmcgdGhhbiBQcm9taXNlLmNhc3QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNvbHZlPFI+KHRoZW5hYmxlOiBQcm9taXNlLlRoZW5hYmxlPFI+KTogUHJvbWlzZTxSPjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1ha2UgYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgdG8gb2JqLiBTYW1lIGFzIFByb21pc2UuY2FzdChvYmopIGluIHRoaXMgc2l0dWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZTxSPihvYmplY3Q/OiBSKTogUHJvbWlzZTxSPjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFrZSBhIHByb21pc2UgdGhhdCByZWplY3RzIHRvIG9iai4gRm9yIGNvbnNpc3RlbmN5IGFuZCBkZWJ1Z2dpbmcgKGVnIHN0YWNrIHRyYWNlcyksIG9iaiBzaG91bGQgYmUgYW4gaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0KGVycm9yPzogYW55KTogUHJvbWlzZTxhbnk+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYWtlIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdoZW4gZXZlcnkgaXRlbSBpbiB0aGUgYXJyYXkgZnVsZmlsbHMsIGFuZCByZWplY3RzIGlmIChhbmQgd2hlbikgYW55IGl0ZW0gcmVqZWN0cy4gXG4gICAgICAgICAqIHRoZSBhcnJheSBwYXNzZWQgdG8gYWxsIGNhbiBiZSBhIG1peHR1cmUgb2YgcHJvbWlzZS1saWtlIG9iamVjdHMgYW5kIG90aGVyIG9iamVjdHMuIFxuICAgICAgICAgKiBUaGUgZnVsZmlsbG1lbnQgdmFsdWUgaXMgYW4gYXJyYXkgKGluIG9yZGVyKSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMuIFRoZSByZWplY3Rpb24gdmFsdWUgaXMgdGhlIGZpcnN0IHJlamVjdGlvbiB2YWx1ZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbDxSPihwcm9taXNlczogUHJvbWlzZTxSPltdKTogUHJvbWlzZTxSW10+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYWtlIGEgUHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdoZW4gYW55IGl0ZW0gZnVsZmlsbHMsIGFuZCByZWplY3RzIGlmIGFueSBpdGVtIHJlamVjdHMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByYWNlPFI+KHByb21pc2VzOiBQcm9taXNlPFI+W10pOiBQcm9taXNlPFI+O1xuICAgIH1cbiAgICBcbiAgICBcbiAgICBleHBvcnQgPSBQcm9taXNlO1xufVxuIl19
//# sourceURL=/Users/anas/.atom/packages/atom-typescript/lib/typings/bluebird.d.ts