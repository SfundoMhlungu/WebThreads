// MessageEvent {isTrusted: true, data: 'from main', origin: '', lastEventId: '', source: null, …}

const EventObject = {event: "",isError: false, Error: null} 

let container; 
/**
 * 
 * @param  {Array<{url: string, name: string, img: string}>} result 
 */
function AddToDom(result){
    result.forEach(v => {
        const card = document.createElement("div")
        card.classList.add("card")
        const img = document.createElement("img")
        img.src = v.img
        card.appendChild(img)
        const label = document.createElement("label")
        label.innerText = v.name
        card.appendChild(label)
        if(container)
           container.appendChild(card)
    })
}

document.addEventListener("DOMContentLoaded", ()=> {
   /**
    * @type {HTMLButtonElement}
    */
   const btn = document.querySelector("#btn")
   container = document.querySelector(".container") 
   btn.onclick = () =>   worker.postMessage({...EventObject, ...{event: "pokemonFetch"}})

    const worker = new Worker(new URL("./thread.js", import.meta.url))

   
  
    
    worker.onmessage = e => {
       console.log(e)
        const {data: {event, isError, Error, res}} = e  
        // console.log("recieve from worker thread: ", event, isError, Error)
        if(!isError){
            switch(event){
              case "pokemonFetch_Res":
                  console.log(res, "response")
                  AddToDom(res.results)

              default:
                  break;
            }
          }else{
              console.error(Error)
          }
    }
})
