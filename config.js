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

config.clients.hosts = [
{ 'nome' : 'Ericeira',
  'host' : 'localhost:3001' },
{ 'nome' : 'Venda',
  'host' : 'localhost:3001' },
{ 'nome' : 'Mafra',
  'host' : 'ip3:456' }
];
config.clients.infoPath = '/ajax/get-info';

config.web.port = process.env.PORT || 3001;

module.exports = config;

