Ext.define('OCS.DealActivityGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_customer_activity_list',
	sortField: '_date',
	tab : 'deal_activity_property',
	dateField: '_date',
	title: 'Activities',
	icon: 'task',
	modelName: 'CRM_CALENDAR',
	collapsed : false,		
	
	updateSource: function(rec) {
		var me = this;
		me.action = (rec.get('owner') == logged || user_level >= 2);
		me.selected = rec;
		me.where = rec.get('crm_id')+','+rec.get('deal_id');
		me.values = 'crm_id,deal_id';
		me.loadStore();
	}
});

Ext.define('OCS.ServiceActivityGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_customer_activity_list',
	sortField: '_date',
	tab : 'service_activity_property',
	dateField: '_date',
	title: 'Үйл ажиллагаа',
	icon: 'task',
	modelName: 'CRM_CALENDAR',
	collapsed : false,		
	
	updateSource: function(rec) {
		var me = this;
		me.action = (rec.get('owner') == logged || user_level >= 2);
		me.selected = rec;
		me.where = rec.get('crm_id')+','+rec.get('service_id');
		me.values = 'crm_id,service_id';
		me.loadStore();
	}
});


Ext.define('OCS.CompetitorDealActivityGrid', {
	extend: 'OCS.DealActivityGrid',
	tab : 'competitor_deal_activity_property',
	
	createActions: function() {
		var me = this;
		me.actions = [];
		return me.actions;
	}
});

Ext.define('OCS.InvoiceActivityGrid', {
	extend: 'OCS.DealActivityGrid',
	func: 'crm_customer_activity_list',
	sortField: '_date',
	tab : 'invoice_activity_property',
	dateField: '_date',
	title: 'Activities',
	icon: 'task',	
	modelName: 'CRM_CALENDAR',
	collapsed : false,		
	
	createActions: function() {
		var me = this;
		me.actions = [];
		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.action = rec.get('owner') == logged;
		me.selected = rec;
		me.where = rec.get('crm_id')+','+rec.get('deal_id');
		me.values = 'crm_id,deal_id';
		me.loadStore();
	}
});

Ext.define('OCS.DealGrid', {
	extend: 'OCS.Module',
	func: 'crm_task_list',
	sortField: 'priority',
	tab : 'deal_task_property',
	dateField: 'duedate',
	title: 'Task',
	icon: 'task',
	modelName: 'CRM_TASK',
	collapsed : false,
	values: 'crm_id',
	where: '0',
	action: true,
	title_add: 'Нэмэх ...',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: me.title_add,
				handler: function(widget, event) {
					if (me.action) {
						if (me.modelName == 'CRM_DEAL_COMPETITORS') {
/*							new OCS.CompetitorWindow({
								selected: me.selected,
								backgrid: me.grid
							}).createWindow();*/

							new OCS.DealAddCompetitorWindow({
								selected: me.selected,
								backgrid: me.grid
							}).show();
						}
						else if (me.modelName == 'CRM_DEAL_SALES_TEAM') {
							new OCS.SalesTeamWindow({
								selected: me.selected,								
								backgrid: me.grid
							}).createWindow();
						}
						else if (me.modelName == 'CRM_DEAL_PAYROLL') {
								new OCS.PayRollWindow({
									selected: me.selected,								
									backgrid: me.grid
								}).createWindow();
						}
						else if (me.modelName == 'CRM_SERVICE_PAYROLL') {
							if (me.selected.get('service_debt') == 0)
								Ext.MessageBox.alert('Error', 'Авлагын дүн байхгүй !', function() {});
							else
								new OCS.ServicePayRollWindow({
									selected: me.selected,								
									backgrid: me.grid
								}).createWindow();
						}
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				handler: function(widget, event) {
					if (me.action) {
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {							
							me.deleteRecord();											
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			})
		];

		return me.actions;
	},

	renderTitle: function(value, p, record) {
        return Ext.String.format(
            '<span class="task_grid">&nbsp;&nbsp;&nbsp;&nbsp;</span><b>{0}</b></br><span class="title">{1}&nbsp;{2}</span>',
            value,
            record.data.duedate,
            record.data.duetime
        );
    },

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner')==logged;
		me.where = rec.get('crm_id')+','+rec.get('deal_id');
		me.values = 'crm_id,deal_id';
		me.loadStore();
	},
	
	createColumns: function() {
		var me = this;
		return [{
			text: "Task Info",
			dataIndex: 'task_type',
			flex: 1,
			renderer: me.renderTitle,
			sortable: false
		},{
			text: "Owner",
			dataIndex: 'userCode',
			width: 120,
			sortable: true
		},{
			text: "Priority",
			dataIndex: 'priority',
			width: 100,
			align: 'right',
			renderer: renderPriority,
			sortable: true
		}];
	},

	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			actions: me.createActions(),
			tbarable: false,
			feature: false,
			search: false,
			viewConfig: {
				trackOver: false,
				stripeRows: false,
				plugins: [{
					ptype: 'preview',
					bodyField: 'descr',
					expanded: true,
					pluginId: 'preview'
				}],
			    emptyText: 'No records'    
			}
		});
		
		me.grid.getSelectionModel().on('itemclick', function(dv, record, item, index, e) {
			if (me.form) {
				me.form.updateSource(record);
				me.form.setVisible(true);
			}			
		});
	},

	createPanel: function() {
		var me = this;
		me.createGrid();

		me.panel = Ext.create('Ext.Panel', {
			id: me.tab,
			title: me.title,
			border: false,
			layout: 'border',
			region: 'center',
			items: [me.grid]
		});

		return me.panel;
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

	recordSelected: function() {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return true;
		
		Ext.MessageBox.alert('Status', 'No Selection !', function() {});
		return false;
	}
});

Ext.define('OCS.DealContactGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_contact_list',
	tab : 'deal_detail_property',
	title: 'Contacts',
	icon: 'call',
	table: 'crm_customer',
	dateField: '_date',
	sortField: 'crm_id',
	modelName: 'CRM_RETAIL',
	collapsed: false,

	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {
					if (me.action) {
						me.selected.set('firstName', me.selected.get('crm_name'));
						me.selected.set('parent_crm_id', me.selected.get('crm_id'));
						me.selected.set('customer_type', 1);
						new OCS.ContactNewWindow({
							record: me.selected,
							title: 'Add contact',						
							backgrid: me.grid
						}).show();												
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах ...',
				handler: function(widget, event) {
					if (me.action) {
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {
							Ext.Msg.confirm('Warning ','Устгах ... ?',function(btn){
								if(btn === 'yes'){
									Ext.Ajax.request({
									   url: 'avia.php',
									   params: {handle: 'web', table: 'crm_customer', action: 'update', values: 'parent_crm_id=0', where: "crm_id="+sel[0].get('crm_id')},
									   success: function(response, opts) {
										  me.loadStore();
									   },
									   failure: function(response, opts) {										   
										  Ext.MessageBox.alert('Status', 'Error !', function() {});
									   }
									});	
								}else{
									
								}	
							});																	
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			})			
		];

		return me.actions;
	},
		
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.deal_id = rec.get('deal_id');
		me.where = rec.get('crm_id');
		me.values = 'parent_crm_id';
		me.loadStore();
	},

	renderTitle: function(value, p, record) {
        return Ext.String.format(
            '<table><tr><td><div class="c-contact"></div></td><td><b><span class="title">{0}</span></b></br><span class="gray">{1}&nbsp;*{2}</br><a href="mailto:{3}">{3}</a></span></td></tr></table>',
            value,
            record.data.job_title,
            record.data.decision_maker,
            record.data.email
        );
    },
		
	createColumns: function() {
		var me = this;
		return [{
			text: 'Contact name',
			dataIndex: 'crm_name',
			renderer: me.renderTitle,
			flex: 1,
			sortable: false
		},{
			text: 'Phone',
			dataIndex: 'phone',
			width: 80,
			align: 'right',
			sortable: true,
			renderer: renderPhone
		}];
	}
});

Ext.define('OCS.ServiceContactGrid', {
	extend: 'OCS.DealContactGrid',
	func: 'crm_contact_list',
	tab : 'service_detail_property',
	title: 'Холбоо барих',
	icon: 'call',
	table: 'crm_customer',
	dateField: '_date',
	sortField: 'crm_id',
	modelName: 'CRM_RETAIL',
	collapsed: false,	
		
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.service_id = rec.get('service_id');
		me.where = rec.get('crm_id');
		me.values = 'parent_crm_id';
		me.loadStore();
	}
});

Ext.define('OCS.CompetitorDealContactGrid', {
	extend: 'OCS.DealContactGrid',
	tab : 'competitor_deal_detail_property',
	createActions: function() {
		var me = this;
		me.actions = [];
		return me.actions;
	}
});

Ext.define('OCS.DealPostGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_post_list',
	tab : 'deal_post_list',
	title: 'Posts',
	icon: 'call',
	table: 'crm_posts',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_POSTS',
	collapsed: false,
	
	createActions: function() {
		var me = this;
		me.actions = [];
		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('deal_id');
		me.values = 'deal_id';
		me.grid.initSource(rec.get('deal_id'), 0);
		me.grid.owner = rec.get('owner');
		me.loadStore();
	},

	renderTitle: function(value, p, record) {
        return Ext.String.format(
            '<table><tr><td><div class="c-contact"></div></td><td><b><span class="title" style="white-space:normal !important;">{0}</span></b></br><span class="gray">to : {1}&nbsp;|&nbsp;from : {2}</br>{3}</br></span></td></tr></table>',
            value,
            record.data.owner,
            record.data.userCode,
            record.data._date,
			record.data.level*50
        );
    },
		
	createColumns: function() {
		var me = this;
		return [{
			text: 'Messages',
			dataIndex: 'message',
			renderer: me.renderTitle,
			flex: 1,
			sortable: false
		}];
	},
	
	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.AGridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			actions: me.createActions(),
			viewConfig: {
				trackOver: false,
				stripeRows: false,
				plugins: [{
					ptype: 'preview',
					bodyField: 'descr',
					expanded: true,
					pluginId: 'preview'
				}],
			    emptyText: 'No records'    
			}
		});

		me.grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
			if (selectedRecord.length) {
				var rec = selectedRecord[0];
/*				new OCS.DealPostReplyWindow({
					deal_id: rec.get('deal_id'),
					message: rec.get('message'),
					level: rec.get('level')
				}).show();*/
			}
		});
	}
});

Ext.define('OCS.ServicePostGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_post_list',
	tab : 'service_post_list',
	title: 'Пост',
	icon: 'call',
	table: 'crm_posts',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_POSTS',
	collapsed: false,
	
	createActions: function() {
		var me = this;
		me.actions = [];
		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('service_id');
		me.values = 'service_id';
		me.grid.initSource(rec.get('service_id'));
		me.grid.owner = rec.get('owner');
		me.loadStore();
	},

	renderTitle: function(value, p, record) {
        return Ext.String.format(
            '<table><tr><td><div class="c-contact"></div></td><td><b><span class="title" style="white-space:normal !important;">{0}</span></b></br><span class="gray">to : {1}&nbsp;|&nbsp;from : {2}</br>{3}</br></span></td></tr></table>',
            value,
            record.data.owner,
            record.data.userCode,
            record.data._date,
			record.data.level*50
        );
    },
		
	createColumns: function() {
		var me = this;
		return [{
			text: 'Messages',
			dataIndex: 'message',
			renderer: me.renderTitle,
			flex: 1,
			sortable: false
		}];
	},
	
	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.CGridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			actions: me.createActions(),
			viewConfig: {
				trackOver: false,
				stripeRows: false,
				plugins: [{
					ptype: 'preview',
					bodyField: 'descr',
					expanded: true,
					pluginId: 'preview'
				}],
			    emptyText: 'No records'    
			}
		});

		me.grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
			if (selectedRecord.length) {
				var rec = selectedRecord[0];
			}
		});
	}
});


Ext.define('OCS.CasePostGrid', {
	extend: 'OCS.DealPostGrid',
	func: 'crm_post_list',
	tab : 'case_post_list',
	title: 'Posts',
	icon: 'call',
	table: 'crm_posts',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_POSTS',
	collapsed: false,

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('case_id');
		me.values = 'case_id';
		me.grid.initSource(0, rec.get('case_id'));
		me.grid.owner = rec.get('owner');
		me.loadStore();
	}
});

Ext.define('OCS.CompetitorDealPostGrid', {
	extend: 'OCS.DealPostGrid',
	func: 'crm_post_list',
	tab : 'competitor_deal_post_list',
	title: 'Posts',
	icon: 'call',
	table: 'crm_posts',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_POSTS',
	collapsed: false,
	
	createActions: function() {
		var me = this;
		me.actions = [];
		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('deal_id');
		me.values = 'deal_id';
		me.grid.initSource(rec.get('deal_id'), 0);
		me.loadStore();
	},

	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.AGridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			actions: me.createActions(),
			postable: false,
			viewConfig: {
				trackOver: false,
				stripeRows: false,
				plugins: [{
					ptype: 'preview',
					bodyField: 'descr',
					expanded: true,
					pluginId: 'preview'
				}],
			    emptyText: 'No records'    
			}
		});
	}
});


Ext.define('OCS.DealProductGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_deal_product_list',
	tab : 'deal_product_property',
	title: 'Products',
	icon: 'call',
	table: 'crm_deal_products',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_DEAL_PRODUCTS',
	collapsed: false,
	primary: 'id',
	values: 'id',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls : 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {		
					if (me.action)
						new OCS.DealAddProductWindow({
							selected: me.selected,
							backgrid: me.grid
						}).show();
					else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй 456"!', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls : 'delete',
				text: 'Устгах ...',
				handler: function(widget, event) {		
					if (me.action) {
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {							
							me.deleteRecord();											
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй 890!', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls : 'deal_move',
				text: 'Move to ...',
				handler: function(widget, event) {		
					if (user_level > 0 ) {												
						if (me.recordSelected())						
							new OCS.DealProductMoveWindow({
								ids: me.selectedIds('id'),
								backgrid: me.grid,
								direction: me.xlsName
							}).show();
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй 3344!', function() {});
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'sales',
				text: 'Create invoice ...',
				handler: function(widget, event) {
					if (me.action) {
						if (me.store.getCount() > 0)
						{					
							Ext.Ajax.request({
							   url: 'avia.php',
							   params: {handle: 'web', action: 'create_quote', where: me.selected.get('deal_id')},
							   success: function(response, opts) {
								  Ext.MessageBox.alert('Status', 'Success !', function() {});
							   },
							   failure: function(response, opts) {										   
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
							   }
							});	
						} else {
							Ext.MessageBox.alert('Status', 'Empty !', function() {});
						}
					} else 
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй 1144!', function() {});
				}
			})
		];

		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.action = rec.get('owner') == logged;
		me.selected = rec;
		me.where = rec.get('deal_id');
		me.values = 'deal_id';
		me.loadStore();
	},
	
	productCount: function() {
		var me = this;
		return me.store.getCount();
	},

	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 1,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: true,
			actions: me.createActions(),
			tbarable: false
		});
			
		me.grid.on('itemclick', function(dv, record, item, index, e) {		
				if (me.form) {
					me.form.updateSource(record);
					me.form.setVisible(true);				
				}

				if (me.action)
					new OCS.DealAddProductWindow({
						selected: me.selected,
						backgrid: me.grid,
						record: record
					}).show();
		});
	},
	
	createColumns: function() {
		var me = this;
		return [/*Ext.create('Ext.grid.RowNumberer', {width: 32}), */{
			text: 'Product name',
			dataIndex: 'product_name',
			flex: 1,			
			sortable: false
		},{
			text: 'Precent',
			dataIndex: 'precent',
			width: 100,
			renderer: renderPrecent,
			align: 'right',
			sortable: true
		},{
			text: 'Qty',
			dataIndex: 'qty',
			width: 60,
			renderer: renderNumber,
			summaryType: 'sum',
			summaryRenderer: renderTNumber,
			sortable: true
		},{
			text: 'Total',
			dataIndex: 'amount',
			width: 100,
			renderer: renderMoney,
			summaryType: 'sum',
			summaryRenderer: renderTMoney,
			align: 'right',
			sortable: true
		},{
			text: 'Created on',
			dataIndex: '_date',
			width: 120,
			hidden: true,
			renderer: renderDate,
			sortable: true
		}];
	}	
});

Ext.define('OCS.ServiceProductGrid', {
	extend: 'OCS.DealProductGrid',
	func: 'crm_deal_product_list',
	tab : 'service_product_property',
	title: 'Бараа',
	icon: 'call',
	table: 'crm_deal_products',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_DEAL_PRODUCTS',
	collapsed: false,
	primary: 'id',
	values: 'id',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls : 'commit',
				text: 'Хадгалах ...',
				handler: function(widget, event) {		
					if (me.action/* && user_level == '5'*/)
						me.updateRecords();
					else
						me.updateRecords();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls : 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {	
						new OCS.ServiceAddProductWindow({
							selected: me.selected,
							backgrid: me.grid
						}).show();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls : 'delete',
				text: 'Хасах ...',
				handler: function(widget, event) {		
					if (me.action) {
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {							
							me.deleteRecord();											
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					} else
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {							
							me.deleteRecord();											
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
				}
			})
		];

		return me.actions;
	},

	updateRecords: function() {
		var me = this;
		me.count = me.store.getCount();
		me.affected = 0;
		me.store.each(function(rec){
			var unit_size = rec.get('unit_size');
			if (unit_size == 0) unit_size = 1;			
			var values = "pty="+(rec.get('qty')/unit_size)+"&qty="+rec.get('qty')+"&price="+rec.get('price')+"&amount="+(rec.get('qty')*rec.get('price'));
			if (rec.get('id') > 0) {			
				Ext.Ajax.request({
				   url: 'avia.php',
				   params: {handle: 'web', table: 'crm_deal_products', action: 'update', values: values, where: 'id='+rec.get('id')},
				   success: function(response, opts) {
					  me.affected++;
					  if (me.affected >= me.count)					  
						  me.store.reload();
				   },
				   failure: function(response, opts) {										   
					  Ext.MessageBox.alert('Status', 'Error !', function() {});
				   }
				});
			}
		});
	},

	updateSource: function(rec) {
		var me = this;
		me.action = ((rec.get('owner') == logged || user_level > 0) && (rec.get('service_stage') == 'receipt' || rec.get('service_stage') == 'transit' || rec.get('service_stage') == 'return'));
		me.selected = rec;
		me.where = rec.get('service_id');
		me.values = 'service_id';
		selectedServiceRevenue = rec.get('service_revenue');
		selectedServicePrecent = rec.get('service_precent');
		selectedServiceDebt =  rec.get('service_debt');
		me.loadStore();
	},
	
	createColumns: function() {
		var me = this;
		return [/*Ext.create('Ext.grid.RowNumberer', {width: 32}), */{
			text: 'ID',
			dataIndex: 'product_id',
			width: 50,			
			align: 'center',
			sortable: false,
			hidden:true
		},{
			text: 'Код',
			dataIndex: 'product_code',
			width: 50,			
			align: 'center',
			sortable: false
		},{
			text: 'Барааны нэр',
			dataIndex: 'product_name',
			flex: 1,			
			renderer: renderProductFlag,
			sortable: false
		},{
			text: 'Хувь',
			dataIndex: 'precent',
			width: 50,
			renderer: renderPrecent,
			align: 'right',
			sortable: true
		},{
			text: 'Утга',
			dataIndex: 'type',
			width: 60,
			align: 'center',
			renderer: renderSalesType,
			sortable: true
		},{
			text: 'Тоо',
			dataIndex: 'qty',
			width: 60,
			align: 'right',
			renderer: renderNumber,
			summaryType: 'sum',
			summaryRenderer: renderTNumber,
			sortable: true,
			editor: {
				xtype: 'numberfield',
				allowBlank: false
			}
		},{
			text: 'Үнэ',
			dataIndex: 'price',
			width: 80,
			align: 'right',
			renderer: renderMoney,
			summaryType: 'sum',
			summaryRenderer: renderTMoney,
			sortable: true,
			editor: {
				xtype: 'numberfield',
				allowBlank: false,
				value: 0,
				decimalPrecision: 2,
			    allowNegative: true,
				useThousandSeparator: true,
		        currencySymbol:'₮'
			}
		},{
			text: 'Дүн',
			dataIndex: 'amount',
			width: 100,
//			renderer: renderMoney,
			summaryType: 'sum',
			summaryRenderer: renderTMoney,
			align: 'right',
			sortable: true,
			renderer: renderAutoMoney
		},{
			text: 'Огноо',
			dataIndex: '_date',
			width: 120,
			hidden: true,
			renderer: renderDate,
			sortable: true
		},{
			text: 'Төлөв',
			dataIndex: 'flag',
			width: 0,
			hidden: true,
			sortable: true
		}];
	},

	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 1,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: true,
			mask: false,
			actions: me.createActions(),
			tbarable: false
		});
			
		me.grid.on('itemclick', function(dv, record, item, index, e) {		
				if (me.form) {
					me.form.updateSource(record);
					me.form.setVisible(true);				
				}

			//	if (me.action)
			//		new OCS.ServiceAddProductWindow({
			//			selected: me.selected,
			//			backgrid: me.grid,
			//			record: record
			//		}).show();
		});
	}	
});

Ext.define('OCS.CompetitorDealProductGrid', {
	extend: 'OCS.DealProductGrid',
	tab : 'competitor_deal_product_property',
	
	createActions: function() {
		var me = this;
		me.actions = [			
		];

		return me.actions;
	}
});

Ext.define('OCS.DealCompetitorGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_deal_competitor_list',
	tab : 'deal_competitor_property',
	title: 'Competitors',
	icon: 'import',
	table: 'crm_deal_competitors',
	dateField: '_date',
	sortField: 'competitor_name',
	modelName: 'CRM_DEAL_COMPETITORS',
	collapsed: false,
	primary: 'id',
		
	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: false,
			actions: me.createActions(),
			tbarable: false
		});
		
		me.grid.on('itemclick', function(dv, record, item, index, e) {
				if (me.form) {				
					me.form.updateSource(record);
					me.form.setVisible(true);				
				}
			}
		);
	},
	
	createColumns: function() {
		var me = this;
		return [/*Ext.create('Ext.grid.RowNumberer', {width: 32}), */{
			text: 'Competitor',
			dataIndex: 'competitor_name',
			flex: 1,			
			sortable: false
		},{
			text: 'Reported revenue',
			dataIndex: 'reported_revenue',
			width: 120,
			align: 'right',
			renderer: renderMoney,
			sortable: true
		},{
			text: 'Web site',
			dataIndex: 'www',
			width: 180,
			renderer: renderWWW,
			sortable: true
		}];
	}
});


Ext.define('OCS.DealCommissionGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_commission_list',
	tab : 'deal_commission_property',
	title: 'Commissions',
	icon: 'import',
	table: 'crm_comission',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_COMMISSION',
	collapsed: false,
	primary: 'id',
		
	createActions: function() {
		var me = this;
		me.actions = [			
			Ext.create('Ext.Action', {
				iconCls: 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.CommissionWindow({
							selected: me.selected,
							backgrid: me.grid
						}).show();
					else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах ...',
				handler: function(widget, event) {
					if (me.action) {
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {
							me.deleteRecord();											
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			})
		];

		return me.actions;
	},
	
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner')==logged;
		me.where = rec.get('deal_id');
		me.values = 'deal_id';
		me.loadStore();
	},
	
	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: false,
			actions: me.createActions(),
			tbarable: false
		});					

		me.grid.on('itemclick', function(dv, record, item, index, e) {
			if (me.form) {
				me.form.updateSource(record);
				me.form.setVisible(true);
			}
		});
	},
	
	createColumns: function() {
		var me = this;
		return [/*Ext.create('Ext.grid.RowNumberer', {width: 32}), */{
			text: 'Contact',
			dataIndex: 'crm_name',
			flex: 1,			
			renderer: renderCRMName,
			sortable: false
		},{
			text: 'Amount',
			dataIndex: 'amount',
			width: 110,
			align: 'right',
			renderer: renderMoney,
			sortable: true
		},{
			text: 'Created by',
			dataIndex: 'userCode',
			width: 120,
			renderer: renderOwner,
			sortable: true
		},{
			text: 'Created on',
			dataIndex: '_date',
			width: 130,
			sortable: true
		}];
	}
});

Ext.define('OCS.ServiceCommissionGrid', {
	extend: 'OCS.DealCommissionGrid',
	func: 'crm_commission_list',
	tab : 'service_commission_property',
	title: 'Хөнгөлөлт',
	icon: 'import',
	table: 'crm_comission',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_COMMISSION',
	collapsed: false,
	primary: 'id',
		
	createActions: function() {
		var me = this;
		me.actions = [			
			Ext.create('Ext.Action', {
				iconCls: 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.ServiceCommissionWindow({
							selected: me.selected,
							backgrid: me.grid
						}).show();
					else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах ...',
				handler: function(widget, event) {
					if (me.action) {
						var sel = me.grid.getView().getSelectionModel().getSelection();
						if (sel.length > 0) {
							me.deleteRecord();											
						} else
							Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			})
		];

		return me.actions;
	},
	
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner')==logged;
		me.where = rec.get('service_id');
		me.values = 'service_id';
		me.loadStore();
	}
});


Ext.define('OCS.CompetitorDealCompetitorGrid', {
	extend: 'OCS.DealCompetitorGrid',
	tab : 'competitor_deal_competitor_property',	
	createActions: function() {
		var me = this;
		me.actions = [			
		];

		return me.actions;
	}
});

Ext.define('OCS.DealSalesTeamGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_deal_sales_team_list',
	tab : 'deal_sales_team_property',
	title: 'Sales team',
	icon: 'quote',
	table: 'crm_deal_sales_team',
	dateField: '_date',
	sortField: 'owner',
	modelName: 'CRM_DEAL_SALES_TEAM',
	collapsed: false,
	primary: 'id',
	title_add: 'Нэмэх/Засах ...',

	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: false,
			actions: me.createActions(),
			tbarable: false
		});
		
		me.grid.on('itemclick', function(dv, record, item, index, e) {
				if (me.form) {
					me.form.updateSource(record);
					me.form.setVisible(true);			
				}
			}
		);	
	},
	
	callBack: function(store) {		
		var ownerList = '';
		store.each(function(rec){
			ownerList += rec.get('owner');
		});
		views['deals'].action.teamOn(ownerList);
	},

	createColumns: function() {
		var me = this;
		return [/*Ext.create('Ext.grid.RowNumberer', {width: 32}), */{
			text: 'Owner',
			dataIndex: 'owner',
			flex: 1,			
			sortable: false
		},{
			text: 'Precent',
			dataIndex: 'precent',
			width: 80,
			align: 'right',
			renderer: renderPrecent,
			sortable: true
		},{
			text: 'Created on',
			dataIndex: '_date',
			width: 180,
			sortable: true
		}];
	}
});

Ext.define('OCS.CompetitorDealSalesTeamGrid', {
	extend: 'OCS.DealSalesTeamGrid',	
	tab : 'competitor_deal_sales_team_property',
	createActions: function() {
		var me = this;
		me.actions = [			
		];

		return me.actions;
	}	
});

Ext.define('OCS.StageWindow', {
	extend: 'OCS.Window',
	title: 'Stage detail',
	maximizable: true,
	height: 560,
	width: 540,	

	nextStage: function(stage) {
		if (stage == 'lead')
			return 'opportunity';
		if (stage == 'opportunity')
			return 'quote';
		if (stage == 'quote')
			return 'close as won';
		if (stage == 'close as won')
			return 'close as won';
	},

	initComponent: function() {
		var me = this;		

		me.form = Ext.create('OCS.FormPanel', {
			id : 'potential_form',				
			title: 'Potentail detail',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			layout: 'anchor',
			defaults: {
				anchor: '100%',
				labelAlign: 'right',
				labelWidth: 80,
				margin: '15 15 15 15'
			},
			items: [
				{
					xtype: 'container',
					layout: 'hbox',
					defaults: {
						anchor: '100%',
						labelWidth: 80,
						labelAlign: 'right'
					},
					defaultType: 'textfield',
					items: [{
							xtype: 'textfield',
							fieldLabel: 'CRM ID',
							name: 'crm_id',
							hidden: true,
							value: me.selected.get('crm_id'),
							readOnly: true
						},						
						{
							xtype: 'combo',
							fieldLabel: 'Next stage',
							valueField: 'value',
							displayField: 'value',
							name: 'stage',
							flex: 1,
							value: me.nextStage(me.selected.get('stage')),
							allowBlank: false,
							forceSelection: true,
							queryMode: 'local',
							store: Ext.create('Ext.data.Store', {
							  model: 'CRM_ITEM',
							  data: [{value: 'lead'},{value: 'opportunity'},{value: 'quote'},{value: 'close as won'},{value: 'close as lost'}]
							})
						},{
							xtype: 'textfield',
							fieldLabel: 'Next step',
							hidden: true,							
							name: 'next_step'
						},{
							xtype: 'numberfield',
							fieldLabel: 'Probablity %',
							maxValue: 100,
							margins: '0 0 0 6',
							minValue: 0,
							flex: 1,
							value: me.selected.get('probablity'),
							name: 'probablity'				
						}
					]
				},	
				{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						labelWidth: 80
					},
					items: [
						{
							xtype: 'datefield',
							fieldLabel: 'Close date',				
							name: 'closing_date',
							value: me.selected.get('closing_date'),
							format: 'Y-m-d'
						},{
							xtype: 'currencyfield',
							fieldLabel: 'Exp.revenue',
							value: me.selected.get('expected_revenue'),
							margins: '0 0 0 6',
							flex: 1,
							name: 'expected_revenue'			
						}
					]
				},
				{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						labelWidth: 80
					},
					items: [	
							{
							xtype: 'searchcombo',
							fieldLabel: 'Campaign',
							table: 'crm_campaign',		
							flex: 1,
							name: 'campaign'
						},{
							xtype: 'textfield',
							fieldLabel: 'Owner',				
							name: 'owner',
							margins: '0 0 0 6',
							flex: 1,
							hidden: true,
							value: me.selected.get('owner')
						},{
							xtype: 'searchcombo',
							fieldLabel: 'Competitor',
							value: me.selected.get('competitor_name'),
							margins: '0 0 0 6',
							flex: 1,
							readOnly: true,
							table: 'crm_competitors',
							name: 'competitor_name'							
						},{
							xtype: 'textfield',
							fieldLabel: 'Бүртгэсэн',				
							name: 'userCode',
							value: logged,
							hidden: true,
							readOnly: true
						}
					]
				},
				{
					xtype: 'textarea',
					fieldLabel: 'Current situation',
					name: 'current_situation',
					value: me.selected.get('current_situation'),
					emptyText: 'Note ...',
					flex: 1 
				},{
					xtype: 'textarea',
					fieldLabel: 'Customer Need',
					name: 'customer_need',
					value: me.selected.get('customer_need'),
					emptyText: 'Note ...',
					flex: 1 
				},{
					xtype: 'textarea',
					fieldLabel: 'Proposed Solution',
					name: 'proposed_solution',
					value: me.selected.get('proposed_solution'),
					emptyText: 'Note ...',
					flex: 1 
				},{
					xtype: 'textarea',
					fieldLabel: 'Note',	
					name: 'descr',
					value: me.selected.get('descr'),
					emptyText: 'Note ...',
					style: 'margin:0', 
					flex: 1 
				}
			],
			buttons: [{
				text: 'Илгээх',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						me.probablity = form.findField('probablity').getValue();
						me.status = 'open';
						
						if (me.productCount == 0 && form.findField('stage').getValue() == 'quote') {
							Ext.MessageBox.alert('Error', 'This deal cannot be commited because there are no products !', function() {});
							return;
						}

						if (form.findField('stage').getValue() == 'close as won') {
							me.probablity = 100;
							me.status = 'won';

							if (me.openActivity > 0) {
								Ext.MessageBox.alert('Error', 'This deal cannot be closed because there are open activities associated with it !', function() {});
								return;
							}
							if (me.productCount == 0) {
								Ext.MessageBox.alert('Error', 'This deal cannot be closed because there are no products !', function() {});
								return;
							}
						}
						var values_deals = "probablity="+me.probablity+
										   ",stage='"+form.findField('stage').getValue()+"'"+
										   ",closing_date='"+Ext.Date.format(form.findField('closing_date').getValue(),'Y-m-d')+"'"+
										   ",status='"+me.status+"'"+
										   ",expected_revenue='"+form.findField('expected_revenue').getValue()+"'"+
										   ",competitor_name='"+form.findField('competitor_name').getValue()+"'"+
										   ",current_situation='"+form.findField('current_situation').getValue()+"'"+
										   ",customer_need='"+form.findField('customer_need').getValue()+"'"+
										   ",proposed_solution='"+form.findField('proposed_solution').getValue()+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";
												
						me.selected.data['probablity'] = me.probablity;
						me.selected.data['expected_revenue'] = form.findField('expected_revenue').getValue();
						me.selected.data['stage'] = form.findField('stage').getValue();
						me.selected.data['descr'] = form.findField('descr').getValue();
						me.customerLevelDetection(form.findField('stage').getValue());

						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_deals', action: 'update', values: values_deals, where: "deal_id="+me.selected.get('deal_id')},
						   success: function(response, opts) {							  
							  me.close();
							  views['deals'].reload(me.selected);
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});	

						if (me.selected.data['stage'] == 'quote' || me.selected.data['stage'] == 'close as won') {
							Ext.Ajax.request({
							   url: 'avia.php',
							   params: {handle: 'web', action: 'create_quote', where: me.selected.get('deal_id')},
							   success: function(response, opts) {
								  Ext.MessageBox.alert('Status', 'Success !', function() {});
							   },
							   failure: function(response, opts) {										   
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
							   }
							});	
						}						
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		
		me.items = [me.form];
		me.callParent(arguments);
	},

	customerLevelDetection: function(stage) {
		var me = this;
		if (stage == 'close as won')
		{
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='customer'", where: "crm_id="+me.selected.get('crm_id')+" and level='suspect'"},
			   success: function(response, opts) {
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		} else
		if (stage == 'close as lost')
		{
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='suspect'", where: "crm_id="+me.selected.get('crm_id')+" and level='prospect'"},
			   success: function(response, opts) {
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		} else
		if (stage == 'opportunity')
		{						
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='prospect'", where: "crm_id="+me.selected.get('crm_id')+" and level='suspect'"},
			   success: function(response, opts) {
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		} else
		if (stage == 'quote')
		{						
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='prospect'", where: "crm_id="+me.selected.get('crm_id')+" and level='suspect'"},
			   success: function(response, opts) {
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		}
	}
});

Ext.define('OCS.DealPostReplyWindow', {
	extend: 'OCS.Window',
	title: 'Reply',
	maximizable: true,
	height: 220,
	width: 300,	

	initComponent: function() {
		var me = this;
		me.form = Ext.create('OCS.FormPanel', {
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'deal_id',
				name: 'deal_id',
				hidden: true,
				value: me.deal_id,
				readOnly: true
			},
			{
				xtype: 'textfield',
				fieldLabel: 'level',
				name: 'level',
				hidden: true,
				value: me.level+1,
				readOnly: true
			},
			{
				xtype: 'textarea',
				fieldLabel: 'Reply to post',
				name: 'message',
				emptyText: 'Post here message ... ',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Илгээх',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = 'reply_id='+form.findField('reply_id')+'&deal_id='+form.findField('deal_id').getValue()+'&case_id=0&message='+form.findField('message').getValue()+'&owner='+logged+'&userCode='+logged+'&level='+form.findField('level').getValue();
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


Ext.define('OCS.DealDescrWindow', {
	extend: 'OCS.Window',

	maximizable: true,
	height: 250,
	width: 300,	

	initComponent: function() {
		var me = this;
		if (me.title == 'Close as won') {
			me.stage = 'close as won';
			me.rem = false;
			me.comp = true;
			me.status = '';
			me.status = 'won';
		} else
		if (me.title == 'Close as lost') {
		//	me.stage = 'close as lost';
			me.rem = false;
			me.comp = false;
			me.status = 'lost';
		} else
		if (me.title == 'Postponed detail') {
			me.stage = '';
			me.rem = false;
			me.comp = true;
			me.status = 'postponed';
		} else
		if (me.title == 'Disqualify detail') {
			me.stage = 'disqualified';
			me.rem = false;
			me.comp = true;
			me.status = 'lost';
		}

		me.form = Ext.create('OCS.FormPanel', {
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'datefield',
				fieldLabel: 'Remind date',				
				name: 'remind_date',
				value: new Date(),
				hidden: me.rem,
				format: 'Y-m-d'
			},{
				xtype: 'searchcombo',
				fieldLabel: 'Competitor',				
				name: 'competitor_name',
				hidden: me.comp,
				readOnly: true,
				value: me.selected.get('competitor_name'),
				table: 'crm_competitors'
			},{
				xtype: 'textfield',
				fieldLabel: 'CRM ID',
				name: 'crm_id',
				hidden: true,
				value: me.selected.get('crm_id'),
				readOnly: true
			},	
			{
				xtype: 'textfield',
				fieldLabel: 'Status',
				name: 'status',
				hidden: true,
				value: me.status,
				readOnly: true
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Бүртгэсэн',				
				name: 'userCode',
				value: logged,
				hidden: true,
				readOnly: true
			},{
				xtype: 'textarea',
				fieldLabel: 'Тайлбар',
				hideLabel: true,
				name: 'descr',
				value: me.selected.get('descr'),
				emptyText: 'Note ...',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Илгээх',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						var values_deals = '';
						if (me.stage != '') {
							me.probablity = me.selected.get('probablity');
							if (me.stage == 'close as won')
								me.probablity = 100;

							values_deals = "stage='"+me.stage+"'"+
										   ",probablity='"+me.probablity+"'"+
										   ",remind_date='"+Ext.Date.format(form.findField('remind_date').getValue(),'Y-m-d')+"'"+
										   ",competitor_name='"+form.findField('competitor_name').getValue()+"'"+
										   ",status='"+form.findField('status').getValue()+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";
							me.selected.data['stage'] = me.stage;

							if (me.stage == 'close as won') {
								Ext.Ajax.request({
								   url: 'avia.php',
								   params: {handle: 'web', action: 'create_quote', where: me.selected.get('deal_id')},
								   success: function(response, opts) {
									  Ext.MessageBox.alert('Status', 'Success !', function() {});
								   },
								   failure: function(response, opts) {										   
									  Ext.MessageBox.alert('Status', 'Error !', function() {});
								   }
								});	
							}
						} else {
							values_deals = "remind_date='"+Ext.Date.format(form.findField('remind_date').getValue(),'Y-m-d')+"'"+
										   ",competitor_name='"+form.findField('competitor_name').getValue()+"'"+
										   ",status='"+form.findField('status').getValue()+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";							
						}

						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_deals', action: 'update', values: values_deals, where: "deal_id="+me.selected.get('deal_id')},
						   success: function(response, opts) {
							  me.close();
							  me.competitorWrite();
							  me.customerLevelDetection();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});														
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		
		me.items = [me.form];		
		me.callParent(arguments);
	},
	
	competitorWrite : function() {
		var me = this;
			
	},

	customerLevelDetection: function() {
		var me = this;
		if (me.stage == 'close as won')
		{
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='customer'", where: "crm_id="+me.selected.get('crm_id')+" and (level='suspect' or level='prospect')"},
			   success: function(response, opts) {
				  me.close();
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		} else
		if (me.stage == 'close as lost')
		{
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='suspect'", where: "crm_id="+me.selected.get('crm_id')+" and level='prospect'"},
			   success: function(response, opts) {
				  me.close();
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		} else
		if (me.stage == 'opportunity')
		{						
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='prospect'", where: "crm_id="+me.selected.get('crm_id')+" and level='suspect'"},
			   success: function(response, opts) {
				  me.close();
				  views['deals'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});		
		} else {
			views['deals'].reload(me.selected);
		}
	}
});


Ext.define('OCS.ServiceDescrWindow', {
	extend: 'OCS.Window',

	maximizable: true,
	height: 250,
	width: 300,	

	initComponent: function() {
		var me = this;
		me.service_stage = 'service';
		if (me.selected.get('service_stage') == 'transit')
			me.service_stage = 'instock';
		if (me.selected.get('service_stage') == 'return')
			me.service_stage = 'inret';

		me.form = Ext.create('OCS.FormPanel', {
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'CRM ID',
				name: 'crm_id',
				hidden: true,
				value: me.selected.get('crm_id'),
				readOnly: true
			},	
			{
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_PREV',
 				  data: [{value: 'receipt', name: 'Ирсэн'},{value: 'service', name: 'Олгосон'},{value: 'remind', name: 'Хойшлогдсон'},{value: 'closed', name: 'Хаагдсан'},{value: 'return', name: 'Буцаалтанд ирсэн'},{value: 'inret', name: 'Хүлээн авсан буцаалт'},{value: 'transit', name: 'Замд яваа'},{value: 'instock', name: 'Хүлээн авсан'}]
              }),
			  name: 'service_stage',
			  queryMode: 'local',
			  value: me.service_stage,
		      displayField: 'name',
			  valueField: 'value',
			  triggerAction: 'all',
			  fieldLabel: 'Үе шат',
			  editable: false,
			  listeners: {
					'change': function(v) {
						var form = this.up('form').getForm();
						form.findField('remind_date').setVisible(v.getValue() == 'remind');
					}
			  }
			},
			{
				xtype: 'searchcombo',
				table: 'crm_users',
				fieldLabel: 'Хариуцагч',	
				allowBlank: false,
				value: me.selected.get('partner'),
				name: 'owner'
			},
			{
				xtype: 'datefield',
				fieldLabel: 'Remind date',				
				name: 'remind_date',
				value: new Date(),
				hidden: true,
				format: 'Y-m-d'
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Created by',				
				name: 'userCode',
				value: logged,
				hidden: true,
				readOnly: true
			},{
				xtype: 'textarea',
				fieldLabel: 'Тайлбар',
				hideLabel: true,
				name: 'descr',
				value: me.selected.get('descr'),
				emptyText: 'Тайлбар ...',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Илгээх',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var owner = form.findField('owner').getValue();
						if (owner.indexOf('@') == -1) {
							 Ext.MessageBox.alert('Status', 'Хариуцагч буруу байна !', function() {});
							 return;
						}

						var values = form.getValues(true);
						var values_services = '';
						me.service_stage = form.findField('service_stage').getValue();						
						if (me.service_stage == 'remind') {
							values_services = "owner='"+form.findField('owner').getValue()+"',service_stage='"+me.service_stage+"'"+
										   ",remind_date='"+Ext.Date.format(form.findField('remind_date').getValue(),'Y-m-d')+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";
							me.selected.data['service_stage'] = me.service_stage;							
						} else {
							values_services = "owner='"+form.findField('owner').getValue()+"',service_stage='"+me.service_stage+"'"+
										   ",remind_date='"+Ext.Date.format(form.findField('remind_date').getValue(),'Y-m-d')+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";
						}

						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_services', action: 'update', values: values_services, where: "service_id="+me.selected.get('service_id')},
						   success: function(response, opts) {
							  me.customerLevelDetection();	
							  me.close();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});														
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		
		me.items = [me.form];		
		me.callParent(arguments);
	},

	customerLevelDetection: function() {
		var me = this;
		if (me.service_stage == 'closed')
		{			
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='customer'", where: "crm_id="+me.selected.get('crm_id')+" and (level='suspect' or level='prospect')"},
			   success: function(response, opts) {
				  me.close();
				  views['services'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});					
		} else
		if (me.service_stage == 'service')
		{						
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: 'sales', values: 'service_id', where: me.selected.get('service_id')},
			   success: function(response, opts) {							  
				  
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});	
			
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='prospect'", where: "crm_id="+me.selected.get('crm_id')+" and level='suspect'"},
			   success: function(response, opts) {
				  me.close();
				  views['services'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});
		} else
		if (me.service_stage == 'instock')
		{						
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: 'instock', values: 'service_id', where: me.selected.get('service_id')},
			   success: function(response, opts) {							  
				    views['services'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});				
		} else
		if (me.service_stage == 'inret')
		{						
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: 'return', values: 'service_id', where: me.selected.get('service_id')},
			   success: function(response, opts) {							  
				    views['services'].reload(me.selected);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});				
		} else {
			views['services'].reload(me.selected);
		}
	}
});


Ext.define('OCS.AssignWindow', {
	extend: 'OCS.Window',
	
	title: 'Assign to',
	maximizable: true,
	height: 250,
	width: 300,	

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.FormPanel', {
			id : 'assign_to',				
			title: 'Assign to',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'CRM ID',
				name: 'crm_id',
				hidden: true,
				value: me.selected.get('crm_id'),
				readOnly: true
			},{
				xtype: 'searchcombo',
				table: 'crm_users',
				fieldLabel: 'Owner',				
				name: 'owner',
				labelWidth: 80,
				value: logged
			},				
			{
				xtype: 'textfield',
				fieldLabel: 'Бүртгэсэн',				
				name: 'userCode',
				value: logged,
				hidden: true,
				readOnly: true
			},{
				xtype: 'textarea',
				fieldLabel: 'Тайлбар',
				hideLabel: true,
				name: 'descr',
				value: me.selected.get('descr'),
				emptyText: 'Note ...',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Илгээх',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						var values_deals = "owner='"+form.findField('owner').getValue()+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";

						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_deals', action: 'update', values: values_deals, where: "deal_id="+me.selected.get('deal_id')},
						   success: function(response, opts) {
							  me.close();
							  views['deals'].reload(me.selected);
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});											
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


Ext.define('OCS.ServiceAssignWindow', {
	extend: 'OCS.Window',
	
	title: 'Assign to',
	maximizable: true,
	height: 250,
	width: 300,	

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.FormPanel', {
			id : 'assign_to',				
			title: 'Assign to',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'CRM ID',
				name: 'crm_id',
				value: me.selected.get('crm_id'),
				hidden: true,
				readOnly: true
			},{
				xtype: 'textfield',
				fieldLabel: 'Гүйлгээ дугаар',
				name: 'service_id',
				value: me.selected.get('service_id'),
				readOnly: true
			},{
				xtype: 'searchcombo',
				table: 'crm_users',
				fieldLabel: 'Хариуцагч',				
				name: 'owner',
				value: logged
			},				
			{
				xtype: 'textfield',
				fieldLabel: 'Created by',				
				name: 'userCode',
				value: logged,
				hidden: true,
				readOnly: true
			},{
				xtype: 'textarea',
				fieldLabel: 'Тайлбар',
				hideLabel: true,
				name: 'descr',
				value: me.selected.get('descr'),
				emptyText: 'Note ...',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Илгээх',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var owner = form.findField('owner').getValue();
						if (owner.indexOf('@') == -1) {
							 Ext.MessageBox.alert('Status', 'Хариуцагч буруу байна !', function() {});
							 return;
						}

						var values = form.getValues(true);
						var values_deals = "owner='"+form.findField('owner').getValue()+"'"+
										   ",descr='"+form.findField('descr').getValue()+"'";

						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_services', action: 'update', values: values_deals, where: "service_id="+me.selected.get('service_id')},
						   success: function(response, opts) {							  
	  						  Ext.Ajax.request({
								   url: 'avia.php',
								   params: {handle: 'web', table: 'crm_balance', action: 'update', values: "owner='"+form.findField('owner').getValue()+"'", where: "descr="+me.selected.get('subject')+" and crm_id="+me.selected.get('crm_id')},
								   success: function(response, opts) {
								   },
								   failure: function(response, opts) {										   
									  Ext.MessageBox.alert('Status', 'Error !', function() {});
								   }
							  });							  
							  
							  me.close();
							  views['services'].reload(me.selected);
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
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


Ext.define('OCS.CaseProductGrid', {
	extend: 'OCS.DealProductGrid',
	func: 'crm_case_product_list',
	tab : 'case_product_property',
	title: 'Products',
	icon: 'call',
	table: 'crm_case_products',
	dateField: '_date',
	sortField: 'product_name',
	modelName: 'CRM_CASE_PRODUCTS',
	collapsed: false,
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Нэмэх ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.CaseProductWindow({
							selected: me.selected
						}).createWindow();
					else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			})
		];

		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner') == logged;
		me.where = rec.get('case_id');
		me.values = 'case_id';
		me.loadStore();
	},	
	
	createColumns: function() {
		var me = this;
		return [{
			text: 'Product name',
			dataIndex: 'product_name',
			flex: 1,			
			sortable: false
		},{
			text: 'Contract No',
			dataIndex: 'contract',
			width: 120,
			sortable: true
		}];
	}
});


Ext.define('OCS.CaseHistoryGrid', {
	extend: 'OCS.DealProductGrid',
	func: 'crm_case_transfer_list',
	tab : 'case_transfer_property',
	title: 'History',
	icon: 'call',
	table: 'crm_complain_transfer',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_CASE_TRANSFER',
	collapsed: false,
	primary: 'id',
	
	createActions: function() {
		var me = this;
		me.actions = [			
		];

		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner') == logged;
		me.where = rec.get('case_id');
		me.values = 'case_id';
		me.loadStore();
	},	
	
	renderTitle: function(value, p, record) {
		return Ext.String.format(
			'<table class="{2}"><tr><td width="50px"><div class="c-assign" title="Assign"></div></td><td><b><span class="title">{2}</span></b></br><span class="lightgray">{1}</span></br><span class="gray">assigned&nbsp;by&nbsp;</span><span class="purple">{3}</span>&nbsp;<span class="gray">{4}</span></td></tr></table>',
			value,
			record.data.descr,
			record.data.owner,
			record.data._from,
			record.data._date
		);		
	},

	createColumns: function() {
		var me = this;
		return [{
			text: 'Note',
			dataIndex: 'descr',
			flex: 1,			
			renderer: me.renderTitle,
			sortable: false
		}];
	}
});


Ext.define('OCS.DealHistoryGrid', {
	extend: 'OCS.DealProductGrid',
	func: 'crm_deal_transfer_list',
	tab : 'deal_transfer_property',
	title: 'History',
	icon: 'call',
	table: 'crm_complain_transfer',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_DEAL_TRANSFER',
	collapsed: false,
	primary: 'id',
	title_add : 'Add/Expand ...',
	
	createActions: function() {
		var me = this;
		me.actions = [			
		];

		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner') == logged;
		me.where = rec.get('deal_id');
		me.values = 'deal_id';
		me.loadStore();
	},	
	
	renderTitle: function(value, p, record) {
		return Ext.String.format(
			'<table class="{2}"><tr><td width="50px"><div class="c-assign" title="Assign"></div></td><td><b><span class="title">{0}</span></b></br><span class="lightgray">{1}</span></br><span class="gray">assigned&nbsp;by&nbsp;</span>{1}, owner: <span class="purple">{2}</span>&nbsp;<span class="gray">{3}</span></td></tr></table>',
			value,
			record.data.owner,
			record.data.userCode,
			record.data._date
		);		
	},

	createColumns: function() {
		var me = this;
		return [{
			text: 'Note',
			dataIndex: 'descr',
			flex: 1,			
			renderer: me.renderTitle,
			sortable: false
		}];
	}
});

Ext.define('OCS.DealPayrollGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_deal_payroll_list',
	tab : 'deal_pay_roll',
	title: 'Payments',
	icon: 'call',
	table: 'crm_deal_payroll',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_DEAL_PAYROLL',
	collapsed: false,
	primary: 'id',
	
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner') == logged;
		me.where = rec.get('deal_id');
		me.values = 'deal_id';
		me.loadStore();
	},	

	createColumns: function() {
		var me = this;
		return [{
			text: 'Огноо',
			dataIndex: 'pay_date',
			width: 120,			
			sortable: false
		},{
			text: 'Дүн',
			dataIndex: 'amount',
			flex: 1,		
			renderer: renderMoney,
			summaryType: 'sum',
			align: 'right',
			summaryRenderer: renderTMoney,
			sortable: false
		},{
			text: 'Бүртгэсэн',
			dataIndex: 'userCode',
			width: 130,			
			sortable: false
		}];
	},
	
	createGrid: function() {
		var me = this;	
		me.createActions();
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			flex: 1,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: true,
			actions: me.createActions(),
			tbarable: false
		});
	}
});

Ext.define('OCS.ServicePayrollGrid', {
	extend: 'OCS.DealPayrollGrid',
	func: 'crm_service_payroll_list',
	tab : 'service_pay_roll',
	title: 'Төлөлт',
	icon: 'call',
	table: 'crm_service_payroll',
	dateField: '_date',
	sortField: '_date',
	modelName: 'CRM_SERVICE_PAYROLL',
	collapsed: false,
	primary: 'id',
	
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = ((rec.get('owner') == logged || user_level > 0) && rec.get('service_stage') != 'receipt');
		me.where = rec.get('service_id');
		me.values = 'service_id';
		me.loadStore();
	}
});

Ext.define('OCS.ContactGrid', {
	extend: 'OCS.DealGrid',
	func: 'crm_contact_list',
	tab : 'contact_detail_property',
	title: 'Contacts',
	icon: 'call',
	table: 'crm_customer',
	dateField: '_date',
	sortField: 'crm_id',
	modelName: 'CRM_RETAIL',
	collapsed: false,

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('crm_id');
		me.values = 'parent_crm_id';
		me.loadStore();
	},

	renderTitle: function(value, p, record) {
        return Ext.String.format(
            '<table><tr><td><div class="c-contact"></div></td><td><b><span class="title">{0}</span></b></br><span class="gray">{1}&nbsp;*{2}</br><a href="mailto:{3}">{3}</a></span></td></tr></table>',
            value,
            record.data.job_title,
            record.data.decision_maker,
            record.data.email
        );
    },
	
	
	createColumns: function() {
		var me = this;
		return [{
			text: 'Contact name',
			dataIndex: 'crm_name',
			renderer: me.renderTitle,
			flex: 1,
			sortable: false
		},{
			text: 'Phone',
			dataIndex: 'phone',
			width: 80,
			align: 'right',
			sortable: true,
			renderer: renderPhone
		}];
	}
});
