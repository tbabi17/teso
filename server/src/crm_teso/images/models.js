var crm_id = '';
var selected;
var selectedLead;
var selectedQuote;
var fields = [];
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

fields['CRM_RETAIL_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'type', text: 'CRM Type', width: 50, hidden:true},   
   {name: 'level', text: '#', width: 30, align: 'center', lock: true, renderer: renderCustomerLevel},
//   {name: 'campaign', text: 'Active campaign', width: 180, hidden: true, renderer: renderCampaign},
   {name: '_class', text: 'Class', width: 50, align: 'center', renderer: renderClass},     
   {name: 'regNo', text: 'Register', width: 80, hidden: true},   
   {name: 'firstName', text: 'First name', width: 100, lock: true, renderer: renderTip},
   {name: 'lastName', text: 'Last name', width: 100, lock: true, renderer: renderTip},
   {name: 'crm_name', text: 'Full name', width: 180, hidden: true},
   {name: 'engName', text: 'Latin', width: 140, hidden: true},
   {name: 'birthday', text: 'Birth date', width: 70, align: 'center'},
   {name: 'gender', text: 'Gender', width: 60, hidden: true},
   {name: 'work_status', text: 'Social status', width: 140, hidden: true},
   {name: 'title', text: 'Company', width: 200},
   {name: 'job_title', text: 'Position', width: 150},
   {name: 'job_type', text: 'Job', width: 100, hidden: true},
   {name: 'phone', text: 'Phone', width: 80, align: 'center', renderer: renderPhone},
   {name: 'phone1', text: 'Phone B', width: 70, align: 'center', renderer: renderPhone},
   {name: 'phone2', text: 'Phone C', width: 70, align: 'center', renderer: renderPhone, hidden: true},
   {name: 'fax', text: 'Fax', width: 80, hidden: true},   
   {name: 'email', text: 'Email', width: 120, renderer: renderMail},
   {name: 'www', text: 'Web', width: 100, hidden: true},
   {name: 'country', text: 'Country', width: 100, hidden: true},
   {name: 'city', text: 'City', width: 100, hidden: true},
   {name: 'district', text: 'District', width: 100, hidden: true},
   {name: 'horoo', text: 'Khoroo', width: 100, hidden: true},
   {name: 'address', text: 'Address', width: 150, hidden: true},
   {name: 'descr', text: 'Note', width: 120, hidden: true},
   {name: 'source', text: 'Source', width: 90, hidden: true},
   {name: 'decision_maker', text: 'Decision', width: 120, hidden: true},
   {name: 'owner', text: 'Owner', width: 120, renderer:renderOwner, hidden: true},
//   {name: 'parent_crm_id', text: 'Parent CRM ID', width: 120, hidden: true},
   {name: 'customer_type', text: 'c', width: 0, hidden: true},
   {name: 'userCode', text: 'Бүртгэсэн', width: 120, hidden: true},
   {name: '_date', type: 'datetime', text: 'Created on', width: 80, align: 'center'},
   {name: 'mayDuplicate', text: 'Duplicate', width: 80, align: 'right', renderer: renderPrecent}
];

Ext.define('CRM_RETAIL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_RETAIL_FIELDS']
});


fields['CRM_CORPORATE_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 20, hidden: true},   
   {name: 'type', text: 'CRM Type', width: 50, hidden:true},   
   {name: 'level', text: '#', width: 30, align: 'center', lock: true, renderer: renderCustomerLevel},
   {name: '_class', text: 'Class', width: 60, align: 'center', renderer: renderClass},      
   {name: 'regNo', text: 'Register', width: 65, align: 'center'},   
   {name: 'firstName', text: 'Name', width: 180, lock: true, renderer: renderTip},
   {name: 'lastName', text: 'Parent name', width: 120, lock: true, renderer: renderTip},
   {name: 'engName', text: 'Latin', width: 180, hidden: true},
   {name: 'phone', text: 'Phone', width: 70, align: 'center', renderer: renderPhone},
   {name: 'phone1', text: 'Phone B', width: 70, align: 'center', hidden: true, renderer: renderPhone},
   {name: 'phone2', text: 'Phone C', width: 70, align: 'center', renderer: renderPhone, hidden: true},
   {name: 'fax', text: 'Fax', width: 90, align: 'center'},
   {name: 'email', text: 'E-mail', width: 100, hidden: true, renderer: renderMail},
   {name: 'www', text: 'Web', width: 120, renderer: renderWWW},
   {name: 'capital', text: 'Capital', type: 'float', width: 100, hidden: true, align: 'right', renderer: renderMoney},
   {name: 'annual_revenue', text: 'Annual revenue', type: 'float', hidden: true, width: 100, align: 'right', renderer: renderMoney},
   {name: 'tatvar', text: 'Tax amount', type: 'float', hidden: true, width: 100, align: 'right', renderer: renderMoney},
   {name: 'company_torol', text: 'Type', width: 40, align: 'center'},
   {name: 'industry', text: 'Industry', width: 150},
   {name: 'industry_sub', text: 'Organization', width: 150},
   {name: 'employees', text: 'Employees', width: 80, align: 'center'},
   {name: 'sorog_huchin', text: 'Service provider', width: 150},
  // {name: 'campaign', text: 'Active campaign', width: 180, hidden: true},
   {name: 'country', text: 'Counry', width: 100, hidden: true},
   {name: 'city', text: 'City', width: 100, hidden: true},
   {name: 'district', text: 'District', width: 100, hidden: true},
   {name: 'horoo', text: 'Khoroo', width: 100, hidden: true},
   {name: 'address', text: 'Address', width: 150, hidden: true},   
   {name: 'source', text: 'Source', width: 90, hidden: true},
   {name: 'descr', text: 'Note', width: 120, hidden: true},
   {name: 'owner', text: 'Owner', width: 120, renderer:renderOwner},
   {name: 'userCode', text: 'Бүртгэсэн', width: 120, hidden: true},
   {name: 'customer_type', text: 'c', width: 0, hidden: true},
   {name: '_date', type: 'datetime', text: 'Created on', width: 80, align: 'center'},
   {name: 'mayDuplicate', text: 'Duplicate', width: 80, renderer: renderPrecent, align: 'right'}
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
   {name: 'subject', text: 'Subject', width: 150},
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
   {name: 'userCode', text: 'Бүртгэсэн', hidden: true, width: 200},
   {name: '_date', text: 'Created on', type: 'datetime', dateFormat: 'Y-m-d', hidden: true,  width: 200}
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
   {name: 'subject', text: 'Subject', width: 150},
   {name: 'start_date', type: 'datetime', text: 'Due date', width: 80, dateFormat: 'Y-m-d'},
   {name: 'start_time', text: 'Due time', width: 70},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'event_type', text: 'Type', width: 70, align: 'center'},
   {name: 'venue', text: 'Venue', width: 150},
   {name: 'budgeted_cost', text: 'Budgeted cost', width: 90, type: 'float', align: 'right', renderer: renderMoney},
   {name: 'descr', text: 'Description',  width: 200},
   {name: 'owner', text: 'Owner', width: 80, hidden: true, renderer:renderOwner},
   {name: 'remind_at', type: 'date', text: 'Remind', hidden: true,  width: 200, dateFormat: 'Y-m-d'},
   {name: 'remind_type', text: 'Remind type', hidden: true,  width: 200},
   {name: 'userCode', text: 'Бүртгэсэн', hidden: true, width: 200},
   {name: '_date', type: 'datetime', text: 'Created on', hidden: true,  width: 200}
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
   {name: 'subject', text: 'Subject', width: 180},
   {name: 'owner', text: 'Owner', width: 120, hidden: true, renderer:renderOwner},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'calltype', text: 'Type', width: 70},
   {name: 'purpose', text: 'Purpose', width: 60}, 
   {name: 'callresult', text: 'Status', width: 60, align: 'center', renderer: renderCallStatus},
   {name: 'duration', type: 'int', text: 'Duration', hidden: true, width: 80, align: 'right', renderer: renderSecond, summaryType: 'sum', summaryRenderer: renderTSecond},
   {name: '_from', text: 'From', width: 70, align: 'center', hidden: true},
   {name: '_to', text: 'To', width: 70, align: 'center', renderer: renderPhone},  
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'userCode', text: 'Бүртгэсэн', hidden: true, width: 200},
   {name: '_date', type: 'datetime', text: 'Created on', width: 200}
];

Ext.define('CRM_CALLLOG', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CALLLOG_FIELDS']
});


fields['CRM_CALENDAR_FIELDS'] = [   
   {name: 'id', text: 'ID', hidden: true},
   {name: 'work_type', text: 'Type', width: 80, align: 'left', renderer: renderWorkType},
   {name: '_date', text: 'Created on', width: 80},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 250, renderer: renderCRMName},
   {name: 'deal_id', text: 'Deal ID', width: 10, hidden: true},
   {name: 'case_id', text: 'Case ID', width: 50, hidden: true},
   {name: 'deal_name', text: 'Topic name', width: 250, hidden: true},
   {name: 'times', text: 'Time', width: 60, align: 'center'},
   {name: 'priority', text: 'Priority', width: 70, align: 'center', renderer: renderPriority},
   {name: 'status', text: 'Status', width: 70, align: 'center'},
   {name: 'subject', text: 'Subject', width: 150},
   {name: 'source', text: 'Source', hidden: true, width: 150},
   {name: 'owner', text: 'Owner', width: 150, hidden: true},
   {name: 'descr', text: 'Description', width: 200}
];

Ext.define('CRM_CALENDAR', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CALENDAR_FIELDS']
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


fields['CRM_COMPLAIN_FIELDS'] = [
   {name: 'case_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'complain_status', text: 'Status', width: 65, align: 'center', renderer: renderComplainStatus},   
   {name: 'complain_reason', text: 'Case Reason', width: 200, align: 'center'},   
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'case_stage', text: 'Stage', width: 70, renderer: renderCaseLevel},
   {name: 'complain_origin', text: 'Origin', width: 65, align: 'center'},   
   {name: 'complain_type', text: 'Type', width: 100, align: 'center'},
   {name: 'phone', text: 'Phone', align: 'center', width: 65},
   {name: 'priority', text: 'Priority', width: 60, align: 'center'},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 110, renderer:renderOwner},   
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: 'resolution_type', text: 'Resolution type', width: 120, hidden: true},
   {name: 'resolution', text: 'Resolution', width: 220, hidden: true},
   {name: 'closing_date', text: 'Close date', dateFormat: 'Y-m-d', width: 80},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120},
   {name: 'groupId', text: 'Case ID', width: 100}
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
   {name: 'crm_name', text: 'Customer', width: 200, renderer: renderCRMName},
   {name: 'deal_name', text: 'Topic Name', width: 200, renderer: renderDealName},
   {name: 'descr', text: 'Note', width: 200},
   {name: 'www', text: 'Attach link', width: 150},
   {name: 'owner', text: 'Owner', width: 100, renderer: renderOwner},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
];

Ext.define('CRM_NOTES', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_NOTES_FIELDS']
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
   {name: 'subject', text: 'Subject', width: 200},
   {name: '_to', text: 'To', width: 150, renderer: renderMail},
   {name: '_from', text: 'From', width: 150, renderer: renderMail},
   {name: 'campaign', text: 'Campaign', width: 150},
   {name: 'descr', text: 'Message body', width: 200},
   {name: 'owner', text: 'Owner', width: 100, renderer: renderOwner},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
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
   {name: 'deal_name', text: 'Topic Name', width: 200, renderer: renderDealName},
   {name: 'crm_name', text: 'Potential Customer', width: 250, renderer: renderCRMName},
   {name: 'qty', text: 'Qty', align: 'right', width: 55, type: 'float', renderer: renderNumber, summaryRenderer: renderTNumber, summaryType: 'sum'},
   {name: 'amount', text: 'Total Amount', align: 'right', type: 'float', width: 110, renderer: renderMoney, summaryRenderer: renderTMoney, summaryType: 'sum'},
   {name: 'owner', text: 'Owner', width: 110, renderer:renderOwner}, 
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
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
   {name: 'product_name', text: 'Product name', width: 200}, 
   {name: 'qty', text: 'Qty', type:'float', align: 'right', width: 80, summaryType: 'sum'},
   {name: 'price', text: 'Price', width: 90, type: 'float', align: 'right', renderer: renderMoney,},
   {name: 'amount', text: 'Amount (Discount)', type: 'float', width: 100, align: 'right', renderer: renderMoney, summaryRenderer: renderTMoney, summaryType: 'sum'}
];

Ext.define('CRM_DEAL_PRODUCTS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_PRODUCTS_FIELDS']
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
   {name: 'descr', text: 'Note', width: 200},
   {name: 'owner', text: 'Owner', width: 120}, 
   {name: '_from', text: 'From', width: 120},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
];

Ext.define('CRM_CASE_TRANSFER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CASE_TRANSFER_FIELDS']
});


fields['CRM_DEAL_SALES_TEAM_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true},
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'deal_name', text: 'Topic Name', width: 200, renderer: renderDealName},
   {name: 'owner', text: 'Sales manager', width: 150, renderer: renderOwner}, 
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', width: 120}
];

Ext.define('CRM_DEAL_SALES_TEAM', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_SALES_TEAM_FIELDS']
});


fields['CRM_DEAL_COMPETITORS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'deal_id', text: 'Deal ID', hidden: true}, 
   {name: 'crm_id', text: 'CRM ID', hidden: true},
   {name: 'competitor_name', text: 'Competitor name', width: 200}, 
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
   {name: 'crm_name', text: 'Customer', width: 210, renderer: renderCRMName},
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
   {name: 'userCode', text: 'Бүртгэсэн', width: 100, hidden: true},
   {name: '_date', type: 'datetime', dateFormat: 'Y-m-d', text: 'Created on', width: 120}
];

Ext.define('CRM_SALES', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_SALES_FIELDS']
});

fields['CRM_PRODUCT_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_name', text: 'Name', width: 250}, 
   {name: 'product_type', text: 'Type', width: 100},
   {name: 'price', text: 'Unit price', type: 'float', width: 90, renderer: renderMoney, align: 'right'}
];

Ext.define('CRM_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PRODUCT_FIELDS']
});

fields['CRM_USERS_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'owner', text: 'User name', width: 130}, 
   {name: 'password', text: 'Password', width: 90, hidden: true, renderer: renderPassword},
   {name: 'fullName', text: 'Full name', width: 120},
   {name: 'section', text: 'Section', width: 150},
   {name: 'team', text: 'Team', width: 150},
   {name: 'position', text: 'Position', width: 150},
   {name: 'company', text: 'Company', width: 150},
   {name: 'gmailAccount', text: 'Goolge Account', width: 120},
   {name: 'user_type', text: 'Direction', width: 100, hidden: true},
   {name: 'user_level', text: 'Level', width: 80, renderer: renderUserLevel}
];

Ext.define('CRM_USERS', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_USERS_FIELDS']
});

fields['CRM_USERS_GROUP_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'owner', text: 'Member', width: 120},
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
   {name: 'owner', text: 'Owner', width: 100},
   {name: 'type', text: 'Owner', width: 80}
];

Ext.define('CRM_ALARM', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_ALARM_FIELDS']
});


fields['CRM_DEAL_FIELDS'] = [
   {name: 'deal_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'status', text: 'Status', width: 85, align: 'center'},
   {name: 'deal', text: 'Topic Name', width: 200},   
   {name: 'stage', text: 'Stage', width: 85, align: 'center', renderer: renderDealLevel},
   {name: 'crm_id', text: 'CRM ID', hidden: true, width: 80},
   {name: 'crm_name', text: 'Potential customer', width: 200, renderer: renderCRMName},
   {name: 'phone', text: 'Phone', width: 80, hidden: true},
   {name: 'probablity', text: 'Probablity', width: 70, align: 'right', renderer: renderPrecent},
   {name: 'expected_revenue', text: 'Expected revenue', width: 110, align: 'right', renderer: renderMoney},
//   {name: 'actual_revenue', text: 'Actual revenue', width: 110, align: 'right', hidden:true, renderer: renderMoney},
   {name: 'closing_date', text: 'Close date', dateFormat: 'Y-m-d', width: 95, align: 'center'},   
   {name: 'current_situation', text: 'Current situation', width: 200, hidden: true},
   {name: 'customer_need', text: 'Customer need', width: 200, hidden: true},
   {name: 'proposed_solution', text: 'Proposed solution', width: 200, hidden: true},
   {name: '_date', text: 'Created on', width: 200, hidden: true},
   {name: 'descr', text: 'Description', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 120, renderer: renderOwner},
   {name: 'competitor_name', text: 'Competitor', width: 200},
   {name: 'campaign', text: 'Campaign', width: 200},   
   {name: 'userCode', text: 'Created by', width: 80, hidden: true}
];

Ext.define('CRM_DEAL', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_DEAL_FIELDS']
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
   {name: '_date', text: 'Огноо', dateFormat: 'Y-m-d', hidden: true, width: 80},
   {name: 'descr', text: 'Тайлбар', width: 200, hidden: true},
   {name: 'owner', text: 'Owner', width: 80, hidden: true, renderer:renderOwner},   
   {name: 'userCode', text: 'Бүртгэсэн', width: 80, hidden: true},
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
   {name: 'campaign', text: 'Campaign name', width: 200},
   {name: 'total_members', text: 'Total members', width: 100, align: 'right'},
   {name: 'campaign_type', text: 'Type', width: 80},
   {name: 'customer_type', text: 'Direction', width: 90, hidden: true},
   {name: 'personal', text: 'Personal view', width: 150},
   {name: 'expected_revenue', text: 'Expected Revenue', type: 'float', width: 120, summaryType: 'sum', align: 'right', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'budgeted_cost', text: 'Budgeted cost', type: 'float', align: 'center', align: 'right', hidden: true, width: 110, summaryType: 'sum', renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'actual_cost', text: 'Actual cost', type: 'float', align: 'right', summaryType: 'sum', hidden: true, width: 110, renderer: renderMoney, summaryRenderer: renderTMoney},
   {name: 'start_date', text: 'Start date', dateFormat: 'Y-m-d', align: 'center', width: 75},
   {name: 'end_date', text: 'End date', dateFormat: 'Y-m-d', align: 'center', width: 75},
   {name: '_date', text: 'Created on', dateFormat: 'Y-m-d', hidden: true, width: 80},
   {name: 'descr', text: 'Description', width: 250, hidden: true},
   {name: 'owner', text: 'Owner', width: 80, hidden: true, renderer:renderOwner},   
   {name: 'userCode', text: 'Бүртгэсэн', width: 80, hidden: true}
];

Ext.define('CRM_CAMPAIGN', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_CAMPAIGN_FIELDS']
});


fields['CRM_USER_PLANNING_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'owner', text: 'Owner', width: 150}, 
   {name: 'start_date', text: 'Start date', width: 80},
   {name: 'end_date', text: 'End date', width: 80},
   {name: 'amountTheshold', text: 'Target', type: 'float', width: 120, renderer: renderMoney, align: 'right'}
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


function renderClass(v) {
	if (v == 'CORPORATE' || v == 'RETAIL') 
		return '';
	return v;
}

function renderTip(v, metadata, record, rowIndex, colIndex, store) {
	metadata.tdAttr = 'data-qtip="<b>right click</b></br>"'
	return v;
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
	if (v == 0)
		return 'sales man';
	if (v == 1)
		return 'manager';
	if (v == 2)
		return 'head';
	if (v == 3)
		return 'ceo';
	if (v == 10)
		return 'president';
	
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
	return '<a href="'+v+'" target="_blank"><span style="color:blue; text-decoration: underline;">'+v+'</span></a>';
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
		return '<span style="color:red">'+v+'%</span>';
	if (v >= 20 && v < 75)
		return '<span style="color:orange">'+v+'%</span>';
	if (v >= 75)
		return '<span style="color:green">'+v+'%</span>';
	
	return v;
}

function renderTMoney(v) {
	return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'₮</strong>';
}

function renderMoney(v) {
	if (v == 0)
		return '';
	return Ext.util.Format.number(v, '00,00,000.00')+'₮';
}

function renderTNumber(v) {
	return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'</strong>';
}

function renderNumber(v) {
	return Ext.util.Format.number(v, '00,00,000.00');
}


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