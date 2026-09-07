const $=id=>document.getElementById(id);

const REQUIRED_COMMON={
  business:["businessReason","audience","users","application"],
  process:["currentProcess","futureProcess"]
};

function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function val(id){const e=$(id);return e?String(e.value||"").trim():""}
function checked(name){return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e=>e.value).join(", ")||"—"}
function nonEmpty(ids){return ids.every(id=>val(id))}
function show(id){$(id)?.classList.add("visible")}
function hide(id){$(id)?.classList.remove("visible")}
function reveal(id){$(id)?.classList.remove("hidden")}
function conceal(id){$(id)?.classList.add("hidden")}
function input(id,label,type="text",o={}){
 const star=o.required?"<em>*</em>":"",req=o.required?"required":"",cls=o.full?"field full":"field";
 if(type==="textarea")return `<div class="${cls}"><label for="${id}">${label} ${star}</label><textarea id="${id}" class="${o.large?"large":""}" ${req} placeholder="${esc(o.placeholder||"")}"></textarea></div>`;
 if(type==="select")return `<div class="${cls}"><label for="${id}">${label} ${star}</label><select id="${id}" ${req}><option value="">Select</option>${o.options.map(x=>`<option>${esc(x)}</option>`).join("")}</select></div>`;
 return `<div class="${cls}"><label for="${id}">${label} ${star}</label><input id="${id}" type="${type}" ${req} placeholder="${esc(o.placeholder||"")}"></div>`;
}
function choices(name,label,items,required=false){
 return `<div class="field full"><label>${label} ${required?"<em>*</em>":""}</label><div class="choice-group">${items.map(x=>`<label class="choice"><input type="checkbox" name="${name}" value="${esc(x)}"><span>${esc(x)}</span></label>`).join("")}</div></div>`;
}
function buttonPreview(items){return `<div class="button-preview"><div class="button-preview-title">Suggested Red action buttons</div><div class="preview-actions">${items.map((x,i)=>`<span class="preview-btn ${i===0?"primary":""}">${esc(x)}</span>`).join("")}</div></div>`}

function utteranceCount(id){return val(id).split(/\n+/).map(x=>x.trim()).filter(Boolean).length}
function exactRange(id,min,max){const n=utteranceCount(id);return n>=min&&n<=max}

function buildSpecific(){
  const t=$("solutionType").value;
  const root=$("specificFields");
  root.innerHTML="";
  $("specificTitle").textContent="Solution-specific requirements";
  $("specificSubtitle").textContent="";
  if(!t)return;

  if(t==="approval"){
    $("specificTitle").textContent="Approval requirements";
    $("specificSubtitle").textContent="Approval workflow, source system, approver actions, proactive notification and reminder requirements.";
    root.innerHTML=`<div class="grid two">
      ${input("a1","How are approvals managed today?","textarea",{full:true,required:true})}
      ${input("a2","Which system currently owns the approval workflow?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or another application"})}
      ${input("a3","What is the current approval flow?","textarea",{full:true,large:true,required:true})}
      ${input("a4","How many approval levels are required?","number",{required:true})}
      ${input("a5","Who are the approvers?","textarea",{required:true})}
      ${input("a6","What information should be displayed to the approver in Red?","textarea",{full:true,required:true})}
      ${choices("a7","What actions should the approver be able to perform?",["Approve","Reject","Skip","Send Back / Return","Request Information","Other"],true)}
      ${input("a8","What should happen in the source system after each approval action?","textarea",{full:true,required:true,placeholder:"For example: update ServiceNow record, update SAP transaction, update ETR status."})}
    </div>
    <div class="question-block"><div class="question-title">Proactive approval notification</div><div class="grid two">
      ${input("a9","Should Red send a proactive approval notification?","select",{required:true,options:["Yes","No","Not sure"]})}
      ${input("a10","Who should receive it?","textarea",{required:true})}
      ${input("a11","What triggers it?","textarea",{required:true})}
      ${input("a12","What information should be included?","textarea",{required:true})}
      ${input("a13","Proactive notification template","textarea",{full:true,required:true})}
    </div></div>
    <div class="question-block"><div class="question-title">Approval reminders</div><div class="grid two">
      ${input("a14","Reminder requirement","select",{required:true,options:["No reminder","1 reminder — 7 days after initial notification","2 reminders — both during Week 1","2 reminders — one during Week 1 and one during Week 2","Not sure"]})}
      ${input("a15","Who should receive reminders?","textarea")}
      ${input("a16","What event/date starts the reminder schedule?","textarea")}
      ${input("a17","Reminder notification template","textarea",{full:true})}
    </div><div class="conditional-note">Daily approval reminders are not supported in this prototype.</div></div>
    ${buttonPreview(["Approve","Reject","More details"])}`;
  }

  if(t==="alert"){
    $("specificTitle").textContent="Alert / Notification requirements";
    $("specificSubtitle").textContent="Choose Proactive, Reminder, or Both. Only the corresponding detail questions appear.";
    root.innerHTML=`<div class="grid two">
      ${input("b1","How are notifications managed today?","textarea",{full:true,required:true})}
      ${input("b2","Which system/event generates the notification?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, or another system"})}
      ${input("b3","Who should receive the notification?","textarea",{required:true})}
      ${input("b4","What event should trigger it?","textarea",{required:true})}
      ${input("b5","Monthly notification volume","number",{required:true})}
      ${choices("b6","Which notification type is required?",["Proactive notification","Reminder notification"],true)}
    </div>
    <div id="proactiveFields" class="question-block hidden"><div class="question-title">Proactive notification details</div><div class="grid two">
      ${input("b7","Proactive recipient","textarea",{required:true})}
      ${input("b8","Proactive trigger","textarea",{required:true})}
      ${input("b9","Information included","textarea",{required:true})}
      ${input("b10","Proactive notification template","textarea",{full:true,required:true})}
    </div></div>
    <div id="reminderFields" class="question-block hidden"><div class="question-title">Reminder details</div><div class="grid two">
      ${input("b11","Reminder trigger","textarea",{required:true})}
      ${input("b12","Reminder schedule / time","textarea",{required:true})}
      ${input("b13","Reminder recipient","textarea",{required:true})}
      ${input("b14","Reminder notification template","textarea",{full:true,required:true})}
    </div></div>`;
    document.querySelectorAll('input[name="b6"]').forEach(x=>x.addEventListener("change",updateAlert));
    updateAlert();
  }

  if(t==="query"){
    $("specificTitle").textContent="Business Query / Fetch & Display";
    $("specificSubtitle").textContent="Capture the user's utterances, source data, display format and optional action buttons.";
    root.innerHTML=`<div class="grid two">
      ${input("c1","What information should users retrieve from Red?","textarea",{full:true,required:true})}
      ${input("c2","Which source system contains the information?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, other third party"})}
      ${input("c3","What should trigger the Red conversation?","textarea",{required:true})}
      ${input("c4","7–10 example user questions / utterances","textarea",{full:true,large:true,required:true,placeholder:"Enter one utterance per line. Minimum 7, maximum 10."})}
      ${input("c5","What data should Red retrieve?","textarea",{full:true,required:true})}
      ${input("c6","What fields should Red display?","textarea",{required:true})}
      ${input("c7","How should information be displayed?","select",{required:true,options:["Simple response","List","Table","Cards","Summary + details","Other"]})}
      ${input("c8","Should users be able to perform an action from the result?","select",{required:true,options:["Yes","No","Not sure"]})}
      ${choices("c9","Which action buttons may be required?",["View Details","Open Record","Approve","Reject","Submit","Retry","Refresh","Back","Cancel","Other"])}
      ${input("c10","Expected response / mockup","textarea",{full:true,required:true})}
      ${input("c11","Does this require LER approval?","select",{required:true,options:["Yes","No","Not sure"]})}
    </div>`;
  }

  if(t==="guided"){
    $("specificTitle").textContent="Guided Path requirements";
    $("specificSubtitle").textContent="Capture the sequence and show external handoff questions only if the user needs to leave Red.";
    root.innerHTML=`<div class="grid two">
      ${input("d1","What process should the Guided Path help complete?","textarea",{full:true,required:true})}
      ${input("d2","Approximately how many questions?","number",{required:true})}
      ${input("d3","What questions should Red ask, in sequence?","textarea",{full:true,large:true,required:true})}
      ${input("d4","Does the user need to be redirected outside Red?","select",{required:true,options:["Yes","No","Not sure"]})}
      ${input("d8","What should the final Red button/action be?","text",{required:true,placeholder:"Submit, Create Request, Continue, etc."})}
    </div>
    <div id="guidedRedirect" class="question-block hidden"><div class="question-title">External application handoff</div><div class="grid two">
      ${input("d5","Target application","text",{required:true,placeholder:"ServiceNow, SAP, ETR, etc."})}
      ${input("d6","Why does the user need to leave Red?","textarea",{required:true})}
      ${input("d7","What data should Red pass to the external application?","textarea",{full:true,required:true})}
    </div></div>`;
    $("d4").addEventListener("change",updateGuided);
  }

  if(t==="enhancement"){
    $("specificTitle").textContent="Existing Red capability / enhancement";
    $("specificSubtitle").textContent="Capture the existing capability, current behavior, affected system and every planned change.";
    root.innerHTML=`<div class="grid two">
      ${input("e1","What existing Red capability needs enhancement?","text",{required:true})}
      ${input("e2","Conversation ID / Process ID / Action ID","text")}
      ${input("e3","What does it do today?","textarea",{full:true,required:true})}
      ${input("e4","3–5 existing trigger questions / utterances","textarea",{full:true,required:true,placeholder:"One utterance per line. Minimum 3, maximum 5."})}
      ${choices("e5","What specifically needs to change?",["Trigger / utterances","Conversation flow","Questions","API","API parameters","API response","Data displayed","Response format","Notification","Reminder","Approval logic","Buttons / actions","UX","Other"],true)}
      ${input("e6","Which application/system is affected?","text",{required:true,placeholder:"ServiceNow, SAP, ETR, other"})}
      ${input("e7","Describe the required changes","textarea",{full:true,large:true,required:true})}
      ${input("e8","Expected result / mockup","textarea",{full:true,required:true})}
    </div>`;
  }
}

function updateAlert(){
  const p=$("proactiveFields"),r=$("reminderFields");
  if(!p||!r)return;
  const ps=document.querySelector('input[name="b6"][value="Proactive notification"]')?.checked;
  const rs=document.querySelector('input[name="b6"][value="Reminder notification"]')?.checked;
  p.classList.toggle("hidden",!ps); r.classList.toggle("hidden",!rs);
  setReq(["b7","b8","b9","b10"],ps);
  setReq(["b11","b12","b13","b14"],rs);
}

function updateGuided(){
  const yes=$("d4")?.value==="Yes";
  $("guidedRedirect")?.classList.toggle("hidden",!yes);
  setReq(["d5","d6","d7"],yes);
}

function setReq(ids,on){
  ids.forEach(id=>{const e=$(id);if(e)e.required=!!on});
}

function buildMethodFields(){
  const root=$("methodDetails");
  root.innerHTML="";
  const n=$("methodCount").value;
  if(!n||n==="unknown")return;
  const count=n==="5+"?6:Number(n);
  for(let i=1;i<=count;i++){
    root.insertAdjacentHTML("beforeend",`
      <div class="method-card">
        <div class="method-head"><strong>API Method ${i}${i===6?" (additional methods) ":""}</strong><span>Capture method-level details</span></div>
        <div class="grid two">
          ${input(`m${i}_name`,"Method / operation name","text",{required:true,placeholder:"e.g. Get Approval, Create Request"})}
          ${input(`m${i}_verb`,"HTTP method","select",{required:true,options:["GET","POST","PUT","PATCH","DELETE","Other"]})}
          ${input(`m${i}_endpoint`,"Endpoint / resource URL","url",{required:true,placeholder:"https://..."})}
          ${input(`m${i}_purpose`,"Purpose of this method","textarea",{required:true})}
          ${input(`m${i}_params`,"Path / query parameters","textarea",{full:true})}
          ${input(`m${i}_body`,"Request body / payload","textarea",{full:true,large:true})}
          ${input(`m${i}_response`,"Expected response / fields","textarea",{full:true,large:true})}
          ${input(`m${i}_errors`,"Method-specific errors","textarea",{full:true})}
        </div>
      </div>`);
  }
}

function updateIntegration(){
  const choice=$("integrationRequired").value;
  const yes=choice==="Yes";
  $("integrationDetails").classList.toggle("hidden",!yes);
  if(!yes){
    $("methodDetails").innerHTML="";
    setReq(["systemType","systemName","methodCount","auth"],false);
    updateTechnical(false);
    return;
  }
  setReq(["systemType","systemName","methodCount","auth"],true);
  updateTechnical(true);
  updatePostman();
  updateWrapper();
}

function updatePostman(){
  const yes=$("postmanAvailable")?.value==="Yes";
  $("postmanUploadWrap")?.classList.toggle("hidden",!yes);
  const f=$("postmanFile");if(f)f.required=yes;
}
function updateApiDocs(){
  const yes=$("apiDocsAvailable")?.value==="Yes";
  $("apiDocsUploadWrap")?.classList.toggle("hidden",!yes);
}
function updateWrapper(){
  const s=$("wrapperStatus")?.value;
  const exists=s==="exists"||s==="external";
  $("wrapperLinkWrap")?.classList.toggle("hidden",!exists);
  $("wrapperDetailsWrap")?.classList.toggle("hidden",!exists);
  $("wrapperCreateWrap")?.classList.toggle("hidden",s!=="create");
  $("wrapperUnknownWrap")?.classList.toggle("hidden",s!=="unknown");
  setReq(["wrapperLink","wrapperDetails"],exists);
  setReq(["wrapperCreateAction"],s==="create");
  setReq(["wrapperUnknownAction"],s==="unknown");
}

function updateTechnical(required){
  show("technicalSection");
  ["techName","techEmail","techAvailable"].forEach(id=>{const e=$(id);if(e)e.required=required});
  ["techNameStar","techEmailStar","techAvailableStar"].forEach(id=>$(id)?.classList.toggle("hidden",!required));
}

function specificReady(){
  const t=$("solutionType").value;
  if(t==="approval")return nonEmpty(["a1","a2","a3","a4","a5","a6","a8","a9","a10","a11","a12","a13","a14"])&&!!document.querySelector('input[name="a7"]:checked');
  if(t==="alert"){
    const base=nonEmpty(["b1","b2","b3","b4","b5"])&&!!document.querySelector('input[name="b6"]:checked');
    const ps=document.querySelector('input[name="b6"][value="Proactive notification"]')?.checked;
    const rs=document.querySelector('input[name="b6"][value="Reminder notification"]')?.checked;
    return base&&(!ps||nonEmpty(["b7","b8","b9","b10"]))&&(!rs||nonEmpty(["b11","b12","b13","b14"]));
  }
  if(t==="query")return nonEmpty(["c1","c2","c3","c5","c6","c7","c8","c10","c11"])&&exactRange("c4",7,10);
  if(t==="guided")return nonEmpty(["d1","d2","d3","d4","d8"])&&($("d4").value!=="Yes"||nonEmpty(["d5","d6","d7"]));
  if(t==="enhancement")return nonEmpty(["e1","e3","e6","e7","e8"])&&exactRange("e4",3,5)&&!!document.querySelector('input[name="e5"]:checked');
  return false;
}

function integrationReady(){
  const x=$("integrationRequired").value;
  if(!x)return false;
  if(x!=="Yes")return true;
  if(!nonEmpty(["systemType","systemName","methodCount","auth","techName","techEmail","techAvailable"]))return false;
  const n=$("methodCount").value;
  if(n&&n!=="unknown"){
    const count=n==="5+"?6:Number(n);
    for(let i=1;i<=count;i++)if(!nonEmpty([`m${i}_name`,`m${i}_verb`,`m${i}_endpoint`,`m${i}_purpose`]))return false;
  }
  const ps=$("postmanAvailable").value;
  if(!ps)return false;
  if(ps==="Yes"&&!$("postmanFile").files.length)return false;
  const ws=$("wrapperStatus").value;
  if(!ws)return false;
  if(ws==="exists"||ws==="external"){if(!nonEmpty(["wrapperLink","wrapperDetails"]))return false}
  if(ws==="create"&&!nonEmpty(["wrapperCreateAction"]))return false;
  if(ws==="unknown"&&!nonEmpty(["wrapperUnknownAction"]))return false;
  return true;
}

function securityReady(){
  return nonEmpty(["sensitiveData","access"]);
}

function projectHasInput(){
  return ["sponsor","service","contacts","benefitType","benefitAmount","metrics","additional"].some(val);
}

function refreshFlow(){
  if(val("solutionType"))show("businessSection");else return updateProgress();
  if(nonEmpty(REQUIRED_COMMON.business))show("processSection");else return updateProgress();
  if(nonEmpty(REQUIRED_COMMON.process))show("specificSection");else return updateProgress();
  if(specificReady())show("integrationSection");else return updateProgress();
  if(val("integrationRequired")){
    show("technicalSection");
    show("securitySection");
    if(integrationReady()&&securityReady())show("projectSection");else return updateProgress();
  }
  if(val("integrationRequired")==="No"||val("integrationRequired")==="Not sure"){
    show("securitySection");
    if(securityReady())show("projectSection");else return updateProgress();
  }
  if(document.getElementById("projectSection").classList.contains("visible")){
    if(projectHasInput())show("reviewSection");
  }
  if(document.getElementById("reviewSection").classList.contains("visible"))buildReview();
  updateProgress();
}

function updateProgress(){
  const sections=["solutionSection","businessSection","processSection","specificSection","integrationSection","technicalSection","securitySection","projectSection","reviewSection"];
  const count=sections.filter(id=>$(id)?.classList.contains("visible")).length;
  const pct=Math.max(8,Math.round(count/9*100));
  $("progressBar").style.width=pct+"%";
  $("progressPercent").textContent=pct+"%";
  $("progressLabel").textContent=count>=9?"Ready to review and submit":`Section ${count} of 9 is available`;
}

function sectionReview(title,pairs){
  return `<div class="review-item review-section-title">${esc(title)}</div>`+
    pairs.map(([a,b])=>`<div class="review-item"><div class="label">${esc(a)}</div><div class="value">${esc(b||"—")}</div></div>`).join("");
}
function buildReview(){
  let h=sectionReview("Solution & business",[
    ["Solution type",$("solutionType").selectedOptions[0]?.text],
    ["Business reason",val("businessReason")],["Users",val("audience")],["Users impacted",val("users")],
    ["Monthly incidents",val("incidents")],["Monthly approvals",val("approvalsMonthly")],["Application",val("application")],["Data location",val("dataStore")]
  ]);
  h+=sectionReview("Current & future process",[["Current process",val("currentProcess")],["Future state",val("futureProcess")]]);
  const t=$("solutionType").value;
  if(t==="approval")h+=sectionReview("Approval",[
    ["Approval system",val("a2")],["Approval flow",val("a3")],["Levels",val("a4")],["Approvers",val("a5")],
    ["Approver information",val("a6")],["Actions",checked("a7")],["Source-system outcome",val("a8")],
    ["Proactive",val("a9")],["Proactive recipients",val("a10")],["Proactive trigger",val("a11")],
    ["Proactive information",val("a12")],["Proactive template",val("a13")],["Reminder",val("a14")],
    ["Reminder recipients",val("a15")],["Reminder start",val("a16")],["Reminder template",val("a17")]
  ]);
  if(t==="alert")h+=sectionReview("Alert / notification",[
    ["Source",val("b2")],["Recipients",val("b3")],["Trigger",val("b4")],["Monthly volume",val("b5")],
    ["Type",checked("b6")],["Proactive recipient",val("b7")],["Proactive trigger",val("b8")],["Proactive info",val("b9")],
    ["Proactive template",val("b10")],["Reminder trigger",val("b11")],["Reminder schedule",val("b12")],
    ["Reminder recipient",val("b13")],["Reminder template",val("b14")]
  ]);
  if(t==="query")h+=sectionReview("Business query",[
    ["Source",val("c2")],["Information",val("c1")],["Trigger",val("c3")],["Utterances",val("c4")],
    ["Data retrieved",val("c5")],["Displayed fields",val("c6")],["Format",val("c7")],["Action",val("c8")],
    ["Buttons",checked("c9")],["Expected response",val("c10")],["LER",val("c11")]
  ]);
  if(t==="guided")h+=sectionReview("Guided Path",[
    ["Process",val("d1")],["Question sequence",val("d3")],["Redirect",val("d4")],
    ["Target app",val("d5")],["Reason",val("d6")],["Data passed",val("d7")],["Final button",val("d8")]
  ]);
  if(t==="enhancement")h+=sectionReview("Enhancement",[
    ["Capability",val("e1")],["Existing ID",val("e2")],["Current behavior",val("e3")],["Utterances",val("e4")],
    ["Changes",checked("e5")],["Affected system",val("e6")],["Required changes",val("e7")],["Expected result",val("e8")]
  ]);
  let methods="";
  const n=$("methodCount")?.value;
  if(n&&n!=="unknown"){
    const count=n==="5+"?6:Number(n);
    for(let i=1;i<=count;i++)methods+=`Method ${i}: ${val(`m${i}_verb`)} ${val(`m${i}_name`)} — ${val(`m${i}_endpoint`)}`;
  }
  h+=sectionReview("Integration & API",[
    ["Integration",val("integrationRequired")],["System type",val("systemType")],["System",val("systemName")],
    ["Integration actions",checked("integrationDirection")],["Planned methods",val("methodCount")],["Method details",methods||"—"],
    ["Postman",val("postmanAvailable")],["API documentation",val("apiDocsAvailable")],["APIGEE/wrapper status",val("wrapperStatus")],
    ["Wrapper URL",val("wrapperLink")],["Wrapper details",val("wrapperDetails")],["Wrapper creation plan",val("wrapperCreateAction")],
    ["Authentication",val("auth")],["Headers",val("headers")],["Environment",val("environment")],
    ["Sample request",val("requestPayload")],["Sample response",val("responsePayload")],["Errors",val("errorHandling")],
    ["Needs from application/team",val("systemTeamNeeds")],["Technical owner",val("techName")],["Technical email",val("techEmail")],["Team/role",val("techTeam")]
  ]);
  h+=sectionReview("Security & project",[
    ["Sensitive data",val("sensitiveData")],["Access",val("access")],["Security/data constraints",val("security")],
    ["Sponsor",val("sponsor")],["ServiceNow service",val("service")],["Project contacts",val("contacts")],
    ["Benefit type",val("benefitType")],["Expected benefit amount",val("benefitAmount")],["Metrics",val("metrics")],["Additional",val("additional")]
  ]);
  $("reviewSummary").innerHTML=h;
}

function fileNames(inputId,targetId){
  $(inputId)?.addEventListener("change",e=>{$(targetId).textContent=[...e.target.files].map(f=>f.name).join("\n")||"";});
}
function showToast(text){const x=$("toast");x.textContent=text;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),3000)}

$("solutionType").addEventListener("change",()=>{buildSpecific();refreshFlow();$("businessSection").scrollIntoView({behavior:"smooth",block:"start"})});
$("integrationRequired").addEventListener("change",()=>{updateIntegration();refreshFlow()});
$("methodCount").addEventListener("change",()=>{buildMethodFields();refreshFlow()});
$("postmanAvailable").addEventListener("change",()=>{updatePostman();refreshFlow()});
$("apiDocsAvailable").addEventListener("change",updateApiDocs);
$("wrapperStatus").addEventListener("change",()=>{updateWrapper();refreshFlow()});

document.addEventListener("input",()=>{refreshFlow()});
document.addEventListener("change",()=>{refreshFlow()});

fileNames("currentDoc","currentDocNames");
fileNames("futureDoc","futureDocNames");
fileNames("postmanFile","postmanFileNames");
fileNames("apiDocsFile","apiDocsFileNames");
fileNames("techDocs","techDocsNames");

$("submitBtn").addEventListener("click",()=>{
  refreshFlow();
  const firstInvalid=document.querySelector("#pifForm :invalid");
  if(firstInvalid){
    firstInvalid.scrollIntoView({behavior:"smooth",block:"center"});
    firstInvalid.focus();
    showToast("Please complete the required fields before submitting.");
    return;
  }
  showToast("Requirement submitted successfully — prototype only. No ServiceNow record or API call was created.");
});

updateProgress();