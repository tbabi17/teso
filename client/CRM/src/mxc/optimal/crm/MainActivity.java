package mxc.optimal.crm;

import java.io.File;
import java.util.ArrayList;

import mxc.app.engine.Collection;
import mxc.app.engine.GPSManager;
import mxc.app.engine.ImageLoader;
import mxc.app.engine.LocationService;
import mxc.app.engine.MasterActivity;
import mxc.app.engine.PageAdapter;
import mxc.app.engine.PhotoHandler;
import mxc.app.engine.Shared;
import mxc.app.engine.ShowCamera;
import mxc.app.engine.Variant;
import mxc.bluetooth.printer.UpdateApp;

import org.json.JSONArray;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.location.Location;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.StrictMode;
import android.support.v4.view.ViewPager;
import android.telephony.TelephonyManager;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ExpandableListView;
import android.widget.ExpandableListView.OnChildClickListener;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TableRow.LayoutParams;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

@SuppressLint("NewApi")
public class MainActivity extends MasterActivity implements OnItemClickListener, OnClickListener{	
		
	private ListView list, product_list;
	private ExpandableListView product_grouped_list;
	public ProgressDialog pd;	
	public int customer_last_selection = 0;
	public XMLParser parser = new XMLParser();
	public boolean showMsg = false;	
		
	@Override	
	protected void onCreate(Bundle savedInstanceState) {			
		/*if (Build.VERSION.SDK_INT == Build.VERSION_CODES.HONEYCOMB || Build.VERSION.SDK_INT == Build.VERSION_CODES.HONEYCOMB_MR1) {
			StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectDiskReads().detectDiskWrites().detectNetwork().penaltyLog().build());
			StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder().detectLeakedSqlLiteObjects().detectLeakedClosableObjects().penaltyLog().penaltyDeath().build());
		}*/
		
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		if (android.os.Build.VERSION.SDK_INT > 9) {
		    StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
		    StrictMode.setThreadPolicy(policy);
		}	
		
		Shared.init(this);
		setBackground(R.color.white, R.id.activity, LINEAR);
		
		startup();
	
		handle = getIntent().getStringExtra("handle");
		if (handle == null) handle = "menu";
		
		//registerReceiver(batteryReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
		
		TelephonyManager tm = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
        String imei = tm.getDeviceId(); 
        if (imei == null) imei = "000000000000000";
        Shared.sid = imei;
	}
	
	private BroadcastReceiver batteryReceiver = new BroadcastReceiver(){
        @Override
        public void onReceive(Context arg0, Intent intent) {
          int level = intent.getIntExtra("level", 0);
          Shared.batteryLevel = level;
        }
    };
    
	@Override
	public void reload() {
		new TaskExecution().execute();
	}
		
	@Override
	public void onResume() {
		super.onResume();
		gps_tracker();
		checkUnsuccess();
	}
	
	public void checkUnsuccess() {
		if (isOnline() && logged.length() > 0) {
			XMLParser parser = new XMLParser();
			parser.getXmlUnSuccess(getURL());
		}
	}
	
	public void startup() {
		showMsg = false;
		imgLoader = new ImageLoader(this);
		setBackgroundDrawable(R.drawable.lead, R.id.activity, LINEAR);
		removeToolbarItems();
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();
		View v = getLayoutInflater().inflate(R.layout.startup, null);		
		
		final EditText user = (EditText)v.findViewById(R.id.user);
		final EditText pass = (EditText)v.findViewById(R.id.pass);
		user.setText(getData("logged", ""));
		if (getData("logged","").length() > 0) {
			user.setBackgroundDrawable(getResources().getDrawable(R.drawable.price_state));
			user.setTextColor(getResources().getColor(R.color.white));
			user.setEnabled(false);
			pass.requestFocus();
		}
		Button login = (Button)v.findViewById(R.id.login);
		login.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				u = user.getText().toString();
				p = pass.getText().toString();
				InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.hideSoftInputFromWindow(pass.getWindowToken(), 0);
				if (u.length() > 10 && p.length() > 2) {
					command = "login";
					new TaskExecution().execute();
				} else
					Log.v("error",getURL());
					Toast.makeText(getApplicationContext(), "Алдаатай хүсэлт !", Toast.LENGTH_SHORT).show();
			}
			
		});
		
		Button other = (Button)v.findViewById(R.id.xlogin);
		other.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				user.setEnabled(true);
				user.setText("");
				user.setBackgroundDrawable(getResources().getDrawable(R.drawable.edit_state));
				user.setTextColor(getResources().getColor(R.color.black));
				user.requestFocus();
			}
			
		});
		
		content.addView(v);
		
		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);
	}
	
	@Override
	public void reload_see_list() {
		command = "call_me";
		new TaskExecution().execute();
	}
	
	@Override
	public void reload_report_list() {
		command = "report_list";
		new TaskExecution().execute();
	}
	
	public void customer() {
		self_order = false;
		activeCRM = new Variant();
		activeProduct = new Variant();
		
		setBackground(R.color.white, R.id.activity, LINEAR);
		activity = "customer";
		setToolbarItemsDetailWithSearch("Гарах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.setGravity(Gravity.TOP|Gravity.CENTER);
		content.removeAllViews();				
		View v = getLayoutInflater().inflate(R.layout.customer, null);			
		
		ImageView icon = (ImageView)v.findViewById(R.id.icon);
		imgLoader.DisplayImage(getAvatarImageUrl() + logged+".png", icon);
		//icon
		
		LinearLayout online = (LinearLayout)v.findViewById(R.id.status);
		online.setBackgroundColor(isOnline() ? getResources().getColor(R.color.green_bg):getResources().getColor(R.color.red_bg));
		TextView loggedMan = (TextView)v.findViewById(R.id.name);
		loggedMan.setText(logged);
		texts.put("logged_man", loggedMan);	
		TextView successTotal = (TextView)v.findViewById(R.id.successTotal);
		texts.put("successTotal", successTotal);				
		
		Button order_me = (Button)v.findViewById(R.id.order_me);
		order_me.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				//if (Shared.FRONT_SALE)
					activeService = new Variant();
				
				reload_see_list();				
			}
			
		});
				
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		list.setTextFilterEnabled(true);
		list.setOnItemClickListener(this);
		
		content.addView(v);
		
		command = "customer";
		new TaskExecution().execute();
				
		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    			
	    
	    if (getData("msg", "").length() > 0 && !getData("msg", "").equals(" ")) 
	    	msgDialog();
	}
	
	public void msgDialog() {
		if (showMsg) return;
		showMsg = true;
		AlertDialog alertDialog = new AlertDialog.Builder(this).create();		
		alertDialog.setTitle("Захиа ирсэн байна");
		alertDialog.setMessage(getData("msg", ""));
		alertDialog.setIcon(R.drawable.success);	
		alertDialog.setButton("OK", new DialogInterface.OnClickListener() {
		        @Override
				public void onClick(DialogInterface dialog, int which) {
		        	dialog.dismiss();
		        }
		});
	
		alertDialog.show();
	}
	
	public void unsuccess_service_list() {
		/*if (showMsg) return;
		showMsg = true;*/
		AlertDialog alertDialog = new AlertDialog.Builder(this).create();		
		
		Collection c = Shared.sql.selectAll("JsonList", "i,s,s", "id,table_name,json", null, null);
        for (int i = 0; i < c.size(); i++) {
        	Variant w = c.elementAt(i);
        	alertDialog.setMessage("Уг харилцагчийн хувьд "+w.size()+" мөр бичлэг илгээгдээгүй байна");
        	//Log.d("HAHAHAHA", w.get("json"));
        }
		
        if(c.size() > 0){
        	alertDialog.setTitle("Амжилтгүй захиалгууд");
        	//alertDialog.setIcon(R.drawable.success);	
    		alertDialog.setButton("Илгээх", new DialogInterface.OnClickListener() {
    		        @Override
    				public void onClick(DialogInterface dialog, int which) {
    		        	if(isOnline()){
    		        		command = "send_unsuccess_service";
        					new TaskExecution().execute();		        	
        		        	dialog.dismiss();
    		        	}else{
    		        		Toast.makeText(getApplicationContext(), "3G дата сүлжээгүй байна!", Toast.LENGTH_SHORT).show();
    		        	}
    		        }
    		});	
        }else{
        	alertDialog.setTitle("Амжилтгүй захиалгууд байхгүй байна");
        	//alertDialog.setIcon(R.drawable.success);	
    		alertDialog.setButton("Хаах", new DialogInterface.OnClickListener() {
    		        @Override
    				public void onClick(DialogInterface dialog, int which) {
    		        	dialog.dismiss();
    		        }
    		});
        }
		
	
		alertDialog.show();
	}
	
	public void updateDialog() {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Шинэ хувилбар гарсан тул татаж авна уу ?")
	    .setPositiveButton("Татах", new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	UpdateApp atualizaApp = new UpdateApp();
	            atualizaApp.setContext(getApplicationContext());
	            atualizaApp.execute("http://202.70.43.26:85/svn/apk/CRM.apk");
	        }
	     })
	    .setNegativeButton("Болих", new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();		
	}
	
	public View contactItem(Variant q) {
		View v = getLayoutInflater().inflate(R.layout.contact, null);
				
		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(q.getString("firstname")+" "+q.getString("lastname"));
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText(q.getString("job_title")+" at "+q.getString("title"));
		
		EditText notes = (EditText)v.findViewById(R.id.notes);
		notes.setText(q.getString("descr"));
		
		final Collection contacts = new Collection();
		Variant w = new Variant();
		w.put("caption", "Cellphone");
		w.put("value", q.getString("phone"));		
		contacts.addCollection(w);
		
		w = new Variant(); 
		w.put("caption", "Telephone");
		w.put("value", q.getString("phone1"));		
		contacts.addCollection(w);
		
		w = new Variant();
		w.put("caption", "Email");
		w.put("value", q.getString("email"));		
		contacts.addCollection(w);		
		
		ListView contact = (ListView)v.findViewById(R.id.contact);		
		contact.setVerticalFadingEdgeEnabled(false);
		contact.setTag("contact");
		contact.setAdapter(new ContactAdapter(this, R.layout.list_item, contacts));
		contact.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {		
				if (contacts.elementAt(pos).getString("caption").equals("Telephone")) {
					
				} else
				if (contacts.elementAt(pos).getString("caption").equals("Cellphone")) {
					
				} else
				if (contacts.elementAt(pos).getString("caption").equals("Email")) {
					
				}
			}
			
		});
		
		return v;
	}
	
	public void deal_list() {		
		activity = "deal";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.deal_list, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 deal(s)");
		texts.put("deal_count", contactDescr);
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		
		content.addView(v);
		
		command = "deal_list";
		new TaskExecution().execute();

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
		
	@Override
	public void customer_adddialog() {
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.customer_dialog);	
		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});						
		
		final Collection commands = new Collection();				
		Variant w = new Variant();
		w.put("caption", "Илгээх");
		commands.addCollection(w);								
		
		final EditText firstName = (EditText)dialog.findViewById(R.id.firstName);
		final EditText phone = (EditText)dialog.findViewById(R.id.phone);
		final EditText address = (EditText)dialog.findViewById(R.id.address);
		final EditText descr = (EditText)dialog.findViewById(R.id.descr);
		descr.setText(activeRoute);		
		descr.setEnabled(false);
		
		ListView command_list = (ListView)dialog.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {								
				if (commands.elementAt(pos).getString("caption").equals("Илгээх")) {
					getGPS();
					sendCRM = new Variant();
					sendCRM.put("level", "s"+"prospect");
					sendCRM.put("_class", "s"+"SME");					
					sendCRM.put("customer_type", "i1");
					sendCRM.put("owner", "s"+logged);
					sendCRM.put("userCode", "s"+logged);
					sendCRM.put("lat", "f"+lat);
					sendCRM.put("lng", "f"+lng);
					sendCRM.put("firstName", "s"+firstName.getText().toString());
					sendCRM.put("pricetag", "sprice1");
					sendCRM.put("phone", "s"+phone.getText().toString());
					sendCRM.put("address", "s"+address.getText().toString());
					sendCRM.put("descr", "s"+descr.getText().toString());
					
					command = "send_customer";
					new TaskExecution().execute();
					dialog.dismiss();
				}
			}
			
		});
		
		dialog.show();
	}
	
	public float getPrice(String tag, Variant item) {
		if (customPriceTag.length() > 0)
			return item.getFloat(customPriceTag);
		
		return item.getFloat(tag);
	}
	
	public String getPriceTitle() {
		return priceTitles[customPriceIndex];
	}
	
	public void saveZarsanValue(int value) {
		Shared.sql.deleteWhere("Zarsan", "_date='"+today()+"' and crm_id="+activeCRM.getInt("crm_id")+" and product_id="+activeProduct.getInt("product_id"));
		Variant v = new Variant();
		v.put("crm_id", "i"+activeCRM.getInt("crm_id"));
		v.put("product_id", "i"+activeProduct.getInt("product_id"));
		v.put("value", "i"+value);
		v.put("_date", "s"+today());
		Shared.sql.insertVariant("Zarsan", v, "i,i,i,s", "crm_id,product_id,value,_date");				
	}
	
	public int saveTollogoValue(int value) {
		Shared.sql.deleteWhere("Toollogo", "_date='"+today()+"' and crm_id="+activeCRM.getInt("crm_id")+" and product_id="+activeProduct.getInt("product_id"));
		Variant v = new Variant();
		v.put("crm_id", "i"+activeCRM.getInt("crm_id"));
		v.put("product_id", "i"+activeProduct.getInt("product_id"));
		v.put("value", "i"+value);
		v.put("_date", "s"+today());
		Shared.sql.insertVariant("Toollogo", v, "i,i,i,s", "crm_id,product_id,value,_date");
		
		int last_toollogo = 0, zarsan_value = 0;
		Collection last_collection = Shared.sql.selectAll("Toollogo", "i", "value", "_date<'"+today()+"' and crm_id="+activeCRM.getInt("crm_id")+" and product_id="+activeProduct.getInt("product_id"), "_date desc");
		if (last_collection.size() > 0)
			last_toollogo = last_collection.elementAt(0).getInt("value");
		
		Collection zarsan_collection = Shared.sql.selectAll("Zarsan", "i", "value", "_date<'"+today()+"' and crm_id="+activeCRM.getInt("crm_id")+" and product_id="+activeProduct.getInt("product_id"), "_date desc");
		if (zarsan_collection.size() > 0)
			zarsan_value = zarsan_collection.elementAt(0).getInt("value");
				
		double d = (last_toollogo+zarsan_value-value)*1.5;
		if (d > 0)
			return (int)Math.floor(d);
		
		return 0;
	}
	
	public void product_list() {
		customPriceTag = "";
		customPriceIndex = 1;
		if (activeProduct.getFloat(activeCRM.getString("pricetag")) == 0) {
			Toast.makeText(getApplicationContext(), "Та уг барааг борлуулах боломжгүй байна !", Toast.LENGTH_SHORT).show();
			return;
		}
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.product_dialog);		
		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
				
		TextView name = (TextView)dialog.findViewById(R.id.name);
		name.setText(activeProduct.getString("product_name"));
		
		TextView brand = (TextView)dialog.findViewById(R.id.brand);
		brand.setText(product_detail_title+activeProduct.getString(product_detail));
		
		final TextView price = (TextView)dialog.findViewById(R.id.price);		
		price.setText(money(activeProduct.getFloat(activeCRM.getString("pricetag"))));
		ImageView icon = (ImageView)dialog.findViewById(R.id.icon);
        //icon.setImageDrawable(loadDataFromAsset(activeProduct));
		loadDataFromAsset(activeProduct, icon);
		
		if (PRICE_CHOOSEN) {
			LinearLayout price_choose = (LinearLayout)dialog.findViewById(R.id.price_choosen);
			price_choose.setVisibility(View.VISIBLE);
			
			final Button price_button = (Button)dialog.findViewById(R.id.pricetag);
			price_button.setText(getPriceTitle());
			price_button.setOnClickListener(new OnClickListener() {

				@Override
				public void onClick(View v) {
					boolean b = false;
					for (int i = customPriceIndex+1; i <= 10; i++) {
						if (activeProduct.getFloat("price"+i) > 0) {
							customPriceTag = "price"+i;
							customPriceIndex = i;							
							b = true;
							break;
						}
					}				
					
					if (!b) {
						customPriceTag = "price1";
						customPriceIndex = 1;
					}
					price_button.setText(getPriceTitle());
					price.setText(money(getPrice(activeCRM.getString("pricetag"), activeProduct)));					
				}				
			});
		}
		
		final Collection commands = new Collection();
		
		if (Shared.FRONT_SALE && !self_order) {
			if (BELEN_ZEEL) {
				Variant w = new Variant();
				if(activity.equals("add_return")){
					w.put("caption", "Оруулах");
					commands.addCollection(w);
				} else {
					w.put("caption", "Бэлнээр");
					commands.addCollection(w);
					
					w = new Variant();
					w.put("caption", "Зээлээр");
					commands.addCollection(w);
				}
				w = new Variant();
				w.put("caption", "Цэвэрлэх");
				commands.addCollection(w);
			} else {
				Variant w = new Variant();
				w.put("caption", "Нэмэх");
				commands.addCollection(w);							
				
				w = new Variant();
				w.put("caption", "Цэвэрлэх");
				commands.addCollection(w);
			}
		} else {
			Variant w = new Variant();
			w.put("caption", "Оруулах");
			commands.addCollection(w);		
			
			w = new Variant();
			w.put("caption", "Цэвэрлэх");
			commands.addCollection(w);
		}
		
		String sort = "warehouse_id asc";
		if (logged.indexOf("battrade") != -1) {
			sort = "warehouse_id desc";
		}
		Collection warehouse_collection = Shared.sql.selectAll("WareHouse", "i,s", "warehouse_id,name", "warehouse_id="+activeProduct.getInt("warehouse_id"), sort);
		final EditText warehouse = (EditText)dialog.findViewById(R.id.warehouse);
		if (warehouse_collection.size() > 0) {
			if (Shared.FRONT_SALE && !self_order)
				warehouse.setText("Өөрөөсөө");
			else {
				if (SHOW_STORAGE_HAMAAGUI) {
					warehouse_collection = Shared.sql.selectAll("WareHouse", "i,s", "warehouse_id,name", "warehouse_id="+activeWare, "warehouse_id asc");
					warehouse.setText(warehouse_collection.elementAt(0).getString("name"));
				}
				else
					if(ONLY_BOSA_TWO_WARE){
						warehouse_collection = Shared.sql.selectAll("WareHouse", "i,s", "warehouse_id,name", "warehouse_id="+activeWare, sort);
						warehouse.setText(warehouse_collection.elementAt(0).getString("name"));
					}
					else
						warehouse.setText(warehouse_collection.elementAt(0).getString("name"));
			}
		}
		else
			warehouse.setBackgroundDrawable(getResources().getDrawable(R.drawable.red_state));
		
		final EditText amount = (EditText)dialog.findViewById(R.id.amount);
		final EditText qty1 = (EditText)dialog.findViewById(R.id.qty1);
		final EditText qty2 = (EditText)dialog.findViewById(R.id.qty2);
		final EditText toollogo = (EditText)dialog.findViewById(R.id.toollogo);
		qty1.selectAll();
						
		qty1.addTextChangedListener(new TextWatcher(){
		    @Override
			public void afterTextChanged(Editable s) {
		    	String value = qty1.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";					
				}
				
				valueFloat = Float.parseFloat(value);	
				if (!qty2.isFocused())
					qty2.setText(Float.toString(valueFloat/activeProduct.getFloat("unit_size")));							
				amount.setText(money(valueFloat * getPrice(activeCRM.getString("pricetag"), activeProduct)));								
		    }
		    @Override
			public void beforeTextChanged(CharSequence s, int start, int count, int after){}
		    @Override
			public void onTextChanged(CharSequence s, int start, int before, int count){		    	
		    	
		    }
		}); 	
						
		qty2.addTextChangedListener(new TextWatcher(){
		    @Override
			public void afterTextChanged(Editable s) {
		    	
		    }
		    @Override
			public void beforeTextChanged(CharSequence s, int start, int count, int after){}
		    @Override
			public void onTextChanged(CharSequence s, int start, int before, int count){		    	
		    	String value = qty2.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				if (!qty1.isFocused() && !toollogo.isFocused())
					qty1.setText(valueFloat * activeProduct.getFloat("unit_size")+"");
				amount.setText(money(valueFloat * activeProduct.getFloat("unit_size") * getPrice(activeCRM.getString("pricetag"), activeProduct)));
		    }
		});
		
		toollogo.addTextChangedListener(new TextWatcher(){
		    @Override
			public void afterTextChanged(Editable s) {
		    	String value = toollogo.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";					
				}
				
				valueFloat = Float.parseFloat(value);	
				if (!qty1.isFocused())
					qty1.setText(saveTollogoValue((int)valueFloat)+"");								
		    }
		    @Override
			public void beforeTextChanged(CharSequence s, int start, int count, int after){}
		    @Override
			public void onTextChanged(CharSequence s, int start, int before, int count){		    	
		    	
		    }
		});
		
		if (activeProduct.getFloat("unit_size") == 1) {			
			TextView shirheg = (TextView)dialog.findViewById(R.id.shirheg);
			shirheg.setText("Тоо");
			LinearLayout hairtsag = (LinearLayout)dialog.findViewById(R.id.hairtsag_layout);
			hairtsag.setVisibility(View.GONE);
		}				
		
		Button add = (Button)dialog.findViewById(R.id.add_);
		add.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				qty1.requestFocus();
				String value = qty1.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				valueFloat++;
				qty1.setText(Float.toString(valueFloat));						
				//qty2.setText(Float.toString(valueFloat/activeProduct.getFloat("unit_size")));
				amount.setText(money(valueFloat * getPrice(activeCRM.getString("pricetag"), activeProduct)));
			}
			
		});
		
		Button sub = (Button)dialog.findViewById(R.id.sub_);
		sub.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				qty1.requestFocus();
				String value = qty1.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				valueFloat--;
				if (valueFloat < 0) valueFloat = 0;
				qty1.setText(Float.toString(valueFloat));
				//qty2.setText(Float.toString(valueFloat/activeProduct.getFloat("unit_size")));
				amount.setText(money(valueFloat * getPrice(activeCRM.getString("pricetag"), activeProduct)));
			}
		});
							
		
		Button add2 = (Button)dialog.findViewById(R.id.add1_);
		add2.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				qty2.requestFocus();
				String value = qty2.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				valueFloat = (int)valueFloat;
				valueFloat++;
				qty2.setText(Float.toString(valueFloat));	
				amount.setText(money(valueFloat * activeProduct.getFloat("unit_size") * getPrice(activeCRM.getString("pricetag"), activeProduct)));
			}
		});
		
		Button sub2 = (Button)dialog.findViewById(R.id.sub1_);
		sub2.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				qty2.requestFocus();
				String value = qty2.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				valueFloat = (int)valueFloat;
				valueFloat--;
				if (valueFloat < 0) valueFloat = 0;
				qty2.setText(Float.toString(valueFloat));	
				amount.setText(money(valueFloat * activeProduct.getFloat("unit_size") * getPrice(activeCRM.getString("pricetag"), activeProduct)));
			}
		});
		
		Button addToollogo = (Button)dialog.findViewById(R.id.addToollogo);
		addToollogo.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				toollogo.requestFocus();
				String value = toollogo.getText().toString();
				float valueFloat = 0;
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				valueFloat++;
				toollogo.setText(Float.toString(valueFloat));
				//qty1.setText(saveTollogoValue((int)valueFloat)+"");				
			}
			
		});
		
		Button subToollogo = (Button)dialog.findViewById(R.id.subToollogo);
		subToollogo.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				toollogo.requestFocus();
				String value = toollogo.getText().toString();
				float valueFloat = 0;   
				if (value.length() == 0) {
					value = "0";
				}
				
				valueFloat = Float.parseFloat(value);
				valueFloat--;
				if (valueFloat < 0) valueFloat = 0;
				toollogo.setText(Float.toString(valueFloat));
				//qty1.setText(saveTollogoValue((int)valueFloat)+"");
			}
		});
		
		ListView command_list = (ListView)dialog.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				if (warehouse.getText().toString().length() == 0) {
					
					return;
				}
				String value = qty1.getText().toString();
				String value1 = qty2.getText().toString();
				if (value.length() == 0) value = "0";
				if (value1.length() == 0) value1 = "0";							
				if (commands.elementAt(pos).getString("caption").equals("Бэлнээр")) {
					float qty = Float.parseFloat(value);
					float pty = Float.parseFloat(value1);
					saveZarsanValue((int)qty);
					addproduct_toservice(qty, pty, getPrice(activeCRM.getString("pricetag"), activeProduct), "cash");
					product_adapter.notifyDataSetChanged();					
					dialog.dismiss();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Зээлээр")) {				
					float qty = Float.parseFloat(value);
					float pty = Float.parseFloat(value1);
					saveZarsanValue((int)qty);
					addproduct_toservice(qty, pty, getPrice(activeCRM.getString("pricetag"), activeProduct), "loan");
					product_adapter.notifyDataSetChanged();					
					dialog.dismiss();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Нэмэх")) {				
					float qty = Float.parseFloat(value);
					float pty = Float.parseFloat(value1);
					addproduct_toservice(qty, pty, getPrice(activeCRM.getString("pricetag"), activeProduct), "loan");
					product_adapter.notifyDataSetChanged();					
					dialog.dismiss();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Оруулах")) {
					float qty = Float.parseFloat(value);
					float pty = Float.parseFloat(value1);
					 String val = "last";
	                    if (MainActivity.this.ONLY_BOSA_TWO_WARE && MainActivity.this.activeWare.equals("2")) {
	                        val = "last1";
	                    }
	                    if (MainActivity.this.ONLY_BOSA_TWO_WARE && MainActivity.this.activeWare.equals("3")) {
	                        val = "last2";
	                    }
					float last =  filter_collection.queryInt("product_id", activeProduct.getInt("product_id")).getFloat(val);
					if (last < qty && filter_collection.size() > 0) {
						Toast.makeText(getApplicationContext(), "Агуулахын үлдэгдэл хүрэлцэхгүй !", Toast.LENGTH_SHORT).show();
					} else {
						addproduct_toservice(qty, pty, getPrice(activeCRM.getString("pricetag"), activeProduct), "loan");
						if (PRODUCT_GROUP)
							product_grouped_adapter.notifyDataSetChanged();
						else
							product_adapter.notifyDataSetChanged();
						dialog.dismiss();
					}					
				} else
				if (commands.elementAt(pos).getString("caption").equals("Цэвэрлэх")) {
					qty1.setText(Float.parseFloat("0")+"");
					qty2.setText(Float.parseFloat("0")+"");
					toollogo.setText(Float.parseFloat("0")+"");
				}
			}
			
		});
		
		dialog.show();
	}
	
	@Override
	public void onPause() {
		super.onPause();
		if (cameraObject != null)
			cameraObject.release();
	}
	
	public static Camera isCameraAvailiable(){
	      Camera object = null;
	      try {
	         object = Camera.open(); 
	      }
	      catch (Exception e){
	      }
	      return object; 
    }
	
	public void image() {
		activity = "image";
		setToolbarItems("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();												
		
		View v = getLayoutInflater().inflate(R.layout.image, null);
		
		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText(activeCRM.getString("address"));								
		
		final LinearLayout camera = (LinearLayout)v.findViewById(R.id.camera);	
		final ImageView image = (ImageView)v.findViewById(R.id.image);
		
		Button upload_image = (Button)v.findViewById(R.id.upload_image);
		upload_image.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				send_image(index);
			}
		});
		
		
	    Button send_image = (Button)v.findViewById(R.id.send_image);
		send_image.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				camera_shot(camera);
			}
		});
		
		Button next = (Button)v.findViewById(R.id.next);
		next.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {				
				index = viewImage(index+1, camera);				
			}
		});
		
		Button delete = (Button)v.findViewById(R.id.delete);
		delete.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				deleteImage(index);
				index = viewImage(index, camera);
			}
		});
		
		
		Button prev = (Button)v.findViewById(R.id.prev);
		prev.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				index = viewImage(index-1, camera);
			}
		});
		
		index = viewImage(index, camera);
		content.addView(v);
				
		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);
	}
	
	public void deleteImage(int id) {				
		File pictureFileDir = getDir(activeCRM);
	    String filename = pictureFileDir.getPath() + File.separator ;
	    	        	
    	File dirs= new File(filename);
    	if(dirs.exists()) {
    	    File[] files = dirs.listFiles();	 
    	    if (files.length > id && files[id].exists())
    	    	files[id].delete();
    	}    	    	
	}
	
	public int viewImage(int id, LinearLayout camera) {
		if (cameraReady) cameraObject.release();
		cameraReady = false;
		camera.removeAllViews();
		File pictureFileDir = getDir(activeCRM);
	    String filename = pictureFileDir.getPath() + File.separator ;
	    	        	
    	File dirs= new File(filename);
    	if(dirs.exists()) {
    	    File[] files = dirs.listFiles();	 
    	    if (id < 0) id = 0;
    	    if (id >= files.length) id = 0;
    	    if (files.length > id && id >= 0) {
	    	    Bitmap bitmap = BitmapFactory.decodeFile(files[id].getAbsolutePath());
	    	    ImageView image = new ImageView(this);
	    	    image.setImageBitmap(bitmap);	        	
	    	    //image.setRotation(90);
	    	    camera.addView(image);
    	    } else {
    	    	ImageView image = new ImageView(this);
	    	    image.setImageBitmap(null);	        	
	    	    //image.setRotation(90);
	    	    camera.addView(image);
    	    }
    	}
    	
    	return id;
	}
	
	public void send_image(int id) {		
		File pictureFileDir = getDir(activeCRM);
	    String filename = pictureFileDir.getPath() + File.separator ;
	    	        	
    	File dirs= new File(filename);
    	if(dirs.exists()) {
    	    File[] files = dirs.listFiles();	 
    	    if (id < 0) id = 0;
    	    if (id >= files.length) id = 0;
    	    if (files.length > id && id >= 0) {
	    	    Bitmap bitmap = BitmapFactory.decodeFile(files[id].getAbsolutePath());
	    	    uploadFile(files[id], files[id].getAbsolutePath(), filename);
    	    } else {
    	    	
    	    }
    	}
	}
		
	public void camera_shot(LinearLayout camera) {
		if (!cameraReady) {
			camera.removeAllViews();
			if (cameraReady) cameraObject.release();
			cameraObject = isCameraAvailiable();
			Camera.Parameters parameters = cameraObject.getParameters();
			parameters.set("orientation", "landscape");
			parameters.set("rotation", 90);
			parameters.setJpegQuality(70);
			parameters.set("jpeg-quality", 70);
			parameters.setPictureFormat(PixelFormat.JPEG);			
			
			cameraObject.setDisplayOrientation(90);
			cameraObject.setParameters(parameters);
		    showCamera = new ShowCamera(this, cameraObject);
		    camera.addView(showCamera);
		    cameraReady = true; 
		} else
			cameraObject.takePicture(null, null, new PhotoHandler(getApplicationContext(), activeCRM, service));
	}
		
	double[] last = new double[2];
	public void gps_tracker() {
		locationService = new LocationService(this);
		if (timerRunnable != null) timerHandler.removeCallbacks(timerRunnable);
		timerRunnable = new Runnable() {
	        @Override
	        public void run() {        
	        	getGPS();
	        	Log.d("D", "loc "+lat+" "+lng);
	        	Location o_l = locationService.getLocation(LocationManager.GPS_PROVIDER);
	        	if (o_l != null) {
	        		lat = o_l.getLatitude();
	        		lng = o_l.getLongitude();
	        	}
	        		
	        	if (workingTime() && last[0] != lat && last[1] != lng) {
        			last[0] = lat;
        			last[1] = lng;
        			Log.d("D", "loc "+lat+" "+lng);
	        		Variant w = new Variant();
	        		w.put("owner", "s"+(logged.length() > 0 ? logged : getData("logged", "")));
	        		w.put("lat", "f"+lat);
	        		w.put("lng", "f"+lng);
	        		w.put("crm_id", "i"+activeCRM.getInt("crm_id"));
	        		w.put("battery", "i"+Shared.batteryLevel);
	        		XMLParser parser = new XMLParser();
	    			parser.getXmlToUrl(getURL(), "crm_gps", w.json(""), 0);
	        	}	        	
				timerHandler.postDelayed(timerRunnable, GPS_INTERVAL*60*1000);
	        }
	    };
	    timerHandler.postDelayed(timerRunnable, GPS_INTERVAL*60*1000);
	}
	
	public boolean cameraReady = false;
	private int index = 0;
	private Camera cameraObject;
	private ShowCamera showCamera;
	private GoogleMap map = null;
	public Handler timerHandler = new Handler();
	public Runnable timerRunnable;
	public View mapView;
	
	public void map() {
		activity = "map";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();
		
		if (mapView == null)
			mapView = getLayoutInflater().inflate(R.layout.map, null);											
	
		TextView contactName = (TextView)mapView.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		
		TextView contactDescr = (TextView)mapView.findViewById(R.id.contactDescr);
		contactDescr.setText(activeCRM.getString("address")+" ("+activeCRM.getFloat("lat")+","+activeCRM.getFloat("lng")+")");
		
				
		Button send_loc = (Button)mapView.findViewById(R.id.send_loc);
		send_loc.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				try{
					Variant w = new Variant();
					w.put("lat", "f"+map.getMyLocation().getLatitude());
					w.put("lng", "f"+map.getMyLocation().getLongitude());
					activeCRM.put("lat", "f"+map.getMyLocation().getLatitude());
					activeCRM.put("lng", "f"+map.getMyLocation().getLongitude());
					Shared.sql.updateFloat("Customer", w, "lat,lng", "crm_id="+activeCRM.getInt("crm_id"));
					
					map.clear();        	
		        	MarkerOptions marker = new MarkerOptions()        	
					  .position(new LatLng(activeCRM.getFloat("lat"), activeCRM.getFloat("lng")))
					  .title(activeCRM.getString("firstname"))						
					  .flat(true)
					  .snippet("");
									
					marker.icon(BitmapDescriptorFactory.fromResource(R.drawable.marker));
					marker.anchor(0.5f, 0.5f);			
					map.addMarker(marker);
									
					command = "send_location";
					new TaskExecution().execute();
				}catch(Exception e) {
					Toast.makeText(getApplicationContext(), "Байршил олдоогүй байна! Байршил олох товч дарна уу!", Toast.LENGTH_SHORT).show();
		    	}	
			}
			
		});		
				
		try {
			if (map == null) {			
				SupportMapFragment mMapFragment = ((SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map));
				map = mMapFragment.getMap();
			}
    		
    		map.setMyLocationEnabled(true);	
    		map.getUiSettings().setMyLocationButtonEnabled(true);
    		map.getUiSettings().setScrollGesturesEnabled(true);
    		map.getUiSettings().setTiltGesturesEnabled(true);
    		map.getUiSettings().setRotateGesturesEnabled(true);
    		map.setTrafficEnabled(true);			
    		map.setMapType(GoogleMap.MAP_TYPE_SATELLITE);
    		map.setIndoorEnabled(true);
    		
    		LatLng latlng = new LatLng(47.918515f, 106.917643f); 			
    		CameraUpdate cu=CameraUpdateFactory.newLatLngZoom(latlng, 12);			        	
        	map.moveCamera(cu);
        	
        	map.clear();        	
        	MarkerOptions marker = new MarkerOptions()        	
			  .position(new LatLng(activeCRM.getFloat("lat"), activeCRM.getFloat("lng")))
			  .title(activeCRM.getString("firstname"))						
			  .flat(true)
			  .snippet("");
							
			marker.icon(BitmapDescriptorFactory.fromResource(R.drawable.marker));
			marker.anchor(0.5f, 0.5f);			
			map.addMarker(marker);						        
            
    	} catch (Exception e) {
    		
    	}	
						
		content.addView(mapView);
				
		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    mapView.setAnimation(fadeIn);
	}
	
	public boolean discount_if() {
		if (logged.indexOf("cosmo") != -1) {
			return ((activeCRM.getString("pricetag").equals("price1") || 
					 activeCRM.getString("pricetag").equals("price3") || 
					 activeCRM.getString("pricetag").equals("price10") ||
					 activeCRM.getString("pricetag").equals("price2") || 
					 activeCRM.getString("pricetag").equals("price4")) && 
					 !activeCRM.getString("_class").equals("AGENT"));
		}
		
		return false;
	}
	
	public void padaan_list() {//delguur deer shuud padaan hevleh
		if (service_product_list.size() == 0) {
			Toast.makeText(getApplicationContext(), "Бараа оруулаагүй байна !", Toast.LENGTH_SHORT).show();
			return;
		}
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.padaan_dialog);		
		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
				
		TextView contactName = (TextView)dialog.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname")+" "+activeCRM.getString("lastname"));
		
		final EditText date = (EditText)dialog.findViewById(R.id.date);
		date.setText(getTomorrow());
		date.setVisibility(Shared.FRONT_SALE?View.GONE:View.VISIBLE);
		date.setEnabled(false);
		date.setFocusable(false);
		edits.put("closing_date", date);
		
		this.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
		
		final EditText phone = (EditText)dialog.findViewById(R.id.phone);		
		phone.setText(activeCRM.getString("phone"));			
		phone.clearFocus();
		
		final EditText registrNo = (EditText)dialog.findViewById(R.id.registrNo);
		registrNo.setText(activeCRM.getString("regno"));			
		registrNo.clearFocus();
		
		if (activeCRM.getString("phone").length() < 5) phone.setText("empty");								
		
		//dialog.findViewById(R.id.line0).setVisibility(Shared.FRONT_SALE?View.GONE:View.VISIBLE);
		dialog.findViewById(R.id.line1).setVisibility(Shared.FRONT_SALE?View.GONE:View.VISIBLE);
		
		Button calendar = (Button)dialog.findViewById(R.id.calendar);
		calendar.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				showDialog(DATE_DIALOG_ID);
			}
			
		});
		
		double total = 0;
		for (int i = 0; i < service_product_list.size(); i++) {
			Variant q = service_product_list.elementAt(i);
			total += q.getFloat("qty")*q.getFloat("price");
		}
		
		TextView contactDescr = (TextView)dialog.findViewById(R.id.contactDescr);
		contactDescr.setText(service_product_list.size()+" бараа, "+money(total));				
		
		padaan_row_line = padaan_row_line_en = "";
		
		final TextView padaan_rows = (TextView)dialog.findViewById(R.id.padaan_rows);
		float chrWidth = padaan_rows.getPaint().measureText("0");
		int column = (int)((width-(convertPixelsToDp(40, this))) / chrWidth);
		
		int c1 = 20;
		int c2 = 6;
		int c3 = 10;
		int c4 = 13;
		int c5 = 3;
		
		padaan_row_line += fillLeft(c1, "Барааны нэр")+fillRight(c2, "Тоо")+fillRight(c3, "Үнэ")+fillRight(c4, "Дүн")+"\n";
		padaan_row_line += fillLine(c1+c2+c3+c4, "-")+"\n";
		
		padaan_row_line_box += fillLeft(c1, "Барааны нэр")+fillRight(c2, "Тоо")+fillRight(c3, "Үнэ")+fillRight(c4, "Дүн")+"\n";
		padaan_row_line_box += fillLine(c1+c2+c3+c4, "-")+"\n";
		
		if (PRINT_BY_COLUMN) {
			padaan_row_line_en = "\n";
			padaan_row_line_en += fillLeft(c1+c2, COMPANY)+fillRight(c3+c4-printer_width[printer_index][5], Shared.convertToLatin(activeCRM.get("firstname")))+"\n";
			padaan_row_line_en += fillLeft(c1+c2, convertDateTimeToString())+fillRight(c3+c4-printer_width[printer_index][5], "P: "+service.getString("subject"))+"\n";
			padaan_row_line_en += "\n";
		} else {
			padaan_row_line_en = "\n"+COMPANY+"\n";
			padaan_row_line_en+= logged+" "+getData("phone", "")+"\n";
			padaan_row_line_en+= convertDateTimeToString()+"\n";
			padaan_row_line_en+= Shared.convertToLatin(activeCRM.get("firstname"))+"\n\n";
		}
		
		
		if (PRINT_BY_COLUMN) {
			padaan_row_line_en += fillLeft((c1-printer_width[printer_index][0]), "Baraa")+fillRight(c2-printer_width[printer_index][1], "Too")+fillRight(c3-printer_width[printer_index][2], "Negj/une")+fillRight(c4-printer_width[printer_index][3], "Niit")+fillRight(c5-printer_width[printer_index][8], "%")+"\n";
			padaan_row_line_en += fillLine(c1+c2+c3+c4+c5-printer_width[printer_index][4]+4, "-")+"\n";
			
			double sum = 0, sum_cash = 0, discount = 0, dt = 0;
			for (int i = 0; i < service_product_list.size(); i++) {
				Variant w = service_product_list.elementAt(i);
				String p_name = w.getString("product_name");
				String loan = "";
				float unit_size = 0;
				if (w.getString("type").equals("loan")) loan = "";
				Collection col = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "product_id="+w.getInt("product_id"), product_sort_field+" asc");
				if (col.size() > 0) {
					if (SHORT_PRODUCT_NAME && !col.elementAt(0).getString("company").equals("company")) 
						p_name = col.elementAt(0).getString("product_code")+" "+col.elementAt(0).getString("company")+loan;
					else
						p_name = w.getString("product_code")+" "+w.getString("product_name")+loan;
					
					unit_size = col.elementAt(0).getFloat("unit_size");
					dt = col.elementAt(0).getFloat("discount");
					if (unit_size == 0) unit_size = 1;
					if (PRODUCT_BUR_DISCOUNT_AVAILABLE && discount_if())
						discount += w.getFloat("qty") * w.getFloat("price") * col.elementAt(0).getFloat("discount") / 100;
				}
				else
					p_name = w.getString("product_code")+" "+w.getString("product_name")+loan;
							
				padaan_row_line += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+
								   fillRight(c2, number(w.getFloat("qty")/1))+
								   fillRight(c3, money_(w.getFloat("price")))+
								   fillRight(c4, money_(w.getFloat("amount")))+"\n";
				
				padaan_row_line_box += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+
						   		   fillRight(c2, number(w.getFloat("qty")/unit_size))+
						   		   fillRight(c3, money_(w.getFloat("price")))+
						   		   fillRight(c4, money_(w.getFloat("amount")))+"\n";
				
				p_name = Shared.convertToLatin(p_name);
				
				padaan_row_line_en += fillLeft(c1-printer_width[printer_index][0], p_name.substring(0, Math.min(p_name.length(), printer_width[printer_index][6])))+
									  fillRight(c2-printer_width[printer_index][1], number_1(w.getFloat("qty")/unit_size))+
									  fillRight(c3-printer_width[printer_index][2], money_2(w.getFloat("price")))+
									  fillRight(c4-printer_width[printer_index][3], money_2(w.getFloat("amount")))+
									  fillRight(c5-printer_width[printer_index][8], number_2(dt))+"\n";
				
				sum += w.getFloat("qty") * w.getFloat("price");
				if (w.getString("type").equals("cash"))
					sum_cash += w.getFloat("qty") * w.getFloat("price");			
			}
			padaan_row_line += fillLine(c1+c2+c3+c4, "-")+"\n";
			padaan_row_line += fillLeft(c1+c2, "Нийт")+fillRight(c3+c4, money(sum))+"\n";
			
			padaan_row_line_box += fillLine(c1+c2+c3+c4, "-")+"\n";
			padaan_row_line_box += fillLeft(c1+c2, "Нийт")+fillRight(c3+c4, money(sum))+"\n";
			
			if (discount > 0) {		
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт")+fillRight(c3+c4, money(discount))+"\n";
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт хассан")+fillRight(c3+c4, money(sum-discount))+"\n";
				
				padaan_row_line_box += fillLeft(c1+c2, "Хөнгөлөлт")+fillRight(c3+c4, money(discount))+"\n";
				padaan_row_line_box += fillLeft(c1+c2, "Хөнгөлөлт хассан")+fillRight(c3+c4, money(sum-discount))+"\n";
			}
			
			padaan_row_line_en += fillLine(c1+c2+c3+c4+c5-printer_width[printer_index][4]+4, "-")+"\n";
			padaan_row_line_en += "!";
			padaan_row_line_en += fillRight(c1+c2-printer_width[printer_index][5]+c3+c4+2, "Niit dun :  "+money_3(sum))+"\n";
			if (discount > 0) {
				padaan_row_line_en += fillRight(c1+c2-printer_width[printer_index][5]+c3+c4+2, "Xungulult :  "+money_3(discount))+"\n";
				padaan_row_line_en += fillRight(c1+c2-printer_width[printer_index][5]+c3+c4+2, "Xungulult xassan :  "+money_3(sum-discount))+"\n";
				
				//padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Xungulult xassan")+fillRight(c3+c4, money_3(sum-discount))+"\n";
			}
			padaan_row_line_en += "!";
			
			padaan_row_line_en += "\n";
		
			if (Shared.FRONT_SALE && PADAAN_SUMMARY_ADDITIONAL) {
				padaan_row_line += fillLeft(c1+c2, "Бэлнээр")+fillRight(c3+c4, money(sum_cash))+"\n";
				if (sum > sum_cash)
					padaan_row_line += fillLeft(c1+c2, "Зээлээр")+fillRight(c3+c4, money(sum-sum_cash))+"\n";					
				padaan_row_line += fillLeft(c1+c2, "Tulukh")+fillRight(c3+c4, money(sum_cash))+"\n";
				
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Belneer")+fillRight(c3+c4, money_3(sum_cash))+"\n";
				if (sum > sum_cash)			
					padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Zeeleer")+fillRight(c3+c4, money_3(sum-sum_cash))+"\n";
							
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Tulukh")+fillRight(c3+c4, money_3(sum_cash))+"\n";
			}
			
			//service.put("service_revenue", "f"+sum);	
			
			if (sum_cash == sum && Shared.FRONT_SALE) {
				service.put("service_stage", "sclosed");
			} else {
				if (Shared.FRONT_SALE && !self_order) {
					if(activity.equals("add_return")){
						service.put("service_stage", "sreturn");
					}else
					service.put("service_stage", "sservice");				
				}				
			}
		} else {
			padaan_row_line_en += fillLeft((c1-printer_width[printer_index][0]), "Baraa")+fillRight(c2-printer_width[printer_index][1], "Too")+fillRight(c3-printer_width[printer_index][2], "Une")+fillRight(c4-printer_width[printer_index][3], "Niit")+"\n";
			padaan_row_line_en += fillLine(c1+c2+c3+c4-printer_width[printer_index][4], "-")+"\n";
			
			double sum = 0, sum_cash = 0, discount = 0;
			for (int i = 0; i < service_product_list.size(); i++) {
				Variant w = service_product_list.elementAt(i);
				String p_name = w.getString("product_name");
				String loan = "";
				if (w.getString("type").equals("loan"))
					loan = "#";
				Collection col = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "product_id="+w.getInt("product_id"), product_sort_field+" asc");
				if (col.size() > 0) {
					if (SHORT_PRODUCT_NAME && !col.elementAt(0).getString("company").equals("company")) 
						p_name = col.elementAt(0).getString("company")+loan;
					else
						p_name = w.getString("product_name")+loan;
					
					if (PRODUCT_BUR_DISCOUNT_AVAILABLE && discount_if())
						discount += w.getFloat("qty") * w.getFloat("price") * col.elementAt(0).getFloat("discount") / 100;
				}
				else
					p_name = w.getString("product_name")+loan;
				
				padaan_row_line += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+fillRight(c2, number(w.getFloat("qty")))+fillRight(c3, money_(w.getFloat("price")))+fillRight(c4, money_(w.getFloat("amount")))+"\n";					
				p_name = Shared.convertToLatin(p_name);
				padaan_row_line_en += fillLeft(c1-printer_width[printer_index][0], p_name.substring(0, Math.min(p_name.length(), printer_width[printer_index][6])))+fillRight(c2-printer_width[printer_index][1], number_1(w.getFloat("qty")))+fillRight(c3-printer_width[printer_index][2], money_2(w.getFloat("price")))+fillRight(c4-printer_width[printer_index][3], money_2(w.getFloat("amount")))+"\n";
				
				sum += w.getFloat("qty") * w.getFloat("price");
				if (w.getString("type").equals("cash"))
					sum_cash += w.getFloat("qty") * w.getFloat("price");			
			}
			padaan_row_line += fillLine(c1+c2+c3+c4, "-")+"\n";
			padaan_row_line += fillLeft(c1+c2, "Нийт")+fillRight(c3+c4, money(sum))+"\n";
			
			if (discount > 0) {		
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт")+fillRight(c3+c4, money(discount))+"\n";
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт хассан")+fillRight(c3+c4, money(sum-discount))+"\n";
			}
			
			padaan_row_line_en += fillLine(c1+c2+c3+c4-printer_width[printer_index][4], "-")+"\n";		
			padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Niit dun")+fillRight(c3+c4, money_3(sum))+"\n";
			if (discount > 0) {
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Xungulult")+fillRight(c3+c4, money_3(discount))+"\n";
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Xungulult xassan")+fillRight(c3+c4, money_3(sum-discount))+"\n";
			}
			
			padaan_row_line_en += "\n";		
		
			if (Shared.FRONT_SALE && PADAAN_SUMMARY_ADDITIONAL) {
				padaan_row_line += fillLeft(c1+c2, "Бэлнээр")+fillRight(c3+c4, money(sum_cash))+"\n";
				if (sum > sum_cash)
					padaan_row_line += fillLeft(c1+c2, "Зээлээр")+fillRight(c3+c4, money(sum-sum_cash))+"\n";					
				padaan_row_line += fillLeft(c1+c2, "Tulukh")+fillRight(c3+c4, money(sum_cash))+"\n";
				
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Belneer")+fillRight(c3+c4, money_3(sum_cash))+"\n";
				if (sum > sum_cash)			
					padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Zeeleer")+fillRight(c3+c4, money_3(sum-sum_cash))+"\n";
							
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Tulukh")+fillRight(c3+c4, money_3(sum_cash))+"\n";
			}
			
			
			//service.put("service_revenue", "f"+sum);		
			if (sum_cash == sum && Shared.FRONT_SALE) {
				service.put("service_stage", "sclosed");
			} else {
				if (Shared.FRONT_SALE && !self_order) {
					if(activity.equals("add_return")){
						service.put("service_stage", "sreturn");
					}else
					service.put("service_stage", "sservice");				
				}				
			}
			
			padaan_row_line_box = padaan_row_line;
			
			try{
				outerMTAObject = new JSONObject();
				outerMTAArray = new JSONArray();
				innerMTAObject = new JSONObject();
				noat = money_4(sum/11)+"";
				nhat = money_4(sum*0.01)+"";
				outerMTAObject.put("amount", money_4(sum));
				outerMTAObject.put("vat", money_4(sum/11));
				outerMTAObject.put("cashAmount", money_4(sum_cash));
				outerMTAObject.put("nonCashAmount", money_4(sum-sum_cash));
				outerMTAObject.put("billIdSuffix", "");
				//outerMTAObject.put("cityTax", "0.00");
				outerMTAObject.put("bankTransactions", null);
				outerMTAObject.put("districtCode", "54");
				outerMTAObject.put("posNo", "000054");
				//outerMTAObject.put("billType", billType);
				//outerMTAObject.put("customerNo", activeCRM.getString("regno"));
				
				
				for (int i = 0; i < service_product_list.size(); i++) {
					Variant q = service_product_list.elementAt(i);
					total = q.getFloat("qty")*q.getFloat("price");
					
					innerMTAObject.put("code", q.get("product_code"));
					innerMTAObject.put("name", q.get("product_name"));
					innerMTAObject.put("qty", money_4(q.getFloat("qty")));
					innerMTAObject.put("unitPrice", money_4(q.getFloat("price")));
					innerMTAObject.put("measureUnit", "sh");
					innerMTAObject.put("totalAmount", money_4(total));
					innerMTAObject.put("vat", money_4(total/10));
					innerMTAObject.put("barCode", q.get("product_barcode"));
					innerMTAObject.put("cityTax", "0.00");
					outerMTAObject.put("stocks", outerMTAArray);
					outerMTAArray.put(innerMTAObject);
				}
					
				//Collection test_coll = parser.getCollection(this, getURL(), "ddtd,qrdata,result,date", "report", "crm_test_xml_list", "", outerMTAObject.toString());
				//Log.d("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ", test_coll.elementAt(0).get("qrdata"));
			}
			catch(Exception e){
			
			}
		}
		
		
		if (PRINT_BY_COLUMN) {
			padaan_row_line_en += "\n";
			padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "X/ugsun: /"+logged.split("@")[0]+"/")+fillRight(c3+c4+c5, "X/avsan: /            /")+"\n";
			padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "................")+fillRight(c3+c4, "..................")+"\n";																															 
			padaan_row_line_en += "\n\n\n\n\n";			
		} else {
			padaan_row_line_en += "\n";
			padaan_row_line_en += "X.avsan             "+".........."+"\n";
			padaan_row_line_en += "X.ugsun             "+".........."+"\n";
			padaan_row_line_en += "\n\n\n\n";
		}
		
		//String values = money_3(sum_cash);
		//Collection test_coll = parser.getCollection(this, getURL(), "ddtd,qrdata,result,date", "report", "crm_test_xml_list", "", activeCRM.getInt("crm_id")+","+todayValue);
		
		//padaan_rows.setTextSize(width > 720  ? 13:11);
		//padaan_rows.setTextSize(8);
		padaan_rows.setText(padaan_row_line);
		padaan_rows.requestFocus();
		padaan_rows.setClickable(true);
		padaan_rows.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				if (box_if)
					padaan_rows.setText(padaan_row_line);
				else
					padaan_rows.setText(padaan_row_line_box);
				
				box_if = !box_if;
			}
			
		});
		
		final Collection commands = new Collection();
		Variant w = new Variant();		
		w.put("caption", "Илгээх");
		commands.addCollection(w);
	
		w = new Variant();
		w.put("caption", "Илгээх + Хэвлэх");
		commands.addCollection(w);
		
		if(MTA){
			w = new Variant();		
			w.put("caption", "Илгээх + хэвлэх Сугалаатай");
			commands.addCollection(w);
		}
		
		ListView command_list = (ListView)dialog.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				if (commands.elementAt(pos).getString("caption").equals("Илгээх")) {
					try{
						outerMTAObject.put("billType", "3");
						outerMTAObject.put("cityTax", "0.00");
						nhat= "0.00";
						Log.d("ENDENDEND", registrNo.getText().toString());
						outerMTAObject.put("customerNo", registrNo.getText().toString().toUpperCase());
					}catch(Exception e){
					
					}
					
					String phone_value = phone.getText().toString();
					if (phone_value.length() > 4 || Shared.FRONT_SALE) {
						if(logged.indexOf("battrade")!=1){
							Variant w = new Variant();
				        	w.put("phone", "s"+phone.getText().toString());
							Shared.sql.update("Customer", w, "phone", "crm_id="+activeCRM.getInt("crm_id"));
							w = null;
							XMLParser parser = new XMLParser();
							parser.getXmlUpdateUrl(getURL(), "crm_customer", "phone='"+phone.getText().toString()+"'", "crm_id="+activeCRM.getInt("crm_id"));
						}
						send_alert(phone.getText().toString(), date.getText().toString(), dialog, false, registrNo.getText().toString(), "3");
						dialog.dismiss();
					} else
						Toast.makeText(getApplicationContext(), "Утасны дугаар оруулна уу !", Toast.LENGTH_LONG).show();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Илгээх + Хэвлэх")) {
						if(logged.indexOf("battrade")!=1){
							Variant w = new Variant();
				        	w.put("phone", "s"+phone.getText().toString());
							Shared.sql.update("Customer", w, "phone", "crm_id="+activeCRM.getInt("crm_id"));
							w = null;
							XMLParser parser = new XMLParser();
							parser.getXmlUpdateUrl(getURL(), "crm_customer", "phone='"+phone.getText().toString()+"'", "crm_id="+activeCRM.getInt("crm_id"));
						}
					try{
						if(MTA){
							outerMTAObject.put("billType", "3");
							outerMTAObject.put("cityTax", "0.00");
							nhat= "0.00";
							outerMTAObject.put("customerNo", registrNo.getText().toString().toUpperCase());
						}
						
					}catch(Exception e){
					
					}
					String phone_value = phone.getText().toString();
					if (phone_value.length() > 4 || Shared.FRONT_SALE) {
						
						send_alert(phone.getText().toString(), date.getText().toString(), dialog, true, registrNo.getText().toString(), "3");						
						dialog.dismiss();
					} else
						Toast.makeText(getApplicationContext(), "Утасны дугаар оруулна уу !", Toast.LENGTH_LONG).show();					
				}
				else
				if (commands.elementAt(pos).getString("caption").equals("Илгээх + хэвлэх Сугалаатай")) {
					try{
						outerMTAObject.put("billType", "1");
						outerMTAObject.put("cityTax", nhat);
						//outerMTAObject.put("customerNo", MAINREGNO.toUpperCase());
					}catch(Exception e){
						
					}
					String phone_value = phone.getText().toString();
					if (phone_value.length() > 4 || Shared.FRONT_SALE) {						
						send_alert(phone.getText().toString(), date.getText().toString(), dialog, true, MAINREGNO.toUpperCase(), "1");						
						dialog.dismiss();
					} else
						Toast.makeText(getApplicationContext(), "Утасны дугаар оруулна уу !", Toast.LENGTH_LONG).show();					
				}
			}
			
		});						
		
		dialog.show();
	}
	
	public boolean total_summary() {
		if (logged.indexOf("voltam") != -1) return false;
		return true;
	}
	
	public void see_total_list() {//padaaniig harj hevleh
		if (collection.size() == 0) {
			Toast.makeText(getApplicationContext(), "Мэдээлэл алга !", Toast.LENGTH_LONG).show();			
		}
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.total_dialog);		
		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
						
		Button filter_report = (Button)dialog.findViewById(R.id.filter_report);
		filter_report.setVisibility(Shared.FRONT_SALE && activeService.getInt("service_id") == 0 ? View.VISIBLE:View.GONE);
		filter_report.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
				
			}			
		});
		
		Button add_order = (Button)dialog.findViewById(R.id.add_order);
		add_order.setVisibility(Shared.FRONT_SALE && activeService.getInt("service_id") == 0 ? View.VISIBLE:View.GONE);
		add_order.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
				Collection collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f,s", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng,lastVisit", "_class='AGENT'", "firstname asc");
				activeCRM = collection.elementAt(0);				
				self_order = true;
				add_service();
			}			
		});
		
		Button calendar = (Button)dialog.findViewById(R.id.calendar);
		calendar.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
				showDialog(DATE_DIALOG_ID);
			}
			
		});
		calendar.setVisibility(activeService.getInt("service_id") == 0 ? View.VISIBLE:View.GONE);		
		
		
		Button select = (Button)dialog.findViewById(R.id.select);
		select.setVisibility(activeService.getInt("service_id") == 0 ? View.VISIBLE:View.GONE);		
		
		select.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
				select_filter();
			}
			
		});		
		
		Button print = (Button)dialog.findViewById(R.id.print);
		print.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				print_alert(dialog);
			}			
		});				
		
		print.setVisibility(activeService.getInt("service_id") != 0 ? View.VISIBLE:View.GONE);
		
		double total = 0;
		for (int i = 0; i < collection.size(); i++) {
			Variant q = collection.elementAt(i);
			total += q.getFloat("qty")*q.getFloat("price");
		}
		
		if (activeService.getInt("service_id") > 0) {
			TextView contactName = (TextView)dialog.findViewById(R.id.contactName);
			contactName.setText(activeCRM.getString("firstname"));		
			
			TextView contactDescr = (TextView)dialog.findViewById(R.id.contactDescr);
			contactDescr.setText(collection.size()+" бараа, "+money(total));
		} else {
			TextView contactName = (TextView)dialog.findViewById(R.id.contactName);
			contactName.setText(activeSelectTitle+" "+todayValue);		
			
			TextView contactDescr = (TextView)dialog.findViewById(R.id.contactDescr);
			contactDescr.setText(collection.size()+" бараа, "+money(total));
		}
				
		
		padaan_row_line = padaan_row_line_en = padaan_row_line_box = "";
		
		final TextView padaan_rows = (TextView)dialog.findViewById(R.id.padaan_rows);
		float chrWidth = padaan_rows.getPaint().measureText("0");
		int column = (int)((width-(convertPixelsToDp(40, this))) / chrWidth);
		
		int c1 = 20;
		int c2 = 6;
		int c3 = 10;
		int c4 = 13;
		int c5 = 3;
		
		if (activeSelect.equals("cku"))
			padaan_row_line += fillLeft(c1, "Барааны нэр")+fillRight(c2, "Төл")+fillRight(c3, "Гүй")+fillRight(c4, "SKU")+"\n";
		else
		if (logged.indexOf("bosa") != -1 && (activeSelect.equals("goal") || activeSelect.equals("perform") || activeSelect.equals("cku") ))
			padaan_row_line += fillLeft(c1, "Бренд")+fillRight(c2, "Тоо")+fillRight(c3, "Үнэ")+fillRight(c4, "Дүн")+"\n";
		else
			padaan_row_line += fillLeft(c1, "Барааны нэр")+fillRight(c2, "Тоо")+fillRight(c3, "Үнэ")+fillRight(c4, "Дүн")+"\n";
		padaan_row_line += fillLine(c1+c2+c3+c4, "-")+"\n";
		
		padaan_row_line_box += fillLeft(c1, "Барааны нэр")+fillRight(c2, "Тоо")+fillRight(c3, "Үнэ")+fillRight(c4, "Дүн")+"\n";
		padaan_row_line_box += fillLine(c1+c2+c3+c4, "-")+"\n";
		
		if (PRINT_BY_COLUMN) {
			padaan_row_line_en = "\n";
			padaan_row_line_en += fillLeft(c1+c2, COMPANY)+fillRight(c3+c4-printer_width[printer_index][5], Shared.convertToLatin(activeCRM.get("firstname")))+"\n";
			padaan_row_line_en += fillLeft(c1+c2, convertDateTimeToString())+fillRight(c3+c4-printer_width[printer_index][5], "P: "+service.getString("subject"))+"\n";
			padaan_row_line_en += "\n";
		} else {
			padaan_row_line_en = "\n"+COMPANY+"\n";
			padaan_row_line_en+= logged+" "+getData("phone", "")+"\n";
			padaan_row_line_en+= convertDateTimeToString()+"\n";
			padaan_row_line_en+= Shared.convertToLatin(activeCRM.get("firstname"))+"\n\n";
		}
		
		if (PRINT_BY_COLUMN) {
			padaan_row_line_en += fillLeft((c1-printer_width[printer_index][0]), "Baraa")+fillRight(c2-printer_width[printer_index][1], "Too")+fillRight(c3-printer_width[printer_index][2], "Negj/une")+fillRight(c4-printer_width[printer_index][3], "Niit")+fillRight(c5-printer_width[printer_index][8], "%")+"\n";
			padaan_row_line_en += fillLine(c1+c2+c3+c4+c5-printer_width[printer_index][4]+4, "-")+"\n";
			
			double sum = 0, sum_cash = 0, discount = 0, dt = 0;
			for (int i = 0; i < collection.size(); i++) {
				Variant w = collection.elementAt(i);
				String p_name = w.getString("product_name");
				String loan = "";
				float unit_size = 0;
				if (w.getString("type").equals("loan"))
					loan = "";
				Collection col = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "product_id="+w.getInt("product_id"), product_sort_field+" asc");
				if (col.size() > 0) {
					if (SHORT_PRODUCT_NAME && !col.elementAt(0).getString("company").equals("company")) 
						p_name = col.elementAt(0).getString("product_code")+" "+col.elementAt(0).getString("company")+loan;
					else
						p_name = w.getString("product_code")+" "+w.getString("product_name")+loan;
					
					unit_size = col.elementAt(0).getFloat("unit_size");
					dt = col.elementAt(0).getFloat("discount");
					if (unit_size == 0) unit_size = 1;
					if (PRODUCT_BUR_DISCOUNT_AVAILABLE && discount_if())
						discount += w.getFloat("qty") * w.getFloat("price") * col.elementAt(0).getFloat("discount") / 100;
				}
				else
					p_name = w.getString("product_code")+" "+w.getString("product_name")+loan;
				if (unit_size == 0) unit_size = 1;	
				padaan_row_line += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+fillRight(c2, number(w.getFloat("qty")/1))+fillRight(c3, money_(w.getFloat("price")))+fillRight(c4, money_(w.getFloat("amount")))+"\n";
				
				padaan_row_line_box += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+fillRight(c2, number(w.getFloat("qty")/unit_size))+fillRight(c3, money_(w.getFloat("price")))+fillRight(c4, money_(w.getFloat("amount")))+"\n";
				
				p_name = Shared.convertToLatin(p_name);
				//padaan_row_line_en += fillLeft(c1-printer_width[printer_index][0], p_name.substring(0, Math.min(p_name.length(), printer_width[printer_index][6])))+fillRight(c2-printer_width[printer_index][1], number_1(w.getFloat("qty")/unit_size))+fillRight(c3-printer_width[printer_index][2], money_2(w.getFloat("price")))+fillRight(c4-printer_width[printer_index][3], money_2(w.getFloat("amount")))+fillRight(c5-printer_width[printer_index][8], number_2(dt))+"\n";
				padaan_row_line_en += fillLeft(c1-printer_width[printer_index][0], p_name.substring(0, Math.min(p_name.length(), printer_width[printer_index][6])))+
						  fillRight(c2-printer_width[printer_index][1], number_1(w.getFloat("qty")/unit_size))+
						  fillRight(c3-printer_width[printer_index][2], money_2(w.getFloat("price")))+
						  fillRight(c4-printer_width[printer_index][3], money_2(w.getFloat("amount")))+
						  fillRight(c5-printer_width[printer_index][8], number_2(dt))+"\n";
				
				sum += w.getFloat("qty") * w.getFloat("price");
				if (w.getString("type").equals("cash"))
					sum_cash += w.getFloat("qty") * w.getFloat("price");			
			}
			padaan_row_line += fillLine(c1+c2+c3+c4, "-")+"\n";
			padaan_row_line += fillLeft(c1+c2, "Нийт")+fillRight(c3+c4, money(sum))+"\n";
			
			padaan_row_line_box += fillLine(c1+c2+c3+c4, "-")+"\n";
			padaan_row_line_box += fillLeft(c1+c2, "Нийт")+fillRight(c3+c4, money(sum))+"\n";
			
			if (discount > 0) {		
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт")+fillRight(c3+c4, money(discount))+"\n";
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт хассан")+fillRight(c3+c4, money(sum-discount))+"\n";
				
				padaan_row_line_box += fillLeft(c1+c2, "Хөнгөлөлт")+fillRight(c3+c4, money(discount))+"\n";
				padaan_row_line_box += fillLeft(c1+c2, "Хөнгөлөлт хассан")+fillRight(c3+c4, money(sum-discount))+"\n";
			}
			
			padaan_row_line_en += fillLine(c1+c2+c3+c4+c5-printer_width[printer_index][4]+4, "-")+"\n";		
			padaan_row_line_en += "!";
			padaan_row_line_en += fillRight(c1+c2-printer_width[printer_index][5]+c3+c4+2, "Niit dun :  "+money_3(sum))+"\n";
			if (discount > 0) {
				padaan_row_line_en += fillRight(c1+c2-printer_width[printer_index][5]+c3+c4+2, "Xungulult :  "+money_3(discount))+"\n";
				padaan_row_line_en += fillRight(c1+c2-printer_width[printer_index][5]+c3+c4+2, "Xungulult xassan :  "+money_3(sum-discount))+"\n";
				
				//padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Xungulult xassan")+fillRight(c3+c4, money_3(sum-discount))+"\n";
			}
			padaan_row_line_en += "!";						
			padaan_row_line_en += "\n";		
		
			if (Shared.FRONT_SALE && PADAAN_SUMMARY_ADDITIONAL) {
				padaan_row_line += fillLeft(c1+c2, "Бэлнээр")+fillRight(c3+c4, money(sum_cash))+"\n";				
				padaan_row_line_box += fillLeft(c1+c2, "Бэлнээр")+fillRight(c3+c4, money(sum_cash))+"\n";
				
				if (sum > sum_cash) {
					padaan_row_line += fillLeft(c1+c2, "Зээлээр")+fillRight(c3+c4, money(sum-sum_cash))+"\n";
					padaan_row_line_box += fillLeft(c1+c2, "Зээлээр")+fillRight(c3+c4, money(sum-sum_cash))+"\n";
				}
				padaan_row_line += fillLeft(c1+c2, "Tulukh")+fillRight(c3+c4, money(sum_cash))+"\n";
				padaan_row_line_box += fillLeft(c1+c2, "Tulukh")+fillRight(c3+c4, money(sum_cash))+"\n";
				
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Belneer")+fillRight(c3+c4, money_3(sum_cash))+"\n";
				if (sum > sum_cash)			
					padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Zeeleer")+fillRight(c3+c4, money_3(sum-sum_cash))+"\n";
							
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Tulukh")+fillRight(c3+c4, money_3(sum_cash))+"\n";
			}
		} else {			
			padaan_row_line_en += fillLeft((c1-printer_width[printer_index][0]), "Baraa")+fillRight(c2-printer_width[printer_index][1], "Too")+fillRight(c3-printer_width[printer_index][2], "Une")+fillRight(c4-printer_width[printer_index][3], "Niit")+"\n";
			padaan_row_line_en += fillLine(c1+c2+c3+c4-printer_width[printer_index][4], "-")+"\n";
			
			double sum = 0, sum_cash = 0, sum_payment = 0, discount = 0;
			for (int i = 0; i < collection.size(); i++) {
				Variant w = collection.elementAt(i);
				String p_name = w.getString("product_name");
				String loan = "#";
				Collection col = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "product_id="+w.getInt("product_id"), product_sort_field+" asc");
				if (col.size() > 0) {					
					if (SHORT_PRODUCT_NAME && !col.elementAt(0).getString("company").equals("company"))
						p_name = col.elementAt(0).getString("company")+loan;
					else
						p_name = w.getString("product_name")+loan;								
				}
				else
					p_name = w.getString("product_name")+loan;
				
				if (PRODUCT_BUR_DISCOUNT_AVAILABLE && discount_if())
					discount += w.getFloat("qty") * w.getFloat("price") * w.getFloat("precent") / 100;
				if (activeSelect.equals("cku"))
					padaan_row_line += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+fillRight(c2, number(w.getFloat("qty")))+fillRight(c3, money_(w.getFloat("price")))+fillRight(c4, precent(w.getFloat("amount")))+"\n";
				else
				if (activeSelect.equals("goal") && logged.indexOf("bosa") != -1){
					Log.d("QQQQQQQQQQQQ", w.getString("product_name"));
					padaan_row_line += fillLeft(c1, w.getString("product_name"))+fillRight(c2, number(w.getFloat("qty")/1))+fillRight(c3, money_(w.getFloat("price")))+fillRight(c4, money_(w.getFloat("amount")))+"\n";
				}else
					padaan_row_line += fillLeft(c1, p_name.substring(0, Math.min(p_name.length(), 18)))+fillRight(c2, number(w.getFloat("qty")))+fillRight(c3, money_1(w.getFloat("price")))+fillRight(c4, money_(w.getFloat("amount")))+"\n";
				p_name = Shared.convertToLatin(p_name);
				padaan_row_line_en += fillLeft(c1-printer_width[printer_index][0], p_name.substring(0, Math.min(p_name.length(), printer_width[printer_index][6])))+fillRight(c2-printer_width[printer_index][1], number_1(w.getFloat("qty")))+fillRight(c3-printer_width[printer_index][2], money_2(w.getFloat("price")))+fillRight(c4-printer_width[printer_index][3], money_2(w.getFloat("amount")))+"\n";
				
				sum += w.getFloat("qty") * w.getFloat("price");
				if (w.getString("type").equals("cash"))
					sum_cash += w.getFloat("qty") * w.getFloat("price");
										
				if (w.getString("type").equals("payment"))
					sum_payment += w.getFloat("amount");
			}
			padaan_row_line += fillLine(c1+c2+c3+c4, "-")+"\n";		
			padaan_row_line += fillLeft(c1+c2, "Нийт")+fillRight(c3+c4, money(sum))+"\n";
			
			if (discount > 0) {		
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт")+fillRight(c3+c4, money(discount))+"\n";
				padaan_row_line += fillLeft(c1+c2, "Хөнгөлөлт хассан")+fillRight(c3+c4, money(sum-discount))+"\n";			
			}
			
			padaan_row_line_en += fillLine(c1+c2+c3+c4-printer_width[printer_index][4], "-")+"\n";		
			padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Niit dun")+fillRight(c3+c4, money_3(sum))+"\n";
			if (discount > 0) {
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Xungulult")+fillRight(c3+c4, money_3(discount))+"\n";
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Xungulult xassan")+fillRight(c3+c4, money_3(sum-discount))+"\n";
			}
					
			padaan_row_line_en += "\n";		
			if (Shared.FRONT_SALE && PADAAN_SUMMARY_ADDITIONAL) {//shuud uuruusuu zarj baigaa ued
				padaan_row_line += fillLeft(c1+c2, "Бэлнээр")+fillRight(c3+c4, money(sum_cash))+"\n";
				if (sum > sum_cash)
					padaan_row_line += fillLeft(c1+c2, "Зээлээр")+fillRight(c3+c4, money(sum-sum_cash-sum_payment))+"\n";
				if (sum_payment > 0)
					padaan_row_line += fillLeft(c1+c2, "Зээл төлөлт")+fillRight(c3+c4, money(sum_payment))+"\n";			
				padaan_row_line += fillLeft(c1+c2, "Төлөх")+fillRight(c3+c4, money(sum_cash+sum_payment))+"\n";
				
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Belneer")+fillRight(c3+c4, money_3(sum_cash))+"\n";
				if (sum > sum_cash)			
					padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Zeeleer")+fillRight(c3+c4, money_3(sum-sum_cash-sum_payment))+"\n";
				if (sum_payment > 0)			
					padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Zeel tulult")+fillRight(c3+c4, money_3(sum_payment))+"\n";			
				padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "Tulukh")+fillRight(c3+c4, money_3(sum_cash+sum_payment))+"\n";
			}
			padaan_row_line_box = padaan_row_line;			
		}
		
		if (PRINT_BY_COLUMN) {
			padaan_row_line_en += "\n";
			padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "X/ugsun: /"+logged.split("@")[0]+"/")+fillRight(c3+c4+c5, "X/avsan: /            /")+"\n";
			padaan_row_line_en += fillLeft(c1+c2-printer_width[printer_index][5], "................")+fillRight(c3+c4, "..................")+"\n";																															 
			padaan_row_line_en += "\n\n\n\n\n";				
		} else {
			padaan_row_line_en += "\n";
			padaan_row_line_en += "X.avsan             "+".........."+"\n";
			padaan_row_line_en += "X.ugsun             "+".........."+"\n";
			padaan_row_line_en += "\n\n\n";
		}
		
		Log.d("d", padaan_row_line);
		padaan_rows.setText(padaan_row_line);
		//padaan_rows.setTextSize(width > 720  ? 13:11);
		
		padaan_rows.setClickable(true);
		padaan_rows.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				if (box_if)
					padaan_rows.setText(padaan_row_line);
				else
					padaan_rows.setText(padaan_row_line_box);
				
				box_if = !box_if;
			}
			
		});
		
		LinearLayout line1 = (LinearLayout)dialog.findViewById(R.id.line1);
		line1.setVisibility(activeService.getFloat("service_debt") == 0 ? View.GONE:View.VISIBLE);
		final EditText pay_amount = (EditText)dialog.findViewById(R.id.pay_amount);		
		pay_amount.setText(""+(money_1(activeService.getFloat("service_debt"))));	
		pay_amount.setFocusable(PAYMENT_EDIT_AVAILABLE);
		//pay_amount.setFocusable(false);
		//pay_amount.clearFocus();
		
		Button add_payment = (Button)dialog.findViewById(R.id.add_payment);
		add_payment.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {		
				if (activeService.get("service_stage").equals("service")) {
					String q = pay_amount.getText().toString();
					if (q.length() > 0 || !q.equals("0.0")) {
						float amount = Float.parseFloat(q);
						if (amount > activeService.getFloat("service_debt")) {
							Toast.makeText(getApplicationContext(), "Илүү дүн оруулсан байна !", Toast.LENGTH_SHORT).show();						
							return;
						}
						send_lease(amount);	
						
						dialog.dismiss();
					}
					else
						Toast.makeText(getApplicationContext(), "Та дүнгээ оруулна уу !", Toast.LENGTH_SHORT).show();
				} else
					Toast.makeText(getApplicationContext(), "Та уг үйлдлийг хийх боломжгүй байна ! Уг захиалга зөвшөөрөгдөөгүй эсвэл хаагдсан !", Toast.LENGTH_SHORT).show();
					
			}
			
		});
		
		list = (ListView)dialog.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		
		if (activeService.getInt("service_id") == 0) {
			command = "service_customer_list";
			new TaskExecution().execute();
		}
		
		dialog.show();
	}
	
	public void add_bagts(final String activeBrand) {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та уг багцыг ямар төрлөөр оруулах вэ ?")
	    .setPositiveButton("Бэлнээр", new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	String[] rex = activeBrand.split(" ");
				Collection collection = new Collection();
				if (WARE_CHOOSEN)
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "warehouse_id="+activeWare, "product_id asc");
				else
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", null, "product_id asc");
				for (int i = 0; i < collection.size(); i++) {
					Variant w = collection.elementAt(i);
					int id = Integer.parseInt(rex[1]) + 4;
					activeProduct = w;
					addproduct_toservice(w.getFloat("price"+id), w.getFloat("price"+id)/w.getFloat("unit_size"), w.getFloat(activeCRM.getString("pricetag")), "cash");
				}
				product_adapter.notifyDataSetChanged();
				dialog.dismiss();
	        }
	     })
	    .setNegativeButton("Зээлээр", new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	String[] rex = activeBrand.split(" ");
				Collection collection = new Collection();
				if (WARE_CHOOSEN)
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "warehouse_id="+activeWare, "product_id asc");
				else
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", null, "product_id asc");
				for (int i = 0; i < collection.size(); i++) {
					Variant w = collection.elementAt(i);
					int id = Integer.parseInt(rex[1]) + 4;
					activeProduct = w;
					addproduct_toservice(w.getFloat("price"+id), w.getFloat("price"+id)/w.getFloat("unit_size"), w.getFloat(activeCRM.getString("pricetag")), "loan");
				}
				product_adapter.notifyDataSetChanged();
				
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();		
	}
	
	public void send_lease(final double amount) {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та уг мэдээллийг илгээхдээ итгэлтэй байна уу?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	sendVariant = new Variant();
	        	sendVariant.put("crm_id", "i"+activeService.getInt("crm_id"));
	    		sendVariant.put("service_id", "i"+activeService.getInt("service_id"));
	    		sendVariant.put("pay_date", "s"+getToday());
	    		sendVariant.put("amount", "f"+amount);
	    		sendVariant.put("userCode", "s"+logged);
	    		command = "send_lease";
	    		new TaskExecution().execute();			
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();		
	}
	
	public void empty_service() {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Уг харилцагч дээр "+(Shared.FRONT_SALE ? "борлуулалт":"захиалга")+" хийх боломжгүй гэсэн мэдээллийг илгээх гэж байна ?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	Variant w = new Variant();
	        	w.put("lastVisit", "s"+getToday());
	        	Shared.sql.update("Customer", w, "lastVisit", "crm_id="+activeCRM.getInt("crm_id"));
	        	new_service();
	        	service.put("service_stage", "sfail");
	        	service.put("closing_date", "s"+todayValue);
	        	service.put("flag", "i0");
	        	service.put("owner", "s"+logged);
				service.put("phone", "sempty");
				
				command = "send_service";
				new TaskExecution().execute();		
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();		
	}
	
	public void non_service() {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Уг харилцагч дээр "+(Shared.FRONT_SALE ? "борлуулалт":"захиалга")+" авахыг хүсээгүй гэсэн мэдээллийг илгээх гэж байна ?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	Variant w = new Variant();
	        	w.put("lastVisit", "s"+getToday());
	        	Shared.sql.update("Customer", w, "lastVisit", "crm_id="+activeCRM.getInt("crm_id"));
	        	new_service();
	        	service.put("service_stage", "snon");
	        	service.put("closing_date", "s"+todayValue);
	        	service.put("flag", "i0");
	        	service.put("owner", "s"+logged);
				service.put("phone", "sempty");
				
				command = "send_service";
				new TaskExecution().execute();		
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();		
	}
	
	public void send_case(final String type, final String phone, final String reason, final String descr) {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та уг мэдээллийг илгээхдээ итгэлтэй байна уу?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	newcase = new Variant();
	        	newcase.put("crm_id", "i"+activeCRM.getInt("crm_id"));
	        	newcase.put("phone", "s"+phone);
	        	newcase.put("complain_reason", "s"+reason);
	        	newcase.put("complain_type", "s"+type);
	        	newcase.put("descr", "s"+descr);
	        	newcase.put("case_stage", "sidentify");
	        	newcase.put("closing_date", "s"+getNextDate(3));
	        	newcase.put("userCode", "s"+logged);
	        		        	
				command = "send_case";
				new TaskExecution().execute();				
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();
	}
	
	public void reset_service(final String selectedWare) {
		if (service_product_list.size() > 0) {
			new AlertDialog.Builder(this)
		    .setTitle("Анхааруулга")
		    .setMessage("Та агуулах сольж байгаа тул өмнөх илгээгүй захиалга тань устах болно ?")
		    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
		        @Override
				public void onClick(DialogInterface dialog, int which) {
		        	activeWare = selectedWare;
		        	new_service();
		        	if(ONLY_BOSA_TWO_WARE)
		        		product_list_reload("warehouse_id", "1");
					if (WARE_CHOOSEN)
						product_list_reload("warehouse_id", activeWare);
		        }
		     })
		    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
		        @Override
				public void onClick(DialogInterface dialog, int which) { 
		        	dialog.dismiss();	        	
		        }
		     })
		    .setIcon(android.R.drawable.ic_dialog_alert)
		     .show();
		} else {
			activeWare = selectedWare;
			new_service();	
			if(ONLY_BOSA_TWO_WARE)
        		product_list_reload("warehouse_id", "1");
			if (WARE_CHOOSEN)
				product_list_reload("warehouse_id", activeWare);		
		}
	}
	
	public String isSuccessMTA(String registrNo, String billType){
		String value = "no";
		Log.d("AAAAAAAAAAAa", registrNo+" | "+billType);
		if(registrNo.equals(" ") && billType.equals("3"))
		{
			value = "no";
		}else{
			mta_coll = parser.getCollection(this, getURL(), "ddtd,qrdata,result,date,lottery", "report", "crm_test_xml_list", "", outerMTAObject.toString()+";"+service.getString("subject")+";"+registrNo);
			Log.d("JSON", outerMTAObject.toString());
			
			ddtd = mta_coll.elementAt(0).get("ddtd");
			mtaDate = mta_coll.elementAt(0).get("date");
			mtaResult = mta_coll.elementAt(0).get("result");
			qrdata = mta_coll.elementAt(0).get("qrdata");
			lottery = mta_coll.elementAt(0).get("lottery");
			
			value = mtaResult;
		}
		
		return value;
	}
	
	double total = 0;
	public void send_alert(final String phone, final String date, final Dialog dialog_, final boolean print, final String registrNo, final String billType) {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та гүйлгээг илгээхдээ итгэлтэй байна уу?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) {
	        	if(activity.equals("add_return") || self_order){
	        		Variant w = new Variant();
		        	w.put("lastVisit", "s"+getToday());
		        	Shared.sql.update("Customer", w, "lastVisit", "crm_id="+activeCRM.getInt("crm_id"));
		        	service.put("closing_date", "s"+date);
		        	if (activeCRM.getString("promo_code").equals("U1"))
		        		service.put("service_precent", "f"+activeCRM.getFloat("promo_precent"));
					service.put("phone", "s"+phone);
					command = "send_service";
					new TaskExecution().execute();
	        	}else{
	        		if(MTA == false){
	        		   	Variant w = new Variant();
			        	w.put("lastVisit", "s"+getToday());
			        	Shared.sql.update("Customer", w, "lastVisit", "crm_id="+activeCRM.getInt("crm_id"));
			        	service.put("closing_date", "s"+date);
			        	if (activeCRM.getString("promo_code").equals("U1"))
			        		service.put("service_precent", "f"+activeCRM.getFloat("promo_precent"));
						service.put("phone", "s"+phone);
						command = "send_service";
						new TaskExecution().execute();
						 
						if (print){
							if(HEVLEDEGGUI == false)
			    				print_to_padaan(padaan_row_line_en, null);
			    		}
	        		}else{
	        			if(isSuccessMTA(registrNo, billType).equals("success")){
			        		padaan_row_line_en += "_______________________";
			        		padaan_row_line_en += "\n";
			        		padaan_row_line_en += "TTD:    "+""+registrNo+"\n";
				    		padaan_row_line_en += "DDTD:   "+""+ddtd+"\n";
				    		padaan_row_line_en += "OGNOO:  "+""+mtaDate+"\n";
				    		padaan_row_line_en += "NOAT 10%:  "+""+noat+"\n";
				    		padaan_row_line_en += "NHAT 1%:  "+""+nhat+"\n";
				    		
				    		if(!lottery.equals("")){
				    			padaan_row_line_en += "SUGALAA:"+""+lottery+"\n";
				    		}
				    		
				    		Log.d("PADAAAN", padaan_row_line_en);
				    		
				    		XMLParser parser = new XMLParser();
							parser.getXmlUpdateUrl(getURL(), "crm_customer", "regno='"+registrNo+"'", "crm_id="+activeCRM.getInt("crm_id"));
			        		
				        	Variant w = new Variant();
				        	w.put("lastVisit", "s"+getToday());
				        	Shared.sql.update("Customer", w, "lastVisit", "crm_id="+activeCRM.getInt("crm_id"));
				        	service.put("closing_date", "s"+date);
				        	if (activeCRM.getString("promo_code").equals("U1"))
				        		service.put("service_precent", "f"+activeCRM.getFloat("promo_precent"));
							service.put("phone", "s"+phone);
							command = "send_service";
							new TaskExecution().execute();
							 
							if (print){
								if(HEVLEDEGGUI == false)
				    				print_to_padaan(padaan_row_line_en, generateQrCode(qrdata));
				    			
				    		}
			        	}else
			        	{
			        		Toast.makeText(getApplicationContext(), "Харилцагчийн ТТД-ыг оруулаад дахин илгээнэ үү!", Toast.LENGTH_LONG).show();
			        		Toast.makeText(getApplicationContext(), "Худалдан авагч байгууллагын ТТД 7 оронтой эсвэл Иргэний регистерийн дугаар байх ёстой!", Toast.LENGTH_LONG).show();
			        	}
	        		}
	        	}
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();
	        	dialog_.dismiss();
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	     .show();
	}
	
	public void print_alert(final Dialog dialog_) {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та уг падааныг хэвлэхүү ?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) {
	        	if(MTA){
		        	padaan_row_line_en += "_______________________";
	        		padaan_row_line_en += "\n";
	        		String reg = sub_mta_coll.elementAt(0).get("ttd");
	        		if(reg.equals(""))
	        			reg = MAINREGNO;
	        		padaan_row_line_en += "TTD:    "+""+reg+"\n";
		    		padaan_row_line_en += "DDTD:   "+""+sub_mta_coll.elementAt(0).get("ddtd")+"\n";
		    		padaan_row_line_en += "OGNOO:  "+""+sub_mta_coll.elementAt(0).get("date")+"\n";
		    		padaan_row_line_en += "NOAT 10%:  "+""+noatSub+"\n";
		    		padaan_row_line_en += "NHAT 1%:  "+""+nhatSub+"\n";
		    		//if(!sub_mta_coll.elementAt(0).get("lottery").equals("")){
		    			padaan_row_line_en += "SUGALAA:"+""+sub_mta_coll.elementAt(0).get("lottery")+"\n";
		    		//}
		    		print_to_padaan(padaan_row_line_en, generateQrCode(qrdata));
	        	}else{
	        		print_to_padaan(padaan_row_line_en, null);
	        	}
	        	Log.d("PADAAAN", padaan_row_line_en);
	        	dialog.dismiss();
	        	dialog_.dismiss();
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();
	        	dialog_.dismiss();
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	     .show();
	}
	
	public void addproduct_toservice(float value, float pty, float price, String type) {
		service_product_list.removeCollection("product_id", "i"+activeProduct.getInt("product_id"), "type", "s"+type);
		if (value > 0) {
			Variant w = new Variant();
			w.put("service_id", "i0");
			w.put("product_id", "i"+activeProduct.getInt("product_id"));
			w.put("product_name", activeProduct.getString("product_name"));
			w.put("userCode", "s"+logged);			
			w.put("type", "s"+type);
			w.put("qty", "f"+value);
			w.put("pty", "f"+pty);
			w.put("price", "f"+price);
			w.put("amount", "f"+(value*price));
			
			if (discount_if())
				w.put("precent", "f"+activeProduct.getFloat("discount"));
			
			w.put("crm_id", "i"+activeCRM.getInt("crm_id"));
			w.put("warehouse_id", "i"+activeWare);
			w.put("descr", service.get("subject"));							
						
			service_product_list.addCollection(w);
		}			
		calculate_service();
	}
	
	public void calculate_service() {
		double total = 0;
		for (int i = 0; i < service_product_list.size(); i++) {
			Variant q = service_product_list.elementAt(i);
			total += q.getFloat("qty")*q.getFloat("price");
		}
		String activeWareName = "";
		Collection col = Shared.sql.selectAll("WareHouse", "s", "name", "warehouse_id="+activeWare, null);
		if (col.size() > 0)
			activeWareName = col.elementAt(0).getString("name")+", ";
		
		if (activity.equals("add_service")) {
			if (!self_order && Shared.FRONT_SALE)
				texts.get("product_count").setText("Өөрөөсөө "+service_product_list.size()+" бараа, "+money(total));
			else
				texts.get("product_count").setText(activeWareName+service_product_list.size()+" бараа, "+money(total));
		}
	}
	
	public void clear_service() {
		service = new Variant();				
		service_product_list = new Collection();		
	}
	
	public void new_service() {
		service = new Variant();
		service.put("crm_id", "i"+activeCRM.getInt("crm_id"));
		service.put("subject", "s"+System.currentTimeMillis());
		service.put("service_stage", "receipt");		
		service.put("phone", activeCRM.getString("phone"));
		service.put("service_revenue", "f0");
		service.put("service_qty", "i0");
		service.put("closing_date", "s"+getToday());
		service.put("warehouse_id", "i"+activeWare);
		service.put("userCode", "s"+logged);
		if (Shared.FRONT_SALE && !self_order) {
			service.put("service_stage", "sservice");
			service.put("owner", "s"+logged);
		} else
			service.put("owner", "s");
		
		service_product_list = new Collection();
		calculate_service();
	}
	
	public void new_return() {
		service = new Variant();
		service.put("crm_id", "i"+activeCRM.getInt("crm_id"));
		service.put("subject", "s"+System.currentTimeMillis());
		service.put("service_stage", "return");		
		service.put("phone", activeCRM.getString("phone"));
		service.put("service_revenue", "f0");
		service.put("service_qty", "i0");
		service.put("closing_date", "s"+getToday());
		service.put("warehouse_id", "i"+activeWare);
		service.put("userCode", "s"+logged);
		
		if (logged.indexOf("battrade") != -1) {
			service.put("service_stage", "sreturn");
			service.put("owner", "s"+logged);
		}
		
		if (Shared.FRONT_SALE && !self_order) {
			service.put("service_stage", "sreturn");
			service.put("owner", "s"+logged);
		} else
			service.put("owner", "s");
		
		service_product_list = new Collection();
		calculate_service();
	}
		
	public void product_filter() {
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.product_filter);		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
		
		final Collection filters = Shared.sql.selectAllGrouped("Products", (WARE_CHOOSEN?"warehouse_id="+activeWare:null), "product_brand", "product_brand");				
		Variant w = new Variant();
		w.put("product_brand", "Бүгд");
		filters.addCollection(0, w);
		
		if (logged.indexOf("mtc") != -1) {
			for (int i = 1; i <= 5; i++) {
				w = new Variant();
				w.put("product_brand", "Багц "+i);
				filters.addCollection(w);
			}
		}
				
		ListView list = (ListView)dialog.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);		
		list.setAdapter(new ProductFilterAdapter(this, R.layout.list_item_only, filters, "product_brand"));
		list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {				
				activeBrand = filters.elementAt(pos).getString("product_brand");
				if (activeBrand.startsWith("Багц")) {
					add_bagts(activeBrand);										
				}
				else
				if (activeBrand.equals("Бүгд"))
					product_list_reload("product_brand", "");
				else
					product_list_reload("product_brand", activeBrand);
				dialog.dismiss();
			}
			
		});
		
		dialog.show();
	}
	
	public void ware_filter() {
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.product_filter);		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
		
		String sort = "name asc";
		if (logged.indexOf("battrade") != -1) {
			sort = "warehouse_id desc";
		}
		final Collection filters = Shared.sql.selectAll("WareHouse", "i,s", "warehouse_id,name", null, sort);		
		ListView list = (ListView)dialog.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);		
		list.setAdapter(new ProductFilterAdapter(this, R.layout.list_item_only, filters, "name"));
		list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				if (!activeWare.equals(filters.elementAt(pos).getInt("warehouse_id")+"")) {	
					reset_service(filters.elementAt(pos).getInt("warehouse_id")+"");
					Log.d("EEEEEEEEEE", "warehouse selection changed"+filters.elementAt(pos).getInt("warehouse_id")+"");
					
					if (logged.indexOf("battrade") != -1) {
						activeWare = filters.elementAt(pos).getInt("warehouse_id")+"";
						command = "product_list";		
						new TaskExecution().execute();
					}
					
					product_list_reload("warehouse_id",filters.elementAt(pos).getInt("warehouse_id")+"");
				}
				dialog.dismiss();
			}
			
		});
		
		dialog.show();
	}
	
	@Override
	public void route_filter() {
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.product_filter);		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
				
		final Collection filters = Shared.sql.selectAllGrouped("Customer", null, "descr", "descr");
		ListView list = (ListView)dialog.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);		
		list.setAdapter(new ProductFilterAdapter(this, R.layout.list_item_only, filters, "descr"));
		list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				int customer_type = 1;
				activeRoute = filters.elementAt(pos).getString("descr");
				reload_customer(customer_type);			
				dialog.dismiss();
			}
			
		});
		
		dialog.show();
	}
	
	public void select_filter() {
		final Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
		dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
		dialog.setContentView(R.layout.product_filter);		
		Button back = (Button)dialog.findViewById(R.id.back);
		back.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
			
		});
				
		final Collection filters = new Collection();
		Variant w = new Variant();		
		w.put("descr", "Захиалга");
		w.put("value", "order");
		filters.addCollection(w);					
		
		w = new Variant();
		w.put("descr", "Бэлэн борлуулалт");
		w.put("value", "cash");
		filters.addCollection(w);
		
		w = new Variant();
		w.put("descr", "Зээл борлуулалт");
		w.put("value", "lease");
		filters.addCollection(w);
		
		w = new Variant();
		w.put("descr", "Зээл төлөлт");
		w.put("value", "payment");
		filters.addCollection(w);
				
		w = new Variant();
		w.put("descr", "Нийт");
		w.put("value", "total");
		filters.addCollection(w);
		
		w = new Variant();
		w.put("descr", "Тушаах");
		w.put("value", "must");
		filters.addCollection(w);
		
		w = new Variant();
		w.put("descr", "Төлөвөлөгөө");
		w.put("value", "goal");
		filters.addCollection(w);
		
		w = new Variant();
		w.put("descr", "Гүйцэтгэл");
		w.put("value", "perform");
		filters.addCollection(w);
		
		w = new Variant();
		w.put("descr", "SKU");
		w.put("value", "cku");
		filters.addCollection(w);
		
		ListView list = (ListView)dialog.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);		
		list.setAdapter(new ProductFilterAdapter(this, R.layout.list_item_only, filters, "descr"));
		list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {				
				activeSelect = filters.elementAt(pos).getString("value");
				activeSelectTitle = filters.elementAt(pos).getString("descr");
				command = "call_me";
				new TaskExecution().execute();
				dialog.dismiss();
			}
			
		});
		
		dialog.show(); 
	}
	
	public void reload_customer(int customer_type) {
		String sort_value = "firstname";
		if(CUSTOMER_SORT_TYPE){
			sort_value = " cast(company_torol as signed) ";
		}
		collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f,s", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng,lastVisit", "customer_type="+customer_type+" and descr='"+activeRoute+"'", sort_value+" asc");
		Log.d("d", collection.size()+" rows" + sort_value);
		customer_adapter = new CustomerAdapter(this, R.layout.list_item);
		list.setAdapter(customer_adapter);
		customer_adapter.notifyDataSetChanged();
	}
	
	public void product_list_reload(String field, String filter) {
		//if (!activity.equals("add_service")) return;
		if (filter.length() > 0) {
			Collection product_types = new Collection();
			if (!STORAGE_FAN) {
				if (WARE_CHOOSEN) {
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", field+"='"+filter+"' and warehouse_id="+activeWare, product_sort_field+" asc");
					product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"' and warehouse_id="+activeWare, "product_type", "product_type");
				} else {
					if (this.ONLY_BOSA_TWO_WARE) {
                        if (field.equals("warehouse_id")) {
                            Log.d("FIELD ", field);
                            Log.d("FILTER ", filter);
                            field = "'1'";
                            filter = "1";
                        }
                     }
					Log.d("AAAAAAAAAA", "end bnaaa");
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", field+"='"+filter+"'", product_sort_field+" asc");
					product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"'", "product_type", "product_type");
					
				}
			}
			else {
				if (filter_collection.size() > 0) {
					if (WARE_CHOOSEN) {
						Log.d("RRRRRRR", "end baina shdee");
						collection = Shared.sql.selectAllFilter("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", field+"='"+filter+"' and warehouse_id="+activeWare, product_sort_field+" asc", "product_id", filter_collection.toString("product_id"));
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"' and warehouse_id="+activeWare, "product_type", "product_type");
					} else {
						if (this.ONLY_BOSA_TWO_WARE) {
	                        if (field.equals("warehouse_id")) {
	                            Log.d("FIELD ", field);
	                            Log.d("FILTER ", filter);
	                            field = "'1'";
	                            filter = "1";
	                        }
	                     }
						collection = Shared.sql.selectAllFilter("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", field+"='"+filter+"'", product_sort_field+" asc", "product_id", filter_collection.toString("product_id"));
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"'", "product_type", "product_type");
					}
				}
				else {
					if (WARE_CHOOSEN) {
						collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", field+"='"+filter+"' and warehouse_id="+activeWare, product_sort_field+" asc");
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"' and warehouse_id="+activeWare, "product_type", "product_type");
					} else {
						collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", field+"='"+filter+"'", product_sort_field+" asc");
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"'", "product_type", "product_type");
					}
				}
			}
			
			if (PRODUCT_GROUP) {
				ArrayList<Continent> continentList = new ArrayList<Continent>();				
				for (int i = 0; i < product_types.size(); i++) {
					Variant w = product_types.elementAt(i);
					ArrayList<Variant> list = new ArrayList<Variant>();
					for (int j = 0; j < collection.size(); j++) {
						Variant q = collection.elementAt(j);
						if (w.getString("product_type").equals(q.getString("product_type"))) {
							list.add(q);
						}
					}
					if (list.size() > 0) {
						Continent continent = new Continent(w.getString("product_type"), list);
						continentList.add(continent);
					}
				}				
				product_grouped_adapter = new ProductGroupedAdapter(this, continentList);
				product_grouped_list.setAdapter(product_grouped_adapter);
			} else {
				try{
					product_adapter = new ProductAdapter(this, R.layout.list_item, collection);
					product_list.setAdapter(product_adapter);
				}catch(Exception e1){
					
				}
			}
		} else {
			Collection product_types  = new Collection();
			if (!STORAGE_FAN) {
				if (WARE_CHOOSEN) {
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "warehouse_id="+activeWare, product_sort_field+" asc");
					product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"' and warehouse_id="+activeWare, "product_type", "product_type");
				} else {
					collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", null, product_sort_field+" asc");
					product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"'", "product_type", "product_type");
				}
			}
			else {
				if (filter_collection.size() > 0) {
					if (WARE_CHOOSEN) {
						collection = Shared.sql.selectAllFilter("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "warehouse_id="+activeWare, product_sort_field+" asc", "product_id", filter_collection.toString("product_id"));
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"' and warehouse_id="+activeWare, "product_type", "product_type");
					} else {
						collection = Shared.sql.selectAllFilter("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", null, product_sort_field+" asc", "product_id", filter_collection.toString("product_id"));
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"'", "product_type", "product_type");	
					}
				}
				else {
					if (WARE_CHOOSEN) {
						collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "warehouse_id="+activeWare, product_sort_field+" asc");
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"' and warehouse_id="+activeWare, "product_type", "product_type");
					} else {
						collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", null, product_sort_field+" asc");
						product_types = Shared.sql.selectAllGrouped("Products", field+"='"+filter+"'", "product_type", "product_type");
					}
				}
			}
			
			if (PRODUCT_GROUP) {
				ArrayList<Continent> continentList = new ArrayList<Continent>();				
				for (int i = 0; i < product_types.size(); i++) {
					Variant w = product_types.elementAt(i);
					ArrayList<Variant> list = new ArrayList<Variant>();
					for (int j = 0; j < collection.size(); j++) {
						Variant q = collection.elementAt(j);
						if (w.getString("product_type").equals(q.getString("product_type"))) {
							list.add(q);
						}
					}
					if (list.size() > 0) {
						Continent continent = new Continent(w.getString("product_type"), list);
						continentList.add(continent);
					}
				}				
				product_grouped_adapter = new ProductGroupedAdapter(this, continentList);
				product_grouped_list.setAdapter(product_grouped_adapter);
			} else {
				product_adapter = new ProductAdapter(this, R.layout.list_item, collection);
				product_list.setAdapter(product_adapter);
			}
		}
		
		calculate_service();
	}
	
	public void add_service() {		
		activity = "add_service";
		cameraReady = false;
		setToolbarItemsDetailWithSearch("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();
				
		View v = getLayoutInflater().inflate(PRODUCT_GROUP ? R.layout.add_service_grouped:R.layout.add_service, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		if (self_order)
			contactName.setText("Захиалга");
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 бараа");
		texts.put("product_count", contactDescr);
		
		Button add = (Button)v.findViewById(R.id.product_filter);
		add.setTag("product_filter");
		add.setOnClickListener(this);
				
		Button ware = (Button)v.findViewById(R.id.ware_filter);
		ware.setTag("ware_filter");
		ware.setOnClickListener(this);
		
		final Collection commands = new Collection();
		Variant w = new Variant();		
		w.put("caption", "Бэлэн болсон");				
		commands.addCollection(w);
		
		if(logged.indexOf("battrade")!=1){
			
		}else{
			w = new Variant();	
			w.put("caption", "Зураг авах");				
			commands.addCollection(w);
			
			w = new Variant();		
			w.put("caption", "Цэвэрлэх");				
			commands.addCollection(w);
		}
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				if (commands.elementAt(pos).getString("caption").equals("Бэлэн болсон")) {
					if (STORAGE_FAN) { 
						command = "check_padaan";
						new TaskExecution().execute();
					} else
						padaan_list();
				}
				else
				if (commands.elementAt(pos).getString("caption").equals("Зураг авах"))
					image();
				else {
					new_service();
					if (PRODUCT_GROUP)
						product_grouped_adapter.notifyDataSetChanged();
					else
						product_adapter.notifyDataSetChanged();
				}
			}			
		});
		
		if (PRODUCT_GROUP) {
			product_grouped_list = (ExpandableListView)v.findViewById(R.id.list);		
			product_grouped_list.setVerticalFadingEdgeEnabled(false);
			product_grouped_list.setTextFilterEnabled(true);
			product_grouped_list.setOnChildClickListener(new OnChildClickListener() {

				@Override
				public boolean onChildClick(ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
					activeProduct = (Variant)product_grouped_adapter.getChild(groupPosition, childPosition);
					product_list();
					return false;
				}
					
			});
		} else {
			product_list = (ListView)v.findViewById(R.id.list);		
			product_list.setVerticalFadingEdgeEnabled(false);
			product_list.setTextFilterEnabled(true);
			product_list.setOnItemClickListener(new OnItemClickListener() {
	
				@Override
				public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
					activeProduct = product_adapter.getItem(pos);
					product_list();
				}
				
			});
		}
	
		command = "product_list";		
		new TaskExecution().execute();
		
		content.addView(v);

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    
	    
	    new_service();
	}
	
	public void add_return() {		
		activity = "add_return";
		cameraReady = false;
		setToolbarItemsDetailWithSearch("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();
				
		View v = getLayoutInflater().inflate(PRODUCT_GROUP ? R.layout.add_service_grouped:R.layout.add_service, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		if (self_order)
			contactName.setText("Захиалга");
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 бараа");
		texts.put("product_count", contactDescr);
		
		Button add = (Button)v.findViewById(R.id.product_filter);
		add.setTag("product_filter");
		add.setOnClickListener(this);
				
		Button ware = (Button)v.findViewById(R.id.ware_filter);
		ware.setTag("ware_filter");
		ware.setOnClickListener(this);
		
		final Collection commands = new Collection();
		Variant w = new Variant();		
		w.put("caption", "Бэлэн болсон");				
		commands.addCollection(w);
		
		w = new Variant();	
		w.put("caption", "Зураг авах");				
		commands.addCollection(w);
		
		w = new Variant();		
		w.put("caption", "Цэвэрлэх");				
		commands.addCollection(w);
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				if (commands.elementAt(pos).getString("caption").equals("Бэлэн болсон")) {
					if (STORAGE_FAN) { 
						command = "check_padaan";
						new TaskExecution().execute();
					} else
						padaan_list();
				}
				else
				if (commands.elementAt(pos).getString("caption").equals("Зураг авах"))
					image();
				else {
					new_return();
					if (PRODUCT_GROUP)
						product_grouped_adapter.notifyDataSetChanged();
					else
						product_adapter.notifyDataSetChanged();
				}
			}			
		});
		
		if (PRODUCT_GROUP) {
			product_grouped_list = (ExpandableListView)v.findViewById(R.id.list);		
			product_grouped_list.setVerticalFadingEdgeEnabled(false);
			product_grouped_list.setTextFilterEnabled(true);
			product_grouped_list.setOnChildClickListener(new OnChildClickListener() {

				@Override
				public boolean onChildClick(ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
					activeProduct = (Variant)product_grouped_adapter.getChild(groupPosition, childPosition);
					product_list();
					return false;
				}
					
			});
		} else {
			product_list = (ListView)v.findViewById(R.id.list);		
			product_list.setVerticalFadingEdgeEnabled(false);
			product_list.setTextFilterEnabled(true);
			product_list.setOnItemClickListener(new OnItemClickListener() {
	
				@Override
				public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
					activeProduct = product_adapter.getItem(pos);
					product_list();
				}
				
			});
		}
	
		command = "product_list";		
		new TaskExecution().execute();
		
		content.addView(v);

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    
	    
	    new_return();
	}
	
	public void service_list() {
		activity = "service";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.service_list, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		if (activeCRM.getString("unsuccess").equals("yes")) {
			contactName.setCompoundDrawablesWithIntrinsicBounds(getResources().getDrawable(R.drawable.error), null, null, null);
		}
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 борлуулалт");		
		texts.put("service_count", contactDescr);
		
		Button add = (Button)v.findViewById(R.id.add_service);
		add.setTag("add_service");
		add.setOnClickListener(this);
		
		Button map = (Button)v.findViewById(R.id.location);
		map.setTag("location");
		map.setOnClickListener(this);
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		list.setOnItemClickListener(this);
		
		content.addView(v);
		
		command = "service_list";
		new TaskExecution().execute();

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public void return_list() {
		activity = "service";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.service_list, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		if (activeCRM.getString("unsuccess").equals("yes")) {
			contactName.setCompoundDrawablesWithIntrinsicBounds(getResources().getDrawable(R.drawable.error), null, null, null);
		}
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 борлуулалт");		
		texts.put("service_count", contactDescr);
		
		Button add = (Button)v.findViewById(R.id.add_service);
		add.setTag("add_return");
		add.setOnClickListener(this);
		
		Button map = (Button)v.findViewById(R.id.location);
		map.setTag("location");
		map.setOnClickListener(this);
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		list.setOnItemClickListener(this);
		
		content.addView(v);
		
		command = "service_list";
		new TaskExecution().execute();

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public void add_case() {		
		activity = "add_case";
		setToolbarItems("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.add_case, null);											
		
		final EditText reason = (EditText)v.findViewById(R.id.complain_reason);
		final EditText phone = (EditText)v.findViewById(R.id.phone);
		final EditText descr = (EditText)v.findViewById(R.id.descr);		
		
		final Collection commands = new Collection();
		Variant w = new Variant();		
		w.put("caption", "Санал хүсэлт");				
		commands.addCollection(w);				
		
		w = new Variant();		
		w.put("caption", "Гомдол");				
		commands.addCollection(w);
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.hideSoftInputFromWindow(descr.getWindowToken(), 0);
				
				if (commands.elementAt(pos).getString("caption").equals("Санал хүсэлт")) {
					String phone_value = phone.getText().toString();
					String r = reason.getText().toString();
					String d = descr.getText().toString();					
					if (phone_value.length() > 4 && r.length() > 0) {
						send_case("feature request", phone_value, r, d);
					} else
						Toast.makeText(getApplicationContext(), "Мэдээллээ бүрэн оруулна уу !", Toast.LENGTH_LONG).show();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Гомдол")) {				
					String phone_value = phone.getText().toString();
					String r = reason.getText().toString();
					String d = descr.getText().toString();
					if (phone_value.length() > 4 && r.length() > 0) {
						send_case("problem", phone_value, r, d);
					} else
						Toast.makeText(getApplicationContext(), "Мэдээллээ бүрэн оруулна уу !", Toast.LENGTH_LONG).show();
				}
			}			
		});
									
		content.addView(v);

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    	    	    
	}
	
	public void case_list() {
		activity = "case";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.case_list, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		if (activeCRM.getString("unsuccess").equals("yes")) {
			contactName.setCompoundDrawablesWithIntrinsicBounds(getResources().getDrawable(R.drawable.error), null, null, null);
		}
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 санал, гомдол");		
		texts.put("case_count", contactDescr);
		
		Button add = (Button)v.findViewById(R.id.add_case);
		add.setTag("add_case");
		add.setOnClickListener(this);
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		list.setOnItemClickListener(this);
		
		content.addView(v);
		
		command = "case_list";
		new TaskExecution().execute();

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);
	}
	
	@Override
	public void reload_any() {
		new TaskExecution().execute();
	}
	
	public void activity_list() {		
		activity = "activity";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.activity_list, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("0 үйл ажиллагаа");
		texts.put("activity_count", contactDescr);
		
		Button button = (Button)v.findViewById(R.id.add_activity);
		button.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				
			}
			
		});
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		
		content.addView(v);
		
		command = "activity_list";
		new TaskExecution().execute();

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public void report_list() {		
		activity = "report";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.report_list, null);											

		TextView contactName = (TextView)v.findViewById(R.id.contactName);
		contactName.setText(activeCRM.getString("firstname"));
		
		TextView contactDescr = (TextView)v.findViewById(R.id.contactDescr);
		contactDescr.setText("тайлан сараар");
		texts.put("report_count", contactDescr);
		
		Button button = (Button)v.findViewById(R.id.report_date);	    
		button.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				showDialog(DATE_DIALOG_ID);
			}
			
		});
		
		list = (ListView)v.findViewById(R.id.list);		
		list.setVerticalFadingEdgeEnabled(false);
		
		content.addView(v);
		
		command = "report_list";
		new TaskExecution().execute();

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public void detail() {
		activity = "detail";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.detail, null);											
		
		final Collection commands = new Collection();
		Variant w = new Variant();		
		w.put("caption", (Shared.FRONT_SALE? "Борлуулалт":"Захиалга"));
		commands.addCollection(w);
		
		if(ENABLE_RETURN){
			w = new Variant();
			w.put("caption", "Буцаалт бүртгэх");				
			commands.addCollection(w);
		}
		
		if(SHOW_UNSUCCESS_SERVICE){
			w = new Variant();
			w.put("caption", "Амжилтгүй гүйлгээ");				
			commands.addCollection(w);
		}
		
		w = new Variant();
		w.put("caption", "Хаалттай боломжгүй");				
		commands.addCollection(w);
		
		w = new Variant();
		w.put("caption", "Борлуулалт хийгээгүй");				
		commands.addCollection(w);
		
		w = new Variant();
		w.put("caption", "Тайлан");
		commands.addCollection(w);
		
		w = new Variant();
		w.put("caption", "Санал гомдол");
		commands.addCollection(w);
				
		
		ViewPager viewPager = new ViewPager(this);
		LayoutParams lp = new LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		viewPager.setLayoutParams(lp);		
		PageAdapter adapter = new PageAdapter(this);					
		
		collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f,s", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng,lastVisit", "parent_crm_id="+activeCRM.getInt("crm_id"), "firstname asc");
		TextView ccount = (TextView)v.findViewById(R.id.contact_count);
		ccount.setText("< "+collection.size()+" контакт >");
		
		for (int i = 0; i < collection.size(); i++) {
			Variant q = collection.elementAt(i);
			adapter.addPage(contactItem(q));			
		}
		viewPager.setAdapter(adapter);				
		
		LinearLayout contact_list = (LinearLayout)v.findViewById(R.id.contact_list);		
		contact_list.addView(viewPager);		
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
				if (commands.elementAt(pos).getString("caption").equals("Борлуулалт") || commands.elementAt(pos).getString("caption").equals("Захиалга")) {
					service_list();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Буцаалт бүртгэх")) {
					return_list();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Амжилтгүй гүйлгээ")) {
					unsuccess_service_list();
					
				} else
				if (commands.elementAt(pos).getString("caption").equals("Хаалттай боломжгүй")) {
					empty_service();
				} else					 
				if (commands.elementAt(pos).getString("caption").equals("Борлуулалт хийгээгүй")) {
					non_service();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Хэлцэл")) {
					deal_list();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Үйл ажиллагаа")) {
					activity_list();
				} else					
				if (commands.elementAt(pos).getString("caption").equals("Тайлан")) {
					report_list();
				} else
				if (commands.elementAt(pos).getString("caption").equals("Санал гомдол")) {
					case_list();
				}
			}
			
		});
		
		command = "";
		content.addView(v);
		
		if (activeCRM.getString("unsuccess").equals("yes")) {
			clear_service();
			command = "send_unsuccess_service";
			//new TaskExecution().execute();			
		}
		
		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public View phoneCallForm() {
		View v = getLayoutInflater().inflate(R.layout.phonecall_new, null);
		return v;
	}
	
	public void phonecall() {
		activity = "phonecall";
		setToolbarItemsDetail("Буцах");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.detail, null);											
		
		final Collection commands = new Collection();
		Variant w = new Variant();
		w.put("caption", "Make phone call");				
		commands.addCollection(w);
						
		w = new Variant();
		w.put("caption", "Back");				
		commands.addCollection(w);
		
		ViewPager viewPager = new ViewPager(this);
		LayoutParams lp = new LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		viewPager.setLayoutParams(lp);		
		PageAdapter adapter = new PageAdapter(this);					
		
		//phone call log
		adapter.addPage(phoneCallForm());
		
		viewPager.setAdapter(adapter);				
		
		LinearLayout contact_list = (LinearLayout)v.findViewById(R.id.contact_list);		
		contact_list.addView(viewPager);		
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(this);		
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {												
				if (commands.elementAt(pos).getString("caption").equals("Back")) {
					detail();
				}
			}
			
		});
		
		content.addView(v);

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public void email() {
		activity = "email";
		setToolbarItemsDetail("Back");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.detail, null);											
		
		final Collection commands = new Collection();
		Variant w = new Variant();
		w.put("caption", "Send mail");				
		commands.addCollection(w);
						
		w = new Variant();
		w.put("caption", "Back");				
		commands.addCollection(w);
		
		ViewPager viewPager = new ViewPager(this);
		LayoutParams lp = new LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		viewPager.setLayoutParams(lp);		
		PageAdapter adapter = new PageAdapter(this);					
				
		viewPager.setAdapter(adapter);				
		
		LinearLayout contact_list = (LinearLayout)v.findViewById(R.id.contact_list);		
		contact_list.addView(viewPager);		
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(this);		
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {												
				if (commands.elementAt(pos).getString("caption").equals("Back")) {
					detail();
				}
			}
			
		});
		
		content.addView(v);

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public View appointmentForm() {
		View v = getLayoutInflater().inflate(R.layout.event_new, null);
		return v;
	}	
	
	public void appointment() {
		activity = "appointment";
		setToolbarItemsDetail("Back");
		removeFooterItems();
		
		LinearLayout content = (LinearLayout)findViewById(R.id.content);
		content.removeAllViews();

		View v = getLayoutInflater().inflate(R.layout.detail, null);											
		
		final Collection commands = new Collection();
		Variant w = new Variant();
		w.put("caption", "Make appointment");				
		commands.addCollection(w);
						
		w = new Variant();
		w.put("caption", "Back");				
		commands.addCollection(w);
		
		ViewPager viewPager = new ViewPager(this);
		LayoutParams lp = new LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		viewPager.setLayoutParams(lp);		
		PageAdapter adapter = new PageAdapter(this);					
		
		adapter.addPage(appointmentForm());
		
		viewPager.setAdapter(adapter);				
		
		LinearLayout contact_list = (LinearLayout)v.findViewById(R.id.contact_list);		
		contact_list.addView(viewPager);		
		
		ListView command_list = (ListView)v.findViewById(R.id.command);		
		command_list.setVerticalFadingEdgeEnabled(false);
		command_list.setTag("command");
		command_list.setAdapter(new CommandAdapter(this, R.layout.list_item_only, commands));
		command_list.setOnItemClickListener(this);		
		command_list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> a, View v, int pos, long t) {												
				if (commands.elementAt(pos).getString("caption").equals("Back")) {
					detail();
				}
			}
			
		});
		
		content.addView(v);

		Animation fadeIn = new AlphaAnimation(0, 1);
	    fadeIn.setDuration(1000);
	    v.setAnimation(fadeIn);	    						
	}
	
	public void completeReading() {
		if (command.equals("login")) {
    	    if (xml != null && xml.startsWith("logged")) {		
    	    	String[] parse = xml.split(",");
    	    	if (parse[1].toLowerCase().equals("retail"))
    	    		Shared.FRONT_SALE = true;
    	    	Log.d("dssss", xml);
    	    	logged = u;  	
    	    	setData("logged", logged);
    	    	setData("pass", p);
    	    	if (logged.indexOf("bosa") != -1) {
    	    		setData("team", parse[5].toLowerCase());
    	    	}
    	    	
    	    	if (logged.indexOf("battrade") != -1) {
    	    		activeWare = parse[5].toLowerCase()+"";
    	    	}
    	    	
    	    	if (logged.indexOf("voltam") != -1) {
    	    		setData("team", parse[5].toLowerCase());
    	    	}
    	    	if (logged.indexOf("mxc") != -1) {
    	    		setData("team", parse[5].toLowerCase());
    	    	}
    	    	setData("user_type", parse[1].toLowerCase());
    	    	if (parse.length > 2) {
    	    		setData("phone", parse[2].toLowerCase());
    	    		setData("msg", parse[3].toLowerCase());
    	    		if (!version.equals(parse[4])) {
    	    		//	updateDialog();
    	    		}
    	    	}
    	    	
    	    	if(MUST_ON_GPS){
    				GPSManager gps = new GPSManager(MainActivity.this);
    				gps.start();
    			}
    	    	gps_tracker();    	    	
    	    	customer();
    	    } else
    	    if (xml != null && xml.startsWith("guest")) {
    	    	Log.v("blah",getURL());
    	    	Toast.makeText(getApplicationContext(), "Алдаатай хүсэлт #1 !", Toast.LENGTH_SHORT).show();
    	    } else
    	    if (xml != null && xml.equals("fail")) {
    	    	Toast.makeText(getApplicationContext(), "Алдаатай хүсэлт #2 !", Toast.LENGTH_SHORT).show();
    	    } else
    	    if (getData("pass","").equals(p) && p.length() > 0) {
    	    	logged = u;
    	    	if (getData("user_type", "").equals("retail"))
    	    		Shared.FRONT_SALE = true;
    	    	
    	    	gps_tracker();    	    	
    	    	customer();
    	    } else
    	    	Toast.makeText(getApplicationContext(), "Алдаатай хүсэлт #3!", Toast.LENGTH_SHORT).show();
		} else
		if (command.equals("customer")) {	
			int customer_type = 1;
			//if (Shared.FRONT_SALE) customer_type = 0;
			if (activeRoute.length() > 0)
				collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f,s", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng,lastVisit", "customer_type="+customer_type+" and descr='"+activeRoute+"'", "firstname asc");
			else
				collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f,s", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng,lastVisit", "customer_type="+customer_type, "firstname asc");				
			customer_adapter = new CustomerAdapter(this, R.layout.list_item);
			
			texts.get("successTotal").setText("Нийт "+Shared.sql.selectAll("Customer", "s", "lastVisit", "lastVisit='"+getToday()+"'", "firstname asc").size()+", Амжилтгүй "+Shared.sql.selectAll("JsonList", "s", "json", null, null).size()+"");			
			
			list.setAdapter(customer_adapter);
			
			if (customer_last_selection < 0 || customer_last_selection >= collection.size())
				customer_last_selection = 0;
			list.setSelection(customer_last_selection);	
		} else
		if (command.equals("deal_list")) {
			DealAdapter adapter = new DealAdapter(this, R.layout.list_item);
			list.setAdapter(adapter);
			texts.get("deal_count").setText(collection.size()+" deal(s)");
		} else
		if (command.equals("service_list")) {
			service_adapter = new ServiceAdapter(this, R.layout.list_item);
			list.setAdapter(service_adapter);
			texts.get("service_count").setText(collection.size()+" борлуулалт");			
		} else
		if (command.equals("case_list")) {
			case_adapter = new CaseAdapter(this, R.layout.list_item);
			list.setAdapter(case_adapter);
			texts.get("case_count").setText(collection.size()+" санал гомдол");			
		} else
		if (command.equals("activity_list")) {
			ActivityAdapter adapter = new ActivityAdapter(this, R.layout.list_item);
			list.setAdapter(adapter);
			texts.get("activity_count").setText(collection.size()+" үйл ажиллагаа");
		} else			 
		if (command.equals("report_list")) {
			ReportAdapter adapter = new ReportAdapter(this, R.layout.list_item);
			list.setAdapter(adapter);			
			
			double total = 0;
			for (int i = 0; i < collection.size(); i++) {
				Variant w = collection.elementAt(i);
				total += w.getFloat("amount");
			}
			texts.get("report_count").setText(money(total)+" ("+todayValue.substring(0, 7)+" сар)");			
		} else
		if (command.equals("product_list")) {
			if (activeWare.length() == 0) activeWare = "1";
			if (!WARE_CHOOSEN)
				product_list_reload("warehouse_id", "1");
			else
				product_list_reload("warehouse_id", activeWare);
		} else
		if (command.equals("check_padaan")) {
			boolean assembly = false;
			for (int i = 0; i < service_product_list.size(); i++) {				
				Variant w = service_product_list.elementAt(i);
				Variant q = filter_collection.queryInt("product_id", w.getInt("product_id"));
				String val = "last";
                if (this.ONLY_BOSA_TWO_WARE && this.activeWare.equals("2")) {
                    val = "last1";
                }
                
                if (this.ONLY_BOSA_TWO_WARE && this.activeWare.equals("3")) {
                    val = "last2";
                }
                
				if (q.getFloat(val) < w.getFloat("qty")) {
					Collection c = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "product_id="+w.getInt("product_id"), "product_name asc");
					if (c.size() > 0) {
						Variant r = c.elementAt(0);
						Toast.makeText(getApplicationContext(), r.getString("product_name")+" барааны үлдэгдэл хүрэлцэхгүй болсон байна !", Toast.LENGTH_SHORT).show();
					} else
						Toast.makeText(getApplicationContext(), "Таны сонгосон барааны үлдэгдэл хүрэлцэхгүй болсон байна !", Toast.LENGTH_SHORT).show();
					assembly = true;
					break;
				}				
			}
			
			if (!assembly)			
				padaan_list();
		} else
		if (command.equals("send_service")) {
			new_service();		
			if (!WARE_CHOOSEN)
				product_list_reload("warehouse_id", "1");
			else
				product_list_reload("warehouse_id", activeWare);
			customer();
		} else
		if (command.equals("send_case")) {			
			case_list();
		} else
		if (command.equals("send_unsuccess_service")) {						
			
		} else
		if (command.equals("send_customer")) {
			if (result.length() > 0) {
				Toast.makeText(getApplicationContext(), "Амжилттай !", Toast.LENGTH_LONG).show();
			} else
				Toast.makeText(getApplicationContext(), "Амжилтгүй боллоо дахин оролдоно уу !", Toast.LENGTH_LONG).show();
			customer();
		} else
		if (command.equals("call_me")) {			
			see_total_list();
		} else
		if (command.equals("service_customer_list")) {			
			ServiceCustomerAdapter adapter = new ServiceCustomerAdapter(this, R.layout.list_item, collection);
			list.setAdapter(adapter);
			list.setOnItemClickListener(new OnItemClickListener() {

				@Override
				public void onItemClick(AdapterView<?> a, View v, int pos, long t) {
					//activeRoute = collection.elementAt(pos).getString("crm_name");
					//reload_customer(customer_type);			
					Log.d("OOOOOOO", collection.elementAt(pos).getString("crm_id"));
					clicked_crm = collection.elementAt(pos).getString("crm_name")+"|"+collection.elementAt(pos).getString("crm_id");
					clicked_warehouse = collection.elementAt(pos).getString("warehouse");
					activeSelect = "product_in_crm";
					command = "call_me";
					new TaskExecution().execute();
					//Log.d("CLICKED", collection.elementAt(pos).getString("crm_name")+" | "+logged+" | "+collection.elementAt(pos).getString("warehouse"));
				}
				
			});
		} else
		if (command.equals("send_lease")) {			
			service_list();
		}
	}
	
	public void preStarting() {
		if (pd != null && pd.isShowing()) pd.dismiss();
		pd = ProgressDialog.show(this, "", "", true, false);		
		pd.setContentView(R.layout.dialog_loading);
		
		RotateAnimation anim = new RotateAnimation(0f, 360f, getResources().getDrawable(R.drawable.boot).getIntrinsicWidth()/2, getResources().getDrawable(R.drawable.boot).getIntrinsicWidth()/2);
		anim.setInterpolator(new LinearInterpolator());		
		anim.setRepeatCount(Animation.INFINITE);
		anim.setDuration(700);

		ImageView splash = (ImageView)pd.findViewById(R.id.loading);
		splash.startAnimation(anim);
		
		pd.show();
	}
	
	public void preProcessing() {
		if (command.equals("login")) {
			//olson
			xml = parser.getXmlToLogin(getURL(), u+","+p);
			Log.d("SSSSSS", getURL()+"   "+ u+","+p);
		} else
		if (command.equals("customer")) {								
			XMLParser parser = new XMLParser();
			int customer_type = 1;
			//if (Shared.FRONT_SALE) customer_type = 0;
			collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng", "customer_type="+customer_type+" and owner='"+logged+"'", "firstname asc");
			if (collection.size() == 0 || init_reload) {
				init_reload = false;
				collection = parser.getCollection(this, getURL(), "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng", "customer", "crm_customer_xml_list", "", logged);
				if (collection.size() > 0) {
					Shared.sql.deleteAll("Customer");
					Shared.sql.insertCollection("Customer", collection, "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng");								 
				}															
			}
			
			checkUnsuccess();
		} else
		if (command.equals("call_me")) {
			try{
				if(activeSelect.equals("product_in_crm")){
					collection = parser.getCollection(this, getURL(), "product_id,product_code,product_name,qty,price,amount,type,precent", "service_product", "crm_owner_service_product_xml_list", "", logged+","+todayValue+","+clicked_crm+","+activeSelect+","+clicked_warehouse);
				}else{
					subAmount = 0;
					//Log.d("ACTIVE SELECT DDDDDDDDDDDDDD", activeSelect);
					collection = parser.getCollection(this, getURL(), "product_id,product_code,product_name,qty,price,amount,type,precent", "service_product", "crm_owner_service_product_xml_list", "", logged+","+todayValue+","+activeService.getInt("service_id")+","+activeSelect);
					sub_mta_coll = parser.getCollection(this, getURL(), "ddtd,qrdata,result,date,lottery,ttd", "read_report", "crm_read_test_xml_list", "", activeService.get("subject"));
					subAmount += Double.parseDouble(collection.elementAt(0).get("amount")); 
					noatSub = money_4(subAmount/11)+"";
					if(sub_mta_coll.elementAt(0).get("lottery").equals(""))
						nhatSub = "0.00";
					nhatSub = money_4(subAmount*0.01)+"";
					qrdata = sub_mta_coll.elementAt(0).get("qrdata");
				//	Log.d("OROODIRLEEDEE", noatSub);
					//collection.removeAt(1);
				}
				
			}catch(Exception e){
				
			}
			
		} else
		if (command.equals("service_customer_list")) {			
			collection = parser.getCollection(this, getURL(), "crm_id,crm_name,warehouse,amount", "service_customer", "crm_owner_service_customer_xml_list", "", logged+","+todayValue);
			//collection.removeAt(1);
			
		} else
		if (command.equals("deal_list")) {			
			collection = parser.getCollection(this, getURL(), "deal_id,crm_id,crm_name,deal,phone,expected_revenue,probablity,status,closing_date,remind_date,stage,descr,owner,usercode,campaign,competitor_name,current_situation,customer_need,proposed_solution,_date,notify,deal_origin,company", "deals", "crm_deal_xml_list", "", activeCRM.getInt("crm_id")+"");
			//collection.removeAt(1);			
		} else
		if (command.equals("service_list")) {
			XMLParser parser = new XMLParser();
			if (logged.indexOf("bosa") != -1){
				collection = parser.getCollection(this, getURL(), "service_id,crm_id,crm_name,subject,phone,service_revenue,service_debt,closing_date,remind_date,service_stage,descr,owner,usercode,campaign,_date,total", "services", "crm_service_xml_list", "", activeCRM.getInt("crm_id")+","+logged);	
			}
			else
				collection = parser.getCollection(this, getURL(), "service_id,crm_id,crm_name,subject,phone,service_revenue,service_debt,closing_date,remind_date,service_stage,descr,owner,usercode,campaign,_date,total", "services", "crm_service_xml_list", "", activeCRM.getInt("crm_id")+"");
			//collection.removeAt(1);
			
		} else
		if (command.equals("case_list")) {
			XMLParser parser = new XMLParser();
			collection = parser.getCollection(this, getURL(), "case_id,crm_id,crm_name,complain_type,complain_origin,priority,phone,calltype,call_from,email,descr,closing_date,case_stage,resolution_type,resolution,_date,complain_reason,complain_status,userCode,owner,groupId,notify", "case", "crm_case_xml_list", "", activeCRM.getInt("crm_id")+"");
			//collection.removeAt(1);
			
		} else
		if (command.equals("send_location")) {
			XMLParser parser = new XMLParser();
			parser.getXmlUpdateUrl(getURL(), "crm_customer", "lat="+activeCRM.getFloat("lat")+",lng="+activeCRM.getFloat("lng"), "crm_id="+activeCRM.getInt("crm_id"));
			//collection.removeAt(1);
			
		} else
		if (command.equals("activity_list")) {
			XMLParser parser = new XMLParser();
			collection = parser.getCollection(this, getURL(), "id,crm_name,crm_id,subject,deal_id,case_id,deal_name,days,times,work_type,priority,descr,status,owner,source,campaign,_date", "activity", "crm_customer_activity_xml_list", "crm_id", activeCRM.getInt("crm_id")+"");
			//collection.removeAt(1);
			
		} else
		if (command.equals("report_list")) {
			XMLParser parser = new XMLParser();
			Log.d("d", activeCRM.getInt("crm_id")+","+todayValue);
			
		/*	final BixolonManager bixolon = new BixolonManager(this);
			bixolon.startBixolon();
			
			bixolon.printImage(saveBitmapToDisk(generateQrCode("1403019164817719579665126561894469976130652762816828117644270007998683661094841978184327447910488828970698911011514720817950894799804600727791109116390707170533932247310054748352188726165007830731865978308035204448796506036685979093322247128205428149468868141911535856715338309505788233193020882139121084822697354112")));*/
			
			/*String message="abcdef any message 12345";
			byte[] send;
			send = message.getBytes();
			bixolon.sendData(send);*/
			
			
			
			/*try{
				JSONObject outerObject = new JSONObject();
				JSONArray outerArray = new JSONArray();
				JSONObject innerObject = new JSONObject();
				
				outerObject.put("amount", "88000.00");
				outerObject.put("vat", "880.00");
				outerObject.put("cashAmount", "88000.00");
				outerObject.put("nonCashAmount", "0.00");
				outerObject.put("billIdSuffix", "");
				outerObject.put("cityTax", "0.00");
				outerObject.put("bankTransactions", null);
				outerObject.put("districtCode", "54");
				outerObject.put("posNo", "000054");
				outerObject.put("billType", "3");
				
					innerObject.put("code", "1234");
					innerObject.put("name", "2");
					innerObject.put("qty", "2.00");
					innerObject.put("unitPrice", "200.00");
					innerObject.put("measureUnit", "sh");
					innerObject.put("totalAmount", "4000.00");
					innerObject.put("vat", "0.00");
					innerObject.put("barCode", "123412345");
					innerObject.put("cityTax", "0.00");
					outerObject.put("stocks", outerArray);
					outerArray.put(innerObject);
				
					Collection test_coll = parser.getCollection(this, getURL(), "ddtd,qrdata,result,date,lottery", "report", "crm_test_xml_list", "", outerObject.toString());
				//Log.d("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ", test_coll.elementAt(0).get("result"));
					Log.d("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ", activeCRM.getString("regno"));
			}
			catch(Exception e){
				
			}*/
			
			collection = parser.getCollection(this, getURL(), "product_name,product_code,qty,amount", "report", "crm_customer_monthly_report_xml_list", "", activeCRM.getInt("crm_id")+","+todayValue);
			//collection.removeAt(1);
			
		} else
		if (command.equals("check_padaan")) {	
			String where = "";
			if (!self_order && Shared.FRONT_SALE) where = logged;
			Log.d("d", "where "+where);
			String value = "product_id,last";
			if(ONLY_BOSA_TWO_WARE){
				value = "product_id,last,last1,last2";
			}
			if (logged.indexOf("battrade") != -1) {
				where = activeWare+","+logged+","+activity;
			}
			Collection f_collection = parser.getCollection(this, getURL(), value, "product_available", "crm_product_available_xml_list", "", where);
			if (f_collection.size() > 0) filter_collection = f_collection;			
		} else
		if (command.equals("product_list")) {
			XMLParser parser = new XMLParser();
			if (STORAGE_FAN) {
				String where = "";
				if (!self_order && Shared.FRONT_SALE) where = logged;
				String value = "product_id,last";
				if(ONLY_BOSA_TWO_WARE){
					value = "product_id,last,last1,last2";
				}
				if (logged.indexOf("battrade") != -1) {
					where = activeWare+","+logged+","+activity;
				}
				Collection f_collection = parser.getCollection(this, getURL(), value, "product_available", "crm_product_available_xml_list", "", where);
				if (f_collection.size() > 0) filter_collection = f_collection;
			}else{
				if (logged.indexOf("cosmo") != -1){
					Collection f_collection = parser.getCollection(this, getURL(), "product_id,last", "product_available", "crm_product_available_xml_list", "", logged);
					if (f_collection.size() > 0) filter_collection = f_collection;
				}
			}
			
			String time = getData("last_time", "");
			if (!time.equals(today())) init_reload = true;
			
			boolean ware_reload = init_reload;
			if (WARE_CHOOSEN)
				collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "warehouse_id="+activeWare, product_sort_field+" asc");
			else
				collection = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", null, product_sort_field+" asc");
			if (collection.size() == 0 || init_reload) {
				init_reload = false;
				String where = "";
				if(ALL_PRODUCTS_IN_TWO_WAREHOUSE){
					where = getData("team", ""); 
				}
				
				if (logged.indexOf("voltam") != -1) {
					where = getData("team", ""); 
				}
				
				collection = parser.getCollection(this, getURL(), "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount", "products", "crm_product_xml_list", "", where);
				if (collection.size() > 0) {
					Shared.sql.deleteAll("Products");
					Shared.sql.insertCollection("Products", collection, "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i,f", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id,discount");
					setData("last_time", today());
				}								
			}
			
			String sort = "warehouse_id asc";
			if (logged.indexOf("battrade") != -1) {
				sort = "warehouse_id desc";
			}
			Collection warehouse_collection = Shared.sql.selectAll("WareHouse", "i,s", "warehouse_id,name", null, sort);
			String where ="";
			if (logged.indexOf("battrade") != -1) {
				where = logged;
			}
			if (warehouse_collection.size() == 0 || ware_reload) {								
				warehouse_collection = parser.getCollection(this, getURL(), "warehouse_id,name", "warehouse", "crm_warehouse_xml_list", "type='storage'", where);
				if (warehouse_collection.size() > 0) {
					Shared.sql.deleteAll("WareHouse");
					Shared.sql.insertCollection("WareHouse", warehouse_collection, "i,s", "warehouse_id,name");								 
				}															
			}																			
		} else
		if (command.equals("send_service") || command.equals("send_unsuccess_service")) {
			XMLParser parser = new XMLParser();
			service.put("service_qty", "i"+service_product_list.size());
			parser.getXmlToUrl(getURL(), "crm_services", service.json(""), activeCRM.getInt("crm_id"));//BsFQ1t
			
			for (int i = 0; i < service_product_list.size(); i++) {				
				Variant w = service_product_list.elementAt(i);				
				parser.getXmlToUrl(getURL(), "crm_deal_products", w.json("product_name,"), activeCRM.getInt("crm_id"));//BsFQ1t	
			}
			
			if (Shared.FRONT_SALE && service.getString("service_stage").equals("service"))
				parser.getXmlFromCompleteUrl(getURL(), "", "subject", service.getString("subject"));
		} else
		if (command.equals("send_case")) {
			XMLParser parser = new XMLParser();
			parser.getXmlToUrl(getURL(), "crm_complain", newcase.json(""), activeCRM.getInt("crm_id"));//BsFQ1t			
		} else
		if (command.equals("send_customer")) {
			XMLParser parser = new XMLParser();
			result = parser.getXmlToUrl(getURL(), "crm_customer", sendCRM.json(""), activeCRM.getInt("crm_id"));
						
			int customer_type = 1;
			init_reload = true;
			//if (Shared.FRONT_SALE) customer_type = 0;
//			collection = Shared.sql.selectAll("Customer", "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng", "customer_type="+customer_type+" and owner='"+logged+"'", "firstname asc");
			if (init_reload) {
				init_reload = false;
				collection = parser.getCollection(this, getURL(), "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng", "customer", "crm_customer_xml_list", "", logged+","+today());
				if (collection.size() > 0) {
					//Shared.sql.deleteAll("Customer");
					Shared.sql.insertCollection("Customer", collection, "i,s,i,s,s,s,s,s,s,s,s,s,s,s,s,s,s,f,f,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,i,i,s,s,f,f", "crm_id,synckey,parent_crm_id,type,_class,regno,firstname,lastname,engname,birthday,gender,company_torol,employees,industry,industry_sub,sorog_huchin,promo_code,promo_precent,promo_amount,title,job_title,phone,phone1,phone2,fax,email,www,_date,level,country,city,district,horoo,address,usercode,descr,source,owner,campaign,mayduplicate,customer_type,priority,pricetag,lat,lng");								 
				}															
			}			
		} else
		if (command.equals("send_lease")) {
			XMLParser parser = new XMLParser();
			result = parser.getXmlToUrl(getURL(), "crm_service_payroll", sendVariant.json(""), activeCRM.getInt("crm_id"));			
		}	
			
		
		pd.cancel();
	}	
	
	public class TaskExecution extends AsyncTask<Void, Void, Void> {
      	
		 @Override
		 protected void onPostExecute(Void result) {
			 completeReading();
		 }

		 @Override
		 protected void onPreExecute() {
			 preStarting();
		 }

		 @Override
		 protected void onProgressUpdate(Void... values) {
			 super.onProgressUpdate(values);
			 
		 }

		 @Override
		 protected Void doInBackground(Void... arg0) {
			 preProcessing();
			 return null;
		 }
	}
		
    
	@Override
	public void onItemClick(AdapterView<?> a, View v, int pos, long arg3) {
		if (activity.equals("customer")) {
			customer_last_selection = pos;
			activeCRM = customer_adapter.getItem(pos);			
			detail();
		} else
		if (activity.equals("service")) {
			activeService = service_adapter.getItem(pos);
			reload_see_list();
		}
	}
	
	public void restart() {
		Intent mStartActivity = new Intent(this, MainActivity.class);
    	int mPendingIntentId = 123456;
    	PendingIntent mPendingIntent = PendingIntent.getActivity(this, mPendingIntentId, mStartActivity, PendingIntent.FLAG_CANCEL_CURRENT);
    	AlarmManager mgr = (AlarmManager)this.getSystemService(Context.ALARM_SERVICE);
    	mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 100, mPendingIntent);
    	System.exit(0);
	}
	
	public void home() {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та програмаас гарах гэж байна уу?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) {
	        	dialog.dismiss();
	        	restart();
	        }
	     })
	    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	dialog.dismiss();	        	
	        }
	     })
	    .setIcon(android.R.drawable.ic_dialog_alert)
	    .show();		
	}

	public void check_service_list() {
		if (service_product_list.size() > 0) {
			new AlertDialog.Builder(this)
		    .setTitle("Анхааруулга")
		    .setMessage("Та оруулсан захиалгаа цуцлах гэж байна ?")
		    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
		        @Override
				public void onClick(DialogInterface dialog, int which) {
		        	dialog.dismiss();
		        	service_list();
		        }
		     })
		    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
		        @Override
				public void onClick(DialogInterface dialog, int which) { 
		        	dialog.dismiss();	        	
		        }
		     })
		    .setIcon(android.R.drawable.ic_dialog_alert)
		    .show();		
		} else
			service_list();
	}

	@Override
	public void onClick(View v) {
		String tag = v.getTag().toString();
		
		if (tag.equals("search_onoff")) {
			if (linear.containsKey("search_bar")) {
				if (linear.get("search_bar").getVisibility() == View.GONE)
					linear.get("search_bar").setVisibility(View.VISIBLE);
				else
					linear.get("search_bar").setVisibility(View.GONE);
			}
		} else
		if (tag.equals("clear_search")) {
			edits.get("search_value").setText("");
		} else
		if (tag.equals("add_service")) {
			
			/*try{
				JSONObject obj = new JSONObject();
	            try {
	                obj.put("id", "3");
	                obj.put("name", "NAME OF STUDENT");
	                obj.put("year", "3rd");
	                obj.put("curriculum", "Arts");
	                obj.put("birthday", "5/5/1993");

	            } catch (JSONException e) {
	                // TODO Auto-generated catch block
	                e.printStackTrace();
	            }
	             JSONArray js=new JSONArray(obj.toString());
	             JSONObject obj2 = new JSONObject();
	             obj2.put("student", js.toString());
	             
	             Log.d("JSJSJSJSJ",  obj2.toString(0));
	             
			}catch(Exception e){
			
			}*/
			
			
			if(MUST_ON_GPS){
				GPSManager gps = new GPSManager(MainActivity.this);
		        gps.start();
		        if(gps.isActive){
		        	//Log.d("ACTIVECRM", activeCRM.get("lat")+"   "+activeCRM.get("lng"));
		        	double crmLat = Double.parseDouble(activeCRM.get("lat")) ;
		        	double crmLnt = Double.parseDouble(activeCRM.get("lng")) ;
		        	String value = "10";
		        		   value = distance(crmLat,crmLnt,Shared.currentLat,Shared.currentLng,"K")+"";
		        	
		        	value = value.replace('.', ' ');
		        	String[] val = value.split(" ");
		        	int km = Integer.parseInt(val[0]);
		        	
		        	
		        	Log.d("LOCATION",Shared.currentLat+" lng "+Shared.currentLng);
		        	//if(km >= 1){
		        		//Toast.makeText(getApplicationContext(), "Та уг дэлгүүрээс хол зайд байна! Эсвэл дэлгүүрийн байршлыг шинэчилж илгээнэ үү!", Toast.LENGTH_LONG).show();
		        	//}else{
		        		add_service();
		        	//}
		        }
			}else{
				
				add_service();
			}
		} else 
		if (tag.equals("add_return")) {
			add_return();
		} else
		if (tag.equals("add_case")) {
			add_case();
		} else
		if (tag.equals("location")) {
			map();
		} else
		if (tag.equals("product_filter")) {
			product_filter();
		} else
		if (tag.equals("ware_filter")) {
			ware_filter();
		} else
		if (tag.equals("back_customer")) {
			if (activity.equals("customer")) {
				home();
			}
			else
			if (activity.equals("detail"))
				customer();
			else			
			if (activity.equals("add_service")) {
				if (self_order) {
					customer();					
				} else					
					check_service_list();
			}else
			if (activity.equals("add_return")) {
				if (self_order) {
					customer();					
				} else					
					check_service_list();
			}
			else			
			if (activity.equals("add_case")) {				
				case_list();
			}
			else
			if (activity.equals("image"))
				add_service();
			else
			if (activity.equals("map"))
				service_list();
			else
			if (activity.equals("deal") || activity.equals("service") || activity.equals("case"))
				detail();
			else
			if (activity.equals("activity"))
				detail();				
			else
			if (activity.equals("report"))
				detail();	
		}
	}
}
