const Generator = require('yeoman-generator');
const { basename } = require('path');

module.exports = class MiniGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.name = basename(process.cwd());
    this.props = {};
  }

  writing() {
    const context = {
      name: this.name,
      props: this.props,
    };
    this.fs.copy(this.templatePath('minitemplate', 'config'), this.destinationPath('config'));
    this.fs.copy(this.templatePath('minitemplate', 'src'), this.destinationPath('src'));
    this.fs.copyTpl(this.templatePath('minitemplate', 'package.json'), this.destinationPath('package.json'), context);
    this.fs.copy(this.templatePath('minitemplate', '.gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('minitemplate', '.eslintrc.js'), this.destinationPath('.eslintrc.js'));
    this.fs.copy(this.templatePath('minitemplate', '.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('minitemplate', 'gulpfile.babel.js'), this.destinationPath('gulpfile.babel.js'));
  }
};
