/* Xodó Stock PWA - ponte compatível com google.script.run */
const XODO_API_URL = "https://script.google.com/macros/s/AKfycbxMKWpME0rBuQe6eIKYIa1PaCgYsw0IEBZ-TLSEDP81y67m8kt2pQZV5OMgiWifc8ls/exec";

(function () {
  function runner(state) {
    return new Proxy({}, {
      get(_target, prop) {
        if (prop === 'withSuccessHandler') return (fn) => runner({...state, success: fn});
        if (prop === 'withFailureHandler') return (fn) => runner({...state, failure: fn});
        if (prop === 'withUserObject') return (obj) => runner({...state, userObject: obj});
        return (...args) => {
          fetch(XODO_API_URL, {
            method: 'POST',
            headers: {'Content-Type':'text/plain;charset=utf-8'},
            body: JSON.stringify({acao:'rpc', metodo:String(prop), argumentos:args}),
            redirect: 'follow'
          })
          .then(r => r.text())
          .then(t => {
            let data; try { data = JSON.parse(t); } catch(e) { throw new Error('Resposta inválida da API'); }
            if (!data || data.sucesso !== true) throw new Error((data && data.erro) || 'Erro na API');
            if (typeof state.success === 'function') state.success(data.resultado, state.userObject);
          })
          .catch(err => {
            if (typeof state.failure === 'function') state.failure(err, state.userObject);
            else console.error('Xodó API:', err);
          });
        };
      }
    });
  }
  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = runner({success:null,failure:null,userObject:null});
})();
