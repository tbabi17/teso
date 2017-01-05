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
   {name: 'count', text: 'Т.тоо', type: 'float', width: 90, renderer: renderNumber, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum', 
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


fields['CRM_PRODUCT_AVAILABLE_FIELDS'] = [
   {name: 'id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_id', text: 'ID', width: 50, hidden:true}, 
   {name: 'product_name', text: 'Бараа', width: 260}, 
   {name: 'total', text: 'Ширхэг', width: 80, align: 'right', renderer: renderNumber}, 
   {name: 'userCode', text: 'Хариуцагч', width: 150}
];

Ext.define('CRM_PRODUCT_AVAILABLE', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_PRODUCT_AVAILABLE_FIELDS']
});

fields['CRM_REPORT_CUSTOMER_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'crm_name', text: 'Харилцагч', width: 250}, 
   {name: 'owner', text: 'Борлуулагч', width: 150}, 
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

fields['CRM_REPORT_VOLTAM_1_FIELDS'] = [
   {name: 'crm_id', text: 'CRM_ID', hidden: true}, 
   {name: 'crm_name', text: 'Харилцагч', width: 250}, 
   {name: 'owner', text: 'Борлуулагч', width: 150}, 
   {name: 'entry', text: 'Орсон тоо', width: 80, align: 'center', type: 'int', summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'pay_total', type:'float', text: 'Зээл төлөлт', align: 'right', width: 90, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'loan_total', type:'float', text: 'Зээл дүн', align: 'right', width: 90, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'cash_total', type:'float', text: 'Бэлэн дүн', align: 'right', width: 90, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'total', type:'float', text: 'Нийт дүн', align: 'right', width: 100, renderer: renderTReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c0', type:'float', text: 'Нийт пачек', align: 'center', width: 100, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c7', type:'float', text: 'MSOB', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c10', type:'float', text: 'MSSB', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c11', type:'float', text: 'MSWB', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c8', type:'float', text: 'MSR5', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c9', type:'float', text: 'MSR3', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c16', type:'float', text: 'WXStyleB', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c17', type:'float', text: 'WXStyleS', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c14', type:'float', text: 'WSSBlue', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c15', type:'float', text: 'WSSSilver', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c12', type:'float', text: 'WBlue', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}, 
   {name: 'c13', type:'float', text: 'WSilver', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c1', type:'float', text: 'LDPlat', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c6', type:'float', text: 'LDSSViolet', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c5', type:'float', text: 'LDSSPink', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c3', type:'float', text: 'LDRRed', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c2', type:'float', text: 'LDRBlue', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber},
   {name: 'c4', type:'float', text: 'LDRSilver', align: 'center', width: 70, renderer: renderReportNumber, summaryType: 'sum', summaryRenderer: renderTReportNumber}
];

Ext.define('CRM_REPORT_VOLTAM_1', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_VOLTAM_1_FIELDS']
});

fields['CRM_REPORT_USER_FIELDS'] = [
   {name: 'owner', text: 'Борлуулагч', width: 150}, 
   {name: 'entry', text: 'Орох ёстой', width: 90, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum'}, 
   {name: 'orson', text: 'Орсон', width: 90, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum'}, 
   {name: 'hiisen', text: 'Бор.хийсэн', width: 90, align: 'right', summaryRenderer: renderTNumber, summaryType: 'sum'}, 
   {name: 'cash', text: 'Бэлэн борлуулалт', width: 120, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'lease', text: 'Зээлийн борлуулалт', width: 120, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'payment', text: 'Зээл төлөлт', width: 120, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'total', text: 'Нийт борлуулалт', width: 120, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'car_uld', text: 'Машины үлдэгдэл', width: 120, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}
];
Ext.define('CRM_REPORT_USER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_USER_FIELDS']
});
/*
Ext.define('CRM_REPORT_USER_PERFORM', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_USER_FIELDS']
});
*/
fields['CRM_REPORT_PRODUCT_FIELDS'] = [
   {name: 'product_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'product_code', text: 'Код', width: 50, align: 'center'}, 
   {name: 'product_barcode', text: 'Баркод', width: 90, align: 'center', hidden: true}, 
   {name: 'product_brand', text: 'Бренд', width: 150}, 
   {name: 'product_name', text: 'Нэр', width: 250}, 
   {name: 'unit_size', text: 'Нэгж', width: 50, align: 'center', hidden: true}, 
   {name: 'qty', text: 'Ширхэг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'pty', text: 'Хайрцаг', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'amount', align: 'right', type:'float', text: 'Дүн', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}, 

   {name: 'g_qty', text: 'Төлөв.шр', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'g_pty', text: 'Төлөв.хр', type: 'float', width: 85, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'g_amount', align: 'right', type:'float', text: 'Төлөвлөгөө дүн', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney}, 
   {name: 'sku', text: 'Sku %', type:'float',  width: 90, align: 'right', renderer: renderPrecent, summaryType: 'average', summaryRenderer: renderTPrecent},
   {name: 'avg_price', text: 'Дундаж үнэ', hidden: true, type:'float',  width: 90, align: 'right', renderer: renderMoney, summaryType: 'average', summaryRenderer: renderTMoney}
];

Ext.define('CRM_REPORT_PRODUCT', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_PRODUCT_FIELDS']
});

fields['CRM_REPORT_CUSTOMER_FIELDS'] = [
   {name: 'crm_id', text: 'ID', width: 50, hidden: true}, 
   {name: 'owner', text: 'Борлуулагч', width: 150}, 
   {name: 'crm_name', text: 'Харилцагч', width: 250, summaryType: 'count', summaryRenderer: renderTNumber}, 
   {name: 'entry', text: 'Давтамж', type: 'int', width: 80, align: 'right', renderer: renderNumber, summaryType: 'sum', summaryRenderer: renderTNumber},
   {name: 'first', align: 'right', type:'float', text: 'Эхний үлдэгдэл', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'amount', align: 'right', type:'float', text: 'Худалдан авалтын дүн', width: 150, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'paid', text: 'Төлөлт хийгдсэн', type:'float',  width: 120, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
   {name: 'last', text: 'Эцсийн үлдэгдэл', type:'float',  width: 110, align: 'right', renderer: renderMoney, summaryType: 'sum', summaryRenderer: renderTMoney},
];

Ext.define('CRM_REPORT_CUSTOMER', {
	extend: 'Ext.data.Model',
	fields: fields['CRM_REPORT_CUSTOMER_FIELDS']
});


function renderNumber(v) {
	if (number_float) {
 		if (v == 0) return '';
		if (v < 0)
			return '<span style="color:red">'+Ext.util.Format.number(v, '00,00,000.00')+'</span>';

		return Ext.util.Format.number(v, '00,00,000.00');
	} else {
 		if (v == 0) return '';
		
		if (v < 0)
			return '<span style="color:red">'+Ext.util.Format.number(v, '00,00,000')+'</span>';

		return Ext.util.Format.number(v, '00,00,000');
	}
}

function renderTNumber(v) {
	if (number_float) 
		return '<strong>'+Ext.util.Format.number(v, '00,00,000.00')+'</strong>';

	return '<strong>'+Ext.util.Format.number(v, '00,00,000')+'</strong>';
}