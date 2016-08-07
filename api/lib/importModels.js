/**
 * Created by psenger on 8/7/16.
 */
const models = join(__dirname, 'models');
// Bootstrap models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));