function requestHandler(config) {
    /*
    try {
        console.log(require('views/tooltip'));
    } catch (ex) {
        console.error(ex);
    }*/
    /*
    var signatures = config.program.languageService.getSignatureHelpItems(config.filePath, config.position);
    if (!signatures) return;
    */
    // console.log(signatures);
}
exports.requestHandler = requestHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL2F0b20vc2lnbmF0dXJlUHJvdmlkZXIudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9hdG9tL3NpZ25hdHVyZVByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbInJlcXVlc3RIYW5kbGVyIl0sIm1hcHBpbmdzIjoiQUFNQSxTQUFnQixjQUFjLENBQUMsTUFJOUI7SUFFR0E7Ozs7O09BS0dBO0lBRUhBOzs7TUFHRUE7SUFFRkEsMkJBQTJCQTtBQUMvQkEsQ0FBQ0E7QUFuQmUsc0JBQWMsR0FBZCxjQW1CZixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbi8vL3RzOmltcG9ydD1wYXJlbnRcbmltcG9ydCBwYXJlbnQgPSByZXF1aXJlKCcuLi8uLi93b3JrZXIvcGFyZW50Jyk7IC8vL3RzOmltcG9ydDpnZW5lcmF0ZWRcblxuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdEhhbmRsZXIoY29uZmlnOiB7XG4gICAgZWRpdG9yOiBBdG9tQ29yZS5JRWRpdG9yO1xuICAgIGZpbGVQYXRoOiBzdHJpbmc7XG4gICAgcG9zaXRpb246IG51bWJlcjtcbn0pIHtcblxuICAgIC8qXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVxdWlyZSgndmlld3MvdG9vbHRpcCcpKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGV4KTtcbiAgICB9Ki9cblxuICAgIC8qXG4gICAgdmFyIHNpZ25hdHVyZXMgPSBjb25maWcucHJvZ3JhbS5sYW5ndWFnZVNlcnZpY2UuZ2V0U2lnbmF0dXJlSGVscEl0ZW1zKGNvbmZpZy5maWxlUGF0aCwgY29uZmlnLnBvc2l0aW9uKTtcbiAgICBpZiAoIXNpZ25hdHVyZXMpIHJldHVybjtcbiAgICAqL1xuXG4gICAgLy8gY29uc29sZS5sb2coc2lnbmF0dXJlcyk7XG59XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/atom-typescript/lib/main/atom/signatureProvider.ts