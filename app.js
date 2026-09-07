const steps=["Solution type","Business requirement","Current & future process","Solution-specific","API & integration","Technical owner","Security & data","Project information","Review"];
let current=0;
const sections=[...document.querySelectorAll(".form-section")];
const stepNav=document.getElementById("stepNav");
const solutionType=document.getElementById("solutionType");
const specificFields=document.getElementById("specificFields");
const specificTitle=document.getElementById("specificTitle");
const specificSubtitle=document.getElementById("specificSubtitle");
const apiAvailable=document.getElementById("apiAvailable");
const apiDetails=document.getElementById("apiDetails");
const validation=document.getElementById("validation");
const DRAFT_KEY="redPifDraftV2";

function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function input(id,label,type="text",o={}){
  const req=o.required?'required':'';
  const star=o.required?'<em>*</em>':'';
  const cls=o.full?'field full':'field';
  const ph=esc(o.placeholder||"");
  if(type==="textarea") return `<div class="${cls}"><label for="${id}">${label} ${star}</label><textarea id="${id}" class="${o.large?'large':''}" ${req} placeholder="${ph}"></textarea></div>`;
  if(type==="select") return `<div class="${cls}"><label for="${id}">${label} ${star}</label><select id="${id}" ${req}><option value="">Select</option>${o.options.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select></div>`;
  return `<div class="${cls}"><label for="${id}">${label} ${star}</label><input id="${id}" type="${type}" ${req} placeholder="${ph}"></div>`;
}
function choices(name,label,items,required=false){
  return `<div class="field full"><label>${label} ${required?'<em>*</em>':''}</label><div class="choice-group">${items.map((x,i)=>`<label class="choice"><input type="checkbox" name="${name}" value="${esc(x)}"> <span>${esc(x)}</span></label>`).join("")}</div></div>`;
}
function buildSpecific(){
  const t=solutionType.value; specificFields.innerHTML="";
  if(!t){specificTitle.textContent="Solution-specific requirements";specificSubtitle.textContent="Select a solution type to see the relevant questions.";return}
  let html="";
  if(t==="approval"){
    specificTitle.textContent="Approval requirements";specificSubtitle.textContent="Capture approval flow, approvers, actions, reminders, and notification details.";
    html=`<div class="grid two">
      ${input("a1","How are approvals managed today?","textarea",{full:true,required:true})}
      ${input("a2","What is the approval flow today?","textarea",{full:true,large:true,required:true})}
      ${input("a3","How many approval levels are required?","number",{required:true})}
      ${input("a4","Who are the approvers?","textarea",{required:true})}
      ${input("a5","What information should be displayed to the approver in Red?","textarea",{full:true,required:true,placeholder:"Request number, requester, amount, project, date, status, etc."})}
      ${choices("a6","What action should the user be able to perform?",["Approve","Reject","Skip","Other"],true)}
      ${input("a7","How many reminders should Red send?","select",{required:true,options:["No reminder","1 reminder — 7 days after initial notification","2 reminders — both during Week 1","2 reminders — one during Week 1 and one during Week 2"]})}
      ${input("a8","Approval notification template","textarea",{full:true,required:true,placeholder:"Paste notification copy or describe the expected template."})}
    </div><div class="conditional-note">Daily alerts/reminders are not supported because they may negatively impact the user experience.</div>`;
  } else if(t==="alert"){
    specificTitle.textContent="Alert / notification requirements";specificSubtitle.textContent="Define recipients, triggers, notification type, and templates.";
    html=`<div class="grid two">
      ${input("b1","How are notifications managed today?","textarea",{full:true,required:true})}
      ${input("b2","Who should receive the notification?","textarea",{required:true})}
      ${input("b3","What event should trigger the notification?","textarea",{required:true})}
      ${input("b4","How many notifications are sent/received monthly?","number",{required:true})}
      <div class="field full"><label>Is this notification? <em>*</em></label><div class="choice-group"><label class="choice"><input id="b5_proactive" type="checkbox" name="b5" value="Proactive notification"><span>Proactive notification</span></label><label class="choice"><input id="b5_reminder" type="checkbox" name="b5" value="Reminder notification"><span>Reminder notification</span></label></div></div>
    </div>
    <div id="proactiveFields" class="question-block hidden"><div class="question-title">Proactive notification details</div><div class="grid two">
      ${input("b6","Who should receive the proactive notification?","text",{required:true})}
      ${input("b7","What event triggers the proactive notification?","textarea",{required:true})}
      ${input("b8","What information should be included?","textarea",{required:true})}
      ${input("b9","Proactive notification template","textarea",{full:true,required:true})}
    </div></div>
    <div id="reminderFields" class="question-block hidden"><div class="question-title">Reminder notification details</div><div class="grid two">
      ${input("b10","What triggers the reminder?","textarea",{required:true})}
      ${input("b11","What time should the reminder be sent?","time",{required:true})}
      ${input("b12","Who should receive the reminder?","text",{required:true})}
      ${input("b13","Reminder notification template","textarea",{full:true,required:true})}
    </div></div>`;
  } else if(t==="query"){
    specificTitle.textContent="Business query / fetch & display";specificSubtitle.textContent="Define what users ask, what Red retrieves, and how results should appear.";
    html=`<div class="grid two">
      ${input("c1","What information should users be able to retrieve from Red?","textarea",{full:true,required:true})}
      ${input("c2","What application/system contains this information?","text",{required:true})}
      ${input("c3","What should trigger the Red conversation?","textarea",{required:true})}
      ${input("c4","7–10 example questions users may ask Red","textarea",{full:true,large:true,required:true,placeholder:"Enter one question/utterance per line. Example: Show my pending approvals."})}
      ${input("c5","What data should Red retrieve?","textarea",{full:true,required:true})}
      ${input("c6","What fields should Red display to the user?","textarea",{required:true})}
      ${input("c7","How should the information be displayed?","select",{required:true,options:["Simple response","List","Table","Cards","Summary + details","Other"]})}
      ${input("c8","Expected Red response / mockup","textarea",{full:true,required:true})}
      ${input("c9","Does this require Labor Employee Relations (LER) approval?","select",{required:true,options:["Yes","No","Not sure"]})}
    </div>`;
  } else if(t==="guided"){
    specificTitle.textContent="Guided Path requirements";specificSubtitle.textContent="Define the questions, sequence, and any external redirection.";
    html=`<div class="grid two">
      ${input("d1","What process should the Guided Path help the user complete?","textarea",{full:true,required:true})}
      ${input("d2","Approximately how many questions will the user need to answer?","number",{required:true})}
      ${input("d3","What questions should Red ask the user?","textarea",{full:true,large:true,required:true,placeholder:"List expected questions in sequence if known."})}
      ${input("d4","Does the user need to be redirected outside Red?","select",{required:true,options:["Yes","No","Not sure"]})}
    </div>
    <div id="guidedRedirect" class="question-block hidden"><div class="question-title">External redirection details</div><div class="grid two">
      ${input("d5","Which application should the user be redirected to?","text",{required:true})}
      ${input("d6","Why does the user need to leave the Red conversation?","textarea",{required:true})}
      ${input("d7","What information should Red pass to the external application/form?","textarea",{full:true,required:true})}
    </div></div>`;
  } else if(t==="enhancement"){
    specificTitle.textContent="Existing Red capability / enhancement";specificSubtitle.textContent="Tell us what exists today and exactly what should change.";
    html=`<div class="grid two">
      ${input("e1","What existing Red capability needs to be enhanced?","text",{required:true})}
      ${input("e2","Conversation ID / Process ID / Action ID","text")}
      ${input("e3","What does the existing Red capability do today?","textarea",{full:true,required:true})}
      ${input("e4","3–5 example questions/utterances currently used to trigger it","textarea",{full:true,required:true,placeholder:"Enter one utterance per line."})}
      ${choices("e5","What specifically needs to change?",["Trigger / utterances","Conversation flow","Questions","API","API parameters","API response","Data displayed","Response format","Notification","Reminder","Approval logic","User experience","Other"],true)}
      ${input("e6","Describe the required changes in detail","textarea",{full:true,large:true,required:true,placeholder:"What needs to change, where it needs to change, and when the new behavior should occur."})}
      ${input("e7","Expected result after the enhancement","textarea",{full:true,required:true})}
    </div>`;
  }
  specificFields.innerHTML=html;
  bindConditionalFields();
}
function bindConditionalFields(){
  document.querySelectorAll('input[name="b5"]').forEach(e=>e.addEventListener("change",updateAlert));
  const d4=document.getElementById("d4"); if(d4)d4.addEventListener("change",updateGuided);
  updateAlert();updateGuided();
}
function updateAlert(){
  const p=document.getElementById("proactiveFields"),r=document.getElementById("reminderFields"); if(!p||!r)return;
  const ps=document.getElementById("b5_proactive")?.checked, rs=document.getElementById("b5_reminder")?.checked;
  p.classList.toggle("hidden",!ps);r.classList.toggle("hidden",!rs);
}
function updateGuided(){
  const d=document.getElementById("guidedRedirect"); if(!d)return;
  const yes=document.getElementById("d4")?.value==="Yes";d.classList.toggle("hidden",!yes);
}
function renderNav(){
  stepNav.innerHTML=steps.map((s,i)=>`<div class="step ${i===current?"active":""} ${i<current?"done":""}" data-i="${i}"><span class="circle">${i<current?"✓":i+1}</span><span>${s}</span></div>`).join("");
  stepNav.querySelectorAll(".step").forEach(el=>el.onclick=()=>{const i=+el.dataset.i;if(i<=current+1){current=i;render();if(i===8)buildReview()}});
}
function render(){
  sections.forEach((s,i)=>s.classList.toggle("active",i===current));
  renderNav();document.getElementById("backBtn").disabled=current===0;
  document.getElementById("nextBtn").textContent=current===sections.length-1?"Submit":"Next";
  validation.textContent="";window.scrollTo({top:0,behavior:"smooth"});
}
function checkCurrent(){
  const required=[...sections[current].querySelectorAll("[required]")].filter(x=>!x.closest(".hidden"));
  for(const el of required){
    if(!String(el.value||"").trim()){validation.textContent="Please complete: "+(el.previousElementSibling?.innerText||"Required field");el.focus();return false}
  }
  if(current===3){
    const t=solutionType.value;
    if(t==="alert"&&!document.querySelector('input[name="b5"]:checked')){validation.textContent="Please select Proactive notification, Reminder notification, or both.";return false}
    if(t==="query"){
      const lines=document.getElementById("c4").value.split(/\n+/).map(x=>x.trim()).filter(Boolean);
      if(lines.length<7||lines.length>10){validation.textContent=`Please provide 7–10 example user questions/utterances. You currently have ${lines.length}.`;document.getElementById("c4").focus();return false}
    }
    if(t==="enhancement"){
      const lines=document.getElementById("e4").value.split(/\n+/).map(x=>x.trim()).filter(Boolean);
      if(lines.length<3||lines.length>5){validation.textContent=`Please provide 3–5 existing utterances. You currently have ${lines.length}.`;document.getElementById("e4").focus();return false}
      if(!document.querySelector('input[name="e5"]:checked')){validation.textContent="Please select at least one type of enhancement.";return false}
    }
  }
  if(current===4 && apiAvailable.value==="Yes"){
    if(!document.getElementById("apiCount").value||!document.getElementById("apiInfo").value.trim()||!document.getElementById("wrapper").value){validation.textContent="Please complete the required API and APIGEE fields.";return false}
  }
  if(current===5 && apiAvailable.value==="Yes"){
    for(const id of ["techName","techEmail","techAvailable"]){const e=document.getElementById(id);if(!e.value.trim()){validation.textContent="Please provide the technical owner details because API integration is required.";e.focus();return false}}
  }
  return true;
}
function valuesBySection(){
  const out=[];document.querySelectorAll(".form-section").forEach(sec=>{
    sec.querySelectorAll("input,select,textarea").forEach(e=>{
      if(!e.id)return;
      if(e.type==="file")return;
      if(e.type==="checkbox"){if(!e.checked)return;out.push([e.name||e.id,e.value]);}
      else out.push([e.id,e.value]);
    });
  });return out;
}
function get(id){const e=document.getElementById(id);return e?e.value||"—":"—"}
function checked(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e=>e.value).join(", ")||"—"}
function addReview(title,pairs){
  const h=`<div class="review-item review-section-title">${esc(title)}</div>`;
  return h+pairs.map(([a,b])=>`<div class="review-item"><div class="label">${esc(a)}</div><div class="value">${esc(b)}</div></div>`).join("");
}
function buildReview(){
  let html=addReview("Solution & business",[
    ["Solution type",solutionType.options[solutionType.selectedIndex]?.text||"—"],["Business reason",get("businessReason")],["Target audience",get("audience")],["Users impacted",get("users")],["Monthly incidents / requests",get("incidents")],["Monthly approvals",get("approvalsMonthly")],["Application / system",get("application")],["Current data location",get("dataStore")]
  ]);
  html+=addReview("Current & future process",[["Current process",get("currentProcess")],["Future-state process",get("futureProcess")]]);
  const t=solutionType.value;
  if(t==="approval")html+=addReview("Approval",[
    ["How approvals are managed",get("a1")],["Approval flow",get("a2")],["Approval levels",get("a3")],["Approvers",get("a4")],["Approver information",get("a5")],["Actions",checked("a6")],["Reminder",get("a7")],["Notification template",get("a8")]
  ]);
  if(t==="alert")html+=addReview("Alert / notification",[
    ["Current notification management",get("b1")],["Recipients",get("b2")],["Trigger",get("b3")],["Monthly volume",get("b4")],["Notification type",checked("b5")],["Proactive recipient",get("b6")],["Proactive trigger",get("b7")],["Proactive information",get("b8")],["Proactive template",get("b9")],["Reminder trigger",get("b10")],["Reminder time",get("b11")],["Reminder recipient",get("b12")],["Reminder template",get("b13")]
  ]);
  if(t==="query")html+=addReview("Business query",[
    ["Information retrieved",get("c1")],["Source system",get("c2")],["Conversation trigger",get("c3")],["Example utterances",get("c4")],["Data retrieved",get("c5")],["Displayed fields",get("c6")],["Display format",get("c7")],["Expected response / mockup",get("c8")],["LER approval",get("c9")]
  ]);
  if(t==="guided")html+=addReview("Guided Path",[
    ["Process",get("d1")],["Approximate questions",get("d2")],["Questions in sequence",get("d3")],["Redirect outside Red",get("d4")],["Target application",get("d5")],["Reason for leaving Red",get("d6")],["Data passed",get("d7")]
  ]);
  if(t==="enhancement")html+=addReview("Enhancement",[
    ["Existing capability",get("e1")],["Existing ID",get("e2")],["Current behavior",get("e3")],["Existing utterances",get("e4")],["Changes",checked("e5")],["Detailed changes",get("e6")],["Expected result",get("e7")]
  ]);
  html+=addReview("API & technical owner",[
    ["API available",get("apiAvailable")],["API count",get("apiCount")],["API details",get("apiInfo")],["APIGEE / wrapper",get("wrapper")],["Wrapper details",get("wrapperInfo")],["Requirements from Red",get("redNeeds")],["Technical owner",get("techName")],["Technical email",get("techEmail")],["Team / role",get("techTeam")],["Owner available",get("techAvailable")]
  ]);
  html+=addReview("Security & project",[
    ["Security / data constraints",get("security")],["Sponsor",get("sponsor")],["ServiceNow service",get("service")],["Project contacts",get("contacts")],["Benefit type",get("benefitType")],["Expected benefit amount",get("benefitAmount")],["Current metrics",get("metrics")],["Additional information",get("additional")]
  ]);
  document.getElementById("reviewSummary").innerHTML=html;
}
function saveDraft(){
  localStorage.setItem(DRAFT_KEY,JSON.stringify({solution:solutionType.value,fields:valuesBySection()}));showToast("Draft saved locally in this browser.");
}
function loadDraft(){
  try{
    const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!d)return;
    if(d.solution)solutionType.value=d.solution;buildSpecific();
    (d.fields||[]).forEach(([id,val])=>{
      const matches=[...document.querySelectorAll(`[id="${CSS.escape(id)}"]`)];
      const e=matches[0]||document.querySelector(`[name="${CSS.escape(id)}"]`);
      if(e)e.value=val;
      else{const cb=[...document.querySelectorAll(`input[name="${CSS.escape(id)}"]`)].find(x=>x.value===val);if(cb)cb.checked=true}
    });
    updateAlert();updateGuided();updateApi();updateTechRequirement();
  }catch(e){console.warn(e)}
}
function clearDraft(){
  localStorage.removeItem(DRAFT_KEY);document.getElementById("pifForm").reset();solutionType.value="";buildSpecific();updateApi();updateTechRequirement();current=0;render();showToast("Draft cleared.");
}
function updateApi(){const yes=apiAvailable.value==="Yes";apiDetails.classList.toggle("hidden",!yes);updateTechRequirement()}
function updateTechRequirement(){
  const required=apiAvailable.value==="Yes";
  ["techName","techEmail","techAvailable"].forEach(id=>{const e=document.getElementById(id);if(e)e.required=required});
  ["techRequiredMark","techEmailRequiredMark","techAvailableRequiredMark"].forEach(id=>document.getElementById(id)?.classList.toggle("hidden",!required));
}
function showToast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2600)}
solutionType.addEventListener("change",()=>{buildSpecific();const h=document.getElementById("solutionHint");h.classList.toggle("hidden",!solutionType.value);h.textContent=solutionType.value?"The solution-specific questions have been updated for your selection.":"Select a solution to continue."});
apiAvailable.addEventListener("change",updateApi);
document.getElementById("backBtn").onclick=()=>{if(current>0){current--;render()}};
document.getElementById("nextBtn").onclick=()=>{
  if(current<sections.length-1){if(!checkCurrent())return;current++;if(current===8)buildReview();render()}
  else{if(!checkCurrent())return;showToast("Requirement submitted successfully — prototype only. No ServiceNow record was created.")}
};
document.getElementById("saveBtn").onclick=saveDraft;
document.getElementById("clearBtn").onclick=clearDraft;
["currentDoc","futureDoc","techDocs"].forEach(id=>document.getElementById(id)?.addEventListener("change",e=>{
  const target=document.getElementById(id+"Names");if(target)target.textContent=[...e.target.files].map(f=>f.name).join("\n")||"";
}));
buildSpecific();loadDraft();updateApi();render();