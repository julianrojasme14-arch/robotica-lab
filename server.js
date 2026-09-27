const express=require("express"),fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto");
const {execFile}=require("child_process");
const app=express(); app.use(express.json({limit:"256kb"}));
app.use("/vendor/avr8js",express.static(path.join(__dirname,"node_modules","avr8js")));
app.use(express.static(path.join(__dirname,"public")));
const db={classes:{},sessions:{}};
const code=()=>crypto.randomBytes(3).toString("hex").toUpperCase();
const CLI=process.env.ARDUINO_CLI||"arduino-cli";

app.get("/health",(q,r)=>r.status(200).send("ok"));
app.get("/api/status",(q,r)=>execFile(CLI,["version"],{timeout:10000},(e,o,err)=>r.json({
  online:true,compiler:!e,version:e?null:o.trim(),error:e?(err||e.message):null
})));
app.post("/api/classes",(q,r)=>{let join=code();db.classes[join]={join,name:String(q.body.name||"Clase de Robótica"),activities:[],students:[]};r.json(db.classes[join])});
app.post("/api/join",(q,r)=>{let c=db.classes[String(q.body.code||"").toUpperCase()];if(!c)return r.status(404).json({error:"Código de clase no encontrado"});let s={id:crypto.randomUUID(),name:String(q.body.name||"Estudiante")};c.students.push(s);r.json({student:s,class:c})});
app.post("/api/compile",(q,r)=>{
  let sketch=String(q.body.code||"");
  // Defensive normalization: Blockly/editor may send escaped newlines (\\n).
  // Convert them to real LF characters before Arduino CLI writes Sketch.ino.
  for (let i=0;i<4;i++) sketch = sketch.replace(/\\+n/g, "\n");
  sketch = sketch.replace(/\\r/g, "");
  if(!sketch||sketch.length>100000)return r.status(400).json({ok:false,error:"Sketch inválido"});
  let board=q.body.board==="nano"?"arduino:avr:nano:cpu=atmega328old":"arduino:avr:uno";
  let tmp=fs.mkdtempSync(path.join(os.tmpdir(),"rlab-")),dir=path.join(tmp,"Sketch"),build=path.join(tmp,"build");
  fs.mkdirSync(dir);fs.mkdirSync(build);fs.writeFileSync(path.join(dir,"Sketch.ino"),sketch,{encoding:"utf8"});
  execFile(CLI,["compile","--fqbn",board,"--build-path",build,dir],{timeout:60000,maxBuffer:4e6},(e,out,err)=>{
    try{
      if(e)return r.status(400).json({ok:false,error:err||out||e.message});
      let f=fs.readdirSync(build).find(x=>x.endsWith(".hex")&&!x.includes("bootloader"));
      if(!f)return r.status(500).json({ok:false,error:"No se encontró el firmware HEX"});
      r.json({ok:true,hex:fs.readFileSync(path.join(build,f),"utf8"),board,output:out});
    }finally{fs.rm(tmp,{recursive:true,force:true},()=>{});}
  });
});
const PORT=process.env.PORT||10000;
app.listen(PORT,"0.0.0.0",()=>console.log(`Robótica Lab V9.1 Online listo en puerto ${PORT} · CLI: ${CLI}`));