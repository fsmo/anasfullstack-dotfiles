module.exports = {
  public: function(req, res) {
    return res.ok('You Can see the public page! That is okay!');
  },
  private: function(req, res) {
    return res.ok();
  }
};
