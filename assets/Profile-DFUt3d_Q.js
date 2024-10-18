import{d as V,r as x,g as b,o as r,c as p,e as l,F as C,f as I,t as $,l as R,a as ee,p as G,m as H,_ as q,s as te,i as T,D as K,v as Q,b as B,w as g,S as se,q as X,j as y,k as Y,u as j,x as ae,y as le}from"./index-DXRoSsfY.js";import{h as _,a as L,P as S,F as oe}from"./PTInput-BfTX7nd8.js";const ie=c=>(G("data-v-a0cc9685"),c=c(),H(),c),ne={class:"submission-chart"},de={class:"calendar"},re=ie(()=>l("div",{class:"weeks"},[l("div",{class:"week"},"Mon"),l("div",{class:"week"},"Wed"),l("div",{class:"week"},"Fri")],-1)),ce={class:"title"},ue=ee('<div class="operation" data-v-a0cc9685><div class="slider" data-v-a0cc9685><div class="slider-desc" data-v-a0cc9685>0</div><div style="width:120px;" data-v-a0cc9685></div><div class="slider-desc" data-v-a0cc9685>12+</div></div><div class="legend" data-v-a0cc9685><div class="level-desc" data-v-a0cc9685>less</div><div class="level level-1" data-v-a0cc9685></div><div class="level level-2" data-v-a0cc9685></div><div class="level level-3" data-v-a0cc9685></div><div class="level level-4" data-v-a0cc9685></div><div class="level level-5" data-v-a0cc9685></div><div class="level-desc" data-v-a0cc9685>more</div></div></div>',1),fe=V({__name:"SubmissionChart",props:["submission_list","profile"],setup(c){const f=c,t=x([]),m=x([]),i=b([0,12]),n=["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];function a(){let d=parseInt(_().format("YYYY"))-1+"-"+_().format("MM-DD"),e=_(d).format("YYYY-MM-DD"),k=_(e).weekday()||7,s=k>1?_(e).add(8-k,"days").format("YYYY-MM-DD"):e,u=_().diff(_(s),"days")+1,o=7,N=Math.ceil(u/o),Z=i.value[0],E=i.value[1];for(let h=0;h<N;h++){let O=h===N-1&&u%o?u%o:o,P=_(s).add(h*7,"days").format("M"),A=_(s).add(h*7+O,"days").format("M"),J=h===0?n[parseInt(P)-1]:"",U=!1;parseInt(A)-parseInt(P)&&(U=!0),h&&t[h-1].ifSwitchMonth&&(J=n[parseInt(A)-1]),t.push({columns:O,title:J,ifSwitchMonth:U,data:[]});for(let F=0;F<t[h].columns;F++){let D=_(s).add(h*7+F,"days").format("YYYY-MM-DD"),W=0;(m[D]>=Z&&m[D]<E||m[D]>12&&E===12)&&(W=m[D]),t[h].data.push({number:W,date:D})}}}function w(){let v=f.submission_list;for(let d of v)t.forEach(e=>{for(let k of e.data)k.date.slice(2,k.date.length)==_(d.date).format("YY-MM-DD")&&k.number++})}function M(v){let d="#EBEDF0";return v>=12?d="#196127":v>=8?d="#239A3B":v>=4?d="#7BC96F":v>=1?d="#C6E48B":d="#EBEDF0",d}return a(),w(),(v,d)=>(r(),p("div",ne,[l("div",de,[re,(r(!0),p(C,null,I(t,(e,k)=>(r(),p("div",{class:"column",key:k},[l("div",ce,$(e.title),1),(r(!0),p(C,null,I(e.data,(s,u)=>(r(),p("div",{class:"date-wrapper",key:u,style:R(`background:${M(s.number)};`)},null,4))),128))]))),128))]),ue]))}}),_e=q(fe,[["__scopeId","data-v-a0cc9685"]]),pe=V({__name:"Tooltip",props:{message:{type:String,required:!0},backgroundColor:{type:String,default:"rgba(0, 0, 0, 0.75)"},textColor:{type:String,default:"white"}},setup(c){const f=b(!1);function t(){f.value=!0}function m(){f.value=!1}return(i,n)=>(r(),p("div",{class:"hover-tip-container",onMouseenter:t,onMouseleave:m},[te(i.$slots,"default",{},void 0),f.value?(r(),p("div",{key:0,class:"hover-tip-message",style:R({backgroundColor:c.backgroundColor,color:c.textColor})},$(c.message),5)):T("",!0)],32))}}),z=q(pe,[["__scopeId","data-v-21420a6c"]]),me={class:"task-form"},ve={class:"task-form-item-number"},ke=V({__name:"TaskForm",props:{is_update:{type:Boolean,required:!0}},emits:["close","show"],setup(c,{emit:f}){const t=f;let m=c;const{proxy:i}=X(),n=new K,a=b({user_id:n.user.id,task_list:[{name:"",describe:""}]});Q(()=>{i.$loading.show(),n.findOne("postgraduate-task","task",{user_id:{$eq:n.user.id}}).then(e=>{e!=null&&(a.value=e)}).finally(()=>{i.$loading.hide()})});function w(){a.value.task_list.push({name:"",describe:""})}function M(e){if(a.value.task_list.length==1){alert("at least one task");return}a.value.task_list.splice(e,1)}function v(){for(let e of a.value.task_list)if(e.name.trim().length==0||e.describe.trim().length==0){alert("name or describe must not be null");return}a.value.date=new Date,i.$loading.show(),m.is_update?n.updateOne("postgraduate-task","task",{_id:{$eq:a.value._id}},a.value).then(e=>{i.$notification.show("Success","update task successfully!"),d()}).finally(()=>{i.$loading.hide()}):n.addOne("postgraduate-task","task",a.value).then(e=>{console.log(e),i.$notification.show("Success","submit task successfully!"),d()}).catch(e=>{console.log(e),i.$notification.show("Error","update task error!")}).finally(()=>{i.$loading.hide()}),n.findOne("postgraduate-task","task",{user_id:{$eq:n.user.id}}).then(e=>{a.value=e})}function d(){t("close")}return(e,k)=>(r(),B(se,null,{default:g(()=>[y(oe,{onClose:d},{form:g(()=>[l("ol",me,[(r(!0),p(C,null,I(a.value.task_list,(s,u)=>(r(),p("li",{class:"task-form-item",key:s},[l("span",ve,$(u+1)+".",1),y(L,{class:"task-form-input",width:"150px",modelValue:s.name,"onUpdate:modelValue":o=>s.name=o,placeholder:"name"},null,8,["modelValue","onUpdate:modelValue"]),y(L,{class:"task-form-input",modelValue:s.describe,"onUpdate:modelValue":o=>s.describe=o,placeholder:"describe"},null,8,["modelValue","onUpdate:modelValue"]),y(S,{type:"danger",plain:"",circle:"",onClick:o=>M(u)},{default:g(()=>[Y("-")]),_:2},1032,["onClick"])]))),128))])]),button:g(()=>[y(S,{class:"task-form-button",type:"primary",onClick:v},{default:g(()=>[Y("Submit")]),_:1}),y(S,{class:"task-form-button",onClick:w},{default:g(()=>[Y("Add")]),_:1})]),_:1})]),_:1}))}}),he=q(ke,[["__scopeId","data-v-5ef4f4cb"]]),ge=c=>(G("data-v-d9172652"),c=c(),H(),c),ye={class:"profile"},be=ge(()=>l("h2",null,"Profile",-1)),$e={class:"profile-info"},we={class:"profile-info-email"},Ye={class:"profile-task"},Me={key:2,class:"profile-task-container"},De={class:"profile-task-item-name"},Se={class:"profile-task-item-name-title"},Ce={class:"profile-task-item-descirbe"},Ie={key:3,class:"profile-task-no"},Ve={class:"contribute"},qe=V({__name:"Profile",setup(c){const{proxy:f}=X(),t=new K,m=b(!1),i=b(!1),n=x([]),a=b();let w=b(0),M=b(null),v=b(null);Q(()=>{f.$loading.show(),t.findList("postgraduate-task","submission",{user_id:{$eq:t.user.id}}).then(s=>{n.splice(0,n.length),s&&n.push(...s)}).finally(()=>{f.$loading.hide()}),console.log(_().format("YYYY-MM-DD"),_.utc().format("YYYY-MM-DD: hh-mm-ss")),t.count("postgraduate-task","submission",{date:{$gte:new Date(_().format("YYYY-MM-DD"))},user_id:{$eq:t.user.id}}).then(s=>{w.value=s}),t.findOne("postgraduate-task","task",{user_id:{$eq:t.user.id}}).then(s=>{a.value=s,t.findOne("postgraduate-task","task",{user_id:{$eq:t.user.id}}).then(u=>{a.value=u}).catch(u=>{console.log(u)})}).catch(s=>{console.log(s)})});function d(){m.value=!0,i.value=!1}function e(){m.value=!0,i.value=!0}function k(){if(!confirm("is ready to delete task!")){f.$notification.show("Canceled","operate already canceled!");return}f.$loading.show(),t.deleteOne("postgraduate-task","task",{name:{$ne:""},user_id:{$eq:t.user.id}}).then(u=>{f.$notification.show("Success","delete task successfully!"),t.findOne("postgraduate-task","task",{user_id:{$eq:t.user.id}}).then(o=>{a.value=o}).catch(o=>{console.log(o)})}).finally(()=>{f.$loading.hide()})}return(s,u)=>(r(),p("div",ye,[be,l("section",$e,[l("p",we,$(j(t).user.profile.email),1),y(z,{message:"finished total task number"},{default:g(()=>[l("p",{class:"profile-info-message",ref_key:"total_task_number",ref:M},"total: "+$(n.length),513)]),_:1}),y(z,{message:"today finished task number"},{default:g(()=>[l("p",{class:"profile-info-message",ref_key:"today_task_number",ref:v},"today: "+$(j(w)),513)]),_:1})]),l("section",Ye,[a.value?(r(),B(S,{key:0,class:"profile-task-edit",onClick:e},{default:g(()=>[Y("Edit")]),_:1})):T("",!0),a.value?(r(),B(S,{key:1,class:"profile-task-delete",type:"danger",onClick:k},{default:g(()=>[Y("Delete")]),_:1})):T("",!0),a.value?(r(),p("blockquote",Me,[(r(!0),p(C,null,I(a.value.task_list,o=>(r(),p("li",{class:"profile-task-item",key:o},[l("div",De,[l("p",Se,$(o.name),1)]),l("p",Ce,$(o.describe),1)]))),128))])):(r(),p("blockquote",Ie,[Y("no task to finish, to define your "),l("span",{class:"profile-task-no-add",onClick:d},"tasks")]))]),ae(y(he,{onClose:u[0]||(u[0]=()=>m.value=!1),is_update:i.value},null,8,["is_update"]),[[le,m.value]]),l("section",Ve,[y(_e,{submission_list:n},null,8,["submission_list"])])]))}}),Te=q(qe,[["__scopeId","data-v-d9172652"]]);export{Te as default};
