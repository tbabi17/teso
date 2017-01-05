var product_sort_field = '_date';

Ext.define('OCS.Module', {
	modelName: '',
	remoteSort : true,
	func : '',
	where: '',
	values: '',
	sortField: '',
	sortDirection: 'DESC',
	groupField: '',
	autoSelect: false,
	duplicateCheck: false,
	dateField: '_date',
	tab: '',
	title: '',
	primaryFields: '',
	highlights: {},

	createStore: function() {
		var me = this;
		me.store = Ext.create('Ext.data.Store', {
			model: me.modelName,
			pageSize: 80,
			autoLoad: true,
			remoteSort: me.remoteSort,
			groupField: me.groupField,
			proxy: {				
				type: 'ajax',
    			url: 'avia.php',
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
    	        reader: {
    	            root:'items',
    	            totalProperty: 'results',
					idProperty: 'id'
    	        },
				writer: {
					root:'items',
    	            totalProperty: 'results',
					encode : false
				},
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: me.func, values: me.values, fields: '', where: me.where},
			},
			sorters: [{
				property: me.sortField?me.sortField:'_date',
				direction: me.sortDirection
			}],
			listeners: {
				load : function(store, records, successful, operation, eOpts) {
						if (me.func == 'crm_campaign_list') {
							me.store.each(function(rec){
								campaigns[rec.get('campaign')] = rec;
							});
						}
						
						if (me.func == 'crm_alarm_list' && me.store.getCount() > 0) {
							var deal = 0, ccase = 0, activity = 0, cservice = 0;
							var show = (pk == 'dashboard');				
							me.store.each(function(rec){
								if (show && rec.data['type'] == 'phone call' || rec.data['type'] == 'appointment') {
										Ext.create('widget.uxNotification', {
											title: 'Phone call',
											closeAction: 'hide',
											position: 'br',
											manager: 'demo1',
											useXAxis: false,
											stickWhileHover: false,
											autoCloseDelay: 20000,
											iconCls: 'ux-notification-icon-information',
											html: rec.data['subject']+' ('+rec.data['type']+')</br> reminded by <b>'+rec.data['owner']+'</b> <a href="?pk=workspace">Go to</a>'
										}).show();
								} else
								if (rec.data['type'] == 'deal') {
									if (rec.data['status'] == 'assigned' && show) {										
										Ext.create('widget.uxNotification', {
											title: 'Assigned',
											closeAction: 'hide',
											position: 'br',
											manager: 'demo1',
											useXAxis: false,
											stickWhileHover: false,
											iconCls: 'ux-notification-icon-information',
											html: rec.data['subject']+' (deal)</br> assigned by <b>'+rec.data['owner']+'</b> <a href="?pk=deals">Go to</a>'
										}).show();
									} else
									if (rec.data['status'] == 'remind' && show) {										
										Ext.create('widget.uxNotification', {
											title: 'Remind',
											closeAction: 'hide',
											position: 'br',
											manager: 'demo1',
											useXAxis: false,
											stickWhileHover: false,
											iconCls: 'ux-notification-icon-remind',
											html: rec.data['subject']+' (deal)</br> remind <b>'+rec.data['owner']+'</b> <a href="?pk=deals">Go to</a>'
										}).show();
									} else
									if (rec.data['status'] == 'commented' && show) {										
										Ext.create('widget.uxNotification', {
											title: 'Message',
											closeAction: 'hide',
											position: 'br',
											manager: 'demo1',
											useXAxis: false,
											stickWhileHover: false,
											iconCls: 'ux-notification-icon-message',
											html: rec.data['subject']+' (deal)</br> posted by <b>'+rec.data['owner']+'</b> <a href="?pk=deals">Go to</a>'
										}).show();
									} else
										deal++;
								}
								else
								if (rec.data['type'] == 'case')
									ccase++;
								if (rec.data['type'] == 'service')
									cservice++;
								else
								{
									if (rec.data['status'] == 'workflow' && show) {	
										Ext.create('widget.uxNotification', {
											title: 'Task',
											closeAction: 'hide',
											position: 'br',
											manager: 'demo1',
											useXAxis: false,
											stickWhileHover: false,
											iconCls: 'ux-notification-icon-task',
											html: rec.data['subject']+' (task)</br> assigned <b>'+rec.data['owner']+'</b> <a href="?pk=workspace">Go to</a>'
										}).show();
									}
									activity++;
								}
							});							

							if (user_level == 3) {
								views['topbar'].update('<div class="caption">'+
													 '<table cellpadding=0 cellspacing=0><tr><td class="padding green"></td><td class="padding'+(pk=='dashboard'?' active':'')+'"><a href="index.php?pk=dashboard">Хяналт</a></td><td class="padding'+(pk=='workspace'?' active':'')+'"><a href="index.php?pk=workspace">Үйл ажиллагаа'+(activity>0?'<div class="noti_bubble">'+activity+'</div>':'')+'</a></td><td class="padding'+(pk=='deals'?' active':'')+'"><a href="index.php?pk=deals">Хэлцэл'+(deal>0?'<div class="noti_bubble">'+deal+'</div>':'')+'</a></td><td class="padding'+(pk=='reseller'?' active':'')+'" style="display:none"><a href="index.php?pk=reseller">Салбар</a></td><td class="padding'+(pk=='retail'?' active':'')+'"><a href="index.php?pk=retail">Хувь хүн</a></td><td class="padding'+(pk=='corporate'?' active':'')+'"><a href="index.php?pk=corporate">Байгууллага</a></td><td class="padding'+(pk=='cases'?' active':'')+'"><a href="index.php?pk=cases">Үйлчилгээ'+(ccase>0?'<div class="noti_bubble">'+ccase+'</div>':'')+'</a></td><td class="padding'+(pk=='campaigns'?' active':'')+'"><a href="index.php?pk=campaigns">Маркетинг</a></td><td class="padding'+(pk=='services'?' active':'')+'"><a href="index.php?pk=services">Борлуулалт</a>'+(cservice>0?'<div class="noti_bubble">'+cservice+'</div>':'')+'</td><td class="padding'+(pk=='competitor'?' active':'')+'" style="display:none"><a href="index.php?pk=competitor">Өрсөлдөгч</a></td><td class="padding'+(pk=='goal'?' active':'')+'"><a href="index.php?pk=goal">Төлөвлөгөө</a></td><td class="padding'+(pk=='product'?' active':'')+'"><a href="index.php?pk=product">Бүтээгдэхүүн</a></td><td class="padding'+(pk=='reports'?' active':'')+'"><a href="index.php?pk=reports">Тайлан</a></td><td class="padding'+(pk=='settings'?' active':'')+'"><a href="index.php?pk=settings">Тохиргоо</a></td><td class="padding" style="float:right"><a href="logout.php">Гарах</a></td></tr></table>'+
									 			   '</div>');
							} else {
								views['topbar'].update('<div class="caption">'+
													 '<table cellpadding=0 cellspacing=0><tr><td class="padding green"></td><td class="padding'+(pk=='dashboard'?' active':'')+'"><a href="index.php?pk=dashboard">Хяналт</a></td><td class="padding'+(pk=='workspace'?' active':'')+'"><a href="index.php?pk=workspace">Үйл ажиллагаа'+(activity>0?'<div class="noti_bubble">'+activity+'</div>':'')+'</a></td><td class="padding'+(pk=='deals'?' active':'')+'"><a href="index.php?pk=deals">Хэлцэл'+(deal>0?'<div class="noti_bubble">'+deal+'</div>':'')+'</a></td><td class="padding'+(pk=='reseller'?' active':'')+'" style="display:none"><a href="index.php?pk=reseller">Салбар</a></td><td class="padding'+(pk=='retail'?' active':'')+'"><a href="index.php?pk=retail">Хүвь хүн</a></td><td class="padding'+(pk=='corporate'?' active':'')+'"><a href="index.php?pk=corporate">Байгууллага</a></td><td class="padding'+(pk=='cases'?' active':'')+'"><a href="index.php?pk=cases">Үйлчилгээ'+(ccase>0?'<div class="noti_bubble">'+ccase+'</div>':'')+'</a></td><td class="padding'+(pk=='campaigns'?' active':'')+'"><a href="index.php?pk=campaigns">Маркетинг</a></td><td class="padding'+(pk=='services'?' active':'')+'"><a href="index.php?pk=services">Борлуулалт</a>'+(cservice>0?'<div class="noti_bubble">'+cservice+'</div>':'')+'</td><td class="padding'+(pk=='competitor'?' active':'')+'" style="display:none"><a href="index.php?pk=competitor">Өрсөлдөгч</a></td><td class="padding'+(pk=='goal'?' active':'')+'"><a href="index.php?pk=goal">Төлөвлөгөө</a></td><td class="padding'+(pk=='product'?' active':'')+'"><a href="index.php?pk=product">Бүтээгдэхүүн</a></td><td class="padding'+(pk=='reports'?' active':'')+'"><a href="index.php?pk=reports">Тайлан</a></td><td class="padding'+(pk=='settings'?' active':'')+'"><a href="index.php?pk=settings">Тохиргоо</a></td><td class="padding" style="float:right"><a href="logout.php">Гарах</a></td></tr></table>'+
									 			   '</div>');
							}
						}

						if (me.tab) {
							if (Ext.getCmp(me.tab))
								Ext.getCmp(me.tab).setTitle(Ext.String.format(me.title+' ({0})', me.store.getTotalCount()));	

							if (me.where && me.where.indexOf('alldate') != -1 && me.calendar)
							{							
								me.highlights = [];
								me.calendar.selectedDates = me.highlights;
								me.calendar.update(new Date(), true);
								me.store.each(function(rec){
									if (rec.data[me.dateField]) {																	
										var sub = rec.data[me.dateField].substring(0, 10);
										sub = sub.substring(5,7)+'/'+sub.substring(8,10)+'/'+sub.substring(0, 4);
										me.highlights[new Date(sub).getTime()] = 'on';
										me.calendar.selectedDates = me.highlights;
										me.calendar.update(new Date(), true);
									}
								});
							}
						} 											
						
						if (me.func == 'crm_calendar_list' && me.where.indexOf('alldate') != -1) {
							me.highlights = [];
							Ext.getCmp('my_calendar').selectedDates = me.highlights;
							Ext.getCmp('my_calendar').update(new Date(), true);
							me.store.each(function(rec){
								if (rec.data[me.dateField]) {																	
									var sub = rec.data[me.dateField].substring(0, 10);
									sub = sub.substring(5,7)+'/'+sub.substring(8,10)+'/'+sub.substring(0, 4);
									me.highlights[new Date(sub).getTime()] = 'on';
									Ext.getCmp('my_calendar').selectedDates = me.highlights;
									Ext.getCmp('my_calendar').update(new Date(), true);
								}
							});
						}

						if (me.func == 'crm_retail_list') {
							me.store.each(function(rec){
								customers[rec.get('crm_id')] = me.getCustomerName(rec);
								customers[rec.get('phone')] = rec;
							});
						}			
				}				
			}
		});

//		me.store.loadPage(1);
	},
	
	callBack: function(store) {
	},

	loadStore: function() {
		var me = this;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
		me.store.loadPage(1, {callback: function() {
			me.callBack(me.store);
		}});
	},

	createStandardColumns: function() {	
		var me = this;
		var columns = fields[me.modelName+'_FIELDS'];
		var headers = [];
		for (i = 0; i < columns.length; i++) {							
				headers[i] = {					
						hidden	 : columns[i].hidden,	
						text	 : columns[i].text,
						dataIndex: columns[i].name,
						flex	 : columns[i].flex,
						width	 : columns[i].width,
					//	locked	 : columns[i].lock,
						align	 : columns[i].align,
						filter   : columns[i].filter,
						renderer : columns[i].renderer,
						summaryType: columns[i].summaryType,
						summaryRenderer : columns[i].summaryRenderer
				};			

				if (columns[i].primary)
					me.primaryFields += columns[i].name+',';
		}
		
		return headers;
	},

	createColumns: function() {	
		var me = this;
		var columns = fields[me.modelName+'_FIELDS'];
		var headers = [];//Ext.create('Ext.grid.RowNumberer', {width: 32})];
		for (i = 0; i < columns.length; i++) {							
				headers[i] = {				
						hidden	 : columns[i].hidden,	
						text	 : columns[i].text,
						dataIndex: columns[i].name,
						flex	 : columns[i].flex,
						width	 : columns[i].width,
						filter   : columns[i].filter,
						//locked	 : columns[i].lock,
						align	 : columns[i].align,
						renderer : columns[i].renderer,
						summaryType: columns[i].summaryType,
						summaryRenderer : columns[i].summaryRenderer
				};		
				if (columns[i].primary)
					me.primaryFields += columns[i].name+',';						
		}
		
		return headers;
	},
	
	capitalise: function(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	},

	convertLatin: function(value) {
		value = value.toLowerCase();

		chrs = [];
		chrs['а'] = 'a';chrs['ж'] = 'j';chrs['ө'] = 'u';chrs['ц'] = 'ts';chrs['ю'] = 'yu';
		chrs['б'] = 'b';chrs['и'] = 'i';chrs['п'] = 'p';chrs['ч'] = 'ch';chrs['я'] = 'ya';
		chrs['в'] = 'v';chrs['й'] = 'i';chrs['р'] = 'r';chrs['ш'] = 'sh';chrs['ф'] = 'f';
		chrs['г'] = 'g';chrs['к'] = 'k';chrs['с'] = 's';chrs['щ'] = 'sch';
		chrs['д'] = 'd';chrs['л'] = 'l';chrs['т'] = 't';chrs['ь'] = 'i';
		chrs['е'] = 'е';chrs['м'] = 'm';chrs['у'] = 'u';chrs['ъ'] = 'i';
		chrs['ё'] = 'yo';chrs['н'] = 'n';chrs['ү'] = 'u';chrs['ы'] = 'i';
		chrs['з'] = 'z';chrs['о'] = 'o';chrs['х'] = 'kh';chrs['э'] = 'e';
		chrs['.'] = '.';chrs['-'] = '-';
		
		v = value;
		v1 = '';
		for (i = 0; i < v[0].length; i++)
			v1 = v1 + chrs[v[0].charAt(i)];

		return v1.toUpperCase();//this.capitalise(v1)+' '+this.capitalise(v2);
	},		
	
	month: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},
	
	prevmonth: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m-1, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	nextmonth: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m+1, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	getCustomerName: function(rec) {
		if (rec.get('firstName'))
			return rec.get('firstName')+' '+rec.get('lastName');
		else {
			return rec.get('crm_name').split(',')[0];			
		}

//		v = rec.get('level');
//		if (rec.data['_class'] && rec.data['_class'].indexOf('VIP') != -1) v = 'vip';	
//		return '<span class="circle '+v+'">&nbsp;</span> '+rec.get('firstName')+' <span style="color:gray">'+rec.get('lastName')+'</span>';
	},

	selectCustomer: function(rec) {
		var me = this;
		crm_id = rec.get('crm_id');
		selected = rec;

		if (me.form)
			me.form.loadRecord(rec);
	},	

	commitRecord: function() {		
		var me = this;
		var values = '', values1 = '';
		var action = 'insert';
		var captcha = '';
		var owner = '';
		var walue = '';
		me.form.getStore().each(function(rec){
			var name = rec.get('name').substring(2, rec.get('name').length);

			if (me.primaryFields.indexOf(name) != -1) {
				if (rec.get('value') == '')	{
				    Ext.MessageBox.alert('Status', 'Invalid data ! ['+name+']', function() {});
					action = 'fail';
					return;
				}
			}

			values += rec.get('name').substring(2, rec.get('name').length)+'='+me.rawValue(rec)+'&';
			values1 += rec.get('name').substring(2, rec.get('name').length)+"='"+me.rawValue(rec)+"',";
			if (me.table == 'crm_customer' && rec.get('name').substring(2, rec.get('name').length) == 'crm_id' && rec.get('value') != '0')
			{
				action = 'update';
				captcha = 'crm_id='+rec.get('value');
				walue = rec.get('value');
			} else
			if (me.table == 'crm_deals' && rec.get('name').substring(2, rec.get('name').length) == 'deal_id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'deal_id='+rec.get('value');
				walue = rec.get('value');
			} else
			if (me.table == 'crm_complain' && rec.get('name').substring(2, rec.get('name').length) == 'case_id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'case_id='+rec.get('value');
				walue = rec.get('value');
			} else
			if (me.table == 'crm_products' && rec.get('name').substring(2, rec.get('name').length) == 'product_id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'product_id='+rec.get('value');
				walue = rec.get('value');
			} else
			if (me.table == 'crm_warehouse' && rec.get('name').substring(2, rec.get('name').length) == 'warehouse_id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'warehouse_id='+rec.get('value');
				walue = rec.get('value');
			} else
			if (rec.get('name').substring(2, rec.get('name').length) == 'id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'id='+rec.get('value');
				walue = rec.get('value');
			}

			if (rec.get('name').substring(2, rec.get('name').length) == 'owner') {
				owner = rec.get('value');
			}
        });								

		if (action == 'fail')
			return;
		
		if (me.form)
			me.form.setVisible(false);				

		Ext.getBody().mask('Saving...');
		if (action == 'insert')
		{		
			values = values.substring(0, values.length - 1);
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: action, func: me.func, table: me.table, values:values, where: me.where},
			   success: function(response, opts) {
				  Ext.getBody().unmask();				
  				  me.store.reload();
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});
		} else {			
			if (walue.length == 0 || walue == '0') {
				 Ext.MessageBox.alert('Status', 'Access denied !', function() {});
				 return;
			}	
			values1 = values1.substring(0, values1.length - 1);
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: action, func: me.func, table: me.table, values:values1, where: captcha},
			   success: function(response, opts) {
				  Ext.getBody().unmask();
				  me.store.reload();									  
				  if (me.grid)				
						me.grid.getSelectionModel().clearSelections();

				  if (me.table == 'crm_users' && logged == owner) {
						Ext.Msg.confirm('Warning','Мэдээлэл өөрчлөгдсөн тул дахин нэвтрэх шаардлагатай !',function(btn){
							if(btn === 'yes'){
								document.location.href = "logout.php";
							} else {
								
							}	
						});		
				  }
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});
		}

		me.form.createSource();
	},

	initSource: function() {
	},
	
	updateRecord: function() {		
		var me = this;
		var values = '', values1 = '';
		var action = 'insert';
		var captcha = '';
		var walue = '';
		me.form.getStore().each(function(rec){
			values += rec.get('name').substring(2, rec.get('name').length)+'='+me.rawValue(rec)+'&';
			values1 += rec.get('name').substring(2, rec.get('name').length)+"='"+me.rawValue(rec)+"',";
			
			if (me.table == 'crm_customer' && rec.get('name').substring(2, rec.get('name').length) == 'crm_id' && rec.get('value') != '0')
			{
				action = 'update';
				captcha = 'crm_id='+rec.get('value');
				walue = rec.get('value');
			} else
			if (me.table == 'crm_deals' && rec.get('name').substring(2, rec.get('name').length) == 'deal_id' && rec.get('value') != '0')
			{
				action = 'update';
				walue = rec.get('value');
				captcha = 'deal_id='+rec.get('value');
			} else
			if (me.table == 'crm_complain' && rec.get('name').substring(2, rec.get('name').length) == 'case_id' && rec.get('value') != '0')
			{
				action = 'update';
				walue = rec.get('value');
				captcha = 'case_id='+rec.get('value');
			}
        });	
		if (walue.length == 0 || walue == '0') {
			 Ext.MessageBox.alert('Status', 'Access denied !', function() {});
			 return;
		}			
		
		Ext.getBody().mask('Saving...');
		if (action == 'update') {					
			values1 = values1.substring(0, values1.length - 1);
			Ext.Ajax.request({
			   url: 'avia.php',					   
			   params : {handle: 'web', action: action, func: '', table: me.table, values:values1, where: captcha},
			   success: function(response, opts) {
				  Ext.getBody().unmask();
				  Ext.MessageBox.alert('Status', 'Success !', function() {});
				  if (me.modelName == 'CRM_RETAIL')				 				  
					  views['retail'].store.reload();
				  else
					  views['corporate'].store.reload();
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});			
		}
	},
	
	selectedMyCreatedIds: function(id) {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		var result = '';
		for (i = 0; i < recs.length; i++) {
			if (recs[i].get('userCode') == logged)			
				result += recs[i].get(id)+':';
		}

		return result;
	},

	deleteRecord: function() {		
		var me = this;
		var selection = me.grid.getSelectionModel().getSelection();
		if (selection.length == 0) {
			Ext.MessageBox.alert('Status', 'Not selected !', function() {});
			return;
		}
				
		Ext.Msg.confirm('Warning ','Are you sure you want to delete? ('+selection.length+' records)',function(btn){
			if(btn === 'yes'){
				if (selection.length == 1) {
					if (user_level < 2 && selection[0].get('owner') && selection[0].get('owner') != logged && selection[0].get('userCode') != logged) {
						Ext.MessageBox.alert('Status', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
						return;
					}

					var id = selection[0].get(me.primary);
					if (id == '' || id == '0') {
					    Ext.MessageBox.alert('Status', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
						return;
					}
				
					Ext.getBody().mask('Deleting...');
					Ext.Ajax.request({
					   url: 'avia.php',					   
					   params : {handle: 'web', action: 'delete', func: me.func, table: me.table, where: id},
					   success: function(response, opts) {
							Ext.getBody().unmask();
							me.store.reload();
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});
				} else {
					Ext.Msg.confirm('Warning ','You are delete too many records !',function(btn){
						if(btn === 'yes'){
							var ids = me.selectedMyCreatedIds(me.primary);
							if (ids == '' || ids == '0') {
							    Ext.MessageBox.alert('Status', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
								return;
							}
			
							Ext.getBody().mask('Deleting...');
							Ext.Ajax.request({
							   url: 'avia.php',					   
							   params : {handle: 'web', action: 'delete', func: me.func, table: me.table, where: ids},
							   success: function(response, opts) {
									Ext.getBody().unmask();
									me.store.reload();
							   },
							   failure: function(response, opts) {										   
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
							   }
							});
						}
					});
				}
			}else{
				
			}	
		});		
	},

	rawValue: function(rec) {
		if (rec.get('name').indexOf('birthday') != -1 || rec.get('name').indexOf('date') != -1 || rec.get('name').substring(2, rec.get('name').length) == 'remind_at') {
			if (rec.get('value') && rec.get('value').length == 10)
				return rec.get('value');
			if (rec.get('name').substring(2, rec.get('name').length) == '_date')
				return rec.get('value');
		    return Ext.Date.format(rec.get('value'), 'Y-m-d');
		}
		if (rec.get('name').indexOf('_time') != -1) {
		    return Ext.Date.format(rec.get('value'), 'h:i');
		}
		if (rec.get('name').substring(2, rec.get('name').length) == 'password')
		{
			var value = rec.get('value');
			var hash = value;
			if (value.length < 20) {					
				var jsSha = new jsSHA(rec.get('value'));
				hash = jsSha.getHash("SHA-512", "HEX");
			}

			value = hash;
			return value;
		}
		
		value = rec.get('value');
		if (value == '' && 
			(
			 rec.get('name').indexOf('_cost') != -1 || 
			 rec.get('name').indexOf('_revenue') != -1 || 
			 rec.get('name').indexOf('amount') != -1 || 
			 rec.get('name').indexOf('qty') != -1 ||
 			 rec.get('name').indexOf('price') != -1 ||
			 rec.get('name').indexOf('crm_id') != -1 || 
			 rec.get('name').indexOf('tatvar') != -1 || 
			 rec.get('name').indexOf('capital') != -1 || 
			 rec.get('name').indexOf('customer_type') != -1
			)
		   ) {		
			value = '0';
		}
		if (value == null)
			return '';
		/*
		if (value && value.indexOf('&') != -1) {
			value = replaceAll('&', 'and7', value);
		}*/

		return value;
	}
});
	
Ext.define('OSS.SearchCombo', {
    extend  : 'Ext.form.field.ComboBox',
    alias   : 'widget.searchcombo',
	pageSize: 100,
	valueField: 'value',
	displayField: 'value',
    typeAhead: false,
    hideLabel: false,
    hideTrigger: false,
	minChars: 1,
	anchor: '120%',		
	table: 'crm_customer',
	listConfig : {
		width: 500,
		loadingText: 'Хайж байна...',
		emptyText: '<span class="search_result">илэрц байхгүй !</span>',
		getInnerTpl: function() {
			return '<span class="search_result">{value}</span>';
		}
	},
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	initComponent: function() {
		var me = this;
	
		me.store = Ext.create('Ext.data.Store', {
			pageSize: 100,
			proxy: {
				type: 'ajax',
				url : 'avia.php',
				reader: {
					type:'json',
    	            root:'items',
    	            totalProperty: 'results'
    	        },
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
				extraParams: {handler: 'web', func: 'crm_query_list', action: 'select', table: me.table, fields: me.name}
			},
			fields: [{name: me.name, name: 'value'}]
		});

		me.callParent(arguments);
	}
});

Ext.define('OSS.CustomerSearchCombo', {
    extend  : 'Ext.form.field.ComboBox',
    alias   : 'widget.customercombo',

	pageSize: 100,
	valueField: 'crm_id',
	displayField: 'crm_name',
    typeAhead: false,
    hideLabel: false,
    hideTrigger: false,
	minChars: 1,
	anchor: '120%',		
	table: 'crm_customer',
	listConfig : {
		width: 500,
		loadingText: 'Хайж байна...',
		emptyText: '<span class="search_result">илэрц байхгүй !</span>',
		getInnerTpl: function() {
			return '<span class="search_result">{crm_name}</br><b>{phone}</b></span>';
		}
	},
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	initComponent: function() {
		var me = this;
	
		me.store = Ext.create('Ext.data.Store', {
			pageSize:100,
			proxy: {
				type: 'ajax',
				url : 'avia.php',
				reader: {
					type:'json',
    	            root:'items',
    	            totalProperty: 'results'
    	        },
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
				extraParams: {handler: 'web', func: 'crm_customer_query_list', action: 'select'}
			},
			fields: [{name: 'crm_id'}, {name: 'crm_name'}, {name: 'phone'}]
		});

		me.callParent(arguments);
	},

	getPhoneValue: function() {

	}
});

Ext.define('OSS.RouteSearchCombo', {
    extend  : 'Ext.form.field.ComboBox',
    alias   : 'widget.routecustomercombo',

	pageSize: 100,
	valueField: 'descr',
	displayField: 'descr',
    typeAhead: false,
    hideLabel: false,
    hideTrigger: false,
	minChars: 1,
	anchor: '120%',		
	table: 'crm_customer',
	listConfig : {
		width: 500,
		loadingText: 'Хайж байна...',
		emptyText: '<span class="search_result">илэрц байхгүй !</span>',
		getInnerTpl: function() {
			return '<span class="search_result">{descr}</span>';
		}
	},
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	initComponent: function() {
		var me = this;
	
		me.store = Ext.create('Ext.data.Store', {
			pageSize:100,
			proxy: {
				type: 'ajax',
				url : 'avia.php',
				reader: {
					type:'json',
    	            root:'items',
    	            totalProperty: 'results'
    	        },
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
				extraParams: {handler: 'web', func: 'crm_route_customer_query_list', action: 'select'}
			},
			fields: [{name: 'descr'}]
		});

		me.callParent(arguments);
	}
});

Ext.define('OSS.WareSearchCombo', {
    extend  : 'Ext.form.field.ComboBox',
    alias   : 'widget.warecombo',

	pageSize: 100,
	valueField: 'warehouse_id',
	displayField: 'name',
    typeAhead: false,
    hideLabel: false,
    hideTrigger: false,
	minChars: 1,
	anchor: '120%',		
	table: 'crm_warehouse',
	listConfig : {
		width: 500,
		loadingText: 'Хайж байна...',
		emptyText: '<span class="search_result">илэрц байхгүй !</span>',
		getInnerTpl: function() {
			return '<span class="search_result">{name}</span>';
		}
	},
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	initComponent: function() {
		var me = this;
	
		me.store = Ext.create('Ext.data.Store', {
			pageSize:100,
			proxy: {
				type: 'ajax',
				url : 'avia.php',
				reader: {
					type:'json',
    	            root:'items',
    	            totalProperty: 'results'
    	        },
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
				extraParams: {handler: 'web', func: 'crm_query_list', action: 'select', table: me.table, fields: 'name'}
			},
			fields: [{name: 'warehouse_id'}, {name: 'name'}]
		});

		me.callParent(arguments);
	}
});


Ext.define('OCS.GridWithFormPanel', {	
	extend: 'OCS.Module',
	table: '',
	searchBar: true,
	defaultRec: {},
	primary : 'id',
	region: 'center',
	insert: false,
	remove: false,
	hidden: false,
	feature: true,
	merge: false,
	tbarable: true,
	windowed: false,
	views: '',
	title: '',

	constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);

		Ext.apply(this, this.initialConfig);	
    },
	
	reload: function() {
		var me = this;
		me.store.loadPage(1);
	},
	
	setDefaultRec: function(rec) {
		var me = this;
		me.defaultRec = rec;
	},

	loadStore: function(where) {
		var me = this;
		me.where = where;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
		me.store.loadPage(1);
	},
	
	loadStoreSpec: function(func, start, end, values, where) {
		var me = this;
		me.where = where;		
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: func, sort:'_date', dir: 'asc', start_date: start, end_date: end, values: values, where: where};
		me.store.loadPage(1);
	},

	onTextFieldChange: function(v, field) {
		var me = this;			
		if (v) {
			me.duplicateCheck = true;
			me.where = v;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_retail_list', values: field, where: me.where};
			me.store.loadPage(1);
		} else {
			me.duplicateCheck = false;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_retail_list'};
			me.store.loadPage(1);
		}
	},
	
	selectedIds: function(id) {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		var result = '';
		for (i = 0; i < recs.length; i++) {
			result += recs[i].get(id)+':';
		}

		return result;
	},
	
	selectedMyCreatedIds: function(id) {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		var result = '';
		for (i = 0; i < recs.length; i++) {
			if (recs[i].get('userCode') == logged)			
				result += recs[i].get(id)+':';
		}

		return result;
	},

	recordSelected: function() {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return true;
		
		Ext.MessageBox.alert('Status', 'No Selection !', function() {});
		return false;
	},
	
	createGrid: function() {
		var me = this;
		me.createStore();

		me.features = [];
		if (me.groupField) {
			me.features = [{
				ftype: 'grouping',
				groupHeaderTpl: '{columnName}: {name} ({rows.length} бичлэг)',
				hideGroupedHeader: true,
				startCollapsed: true,
				disabled: (me.groupField.length == 0),
				id: 'grouping_'+me.modelName
			}];
		}
				
		me.grid = Ext.create('OCS.GridView', {				
			store: me.store,
			columns: me.createColumns(),
			features: me.features,
			actions: me.createActions(),
			func: me.func,
			feature: me.feature,
			hidden: me.hidden,
			tbarable: me.tbarable,	
			query: me.query,
			listeners : {
				//scope: this,
				//single: true,
				itemdblclick: function(dv, record, item, index, e) {
					if (me.form)				
						me.showForm();	
					console.log(1);
				}
			},
			deleteRecord: function() {
				me.deleteRecord();
			}
		});								
		
		if (!me.buttons)
			me.form = new OCS.PropertyGrid({
				modelName: me.modelName,
				region: 'east',
				hidden: true,
				title: me.title,			
				split: true,
				flex: 0.65,
				closable: true,
				closeAction: 'hide',
				sealedColumns: true				
			});
		else
			me.form = new OCS.PropertyGrid({
				modelName: me.modelName,
				region: 'east',
				hidden: true,
				title: me.title,			
				split: true,
				flex: 0.65,
				closable: true,
				closeAction: 'hide',
				sealedColumns: true,		
				buttons: [{
						iconCls: 'reset',
						text: 'Арилгах',
						handler: function() {
							me.form.updateSource(me.defaultRec);
						}				
					},'->',{
						iconCls: 'commit',
						text: 'Илгээх',
						listeners: {
							mouseover: function(){
								me.form.doLayout();
							}
						},
						handler: function() {
							me.commitRecord();	
						}
					}
				]
			});
		
		me.selection();
		me.initSource();

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,			
			region: me.region,
			title: (me.windowed?'':me.title),			
			items : [me.grid, me.form]	
		});

		return me.panel;
	},

	selection: function() {
		var me = this;
		me.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if (selections.length) {
					me.form.updateSource(selections[0]);
//					me.form.setVisible(true);
				} else {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(false);
				}				
			},			
			rowselect: function(sm, rowIdx, r) {
				me.form.updateSource(selections[0]);				
			}
		});
	},

	selectedRecord: function() {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return recs[0];
		
		return 0;
	},

	createActions: function(actions) {
		var me = this;

		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх...',
				disabled: me.insert,
				handler: function(widget, event) {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(true);
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Засах...',
				disabled: me.insert,
				handler: function(widget, event) {
					me.showForm();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				disabled: me.remove,
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'merge',
				text: 'Нэгтгэх...',
				disabled: !me.merge,
				handler: function(widget, event) {
					if (user_level > 0) {					
						if (me.grid.getView().getSelectionModel().getSelection().length == 2){					
							new OCS.MergeRecordsWindow({
								width: 650,
								height: 200,
								table: 'crm_products',
								name: 'Product',
								master: me.grid.getView().getSelectionModel().getSelection()[0],
								slave: me.grid.getView().getSelectionModel().getSelection()[1]
							}).show();
						} else
							Ext.MessageBox.alert('Status', 'Master & Slave record !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Экспорт',
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.title},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'help',
				text: 'Тусламж',
				handler: function(widget, event) {
					new OCS.HelpWindow({
						id: me.func
					}).show();
				}
			})			
		];

		return me.actions;
	},
	
	selectionModel: function() {
		var me = this;
		return me.grid.getSelectionModel();
	},

	showForm: function() {
		var me = this;
		if (me.recordSelected()) {		
			var selection = me.grid.getSelectionModel().getSelection();						
			if (selection.length == 1) {
				if (user_level < 3 && selection[0].get('owner') && selection[0].get('owner') != logged && selection[0].get('userCode') != logged) {
					Ext.MessageBox.alert('Status', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
					return;
				}
				me.form.setVisible(true);
			}
		}
		else
			Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
	},
	
	initSource: function() {
		var me = this;
		me.rec = {
			data: {
				id: '0'
			}
		};
	},

	updateSource: function(rec) {
		var me = this;
		me.rec = rec;
		me.form.updateSource(me.defaultRec);
		me.form.setVisible(true);
	}
});

Ext.define('OCS.UserGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',	

	createActions: function(actions) {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх...',
				disabled: me.insert,
				handler: function(widget, event) {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(true);
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Засах...',
				handler: function(widget, event) {
					me.showForm();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				disabled: me.remove,
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'chart',
				text: 'Зураг оруулах',
				handler: function(widget, event) {
					if (me.recordSelected())
						new OCS.ImageUserUploadWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).show();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'key',
				text: 'Нууц үг өөрчлөх ...',
				handler: function(widget, event) {
					if (me.recordSelected())
						new OCS.ChangePasswordWindow({
							selected: me.selectedRecord(),
							backgrid: me.grid
						}).show();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'case_grid',
				text: 'Эрхийн зохицуулалт ...',
				disabled: (user_level < 2),
				handler: function(widget, event) {
					if (me.recordSelected())
						new OCS.PermissionWindow({
							selected: me.selectedRecord(),
							backgrid: me.grid
						}).show();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'lic_key',
				text: 'License key ...',
				handler: function(widget, event) {
					
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'backup',
				text: 'Нөөц авах...',
				handler: function(widget, event) {
					Ext.getBody().mask('Backup processing...');
					Ext.Ajax.request({
					   url: 'avia.php',
					   params: {handle: 'web', action: 'backup'},
					   success: function(response, opts) {
						   Ext.getBody().unmask();
						  Ext.MessageBox.alert('Status', 'Complete !', function() {});
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});
				}
			}),			
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Экспорт',
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.title},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'help',
				text: 'Тусламж',
				handler: function(widget, event) {
					new OCS.HelpWindow({
						id: me.func
					}).show();
				}
			})			
		];

		return me.actions;
	}
});

Ext.define('OCS.WareHouseGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',	
	modelName:'CRM_WAREHOUSE',
	func:'crm_warehouse_list',	
	table: 'crm_warehouse',
	tab: 'my_crm_warehouse_list',
	primary: 'warehouse_id',
	buttons: !(user_level==0),
	feature: false,
	merge: true,
	insert: (user_level==0),
	remove: (user_level==0),	
	defaultRec: {
		data: {
			warehouse_id: '0'
		}
	},

	createActions: function(actions) {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх...',
				disabled: me.insert,
				handler: function(widget, event) {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(true);
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Засах...',
				handler: function(widget, event) {
					me.showForm();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				disabled: me.remove,
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),				
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'merge',
				text: 'Нэгтгэх...',
				disabled: !me.merge,
				handler: function(widget, event) {
					
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Экспорт',
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.title},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'help',
				text: 'Тусламж',
				handler: function(widget, event) {
					new OCS.HelpWindow({
						id: me.func
					}).show();
				}
			})			
		];

		return me.actions;
	},
		
	selection: function() {
		var me = this;
		me.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if (selections.length) {
					me.form.updateSource(selections[0]);
//					me.form.setVisible(true);
				} else {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(false);
				}				

				views['product'].storageReload(selections[0]);
			},			
			rowselect: function(sm, rowIdx, r) {
				me.form.updateSource(selections[0]);					
			}
		});
	}
});

Ext.define('OCS.WareHouseProductGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',	
	values: 'warehouse_id',
	buttons: !(user_level==0),
	feature: true,
	merge: true,
	insert: (user_level==0),
	remove: (user_level==0),	
	xlsName: 'Storage',
	defaultRec: {
		data: {
			warehouse_id: '0',
			_date: Ext.Date.format(new Date(),'Y-m-d h:m:s')
		}
	},
	
	loadStore: function(selected) {
		var me = this;
		me.selected = selected;
		if (me.selected)	
			me.where = me.selected.get('warehouse_id');
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
		me.store.loadPage(1);
	}
});


Ext.define('OCS.StorageGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',	
	modelName:'CRM_STORAGE',
	func:'crm_storage_list',	
	table: 'crm_storage',
	tab: 'my_crm_storage_list',
	primary: 'id',
	values: 'warehouse_id',
	buttons: !(user_level==0),
	feature: true,
	merge: true,
	insert: (user_level==0),
	remove: (user_level==0),	
	xlsName: 'Storage',
	defaultRec: {
		data: {
			warehouse_id: '0',
			_date: Ext.Date.format(new Date(),'Y-m-d h:m:s')
		}
	},
	
	loadStore: function(selected) {
		var me = this;
		me.selected = selected;
		if (me.selected)		
			me.where = me.selected.get('warehouse_id');
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
		me.store.loadPage(1);
	},

	createActions: function(actions) {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Орлогодох/Зарлагадах...',
				disabled: me.insert,
				handler: function(widget, event) {
					if (me.selected)
						new OCS.StorageAddProductWindow({
							selected: me.selected,
							backgrid: me.grid
						}).show();
					else
						Ext.MessageBox.alert('Status', 'Та агуулах сонгоно уу !', function() {});
				}
			}),						
			'-',			
			Ext.create('Ext.Action', {
				iconCls   : 'import',
				text: 'Импорт',
				handler: function(widget, event) {
					new OCS.UploadWindow({
						name: me.xlsName
					}).show();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Экспорт',
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.title},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'help',
				text: 'Тусламж',
				handler: function(widget, event) {
					new OCS.HelpWindow({
						id: me.func
					}).show();
				}
			})			
		];

		return me.actions;
	}
});

Ext.define('OCS.ProductGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',	
	modelName:'CRM_PRODUCT',
	func:'crm_product_list',	
	table: 'crm_products',
	tab: 'my_crm_product_list',
	primary: 'product_id',
	buttons: !(user_level==0),
	feature: true,
	merge: true,
	sortField: product_sort_field,
	insert: (user_level==0),
	remove: (user_level==0),	
	defaultRec: {
		data: {
			product_id: '0',
			price: '0'
		}
	},
	xlsName: 'Product',

	createActions: function(actions) {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх...',
				disabled: me.insert,
				handler: function(widget, event) {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(true);
				}
			}),			
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Засах...',
				disabled: me.insert,
				handler: function(widget, event) {
					me.showForm();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				disabled: me.remove,
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',			
			Ext.create('Ext.Action', {
				iconCls   : 'merge',
				text: 'Нэгтгэх...',
				disabled: !me.merge,
				handler: function(widget, event) {
					
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'chart',
				text: 'Зураг оруулах',
				handler: function(widget, event) {
					if (me.recordSelected())
						new OCS.ImageUploadWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).show();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'import',
				text: 'Импорт',
				handler: function(widget, event) {
					new OCS.UploadWindow({
						name: me.xlsName
					}).show();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Экспорт',
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.title},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'help',
				text: 'Тусламж',
				handler: function(widget, event) {
					new OCS.HelpWindow({
						id: me.func
					}).show();
				}
			})			
		];

		return me.actions;
	}
});


Ext.define('OCS.CampaignResultGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',	

	modelName:'CRM_CAMPAIGN_RESULT',
	func:'crm_campaign_result_list',
	title: 'Campaign results',
	insert: false,
	tbarable: false,
	remove: false,
	tab: 'my_campaign_results_list',
	values: '',

	createActions: function(actions) {
		var me = this;
		me.actions = [			
		];

		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.where = rec.get('campaign');
		me.values = 'campaign';
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, where: me.where, values: me.values};
		me.store.load();
	}
});


Ext.define('OCS.Window', {
	extend : 'Ext.Window',
	table: '',
	layout: 'border',
	closable: true,
	modal: true,
	minWidth: 350,
	listeners : {
		'close': function() {
			var me = this;
			if (me.backgrid)
				me.backgrid.getStore().reload({callback: function() {
					if (me.title == 'Products') {
						var amount = 0;
						me.backgrid.getStore().each(function(rec){
							amount += rec.get('amount');
						});

						me.selected.set('expected_revenue', amount);
						views[pk].action.update(me.selected);
					}
				}});
		}
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);		
    },

	commitRecord: function(values) {
		var me = this;
		Ext.Ajax.request({
		   url: 'avia.php',
		   params: {handle: 'web', table: me.table, action: 'insert', values: values},
		   success: function(response, opts) {
				me.close();
		   },
		   failure: function(response, opts) {										   
			  Ext.MessageBox.alert('Status', 'Error !', function() {});
		   }
		});
	},

	getCustomerName: function(rec) {
		v = rec.get('level');
		if (rec.data['_class'] && rec.data['_class'].indexOf('VIP') != -1) v = 'vip';
		if (rec.data['crm_name'])
			return rec.get('crm_name').split(',')[0];

		return '<span class="circle '+v+'">&nbsp;</span> '+rec.get('firstName')+' <span style="color:gray">'+rec.get('lastName')+'</span>';
	}
});

Ext.define('OCS.HelpWindow', {
	extend : 'OCS.Window',
	title: 'Тусламж',
	width: 450,
	height: 550,
	maximizable: true,
	modal: true,
	layout: 'border',

	initComponent: function() {
		var me = this;
		me.items = [{
			xtype: 'panel',
			region: 'center',
			border: false,
			autoScroll: true,
			bodyPadding: 15,
			autoLoad: {
				url: 'help/'+me.id+'.html'
			}
		}];

		me.callParent(arguments);
    }	
});


Ext.define('OCS.AddProductWindow', {
	extend: 'OCS.Window',
	title: 'Add product',
	table: 'crm_quote_details',
	width: 350,
	height: 300,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.FormPanel', {
			id : 'add_quote_product',				
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [
			{
				xtype: 'textfield',
				fieldLabel: 'Quote ID',
				name: 'quote_id',
				value: selectedQuote.get('id'),
				readOnly: true
			},
			{
				xtype: 'searchcombo',
				fieldLabel: 'Product',
				table: 'crm_products',
				name: 'product_name'
			},
			{
				xtype: 'numberfield',
				fieldLabel: 'Qty',
				name: 'qty',
				value: 1
			},{
				xtype: 'currencyfield',
				fieldLabel: 'Price',
				name: 'price',
				value: 0
			},{
				xtype: 'currencyfield',
				fieldLabel: 'Amount (Discount)',
				name: 'amount',
				value: 0
			},{
				xtype: 'datefield',
				fieldLabel: 'Date',
				value: new Date(),
				format: 'Y-m-d',
				hidden: true,
				name: '_date'
			}],
			buttons: [{
				text: 'Илгээх',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						me.commitRecord(values);
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
	
		me.items = [me.form];		
		me.callParent(arguments);
	}
});

Ext.define('OCS.AlarmWindow', {
	extend: 'OCS.Window',
	id: 'alarm_window',
	title: 'Alarms',
	width: 350,
	height: 300,
	layout: 'border',

	initComponent: function() {
		var me = this;
		me.view = new OCS.AnimateView();
		me.items = [me.view.createView()];		
		me.callParent(arguments);
	}
});

Ext.define('OCS.MessageWindow', {
	extend: 'OCS.Window',
	title: 'Compose message',
	table: 'crm_message',
	width: 350,
	height: 300,

	initComponent: function() {
		var me = this;
		me.form = Ext.create('OCS.FormPanel', {
			id : 'message_to_window',				
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [
			{
				xtype: 'textfield',
				fieldLabel: 'Subject',
				selectOnFocus: true,
				name: 'subject'
			},
			{
				xtype: 'textfield',
				fieldLabel: 'From',
				name: '_from',
				value: logged,
				readOnly: true
			},
			{
				xtype: 'searchcombo',
				fieldLabel: 'To',
				table: 'crm_users',
				name: 'owner'
			},
			{
				xtype: 'textarea',
				fieldLabel: 'Тайлбар',
				hideLabel: true,
				name: 'descr',
				emptyText: 'Тайлбар бичнэ үү !',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Илгээх',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						me.commitRecord(values);
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		
		me.items = [me.form];		
		me.callParent(arguments);
	}
});



Ext.define('OCS.DropGridPanel', {	
	extend: 'OCS.GridWithFormPanel',
	table: 'crm_products',
	searchBar: true,
	defaultRec: {},
	primary : 'id',
	region : 'center',
	
	constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);
		
		Ext.apply(this, this.initialConfig);	
    },

	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {
					if (selectedQuote.get('quote_status') != 'draft') {
					  Ext.MessageBox.alert('Status', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
					  return;
					}
					
					if (selectedQuote)
					{					
						new OCS.AddProductWindow({
							listeners:{
								close:function(){								
									me.loadStore(me.where);
								}
							}
						}).show();
					} else {
						  Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					}
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				handler: function(widget, event) {
					if (selectedQuote.get('quote_status') != 'draft') {
					  Ext.MessageBox.alert('Status', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
					  return;
					}
					me.deleteRecord();
				}
			})
		];

		return me.actions;
	},

	createGrid: function() {
		var me = this;
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			title: me.title,
			region: me.region,
			actions: me.createActions(),
			feature: true,
			hidden: me.hidden,
			columns: me.createColumns(),
			flex: me.flex			
		});	


		return me.grid;
	}
});


Ext.define('OCS.PropertyGrid', {
    extend: 'Ext.grid.PropertyGrid',
    alias: 'widget.ocspropertygrid',
	
    constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
		this.createSource();
    },
	
    config: {
        title: 'Property',
		closable: true,
		closeAction: 'hide',
		border: false,
		closeAction: 'hide',
		flex: 1,
		viewConfig: { 
			stripeRows: false, 
			getRowClass: function(record) { 
				var name = record.data.name.substring(2, record.data.name.length);
				
				if (name == 'notify' || name == 'mayDuplicate' || name == 'parent_crm_id' || name == 'customer_type' || name == 'crm_id' || name == 'case_id' || name == 'deal_id' || name == 'id' || name == 'userCode' || name == '_date' || name == 'personal' || name == 'service_id')
					return 'zero-adult-row';
				
				if (name == 'descr')
					return 'descr-adult-row';

				return 'adult-row';
				//return record.get('value') =='' ? 'child-row' : 'adult-row'; 
			} 
		}
    },

    onRender: function() {
        this.callParent(arguments);
    },
	
	createSource: function() {
		var me = this;
		me.array = [];
		me.render = [];
		for (i = 0; i < fields[me.modelName+'_FIELDS'].length; i++) {
			f = fields[me.modelName+'_FIELDS'][i];
			if (me.modelName == 'CRM_STAT' || me.modelName == 'CRM_USER_PLANNING'){
				if (f.name == 'team') continue;
			}
			if (f.name == 'crm_name' || f.name == 'deal_name' || f.name == 'service_name' || f.name == 'notify') continue;
			me.array[(i < 10?'0'+i:i)+f.name] = '';
			me.render[(i < 10?'0'+i:i)+f.name] = {
				displayName: f.text,
                editor: me.getEditor(f.name)
			};
		}

		me.setSource(me.array, me.render);
	},
	
	updateSource: function(rec) {
		var me = this;
		me.array = [];
		me.render = [];
		for (i = 0; i < fields[me.modelName+'_FIELDS'].length; i++) {
			f = fields[me.modelName+'_FIELDS'][i];
			if (me.modelName == 'CRM_STAT' || me.modelName == 'CRM_USER_PLANNING'){
				if (f.name == 'team') continue;
			}
			if (f.name == 'crm_name' || f.name == 'deal_name' || f.name == 'service_name' || f.name == 'notify') continue;
			me.array[(i < 10?'0'+i:i)+f.name] = (rec.data[f.name]?rec.data[f.name]:''); 
			me.render[(i < 10?'0'+i:i)+f.name] = {
				displayName: f.text,
				renderer: f.text == '#'?'':f.renderer,
                editor: me.getEditor(f.name,(rec.data[f.name]?rec.data[f.name]:''))
			};
		}

		me.setSource(me.array, me.render);
	},

	getEditor: function(name, value) {
		var me = this;
		if (name == 'type')
			return {
				xtype: 'textfield',
				readOnly: true,
				name: name
			};
		
		if (name == 'precent' || name.indexOf('_p') != -1 || name == '_month' || name == '_year' || name == 'unit_size' || name == 'discount')
			return {
				xtype: 'numberfield',
				name: name
			};

		if (name == 'password')
			return {
				xtype: 'textfield',
				inputType: 'password',
				disabled: (user_level != 3),
				name: name
			};

		if (name == '_date' || name == 'id')
			return {
				xtype: 'textfield',
				readOnly: true,
				name: name
			};

		if (name.indexOf('date') != -1 || name.indexOf('remind_at') != -1 || name.indexOf('birthday') != -1)
			return {
				xtype: 'datefield',
				format: 'Y-m-d',
				value: value,
				name: name
			};

		if (name.indexOf('time') != -1)
			return {
				xtype: 'timefield',
				name: name,
				minValue: '09:00',
			    maxValue: '20:00',
				format: 'H:i',
			    altFormats:'H:i',
				increment: 30				
			};

		if (name == 'crm_id' || name == 'deal_id' || name == 'case_id' || name == 'quote_code' || name == 'quote_id') {
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_customer',
				disabled: true
			};		
		}

		if (name == 'product_name') {
			return {
				xtype: 'searchcombo',
				name: 'product_name',
				table: 'crm_products'
			};
		}
		
		if (name == 'mon' || name == 'thue' || name == 'wed' || name == 'thur' || name == 'fri' || name == 'sat' || name == 'sun') {
			return {
				xtype: 'routecustomercombo',
				name: name,
				table: 'crm_customer'
			};
		}

		if (name == 'company') {
			return {
				xtype: 'searchcombo',
				name: 'company',
				table: 'crm_users'
			};
		}	

		if (name == 'customer_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_OBJECT',
 				  data: [{id:0, value: 'retail'},{id: 1, value: 'corporate'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'id',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'level')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'suspect'},{value: 'prospect'},{value: 'customer'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'warehouse_id')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_PREV',
 				  data: [{value: 1, name: ware_text[0]},{value: 2, name: ware_text[1]}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'name',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}


		if (name == 'stage')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'lead'},{value: 'opportunity'},{value: 'quote'},{value: 'close as lost'},{value: 'close as won'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  disabled: true,
			  editable: false
			};
		}

		if (name == 'service_stage')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'receipt'},{value: 'service'},{value: 'remind'},{value: 'closed'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  disabled: true,
			  editable: false
			};
		}

		if (name == 'deal_origin')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'new'},{value: 'extension'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'gender')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'эр'},{value: 'эм'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'case_stage')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'identify'},{value: 'research'},{value: 'resolve'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false,
			  disabled: true
			};
		}

		if (name == 'campaign_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'planning'},{value: 'active'},{value: 'inactive'},{value:'complete'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'campaign_live')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'dynamic'},{value: 'static'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',			  
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'user_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_PREV',
 				  data: [{value: 'retail', name: 'VAN SELLING'},{value: 'corporate', name: 'PRE SELLING'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'name',
			  valueField: 'value',			  
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'campaign_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'task'},{value: 'phone call'},{value: 'appointment'},{value: 'email'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'open'},{value: 'inactive'},{value: 'postponed'},{value: 'won'},{value: 'lost'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'quote_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'draft'},{value: 'confirmed'}, {value: 'close as won'}, {value: 'close as lost'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'calltype')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'inbound'},{value: 'outbound'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'callresult')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
				  data: [{value: 'pending'},{value: 'success'},{value: 'unsuccess'},{value: 'remind'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == '_from')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
				  data: [{value: 'office'},{value: 'mobile'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'complain_origin')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				model: 'CRM_ITEM',
				data: [{value: 'phone'},{value: 'web'},{value: 'email'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'complain_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				model: 'CRM_ITEM',
				data: [{value: 'problem'},{value: 'feature request'},{value: 'question'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'user_level')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_OBJECT',
 				  data: [{id: -1, value: 'Ажлаас гарсан'},{id: 0, value: 'Борлуулагч'},{id: 1, value: 'Менежер'}, {id: 2, value:'Ахлах'}, {id: 3, value:'Администратор'}, {id: 5, value:'Захирал'}, {id: 10, value:'Эзэн'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'id',
			  triggerAction: 'all',
			  disabled: !(user_level >= 3),
			  editable: false
			};
		}

		if (name == 'event_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'meeting'},{value: 'send e-mail'},{value:'other'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'remind_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'popup'},{value: 'email'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == '_class')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'RETAIL'},{value: 'VIP'},{value: 'EXPAT'},{value: 'SME'},{value: 'RESELLER'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'employees')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: '10 доош'},{value: '10-50'},{value: '50-100'},{value:'100-500'},{value:'500-1000'},{value:'1000-с дээш'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'company_torol')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'ХХК'},{value: 'ХК'},{value: 'ТӨХК'},{value: 'ТББ'},{value: 'ББСБ'},{value: 'ТӨҮГ'},{value: 'ОНӨҮГ'},{value: 'ХЗХ'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'industry')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'Уул уурхай'},{value: 'Барилга'},{value: 'Банк, санхүү'},{value: 'Үйлдвэрлэл'},{value: 'Худалдаа, үйлчилгээ'},{value: 'Тээвэр'},{value: 'Зам, гүүр'},{value: 'Шугам сүлжээ'},{value: 'Аялал жуулчлал'},{value: 'Худалдаа'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'issue')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: '1'},{value: '2'},{value: '3'},{value: '4'}]
              }),
			  name: name,
			  value: 1,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'priority')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'low'},{value: 'medium'},{value: 'high'},{value: 'important'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'regNo')
			return {
				xtype: 'searchcombo',
				name: name,
				emptyText: '',
				maxLength: 10,
				maskRe : /[0-9А-ЯӨҮ]/,
				table: 'crm_customer'
			};
		
		if (name == 'descr' || name == 'address' || name == 'horoo' || name == 'strength' || name == 'weakness' || name == 'current_situation' || name == 'customer_need' || name == 'proposed_solution') {
			return {
				xtype: 'textarea',
				hideLabel: true,
				height: 150,
				emptyText: 'Тайлбар бичнэ үү !',
				style: 'margin-top:130px', 
				name: name
			};		
		}

		if (name == 'firstName' || name == 'lastName' || name == 'job_title' || name == 'job_postion' || name == 'country' || name == 'city' || name == 'district' || name == 'horoo' || name == 'type') {
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_customer'
			};		
		}
		
		if (name == 'owner') {
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_users'
			};		
		}
		
		if (name == 'personal')
		{
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_personal_view'
			};
		}

		if (name == 'campaign')
		{
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_campaign'
			};
		}
		
		if (name == 'field')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'firstName'},{value: 'lastName'},{value: 'birthday'},{value: 'gender'},{value: 'title'},{value: 'job_title'},{value: 'phone'},{value: 'email'},{value: 'district'},{value: 'horoo'},{value: 'annual_revenue'},{value: 'capital'},{value:'tatvar'},{value:'industry'},{value:'industry_sub'},{value:'source'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'equals')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'equal'},{value: 'does not equal'},{value: 'is greater than'},{value: 'is less than'},{value: 'begins with'},{value: 'ends with'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'purpose')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'sales'},{value: 'care'},{value: 'broadcast'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'email_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'draft'},{value: 'sent'},{value: 'inbox'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'event_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'pending'},{value: 'completed'},{value: 'cancelled'},{value: 'remind'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'complain_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'open'},{value: 'solved'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'task_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'open'},{value: 'processing'},{value: 'completed'},{value: 'remind'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'workflow_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'processing'},{value: 'completed'},{value: 'closed'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'unit_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: 'ш'},{value: 'кг'},{value: 'л'},{value: 'хр'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'complain_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: 'active'},{value: 'inactive'},{value: 'solved'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'pay_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_PREV',
				 data: [{value: 'cash',name:'Бэлнээр'},{value: 'bank',name:'Бэлэн бусаар'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'name',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'resolution_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_PREV',
				 data: [{value: 'calls',name:'Дуудлагын бүртгэл'},{value: 'information request',name:'Мэдээлэл хүссэн хүмүүсийн бүртгэл'},{value: 'complaints',name:'Санал гомдлын бүртгэл'},{value: 'information submitted', name:'Мэдээлэл хүргүүлсэн бүртгэл'},{value: 'problem solved', name: 'Problem solved'},{value: 'information provided', name: 'Information provided'},{value: 'other', name: 'Бусад'}] 
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'name',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'warehouse_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_PREV',
				 data: [{value: 'storage',name:'Байнгын'},{value: 'container',name:'Богино хугацааны'},{value: 'owner',name:'Борлуулагчийн'}] 
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'name',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'call_from')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: '94097007'},{value: '70107007'}] 
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'decision_maker')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: 'manager'}, {value: 'decision maker'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
	  
		if (name == 'phone' || name == 'phone1' || name == 'fax')
			return {
				xtype: 'textfield',
				name: name,
				emptyText: 'xxxxxxxx',
				maskRe: /[\d\-]/,
				regex: /^\d{8}$/,
				maxLength: 8,
				regexText: 'Must be in the format xxx-xxx-xxxx'			
			};
			
		if (name == 'email')
			return {
				xtype: 'textfield',
				name: name,
				vtype: 'email',
				maxLength: 32
			};
		
		if (name == 'duration' || name == 'total_members')
			return {
				xtype: 'numberfield',
				name: name
			};
		
		if (name == 'amount' || name == 'total_amount')
			return {
				xtype: 'numericfield',
				value: 0,				
				decimalPrecision: 2,
			    allowNegative: true,
				useThousandSeparator: true,
		        currencySymbol:'₮',
				name: name,
				listeners: {
					'change': function(v) {
						if (v.getName() == 'amount') {					
							var promo_code = me.store.getAt(5).get('value');
							var promo_precent = me.store.getAt(7).get('value');
							var value = v.getValue();
							if (promo_code == 'U4') {
								if (value >= 1000000 && value < 1500000)
									promo_precent = 1;								
								if (value >= 1500000 && value < 2000000)
									promo_precent = 2;			
								if (value >= 2000000)
									promo_precent = 3;			
								value = (value * 100)/(100-promo_precent);
								me.store.getAt(7).set('value', promo_precent);
							} else
							if (promo_code == 'U3') {
								var promo_amount = me.store.getAt(5).get('value');
								value = (value * 100)/(100-promo_precent);
								if (value >= promo_amount) {
									if (value >= 1000000 && value < 1500000)
										promo_precent = 1;								
									if (value >= 1500000 && value < 2000000)
										promo_precent = 2;			
									if (value >= 2000000)
										promo_precent = 3;	
									
									value = (value * 100)/(100-promo_precent);
								}
							} else
							if (promo_code == 'U2') {
								value = (value * 100)/(100-promo_precent);
							} else
							if (promo_code == 'U1') {
								value = value;
							}
							me.store.getAt(9).set('value', value);
						}
					}
				}
			};

		if (name == 'price' || name == 'amount' || name == 'budgeted_cost' || name == 'reported_revenue' || name == 'actual_cost' || name == 'expected_revenue' || name == 'amountTheshold')
			return {
				xtype: 'numericfield',
				value: 0,
				decimalPrecision: 2,
			    allowNegative: true,
				useThousandSeparator: true,
		        currencySymbol:'₮',
				name: name,
				id: name
			};
		
		if (name == 'userCode')
			return {
				xtype: 'textfield',
				disabled: true,
				name: name
			};

		return {
			xtype: 'textfield',
			name: name,
			listeners: {
				keypress : function(field, e){
					
				}
			}
		};				
	}
});


Ext.define('OCS.FormPanel', {
	extend: 'Ext.form.Panel',
	
	border: false,
	region: 'east',
	width: 250,
	autoScroll: true,
	frame: false,
	split: true,
	closable: true,
	closeAction: 'hide',
	bodyPadding: '10 10 10 10',
	hidden: true,			
	fieldDefaults: {
		labelWidth: 100,
		anchor: '100%'
	},
	
	layout: {
		type: 'vbox',
		align: 'stretch'  // Child items are stretched to full width
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    }	
});

Ext.define('OCS.GridView', {
	extend: 'Ext.grid.Panel',	
	border: false,
	region: 'center',
	split: true,
	multiSelect: true,
	columnLines: true,
	stripeRows: true,	
	stateful: false,
	filter: false,
	tbarable: false,
	feature: true,
	search : true,
	emptyText: 'No records.',
	cls : 'custom-grid',
	trackMouseOver: false,	
	views: '',
	query: '',

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },		

	rangeData: function() {
		var me = this;
		if (me.start.length > 0) {
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, start_date: me.start, end_date: me.end, views: me.views, values: me.values, where: me.where};
			me.store.load();
		} else {
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: me.views};
			me.store.load();
		}
	},

	initComponent: function() {
		var me = this;
		
//		me.tbar = me.initSorterBar();
		if (me.actions.length > 0)		
			me.tbar = me.actions;

		me.searchField = new Ext.ux.form.SearchField({
		    width: 220,
		    store: me.store
		});
		
		me.dateMenu1 = Ext.create('Ext.menu.DatePicker', {
			handler: function(dp, date){
				me.start = Ext.Date.format(date, 'Y-m-d');
				Ext.getCmp(me.id+'_start').setText(me.start);
				me.rangeData();
			}
		});

		me.dateMenu2 = Ext.create('Ext.menu.DatePicker', {
			handler: function(dp, date){
				me.end = Ext.Date.format(date, 'Y-m-d');
				Ext.getCmp(me.id+'_end').setText(me.end);
				me.rangeData();
			}
		});

		me.bbar = Ext.create('Ext.PagingToolbar', {
			store: me.store,
			displayInfo: true,
			displayMsg: '{0}-{1} of {2}',
			emptyMsg: "Empty !",
			items: [/*me.searchField, */{
					xtype: 'textfield',
					width: 150,
					hidden: !me.search,
					emptyText: 'Хайх утга...',
					readOnly: false,
					value: me.query,
					listeners: {
						 change: {
							 fn: me.onTextFieldChange_,
							 scope: this,
							 buffer: 200
						 }
					}
				},	
				{
					id: me.id+'_start',
					text: (me.start ? me.start:'Эхлэх'),
					iconCls: 'calendar',
					hidden: !me.feature,
					menu: me.dateMenu1
				},
				{
					id: me.id+'_end',
					text: (me.end ? me.end:'Дуусах'),
					iconCls: 'calendar',
					hidden: !me.feature,
					menu: me.dateMenu2
				},
				'-',
				{
					text: 'Арилгах',
					hidden: !me.feature,
					iconCls: 'reset',
					handler: function() {
						if (me.feature) {
							me.getView().getFeature('group').disable();
						}

						Ext.getCmp(me.id+'_start').setText('Start date');
						Ext.getCmp(me.id+'_end').setText('End date');
						me.start = ''; me.end = '';
						me.rangeData();
					}
				},
				'-',
				{
					iconCls: 'help',
					handler: function() {
						new OCS.HelpWindow({
							id: 'crm_main_help'
						}).show();
					}
				},
				'->'
			]
		});		

		me.contextMenu = Ext.create('Ext.menu.Menu', {
			items: me.actions
		});

		me.viewConfig = {
			emptyText: me.emptyText,
			trackOver: true,
			trackMouseOver: true,
			stripeRows: true,
			preserveScrollOnRefresh: true,
			loadMask: true, 
			listeners: {				
				itemcontextmenu: function(view, rec, node, index, e) {
					e.stopEvent();

					var selModel = me.getSelectionModel();
					if (selModel instanceof Ext.selection.RowModel) {
						if (!selModel.isSelected(rec)) {
							selModel.select(rec);
							this.fireEvent('itemclick', this, rec, node, index, e);
						}
						if (me.actions.length > 0)
							me.contextMenu.showAt(e.getXY());
					}

					return false;
				},
				containercontextmenu: function(grid, e) {
					var position = e.getXY();
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(position);
				},				
				itemclick: function(dv, record, item, index, e) {
					if (me.func == 'crm_corporate_list' || me.func == 'crm_retail_list') {
						if (Ext.getCmp('contact_form') && me.func == 'crm_retail_list')						
							Ext.getCmp('contact_form').getForm().loadRecord(record);
					}

					if (me.func == 'crm_contact_list' && me.tab == 'none') {
						Ext.getCmp('contact_form').getForm().findField('crm_id').setValue(record.get('crm_id'));
						Ext.getCmp('contact_form').getForm().findField('firstName').setValue(record.get('firstName'));
						Ext.getCmp('contact_form').getForm().findField('lastName').setValue(record.get('lastName'));
						Ext.getCmp('contact_form').getForm().findField('engName').setValue(record.get('engName'));
						Ext.getCmp('contact_form').getForm().findField('job_title').setValue(record.get('job_title'));
						Ext.getCmp('contact_form').getForm().findField('phone').setValue(record.get('phone'));
						Ext.getCmp('contact_form').getForm().findField('email').setValue(record.get('email'));
					}
				},
				itemdblclick: function(dv, record, item, index, e) {
						/*
						if (!record.get('owner') || !me.isSucess(record)) {
							new OCS.CampaignActivityAssignWindow({
								ids: record.get('id')
							}).show();
							return;
						}
						*/
					if (me.func.indexOf('_activity_list') != -1)
						if (record.get('owner') /*&& me.isSuccess(record)*/) {
							new OCS.ActivityDetailWindow({
//								title: 'Activity detail ['+record.get('crm_name').split(',')[0]+']',
								title: 'Activity detail',
								record: record,
								backgrid: me
							}).show();							
						}

					if (me.func == 'crm_corporate_list' || me.func == 'crm_retail_list') {
						me.selectCustomer(record);						
					}
				},
				itemkeydown:function(view, record, item, index, e){
					if (Ext.EventObject.DELETE == e.getKey())
						me.deleteRecord();
				}
			},
			getRowClass: function (record, rowIndex, rowParams, store) {
                may = record.get('mayDuplicate') != '0' ? 'may-duplicate' : '';

				if (record.get('workflow_status') == 'processing')
					return 'bold-row';
				if (record.get('workflow_status') == 'completed')
					return 'gray-row';			

				return may;
            }
		};
	

		if (me.feature)
		{		
			me.features = [{
				ftype: 'filters',
				encode: true, 
				local: false				
			},{
				id: 'group',
				ftype: 'groupingsummary',				
				groupHeaderTpl: Ext.create('Ext.XTemplate',
					'{name:this.formatName} ({rows.length})',
					{
						formatName: function(name) {
							if (name.indexOf(',') != -1)
								return name.split(',')[0];
							return name;
						}
					}
				)
			},{
				id: 'summary',
				ftype: 'summary',
			}];
		} else
			me.features = [];

		if (me.query && me.query != '')		
			me.onTextFieldChange_();

		me.callParent(arguments);
	},
	
	deleteRecord: function() {
		var me = this;		
	},

	selectedIds: function(id) {
		var me = this;
		var recs = me.getView().getSelectionModel().getSelection();
		var result = '';
		for (i = 0; i < recs.length; i++) {
			result += recs[i].get(id)+':';
		}

		return result;
	},

	recordSelected: function() {
		var me = this;
		var recs = me.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return true;
		
		Ext.MessageBox.alert('Status', 'No Selection !', function() {});
		return false;
	},

	isSuccess: function(rec) {
		return (rec.get('status') == 'success' || rec.get('status') == 'completed' || rec.get('status') == 'sent');
	},

	onTextFieldChange_: function(e) {
		var me = this;		
		var v = '';
		if (e) v = e.getValue();
		else v = me.query;

		if (v) {			
			me.query = v;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, query: me.query, views: me.views};
			me.store.loadPage(1);
		} else {
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: me.views};
			me.store.loadPage(1);
		}
	},
	
	getCustomerName: function(rec) {
		v = rec.get('level');
		if (rec.data['_class'] && rec.data['_class'].indexOf('VIP') != -1) v = 'vip';
		if (rec.data['crm_name'])
			return rec.get('crm_name').split(',')[0];

		return '<span class="circle '+v+'">&nbsp;</span> '+rec.get('firstName')+' <span style="color:gray">'+rec.get('lastName')+'</span>';
	},

	selectCustomer: function(rec) {
		var me = this;
		Ext.getBody().mask('Loading...');
		crm_id = rec.get('crm_id');
		selected = rec;		
		
		if (me.form)		
			me.form.loadRecord(rec);

		new OCS.CustomerDetailWindow({
			title: me.getCustomerName(rec),
			selected: rec
		}).show();
	},

	selectedRecord: function() {
		var me = this;
		var recs = me.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return recs[0];
		
		return 0;
	},

	initSorterBar: function() {
		var me = this;
		me.reorderer = Ext.create('Ext.ux.BoxReorderer', {
			listeners: {
				scope: this,
				Drop: function(r, c, button) { //update sort direction when button is dropped
					me.changeSortDirection(button, false);
				}
			}
		});

		me.droppable = Ext.create('Ext.ux.ToolbarDroppable', {
			createItem: function(data) {
				var header = data.header,
					headerCt = header.ownerCt,
					reorderer = headerCt.reorderer;

				if (reorderer) {
					reorderer.dropZone.invalidateDrop();
				}

				return me.createSorterButtonConfig({
					text: header.text,
					sortData: {
						property: header.dataIndex,
						direction: "ASC"
					}
				});
			},

			canDrop: function(dragSource, event, data) {
				var sorters = me.getSorters(),
					header  = data.header,
					length = sorters.length,
					entryIndex = this.calculateEntryIndex(event),
					targetItem = this.toolbar.getComponent(entryIndex),
					i;

				if (!header.dataIndex || (targetItem && targetItem.reorderable === false)) {
					return false;
				}

				for (i = 0; i < length; i++) {
					if (sorters[i].property == header.dataIndex) {
						return false;
					}
				}
				return true;
			},

			afterLayout: me.doSort
		});
				

		me.reorderer = Ext.create('Ext.ux.BoxReorderer', {
			listeners: {
				scope: this,
				Drop: function(r, c, button) { 
					me.changeSortDirection(button, false);
				}
			}
		});

		me.droppable = Ext.create('Ext.ux.ToolbarDroppable', {
			createItem: function(data) {
				var header = data.header,
					headerCt = header.ownerCt,
					reorderer = headerCt.reorderer;

				if (reorderer) {
					reorderer.dropZone.invalidateDrop();
				}

				return me.createSorterButtonConfig({
					text: header.text,
					sortData: {
						property: header.dataIndex,
						direction: "ASC"
					}
				});
			},

			canDrop: function(dragSource, event, data) {
				var sorters = me.getSorters(),
					header  = data.header,
					length = sorters.length,
					entryIndex = this.calculateEntryIndex(event),
					targetItem = this.toolbar.getComponent(entryIndex),
					i;

				if (!header.dataIndex || (targetItem && targetItem.reorderable === false)) {
					return false;
				}

				for (i = 0; i < length; i++) {
					if (sorters[i].property == header.dataIndex) {
						return false;
					}
				}
				return true;
			},

			afterLayout: me.doSort
		});

	
		me.bar = Ext.create('Ext.toolbar.Toolbar', {
			height: 32,
			hidden: !me.tbarable,
			items  : [{
				xtype: 'tbtext',
				text: 'Sort by:',
				reorderable: false
			}, me.actions],
			plugins: [me.reorderer, me.droppable]
		});

		return me.bar;
	},

	doSort: function() {
		var me = this;
        me.store.sort(me.getSorters());
    },

	changeSortDirection: function(button, changeDirection) {
		var me = this;
        var sortData = button.sortData,
            iconCls  = button.iconCls;
        
        if (sortData) {
            if (changeDirection !== false) {
                button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                button.setIconCls(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
            }
            me.store.clearFilter();
            me.doSort();
        }
    },
	
	getSorters: function() {
        var sorters = [];
		var me = this;

        Ext.each(me.bar.query('button'), function(button) {
            sorters.push(button.sortData);
        }, this);

        return sorters;
    },
	
	createSorterButtonConfig: function(config) {
		var me = this;
        config = config || {};
        Ext.applyIf(config, {
            listeners: {
                click: function(button, e) {
                    me.changeSortDirection(button, true);
                }
            },
            iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
            reorderable: true,
            xtype: 'button'
        });
        return config;
    },

	loadStore: function() {
		var me = this;
		me.store.loadPage(1);
	}
});


Ext.define('OCS.AGridView', {
	extend: 'Ext.grid.Panel',	
	border: false,
	region: 'center',
	split: true,
	multiSelect: true,
	columnLines: true,
	stripeRows: true,	
	stateful: false,
	emptyText: 'No records.',
	deal_id: 0,
	case_id: 0,
	postable: true,
	owner: logged,
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },
	
	initComponent: function() {
		var me = this;
	
		me.tbar = Ext.create('Ext.Toolbar', {
			hidden: !me.postable,
			items: [{
					id: 'post_here',
					xtype: 'textfield',
					width: 400,					
					emptyText: 'Enter post here ...',
					enableKeyEvents: true,
					listeners: {
						 keyup : function(textfield,eventObject){
							if (eventObject.getCharCode() == Ext.EventObject.ENTER) {
								var post = textfield.getValue();
								if (post.length > 0) {								
									textfield.setValue('');
									me.postHere(post);
								}
							}
						}
					}
				}, {
					text: 'Post',
					iconCls: 'replied',
					handler: function() {
						var post = Ext.getCmp('post_here').getValue();
						if (post.length > 0) {
							Ext.getCmp('post_here').setValue('');
							me.postHere(post);
						}
					}
				}
			]
		});		

		me.contextMenu = Ext.create('Ext.menu.Menu', {
			items: me.actions
		});

		me.viewConfig = {
			emptyText: me.emptyText,
			trackMouseOver: true,
			trackOver: true,
			stripeRows: false,
			listeners: {
				itemcontextmenu: function(view, rec, node, index, e) {
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(e.getXY());
					return false;
				},
				containercontextmenu: function(grid, e) {
					var position = e.getXY();
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(position);
				}
			},
			getRowClass: function (record, rowIndex, rowParams, store) {
                may = record.get('mayDuplicate') != '0' ? 'may-duplicate' : '';
				return may;
            }
		};
			
		me.callParent(arguments);
	},
	
	postHere: function(value) {
		var me = this;
		var values = 'deal_id='+me.deal_id+'&case_id='+me.case_id+'&message='+value+'&owner='+me.owner+'&userCode='+logged;
		Ext.Ajax.request({
		   url: 'avia.php',
		   params: {handle: 'web', action: 'insert', func: '', table: 'crm_posts', values:values, where: ''},
		   success: function(response, opts) {
			  me.loadStore();
		   },
		   failure: function(response, opts) {										   
			  Ext.MessageBox.alert('Status', 'Error !', function() {});
		   }
		});
	},

	initSource: function(deal_id, case_id) {
		var me = this;
		me.deal_id = deal_id;
		me.case_id = case_id;
	},

	loadStore: function() {
		var me = this;
		me.store.loadPage(1);
	}
});

Ext.define('OCS.CGridView', {
	extend: 'OCS.AGridView',	
	
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },		
	
	postHere: function(value) {
		var me = this;
		var values = 'service_id='+me.service_id+'&message='+value+'&owner='+me.owner+'&userCode='+logged;
		Ext.Ajax.request({
		   url: 'avia.php',
		   params: {handle: 'web', action: 'insert', func: '', table: 'crm_posts', values:values, where: ''},
		   success: function(response, opts) {
			  me.loadStore();
		   },
		   failure: function(response, opts) {										   
			  Ext.MessageBox.alert('Status', 'Error !', function() {});
		   }
		});
	},

	initSource: function(service_id) {
		var me = this;
		me.service_id = service_id;
	}
});

Ext.define('OCS.BGridView', {
	extend: 'Ext.grid.Panel',	
	border: false,
	region: 'center',
	split: true,
	multiSelect: true,
	columnLines: true,
	stripeRows: true,	
	stateful: false,
	search : true,
	emptyText: 'No records.',
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },
	
	initComponent: function() {
		var me = this;			
		
		if (me.actions.length > 0)		
			me.tbar = me.actions;

		me.contextMenu = Ext.create('Ext.menu.Menu', {
			items: me.actions
		});

		me.bbar = Ext.create('Ext.PagingToolbar', {
			store: me.store,
			displayInfo: false,
			displayMsg: '{0}-{1} of {2}',
			emptyMsg: "Empty !",
			items: [/*me.searchField, */{
					xtype: 'textfield',
					width: 150,
					hidden: !me.search,
					emptyText: 'Хайх утга...',
					readOnly: false,
					listeners: {
						 change: {
							 fn: me.onTextFieldChange_,
							 scope: this,
							 buffer: 200
						 }
					}
				},					
				'-',
				{
					iconCls: 'help',
					handler: function() {
						new OCS.HelpWindow({
							id: 'crm_main_help'
						}).show();
					}
				},
				'->'
			]
		});		

		me.viewConfig = {
			emptyText: me.emptyText,
			trackMouseOver: true,
			trackOver: true,
			stripeRows: false,
			listeners: {
				itemcontextmenu: function(view, rec, node, index, e) {
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(e.getXY());
					return false;
				},
				containercontextmenu: function(grid, e) {
					var position = e.getXY();
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(position);
				}
			},
			getRowClass: function (record, rowIndex, rowParams, store) {
                may = record.get('mayDuplicate') != '0' ? 'may-duplicate' : '';
				return may;
            }
		};
			
		if (me.feature)
		{		
			me.features = [{
				ftype: 'filters',
				encode: true, 
				local: false				
			},{
				id: 'group',
				ftype: 'groupingsummary',				
				groupHeaderTpl: Ext.create('Ext.XTemplate',
					'{name:this.formatName} ({rows.length})',
					{
						formatName: function(name) {
							if (name.indexOf(',') != -1)
								return name.split(',')[0];
							return name;
						}
					}
				)
			},{
				id: 'summary',
				ftype: 'summary',
			}];
		} else
			me.features = [];

		me.callParent(arguments);
	},

	loadStore: function() {
		var me = this;
		me.store.load();
	},

	onTextFieldChange_: function(e) {
		var me = this;		
		var v = e.getValue();
		if (v) {			
			me.query = v;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, query: me.query, views: me.views, start_date: me.start, end_date: me.end};
			me.store.load();
		} else {
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: me.views, start_date: me.start, end_date: me.end};
			me.store.load();
		}
	}
});