var config = {}

config.folders = {};
config.clients = {};
config.web = {};
config.log = {};

config.folders.logs = 'logs';
config.folders.scripts = 'scripts';
// se fosse apenas config.folders.assets por alguma razao ficava undefined
config.folders.assetsPath = 'assets';

// tamanho em bytes
config.log.maxfilesize = 10 * 1000 * 1000;
config.log.logfile = 'debug.log';
config.log.exceptionsfile = 'exceptions.log';
config.log.level = 'info';

config.clients.hosts = [ 'ip1:123', 'ip2:321', 'ip3:456' ]

config.web.port = process.env.PORT || 3001;

module.exports = config;

