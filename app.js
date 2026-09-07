const $=id=>document.getElementById(id);
const solution=$("solutionType");
const specific=$("specificFields");
const integration=$("integrationRequired");
let selectedSolution="";

function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function input(id,label,type="text",o={}){
 const star=o.required?"<em>*</em>":"",req=o.required?"required":"",cls=o.full?"field full":"field",ph=esc(o.placeholder||"");
 if(type==="textarea")return `<div class="${cls}"><label for="${id}">${label} ${star}</label><textarea id="${id}" class="${o.large?"large":""}" ${req} placeholder="${ph}"></textarea></div>`;
 if(type==="select")return `<div class="${cls}"><label for="${id}">${label} ${star}</label><select id="${id}" ${req}><option value="">Select</option>${o.options.map(x=>`<option>${esc(x)}</option>`).join("")}</select></div>`;
 return `<div class="${cls}"><label for="${id}">${label} ${star}</label><input id="${id}" type="${type}" ${req} placeholder="${ph}"></div>`;
}
function choices(name,label,items,required=false){
 return `<div class="field full"><label>${label} ${required?"<em>*</em>":""}</label><div class="choice-group">${items.map(x=>`<label class="choice"><input type="checkbox" name="${name}" value="${esc(x)}"><span>${esc(x)}</span></label>`).join("")}</div></div>`;
}
function buttonPreview(items){return `<div class="button-preview"><div class="button-preview-title">Suggested Red action buttons</div><div class="preview-actions">${items.map((x,i)=>`<button type="button" class="preview-btn ${i===0?"primary":""}">${esc(x)}</button>`).join("")}</div></div>`}

function reveal(id){$(id).classList.add("visible")}
function buildSpecific(){
 const t=solution.value;specific.innerHTML="";
 if(!t)return;
 let h="";
 if(t==="approval"){
  $("specificTitle").textContent="Approval requirements";$("specificSubtitle").textContent="Approval questions appear automatically. Proactive and reminder requirements are captured separately.";
  h=`<div class="grid two">
  ${input("a1","How are approvals managed today?","textarea",{full:true,required:true})}
  ${input("a2","Which system currently owns the approval workflow?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or another application"})}
  ${input("a3","What is the approval flow today?","textarea",{full:true,large:true,required:true})}
  ${input("a4","How many approval levels are required?","number",{required:true})}
  ${input("a5","Who are the approvers?","textarea",{required:true})}
  ${input("a6","What information should be displayed to the approver in Red?","textarea",{full:true,required:true})}
  ${choices("a7","What action should the approver be able to perform?",["Approve","Reject","Skip","Send back / Return","Request information","Other"],true)}
  ${input("a8","What should happen in the source system after the action?","textarea",{full:true,required:true,placeholder:"Update ServiceNow, SAP transaction, ETR record, etc."})}
  </div>
  <div class="question-block"><div class="question-title">Proactive approval notification</div><div class="grid two">
  ${input("a9","Should Red send a proactive approval notification?","select",{required:true,options:["Yes","No","Not sure"]})}
  ${input("a10","Who should receive the proactive notification?","textarea",{required:true})}
  ${input("a11","What event triggers it?","textarea",{required:true})}
  ${input("a12","What information should be included?","textarea",{required:true})}
  ${input("a13","Proactive notification template","textarea",{full:true,required:true})}
  </div></div>
  <div class="question-block"><div class="question-title">Reminder notification</div><div class="grid two">
  ${input("a14","Should Red send approval reminders?","select",{required:true,options:["No reminder","1 reminder — 7 days after initial notification","2 reminders — both during Week 1","2 reminders — one during Week 1 and one during Week 2","Not sure"]})}
  ${input("a15","Who should receive the reminder?","textarea")}
  ${input("a16","What event/date should start the reminder schedule?","textarea")}
  ${input("a17","Reminder notification template","textarea",{full:true})}
  </div><div class="conditional-note">Daily approval reminders are not supported in this prototype.</div></div>
  ${buttonPreview(["Approve","Reject","More details"])}`;
 }else if(t==="alert"){
  $("specificTitle").textContent="Alert / notification requirements";$("specificSubtitle").textContent="Select Proactive, Reminder, or Both. The corresponding questions appear immediately.";
  h=`<div class="grid two">
  ${input("b1","How are notifications managed today?","textarea",{full:true,required:true})}
  ${input("b2","Which system/event generates the notification?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or other"})}
  ${input("b3","Who should receive the notification?","textarea",{required:true})}
  ${input("b4","What event should trigger the notification?","textarea",{required:true})}
  ${input("b5","Monthly notification volume","number",{required:true})}
  ${choices("b6","Notification type",["Proactive notification","Reminder notification"],true)}
  </div>
  <div id="proactiveFields" class="question-block hidden"><div class="question-title">Proactive notification details</div><div class="grid two">
  ${input("b7","Proactive recipient","textarea",{required:true})}${input("b8","Proactive trigger","textarea",{required:true})}${input("b9","Information included","textarea",{required:true})}${input("b10","Proactive notification template","textarea",{full:true,required:true})}
  </div></div>
  <div id="reminderFields" class="question-block hidden"><div class="question-title">Reminder details</div><div class="grid two">
  ${input("b11","Reminder trigger","textarea",{required:true})}${input("b12","Reminder schedule / time","textarea",{required:true})}${input("b13","Reminder recipient","textarea",{required:true})}${input("b14","Reminder notification template","textarea",{full:true,required:true})}
  </div></div>`;
 }else if(t==="query"){
  $("specificTitle").textContent="Business Query / Fetch & Display";$("specificSubtitle").textContent="The source system, utterances, data and button requirements are captured here.";
  h=`<div class="grid two">
  ${input("c1","What information should users retrieve from Red?","textarea",{full:true,required:true})}
  ${input("c2","Which source system contains the information?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, other third party"})}
  ${input("c3","What should trigger the Red conversation?","textarea",{required:true})}
  ${input("c4","7–10 example questions users may ask Red","textarea",{full:true,large:true,required:true,placeholder:"One utterance per line."})}
  ${input("c5","What data should Red retrieve?","textarea",{full:true,required:true})}
  ${input("c6","What fields should Red display?","textarea",{required:true})}
  ${input("c7","How should information be displayed?","select",{required:true,options:["Simple response","List","Table","Cards","Summary + details","Other"]})}
  ${input("c8","Should the user be able to perform an action from the result?","select",{required:true,options:["Yes","No","Not sure"]})}
  ${choices("c9","Possible result/action buttons",["View details","Open record","Approve","Reject","Submit","Retry","Refresh","Back","Cancel","Other"])}
  ${input("c10","Expected Red response / mockup","textarea",{full:true,required:true})}
  ${input("c11","Does this require LER approval?","select",{required:true,options:["Yes","No","Not sure"]})}</div>`;
 }else if(t==="guided"){
  $("specificTitle").textContent="Guided Path requirements";$("specificSubtitle").textContent="The next questions appear based on whether the user leaves Red.";
  h=`<div class="grid two">
  ${input("d1","What process should the Guided Path help complete?","textarea",{full:true,required:true})}
  ${input("d2","Approximately how many questions?","number",{required:true})}
  ${input("d3","What questions should Red ask, in sequence?","textarea",{full:true,large:true,required:true})}
  ${input("d4","Does the user need to be redirected outside Red?","select",{required:true,options:["Yes","No","Not sure"]})}
  ${input("d8","What should the final button/action be?","text",{required:true,placeholder:"Submit, Create request, Continue, etc."})}</div>
  <div id="guidedRedirect" class="question-block hidden"><div class="question-title">External application handoff</div><div class="grid two">
  ${input("d5","Target application","text",{required:true,placeholder:"ServiceNow, SAP, ETR, etc."})}
  ${input("d6","Why does the user need to leave Red?","textarea",{required:true})}
  ${input("d7","What data should Red pass to the external application?","textarea",{full:true,required:true})}
  </div></div>`;
 }else{
  $("specificTitle").textContent="Existing Red capability / enhancement";$("specificSubtitle").textContent="Capture the existing capability and all areas that may change.";
  h=`<div class="grid two">
  ${input("e1","What existing Red capability needs enhancement?","text",{required:true})}
  ${input("e2","Conversation ID / Process ID / Action ID","text")}
  ${input("e3","What does it do today?","textarea",{full:true,required:true})}
  ${input("e4","3–5 existing trigger questions/utterances","textarea",{full:true,required:true,placeholder:"One utterance per line."})}
  ${choices("e5","What specifically needs to change?",["Trigger / utterances","Conversation flow","Questions","API","API parameters","API response","Data displayed","Response format","Notification","Reminder","Approval logic","Buttons / actions","UX","Other"],true)}
  ${input("e6","Which application/system is affected?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, other"})}
  ${input("e7","Describe the required changes","textarea",{full:true,large:true,required:true})}
  ${input("e8","Expected result","textarea",{full:true,required:true})}</div>`;
 }
 specific.innerHTML=h;bindSpecific();
}
function bindSpecific(){
 document.querySelectorAll('input[name="b6"]').forEach(x=>x.addEventListener("change",updateAlert));
 $("d4")?.addEventListener("change",updateGuided);
 updateAlert();updateGuided();
}
function updateAlert(){
 const p=$("proactiveFields"),r=$("reminderFields");if(!p||!r)return;
 const ps=document.querySelector('input[name="b6"][value="Proactive notification"]')?.checked;
 const rs=document.querySelector('input[name="b6"][value="Reminder notification"]')?.checked;
 p.classList.toggle("hidden",!ps);r.classList.toggle("hidden",!rs);
}
function updateGuided(){const x=$("guidedRedirect");if(x)x.classList.toggle("hidden",$("d4")?.value!=="Yes")}

function updateIntegration(){
 const yes=integration.value==="Yes";
 $("integrationDetails").classList.toggle("hidden",!yes);
 ["systemType","systemName","apiInfo"].forEach(id=>{const e=$(id);if(e)e.required=yes});
 updateTechnical(yes);
}
function updateTechnical(required){
 reveal("technicalSection");
 ["techName","techEmail","techAvailable"].forEach(id=>{const e=$(id);if(e)e.required=required});
 ["techNameStar","techEmailStar","techAvailableStar"].forEach(id=>$(id)?.classList.toggle("hidden",!required));
}
function businessComplete(){
 return ["businessReason","audience","users","application"].every(id=>String($(id)?.value||"").trim());
}
function processComplete(){
 return ["currentProcess","futureProcess"].every(id=>String($(id)?.value||"").trim());
}
function solutionSpecificReady(){
 const t=solution.value;
 if(t==="approval")return ["a1","a2","a3","a4","a5","a6","a8","a9","a10","a11","a12","a13","a14"].every(id=>String($(id)?.value||"").trim())&&document.querySelector('input[name="a7"]:checked');
 if(t==="alert")return ["b1","b2","b3","b4"].every(id=>String($(id)?.value||"").trim())&&document.querySelector('input[name="b6"]:checked');
 if(t==="query")return ["c1","c2","c3","c5","c6","c7","c8","c10","c11"].every(id=>String($(id)?.value||"").trim())&&utterances("c4",7,10)&&document.querySelectorAll('input[name="c9"]:checked').length>=0;
 if(t==="guided")return ["d1","d2","d3","d4","d8"].every(id=>String($(id)?.value||"").trim());
 if(t==="enhancement")return ["e1","e3","e6","e7","e8"].every(id=>String($(id)?.value||"").trim())&&utterances("e4",3,5)&&document.querySelector('input[name="e5"]:checked');
 return false;
}
function utterances(id,min,max){const e=$(id);if(!e)return false;const n=e.value.split(/\n+/).map(x=>x.trim()).filter(Boolean).length;return n>=min&&n<=max}
function showProgress(){
 const visible=[...document.querySelectorAll(".reveal.visible")].length;
 const pct=Math.min(100,Math.round(visible/9*100));
 $("progressBar").style.width=pct+"%";$("progressPercent").textContent=pct+"%";
 $("progressLabel").textContent=visible>=9?"Ready for review":`Section ${visible} of 9 is available`;
}

function revealAsUserProgresses(){
 if(solution.value){reveal("businessSection")}
 if(businessComplete()){reveal("processSection")}
 if(processComplete()){reveal("specificSection")}
 if(solutionSpecificReady()){reveal("integrationSection")}
 if(integration.value){reveal("technicalSection");reveal("securitySection")}
 if(integration.value==="No"||integration.value==="Not sure"){reveal("securitySection")}
 const techReady=integration.value!=="Yes"||["techName","techEmail","techAvailable"].every(id=>String($(id)?.value||"").trim());
 if(techReady&&document.getElementById("securitySection").classList.contains("visible"))reveal("projectSection");
 const projectReady=["sponsor","service","contacts","benefitType","additional"].some(id=>String($(id)?.value||"").trim());
 if(projectReady)reveal("reviewSection");
 showProgress();
 if($("reviewSection").classList.contains("visible"))buildReview();
}
document.addEventListener("input",revealAsUserProgresses);
document.addEventListener("change",revealAsUserProgresses);
solution.addEventListener("change",()=>{selectedSolution=solution.value;buildSpecific();revealAsUserProgresses();window.scrollTo({top:document.getElementById("businessSection").offsetTop-75,behavior:"smooth"})});
integration.addEventListener("change",()=>{updateIntegration();revealAsUserProgresses()});

["currentDoc","futureDoc","techDocs"].forEach(id=>$(id).addEventListener("change",e=>{
 const x=$(id+"Names");if(x)x.textContent=[...e.target.files].map(f=>f.name).join("\n");
}));

function val(id){const e=$(id);return e?e.value||"—":"—"}
function checked(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e=>e.value).join(", ")||"—"}
function sectionReview(title,pairs){return `<div class="review-item review-section-title">${esc(title)}</div>`+pairs.map(([a,b])=>`<div class="review-item"><div class="label">${esc(a)}</div><div class="value">${esc(b)}</div></div>`).join("")}
function buildReview(){
 let h=sectionReview("Solution & business",[["Solution type",solution.options[solution.selectedIndex]?.text||"—"],["Business reason",val("businessReason")],["Users",val("audience")],["Users impacted",val("users")],["Monthly incidents",val("incidents")],["Monthly approvals",val("approvalsMonthly")],["Application",val("application")],["Data location",val("dataStore")]]);
 h+=sectionReview("Current & future process",[["Current process",val("currentProcess")],["Future state",val("futureProcess")]]);
 const t=solution.value;
 if(t==="approval")h+=sectionReview("Approval",[["Approval system",val("a2")],["Approval flow",val("a3")],["Levels",val("a4")],["Approvers",val("a5")],["Approver information",val("a6")],["Actions",checked("a7")],["Source-system outcome",val("a8")],["Proactive",val("a9")],["Proactive recipients",val("a10")],["Proactive trigger",val("a11")],["Proactive information",val("a12")],["Proactive template",val("a13")],["Reminder schedule",val("a14")],["Reminder recipients",val("a15")],["Reminder start",val("a16")],["Reminder template",val("a17")]]);
 if(t==="alert")h+=sectionReview("Alert / notification",[["Source",val("b2")],["Recipients",val("b3")],["Trigger",val("b4")],["Monthly volume",val("b5")],["Type",checked("b6")],["Proactive recipient",val("b7")],["Proactive trigger",val("b8")],["Proactive info",val("b9")],["Proactive template",val("b10")],["Reminder trigger",val("b11")],["Reminder schedule",val("b12")],["Reminder recipient",val("b13")],["Reminder template",val("b14")]]);
 if(t==="query")h+=sectionReview("Business query",[["Source",val("c2")],["Information",val("c1")],["Trigger",val("c3")],["Utterances",val("c4")],["Data retrieved",val("c5")],["Displayed fields",val("c6")],["Format",val("c7")],["Action",val("c8")],["Buttons",checked("c9")],["Expected response",val("c10")],["LER",val("c11")]]);
 if(t==="guided")h+=sectionReview("Guided Path",[["Process",val("d1")],["Questions",val("d3")],["Redirect",val("d4")],["Target app",val("d5")],["Reason",val("d6")],["Data passed",val("d7")],["Final button",val("d8")]]);
 if(t==="enhancement")h+=sectionReview("Enhancement",[["Capability",val("e1")],["Existing ID",val("e2")],["Current behavior",val("e3")],["Utterances",val("e4")],["Changes",checked("e5")],["Affected system",val("e6")],["Required changes",val("e7")],["Expected result",val("e8")]]);
 h+=sectionReview("Integration & technical",[["Integration",val("integrationRequired")],["System type",val("systemType")],["System",val("systemName")],["Direction",checked("integrationDirection")],["Data sent",val("dataSent")],["Data received",val("dataReceived")],["API",val("apiInfo")],["APIGEE",val("wrapper")],["Wrapper",val("wrapperInfo")],["Needs from system team",val("systemTeamNeeds")],["Technical owner",val("techName")],["Email",val("techEmail")],["Team",val("techTeam")]]);
 h+=sectionReview("Security & project",[["Security/data",val("security")],["Sponsor",val("sponsor")],["Service",val("service")],["Contacts",val("contacts")],["Benefit type",val("benefitType")],["Benefit amount",val("benefitAmount")],["Metrics",val("metrics")],["Additional",val("additional")]]);
 $("reviewSummary").innerHTML=h;
}
$("submitBtn").addEventListener("click",()=>{
 if(!solution.value){alert("Please select a solution type.");return}
 buildReview();showToast("Requirement submitted successfully — prototype only. No ServiceNow record or API call was created.");
});
function showToast(t){const x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2800)}
showProgress();