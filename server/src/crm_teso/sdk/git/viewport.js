var views = [];
var shows = [];
Ext.define('OCS.Viewport', {
	extend : 'Ext.Viewport',
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	initComponent: function() {
		 var me = this;
		 
		 me.alert = new OCS.AlarmWindow({
			modal: false,
			height: 400			
		 });		

		 shows['dashboard'] = (user_level == 3);
		 views = [];
		 views['topbar'] = Ext.create('Ext.Component', {
			id: 'topbar',
			region: 'north',
			height: 32, 
			html:'<div class="caption">'+
					'<table cellpadding=0 cellspacing=0><tr><td class="padding'+(pk=='dashboard'?' active':'')+'"><a href="index.php?pk=dashboard&token='+token+'">Хяналт & GPS</a></td><td class="padding'+(pk=='workspace'?' active':'')+'"><a href="index.php?pk=workspace&token='+token+'">Үйл ажиллагаа</a></td><td style="display:none" class="padding'+(pk=='deals'?' active':'')+'"><a href="index.php?pk=deals&token='+token+'">Хэлцэл</a></td><td class="padding'+(pk=='reseller'?' active':'')+'" style="display: none"><a href="index.php?pk=reseller&token='+token+'">Салбар</a></td><td class="padding'+(pk=='retail'?' active':'')+'"><a href="index.php?pk=retail&token='+token+'"">Хувь хүн</a></td><td class="padding'+(pk=='corporate'?' active':'')+'"><a href="index.php?pk=corporate&token='+token+'">Байгууллага</a></td><td class="padding'+(pk=='cases'?' active':'')+'"><a href="index.php?pk=cases&token='+token+'">Санал гомдол</a></td><td style="display:none" class="padding'+(pk=='campaigns'?' active':'')+'"><a href="index.php?pk=campaigns&token='+token+'">Маркетинг</a></td><td class="padding'+(pk=='services'?' active':'')+'"><a href="index.php?pk=services&token='+token+'">Борлуулалт</a></td><td class="padding'+(pk=='competitor'?' active':'')+'" style="display:none"><a href="index.php?pk=competitor&token='+token+'">Өрсөлдөгч</a></td><td class="padding'+(pk=='goal'?' active':'')+'"><a href="index.php?pk=goal&token='+token+'">Төлөвлөгөө</a></td><td class="padding'+(pk=='product'?' active':'')+'"><a href="index.php?pk=product&token='+token+'">Бараа</a></td><td class="padding'+(pk=='promotion'?' active':'')+'"><a href="index.php?pk=promotion">Урамшуулал</a></td><td class="padding'+(pk=='storage'?' active':'')+'"><a href="index.php?pk=storage&token='+token+'">Агуулах</a></td><td class="padding'+(pk=='reports'?' active':'')+'"><a href="index.php?pk=reports&token='+token+'">Тайлан</a></td><td class="padding'+(pk=='settings'?' active':'')+'"><a href="index.php?pk=settings&token='+token+'">Тохиргоо</a></td><td class="padding" style="float:right"><a href="logout.php">Гарах</a></td></tr></table>'+
 				 '</div>'
		 });
		 if (pk == 'retail')
			 views['retail'] = new OCS.RetailPanel();

		 if (pk == 'corporate')
			 views['corporate'] = new OCS.CorporatePanel();

		 if (pk == 'cases')
			 views['cases'] = new OCS.Cases();

		 if (pk == 'dashboard')
			 views['dashboard'] = new OCS.Dashboard();

		 if (pk == 'workspace')
			 views['workspace'] = new OCS.Workspace();

		if (pk == 'campaigns')
			 views['campaigns'] = new OCS.Campaigns();

		 if (pk == 'competitor')
			 views['competitor'] = new OCS.Competitors();

		 if (pk == 'reports')
			 views['reports'] = new OCS.Reports();

		 if (pk == 'deals')
			 views['deals'] = new OCS.Deals();

		 if (pk == 'services')
			 views['services'] = new OCS.Services();

		 if (pk == 'reseller')
			 views['reseller'] = new OCS.Reseller();

		 if (pk == 'quotes')
			 views['quotes'] = new OCS.QuotePanel();

		 if (pk == 'sales')
			 views['sales'] = new OCS.SalesPanel();

		 if (pk == 'settings')
			 views['settings'] = new OCS.SettingsPanel();

		 if (pk == 'goal')
			 views['goal'] = new OCS.GoalsPanel();

		 if (pk == 'product')
			 views['product'] = new OCS.ProductPanel();

		if (pk == 'promotion')
			 views['promotion'] = new OCS.PromotionPanel();

		 if (pk == 'storage')
			 views['storage'] = new OCS.StoragePanel();


		 me.items = [			
			views['topbar'],
			views[pk].createPanel()	
		];				
				
		me.callParent(arguments);
	}
});