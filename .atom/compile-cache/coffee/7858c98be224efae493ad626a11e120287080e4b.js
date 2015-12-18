(function() {
  var FeatureGenerator, allowUnsafeNewFunction, fs, handlebars, inflector, path, _;

  allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  handlebars = require('handlebars');

  inflector = require('inflection');

  module.exports = FeatureGenerator = (function() {
    function FeatureGenerator() {
      var appPath, jsPath;
      this._ensureFolderStructure();
      appPath = path.join(atom.project.getPaths()[0], '/app');
      jsPath = path.join(appPath, '/js');
      this.statesPath = path.join(jsPath, '/states');
      this.viewsPath = path.join(appPath, '/views');
      this.controllersPath = path.join(jsPath, 'controllers');
      this.factoriesPath = path.join(jsPath, 'factories');
      this.templatesPath = atom.packages.getPackageDirPaths() + '/angularjs-helper/templates';
    }

    FeatureGenerator.prototype.generate = function(name) {
      var data, templateFiles;
      data = {
        entity: inflector.camelize(name),
        entityCamelCase: inflector.camelize(name, true),
        entityCamelCasePluralized: inflector.pluralize(inflector.camelize(name, true)),
        entityPlural: inflector.pluralize(inflector.dasherize(name)),
        entityDasherized: inflector.dasherize(name),
        entityHumanized: inflector.humanize(name, true),
        entityHumanizedPlural: inflector.humanize(inflector.pluralize(name))
      };
      templateFiles = this.loadTemplates();
      return _.forEach(templateFiles, (function(_this) {
        return function(templateFile) {
          var template, templateResult, templateString;
          templateString = fs.readFileSync(path.join(_this.templatesPath, templateFile), 'utf-8');
          template = handlebars.compile(templateString);
          templateResult = allowUnsafeNewFunction(function() {
            return template(data);
          });
          return _this.writeOutputFile(data, templateFile, templateResult);
        };
      })(this));
    };

    FeatureGenerator.prototype._ensureFolderStructure = function() {
      var mainPath;
      mainPath = atom.project.getPaths()[0];
      return fs.mkdir(path.join(mainPath, 'app'), function() {
        var jsPath;
        fs.mkdir(path.join(mainPath, 'app', 'views'));
        jsPath = path.join(mainPath, 'app', 'js');
        return fs.mkdir(jsPath, function() {
          fs.mkdir(path.join(jsPath, 'states'));
          fs.mkdir(path.join(jsPath, 'controllers'));
          return fs.mkdir(path.join(jsPath, 'factories'));
        });
      });
    };

    FeatureGenerator.prototype.loadTemplates = function() {
      return fs.readdirSync(this.templatesPath);
    };

    FeatureGenerator.prototype.writeOutputFile = function(data, templateName, templateResult) {
      var isCollection;
      if (templateName.indexOf('controller-') !== -1) {
        isCollection = templateName.indexOf('-collection') !== -1;
        this.writeControllerFile(data, isCollection, templateResult);
      }
      if (templateName.indexOf('factory-') !== -1) {
        isCollection = templateName.indexOf('-collection') !== -1;
        this.writeFactoryFile(data, isCollection, templateResult);
      }
      if (templateName.indexOf('view-') !== -1) {
        isCollection = templateName.indexOf('-collection') !== -1;
        this.writeViewFile(data, isCollection, templateResult);
      }
      if (templateName.indexOf('state') !== -1) {
        return this.writeStateFile(data, templateResult);
      }
    };

    FeatureGenerator.prototype.writeControllerFile = function(data, isCollection, controller) {
      var featureControllersPath, filename, name;
      featureControllersPath = path.join(this.controllersPath, data.entityPlural);
      name = data.entityDasherized;
      filename = isCollection ? name + '-collection-controller.js' : name + '-model-controller.js';
      return this.writeFile(path.join(featureControllersPath, filename), controller);
    };

    FeatureGenerator.prototype.writeFactoryFile = function(data, isCollection, factory) {
      var featureFactoriesPath, filename, name;
      featureFactoriesPath = path.join(this.factoriesPath, data.entityPlural);
      name = data.entityDasherized;
      filename = isCollection ? name + '-collection-factory.js' : name + '-model-factory.js';
      return this.writeFile(path.join(featureFactoriesPath, filename), factory);
    };

    FeatureGenerator.prototype.writeViewFile = function(data, isCollection, view) {
      var featureViewsPath, filename;
      featureViewsPath = path.join(this.viewsPath, '/screens', data.entityPlural);
      filename = isCollection ? 'collection.html' : 'model.html';
      return this.writeFile(path.join(featureViewsPath, filename), view);
    };

    FeatureGenerator.prototype.writeStateFile = function(data, state) {
      return this.writeFile(path.join(this.statesPath, data.entityPlural + '.js'), state);
    };

    FeatureGenerator.prototype.createParentFolderIfNeeded = function(filename) {
      var dir;
      dir = path.dirname(filename);
      if (!fs.existsSync(dir)) {
        return fs.mkdir(dir);
      }
    };

    FeatureGenerator.prototype.writeFile = function(filename, content) {
      var shouldSave;
      shouldSave = true;
      if (fs.existsSync(filename)) {
        atom.confirm({
          message: 'Overwrite file?',
          detailedMessage: "File " + filename + " already exist do you want to overwrite it?",
          buttons: {
            Yes: function() {
              return shouldSave = true;
            },
            No: function() {
              return shouldSave = false;
            }
          }
        });
      }
      this.createParentFolderIfNeeded(filename);
      if (shouldSave) {
        return fs.writeFile(filename, content);
      }
    };

    return FeatureGenerator;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYW5ndWxhcmpzLWhlbHBlci9saWIvZmVhdHVyZS1nZW5lcmF0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRFQUFBOztBQUFBLEVBQUMseUJBQTBCLE9BQUEsQ0FBUSxVQUFSLEVBQTFCLHNCQUFELENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FMYixDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxZQUFSLENBTlosQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFVyxJQUFBLDBCQUFBLEdBQUE7QUFDVCxVQUFBLGVBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLE1BQXRDLENBSFYsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixLQUFuQixDQUpULENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFNBQWxCLENBTmQsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLE9B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

//# sourceURL=/Users/anas/.atom/packages/angularjs-helper/lib/feature-generator.coffee
