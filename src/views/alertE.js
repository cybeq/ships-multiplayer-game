
const obj_css = `
   width:300px;
   position:fixed;
   top:20px;
   left:20px;
   height:40px;
   border-radius:2px;
   background: linear-gradient(275deg, rgba(121,9,74,1) 15%, rgba(255,0,41,1) 100%);
   border-bottom:solid 3px rgba(255,0,41,1);
   padding:4px;
   font-size:0.9em;
   font-family: Arial, Helvetica, sans-serif;
   color:white;
`;
export default (message, ylw) =>{
    const div = document.createElement('div')
    div.style.cssText = obj_css;
    div.innerText=message;
    const color = "linear-gradient(275deg, rgba(9,33,121,1) 15%, rgba(0,131,255,1) 100%);"
    if(ylw){
        div.style.background = color;
    }
    document.body.appendChild(div)
    setTimeout(()=>{
        document.body.removeChild(div)
    },2200)
}