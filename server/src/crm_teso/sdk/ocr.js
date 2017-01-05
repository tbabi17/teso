Ext.define('OCS.Reports', {
	extend: 'OCS.Module',	
	modelName: 'CRM_REPORT',
	func: 'crm_report_deal_list',

	createActions: function() {
		var me = this;
		me.actions = [		
			Ext.create('Ext.Action', {
				iconCls: 'list',
				id: 'report_title',
				text: 'Тайлангийн жагсаалт',
				menu: {
					xtype: 'menu',
					items: [						
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Бүтээгдэхүүний нэгдсэн тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_title').setText('Бүтээгдэхүүний нэгдсэн тайлан');
								Ext.getCmp('report_owner').setVisible(false);
								Ext.getCmp('report_start_1').setVisible(true);
								Ext.getCmp('report_end_1').setVisible(true);
								me.reconfigure('CRM_REPORT_PRODUCT', 'crm_report_product_list');
							}
						}),	
						/*Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Харилцагчийн нэгдсэн тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_title').setText('Харилцагчийн нэгдсэн тайлан');
								Ext.getCmp('report_owner').setVisible(true);
								me.reconfigure('CRM_REPORT_CUSTOMER', 'crm_report_customer_list');
							}
						}),	 */
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Харилцагчийн нэгдсэн тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_title').setText('Харилцагчийн нэгдсэн тайлан');
								Ext.getCmp('report_owner').setVisible(true);
								me.reconfigure('CRM_REPORT_CUSTOMER1', 'crm_report_customer_list1');
							}
						}),	
						Ext.create('Ext.Action', {
							icon   : '',  
							hidden: true,
							text: 'Харилцагчын тайлан бараагаар',
							handler: function(widget, event) {
								me.panelW.setVisible(false);
								Ext.getCmp('report_title').setText('Харилцагчын тайлан бараагаар');
								me.reconfigure('CRM_REPORT_VOLTAM_1', 'crm_report_voltam_1_list');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Тайлан /Дэлгэрэнгүй/',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								window.open('http://'+ip+':89/newRep');
							}
						}),
						/*
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Борлуулагчийн идэвхи',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								window.open('http://'+ip+'/opg');
							}
						}),
						*/
						Ext.create('Ext.Action', {
							icon   : '',   
							text: 'Борлуулагчийн нэгдсэн тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_owner').setVisible(false);
								Ext.getCmp('report_title').setText('Борлуулагчийн нэгдсэн тайлан');
								me.reconfigure('CRM_REPORT_USER', 'crm_report_user_list');
							}
						}),
						'-',
						Ext.create('Ext.Action', {
							icon   : '',   
							text: 'Борлуулалтын нэгдсэн тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_owner').setVisible(true);
								Ext.getCmp('report_title').setText('Борлуулалтын нэгдсэн тайлан');
								Ext.getCmp('report_start_1').setVisible(true);
								Ext.getCmp('report_end_1').setVisible(true);
								me.reconfigure('CRM_REPORT_SALES_CUSTOMER', 'crm_report_sales_customer_list');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Барааны харьцуулалтын тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_owner').setVisible(false);
								Ext.getCmp('report_unit_type').setVisible(true);
								Ext.getCmp('report_start_1').setVisible(false);
								Ext.getCmp('report_end_1').setVisible(false);
								Ext.getCmp('report_title').setText('Барааны харьцуулалтын тайлан');
								me.reconfigure('CRM_REPORT_COMPARE_PRODUCT', 'crm_report_compare_product_list');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Харилцагчийн харьцуулалтын тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_owner').setVisible(true);
								Ext.getCmp('report_start_1').setVisible(false);
								Ext.getCmp('report_end_1').setVisible(false);
								Ext.getCmp('report_title').setText('Харилцагчийн харьцуулалтын тайлан');
								me.reconfigure('CRM_REPORT_COMPARE_CUSTOMER', 'crm_report_compare_customer_list');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Борлуулагчийн харьцуулалтын тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_owner').setVisible(false);
								Ext.getCmp('report_start_1').setVisible(false);
								Ext.getCmp('report_end_1').setVisible(false);
								Ext.getCmp('report_title').setText('Борлуулагчийн харьцуулалтын тайлан');
								me.reconfigure('CRM_REPORT_COMPARE_USER', 'crm_report_compare_user_list');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Борлуулагч болон Барааны харьцуулалтын тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_owner').setVisible(false);
								Ext.getCmp('report_unit_type').setVisible(true);
								Ext.getCmp('report_start_1').setVisible(true);
								Ext.getCmp('report_end_1').setVisible(true);
								Ext.getCmp('report_title').setText('Борлуулагч болон Барааны харьцуулалтын тайлан');
								me.reconfigure('CRM_REPORT_COMPARE', 'crm_report_compare_product_user_list');
							}
						}),
						/*
						'-',
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Агуулахын тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_title').setText('Агуулахын тайлан');
								me.reconfigure('CRM_REPORT_STORAGE', 'crm_report_storage_list');
							}
						}),	
						*/
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Борлуулагчийн үлдэгдэл',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								Ext.getCmp('report_title').setText('Борлуулагчийн үлдэгдэл');
								me.reconfigure('CRM_REPORT_STORAGE_DAILY', 'crm_report_storage_daily_list');
							}
						}),
						'-',												
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Үйл ажиллагааны тайлан',
							handler: function(widget, event) {
								me.where = '';
								me.values = '';
								me.panelW.setVisible(false);
								me.reconfigureStatic('CRM_REPORT_ACTIVITY', 'crm_report_activity_list');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Гомдол саналын тайлан',
							handler: function(widget, event) {
								me.panelW.setVisible(false);
								me.reconfigureStatic('CRM_REPORT_CASE', 'crm_report_case_list');
							}
						})
					]
				}		
			}),
			'-',
			{
				id: 'report_owner',
				hidden: true,
				xtype: 'searchcombo',
				fieldLabel: 'Борлуулагч',
				labelWidth: 70,
				table: 'crm_users',				
				name: 'owner',
				listeners: {
					'change': function() {
						me.rangeData();
					}
				}
			},
			{
			  id : 'report_unit_type',
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'тоогоор'},{value: 'мөнгөн дүнгээр'}]
              }),
			  name: 'report_unit_type',
			  queryMode: 'local',
		      displayField: 'value',
			  value: 'мөнгөн дүнгээр',					 
			  valueField: 'value',
			  triggerAction: 'all',
			  hidden: true,
			  editable: false,
			  listeners: {
					'change': function() {
						me.rangeData();
					}
			  }
			},
			{
				id: 'report_start_1',
				text: me.today(),
				iconCls: 'calendar',
				menu: Ext.create('Ext.menu.DatePicker', {
					handler: function(dp, date){
						me.start = Ext.Date.format(date, 'Y-m-d');
						me.report.start = Ext.Date.format(date, 'Y-m-d');
						Ext.getCmp('report_start_1').setText(me.start);
						me.rangeData();
					}
				})
			},
			{
				id: 'report_end_1',
				text: me.tommorow(),
				iconCls: 'calendar',				
				menu: Ext.create('Ext.menu.DatePicker', {
					handler: function(dp, date){
						me.end = Ext.Date.format(date, 'Y-m-d');
						me.report.end = Ext.Date.format(date, 'Y-m-d');
						Ext.getCmp('report_end_1').setText(me.end);
						me.rangeData();
					}
				})
			},
			{
				text: 'Арилгах',
				iconCls: 'reset',
				handler: function() {
					me.report.getView().getFeature('group').disable();
					Ext.getCmp('report_start_1').setText(me.month());
					Ext.getCmp('report_end_1').setText(me.nextmonth());
					me.start = me.month(); me.end = me.nextmonth();
					me.report.start = me.month();
					me.report.end = me.nextmonth();
					me.rangeData();
				}
			},			
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Экспорт...',
				disabled: (user_level == '0'),
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
					   params: {handle: 'file', action:'export', where: me.xlsName},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			})
		];
			
		return me.actions;
	},

	reconfigure: function(modelName, func) {
		var me = this;
		me.xlsName = modelName;
		me.modelName = modelName;
		me.func = func;
		me.report.func = func;
		me.report.start = me.start;
		me.report.end = me.end;
		me.createStore();
		me.report.reconfigure(me.store, me.createColumns());
		me.rangeData();
	},

	reconfigureStatic: function(modelName, func) {
		var me = this;
		me.xlsName = modelName;
		me.modelName = modelName;
		me.func = func;
		me.report.func = func;
		me.report.start = me.start;
		me.report.end = me.end;
		me.createStore();
		me.report.reconfigure(me.store, columns[modelName+'_COLUMNS']);
		me.rangeData();
	},

	createPanel: function() {
		var me = this;
		me.start = me.today();
		me.end = me.tommorow();
		me.report = new OCS.BGridView({
			store: me.store,
			columns: me.createColumns(),
			flex: 0.75,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			feature: true,
			actions: me.createActions(),
		});

		me.chart = new OCS.ProductChart();
		
		me.panelW = Ext.create('Ext.Panel', {			
			layout: 'fit',
			region: 'east',
			height: 1200,
			flex: 0.75,
			hidden: true,
			split: true,
			items: me.chart
		});

		me.panel = Ext.create('Ext.Panel', {	
			title: 'Тайлан',
			tab: 'report_tab_list',
			layout: 'border',
			region: 'center',
			border: false,
			items: [
				me.report, me.panelW
			]
		});

		me.reconfigure('CRM_REPORT_PRODUCT', 'crm_report_product_list');
		Ext.getCmp('report_title').setText('Бүтээгдэхүүний нэгдсэн тайлан');
		return me.panel;
	},

	rangeData: function() {
		var me = this;
		me.where = Ext.getCmp('report_owner').getValue()+','+Ext.getCmp('report_unit_type').getValue();
		me.report.where = Ext.getCmp('report_owner').getValue()+','+Ext.getCmp('report_unit_type').getValue();
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, start_date: me.start, end_date: me.end, values: me.values, where: me.where};
		me.store.load({callback: function() {

		}});
	}
});

Ext.define('OCS.ServiceView', {
	extend: 'OCS.DealView',
	func: 'crm_service_list',	
	sortField: '_date',
	groupField: 'userCode',
	table: 'crm_services',
	tab: 'my_service_list',
	title: 'All Services',
	sub: 'my_open_receipts',
	primary: 'service_id',
	xlsName: 'Service',

	createSubActions: function() {
		var me = this; 
		if (user_level == '5') { 
			return [
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Замд яваа',
					handler: function(widget, event) {
						me.filterData('Transit services');
					}
				}),
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Хүлээн авсан',
					handler: function(widget, event) {
						me.filterData('Stocked services');
					}
				})
			];
		} else {
			return [
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Нээлттэй',
					handler: function(widget, event) {
						me.filterData('Open Services');
					}
				}),
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Шинээр ирсэн',
					handler: function(widget, event) {
						me.filterData('Incoming Services');
					}
				}),
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Олгосон',
					handler: function(widget, event) {
						me.filterData('Outgoing Services');
					}
				}),
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Амжилттай хаагдсан',
					handler: function(widget, event) {
						me.filterData('Closed Services');
					}
				}),	
				'-',
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Амжилтгүй',
					handler: function(widget, event) {
						me.filterData('Failed Services');
					}
				}),
				Ext.create('Ext.Action', {
					icon   : '',  
					text: 'Буцаалтанд ирсэн',
					handler: function(widget, event) {
						me.filterData('Returned Services');
						me.mode = 'return';
					}
				})
			];
		}
	},

	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Харагдац',
				menu: {
					xtype: 'menu',
					items: me.createSubActions()
				}		
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Дэлгэрэнгүй...',
				handler: function(widget, event) {
					if (me.grid.getView().getSelectionModel().getSelection().length > 0) {
						new OCS.NewServiceWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).createWindow();
					} else 
						Ext.MessageBox.alert('Status', 'Сонгогдсон мөр байхгүй байна !', function() {});
				}
			}),			
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Устгах',
				handler: function(widget, event) {
					var record = me.grid.getView().getSelectionModel().getSelection()[0];
					if (record.get('service_stage') == 'receipt' || record.get('service_stage') == 'return' || record.get('service_stage') == 'transit')										
						me.deleteRecord();
					else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'merge',
				text: 'Нэгтгэх...',
				handler: function(widget, event) {
					if (user_level > 0) {					
						if (me.grid.getView().getSelectionModel().getSelection().length == 2){	
							var rec1 = me.grid.getView().getSelectionModel().getSelection()[0];
							var rec2 = me.grid.getView().getSelectionModel().getSelection()[1];
							if (rec1.get('service_stage') == 'receipt' && rec2.get('service_stage') == 'receipt') {							
								new OCS.MergeRecordsWindow({
									name: me.xlsName,
									master: me.grid.getView().getSelectionModel().getSelection()[0],
									slave: me.grid.getView().getSelectionModel().getSelection()[1]
								}).show();
							} else
								Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
						} else
							Ext.MessageBox.alert('Status', '2 бичлэг сонгох ёстой !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'import',
				text: 'Импорт...',
				handler: function(widget, event) {
					new OCS.UploadWindow({
						name: me.xlsName						
					}).show();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls  : 'export',
				text: 'Экспорт...',
				disabled: (user_level == '0'),
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
					   params: {handle: 'file', action:'export', where: me.xlsName},					
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
				iconCls   : 'deal_assign',
				text: 'Оноох ...',
				handler: function(widget, event) {
					if (user_level > 0 ) {												
						if (me.recordSelected())						
							new OCS.ServiceMultiAssignWindow({
								selected: me.grid.getView().getSelectionModel().getSelection()[0],
								ids: me.selectedIds('service_id'),
								direction: me.xlsName
							}).show();
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'deal_won',
				text: 'Зөвшөөрөх ...',
				
				handler: function(widget, event) {
					if (user_level > 0 ) {					
						if (me.recordSelected())						
							new OCS.ServiceMultiAgreeWindow({
								selected: me.grid.getView().getSelectionModel().getSelection()[0],
								ids: me.selectedIds('service_id'),
								partner:  me.grid.getView().getSelectionModel().getSelection()[0].get('partner'),
								direction: me.xlsName
							}).show();
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'deal_print',
				text: 'Хэвлэх ...',
				handler: function(widget, event) {
					crm_id = me.grid.getView().getSelectionModel().getSelection()[0].get('crm_id');
					owner = me.grid.getView().getSelectionModel().getSelection()[0].get('owner');
					userCode = me.grid.getView().getSelectionModel().getSelection()[0].get('userCode');
					service_stage = me.grid.getView().getSelectionModel().getSelection()[0].get('service_stage');
					subject = me.grid.getView().getSelectionModel().getSelection()[0].get('subject');
					pricetag = me.grid.getView().getSelectionModel().getSelection()[0].get('pricetag');
					date = me.grid.getView().getSelectionModel().getSelection()[0].get('_date').split(' ')[0]; 

					if (service_stage == 'service') {
						if (userCode == 'ariunjargal@cosmo' || userCode == 'amarjargal@cosmo' || userCode == 'amarjargalgoo@cosmo'  || userCode == 'bayarchimeggoo@cosmo' || userCode == 'bayarchimeg@cosmo' || userCode == 'otgonbat@cosmo' || userCode == 'narantsetseg@cosmo')												
							window.open('http://'+ip+'/invzahon/?values='+owner+';'+crm_id+';'+date+';1;1;'+logged+';'+subject+';0','');
						else {
							if (logged.indexOf('glf') != -1)
								window.open('http://'+ip+'/invms/?values='+owner+';'+crm_id+';'+date+';1;1;'+logged+';'+subject,'');
							else
							if (logged.indexOf('cosmo') != -1)
								window.open('http://'+ip+'/invms/?values='+owner+';'+crm_id+';'+date+';1;1;'+logged+';'+subject+';0','');
							else
								window.open('http://'+ip+'/invms/?values='+owner+';'+crm_id+';'+date+';1;1;'+logged+';'+subject+';0','');
						}
					}
					else
					if (service_stage == 'inret') {
							window.open('http://'+ip+'/invbs/?values='+owner+';'+crm_id+';'+date+';1;1;'+logged+';'+subject+';0','');
					}
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls   : 'deal_undo',
				text: 'Буцаах ...',
				handler: function(widget, event) {
					if (user_level > 0 ) {												
						if (me.recordSelected())						
							new OCS.ServiceUndoWindow({
								ids: me.selectedIds('service_id'),
								direction: me.xlsName
							}).show();
					} else
						Ext.MessageBox.alert('Error', 'Уг үйлдлийг хийхэд таны эрх хүрэлцэхгүй !', function() {});
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

	createView: function() {
		var me = this;
		me.modelName = 'CRM_SERVICE';
		me.createStore();
		me.storeExtend();

		me.grid = Ext.create('OCS.GridView', {	
			id: me.tab,
			title: me.title,
			store: me.store,
			flex: 1,
			func: me.func,
			feature: true,
			actions: me.createActions(),
			columns: me.createColumns(),
			viewConfig: {
				itemclick: function(dv, record, item, index, e) {
					views['services'].action.select(record);
				}
			}
		});

		me.grid.on('itemclick', function(dv, record, item, index, e) {
				views['services'].action.select(record);				
			}
		);
				
		me.grid.start = me.today();
		me.grid.end = me.tommorow();

		me.filterData('Incoming Services');	

		return me.grid;
	},

	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.grid.views = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, start_date: me.grid.start, end_date: me.grid.end, where: me.where, views: views};
		me.store.loadPage(1);
	},

	today: function() {
		var now = new Date();
		return Ext.Date.format(now, 'Y-m-d');
	},

	tommorow: function() {
		 var today = new Date();
		 var d = today.getDate();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m, d+1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	}
});
