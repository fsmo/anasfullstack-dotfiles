module.exports = {
  public: function(req, res) {
    'use strict';
    console.log(req.session);
    return res.ok('You Can see the public page! That is okay!');
  },
  private: function(req, res) {
    'use strict';
    console.log('req.session', req.session);
    console.log('req.isAuthenticated', req.isAuthenticated);
    return res.ok('You Can see the private page! That is WOOOW!');
  }
};
