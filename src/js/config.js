const _Environments = {
    production:  {
      serverUrl: 'https://guarded-depths-69338.herokuapp.com/'
    },
    development: {
      serverUrl: 'http://localhost:3000/'
    }
}

function getPlatform() {
  if(window.location.hostname === 'localhost'){
    return 'development';
  }

  return 'production';
}

function getEnvironment() {
    const platform = getPlatform()

    return _Environments[platform]
}

var Config = getEnvironment();

export default Config;
