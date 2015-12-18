AtomFixPath = require '../lib/atom-fix-path'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "AtomFixPath", ->

  beforeEach ->
    @activationPromise = atom.packages.activatePackage('atom-fix-path')

  it 'activates', ->
    waitsForPromise =>
      @activationPromise
