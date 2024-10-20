import{d as q,o as l,i as F,w as B,S as W,b as o,_ as z,r as T,c as a,t as d,F as D,e as M,j as $,u as ae,g as oe,D as ne,k as ue,l as y,m as I,n as G,f as Y,q as ce,s as J,v as de,p as re,h as _e}from"./index-uNL48YLD.js";import{h as N}from"./moment-C5S46NFB.js";import{P as K,a as Q,F as fe}from"./PTInput-BV00OGNE.js";const me={class:"image-block"},he=["src"],ge=q({__name:"ImageBlock",props:["image_url"],emits:["close"],setup(_,{emit:v}){const h=_,f=v;function e(){f("close")}return(g,b)=>(l(),F(W,null,{default:B(()=>[o("div",me,[o("div",{class:"close",onClick:e},"X"),o("img",{src:h.image_url,alt:""},null,8,he)])]),_:1}))}}),pe=z(ge,[["__scopeId","data-v-26ccb747"]]),be={class:"pt-upload"},ve={class:"pt-upload-button",for:"upload"},ke=["accept"],$e={key:0,class:"pt-upload-file-container"},we={key:1,class:"pt-upload-file-message"},Ce=q({__name:"PTUpload",props:{multiple:{type:Boolean,default:!1},accept:{type:String,default:""},text:{type:String,default:"Upload"},message:{type:String,default:"each file size must under 5MB"}},emits:["on-change"],setup(_,{emit:v}){const h=v,f=T([]);function e(g){for(let b of g)if(b.size>5*1024*1024*8){alert("file size over 5MB");return}f.push(...g),h("on-change",f)}return(g,b)=>(l(),a("div",be,[o("label",ve,d(_.text),1),o("input",{class:"pt-upload-file",id:"upload",type:"file",multiple:"",accept:_.accept,onChange:b[0]||(b[0]=p=>e(p.target.files))},null,40,ke),f.length>0?(l(),a("ul",$e,[(l(!0),a(D,null,M(f,p=>(l(),a("li",{class:"pt-upload-file-item",key:p},d(p.name),1))),128))])):(l(),a("p",we,d(_.message),1))]))}}),Se=z(Ce,[["__scopeId","data-v-9a4f7612"]]),ye=_=>(re("data-v-935c78b8"),_=_(),_e(),_),Ie={class:"submission"},Be=ye(()=>o("h1",null,"This is the submission page",-1)),De={key:2,class:"submission-content"},Me={class:"submission-collapse-container"},Ve=["onClick"],Ne={class:"submission-collapse-func"},Fe={class:"submission-collapse-func-item"},Te={class:"submission-collapse-func-item"},Ee={class:"submission-collapse-func-item"},Pe={key:0,class:"submission-item-container"},Ue={class:"submission-func"},Ye=["onClick"],qe={class:"submission-func-container"},ze={key:0,class:"submission-file"},Oe=["onClick"],Re={class:"submission-date"},je=["value","selected","onClick"],He={class:"submission-message"},Le={key:0,class:"submission-line"},Ae={key:3,class:"empty"},Xe=q({__name:"Submission",setup(_){var R,j,H;const v=$(!1),h=$(!1),f=ae(),e=(R=oe())==null?void 0:R.proxy;if(e==null||e==null)throw Error("Server, please try later");const g=["submit","checked","awarded","failed"],b=["#895ef9fc","#41d6ba","#3ddf58","#f95e85fc"],p=$(null);let w=$(!1),V=$(0);const r=new ne;let E=$((j=r.user)==null?void 0:j.id);const m=T([]),C=T([]),u=T({user_id:(H=r.user)==null?void 0:H.id,file_id_list:[],file_name_list:[],date:new Date,title:"",message:"",status:0});async function P(){e==null||e.$loading.show(),await r.findList("postgraduate-task","submission",{user_id:{$eq:E.value}}).then(i=>{C.splice(0,C.length),m.splice(0,m.length),i!=null&&C.push(...i),C.sort((t,s)=>s.date.getTime()-t.date.getTime()),C.forEach(t=>{m.length==0||m.filter(s=>s.id==N(t.date).format("YY-MM-DD")).length==0?m.push({id:N(t.date).format("YY-MM-DD"),task_list:[t]}):m.map(s=>{if(s.id==N(t.date).format("YY-MM-DD")){s.task_list.push(t);return}})})}).catch(i=>{e==null||e.$notification.show("Error",i),console.log(i)}).finally(()=>{e==null||e.$loading.hide()})}ue(async()=>{var i;console.log(f.currentRoute.value.query._id),f.currentRoute.value.query._id?E.value=f.currentRoute.value.query._id.toString():E.value=(i=r.user)==null?void 0:i.id,await P()});function Z(i){V.value==i?V.value=-1:V.value=i,console.log(i)}function U(i,t){let s=0;for(let c of i)c.status>=t&&s++;return s}function x(i){e==null||e.$loading.show(),p.value=null,r.getImageUrl("postgraduate-task","files",i).then(t=>{p.value=t,e==null||e.$loading.hide(),v.value=!0})}function ee(){p.value=null,v.value=!1}function O(){h.value=!h.value,h.value==!1&&(u.message==null||u.title==null||u.message.trim().length==0||u.title.trim().length==0?alert("Nothing to submit! The form should be completed!"):(u.date=new Date,r.addOne("postgraduate-task","submission",u).then(()=>{e==null||e.$notification.show("Success","add submission successfully!"),P(),u.file_id_list=[],u.file_name_list=[],u.message="",u.title=""})))}async function se(i){if(confirm(`is ready to delete ${i.title}!`)){if(prompt("input your delete token")!="delete")return;e==null||e.$loading.show(),await r.findOne("postgraduate-task","submission",{_id:i._id}).then(c=>{c&&c.file_id_list&&c.file_id_list.length>0&&r.deleteMany("postgraduate-task","files",{_id:{$in:c.file_id_list}}),c&&r.deleteOne("postgraduate-task","submission",{_id:c._id}),P()}).finally(()=>{e==null||e.$loading.hide()})}else e==null||e.$notification.show("Cancel","operate already canceled!")}function te(i){e==null||e.$loading.show();for(let t of i)r.uploadFile("postgraduate-task","files",t).then(s=>{var c,n;(c=u.file_id_list)==null||c.push(s.insertedId),(n=u.file_name_list)==null||n.push(s.file_name)}).catch(s=>{console.log(s),e==null||e.$notification("Error","upload file error, please try again later")}).finally(()=>{e==null||e.$loading.hide()})}function ie(i,t){var s;((s=r.user)==null?void 0:s.id)=="670a8dc865ba7090dcbfa4e3"&&t<g.length?confirm(`confirm to change status to ${g[t]}`)?(i.status=t,e==null||e.$loading.show(),r.updateOne("postgraduate-task","submission",{_id:i._id},{status:t}).then(()=>{e==null||e.$notification.show("Success","update status successfully")}).catch(c=>{e==null||e.$notification.show("Error",c.error)}).finally(()=>{e==null||e.$loading.hide()})):e==null||e.$notification.show("Cancel","cancel operate successfully"):e==null||e.$notification.show("No Permission","you have no permission!"),w.value=!1}return(i,t)=>(l(),a("div",Ie,[v.value?(l(),F(pe,{key:0,image_url:p.value,onClose:ee},null,8,["image_url"])):y("",!0),Be,I(K,{class:"submit-button",type:"primary",onClick:O},{default:B(()=>[G("submit")]),_:1}),h.value?(l(),F(W,{key:1},{default:B(()=>[I(fe,{onClose:t[2]||(t[2]=()=>h.value=!1),onSubmit:O},{form:B(()=>[I(Q,{placeholder:"title",modelValue:u.title,"onUpdate:modelValue":t[0]||(t[0]=s=>u.title=s)},null,8,["modelValue"]),I(Se,{onOnChange:te,accept:".png, .jpg, .jpeg"}),I(Q,{placeholder:"message",modelValue:u.message,"onUpdate:modelValue":t[1]||(t[1]=s=>u.message=s)},null,8,["modelValue"])]),_:1})]),_:1})):y("",!0),(m==null?void 0:m.length)>0?(l(),a("ul",De,[(l(!0),a(D,null,M(m,(s,c)=>(l(),a("li",{class:"submission-item",key:s.id},[o("div",Me,[o("div",{class:"submission-collapse",onClick:n=>Z(c)},d(s.id),9,Ve),o("div",Ne,[o("span",Fe,"Submitted: "+d(U(s.task_list,0)),1),o("span",Te,"Checked: "+d(U(s.task_list,1)),1),o("span",Ee,"Awarded: "+d(U(s.task_list,2)),1)])]),Y(V)==c?(l(),a("div",Pe,[(l(!0),a(D,null,M(s.task_list,(n,L)=>{var A,X;return l(),a("div",{class:"submission-item-container-content",key:L},[o("div",Ue,[o("div",{class:"submission-title",onClick:S=>se(n)},d(n.title),9,Ye),o("div",qe,[((A=n.file_id_list)==null?void 0:A.length)>0?(l(),a("div",ze,[(l(!0),a(D,null,M(n.file_name_list,(S,k)=>(l(),a("div",{class:"submission-file-item",key:k,onClick:le=>x(n.file_id_list[k])},d(S),9,Oe))),128))])):y("",!0),o("div",Re,d(Y(N)(n.date).format("HH:mm:ss")),1),Y(w)?(l(),a("select",{key:2,class:"submission-option",style:J({backgroundColor:b[n.status]})},[(l(),a(D,null,M(g,(S,k)=>o("option",{class:"submission-option-item",value:k,key:k,selected:n.status==k,onClick:le=>ie(n,k)},d(S),9,je)),64))],4)):(l(),F(K,{key:1,class:ce({"submission-status":!0,"submission-status-error":n.status==3}),style:J({backgroundColor:b[n.status]}),onClick:t[3]||(t[3]=S=>de(w)?w.value=!0:w=!0)},{default:B(()=>[G(d(g[n.status]),1)]),_:2},1032,["class","style"]))])]),o("div",He,d(n.message),1),L!=((X=s.task_list)==null?void 0:X.length)-1?(l(),a("hr",Le)):y("",!0)])}),128))])):y("",!0)]))),128))])):(l(),a("div",Ae," Nothing to show! "))]))}}),Qe=z(Xe,[["__scopeId","data-v-935c78b8"]]);export{Qe as default};
