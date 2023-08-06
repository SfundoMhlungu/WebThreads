
const EventObject = {event: "",isError: false, Error: null} 
self.postMessage(EventObject)



async function pokemoneFetch(){
    const pokemons = await fetch("https://pokeapi.co/api/v2/pokemon/")
 
    if(pokemons)
        return pokemons
    else 
       return new Error("failed to fetch pokemons")
}

/**
 * 
 * @param {Object} res 
 * @param {Array<{url: string, name: string}>} res.results
 *
 */
function constructImagesUrl(res){
   res.results.forEach(v => {
      const temp =  v.url.split("/")
      temp.pop()
      if(temp){
          v.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${temp.pop()}.png`
      }
   })
}

self.onmessage = e => {
    const {data: {event, isError, Error}} = e 
    if(!isError){
      switch(event){
        case "pokemonFetch":
             pokemoneFetch().then(async (v) => {
                console.log(v)
                if(v instanceof Response){
                     const res = await v.json()
                      constructImagesUrl(res)
                     self.postMessage({...EventObject, ...{event: "pokemonFetch_Res", res}})
                }else{
                    self.postMessage({...EventObject, ...{isError: true, Error: v}})
                }
             }).catch(err=> {
                self.postMessage({...EventObject, ...{isError: true, Error: v}})
             })
        default:
            break;
      }
    }else{
        console.error(Error)
    }
//    console.log("recieved from main: ", event)
}
