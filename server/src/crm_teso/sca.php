<!DOCTYPE HTML>
<html>
<head>
  <script type="text/javascript">
  window.onload = function () {
	 var data = [];
	$.post('avia.php', {handle: 'web', action: 'select', func: 'crm_workflow_ui_list', sort: '_date'}, function(obj) {
		i = 0;
		$.each(obj, function() {
			   var x = this['issue'];
			   var y = this['priority'];				
			   data[i] = {x: x, y: y, subject: this['subject']};
			   i++;
		  });

		var chart = new CanvasJS.Chart("chartContainer", {
		title:{
		  text: "Urgency & Importance"
		},		
		axisX:{  
			interval: 200,
			gridColor: "lightgreen",
			gridThickness: 1,
			maximum: 400,
			minimun: 0
		},
		axisY:{        
			interval: 200,
			gridThickness: 1,
			gridColor: "lightgreen",
			maximum: 400,
			minimun: 0
		},
		data: [{
			type: "scatter",
			toolTipContent: "{subject}",
			dataPoints: data
		}]
	});
	chart.render();
	});

	
}
</script>
<script type="text/javascript" src="http://canvasjs.com/assets/script/canvasjs.min.js"></script>
<script type='text/javascript' src='funnel/jquery-1.9.1.js'></script>       
</head>
<body>
  <div id="chartContainer" style="height: 600px; width: 700px;">
  </div>
</body>
</html>