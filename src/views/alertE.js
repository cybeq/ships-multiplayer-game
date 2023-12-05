
const obj_css = `
   width:300px;
   position:fixed;
   top:20px;
   left:20px;
   height:40px;
   border-radius:2px;
   background:#b91919;
   padding:4px;
   font-size:0.9em;
   font-family: Arial, Helvetica, sans-serif;
   color:white;
`;
export default (message, ylw) =>{
    const div = document.createElement('div')
    div.style.cssText = obj_css;
    div.innerText=message;
    const color = "#b98119"
    if(ylw){
        div.style.background = color;
    }
    document.body.appendChild(div)
    setTimeout(()=>{
        document.body.removeChild(div)
    },2200)
}