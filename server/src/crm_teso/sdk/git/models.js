var number_float = true;
var crm_id = '';
var selected;
var selectedLead;
var selectedQuote;
var selectedOwner;
var selectedServiceRevenue = 0;
var selectedServiceDebt = 0;
var selectedServiceID = 0;
var selectedServicePrecent = 0;
var fields = [];
var columns = [];
var customers = [];
var campaigns = [];

Ext.define('CRM_ITEM', {
	extend: 'Ext.data.Model',
	fields: [{name: 'value'}]
});

Ext.define('CRM_OBJECT', {
	extend: 'Ext.data.Model',
	fields: [{name: 'id', type: 'int'}, {name: 'value'}]
});

Ext.define('CRM_NEXT', {
	extend: 'Ext.data.Model',
	fields: [{name: 'value', type: 'int'}, {name: 'name'}]
});

Ext.define('CRM_PREV', {
	extend: 'Ext.data.Model',
	fields: [{name: 'value'}, {name: 'name'}]
});
 
fields['CRM_RETAIL_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'type', text: 'CRM Type', width: 50, hidden:true},   
   {name: 'level', text: '#', width: 30, align: 'center', lock: true, renderer: renderCustomerLevel},
//   {name: 'campaign', text: 'Active campaign', width: 180, hidden: true, renderer: renderCampaign},
   {name: '_class', text: 'Class', width: 50, align: 'center', renderer: renderClass},     
   {name: 'regNo', text: 'Регистр', width: 80, hidden: true},   
   {name: 'firstName', text: 'Нэр', width: 100, renderer: renderTip, primary: true},
   {name: 'lastName', text: 'Овог', width: 100},
   {name: 'crm_name', text: 'Бүтэн нэр', width: 180, hidden: true},
   {name: 'engName', text: 'Латин', width: 140, hidden: true},
   {name: 'descr', text: 'Чиглэл', width: 120, hidden: true},
   {name: 'birthday', text: 'Төрсөн огноо', width: 70, align: 'center', hidden: true},
   {name: 'gender', text: 'Хүйс', width: 60, hidden: true},
   {name: 'work_status', text: 'Төлөв', width: 140, hidden: true},
   {name: 'title', text: 'Компани', width: 270, hidden: true},
   {name: 'job_title', text: 'Албан тушаал', width: 200, hidden: true},
   {name: 'job_type', text: 'Мэргэжил', width: 100, hidden: true},
   {name: 'phone', text: 'Утас', width: 80, align: 'center', renderer: renderPhone},
   {name: 'phone1', text: 'Утас 1', width: 70, align: 'center', renderer: renderPhone},
   {name: 'phone2', text: 'Утас 2', width: 70, align: 'center', renderer: renderPhone, hidden: true},
   {name: 'fax', text: 'Факс', width: 80, hidden: true},   
   {name: 'email', text: 'И-майл', width: 120, renderer: renderMail},
   {name: 'www', text: 'Веб', width: 100, hidden: true},
   {name: 'country', text: 'Улс', width: 100, hidden: true},
   {name: 'city', text: 'Хот', width: 100, hidden: true},
   {name: 'district', text: 'Дүүрэг', width: 100, hidden: true},
   {name: 'horoo', text: 'Хороо', width: 100, hidden: true},
   {name: 'address', text: 'Хаяг', width: 150, hidden: true},
   {name: 'decision_maker', text: 'Шийдвэр гаргагч', width: 120, hidden: true},
   {name: 'owner', text: 'Хариуцагч', width: 120, renderer:renderOwner},
//   {name: 'parent_crm_id', text: 'Parent CRM ID', width: 120, hidden: true},
   {name: 'customer_type', text: 'Төрөл', width: 0, hidden: true},
   {name: '_date', type: 'datetime', text: 'Үүссэн', width: 120, align: 'center', renderer: renderCreatedDate},
   {name: 'userCode', text: 'Бүртгэсэн', width: 120},
   {name: 'mayDuplicate', text: 'Давхцал', width: 80, align: 'right', renderer: renderPrecent},
   {name: 'priority', text: 'Зэрэглэл', width: 60, align: 'center'},
   {name: 'source', text: 'Эх сурвалж', width: 250, hidden: true},
   {name: 'pricetag', text: 'Үнэ', width: 120, align: 'center', renderer: renderPriceName}
];

Ext.define('CRM_RETAIL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_RETAIL_FIELDS']
});

fields['CRM_CONTACT_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'regNo', text: 'Register', width: 80, hidden: true},   
   {name: 'firstName', text: 'First name', width: 180, renderer: renderTip, hidden: true, primary: true},
   {name: 'lastName', text: 'Last name', width: 120, hidden: true},
   {name: 'crm_name', text: 'Full name', width: 250},
   {name: 'engName', text: 'Latin', width: 140, hidden: true},
   {name: 'gender', text: 'Gender', width: 60, hidden: true},
   {name: 'title', text: 'Company', width: 200},
   {name: 'job_title', text: 'Position', width: 150},
   {name: 'phone', text: 'Phone', width: 80, align: 'center', renderer: renderPhone},
   {name: 'phone1', text: 'Phone B', width: 70, align: 'center', renderer: renderPhone},
   {name: 'email', text: 'Email', width: 120, renderer: renderMail},
   {name: 'decision_maker', text: 'Decision', width: 120, hidden: true},
   {name: 'owner', text: 'Owner', width: 120, renderer:renderOwner, hidden: true},
   {name: 'userCode', text: 'Created by', width: 120, hidden: true},
];

Ext.define('CRM_CONTACT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CONTACT_FIELDS']
});

fields['CRM_CORPORATE_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'type', text: 'CRM Type', width: 50, hidden:true},   
   {name: 'level', text: '#', width: 30, align: 'center', lock: true, renderer: renderCustomerLevel},
   {name: '_class', text: 'Class', width: 75, align: 'center', renderer: renderClass},      
   {name: 'regNo', text: 'Регистр', width: 65, align: 'center'},   
   {name: 'firstName', text: 'Нэр', width: 220, renderer: renderTip, primary: true},
   {name: 'lastName', text: 'Группын нэр', width: 120},
   {name: 'engName', text: 'Латин', width: 180, hidden: true},
   {name: 'company_torol', text: 'Төрөл', width: 60, align: 'center'},
   {name: 'descr', text: 'Чиглэл', width: 180},
   {name: 'sorog_huchin', text: 'Гараг', width: 70, renderer: renderWeekDays},
   {name: 'phone', text: 'Утас 1', width: 70, align: 'center', renderer: renderPhone},
   {name: 'phone1', text: 'Утас 2', width: 70, align: 'center', hidden: true, renderer: renderPhone},
   {name: 'phone2', text: 'Утас 3', width: 70, align: 'center', renderer: renderPhone, hidden: true},
   {name: 'fax', text: 'Факс', width: 90, align: 'center'},
   {name: 'email', text: 'И-майл', width: 100, hidden: true, renderer: renderMail},
   {name: 'www', text: 'Веб', width: 120, renderer: renderWWW},

   {name: 'payment_type', text: 'Хэлбэр', width: 60, align: 'center', renderer: renderSalesType},
   {name: 'promo_code', text: 'Урам.код', width: 80, align: 'center'},
   {name: 'promo_precent', text: 'Хөнгө.%', type: 'float', width: 70, align: 'right', renderer: renderPrecent},
   {name: 'promo_amount', text: 'Төлөвлөгөө', type: 'float', width: 100, align: 'right', renderer: renderMoney},

   {name: 'capital', text: 'Хөрөнгө', type: 'float', width: 100, hidden: true, align: 'right', renderer: renderMoney},
   {name: 'annual_revenue', text: 'Жилийн орлого', type: 'float', hidden: true, width: 100, align: 'right', renderer: renderMoney},
   {name: 'tatvar', text: 'Татварын хэмжээ', type: 'float', hidden: true, width: 100, align: 'right', renderer: renderMoney},
   
   {name: 'industry', text: 'Ү/А төрөл', width: 150, hidden: true},
   {name: 'industry_sub', text: 'Ү/А чиглэл', width: 150, hidden: true},
   {name: 'employees', text: 'Ажилчдын тоо', width: 90, align: 'center', hidden: true},
  // {name: 'campaign', text: 'Active campaign', width: 180, hidden: true},
   {name: 'country', text: 'Улс', width: 100, hidden: true},
   {name: 'city', text: 'Хот', width: 100, hidden: true},
   {name: 'district', text: 'Дүүрэг', width: 100, hidden: true},
   {name: 'horoo', text: 'Хороо', width: 100, hidden: true},
   {name: 'address', text: 'Хаяг', width: 150},   
   {name: 'source', text: 'Эх сурвалж', width: 120, hidden: true},
   {name: 'owner', text: 'Хариуцагч', width: 140, renderer:renderOwner},
   {name: 'userCode', text: 'Бүртгэсэн', width: 120, hidden: true},
   {name: 'customer_type', text: 'c', width: 0, hidden: true},
   {name: '_date', type: 'datetime', text: 'Үүсгэсэн', width: 120, align: 'center', renderer: renderCreatedDate},
   {name: 'mayDuplicate', text: 'Давхцал', width: 80, renderer: renderPrecent, align: 'right'},
   {name: 'priority', text: 'Зэрэглэл', width: 60, align: 'center', hidden: true},
   {name: 'pricetag', text: 'Үнэ', width: 120, align: 'center', renderer: renderPriceName},
   {name: 'lat', text: 'Lat', width: 80},
   {name: 'lng', text: 'Lng', width: 80}
];

Ext.define('CRM_CORPORATE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CORPORATE_FIELDS']
});


fields['CRM_TASK_FIELDS'] = [
   {name: 'id', text: 'Task ID', width: 50, hidden:true},         
   {name: 'campaign', text: 'Campaign', width: 150, hidden: true},  
   {name: 'deal_id', text: 'Deal ID', width: 50, hidden: true},
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true},
   {name: 'deal_name', text: 'Topic Name', width: 160, renderer: renderDealName},
   {name: 'subject', text: 'Subject', width: 150, primary: true},
   {name: 'task_status', text: 'Status', width: 70, align: 'center', renderer: renderTaskStatus},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'owner', text: 'Owner', width: 80, hidden: true, renderer:renderOwner},
   {name: 'duedate', type: 'datetime', text: 'Due date', width: 90,align: 'center', dateFormat: 'Y-m-d'},
   {name: 'duetime', type: 'datetime', text: 'Due time', align: 'center', width: 60},     
   {name: 'budgeted_cost', text: 'Budgeted cost', width: 90, type: 'float', align: 'right', renderer: renderMoney},
   {name: 'remind_at', text: 'Remind', width: 90,align: 'center', dateFormat: 'Y-m-d'},
   {name: 'remind_type', text: 'Remind type', hidden: true,  width: 200},
   {name: 'descr', text: 'Description', width: 250},
   {name: 'userCode', text: 'Created by', hidden: true, width: 200},
   {name: '_date', text: 'Created on', type: 'datetime', dateFormat: 'Y-m-d', hidden: true,  width: 200, renderer: renderCreatedDate}
];

Ext.define('CRM_TASK', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_TASK_FIELDS']
});


fields['CRM_EVENT_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true},         
   {name: 'campaign', text: 'Campaign', width: 150, hidden: true},  
   {name: 'deal_id', text: 'Deal ID', width: 50, hidden: true},
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true},
   {name: 'deal_name', text: 'Topic Name', width: 160, renderer: renderDealName},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'event_status', text: 'Status', width: 60, renderer: renderEventStatus, align: 'center'},
   {name: 'subject', text: 'Subject', width: 150, primary: true},
   {name: 'start_date', type: 'datetime', text: 'Due date', width: 80, dateFormat: 'Y-m-d', renderer: renderDate},
   {name: 'start_time', text: 'Due time', width: 70, renderer: renderTime},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'event_type', text: 'Type', width: 70, align: 'center'},
   {name: 'venue', text: 'Venue', width: 150},
   {name: 'budgeted_cost', text: 'Budgeted cost', width: 90, type: 'float', align: 'right', renderer: renderMoney},
   {name: 'descr', text: 'Description',  width: 200},
   {name: 'owner', text: 'Owner', width: 80, hidden: true, renderer:renderOwner},
   {name: 'remind_at', type: 'date', text: 'Remind', hidden: true,  width: 200, dateFormat: 'Y-m-d'},
   {name: 'remind_type', text: 'Remind type', hidden: true,  width: 200},
   {name: 'userCode', text: 'Created by', hidden: true, width: 200},
   {name: '_date', type: 'datetime', text: 'Created on', hidden: true,  width: 200, renderer: renderCreatedDate}
];

Ext.define('CRM_EVENT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_EVENT_FIELDS']
});


fields['CRM_CALLLOG_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true},         
   {name: 'campaign', text: 'Campaign', width: 150, renderer: renderCampaign, hidden: true},
   {name: 'deal_id', text: 'Deal ID', hidden: true, width: 150},
   {name: 'case_id', text: 'Case ID', hidden: true, width: 150},
   {name: 'deal_name', text: 'Topic Name', width: 180, renderer: renderDealName},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'subject', text: 'Subject', width: 180, primary: true},
   {name: 'owner', text: 'Owner', width: 120, hidden: true, renderer:renderOwner},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'calltype', text: 'Type', width: 70},
   {name: 'purpose', text: 'Purpose', width: 60}, 
   {name: 'callresult', text: 'Status', width: 60, align: 'center', renderer: renderCallStatus},
   {name: 'duration', type: 'int', text: 'Duration', hidden: true, width: 80, align: 'right', renderer: renderSecond, summaryType: 'sum', summaryRenderer: renderTSecond},
   {name: '_from', text: 'From', width: 70, align: 'center', hidden: true},
   {name: '_to', text: 'To', width: 70, align: 'center', renderer: renderPhone, primary: true},  
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'remind_at', type: 'date', text: 'Remind', hidden: true,  width: 200, dateFormat: 'Y-m-d'},
   {name: 'remind_type', text: 'Remind type', hidden: true,  width: 200},
   {name: 'userCode', text: 'Created by', hidden: true, width: 200},
   {name: '_date', type: 'datetime', text: 'Created on', width: 200, renderer: renderCreatedDate} 
];

Ext.define('CRM_CALLLOG', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CALLLOG_FIELDS']
});


fields['CRM_CALENDAR_FIELDS'] = [   
   {name: 'id', text: 'ID', hidden: true},
   {name: 'work_type', text: 'Type', width: 80, align: 'center', renderer: renderWorkType},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'deal_id', text: 'Deal ID', width: 10, hidden: true},
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true},
   {name: 'deal_name', text: 'Topic name', width: 200, hidden: true},
   {name: 'phone', text: 'Phone', width: 60, align: 'center', hidden: true},
   {name: 'days', text: 'Duedate', width: 60, align: 'center', hidden: true},
   {name: 'times', text: 'Time', width: 60, align: 'center', hidden: true},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'status', text: 'Status', width: 70, align: 'center'},
   {name: 'subject', text: 'Subject', width: 200},
   {name: 'source', text: 'Source', hidden: true, width: 150},
   {name: 'owner', text: 'Owner', width: 100, renderer: renderOwner},
   {name: 'userCode', text: 'Created by', width: 100, renderer: renderOwner, hidden: true},
   {name: '_date', text: 'Created on', width: 80},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'campaign', text: 'Campaign', hidden: true, width: 150},
   {name: 'phone', text: 'Phone/Email', hidden: true, width: 150},
   {name: 'remind_at', text: 'Remind at', hidden: true, width: 150}
];

Ext.define('CRM_CALENDAR', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CALENDAR_FIELDS']
});

fields['CRM_WORKFLOW_FIELDS'] = [   
   {name: 'id', text: 'ID', hidden: true},
   {name: 'workflow_status', text: 'Status', width: 70, align: 'center'},
   {name: 'subject', text: 'Subject', width: 200, primary: true},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'precent', text: 'Precent', width: 60, align: 'center', renderer: renderPrecent},
   {name: 'issue', type: 'int', text: 'Urgency', width: 60, align: 'center'},
   {name: 'start_date', text: 'Start date', width: 70, align: 'center', renderer: renderDate},
   {name: 'start_time', text: 'Start time', width: 65, align: 'center', renderer: renderTime},
   {name: 'end_date', text: 'End date', width: 70, align: 'center', renderer: renderDate},
   {name: 'end_time', text: 'End time', width: 65, align: 'center', renderer: renderTime},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'owner', text: 'Owner', width: 100, renderer: renderOwner, primary: true},
   {name: 'userCode', text: 'Created by', width: 100},
   {name: '_date', text: 'Created on', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_WORKFLOW', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_WORKFLOW_FIELDS']
});


fields['CRM_MESSAGE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true},         
   {name: 'message_status', text: '#', width: 35, align: 'center', renderer: renderMessageStatus},
   {name: 'owner', text: 'To', width: 120, hidden: true, renderer:renderOwner},
   {name: '_from', text: 'From', width: 110},
   {name: 'subject', text: 'Subject', width: 120},
   {name: 'descr', text: 'Message', width: 350},
   {name: '_date', type: 'datetime', text: 'Created on', width: 120}
];

Ext.define('CRM_MESSAGE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_MESSAGE_FIELDS']
});

fields['CRM_LOANED_CUSTOMER_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 50, hidden: true},         
   {name: 'crm_name', text: 'Харилцагч', width: 250, renderer: renderCRMName},
   {name: 'service_debt', text: 'Авлага', type:'float', align: 'right', width: 120, renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}
];

Ext.define('CRM_LOANED_CUSTOMER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_LOANED_CUSTOMER_FIELDS']
});


fields['CRM_COMPLAIN_FIELDS'] = [
   {name: 'case_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'complain_status', text: 'Status', width: 65, align: 'center', renderer: renderComplainStatus},   
   {name: 'complain_reason', text: 'Гомдлын шалтгаан', width: 200, primary: true, renderer: renderTopicName},   
   {name: 'phone', text: 'Утас', align: 'center', width: 65},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Харилцагч', width: 200, renderer: renderCRMName},
   {name: 'case_stage', text: 'Үе шат', width: 70, renderer: renderCaseLevel},
   {name: 'complain_origin', text: 'Суваг', width: 65, align: 'center'},   
   {name: 'complain_type', text: 'Type', width: 100, align: 'center'},
   {name: 'calltype', text: 'Урсгал', align: 'center', width: 65},
   {name: 'call_from', text: 'Хаанаас', align: 'center', width: 70},
   {name: 'priority', text: 'Зэрэглэл', width: 60, align: 'center'},
   {name: 'descr', text: 'Тайлбар', width: 200, hidden: true},
   {name: 'owner', text: 'Хариуцагч', width: 110, renderer:renderOwner},   
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: 'resolution_type', text: 'Resolution type', width: 120, hidden: true},
   {name: 'resolution', text: 'Resolution', width: 220, hidden: true},
   {name: 'closing_date', text: 'Хаагдах огноо', dateFormat: 'Y-m-d', width: 80},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate},
   {name: 'groupId', text: 'Case ID', width: 100},
   {name: 'notify', text: 'Notify', hidden: true}
];

Ext.define('CRM_COMPLAIN', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_COMPLAIN_FIELDS']
});

fields['CRM_NOTES_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', width: 50, hidden: true},   
   {name: 'deal_id', text: 'Deal ID', width: 50, hidden: true},   
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true}, 
   {name: 'crm_name', text: 'Харилцагч', width: 200, renderer: renderCRMName},
   {name: 'deal_name', text: 'Гарчиг', width: 200, renderer: renderDealName},
   {name: 'descr', text: 'Тэмдэглэл', width: 200, primary: true},
   {name: 'www', text: 'Холбоос', width: 150, renderer: renderLink},
   {name: 'owner', text: 'Хариуцагч', width: 100, renderer: renderOwner, hidden: true},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, renderer: renderOwner},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_NOTES', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_NOTES_FIELDS']
});

fields['CRM_POSTS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', width: 50, hidden: true},   
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true},
   {name: 'message', text: 'Мессеж', width: 200, primary: true},
   {name: 'level', type: 'int', text: 'level', width: 50, hidden: true},
   {name: 'owner', text: 'Хариуцагч', width: 100, renderer: renderOwner},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_POSTS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_POSTS_FIELDS']
});

fields['CRM_EMAIL_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', width: 50, hidden: true},   
   {name: 'deal_id', text: 'Deal ID', width: 50, hidden: true},   
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true},   
   {name: 'deal_name', text: 'Topic Name', width: 180, renderer: renderDealName},
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'email_status', text: 'Status', width: 70, align: 'center'},
   {name: 'subject', text: 'Subject', width: 200, primary: true},
   {name: '_to', text: 'To', width: 150, renderer: renderMail},
   {name: '_from', text: 'From', width: 150, renderer: renderMail, hidden: true},
   {name: 'campaign', text: 'Campaign', width: 150},
   {name: 'descr', text: 'Message body', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 100, renderer: renderOwner},
   {name: 'userCode', text: 'Created by', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_EMAIL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_EMAIL_FIELDS']
});


fields['CRM_QUOTE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'quote_status', text: 'Status', width: 85, align: 'center', renderer: renderQuoteStatus}, 
   {name: 'quote_code', text: 'Quote ID', hidden: true, width: 110, align: 'center'}, 
   {name: 'crm_id', text: 'CRM ID', width: 80, hidden: true},
   {name: 'deal_id', text: 'DEAL ID', width: 80, hidden: true},
   {name: 'deal_name', text: 'Deal Name', width: 200, renderer: renderDealName},
   {name: 'crm_name', text: 'Potential Customer', width: 250, renderer: renderCRMName},
   {name: 'qty', text: 'Qty', align: 'right', width: 55, type: 'float', renderer: renderNumber, summaryRenderer: renderTNumber, summaryType: 'sum'},
   {name: 'amount', text: 'Total Amount', align: 'right', type: 'float', width: 110, renderer: renderMoney, summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'owner', text: 'Owner', width: 110, renderer:renderOwner}, 
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'userCode', text: 'Created by', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_QUOTE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_QUOTE_FIELDS']
});

fields['CRM_QUOTE_DETAIL_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'quote_id', text: 'Quote ID', hidden: true}, 
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'product_name', text: 'Product', width: 200}, 
   {name: 'qty', text: 'Qty', type:'float', align: 'right', width: 60, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'price', text: 'Price', width: 90, type: 'float', align: 'right', renderer: renderMoney},
   {name: 'amount', text: 'Amount (Discount)', type: 'float', width: 100, align: 'right', renderer: renderMoney, summaryRenderer: renderTMoney, summaryType: 'sum'}
];

Ext.define('CRM_QUOTE_DETAIL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_QUOTE_DETAIL_FIELDS']
});

fields['CRM_DEAL_PRODUCTS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true},
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'product_id', text: 'PID', width: 50, hidden: true, align:'center'}, 
   {name: 'product_code', text: 'Code', width: 50, align:'center'}, 
   {name: 'product_name', text: 'Product name', width: 200}, 
   {name: 'type', text: 'Type', align: 'center', width: 70},
   {name: 'precent',  type:'float', text: 'Precent', width: 100, align: 'right'}, 
   {name: 'warehouse_id', text: 'Warehouse ID', width: 100, hidden: true, align: 'right'}, 
   {name: 'qty', text: 'Qty', type:'float', align: 'right', width: 80, summaryType: 'sum'},
   {name: 'price', text: 'Price', width: 90, type: 'float', align: 'right', renderer: renderMoney},
   {name: 'amount', text: 'Amount (Discount)', type: 'float', width: 100, align: 'right', renderer: renderMoney, summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate},
   {name: 'unit_size', text: 'Unit size', width: 80, renderer: renderNumber, align: 'right'},
   {name: 'flag', text: 'Flag', width: 80, renderer: renderNumber, align: 'right'}
];

Ext.define('CRM_DEAL_PRODUCTS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_PRODUCTS_FIELDS']
});


fields['CRM_DEAL_PAYROLL_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true},
   {name: 'deal_name', text: 'Topic Name', width: 250, renderer: renderDealName},
   {name: 'pay_date', text: 'Төлөлт хийсэн', width: 120, align: 'center'}, 
   {name: 'amount', text: 'Дүн', type:'float', align: 'right', width: 120, summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, renderer: renderOwner},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_DEAL_PAYROLL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_PAYROLL_FIELDS']
});


fields['CRM_SERVICE_PAYROLL_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', width: 50, hidden:true}, 
   {name: 'service_id', text: 'Service ID', hidden: true},
   {name: 'service_name', text: 'Захиалагын дугаар', width: 250, renderer: renderServiceName},
   {name: 'pay_type', text: 'Төлөлтийн хэлбэр', width: 120, renderer: renderPayType, align: 'center'}, 
   {name: 'pay_date', text: 'Огноо', width: 120, align: 'center'}, 
   {name: 'promo_code', text: 'Урам.код', width: 80, align: 'center'}, 
   {name: 'promo_amount', text: 'Төлөвлөгөө', width: 80, align: 'center'}, 
   {name: 'precent', text: 'Хөнгөлөлтийн %', width: 90, renderer: renderNumber, align: 'center'}, 
   {name: 'amount', text: 'Төлсөн', type:'float', align: 'right', width: 120, summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'total_amount', text: 'Хөнг.хасаасгүй', type:'float', align: 'right', width: 120, summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'userCode', text: 'Бүртгэсэн', width: 150, renderer: renderOwner},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_SERVICE_PAYROLL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_SERVICE_PAYROLL_FIELDS']
});

fields['CRM_CHANGEPRICE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', width: 50, hidden:true}, 
   {name: 'change_date', text: 'Огноо', width: 120, align: 'center'}, 
   {name: 'amount', text: 'Дүн', type:'float', align: 'right', width: 120, summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'userCode', text: 'Бүртгэсэн', width: 150, renderer: renderOwner},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_CHANGEPRICE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CHANGEPRICE_FIELDS']
});

fields['CRM_CASE_PRODUCTS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'case_id', text: 'Case ID', hidden: true},
   {name: 'product_name', text: 'Product name', width: 200}, 
   {name: 'contract', text: 'Contract', width: 120},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
];

Ext.define('CRM_CASE_PRODUCTS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CASE_PRODUCTS_FIELDS']
});

fields['CRM_CASE_TRANSFER_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'case_id', text: 'Case ID', hidden: true},
   {name: 'descr', text: 'Note', width: 200, primary: true},
   {name: 'owner', text: 'Owner', width: 120, primary: true}, 
   {name: '_from', text: 'From', width: 120},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_CASE_TRANSFER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CASE_TRANSFER_FIELDS']
});

fields['CRM_DEAL_TRANSFER_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true},
   {name: 'descr', text: 'Note', width: 200, primary: true},
   {name: 'owner', text: 'Owner', width: 120, primary: true}, 
   {name: 'userCode', text: 'Created by', width: 120}, 
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_DEAL_TRANSFER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_TRANSFER_FIELDS']
});


fields['CRM_DEAL_SALES_TEAM_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true},
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'deal_name', text: 'Topic Name', width: 200, renderer: renderDealName},
   {name: 'owner', text: 'Member', width: 150, renderer: renderOwner, primary: true}, 
   {name: 'precent', text: 'Precent', width: 70, renderer: renderPrecent, align: 'right'}, 
   {name: 'userCode', text: 'Created by', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_DEAL_SALES_TEAM', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_SALES_TEAM_FIELDS']
});

fields['CRM_CUSTOMER_CAMPAIGN_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'crm_name', text: 'Potential Customer', width: 250, renderer: renderCRMName},
   {name: 'campaign', text: 'Campaign', width: 200},
   {name: 'userCode', text: 'Created by', width: 100},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 140, renderer: renderCreatedDate}
];

Ext.define('CRM_CUSTOMER_CAMPAIGN', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CUSTOMER_CAMPAIGN_FIELDS']
});

fields['CRM_CUSTOMER_COMPANY_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'crm_name', text: 'Potential Customer', width: 250, renderer: renderCRMName},
   {name: 'company', text: 'Company', width: 200},
   {name: 'userCode', text: 'Created by', width: 100},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 140, renderer: renderCreatedDate}
];

Ext.define('CRM_CUSTOMER_COMPANY', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CUSTOMER_COMPANY_FIELDS']
});


fields['CRM_DEAL_COMPETITORS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true}, 
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'competitor_name', text: 'Competitor name', width: 200, primary: true}, 
   {name: 'www', text: 'Web site', width: 140, renderer: renderWWW},
   {name: 'reported_revenue', text: 'Reported revenue', width: 120, type: 'float', align: 'right', renderer: renderMoney},
   {name: 'strength', text: 'Strength', width: 120},
   {name: 'weakness', text: 'Weakness', width: 120}
];

Ext.define('CRM_DEAL_COMPETITORS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_COMPETITORS_FIELDS']
});

fields['CRM_SALES_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'contract_no', text: 'Contract №', width: 80, align: 'center'}, 
   {name: 'crm_id', text: 'CRM ID', width: 80, hidden: true},
   {name: 'deal_id', text: 'DEAL ID', width: 80, hidden: true},
   {name: 'crm_name', text: 'Customer', width: 210, renderer: renderCRMName},
   {name: 'deal_name', text: 'Deal Name', width: 210, renderer: renderDealName},
   {name: 'product_name', text: 'Product name', width: 280}, 
   {name: 'quote_code', text: 'Quote ID', hidden: true, width: 110, align: 'center'},    
   {name: 'start_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Start date', width: 80, align: 'center'}, 
   {name: 'end_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'End date', width: 80, align: 'center'}, 
   {name: 'qty', text: 'Qty',  align: 'right', width: 55, type: 'float', renderer: renderNumber, summaryRenderer: renderTNumber, summaryType: 'sum'},
   {name: 'price', text: 'Price', align: 'right', type: 'float', width: 110, renderer: renderMoney},
   {name: 'amount', text: 'Amount', align: 'right', type: 'float', width: 110, renderer: renderMoney, summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'campaign', text: 'Campaign', width: 150},
   {name: 'owner', text: 'Owner', width: 110, renderer:renderOwner}, 
   {name: 'status', text: 'Status', width: 100, hidden: true},
   {name: 'userCode', text: 'Created by', width: 100, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_SALES', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_SALES_FIELDS']
});

fields['CRM_PRODUCT_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_code', text: 'Код', width: 80, align:'center', primary: true}, 
   {name: 'product_barcode', text: 'Баркод', align:'center', width: 90, primary: true}, 
   {name: 'product_name', text: 'Нэр', width: 250, primary: true},   
   {name: 'product_type', text: 'Төрөл', width: 200},
   {name: 'product_brand', text: 'Бренд', width: 180},
   {name: 'product_vendor', text: 'Үйлдвэрлэгч', width: 250},
   {name: 'discount', text: 'Хөнгө%', type: 'float', width: 80, renderer: renderPrecent, align: 'right'},
   {name: 'price', text: 'Үнэ', type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price1', text: price_text[1], type: 'float', width: 80, renderer: renderMoney, align: 'right'},
   {name: 'price2', text: price_text[2], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price3', text: price_text[3], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price4', text: price_text[4], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price5', text: price_text[5], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price6', text: price_text[6], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price7', text: price_text[7], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price8', text: price_text[8], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price9', text: price_text[9], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'price10', text: price_text[10], type: 'float', width: 80, renderer: renderMoney, align: 'right', hidden:true},
   {name: 'warehouse_id', text: 'Агуулах', type: 'int', width: 70, align: 'center'},
   {name: 'unit_type', text: 'Нэгж', width: 40},
   {name: 'unit_size', text: 'Хэмжээ', type: 'float', width: 40},
   {name: 'company', text: 'Тайлбар', width: 220}  
];


Ext.define('CRM_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PRODUCT_FIELDS']
});

fields['CRM_PROMOTION_CORPORATE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true},
   {name: 'promotion_id', text: 'Урам ID', hidden: true, primary: true},
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'crm_name', text: 'Нэр', width: 220, renderer: renderTip, primary: true},
   {name: 'owner', text: 'Хариуцагч', width: 140, renderer:renderOwner},
   {name: '_date', type: 'datetime', text: 'Үүсгэсэн', width: 120, align: 'center', renderer: renderCreatedDate}
];

Ext.define('CRM_PROMOTION_CORPORATE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PROMOTION_CORPORATE_FIELDS']
});

fields['CRM_PROMOTION_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'promotion_name', text: 'Нэр', width: 180, primary: true}, 
   {name: 'start_date', type: 'datetime', text: 'Эхэлэх', align:'center', width: 80, dateFormat: 'Y-m-d', primary: true}, 
   {name: 'end_date', type: 'datetime', text: 'Дуусах', align:'center', width: 80, dateFormat: 'Y-m-d', primary: true},   
   {name: 'promo_type', text: 'Төрөл', width:90, primary: true},
   {name: 'summaryTotal', text: 'Багцын нийлбэр', width:90, type: 'float', align: 'right'},
   {name: 'randomCount', text: 'Сонголтоор орсон байх', width: 90, type: 'float', align: 'right'},
   {name: 'discount', text: 'Хөнгөлөх дүн', width: 100, type: 'float', align: 'right'},
   {name: 'userCode', text: 'Бүртгэсэн', hidden: true, width: 100},
   {name: 'promo_warehouse_id', text: 'Агуулах', width: 100, align: 'right'},
   {name: 'descr', text: 'Тайлбар', hidden: true, width: 250}
];


Ext.define('CRM_PROMOTION', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PROMOTION_FIELDS']
});

fields['CRM_PROMOTION_PRODUCT_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_id', text: 'ID', width: 20, primary: true, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 60}, 
   {name: 'product_barcode', text: 'Баркод', width: 80}, 
   {name: 'product_name', text: 'Барааны нэр', width: 180}, 
   {name: 'product_brand', text: 'Бренд', width: 100}, 
   {name: 'product_vendor', text: 'Нийлүүлэгч', width: 180}, 
   {name: 'unit_size', text: 'Нэгж', width: 50}, 
   {name: 'price1', text: 'Үнд.үнэ', width: 80, type: 'float', align: 'right'},   
   {name: 'qty', text: 'Ширхэг', width: 70, type: 'float', align: 'right'},
   {name: 'pty', text: 'Хайрцаг', width: 70, type: 'float', align: 'right'},
   {name: 'promotion_name', text: 'Урамшууллын нэр', hidden: true, width: 100},
   {name: '_date', text: 'Үүссэн', hidden: true, width: 250}
];


Ext.define('CRM_PROMOTION_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PROMOTION_PRODUCT_FIELDS']
});

fields['CRM_PROMOTION_CUSTOMER_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'Нэр', width: 180, primary: true}, 
   {name: 'crm_name', text: 'Харилцагчийн нэр', width: 180}, 
   {name: 'promotion_id', type: 'int', text: 'Урамшуулалын ID', align:'center', width: 80, dateFormat: 'Y-m-d', primary: true},
   {name: 'owner', text: 'Хариуцагч', align:'center', width: 120 },
];


Ext.define('CRM_PROMOTION_CUSTOMER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PROMOTION_CUSTOMER_FIELDS']
});

fields['CRM_WAREHOUSE_FIELDS'] = [
   {name: 'warehouse_id', text: 'ID', width: 30, align: 'right'}, 
   {name: 'name', text: 'Агуулахын нэр', width: 150, primary: true}, 
   {name: 'location', text: 'Байршил', width: 120},
   {name: 'capacity', text: 'Багтаамж', type: 'float', width: 90, renderer: renderNumber, align: 'right'},
   {name: 'descr', text: 'Тайлбар', width: 120},
   {name: 'owner', text: 'Хариуцагч', width: 110, renderer:renderOwner}, 
   {name: 'warehouse_type', text: 'Төрөл', width: 80},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Үүссэн', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_WAREHOUSE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_WAREHOUSE_FIELDS']
});


fields['CRM_STORAGE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'warehouse_id', text: 'Агуулах', width: 50, hidden:true}, 
   {name: 'product_id', text: 'ID', width: 50, primary: true, hidden:true}, 
   {name: 'product_code', text: 'Код', width: 50, primary: true, align: 'center'}, 
   {name: 'product_name', text: 'Нэр', width: 250, summaryType: 'count', summaryRenderer: renderTNumber},
   {name: 'aty', text: 'Боломжит үлдэгдэл', type: 'float', width: 100, hidden: true, renderer: renderNumber, align: 'right', summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'qty', text: 'Ширхэг', type: 'float', width: 100, renderer: renderNumber, align: 'right', summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'pty', text: 'Хайрцаг', type: 'float', width: 90, renderer: renderTNumber, align: 'right', summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'price', text: 'Үнэ', width: 120, renderer:renderMoney, hidden: true},
   {name: 'amount', text: 'Дүн', width: 110, renderer:renderMoney, hidden: true}, 
   {name: 'warehouse_name', text: 'Агуулах', width: 120}, 
   {name: 'descr', text: 'Тайлбар', width: 120, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Огноо', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_STORAGE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_STORAGE_FIELDS']
});

fields['CRM_STAT_FIELDS'] = [
   {name: 'id', text: 'id', hidden: true}, 
   {name: 'owner', text: 'Owner', width: 120}, 
   {name: 'team', text: 'Team', width: 150}, 
   {name: '_year', type: 'int', text: 'Year', width: 50, primary: true, align: 'center'}, 
   {name: '_month', type: 'int', text: 'Month', width: 50, primary: true, align: 'center'}, 
   {name: 'event_p', type: 'int', text: 'Appointment', width: 90, align: 'right'},
   {name: 'quote_p', type: 'int', text: 'Quote', width: 90, align: 'right'},
   {name: 'newcus_p', type: 'int', text: 'New Customer', width: 90, align: 'right'},
   {name: 'expat_p', type: 'int', text: 'Expat Customer', width: 90, align: 'right'},
   {name: 'vip_p', type: 'int', text: 'VIP customer', width: 90, align: 'right'},
   {name: 'extend_p', type: 'int', text: 'Extension', width: 90, align: 'right'},
   {name: 'userCode', text: 'Created by', width: 100, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', hidden: true, width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_STAT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_STAT_FIELDS']
});


fields['CRM_USERS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'owner', text: 'Хэрэглэгчийн нэр', width: 130, primary: true}, 
   {name: 'password', text: 'Нууц үг', width: 90, hidden: true, renderer: renderPassword, primary: true},
   {name: 'fullName', text: 'Овог нэр', width: 120},
   {name: 'section', text: 'Алба', width: 120, hidden: true},
   {name: 'team', text: 'Хэсэг', width: 80},
   {name: 'phone', text: 'Утас', width: 70},
   {name: 'mon', text: 'Даваа', width: 160},
   {name: 'thue', text: 'Мягмар', width: 160},
   {name: 'wed', text: 'Лхагва', width: 160},
   {name: 'thur', text: 'Пүрэв', width: 160},
   {name: 'fri', text: 'Баасан', width: 160},
   {name: 'sat', text: 'Бямба', width: 160},
   {name: 'sun', text: 'Ням', width: 160},
   {name: 'position', text: 'Албан тушаал', width: 150},
   {name: 'manager', text: 'Менежер', width: 120},
   {name: 'company', text: 'Компани', width: 120, hidden: true},
   {name: 'gmailAccount', text: 'Gmail Account', width: 120},
   {name: 'user_type', text: 'Чиглэл', width: 80, renderer: renderUserType}, 
   {name: 'user_level', text: 'Түвшин', width: 100, renderer: renderUserLevel},
   {name: 'permission', text: 'Хандалт', width: 250, hidden: true},
   {name: 'warehouse_id', text: 'Агуулах', width: 100, hidden: true, primary: true},
   {name: 'partner', text: 'Жолооч', width: 120},
   {name: 'msg', text: 'Мессеж', width: 120, hidden: true}
];

Ext.define('CRM_USERS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_USERS_FIELDS']
});

fields['CRM_COMPETITOR_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'competitor_name', text: 'Competitor name', width: 120},
   {name: 'www', text: 'Web site', width: 150},
   {name: 'userCode', text: 'Create by', width: 100, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_COMPETITOR', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_COMPETITOR_FIELDS']
});

fields['CRM_GPS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'owner', text: 'Мэдээлэл', width: 250, renderer: renderGPSName},
   {name: 'must', text: 'Орох ёстой', width: 80, align: 'right', renderer: renderENumber},
   {name: 'enter', text: 'Орсон', width: 70, align: 'right', renderer: renderENumber},
   {name: 'lat', text: 'Lng', width: 80, hidden: true},
   {name: 'lng', text: 'Lng', width: 80, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', width: 180}
];

Ext.define('CRM_GPS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_GPS_FIELDS']
});


fields['CRM_COMMISSION_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: '', hidden: true},
   {name: 'deal_id', text: '', hidden: true},
   {name: 'crm_name', text: 'Contact', flex: 1, renderer: renderCRMName},
   {name: 'amount', type: 'float', text: 'Amount', width: 150},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'userCode', text: 'Create by', width: 100, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_COMMISSION', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_COMMISSION_FIELDS']
});

fields['CRM_USERS_GROUP_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'owner', text: 'Member', width: 120, primary: true},
   {name: 'groupName', text: 'Group name', width: 150},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
];

Ext.define('CRM_USERS_GROUP', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_USERS_GROUP_FIELDS']
});

fields['CRM_ALARM_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'crm_id', text: 'CRM ID', width: 150},
   {name: 'crm_name', text: 'Customer', width: 150},
   {name: 'subject', text: 'Description', width: 200},
   {name: 'status', text: 'Status', width: 100},
   {name: 'owner', text: 'Owner', width: 100},
   {name: 'type', text: 'Owner', width: 80}
];

Ext.define('CRM_ALARM', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_ALARM_FIELDS']
});

fields['CRM_RISK_RESULT_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'crm_name', text: 'Potential Customer', width: 200, renderer: renderCRMName},
   {name: 'category', text: 'Category', width: 90},
   {name: 'section', text: 'Section', width: 120},
   {name: 'question', text: 'Question', width: 250},
   {name: 'score', text: 'Score', width: 60, align: 'center'},
   {name: '_repeat', text: 'Repeat', width: 60, align: 'center'},
   {name: 'status', text: 'Status', width: 60, align: 'center'},
   {name: 'owner', text: 'Create by', width: 100, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', width: 120, renderer: renderCreatedDate}
];

Ext.define('CRM_RISK_RESULT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_RISK_RESULT_FIELDS']
});


fields['CRM_DEAL_FIELDS'] = [
   {name: 'deal_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'status', text: 'Status', width: 80, align: 'center'},
   {name: 'deal', text: 'Topic Name', width: 250, primary: true, renderer: renderTopicName},   
   {name: 'deal_origin', text: 'Origin', primary: true},
   {name: 'stage', text: 'Stage', width: 85, align: 'center', renderer: renderDealLevel},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Potential customer', width: 200, renderer: renderCRMName},
   {name: 'phone', text: 'Phone', width: 80, hidden: true, primary: true},
   {name: 'probablity', text: 'Probablity', width: 70, type:'int', summaryType:'average', summaryRenderer:renderTPrecent, align: 'right', renderer: renderPrecent},
   {name: 'expected_revenue', text: 'Expected revenue', type:'float', width: 120, align: 'right', summaryType:'sum', summaryRenderer: renderTMoney, renderer: renderMoney},
   {name: '_date', text: 'Created on', width: 120, renderer: renderCreatedDate},
   {name: 'closing_date', text: 'Close date', dateFormat: 'Y-m-d', width: 85, align: 'center'},   
   {name: 'remind_date', text: 'Remind date', dateFormat: 'Y-m-d', width: 85, align: 'center', renderer: renderDate},   
   {name: 'current_situation', text: 'Current situation', width: 200, hidden: true},
   {name: 'customer_need', text: 'Customer need', width: 200, hidden: true},
   {name: 'proposed_solution', text: 'Proposed solution', width: 200, hidden: true},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 130, renderer: renderOwner},
   {name: 'competitor_name', text: 'Competitor', width: 200},
   {name: 'campaign', text: 'Campaign', width: 200},   
   {name: 'company', text: 'Company', width: 200},
   {name: 'userCode', text: 'Created by', width: 80, hidden: true},
   {name: 'notify', text: 'Notify', hidden: true}
];


Ext.define('CRM_DEAL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_FIELDS']
});


fields['CRM_SERVICE_FIELDS'] = [
   {name: 'service_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'service_stage', text: 'Үе шат', width: 85, align: 'center', renderer: renderServiceLevel},
   {name: '_date', text: 'Огноо', width: 120, renderer: renderCreatedDate},
   {name: 'subject', text: 'Гүйлгээний дугаар', width: 120, primary: true, renderer: renderTopicName},   
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Харилцагч', width: 250, renderer: renderCRMName},
   {name: 'phone', text: 'Утас', width: 80, hidden: true, primary: true},
   {name: 'service_revenue', text: 'Дүн', type:'float', width: 100, align: 'right', summaryType:'sum', summaryRenderer: renderTMoney, renderer: renderMoney},
   {name: 'service_debt', text: 'Авлага', type:'float', width: 100, align: 'right', summaryType:'sum', summaryRenderer: renderTMoney, renderer: renderMoney},
   {name: 'service_precent', text: '%', type:'float', width: 50, align: 'right', summaryType:'sum', summaryRenderer: renderTPrecent, renderer: renderPrecent},
   {name: 'userCode', text: 'Бүртгэсэн', width: 140},
   {name: 'owner', text: 'Хариуцагч', width: 130, renderer: renderOwner},
   {name: 'closing_date', text: 'Хаагдах огноо', dateFormat: 'Y-m-d', width: 120, align: 'center'},   
   {name: 'remind_date', text: 'Олгосон огноо', dateFormat: 'Y-m-d', width: 120, align: 'center', renderer: renderDate}, 
   {name: 'descr', text: 'Тайлбар', width: 200, hidden: true},
   {name: 'campaign', text: 'Campaign', width: 200},
   {name: 'partner', text: 'Жолооч', width: 0},
   {name: 'warehouse_id', text: 'Агуулах', width: 0, hidden: true},
   {name: 'pricetag', text: 'Үнэ', width: 0, hidden: true}
];

Ext.define('CRM_SERVICE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_SERVICE_FIELDS']
});

fields['CRM_PRODUCT_AVAILABLE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_code', text: 'Код', width: 50, align:'center'}, 
   {name: 'product_barcode', text: 'Баркод', width: 90}, 
   {name: 'product_name', text: 'Бараа', width: 260}, 
   {name: 'qty', text: 'Ширхэг', width: 80, align: 'right', renderer: renderNumber}, 
   {name: 'pty', text: 'Хайрцаг', width: 80, align: 'right', renderer: renderNumber}, 
   {name: 'userCode', text: 'Хариуцагч', width: 150}
];

Ext.define('CRM_PRODUCT_AVAILABLE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PRODUCT_AVAILABLE_FIELDS']
});


fields['CRM_RESELLER_FIELDS'] = [
   {name: 'deal_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'status', text: 'Status', width: 80, align: 'center'},
   {name: 'deal', text: 'Topic Name', width: 250, primary: true, renderer: renderTopicName},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Potential customer', width: 250, renderer: renderCRMName},
   {name: 'closing_date', text: 'Close date', dateFormat: 'Y-m-d', width: 85, align: 'center'},   
   {name: '_date', text: 'Created on', width: 120, renderer: renderCreatedDate},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 130, renderer: renderOwner},
   {name: 'userCode', text: 'Created by', width: 80, hidden: true},
   {name: 'notify', text: 'Notify', hidden: true}
];

Ext.define('CRM_RESELLER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_RESELLER_FIELDS']
});


fields['CRM_POTENTIAL_FIELDS'] = [
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 150, renderer: renderCRMName},
   {name: 'closing_date', text: 'Closing date', width: 80, align: 'center'},
   {name: 'stage', text: 'Stage', width: 100},
   {name: 'probablity', text: 'Probablity', width: 60, align: 'right', renderer: renderPrecent},
   {name: 'next_step', text: 'Next Step',  width: 150},
   {name: 'amount', text: 'Amount', align: 'center', align: 'right', width: 80, renderer: renderMoney},
   {name: 'expected_revenue', text: 'Expected Revenue', align: 'right', width: 120, renderer: renderMoney},
   {name: '_date', text: 'Огноо', dateFormat: 'Y-m-d', hidden: true, width: 80, renderer: renderCreatedDate},
   {name: 'descr', text: 'Тайлбар', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 80, hidden: true, renderer:renderOwner},   
   {name: 'userCode', text: 'Created by', width: 80, hidden: true},
   {name: 'campaign', text: 'Campaign', width: 200},
   {name: 'deal_id', text: 'Deal ID', width: 50, hidden: true},
   {name: 'deal_name', text: 'Topic Name', width: 150, hidden: true}
];

Ext.define('CRM_POTENTIAL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_POTENTIAL_FIELDS']
});

fields['CRM_CAMPAIGN_FIELDS'] = [
   {name: 'id', text: 'ID', width: 0, hidden: true},
   {name: 'campaign_status', text: 'Status', width: 70, align: 'center', renderer: renderCampaignStatus},
   {name: 'campaign', text: 'Campaign name', width: 200, primary: true},
   {name: 'total_members', type: 'int', text: 'Members', width: 70, align: 'right'},
   {name: 'campaign_live', text: 'Define', width: 60, align: 'center'},
   {name: 'campaign_type', text: 'Type', width: 80, primary: true},
   {name: 'personal', text: 'Personal view', width: 150, hidden: true},
   {name: 'product_name', text: 'Product name', width: 150},
   {name: 'expected_revenue', text: 'Expected Revenue', type: 'float', width: 120, summaryType: 'sum', align: 'right', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'budgeted_cost', text: 'Budgeted cost', type: 'float', align: 'center', align: 'right', hidden: true, width: 110, summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'start_date', text: 'Start date', dateFormat: 'Y-m-d', align: 'center', width: 75},
   {name: 'end_date', text: 'End date', dateFormat: 'Y-m-d', align: 'center', width: 75},
   {name: 'owner', text: 'Owner', width: 100, renderer:renderOwner},   
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120, renderer: renderCreatedDate},
   {name: 'descr', text: 'Description', width: 250, hidden: true},
   {name: 'userCode', text: 'Created by', width: 80, hidden: true}
];

Ext.define('CRM_CAMPAIGN', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CAMPAIGN_FIELDS']
});

fields['CRM_DEFAULT_USER_PLANNING_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'plan_name', text: 'Төлөвлөгөөний нэр', width: 120},
   {name: 'owner', text: 'Борлуулагч', width: 150},
   {name: 'start_date', text: 'Эхлэх', dateFormat: 'Y-m-d', width: 80},
   {name: 'end_date', text: 'Дуусах', dateFormat: 'Y-m-d',width: 80},
   {name: 'product_name', text: 'Бараа', width: 150},
   {name: 'product_id', text: 'ID', width: 80, hidden: true},
   {name: 'price', text: 'Үнэ', type: 'float', width: 70, renderer: renderMoney, align: 'right', summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'count', text: 'Т.Тоо', type: 'float', width: 70, renderer: renderNumber, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum'},
   {name: 'amountTheshold', text: 'Төлөвлөгөө', type: 'float', width: 120, renderer: renderMoney, align: 'right', summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, renderer:renderOwner},
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, hidden: true}
];

Ext.define('CRM_DEFAULT_USER_PLANNING', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEFAULT_USER_PLANNING_FIELDS']
});

fields['CRM_USER_PLANNING_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'plan_name', text: 'Төлөвлөгөөний нэр', width: 120},
   {name: 'owner', text: 'Борлуулагч', width: 150}, 
   {name: 'team', text: 'Хэсэг', width: 100}, 
   {name: 'product_name', text: 'Бараа', width: 150},
   {name: 'start_date', text: 'Эхлэх', dateFormat: 'Y-m-d', width: 80},
   {name: 'end_date', text: 'Дуусах', dateFormat: 'Y-m-d',width: 80},
   {name: 'product_id', text: 'Бараа', width: 80, hidden: true},
   {name: 'price', text: 'Үнэ', type: 'float', width: 70, renderer: renderMoney, align: 'right', summaryRenderer: renderTMoney, summaryType: 'average'},
   {name: 'count', text: 'Т.Тоо', type: 'float', width: 90, renderer: renderNumber, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum', 
	editor: {
		xtype: 'numberfield', 
		allowBlank: false		
	}
   },
   {name: 'amountTheshold', text: 'Төлөвлөгөө', type: 'float', width: 120, renderer: renderMoney, align: 'right', summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'performCount', text: 'Г.тоо', type: 'float', width: 70, renderer: renderNumber, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum'},
   {name: 'performTheshold', text: 'Гүйцэтгэл', type: 'float', width: 120, renderer: renderMoney, align: 'right', summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'sku', text: 'Sku %', type: 'float', width: 60, renderer: renderPrecent, align: 'right', summaryRenderer: renderTPrecent, summaryType: 'average'},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, renderer:renderOwner},      
   {name: '_date', text: 'Үүссэн', dateFormat: 'Y-m-d', width: 120, hidden: true}
];

Ext.define('CRM_USER_PLANNING', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_USER_PLANNING_FIELDS']
});


fields['CRM_PERSONAL_VIEW_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden: true}, 
   {name: 'personal', text: 'View name', width: 200}, 
   {name: 'field', text: 'Field', width: 100}, 
   {name: 'equals', text: 'IF', width: 100}, 
   {name: 'value', text: 'Value', width: 190},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', hidden: true, width: 80},
   {name: 'userCode', text: 'Created by', width: 120, hidden: true}
];

Ext.define('CRM_PERSONAL_VIEW', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PERSONAL_VIEW_FIELDS']
});

fields['CRM_REPORT_ANY_FIELDS'] = [
   {name: 'crm_name', text: '', hidden: true}, 
];

Ext.define('CRM_REPORT_ANY', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_ANY_FIELDS']
});

fields['CRM_REPORT_FIELDS'] = [
   {name: 'crm_name', text: 'Potientail customer', width: 250, summaryType: 'count', summaryRenderer: renderTReportNumber}, 
   {name: 'product_name', text: 'Product name', width: 250}, 
   {name: 'stage', text: 'Stage', width: 85, align: 'center', renderer: renderDealLevel},
   {name: 'expected_revenue', align: 'right', type:'float', text: 'Expected revenue', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}, 
   {name: 'probablity', text: 'Probablity', type:'int',  width: 80, align: 'center', renderer: renderPrecent, summaryType: 'average', summaryRenderer: renderTPrecent},
   {name: 'descr', text: 'Description', width: 250},
   {name: 'owner', text: 'Owner', width: 160}
];

Ext.define('CRM_REPORT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_FIELDS']
});


fields['CRM_REPORT_PRODUCT_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {name: 'product_barcode', text: 'Баркод', width: 90, align: 'center'}, 
   {name: 'product_brand', text: 'Бренд', width: 150}, 
   {name: 'product_name', text: 'Нэр', width: 250}, 
   {name: 'unit_size', text: 'Нэгж', width: 50, align: 'center'}, 
   {name: 'qty', text: 'Ширхэг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'pty', text: 'Хайрцаг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'amount', align: 'right', type:'float', text: 'Дүн', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}, 
   {name: 'avg_price', text: 'Дундаж үнэ', type:'float',  width: 90, align: 'right', renderer: renderMoney, summaryType: 'average', summaryRenderer: renderTMoney}
];

Ext.define('CRM_REPORT_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_PRODUCT_FIELDS']
});

fields['CRM_REPORT_CUSTOMER_PRODUCT_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'crm_name', text: 'Харилцагч', width: 250}, 
   {name: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {name: 'product_brand', text: 'Бренд', width: 150}, 
   {name: 'product_name', text: 'Нэр', width: 250}, 
   {name: 'unit_size', text: 'Нэгж', width: 50, align: 'center'}, 
   {name: 'qty', text: 'Ширхэг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'pty', text: 'Хайрцаг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'amount', align: 'right', type:'float', text: 'Борлуулалт', width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}
];

Ext.define('CRM_REPORT_CUSTOMER_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_CUSTOMER_PRODUCT_FIELDS']
});
/*
fields['CRM_REPORT_USER_FIELDS'] = [
   {name: 'owner', text: 'Борлуулагч', width: 150}, 
   {name: 'entry', text: 'Орох ёстой', width: 120, align: 'right'}, 
   {name: 'orson', text: 'Орсон', width: 120, align: 'right'}, 
   {name: 'hiisen', text: 'Борлуулалт хийсэн', width: 120, align: 'right'}, 
   {name: 'cash', text: 'Бэлэн', width: 150, align: 'right', renderer: renderMoney},
   {name: 'lease', text: 'Зээл', width: 150, align: 'right', renderer: renderMoney},
   {name: 'payment', text: 'Зээл төлөлт', width: 150, align: 'right', renderer: renderMoney},
   {name: 'total', text: 'Нийт', width: 150, align: 'right', renderer: renderMoney}
];

Ext.define('CRM_REPORT_USER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_USER_FIELDS']
});
*/

fields['CRM_REPORT_CUSTOMER_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'crm_name', text: 'Харилцагч', width: 250}, 
   {name: 'first', text: 'Эхний үлдэгдэл', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'amount1', align: 'right', type:'float', text: ware_text[0], width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'amount2', align: 'right', type:'float', text: ware_text[1], width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'amount', align: 'right', type:'float', text: 'Нийт', width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'paid', text: 'Төлсөн', type:'float',  width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'ret', text: 'Буцаалт', type:'float',  width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'changeprice', text: 'Үнэ өөрчлөлт', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'discount', text: 'Хөнгөлөлт', type:'float',  width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'last', text: 'Эцсийн үлдэгдэл', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
];
Ext.define('CRM_REPORT_CUSTOMER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_CUSTOMER_FIELDS']
});
fields['CRM_REPORT_CUSTOMER1_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'crm_name', text: 'Харилцагч', width: 250}, 
   {name: 'first', text: 'Эхний үлдэгдэл', type:'float',  width: 110, align: 'right', summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'entry', text: 'Давтамж', align: 'right', type:'float', width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'first', align: 'right', type:'float', width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'amount', align: 'right', type:'float', text: 'Нийт', width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'paid', text: 'Төлсөн', type:'float',  width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'ret', text: 'Буцаалт', type:'float',  width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'changeprice', text: 'Үнэ өөрчлөлт', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'discount', text: 'Хөнгөлөлт', type:'float',  width: 100, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'last', text: 'Эцсийн үлдэгдэл', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
];
Ext.define('CRM_REPORT_CUSTOMER1', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_CUSTOMER1_FIELDS']
});

fields['CRM_REPORT_STORAGE_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {name: 'product_barcode', text: 'Баркод', width: 90, align: 'center'}, 
   {name: 'product_brand', text: 'Бренд', width: 150}, 
   {name: 'product_name', text: 'Нэр', width: 250}, 
   {name: 'unit_size', text: 'Нэгж', width: 50, align: 'center'}, 
   {name: 'first', type: 'float', width: 85, text: 'Эхний үлдэгдэл', width: 110, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'incoming', type: 'float', width: 85, text: 'Нэмэгдсэн', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'ret', type: 'float', width: 85, text: 'Буцаалт', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'sales', type: 'float', width: 85, text: 'Борлуулалт', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'promo', type: 'float', width: 85, text: 'Урамшуулал', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'last', type: 'float', width: 85, text: 'Эцсийн үлдэгдэл', width: 110, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber}
];

Ext.define('CRM_REPORT_STORAGE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_STORAGE_FIELDS']
});


fields['CRM_REPORT_STORAGE_DAILY_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {name: 'product_barcode', text: 'Баркод', width: 90, align: 'center'}, 
   {name: 'product_brand', text: 'Бренд', width: 150}, 
   {name: 'product_name', text: 'Нэр', width: 250}, 
   {name: 'unit_size', text: 'Нэгж', width: 50, align: 'center'}, 
   {name: 'first', type: 'float', width: 85, text: 'Эхний үлдэгдэл', width: 110, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'incoming', type: 'float', width: 85, text: 'Нэмэгдсэн', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'ret', type: 'float', width: 85, text: 'Буцаалт', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'sales', type: 'float', width: 85, text: 'Борлуулалт', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'promo', type: 'float', width: 85, text: 'Урамшуулал', width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'bm1', type: 'float', width: 85, text: ware_text[2], width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'bm3', type: 'float', width: 85, text: ware_text[3], width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'shop', type: 'float', width: 85, text: ware_text[4], width: 100, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'last', type: 'float', width: 85, text: 'Эцсийн үлдэгдэл', width: 120, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},

   {name: 'total', type: 'float', width: 85, text: 'Нийт үлдэгдэл', width: 110, align: 'right', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber}
];

Ext.define('CRM_REPORT_STORAGE_DAILY', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_STORAGE_DAILY_FIELDS']
});


columns['CRM_REPORT_STORAGE_TRANSFER_COLUMNS'] = [
   {dataIndex: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {dataIndex: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {dataIndex: 'product_brand', text: 'Бренд', width: 150}, 
   {dataIndex: 'product_name', text: 'Нэр', width: 250}, 
   {dataIndex: 'unit_size', text: 'Нэгж', width: 50, align: 'center'}, 
   {
	   text: 'Хүнс',
	   columns: [{dataIndex:'w11', text: 'Ширхэг', width: 90, align: 'right', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'w12', text: 'Хайрцаг', width: 90, align: 'right', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}
				]
   },
   {
	   text: 'Гоо сайхан',
	   columns: [{dataIndex:'w21', text: 'Ширхэг', width: 90, align: 'right', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'w22', text: 'Хайрцаг', width: 90, align: 'right', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}
				]
   }
];

fields['CRM_CAMPAIGN_RESULT_FIELDS'] = [
   {name: 'owner', text: 'Owner', width: 120}, 
   {name: 'team', text: 'Team', width: 120, hidden: true}, 
   {name: 'pending', text: 'Pending', type:'int', width: 60, align: 'center', renderer: renderENumber, summaryType: 'sum', summaryRenderer: renderTNumber}, 
   {name: 'remind', text: 'Remind', type:'int', width: 60, align: 'center', renderer: renderENumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'success', text: 'Success', type:'int', width: 60, align: 'center', renderer: renderENumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'total', text: 'Total', type:'int', width: 70, align: 'center', renderer: renderENumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'performance', text: 'Performance', type:'float', width: 70, align: 'center', renderer: renderPrecent, summaryType: 'average', summaryRenderer: renderTPrecent}  
];

Ext.define('CRM_CAMPAIGN_RESULT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CAMPAIGN_RESULT_FIELDS']
});


fields['CRM_REPORT_REVENUE_FIELDS'] = [
   {name: 'owner', text: 'Owner', width: 250}, 
   {name: 'team', text: 'Team', width: 250}, 
   {name: 'actual_revenue', text: 'Actual revenue', type:'float', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}, 
   {name: 'expected_revenue', text: 'Expected revenue', type:'float', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'target_revenue', text: 'Target revenue', type:'float', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'perform', text: 'Performance', type:'float', width: 100, align: 'right', renderer: renderPrecent, summaryType: 'average', summaryRenderer: renderTPrecent}  
];

Ext.define('CRM_REPORT_REVENUE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_REVENUE_FIELDS']
});

fields['CRM_REPORT_COMPARE_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {name: 'product_barcode', text: 'Баркод', width: 90, align: 'center'}, 
   {name: 'product_brand', text: 'Бренд', width: 150}, 
   {name: 'product_name', text: 'Нэр', width: 250}, 
   {name: 'unit_size', text: 'Нэгж', width: 50, align: 'center'}, 
   {name: 'qty', text: 'Ширхэг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'pty', text: 'Хайрцаг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'amount', align: 'right', type:'float', text: 'Дүн', width: 130, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}, 
   {name: 'bulgantsetseg', text: 'Булганцэцэг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'nyamsvren', text: 'Нямсүрэн', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'emkhtsetseg', text: 'Энхцэцэг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'gantuya', text: 'Гантуяа', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'gantuul', text: 'Гантуул', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'oyunaa', text: 'Оюун', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'altanhuyag', text: 'Алтанхуяг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'erkhembayar', text: 'Эрхэмбаяр', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'altanchimeg', text: 'Алтанчимэг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'munkhjargal', text: 'Мөнхжаргал', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'tumurbaatar', text: 'Төмөрбаатар', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'narantuya', text: 'Нарантуяа', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'otgonzayab@', text: 'Отгонзаяа Б', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'altantsetseg', text: 'Алтанцэцэг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'shurentsetseg', text: 'Шүрэнцэцэг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'unurtsetseg', text: 'Өнөрцэцэг', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'ankhzaya', text: 'Анхзаяа', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'batchimegd', text: 'Батчимэг Д ', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
];

Ext.define('CRM_REPORT_COMPARE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_COMPARE_FIELDS']
});
fields['CRM_REPORT_SALES_CUSTOMER_FIELDS'] = [
	{name:'owner',text:"Худалдааны төлөөлөгч",width:150},
	{name:'crm_name',text:"Харилцагчийн нэр",width:200},
	{name:'product_name',text:"Барааны нэр",width:200},
	{name:'product_code',text:"Барааны код",width:100},
	{name:'vendor',text:'Үйлдвэрлэгч',width:110},
	{name:'qty',text:'Тоо ширхэг',type:'float',width:100,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
	{name:'unit_type',text:'Нэгж',width:80},
	{name:'price',text:'Үнэ',type:'float',width:150,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
	{name:'amount',text:'Үнийн дүн',type:'float',width:150,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
	{name:'cash',text:'Бэлэн борлуулалт',type:'float',width:150,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
	{name:'lease',text:'Зээлийн борлуулалт',type:'float',width:150,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
	{name:'discount',text:'Урамшуулал',type:'float',width:150,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
	{name:'_return',text:'Буцаалт',type:'float',width:150,renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}
];
Ext.define('CRM_REPORT_SALES_CUSTOMER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_SALES_CUSTOMER_FIELDS']
});
fields['CRM_REPORT_COMPARE_PRODUCT_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 180, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 60}, 
   {name: 'product_name', text: 'Барааны нэр', width: 250}, 
   {name: 'product_barcode', text: 'Бар код', width: 90}, 
   {name: 'product_brand', text: 'Бренд', width: 180}, 
   {name: 'month1', text: '1 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month2', text: '2 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month3', text: '3 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month4', text: '4 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},    
   {name: 'month5', text: '5 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month6', text: '6 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month7', text: '7 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month8', text: '8 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month9', text: '9 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month10', text: '10 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month11', text: '11 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month12', text: '12 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}
];

Ext.define('CRM_REPORT_COMPARE_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_COMPARE_PRODUCT_FIELDS']
});

fields['CRM_REPORT_COMPARE_CUSTOMER_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 180, hidden: true}, 
   {name: 'crm_name', text: 'Харилцагчийн нэр', width: 250}, 
   {name: 'month1', text: '1 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month2', text: '2 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month3', text: '3 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month4', text: '4 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},    
   {name: 'month5', text: '5 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month6', text: '6 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month7', text: '7 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month8', text: '8 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month9', text: '9 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month10', text: '10 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month11', text: '11 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month12', text: '12 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}
];

Ext.define('CRM_REPORT_COMPARE_CUSTOMER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_COMPARE_CUSTOMER_FIELDS']
});

fields['CRM_REPORT_COMPARE_USER_FIELDS'] = [
   {name: 'owner', text: 'Борлуулагчийн нэр', width: 250}, 
   {name: 'month1', text: '1 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month2', text: '2 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month3', text: '3 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month4', text: '4 сар', type:'float', width: 130, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},    
   {name: 'month5', text: '5 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month6', text: '6 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month7', text: '7 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month8', text: '8 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month9', text: '9 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month10', text: '10 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month11', text: '11 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'month12', text: '12 сар', type:'float', width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'precent', text: 'Эзлэх хувь', type:'float', width: 110, align: 'right', renderer: renderPrecent, summaryType: 'average', summaryRenderer: renderTPrecent}
];

Ext.define('CRM_REPORT_COMPARE_USER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_COMPARE_USER_FIELDS']
});

fields['CRM_REPORT_CASE_FIELDS'] = [
   {name: 'owner', text: 'Owner', width: 250}, 
   {name: 'section', text: 'Section', width: 150}, 
   {name: 'c1', type:'int', text: 'Pending', align: 'center', width: 60}, 
   {name: 'c2', type:'int', text: 'Remind', align: 'center', width: 60}, 
   {name: 'c3', type:'int', text: 'Success', align: 'center', width: 90}, 
   {name: 'c4', type:'int', text: 'Success', align: 'center', width: 90}, 
   {name: 'c5', type:'int', text: 'Success', align: 'center', width: 90}, 
   {name: 'p1', type:'int', text: 'Meeting', align: 'center', width: 90}, 
   {name: 'p2', type:'int', text: 'Phone call', align: 'center', width: 90}, 
   {name: 'p3', type:'int', text: 'Email', align: 'center', width: 90}, 
   {name: 's1', type:'int', text: 'Qty', align: 'center', width: 90}, 
   {name: 's2', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 's3', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 'd1', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 'd2', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 'e1', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 'e2', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 't1', type:'int', text: 'Amount', align: 'center', width: 90},
   {name: 't2', type:'int', text: 'Amount', align: 'center', width: 90}
];

Ext.define('CRM_REPORT_CASE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_CASE_FIELDS']
});

columns['CRM_REPORT_CASE_COLUMNS'] = [
   {dataIndex: 'owner', text: 'Owner', width: 150}, 
   {dataIndex: 'section', text: 'Team', width: 150}, 
   {
	   text: 'Дуудлагын төрөл',
	   columns: [{dataIndex:'c1', text: 'Дуудлагын бүртгэл', width: 120, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'c2', text: 'Мэдээлэл хүссэн хүмүүсийн бүртгэл', width: 120, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'c3', text: 'Санал гомдлын бүртгэл', width: 120, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'c4', text: 'Мэдээлэл хүргүүлсэн бүртгэл', width: 120, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'c5', text: 'Бусад', width: 60, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}
				]
   },
   {
	   text: 'Priority',
	   columns: [{dataIndex:'p1', text: 'Low', width: 50, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'p2', text: 'Medium', width: 60, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'p3', text: 'High', width: 50, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}]
   },
   {
	   text: 'Stage',
	   columns: [{dataIndex:'s1', text: 'Identify', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'s2', text: 'Research', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'s3', text: 'Resolve', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}]
   },
   {
	   text: 'Direction',
	   columns: [{dataIndex:'d1', text: 'Inbound', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'d2', text: 'Outbound', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}]
   },
   {
	   text: 'Call center',
	   columns: [{dataIndex:'e1', text: '94097007', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'e2', text: '70107007', width: 70, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}]
   },
   {
	   text: 'Transfer',
	   columns: [{dataIndex:'t1', text: 'sukh@mandal', width: 80, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'t2', text: 'myagmartseren@madal', width: 80, align: 'center', renderer: renderIntNumber, summaryType: 'sum', summaryRenderer: renderTNumber}]
   }
];


fields['CRM_REPORT_ACTIVITY_FIELDS'] = [
   {name: 'owner', text: 'Owner', width: 250}, 
   {name: 'section', text: 'Section', width: 150}, 
   {name: 'call_p', text: 'Phone call', align: 'center', width: 60}, 
   {name: 'email_p', text: 'Email', align: 'center', width: 60}, 
   {name: 'meeting_p', text: 'Plan', align: 'center', width: 90}, 
   {name: 'meeting_q', text: 'Success', align: 'center', width: 90}, 
   {name: 'meeting_t', text: '%', align: 'center', width: 90}, 
   {name: 'quote_p', text: 'Plan', align: 'center', width: 90}, 
   {name: 'quote_q', text: 'Success', align: 'center', width: 90}, 
   {name: 'quote_t', text: '%', align: 'center', width: 90}, 
   {name: 'newcus_p', text: 'Plan', align: 'center', width: 90}, 
   {name: 'newcus_q', text: 'Success', align: 'center', width: 90}, 
   {name: 'newcus_t', text: '%', align: 'center', width: 90}, 
   {name: 'expat_p', text: 'Plan', align: 'center', width: 90}, 
   {name: 'expat_q', text: 'Success', align: 'center', width: 90}, 
   {name: 'expat_t', text: '%', align: 'center', width: 90}, 
   {name: 'vip_p', text: 'Plan', align: 'center', width: 90}, 
   {name: 'vip_q', text: 'Success', align: 'center', width: 90},
   {name: 'vip_t', text: '%', align: 'center', width: 90},
   {name: 'ext_p', text: 'Plan', align: 'center', width: 90}, 
   {name: 'ext_q', text: 'Success', align: 'center', width: 90},
   {name: 'ext_t', text: '%', align: 'center', width: 90}   
];

Ext.define('CRM_REPORT_ACTIVITY', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_ACTIVITY_FIELDS']
});

columns['CRM_REPORT_ACTIVITY_COLUMNS'] = [
   {dataIndex: 'owner', text: 'Owner', width: 150}, 
   {dataIndex: 'section', text: 'Team', width: 150}, 
   {dataIndex: 'call_p', text: 'Phone call', type:'int', align: 'center', width: 60, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber}, 
   {dataIndex: 'email_p', text: 'Email', type:'int', align: 'center', width: 60, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber}, 
   {
	   text: 'Meeting',
	   columns: [{dataIndex:'meeting_p', text: 'Plan', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'meeting_q', text: 'Perform', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'meeting_t', text: '%', width: 50, align: 'center', renderer: renderPrecent}]
   },
   {
	   text: 'Quote',
	   columns: [{dataIndex:'quote_p', text: 'Plan', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'quote_q', text: 'Perform', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'quote_t', text: '%', width: 50, align: 'center', renderer: renderPrecent}]
   },
   {
	   text: 'New Customer',
	   columns: [{dataIndex:'newcus_p', text: 'Plan', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'newcus_q', text: 'Perform', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'newcus_t', text: '%', width: 50, align: 'center', renderer: renderPrecent}]
   },
   {
	   text: 'Expat Customer',
	   columns: [{dataIndex:'expat_p', text: 'Plan', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'expat_q', text: 'Perform', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'expat_t', text: '%', width: 50, align: 'center', renderer: renderPrecent}]
   },
   {
	   text: 'VIP Customer',
	   columns: [{dataIndex:'vip_p', text: 'Plan', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'vip_q', text: 'Perform', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'vip_t', text: '%', width: 50, align: 'center', renderer: renderPrecent}]
   },
   {
	   text: 'Extended contracts',
	   columns: [{dataIndex:'ext_p', text: 'Plan', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'ext_q', text: 'Perform', width: 60, align: 'center', renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
				 {dataIndex:'ext_t', text: '%', width: 50, align: 'center', renderer: renderPrecent}]
   },
   {dataIndex:'term_p', text: 'Termination', width: 90, align: 'center', renderer: renderReportNumber}
];


columns['CRM_REPORT_RESELLER_COLUMNS'] = [
   {dataIndex: 'crm_name', text: 'Reseller name', width: 250}, 
   {dataIndex: 'owner', text: 'Owner', width: 150}, 
   {
	   text: 'Activity',
	   columns: [{dataIndex:'meeting', text: 'Meeting', width: 70, align: 'center', summaryType: 'sum', renderer: renderReportNumber},
				 {dataIndex:'phonecall', text: 'Phone call', width: 70, align: 'center', summaryType: 'sum', renderer: renderReportNumber},
				 {dataIndex:'email', text: 'Email', width: 70, align: 'center', summaryType: 'sum', renderer: renderReportNumber}]
   },
   {
	   text: 'Total',
	   columns: [{dataIndex:'total_qty', text: 'Qty', width: 70, align: 'right', summaryType: 'sum', renderer: renderReportNumber, summaryRenderer: renderTNumber},
				 {dataIndex:'total_amount', text: 'Amount', width: 130, align: 'right', summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney}]
   },
   {
	   text: 'АВТОТЭЭВРИЙН ХЭРЭГСЛИЙН',
	   columns: [{dataIndex:'p1_qty', text: 'Qty', width: 60, align: 'right', summaryType: 'sum', renderer: renderReportNumber, summaryRenderer: renderTNumber},
				 {dataIndex:'p1_amount', text: 'Amount', width: 110, align: 'right', summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney}]
   },
   {
	   text: 'АЛБАН ЖУРМЫН ЖОЛООЧИЙН',
	   columns: [{dataIndex:'p2_qty', text: 'Qty', width: 60, align: 'right', summaryType: 'sum', renderer: renderReportNumber, summaryRenderer: renderTNumber},
				 {dataIndex:'p2_amount', text: 'Amount', width: 110, align: 'right', summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney}]
   },
   {
	   text: 'ЭД ХӨРӨНГИЙН',
	   columns: [{dataIndex:'p3_qty', text: 'Qty', width: 60, align: 'right', summaryType: 'sum', renderer: renderReportNumber, summaryRenderer: renderTNumber},
				 {dataIndex:'p3_amount', text: 'Amount', width: 110, align: 'right', summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney}]
   },
   {
	   text: 'ЗЭЭЛДЭГЧИЙН ГЭНЭТИЙН ОСЛЫН',
	   columns: [{dataIndex:'p4_qty', text: 'Qty', width: 60, align: 'right', summaryType: 'sum', renderer: renderReportNumber, summaryRenderer: renderTNumber},
				 {dataIndex:'p4_amount', text: 'Amount', width: 110, align: 'right', summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney}]
   },
   {
	   text: 'ГАДААД ЗОРЧИГЧИЙН',
	   columns: [{dataIndex:'p5_qty', text: 'Qty', width: 60, align: 'right', summaryType: 'sum', renderer: renderReportNumber},
				 {dataIndex:'p5_amount', text: 'Amount', width: 110, align: 'right', summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney}]
   }   
];


function renderClass(v) {
/*	if (v == 'CORPORATE' || v == 'RETAIL') 
		return '';*/
	return '<span style="font-size:10px">'+v+'</span>';
}

function renderTip(v, metadata, record, rowIndex, colIndex, store) {
	//metadata.tdAttr = 'data-qtip="<b>double click</b></br>"'	
	return '<a href="javascript:customerInfo(\''+record.data['crm_id']+'\')" class="select_customer">'+v+'</a>';
}

function renderPassword(v) {
	return "**********";
}

function getDaysBetweenDates(d0, d1) {

  var msPerDay = 8.64e7;

  // Copy dates so don't mess them up
  var x0 = new Date(d0);
  var x1 = new Date(d1);

  // Set to noon - avoid DST errors
  x0.setHours(12,0,0);
  x1.setHours(12,0,0);

  // Round to remove daylight saving errors
  return Math.round( (x1 - x0) / msPerDay );
}

function renderExpiredDate(v, metadata, record, rowIndex, colIndex, store) {
	var d = getDaysBetweenDates(new Date(), v);
	if (d < 30 && d > 0)	
		metadata.tdAttr = 'data-qtip="<b>' + d + ' хоног үлдсэн</b></br>"'
	if (d < 0)	
		metadata.tdAttr = 'data-qtip="<b>' + Math.abs(d) + ' хоног хэтэрсэн</b></br>"'

	if (d < 0 || v == '0000-00-00')
		return '<span style="color:red">'+v+'</span>';
	
	return v;
}

function renderExpiredDate1(v) {
	var d = getDaysBetweenDates(new Date(), v);
	if (d < 0)
		return '<span style="color:red">'+v+'</span>';

	return v;
}

function renderUserLevel(v) {
	if (v == -1)
		return 'Ажлаас гарсан';
	if (v == 0)
		return 'Борлуулагч';
	if (v == 1)
		return 'Менежер';
	if (v == 2)
		return 'Ахлах';
	if (v == 3)
		return 'Администратор';
	if (v == 5)
		return 'Захирал';
	if (v == 10)
		return 'Эзэн';
	
	return v;
}

function renderWeekDays(v) {
	if (v == 'all')
		return '';
	if (v == 'mon')
		return 'Даваа';
	if (v == 'thue')
		return 'Мягмар';
	if (v == 'wed')
		return 'Лхагва';
	if (v == 'thur')
		return 'Пүрэв';
	if (v == 'fri')
		return 'Баасан';
	if (v == 'sat')
		return 'Бямба';
	if (v == 'sun')
		return 'Ням';
	
	return v;
}

function renderUserType(v) {
	if (v == 'retail')
		return 'VAN SELLING';
	if (v == 'corporate')
		return 'PRE SELLING';
	
	return v;
}

function renderGPSName(v) {
	if (v.indexOf(';') != -1) {
		var money = renderMoney(v.substring(v.lastIndexOf(';')+1, v.length));
		if (money == '') money = '<span style="color:red">амжилтгүй</span>';		
		v = v.substring(0, v.indexOf(';'))+' <b>'+money+'</b>';	
	}

	return v;
}

function renderDealLevel(v) {
	if (v == 'lead')
		return '<span style="color:magenta">'+v+'</span>';
	if (v == 'opportunity')
		return '<span style="color:orange">'+v+'</span>';
	if (v == 'quote')
		return '<span style="color:blue">'+v+'</span>';
	if (v == 'close as won')
		return '<span style="color:green">'+v+'</span>';
	if (v == 'close as lost' || v == 'disqualified')
		return '<span style="color:red">'+v+'</span>';
	
	return v;
}

function renderSalesType(v) {
	if (v == 'cash')
		return '<span style="color:green">бэлэн</span>';
	if (v == 'loan')
		return '<span style="color:blue">зээл</span>';
	if (v == 'plan')
		return '<span style="color:magenta">ирж байгаа</span>';
	if (v == 'back')
		return '<span style="color:red">буцаалт</span>';
	
	return v;
}

function renderServiceLevel(v) {
	if (v == 'receipt')
		return '<span style="color:magenta">ирсэн</span>';
	if (v == 'service')
		return '<span style="color:orange">олгосон</span>';
	if (v == 'closed')
		return '<span style="color:green">хаагдсан</span>';
	
	if (v == 'return')
		return '<span style="color:red">буцаалт</span>';

	if (v == 'transit')
		return '<span style="color:blue">замд яваа</span>';
	if (v == 'instock')
		return '<span style="color:green">хүлээн авсан</span>';
	
	return v;
}


function renderCaseLevel(v) {
	if (v == 'identify')
		return '<span style="color:magenta">'+v+'</span>';
	if (v == 'research')
		return '<span style="color:orange">'+v+'</span>';
	if (v == 'resolve')
		return '<span style="color:green">'+v+'</span>';
	
	return v;
}

function renderMail(v) {
	return '<a href="mailto:'+v+'"><span style="color:blue; text-decoration: underline;">'+v+'</span></a>';
}

function renderWWW(v) {
	var input = 'http';
	if (v != '' && v.substring(0, input.length) != input)
		v = 'http://'+v;

	return '<a href="'+v+'" target="_blank"><span style="color:blue; text-decoration: underline;">'+v+'</span></a>';
}

function renderLink(v) {
	var input = 'http';
	if (v != '' && v.substring(0, input.length) != input)
		v = 'http://'+v;

	return '<a href="'+v+'" target="_blank"><span style="color:blue; text-decoration: underline;">Attachment</span></a>';
}

function renderCampaign(v, metadata, record, rowIndex, colIndex, store) {	
	if (campaigns[v]) {
		myToolTipText = "<div style='line-height: 20px; width: 200px; background: #fff; border-radius: 3px; border: 1px solid #a9a; padding: 15px;'>";
		myToolTipText = myToolTipText + "Төлөв: "+ campaigns[v].get('campaign_status');
		myToolTipText = myToolTipText + "<br>Төрөл: "+ campaigns[v].get('campaign_type');
		myToolTipText = myToolTipText + "<br>Эхлэх: "+ campaigns[v].get('start_date');
		myToolTipText = myToolTipText + "<br>Дуусах: "+ campaigns[v].get('end_date');
		myToolTipText = myToolTipText + "<br>Expected revenue: <b>"+ renderMoney(campaigns[v].get('expected_revenue'))+"</b>";
		myToolTipText = myToolTipText + "<br>Budgeted cost: <b>"+ renderMoney(campaigns[v].get('budgeted_cost'))+"</b>";
		myToolTipText = myToolTipText + "<br>Anual cost: <b>"+ renderMoney(campaigns[v].get('actual_cost'))+"</b>";
		myToolTipText = myToolTipText + "<br>Тайлбар:<br><i>"+campaigns[v].get('descr')+"</i>";
		myToolTipText = myToolTipText + "</div>";

		metadata.tdAttr = 'data-qtip="' + myToolTipText + '"';
	}

	return v;
}

function renderCRMName(v, metadata, record, rowIndex, colIndex, store) {	
	if (v.indexOf(',') != -1)
	{	
		d = v.split(',');
		c = d[1].split(';');
		myToolTipText = "<div style='line-height: 20px; width: 250px; background: #fff; border-radius: 3px; border: 1px solid #a9a; padding: 15px;'>";
		myToolTipText = myToolTipText + "Last activity time: "+ c[0];
		myToolTipText = myToolTipText + "<br>Phone: <b>"+ c[1]+"</b>";
		myToolTipText = myToolTipText + "<br>Email: <b>"+ c[2]+"</b>";
		myToolTipText = myToolTipText + "</div>";

		metadata.tdAttr = 'data-qtip="' + myToolTipText + '"';
		return d[0];
	}

	return v;
}

function renderWarningByPhone(v, metadata, record, rowIndex, colIndex, store) {
	if (customers[v]) {
		metadata.tdAttr = 'data-qtip="Ойролцоо утга : ' + customers[v].get('firstName') + '</br>Бүртгэгдсэн: '+customers[v].get('_date')+'"';
		return '<span style="color:red">? '+v+'</span>';
	}

	return v;
}

function renderCustomerLevel(v, metadata, record, rowIndex, colIndex, store) {
	if (record.data['_class'].indexOf('VIP') != -1) v = 'vip';	
	metadata.tdAttr = 'data-qtip="<b>' + v + '</b></br>"'

	return '<span class="circle '+v+'">&nbsp;</span>';
}

function renderProductFlag(v, metadata, record, rowIndex, colIndex, store) {
	if (record.data['flag'] == 1)
		return '<span style="color:red;">'+v+'</span>';

	return '<span style="color:green;">'+v+'</span>';
}

function renderPriority(v) {
	return '<span class="priority '+v+'">'+v+'</span>';
}

function renderPhone(v) {
	return '<span class="contact">'+v+'</span>';
}

function renderMessageStatus(v) {
	return '<div class="'+v+'">&nbsp;</div>';
}

function renderWorkType(v) {
	return v.charAt(0).toUpperCase() + v.slice(1);
}

function renderSecond(v) {
	if (v == 0)
		return '';
	return v+' сек';
}

function renderTSecond(v) {
	if (v == 0)
		return '';
	return '<b>'+v+' сек</b>';
}

function renderOwner(v) {
	if (v == logged)
		return '<span style="color:purple">'+v+'</span>';

	return '<span style="color:gray">'+v+'</span>';
}

function renderComplainStatus(v) {
	if (v == 'pending')
		return '<span style="color:red">pending</span>';
	if (v == 'transfered')
		return '<span style="color:orange">transfered</span>';
	if (v == 'closed')
		return '<span style="color:green">closed</span>';

	return v;
}

function renderQuoteStatus(v) {
	if (v == 'draft')
		return '<span style="color:red">draft</span>';
	if (v == 'negotiation')
		return '<span style="color:orange">negotiation</span>';
	if (v == 'delivered')
		return '<span style="color:brown">delivered</span>';
	if (v == 'on hold')
		return '<span style="color:purple">on hold</span>';
	if (v == 'confirmed')
		return '<span style="color:blue">confirmed</span>';
	if (v == 'close as won')
		return '<span style="color:green">close as won</span>';
	if (v == 'close as lost')
		return '<span style="color:red; text-decoration : line-through">close as lost</span>';

	return v;
}

function renderDealName(v) {
	if (v.length < 4)	
		return '';

	return v;
}

function renderServiceName(v) {
	if (v.length < 4)	
		return '';

	return v;
}

function renderPayType(v) {
	if (v == 'cash')
		return '<span style="color:green">Бэлнээр</span>';
	if (v == 'bank')
		return '<span style="color:orange">Бэлэн бусаар</span>';
	return v;
}

function renderCallStatus(v) {
	if (v == 'success')
		return '<span style="color:green">success</span>';
	if (v == 'pending')
		return '<span style="color:orange">pending</span>';
	if (v == 'remind')
		return '<span style="color:blue">remind</span>';
	if (v == 'unsuccess')
		return '<span style="color:red">unsuccess</span>';

	return v;
}

function renderEventStatus(v) {
	if (v == 'success')
		return '<span style="color:green">success</span>';
	if (v == 'pending')
		return '<span style="color:orange">pending</span>';
	if (v == 'cancelled')
		return '<span style="color:red; text-decoration : line-through">cancelled</span>';

	return v;
}


function renderTaskStatus(v) {
	if (v == 'completed')
		return '<span style="color:green">completed</span>';
	if (v == 'pending')
		return '<span style="color:orange">pending</span>';
	if (v == 'failed')
		return '<span style="color:red; text-decoration : line-through">failed</span>';

	return v;
}


function renderCampaignStatus(v) {
	if (v == 'planning')
		return '<span style="color:orange">planning</span>';
	if (v == 'active')
		return '<span style="color:green">active</span>';
	if (v == 'inactive')
		return '<span style="color:red">inactive</span>';
	if (v == 'complete')
		return '<span style="color:purple">complete</span>';

	return v;
}

function renderPrecent(v) {
	if (v == 0)
		return '';

	if (v < 20)
		return '<span style="color:red">'+Ext.util.Format.number(v, '00,00,000.00')+'%</span>';
	if (v >= 20 && v < 75)
		return '<span style="color:orange">'+Ext.util.Format.number(v, '00,00,000.00')+'%</span>';
	if (v >= 75)
		return '<span style="color:green">'+Ext.util.Format.number(v, '00,00,000.00')+'%</span>';
	
	return v;
} 

function renderTPrecent(v) {	
	return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'%</strong>';
}

function renderTopicName(v, metadata, record, rowIndex, colIndex, store) {	
	if (record.data && record.data['notify'])
		return v+' '+record.data['notify'];

	return v;
}


function renderTMoney(v) {
/*	if (logged == 'batbileg@mxc')
		return '--.---';*/
	return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'</strong>';
}

function renderMoney(v) {
	/*if (logged == 'batbileg@mxc')
		return '--.---';*/

	if (v == 0)
		return '';
	return Ext.util.Format.number(v, '00,00,000.00');
}

function renderAutoMoney(v, p, record) {	
	v = record.data['qty']*record.data['price'];
	if (v == 0)
		return '';
	return Ext.util.Format.number(v, '00,00,000.00')+'₮';
}

function renderTNumber(v) {
	return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'</strong>';
}

function renderT4Number(v) {
	return '<strong>'+Ext.util.Format.numberRenderer(v, '0.000')+'</strong>';
}

function renderIntNumber(v) {
	if (v == 0) return '';	
	return Ext.util.Format.number(v, '00,00,000');
}

function renderNumber(v) {
	if (number_float) {
		if (v < 0)
			return '<span style="color:red">'+Ext.util.Format.number(v, '00,00,000.00')+'</span>';

		return Ext.util.Format.number(v, '00,00,000.00');
	} else {
		if (v < 0)
			return '<span style="color:red">'+Ext.util.Format.number(v, '00,00,000')+'</span>';

		return Ext.util.Format.number(v, '00,00,000');
	}
}

function renderENumber(v) {
	return Ext.util.Format.number(v, '00,00,000');
}


function renderReportNumber(v) {
	if (v == 0)
		return '';
	return Ext.util.Format.number(v, '00,00,000.00');
}

function renderTReportNumber(v) {
	if (v == 0)
		return '';
	return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'</strong>';
}


function renderPriceName(v) {
	if (v == 'price')
		return 'Үндсэн үнэ';
	else {
		v = v.substring(5, v.length);
		return price_text[v];
	}
}


function renderDate(v) {
	if (v == '0000-00-00') return '';
	
	var date = new Date(v);
	return Ext.Date.format(date,'Y-m-d');
}

Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

function renderCreatedDate(time) {
	return time;
	/*
	var date = new Date(time);
	if (Math.abs(Date.daysBetween(new Date(), date)) >= 10) {		
		return Ext.Date.format(date,'Y-m-d');
	}	

	switch (typeof time) {
		case 'number': break;
		case 'string': time = +new Date(time); break;
		case 'object': if (time.constructor === Date) time = time.getTime(); break;
		default: time = +new Date();
	}
	var time_formats = [
		[60, 'seconds', 1], // 60
		[120, '1 минутын өмнө', '1 minute from now'], // 60*2
		[3600, 'минутын', 60], // 60*60, 60
		[7200, '1 цагийн өмнө', '1 hour from now'], // 60*60*2
		[86400, 'цагийн', 3600], // 60*60*24, 60*60
		[172800, 'Өчигдөр', 'Маргааш'], // 60*60*24*2
		[604800, 'өдрийн', 86400], // 60*60*24*7, 60*60*24
		[1209600, 'Өнгөрсөн 7 хоног', 'Next week'], // 60*60*24*7*4*2
		[2419200, 'долоо хоног', 604800], // 60*60*24*7*4, 60*60*24*7
		[4838400, 'Өнгөрсөн сар', 'Next month'], // 60*60*24*7*4*2
		[29030400, 'сарын', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
		[58060800, 'Өнгөрсөн жил', 'Next year'], // 60*60*24*7*4*12*2
		[2903040000, 'жилийн', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
		[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
		[58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	];
	var seconds = (+new Date() - time) / 1000,
		token = 'өмнө', list_choice = 1;

	if (seconds < 1*60) {
		return '<span class="gray">Дөнгөж сая</span>'
	}
	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = 'одоогоос';
		list_choice = 2;
	}
	var i = 0, format;
	while (format = time_formats[i++])
		if (seconds < format[0]) {
			if (typeof format[2] == 'string')
				return '<span class="gray">'+format[list_choice]+'</span>';
			else
				return '<span class="gray">'+Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token+'</span>';
		}

	return '<span class="gray">'+time+'</span>';	
	*/
}

function renderTime(v) {
	var date = new Date(v);
	var h = date.getHours();
	var m = date.getMinutes();
	if (isNaN(h)) return v;	
	return (h<10?'0'+h:h) + ":" + (m<10?'0'+m:m);	
}

function renderAny(v) {
	return v;
}

Ext.define('Teller.ext.CurrencyField', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.currencyfield1',
	config: {
        thousandSeparator: ',',
        currencyAtEnd: true,
        currencySign: '₮'
    },

    hideTrigger: true,

    setValue: function (v) {
        this.callParent(arguments);

        if (!Ext.isEmpty(this.getValue())) {
            this.setRawValue(Ext.util.Format.currency(this.getValue()));
        }
    },

    removeFormat: function (v) {
        if (Ext.isEmpty(v)) {
            return '';
        } else {
            v = v.toString().replace(Ext.util.Format.currencySign, '').replace(Ext.util.Format.thousandSeparator, '');
            if (v % 1 === 0) {
                // Return value formatted with no precision since there are no digits after the decimal
                return Ext.util.Format.number(v, '0');
            } else {
                // Return value formatted with precision of two digits since there are digits after the decimal
                return Ext.util.Format.number(v, '0.00');
            }
        }
    },

    // Override parseValue to remove the currency format
    parseValue: function (v) {
        return this.callParent([this.removeFormat(v)]);
    },

    // Remove the format before validating the value
    getErrors: function (v) {
        return this.callParent([this.removeFormat(v)]);
    },

    /* Override getSubmitData to remove the currency format on the value 
    that will be passed out from the getValues method of the form */
    getSubmitData: function () {
        var returnObject = {};
        returnObject[this.name] = this.removeFormat(this.callParent(arguments)[this.name]);

        return returnObject;
    },

    // Override preFocus to remove the format during edit
    preFocus: function () {
        this.setRawValue(this.removeFormat(this.getRawValue()));

        this.callParent(arguments);
    }
});

Ext.define('Ext.ux.form.CurrencyField', {
    extend: 'Ext.form.field.Number',
    alias: ['widget.currencyfieldex'],
    config: {
        thousandSeparator: ',',
        currencyAtEnd: true,
        currencySign: '₮'
    },

    listeners: {
        /**
         * When this component get the focus, change the Currency
         * representation to a Float one for edition.
         *
         * @param me
         * @param eOpts
         */
        focus: function (me, eOpts) {
            me.inputEl.dom.value = this.getValue();
        }
    },

    /**
     * Converts a Float value into a currency formated value ready to display .
     *
     * @param {Object} value
     * @return {Object} The converted value.
     */
    valueToCurrency: function (value) {
        var format = Ext.util.Format;
        format.currencyPrecision = this.decimalPrecision;
        format.thousandSeparator = this.thousandSeparator;
        format.currencySign = this.currencySign;
        format.currencyAtEnd = true;
        return format.currency(value);
    },

    /**
     * Converts a mixed-type value to a raw representation suitable for displaying in the field. This allows controlling
     * how value objects passed to {@link #setValue} are shown to the user, including localization.
     *
     * See {@link #rawToValue} for the opposite conversion.
     *
     * This implementation converts the raw value to a value formated as currency.
     *
     * @param {Object} value The mixed-type value to convert to the raw representation.
     * @return {Object} The converted raw value.
     */
    valueToRaw: function (value) {
        return this.valueToCurrency(value);
    },

    /**
     * Performs any necessary manipulation of a raw String value to prepare it for conversion and/or
     * {@link #validate validation}. Overrided to apply the {@link #parseValue}
     * to the raw value.
     *
     * @param {String} value The unprocessed string value
     * @return {String} The processed string value
     */
    processRawValue: function (value) {
        return this.parseValue(this.callParent(arguments));
    },

    /**
     * Overrided to remove thousand separator.
     *
     * @param value
     */
    parseValue: function (value) {
        value = String(value).replace(this.thousandSeparator, "");
        value = parseFloat(String(value).replace(this.decimalSeparator, '.'));
        return isNaN(value) ? null : value;
    }
});


Ext.define('Ext.ux.form.NumericField', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.currencyfield',
    
    currencySymbol: '₮',
    currencySymbolPos : 'left', 
    useThousandSeparator: true,
    thousandSeparator: ',',
    alwaysDisplayDecimals: true,
    fieldStyle: 'text-align: right;',
    hideTrigger: true,
    
    initComponent: function(){
        if (this.useThousandSeparator && this.decimalSeparator == ',' && this.thousandSeparator == ',') 
            this.thousandSeparator = '.';
        else 
            if (this.allowDecimals && this.thousandSeparator == '.' && this.decimalSeparator == '.') 
                this.decimalSeparator = ',';
        
        this.callParent(arguments);
    },
    setValue: function(value){
        Ext.ux.form.NumericField.superclass.setValue.call(this, value !=  null ? value.toString().replace('.', this.decimalSeparator) : value);
        
        this.setRawValue(this.getFormattedValue(this.getValue()));
    },
    getFormattedValue: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat()) 
            return value;
        else 
        {
            var neg = null;
            
            value = (neg = value < 0) ? value * -1 : value;
            value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;
            
            if (this.useThousandSeparator) 
            {
                if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator)) 
                    throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');
                
                if (this.thousandSeparator == this.decimalSeparator) 
                    throw ('NumberFormatException: invalid  thousandSeparator, thousand separator must be different from  decimalSeparator.');
                
                value = value.toString();
                
                
                var ps = value.split('.');
                ps[1] = ps[1] ? ps[1] : null;
                
                var whole = ps[0];
                
                var r = /(\d+)(\d{3})/;
                
                var ts = this.thousandSeparator;
                
                while (r.test(whole)) 
                    whole = whole.replace(r, '$1' + ts + '$2');
                
                value = whole;
                
            }
            
            if (this.currencySymbolPos == 'right') {
                return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''),  value, (Ext.isEmpty(this.currencySymbol) ? '' : ' ' +  this.currencySymbol));
            } else {
                return Ext.String.format('{0}{1}{2}', (neg ? '-'  : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + '  '), value);
            }
        }
    },
    
    parseValue: function(value){
        return Ext.ux.form.NumericField.superclass.parseValue.call(this, this.removeFormat(value));
    },
    
    removeFormat: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat()) 
            return value;
        else 
        {
            if (this.currencySymbolPos == 'right') {
                value = value.toString().replace(' ' + this.currencySymbol, '');
            } else {
                value = value.toString().replace(this.currencySymbol + ' ', '');
            }
            
            value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;
            
            return value;
        }
    },
    
    getErrors: function(value){
        return Ext.ux.form.NumericField.superclass.getErrors.call(this, this.removeFormat(value));
    },
    hasFormat: function(){
        return this.decimalSeparator != '.' ||  (this.useThousandSeparator == true && this.getRawValue() !=  null) || !Ext.isEmpty(this.currencySymbol) ||  this.alwaysDisplayDecimals;
    },
    
    listeners:{
      'change':function(){
          val=this.getFormattedValue(this.parseValue(this.getRawValue()));
          this.setValue(val);
      }  
    },
    processRawValue: function(value) {
        return this.removeFormat(value);
    }
});



Ext.define('Ext.ux.mxc.NumericField',
{
    extend: 'Ext.form.field.Number',//Extending the NumberField
    alias: 'widget.numericfield',//Defining the xtype,
    currencySymbol: null,
    useThousandSeparator: true,
    thousandSeparator: ',',
    alwaysDisplayDecimals: false,
    fieldStyle: 'text-align: right;',
    
	initComponent: function(){
        if (this.useThousandSeparator && this.decimalSeparator == ',' && this.thousandSeparator == ',')
            this.thousandSeparator = '.';
        else
            if (this.allowDecimals && this.thousandSeparator == '.' && this.decimalSeparator == '.')
                this.decimalSeparator = ',';
       
        this.callParent(arguments);
    },
    setValue: function(value){
        Ext.ux.form.NumericField.superclass.setValue.call(this, value != null ? value.toString().replace('.', this.decimalSeparator) : value);
       
        this.setRawValue(this.getFormattedValue(this.getValue()));
    },
    getFormattedValue: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat())
            return value;
        else
        {
            var neg = null;
           
            value = (neg = value < 0) ? value * -1 : value;
            value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;
           
            if (this.useThousandSeparator)
            {
                if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator))
                    throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');
               
                if (this.thousandSeparator == this.decimalSeparator)
                    throw ('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');
               
                value = value.toString();
               
                var ps = value.split('.');
                ps[1] = ps[1] ? ps[1] : null;
               
                var whole = ps[0];
               
                var r = /(\d+)(\d{3})/;
               
                var ts = this.thousandSeparator;
               
                while (r.test(whole))
                    whole = whole.replace(r, '$1' + ts + '$2');
               
                value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
            }
           
            return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + ' '), value);
        }
    },
    /**
     * overrides parseValue to remove the format applied by this class
     */
    parseValue: function(value){
        //Replace the currency symbol and thousand separator
        return Ext.ux.form.NumericField.superclass.parseValue.call(this, this.removeFormat(value));
    },
    /**
     * Remove only the format added by this class to let the superclass validate with it's rules.
     * @param {Object} value
     */
    removeFormat: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat())
            return value;
        else
        {
            value = value.toString().replace(this.currencySymbol + ' ', '');
           
            value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;
           
            return value;
        }
    },
    /**
     * Remove the format before validating the the value.
     * @param {Number} value
     */
    getErrors: function(value){
        return Ext.ux.form.NumericField.superclass.getErrors.call(this, this.removeFormat(value));
    },
    hasFormat: function(){
        return this.decimalSeparator != '.' || (this.useThousandSeparator == true && this.getRawValue() != null) || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;
    },
    /**
     * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
     * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
     */
    onFocus: function(){
        this.setRawValue(this.removeFormat(this.getRawValue()));
       
        this.callParent(arguments);
    }
});

Ext.override('Ext.data.Store', {

  fireEvent: function(eventName, store) {
    if(store && store.isStore && eventName === "datachanged") {
      this.sortGroupedStore();
    }
    
    return this.callParent(arguments);
  },

  sortGroupedStore: function() {
    if (this.isGrouped()) {


      var me = this,
          collection = me.data,
          items = [],
          keys = [],
          groups, length, children, lengthChildren,
          i, j;


      groups = me.getGroups();
      length = groups.length;


      for (i = 0; i < length; i++) {
        children = groups[i].children;
        lengthChildren = children.length;


        for (j = 0; j < lengthChildren; j++) {
          items.push(children[j]);
          keys.push(children[j].internalId);
        }
      }


      collection.items = items;
      collection.keys = keys;


      collection.fireEvent('sort', collection, items, keys);
    }
  }
}); 

function customerInfo(crm_id) {
/*	var store = views['retail_list'];
	var record = new store.recordType({
		crm_id: crm_id,
		parent_crm_id: crm_id,
		type: 'БАЙГУУЛЛГА',
		firstName: ''
	});*/

	new OCS.CustomerDetailWindow({
		
	}).show();
}

String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;

    if ( typeof token === "string" ) {

        if ( ignoreCase ) {

            _token = token.toLowerCase();

            while( (
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }

        } else {
            return this.split( token ).join( newToken );
        }

    }
return str;
};


/* 
 *	Notification extension for Ext JS 4.0.2+
 *	Version: 2.1.3
 *
 *	Copyright (c) 2011 Eirik Lorentsen (http://www.eirik.net/)
 *
 *	Follow project on GitHub: https://github.com/EirikLorentsen/Ext.ux.window.Notification
 *
 *	Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 *	and GPL (http://opensource.org/licenses/GPL-3.0) licenses.
 *
 */

Ext.define('Ext.ux.window.Notification', {
	extend: 'Ext.window.Window',
	alias: 'widget.uxNotification',

	cls: 'ux-notification-window',
	autoClose: true,
	autoHeight: true,
	plain: false,
	draggable: false,
	shadow: false,
	focus: Ext.emptyFn,

	// For alignment and to store array of rendered notifications. Defaults to document if not set.
	manager: null,

	useXAxis: false,

	// Options: br, bl, tr, tl, t, l, b, r
	position: 'br',

	// Pixels between each notification
	spacing: 6,

	// Pixels from the managers borders to start the first notification
	paddingX: 30,
	paddingY: 10,
	
	minWidth: 200,

	slideInAnimation: 'easeIn',
	slideBackAnimation: 'bounceOut',
	slideInDuration: 500,
	slideBackDuration: 1000,
	hideDuration: 500,
	autoCloseDelay: 10000,
	stickOnClick: true,
	stickWhileHover: true,

	// Private. Do not override!
	isHiding: false,
	isFading: false,
	destroyAfterHide: false,
	closeOnMouseOut: false,

	// Caching coordinates to be able to align to final position of siblings being animated
	xPos: 0,
	yPos: 0,

	statics: {
		defaultManager: {
			el: null
		}
	},

	initComponent: function() {
		var me = this;

		// Backwards compatibility
		if (Ext.isDefined(me.corner)) {
			me.position = me.corner;
		}
		if (Ext.isDefined(me.slideDownAnimation)) {
			me.slideBackAnimation = me.slideDownAnimation;
		}
		if (Ext.isDefined(me.autoDestroyDelay)) {
			me.autoCloseDelay = me.autoDestroyDelay;
		}
		if (Ext.isDefined(me.autoHideDelay)) {
			me.autoCloseDelay = me.autoHideDelay;
		}
		if (Ext.isDefined(me.autoHide)) {
			me.autoClose = me.autoHide;
		}
		if (Ext.isDefined(me.slideInDelay)) {
			me.slideInDuration = me.slideInDelay;
		}
		if (Ext.isDefined(me.slideDownDelay)) {
			me.slideBackDuration = me.slideDownDelay;
		}
		if (Ext.isDefined(me.fadeDelay)) {
			me.hideDuration = me.fadeDelay;
		}

		// 'bc', lc', 'rc', 'tc' compatibility
		me.position = me.position.replace(/c/, '');

		me.updateAlignment(me.position);

		me.setManager(me.manager);

		me.callParent(arguments);
	},

	onRender: function() {
		var me = this;
		me.callParent(arguments);

		me.el.hover(
			function () {
				me.mouseIsOver = true;
			},
			function () {
				me.mouseIsOver = false;
				if (me.closeOnMouseOut) {
					me.closeOnMouseOut = false;
					me.close();
				}
			},
			me
		);

	},
	
	updateAlignment: function (position) {
		var me = this;

		switch (position) {
			case 'br':
				me.paddingFactorX = -1;
				me.paddingFactorY = -1;
				me.siblingAlignment = "br-br";
				if (me.useXAxis) {
					me.managerAlignment = "bl-br";
				} else {
					me.managerAlignment = "tr-br";
				}
				break;
			case 'bl':
				me.paddingFactorX = 1;
				me.paddingFactorY = -1;
				me.siblingAlignment = "bl-bl";
				if (me.useXAxis) {
					me.managerAlignment = "br-bl";
				} else {
					me.managerAlignment = "tl-bl";
				}
				break;
			case 'tr':
				me.paddingFactorX = -1;
				me.paddingFactorY = 1;
				me.siblingAlignment = "tr-tr";
				if (me.useXAxis) {
					me.managerAlignment = "tl-tr";
				} else {
					me.managerAlignment = "br-tr";
				}
				break;
			case 'tl':
				me.paddingFactorX = 1;
				me.paddingFactorY = 1;
				me.siblingAlignment = "tl-tl";
				if (me.useXAxis) {
					me.managerAlignment = "tr-tl";
				} else {
					me.managerAlignment = "bl-tl";
				}
				break;
			case 'b':
				me.paddingFactorX = 0;
				me.paddingFactorY = -1;
				me.siblingAlignment = "b-b";
				me.useXAxis = 0;
				me.managerAlignment = "t-b";
				break;
			case 't':
				me.paddingFactorX = 0;
				me.paddingFactorY = 1;
				me.siblingAlignment = "t-t";
				me.useXAxis = 0;
				me.managerAlignment = "b-t";
				break;
			case 'l':
				me.paddingFactorX = 1;
				me.paddingFactorY = 0;
				me.siblingAlignment = "l-l";
				me.useXAxis = 1;
				me.managerAlignment = "r-l";
				break;
			case 'r':
				me.paddingFactorX = -1;
				me.paddingFactorY = 0;
				me.siblingAlignment = "r-r";
				me.useXAxis = 1;
				me.managerAlignment = "l-r";
				break;
			}
	},
	
	getXposAlignedToManager: function () {
		var me = this;

		var xPos = 0;

		// Avoid error messages if the manager does not have a dom element
		if (me.manager && me.manager.el && me.manager.el.dom) {
			if (!me.useXAxis) {
				// Element should already be aligned vertically
				return me.el.getLeft();
			} else {
				// Using getAnchorXY instead of getTop/getBottom should give a correct placement when document is used
				// as the manager but is still 0 px high. Before rendering the viewport.
				if (me.position == 'br' || me.position == 'tr' || me.position == 'r') {
					xPos += me.manager.el.getAnchorXY('r')[0];
					xPos -= (me.el.getWidth() + me.paddingX);
				} else {
					xPos += me.manager.el.getAnchorXY('l')[0];
					xPos += me.paddingX;
				}
			}
		}

		return xPos;
	},

	getYposAlignedToManager: function () {
		var me = this;

		var yPos = 0;

		// Avoid error messages if the manager does not have a dom element
		if (me.manager && me.manager.el && me.manager.el.dom) {
			if (me.useXAxis) {
				// Element should already be aligned horizontally
				return me.el.getTop();
			} else {
				// Using getAnchorXY instead of getTop/getBottom should give a correct placement when document is used
				// as the manager but is still 0 px high. Before rendering the viewport.
				if (me.position == 'br' || me.position == 'bl' || me.position == 'b') {
					yPos += me.manager.el.getAnchorXY('b')[1];
					yPos -= (me.el.getHeight() + me.paddingY);
				} else {
					yPos += me.manager.el.getAnchorXY('t')[1];
					yPos += me.paddingY;
				}
			}
		}

		return yPos;
	},

	getXposAlignedToSibling: function (sibling) {
		var me = this;

		if (me.useXAxis) {
			if (me.position == 'tl' || me.position == 'bl' || me.position == 'l') {
				// Using sibling's width when adding
				return (sibling.xPos + sibling.el.getWidth() + sibling.spacing);
			} else {
				// Using own width when subtracting
				return (sibling.xPos - me.el.getWidth() - me.spacing);
			}
		} else {
			return me.el.getLeft();
		}

	},

	getYposAlignedToSibling: function (sibling) {
		var me = this;

		if (me.useXAxis) {
			return me.el.getTop();
		} else {
			if (me.position == 'tr' || me.position == 'tl' || me.position == 't') {
				// Using sibling's width when adding
				return (sibling.yPos + sibling.el.getHeight() + sibling.spacing);				
			} else {
				// Using own width when subtracting
				return (sibling.yPos - me.el.getHeight() - sibling.spacing);
			}
		}
	},

	getNotifications: function (alignment) {
		var me = this;

		if (!me.manager.notifications[alignment]) {
			me.manager.notifications[alignment] = [];
		}

		return me.manager.notifications[alignment];
	},

	setManager: function (manager) {
		var me = this;

		me.manager = manager;

		if (typeof me.manager == 'string') {
			me.manager = Ext.getCmp(me.manager);
		}

		// If no manager is provided or found, then the static object is used and the el property pointed to the body document.
		if (!me.manager) {
			me.manager = me.statics().defaultManager;

			if (!me.manager.el) {
				me.manager.el = Ext.getBody();
			}
		}
		
		if (typeof me.manager.notifications == 'undefined') {
			me.manager.notifications = {};
		}
	},
	
	beforeShow: function () {
		var me = this;

		if (me.stickOnClick) {
			if (me.body && me.body.dom) {
				Ext.fly(me.body.dom).on('click', function () {
					me.cancelAutoClose();
					me.addCls('notification-fixed');
				}, me);
			}
		}

		if (me.autoClose) {
			me.task = new Ext.util.DelayedTask(me.doAutoClose, me);
			me.task.delay(me.autoCloseDelay);
		}

		// Shunting offscreen to avoid flicker
		me.el.setX(-10000);
		me.el.setOpacity(1);
		
	},

	afterShow: function () {
		var me = this;

		me.callParent(arguments);

		var notifications = me.getNotifications(me.managerAlignment);

		if (notifications.length) {
			me.el.alignTo(notifications[notifications.length - 1].el, me.siblingAlignment, [0, 0]);
			me.xPos = me.getXposAlignedToSibling(notifications[notifications.length - 1]);
			me.yPos = me.getYposAlignedToSibling(notifications[notifications.length - 1]);
		} else {
			me.el.alignTo(me.manager.el, me.managerAlignment, [(me.paddingX * me.paddingFactorX), (me.paddingY * me.paddingFactorY)], false);
			me.xPos = me.getXposAlignedToManager();
			me.yPos = me.getYposAlignedToManager();
		}

		Ext.Array.include(notifications, me);

		// Repeating from coordinates makes sure the windows does not flicker into the center of the viewport during animation
		me.el.animate({
			from: {
				x: me.el.getX(),
				y: me.el.getY()
			},
			to: {
				x: me.xPos,
				y: me.yPos,
				opacity: 1
			},
			easing: me.slideInAnimation,
			duration: me.slideInDuration,
			dynamic: true
		});

	},
	
	slideBack: function () {
		var me = this;

		var notifications = me.getNotifications(me.managerAlignment);
		var index = Ext.Array.indexOf(notifications, me)

		// Not animating the element if it already started to hide itself or if the manager is not present in the dom
		if (!me.isHiding && me.el && me.manager && me.manager.el && me.manager.el.dom && me.manager.el.isVisible()) {

			if (index) {
				me.xPos = me.getXposAlignedToSibling(notifications[index - 1]);
				me.yPos = me.getYposAlignedToSibling(notifications[index - 1]);
			} else {
				me.xPos = me.getXposAlignedToManager();
				me.yPos = me.getYposAlignedToManager();
			}

			me.stopAnimation();

			me.el.animate({
				to: {
					x: me.xPos,
					y: me.yPos
				},
				easing: me.slideBackAnimation,
				duration: me.slideBackDuration,
				dynamic: true
			});
		}
	},

	cancelAutoClose: function() {
		var me = this;

		if (me.autoClose) {
			me.task.cancel();
		}
	},

	doAutoClose: function () {
		var me = this;

		if (!(me.stickWhileHover && me.mouseIsOver)) {
			// Close immediately
			me.close();
		} else {
			// Delayed closing when mouse leaves the component.
			me.closeOnMouseOut = true;
		}
	},

	removeFromManager: function () {
		var me = this;

		if (me.manager) {
			var notifications = me.getNotifications(me.managerAlignment);
			var index = Ext.Array.indexOf(notifications, me);
			if (index != -1) {
				// Requires Ext JS 4.0.2
				Ext.Array.erase(notifications, index, 1);

				// Slide "down" all notifications "above" the hidden one
				for (;index < notifications.length; index++) {
					notifications[index].slideBack();
				}
			}
		}
	},

	hide: function () {
		var me = this;

		if (me.isHiding) {
			if (!me.isFading) {
				me.callParent(arguments);
				// Must come after callParent() since it will pass through hide() again triggered by destroy()
				me.isHiding = false;
			}
		} else {
			// Must be set right away in case of double clicks on the close button
			me.isHiding = true;
			me.isFading = true;

			me.cancelAutoClose();

			if (me.el) {
				me.el.fadeOut({
					opacity: 0,
					easing: 'easeIn',
					duration: me.hideDuration,
					remove: me.destroyAfterHide,
					listeners: {
						afteranimate: function () {
							me.isFading = false;
							me.removeCls('notification-fixed');
							me.removeFromManager();
							me.hide(me.animateTarget, me.doClose, me);
						}
					}
				});
			}
		}

		return me;
	},

	destroy: function () {
		var me = this;
		if (!me.hidden) {
			me.destroyAfterHide = true;
			me.hide(me.animateTarget, me.doClose, me);
		} else {
			me.callParent(arguments);
		}
	}

});
