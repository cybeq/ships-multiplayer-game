<script >
export default{
props:{
  message:undefined,
  button1:undefined,
  button2:undefined,
}
}
</script>

<template>
<main class="popup-container">
  <section class="popup">
    <div>
      <h1>{{message}}</h1>
    </div>
    <div>
      <button v-if="button1" @click="button1.command" :style="`background:${button1.background}`">{{button1.label}}</button>
      <button v-if="button2" @click="button2.command" :style="`background:${button2.background}`">{{button2.label}}</button>
    </div>
  </section>
</main>
</template>

<style>
.popup-container{
  width:100vw;
  height:100vh;
  position: fixed;
  top:0;
  left:0;
  z-index:2;
  background: #00000010;
  display:flex;
  justify-content: center;
  align-items: center;
}
.popup{
  width:600px;
  min-height:130px;
  background:white;
  border-radius:2px;
  box-shadow: 3px 3px 3px #00000005;
}
button{
  min-width:150px;
  min-height:50px;
  border:none;
  margin-inline:10px;
  cursor:pointer;
}
button:hover{
  filter:brightness(1.1);

}
</style>