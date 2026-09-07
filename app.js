const steps=["Solution type","Business requirement","Current & future process","Solution-specific","Source systems & integration","Technical owner","Security & data","Project information","Review"];
let current=0;
const sections=[...document.querySelectorAll(".form-section")];
const stepNav=document.getElementById("stepNav");
const solutionType=document.getElementById("solutionType");
const specificFields=document.getElementById("specificFields");
const specificTitle=document.getElementById("specificTitle");
const specificSubtitle=document.getElementById("specificSubtitle");
const integrationRequired=document.getElementById("integrationRequired");
const integrationDetails=document.getElementById("integrationDetails");
const validation=document.getElementById("validation");
const DRAFT_KEY="redPifEnhancedV3";

function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function input(id,label,type="text",o={}){
 const req=o.required?"required":"", star=o.required?"<em>*</em>":"", cls=o.full?"field full":"field", ph=esc(o.placeholder||"");
 if(type==="textarea")return `<div class="${cls}"><label for="${id}">${label} ${star}</label><textarea id="${id}" class="${o.large?"large":""}" ${req} placeholder="${ph}"></textarea></div>`;
 if(type==="select")return `<div class="${cls}"><label for="${id}">${label} ${star}</label><select id="${id}" ${req}><option value="">Select</option>${o.options.map(x=>`<option>${esc(x)}</option>`).join("")}</select></div>`;
 return `<div class="${cls}"><label for="${id}">${label} ${star}</label><input id="${id}" type="${type}" ${req} placeholder="${ph}"></div>`;
}
function choices(name,label,items,required=false){
 return `<div class="field full"><label>${label} ${required?"<em>*</em>":""}</label><div class="choice-group">${items.map(x=>`<label class="choice"><input type="checkbox" name="${name}" value="${esc(x)}"><span>${esc(x)}</span></label>`).join("")}</div></div>`;
}
function buttonPreview(idPrefix,items){
 return `<div class="button-preview"><div class="button-preview-title">Suggested Red action buttons</div><div class="preview-actions">${items.map((x,i)=>`<button type="button" class="preview-btn ${i===0?"primary":""}" data-preview="${idPrefix}">${esc(x)}</button>`).join("")}</div></div>`;
}
function buildSpecific(){
 const t=solutionType.value;specificFields.innerHTML="";
 if(!t){specificTitle.textContent="Solution-specific requirements";specificSubtitle.textContent="Select a solution type to see relevant questions.";return}
 let html="";
 if(t==="approval"){
  specificTitle.textContent="Approval requirements";specificSubtitle.textContent="Define the approval source, flow, actions, proactive notification, reminders, and response buttons.";
  html=`<div class="grid two">
   ${input("a1","How are approvals managed today?","textarea",{full:true,required:true})}
   ${input("a2","Which system currently owns the approval record / workflow?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or another application"})}
   ${input("a3","What is the approval flow today?","textarea",{full:true,large:true,required:true})}
   ${input("a4","How many approval levels are required?","number",{required:true})}
   ${input("a5","Who are the approvers?","textarea",{required:true})}
   ${input("a6","What information should be displayed to the approver in Red?","textarea",{full:true,required:true,placeholder:"Request number, requester, amount, project, date, status, attachments, etc."})}
   ${choices("a7","What action should the approver be able to perform?",["Approve","Reject","Skip","Send back / Return","Request information","Other"],true)}
   ${input("a8","What should happen in the source system after the approver selects the action?","textarea",{full:true,required:true,placeholder:"Example: update ServiceNow approval state, update SAP transaction, send decision to ETR, etc."})}
  </div>
  <div class="question-block"><div class="question-title">Proactive approval notification</div><div class="grid two">
   ${input("a9","Should Red send a proactive approval notification?","select",{required:true,options:["Yes","No","Not sure"]})}
   ${input("a10","Who should receive the proactive notification?","textarea",{required:true})}
   ${input("a11","What event triggers the proactive notification?","textarea",{required:true})}
   ${input("a12","What information should be included?","textarea",{required:true})}
   ${input("a13","Proactive notification template","textarea",{full:true,required:true})}
  </div></div>
  <div class="question-block"><div class="question-title">Reminder notification</div><div class="grid two">
   ${input("a14","Should Red send approval reminders?","select",{required:true,options:["No reminder","1 reminder — 7 days after initial notification","2 reminders — both during Week 1","2 reminders — one during Week 1 and one during Week 2","Not sure"]})}
   ${input("a15","Who should receive the reminder?","textarea")}
   ${input("a16","What event/date should start the reminder schedule?","textarea")}
   ${input("a17","Reminder notification template","textarea",{full:true})}
  </div><div class="conditional-note">Daily approval reminders are not supported in this prototype. Use one of the supported reminder schedules above.</div></div>
  <div class="question-block">${buttonPreview("approval",["Approve","Reject","More details"])}</div>`;
 } else if(t==="alert"){
  specificTitle.textContent="Alert / notification requirements";specificSubtitle.textContent="Define whether the alert is proactive, a reminder, or both, and identify the source system.";
  html=`<div class="grid two">
   ${input("b1","How are notifications managed today?","textarea",{full:true,required:true})}
   ${input("b2","Which system/event generates the notification?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or another system"})}
   ${input("b3","Who should receive the notification?","textarea",{required:true})}
   ${input("b4","What event should trigger the notification?","textarea",{required:true})}
   ${input("b5","How many notifications are sent/received monthly?","number",{required:true})}
   ${choices("b6","Notification type",["Proactive notification","Reminder notification"],true)}
  </div>
  <div id="proactiveFields" class="question-block hidden"><div class="question-title">Proactive notification details</div><div class="grid two">
   ${input("b7","Proactive recipient","textarea",{required:true})}
   ${input("b8","Proactive trigger","textarea",{required:true})}
   ${input("b9","Information included","textarea",{required:true})}
   ${input("b10","Proactive notification template","textarea",{full:true,required:true})}
  </div></div>
  <div id="reminderFields" class="question-block hidden"><div class="question-title">Reminder details</div><div class="grid two">
   ${input("b11","Reminder trigger","textarea",{required:true})}
   ${input("b12","Reminder schedule / time","textarea",{required:true,placeholder:"Specify supported timing or business rule."})}
   ${input("b13","Reminder recipient","textarea",{required:true})}
   ${input("b14","Reminder notification template","textarea",{full:true,required:true})}
  </div></div>`;
 } else if(t==="query"){
  specificTitle.textContent="Business query / fetch & display";specificSubtitle.textContent="Define the source system, user questions, retrieved data, display format, and action buttons.";
  html=`<div class="grid two">
   ${input("c1","What information should users be able to retrieve from Red?","textarea",{full:true,required:true})}
   ${input("c2","Which source system contains this information?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or other third party"})}
   ${input("c3","What should trigger the Red conversation?","textarea",{required:true})}
   ${input("c4","7–10 example questions users may ask Red","textarea",{full:true,large:true,required:true,placeholder:"One utterance per line."})}
   ${input("c5","What data should Red retrieve?","textarea",{full:true,required:true})}
   ${input("c6","What fields should Red display?","textarea",{required:true})}
   ${input("c7","How should the information be displayed?","select",{required:true,options:["Simple response","List","Table","Cards","Summary + details","Other"]})}
   ${input("c8","Should the user be able to perform an action from the result?","select",{required:true,options:["Yes","No","Not sure"]})}
   ${choices("c9","Possible result/action buttons",["View details","Open record","Approve","Reject","Submit","Retry","Refresh","Back","Cancel","Other"])}
   ${input("c10","Expected Red response / mockup","textarea",{full:true,required:true})}
   ${input("c11","Does this require Labor Employee Relations (LER) approval?","select",{required:true,options:["Yes","No","Not sure"]})}
  </div>`;
 } else if(t==="guided"){
  specificTitle.textContent="Guided Path requirements";specificSubtitle.textContent="Define the questions, sequence, external system handoff, and final action.";
  html=`<div class="grid two">
   ${input("d1","What process should the Guided Path help the user complete?","textarea",{full:true,required:true})}
   ${input("d2","Approximately how many questions will the user need to answer?","number",{required:true})}
   ${input("d3","What questions should Red ask the user?","textarea",{full:true,large:true,required:true,placeholder:"List expected questions in sequence."})}
   ${input("d4","Does the user need to be redirected outside Red?","select",{required:true,options:["Yes","No","Not sure"]})}
   ${input("d8","What should the final button/action be?","text",{required:true,placeholder:"Submit, Start request, Create case, Continue, etc."})}
  </div>
  <div id="guidedRedirect" class="question-block hidden"><div class="question-title">External application handoff</div><div class="grid two">
   ${input("d5","Which application should the user be redirected to?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or another application"})}
   ${input("d6","Why does the user need to leave the Red conversation?","textarea",{required:true})}
   ${input("d7","What information should Red pass to the external application/form?","textarea",{full:true,required:true})}
  </div></div>`;
 } else {
  specificTitle.textContent="Existing Red capability / enhancement";specificSubtitle.textContent="Capture what exists, what system/API is affected, and exactly what should change.";
  html=`<div class="grid two">
   ${input("e1","What existing Red capability needs to be enhanced?","text",{required:true})}
   ${input("e2","Conversation ID / Process ID / Action ID","text")}
   ${input("e3","What does the existing Red capability do today?","textarea",{full:true,required:true})}
   ${input("e4","3–5 example questions/utterances currently used to trigger it","textarea",{full:true,required:true,placeholder:"One utterance per line."})}
   ${choices("e5","What specifically needs to change?",["Trigger / utterances","Conversation flow","Questions","API","API parameters","API response","Data displayed","Response format","Notification","Reminder","Approval logic","Buttons / actions","UX","Other"],true)}
   ${input("e6","Which application/system is affected by the enhancement?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or other third party"})}
   ${input("e7","Describe the required changes in detail","textarea",{full:true,large:true,required:true,placeholder:"What needs to change, where it needs to change, and when the new behavior should occur."})}
   ${input("e8","What should the expected result look like?","textarea",{full:true,required:true})}
  </div>`;
 }
 specificFields.innerHTML=html;
 bindSpecificLogic();
}
function bindSpecificLogic(){
 document.querySelectorAll('input[name="b6"]').forEach(e=>e.addEventListener("change",updateAlertType));
 const d4=document.getElementById("d4");if(d4)d4.addEventListener("change",updateGuided);
 const a9=document.getElementById("a9");if(a9)a9.addEventListener("change",()=>{});
 updateAlertType();updateGuided();
}
function updateAlertType(){
 const p=document.getElementById("proactiveFields"),r=document.getElementById("reminderFields");if(!p||!r)return;
 const ps=document.querySelector('input[name="b6"][value="Proactive notification"]')?.checked;
 const rs=document.querySelector('input[name="b6"][value="Reminder notification"]')?.checked;
 p.classList.toggle("hidden",!ps);r.classList.toggle("hidden",!rs);
}
function updateGuided(){const e=document.getElementById("guidedRedirect");if(e)e.classList.toggle("hidden",document.getElementById("d4")?.value!=="Yes")}
function updateIntegration(){
 const yes=integrationRequired.value==="Yes";integrationDetails.classList.toggle("hidden",!yes);
 ["systemType","systemName"].forEach(id=>{const e=document.getElementById(id);if(e)e.required=yes});
 document.querySelectorAll('input[name="integrationDirection"]').forEach(e=>e.required=false);
 document.getElementById("apiInfo")?.toggleAttribute("required",yes);
 document.getElementById("apiInfoStar")?.classList.toggle("hidden",!yes);
 updateTechRequirement();
}
function updateTechRequirement(){
 const required=integrationRequired.value==="Yes";
 ["techName","techEmail","techAvailable"].forEach(id=>{const e=document.getElementById(id);if(e)e.required=required});
 ["techNameStar","techEmailStar","techAvailableStar"].forEach(id=>document.getElementById(id)?.classList.toggle("hidden",!required));
}
function selected(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value).join(", ")||"—"}
function val(id){const e=document.getElementById(id);return e?e.value||"—":"—"}
function checkCurrent(){
 const req=[...sections[current].querySelectorAll("[required]")].filter(e=>!e.closest(".hidden"));
 for(const e of req){if(!String(e.value||"").trim()){validation.textContent="Please complete: "+(e.previousElementSibling?.innerText||"Required field");e.focus();return false}}
 if(current===3){
  const t=solutionType.value;
  if(t==="approval"&&!selected("a7").includes("Approve")&&!selected("a7").includes("Reject")){validation.textContent="For an approval flow, select at least Approve or Reject.";return false}
  if(t==="alert"&&!document.querySelector('input[name="b6"]:checked')){validation.textContent="Select Proactive notification, Reminder notification, or both.";return false}
  if(t==="query"){const n=val("c4").split(/\n+/).map(x=>x.trim()).filter(Boolean).length;if(n<7||n>10){validation.textContent=`Business Query requires 7–10 example questions/utterances. You entered ${n}.`;document.getElementById("c4").focus();return false}}
  if(t==="enhancement"){const n=val("e4").split(/\n+/).map(x=>x.trim()).filter(Boolean).length;if(n<3||n>5){validation.textContent=`Enhancement requires 3–5 existing utterances. You entered ${n}.`;document.getElementById("e4").focus();return false}if(!selected("e5")||selected("e5")==="—"){validation.textContent="Select at least one enhancement area.";return false}}
 }
 if(current===4&&integrationRequired.value==="Yes"&&!selected("integrationDirection")){validation.textContent="Select what Red needs to do with the source system: get, send, update, or trigger.";return false}
 return true;
}
function addReview(title,pairs){return `<div class="review-item review-section-title">${esc(title)}</div>`+pairs.map(([a,b])=>`<div class="review-item"><div class="label">${esc(a)}</div><div class="value">${esc(b)}</div></div>`).join("")}
function buildReview(){
 let h=addReview("Solution & business",[["Solution type",solutionType.options[solutionType.selectedIndex]?.text||"—"],["Business reason",val("businessReason")],["Users",val("audience")],["Users impacted",val("users")],["Monthly incidents / requests",val("incidents")],["Monthly approvals",val("approvalsMonthly")],["Primary application",val("application")],["Data location",val("dataStore")]]);
 h+=addReview("Current & future process",[["Current process",val("currentProcess")],["Future-state process",val("futureProcess")]]);
 const t=solutionType.value;
 if(t==="approval")h+=addReview("Approval",[
  ["Current approval system",val("a2")],["Approval flow",val("a3")],["Approval levels",val("a4")],["Approvers",val("a5")],["Approver information",val("a6")],["Actions",selected("a7")],["Source-system outcome",val("a8")],["Proactive notification",val("a9")],["Proactive recipients",val("a10")],["Proactive trigger",val("a11")],["Proactive information",val("a12")],["Proactive template",val("a13")],["Reminder schedule",val("a14")],["Reminder recipients",val("a15")],["Reminder start event",val("a16")],["Reminder template",val("a17")]);
 if(t==="alert")h+=addReview("Alert / notification",[["Current management",val("b1")],["Source system",val("b2")],["Recipients",val("b3")],["Trigger",val("b4")],["Monthly volume",val("b5")],["Notification type",selected("b6")],["Proactive recipient",val("b7")],["Proactive trigger",val("b8")],["Proactive information",val("b9")],["Proactive template",val("b10")],["Reminder trigger",val("b11")],["Reminder schedule",val("b12")],["Reminder recipient",val("b13")],["Reminder template",val("b14")]);
 if(t==="query")h+=addReview("Business query",[["Source system",val("c2")],["Information",val("c1")],["Conversation trigger",val("c3")],["Example utterances",val("c4")],["Data retrieved",val("c5")],["Displayed fields",val("c6")],["Display format",val("c7")],["Action from result",val("c8")],["Action buttons",selected("c9")],["Expected response",val("c10")],["LER approval",val("c11")]);
 if(t==="guided")h+=addReview("Guided Path",[["Process",val("d1")],["Approximate questions",val("d2")],["Questions",val("d3")],["Redirect outside Red",val("d4")],["Target application",val("d5")],["Reason for leaving Red",val("d6")],["Data passed",val("d7")],["Final action",val("d8")]);
 if(t==="enhancement")h+=addReview("Enhancement",[["Existing capability",val("e1")],["Existing ID",val("e2")],["Current behavior",val("e3")],["Existing utterances",val("e4")],["Changes",selected("e5")],["Affected system",val("e6")],["Detailed changes",val("e7")],["Expected result",val("e8")]);
 h+=addReview("Integration",[["Integration required",val("integrationRequired")],["System type",val("systemType")],["System name",val("systemName")],["Direction",selected("integrationDirection")],["Data sent",val("dataSent")],["Data received",val("dataReceived")],["API details",val("apiInfo")],["API count",val("apiCount")],["APIGEE / wrapper",val("wrapper")],["Wrapper details",val("wrapperInfo")],["Requirements from system team",val("systemTeamNeeds")]]);
 h+=addReview("Technical owner & project",[["Technical owner",val("techName")],["Email",val("techEmail")],["Team / role",val("techTeam")],["Owner available",val("techAvailable")],["Security / data",val("security")],["Sponsor",val("sponsor")],["ServiceNow service",val("service")],["Project contacts",val("contacts")],["Benefit type",val("benefitType")],["Expected benefit",val("benefitAmount")],["Current metrics",val("metrics")],["Additional information",val("additional")]]);
 document.getElementById("reviewSummary").innerHTML=h;
}
function renderNav(){stepNav.innerHTML=steps.map((s,i)=>`<div class="step ${i===current?"active":""} ${i<current?"done":""}" data-i="${i}"><span class="circle">${i<current?"✓":i+1}</span><span>${s}</span></div>`).join("");stepNav.querySelectorAll(".step").forEach(e=>e.onclick=()=>{const i=+e.dataset.i;if(i<=current+1){current=i;if(i===8)buildReview();render()}})}
function render(){sections.forEach((s,i)=>s.classList.toggle("active",i===current));renderNav();document.getElementById("backBtn").disabled=current===0;document.getElementById("nextBtn").textContent=current===8?"Submit":"Next";validation.textContent="";window.scrollTo({top:0,behavior:"smooth"})}
function saveDraft(){
 const fields={};document.querySelectorAll("input,select,textarea").forEach(e=>{if(e.type==="file")return;if(e.type==="checkbox"){fields[e.id||e.name+"__"+e.value]=e.checked}else fields[e.id]=e.value});
 localStorage.setItem(DRAFT_KEY,JSON.stringify({fields,solution:solutionType.value}));showToast("Draft saved locally in this browser.");
}
function loadDraft(){
 try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!d)return;if(d.solution)solutionType.value=d.solution;buildSpecific();
  Object.entries(d.fields||{}).forEach(([id,v])=>{const e=document.getElementById(id);if(e){if(e.type==="checkbox")e.checked=!!v;else e.value=v}});
  updateAlertType();updateGuided();updateIntegration();
 }catch(e){console.warn(e)}
}
function clearDraft(){localStorage.removeItem(DRAFT_KEY);document.getElementById("pifForm").reset();solutionType.value="";buildSpecific();updateIntegration();current=0;render();showToast("Draft cleared.")}
function showToast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2600)}
solutionType.addEventListener("change",()=>{buildSpecific();const h=document.getElementById("solutionHint");h.classList.toggle("hidden",!solutionType.value);h.textContent=solutionType.value?"The solution-specific questions, approval/notification options, integration expectations, and action buttons have been updated.":"Select a solution to continue."});
integrationRequired.addEventListener("change",updateIntegration);
document.getElementById("backBtn").onclick=()=>{if(current>0){current--;render()}};
document.getElementById("nextBtn").onclick=()=>{if(current<8){if(!checkCurrent())return;current++;if(current===8)buildReview();render()}else{if(!checkCurrent())return;showToast("Requirement submitted successfully — prototype only. No ServiceNow record or API call was created.")}};
document.getElementById("saveBtn").onclick=saveDraft;
document.getElementById("clearBtn").onclick=clearDraft;
["currentDoc","futureDoc","techDocs"].forEach(id=>document.getElementById(id)?.addEventListener("change",e=>{const target=document.getElementById(id+"Names");if(target)target.textContent=[...e.target.files].map(f=>f.name).join("\n")}));
buildSpecific();loadDraft();updateIntegration();render();