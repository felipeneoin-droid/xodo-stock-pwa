/* Xodó Stock PWA - ponte compatível com google.script.run */
const XODO_API_URL = "https://script.google.com/macros/s/AKfycbxMKWpME0rBuQe6eIKYIa1PaCgYsw0IEBZ-TLSEDP81y67m8kt2pQZV5OMgiWifc8ls/exec";
(function () {
  async function chamarApi(payload, tentativa=0){
    try{
      const r=await fetch(XODO_API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow',credentials:'omit',cache:'no-store'});
      if(!r.ok) throw new Error('Servidor indisponível (HTTP '+r.status+').');
      const t=await r.text(); let data;
      try{data=JSON.parse(t);}catch(_e){throw new Error('Resposta inválida do servidor.');}
      if(!data||data.sucesso!==true) throw new Error((data&&data.erro)||'Erro na API');
      return data;
    }catch(err){
      if(tentativa<1){await new Promise(res=>setTimeout(res,650));return chamarApi(payload,tentativa+1);}
      if(err instanceof TypeError && /fetch/i.test(String(err.message||err))) throw new Error('Não foi possível conectar ao servidor. Verifique a internet e tente novamente.');
      throw err;
    }
  }
  function runner(state){
    return new Proxy({}, {get(_target,prop){
      if(prop==='withSuccessHandler') return fn=>runner({...state,success:fn});
      if(prop==='withFailureHandler') return fn=>runner({...state,failure:fn});
      if(prop==='withUserObject') return obj=>runner({...state,userObject:obj});
      return (...args)=>{chamarApi({acao:'rpc',metodo:String(prop),argumentos:args}).then(data=>{if(typeof state.success==='function')state.success(data.resultado,state.userObject);}).catch(err=>{if(typeof state.failure==='function')state.failure(err,state.userObject);else console.error('Xodó API:',err);});};
    }});
  }
  window.google=window.google||{}; window.google.script=window.google.script||{}; window.google.script.run=runner({success:null,failure:null,userObject:null});
})();
