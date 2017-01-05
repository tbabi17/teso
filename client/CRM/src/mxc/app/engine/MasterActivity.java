package mxc.app.engine;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;
import java.util.List;

import mxc.bluetooth.printer.BixolonManager;
import mxc.bluetooth.printer.BixolonManager400;
import mxc.bluetooth.printer.TP10Manager;
import mxc.optimal.crm.R;

import org.json.JSONArray;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Shader;
import android.graphics.drawable.BitmapDrawable;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Environment;
import android.os.Handler;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewCompat;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

public class MasterActivity extends FragmentActivity implements OnClickListener {
	public Variant activeCRM = new Variant(), activeProduct = new Variant(), activeService = new Variant(), sendVariant = new Variant(), newcase = new Variant();
	
	public static final int RELATIVE = 1;
	public static final int LINEAR = 2;
	public static final int FRAME = 3;
	
	public static final int DATE_DIALOG_ID = 20;
	
	public static final int DISMISS = 100;	
	public int width, height;		
	public int dpi;
	
	public ProgressDialog pd;		
	public Hashtable <String, TextView> texts = new Hashtable<String, TextView>();
	public Hashtable <String, EditText> edits = new Hashtable<String, EditText>();
	public Hashtable <String, LinearLayout> linear = new Hashtable<String, LinearLayout>();
	
    public Collection collection = new Collection();
    public Collection filter_collection = new Collection();
    public Variant service = new Variant();
    public Collection service_product_list = new Collection();
    public String zar_value = "", zar_contact = "";
    
    public CustomerAdapter customer_adapter;
    public ProductAdapter product_adapter;
    public ProductGroupedAdapter product_grouped_adapter;
    public ServiceAdapter service_adapter;
    public CaseAdapter case_adapter;
    public TableLayout table_list;
    
    public JSONObject outerMTAObject;
    public JSONArray outerMTAArray;
    public JSONObject innerMTAObject;
    public Collection mta_coll;
    public Collection sub_mta_coll;
    public String ddtd = "",mtaDate = "", mtaResult = "", qrdata = "", lottery = "", noat = "", nhat = "", noatSub = "", nhatSub = "";
    public double subAmount = 0;
    
    public String activity = "";
    public String activeWare = "1", activeBrand = "", activeRoute = "", activeSelect = "order", activeSelectTitle = "Захиалга";
    public Variant sendCRM = new Variant();
    public boolean init_reload = false;
    public String handle = "menu";
    public String command = "", result = "";
    public String logged = "";
    public double lat, lng;
    public String todayValue = getToday();
    public boolean self_order = false;
    public String page = "svn/crm/avia.php";
    public String u, p, xml;
    public boolean STORAGE_FAN = false;
    public boolean ROGUE = false;
    public boolean PRODUCT_GROUP = false;
    public boolean PRODUCT_SORT = false;
    public boolean PADAAN_SUMMARY_ADDITIONAL = false;
    public boolean QTY_DOUBLE = true;
    public boolean PRODUCT_BUR_DISCOUNT_AVAILABLE = false;
    public boolean SHORT_PRODUCT_NAME = false;
    public boolean TOOLLOGO_FEATURE = false;
    public boolean BELEN_ZEEL = true;
    public boolean SHOW_PRODUCT_AVAILABLE_COUNT = false;
    public boolean ONLY_BOSA_TWO_WARE = false;
    public boolean SHOW_STORAGE_HAMAAGUI = false;
    public boolean HEVLEDEGGUI = false;
    
    public boolean PRINT_BY_COLUMN = false;
    public String clicked_crm = "",clicked_warehouse = "";
    public String product_detail_title = "";
    public String product_detail = "product_brand";
    public String product_padaan_field = "product_name";
    public String product_sort_field = "product_type";
    public String padaan_row_line = "";
    public String padaan_row_line_en = "";
    public String padaan_row_line_box = "";
    public String MAINREGNO = "";       
    public boolean box_if = false;
    public boolean PAYMENT_EDIT_AVAILABLE = true;
    public boolean PRICE_CHOOSEN = false;
    public boolean WARE_CHOOSEN = true;
    public boolean MUST_INSERT_REGNO = false;
    public boolean ENABLE_RETURN = false;
    public boolean SHOW_UNSUCCESS_SERVICE = false;
    public boolean CUSTOMER_SORT_TYPE = false;
    public boolean MUST_ON_GPS = false;
    public boolean MTA = false;
    public boolean ALL_PRODUCTS_IN_TWO_WAREHOUSE = false;
    public String COMPANY = "";
	
    public int [][] printer_width = {{8, 1, 4, 4, 17, 19, 12, 0},
    								 {-13, 0, -1, 2, -13, -15, 36, 12, -3}};
    
    public int printer_index = 0;
    public String printer_model = "BIXOLON";
    
    public BixolonManager400 bixolon400 = new BixolonManager400();
    public ImageLoader imgLoader;
    public String ip = "";
    public int GPS_INTERVAL = 1; //minute
    
    public String image_url = "svn/crm/product_images/";
    
    public String version = "3.2";
    
    public String customPriceTag = "";
    public int customPriceIndex = 1;
    public String[] priceTitles = new String[11];
    
    public String getURL() {
    	ip = "";
    	if (logged.length() > 0) u = logged;
    	if (u == null) u = getData("logged", "");
    	if (u.indexOf("cosmo") != -1) {
    		ip = "http://202.21.105.35:88/";
    		//ip = "http://10.220.113.78:81/";
    		COMPANY = "COSMO BUUNII TUV";
    		STORAGE_FAN = false;
    		PRODUCT_GROUP = false;
    		product_sort_field = "product_name";
    		PRODUCT_SORT = false;
    		printer_model = "BIXOLON400";
    		printer_index = 1;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_BUR_DISCOUNT_AVAILABLE = true;
    		BELEN_ZEEL = false;
    		PRINT_BY_COLUMN = true;
    		GPS_INTERVAL = 10;
    		product_detail_title = "Баркод: ";
    		product_detail = "product_barcode";
    		SHOW_UNSUCCESS_SERVICE = true;
    		MTA = false;
    	} else
		if (u.indexOf("msm") != -1) {
    		ip = "http://103.48.116.88/";
    		COMPANY = "MSM";
    		page = "svn/crm_msm/avia.php";
    		STORAGE_FAN = true;
    		PRODUCT_GROUP = false;
    		product_sort_field = "product_name";
    		PRODUCT_SORT = false;
    		printer_model = "BIXOLON400";
    		printer_index = 1;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_BUR_DISCOUNT_AVAILABLE = true;
    		BELEN_ZEEL = false;
    		PRINT_BY_COLUMN = true;
    		GPS_INTERVAL = 10;
    		product_detail_title = "Баркод: ";
    		product_detail = "product_barcode";
    	} else
    	if (u.indexOf("battrade") != -1) {
    		COMPANY = "BATTRADE";
    		page = "svn/crm/avia.php";
    		ip = "http://103.48.116.112:85/";
    		//ip = "http://10.220.113.11:81/";
    		/*STORAGE_FAN = true;
    		PRODUCT_GROUP = true;
    		printer_model = "BIXOLON";
    		product_sort_field = "product_name";
    		PRODUCT_SORT = false;
    		HEVLEDEGGUI = true;
    		BELEN_ZEEL = false;
    		GPS_INTERVAL = 3;
    		SHOW_PRODUCT_AVAILABLE_COUNT = true;*/
    		SHOW_UNSUCCESS_SERVICE = true;
    		ENABLE_RETURN = true;
    		STORAGE_FAN = true;
            PRODUCT_GROUP = true;
            PRODUCT_SORT = false;
            SHOW_PRODUCT_AVAILABLE_COUNT = true;
            SHOW_STORAGE_HAMAAGUI = false;
            WARE_CHOOSEN = false;
            ONLY_BOSA_TWO_WARE = true;
            HEVLEDEGGUI = true;
            GPS_INTERVAL = 3;
            ALL_PRODUCTS_IN_TWO_WAREHOUSE = true;
           //  MTA = true;
    	} else
    	if (u.indexOf("voltam") != -1) {
    		COMPANY = "VOLTAM LLC";
    		ip = "http://202.70.43.26:85/";
    		STORAGE_FAN = true;
    		PRODUCT_GROUP = false;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_SORT = true;
    		QTY_DOUBLE = false;
    		PADAAN_SUMMARY_ADDITIONAL = false;
    		BELEN_ZEEL = true;
    		PAYMENT_EDIT_AVAILABLE = true;
    		SHOW_PRODUCT_AVAILABLE_COUNT = true;
    		TOOLLOGO_FEATURE = true;
    		MAINREGNO = "";
    		MTA = false;
    	} else  
		if (u.indexOf("mxc") != -1) {
    		COMPANY = "MXC LLC";
    		ip = "http://10.220.113.8:80/";
    		page = "svn/oss/avia.php";
    		STORAGE_FAN = true;
    		PRODUCT_GROUP = false;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_SORT = true;
    		QTY_DOUBLE = false;
    		PADAAN_SUMMARY_ADDITIONAL = false;
    		BELEN_ZEEL = true;
    		PAYMENT_EDIT_AVAILABLE = true;
    		SHOW_PRODUCT_AVAILABLE_COUNT = true;
    		TOOLLOGO_FEATURE = true;
    		MAINREGNO = "";
    		MTA = false;
    	} else  
    	if (u.indexOf("mtc") != -1) {
    		COMPANY = "Mongol Tamkhi So LLC";
    		ip = "http://202.131.237.182:81/";    		
    		STORAGE_FAN = true;
    		printer_model = "TP10";
    		PRODUCT_GROUP = false;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_SORT = true;
    		QTY_DOUBLE = false;
    		PADAAN_SUMMARY_ADDITIONAL = false;
    		BELEN_ZEEL = true;
    		PAYMENT_EDIT_AVAILABLE = true;
    		SHOW_PRODUCT_AVAILABLE_COUNT = true;
    		TOOLLOGO_FEATURE = true;
    		CUSTOMER_SORT_TYPE = true;
    		MAINREGNO = "2623803";
    		ROGUE = true;
    		
    	} else
		if (u.indexOf("glf") != -1) {
    		ip = "http://202.70.43.26:85/";
    		page = "svn/glo/avia.php";
    		COMPANY = "GLF LLC";
    		STORAGE_FAN = false;
    		PRODUCT_GROUP = false;
    		product_sort_field = "product_name";
    		PRODUCT_SORT = false;
    		printer_model = "BIXOLON";
    		printer_index = 1;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_BUR_DISCOUNT_AVAILABLE = true;
    		BELEN_ZEEL = false;
    		PRINT_BY_COLUMN = true;
    		GPS_INTERVAL = 3;
    		PRICE_CHOOSEN = true;
    		image_url = "svn/glo/product_images/";
    		
    		priceTitles[1] = "A үнэ";
    		priceTitles[2] = "B үнэ";
    		priceTitles[3] = "C үнэ";
    		priceTitles[4] = "D үнэ";
    		priceTitles[5] = "E үнэ";
    		priceTitles[6] = "F үнэ";
    		priceTitles[7] = "G үнэ";
    		priceTitles[8] = "H үнэ";
    		priceTitles[9] = "I үнэ";
    		priceTitles[10] = "J үнэ";
    	} else
    	if (u.indexOf("ntgc") != -1) {
    		ip = "http://103.48.116.112:85/";
    		COMPANY = "NARANTUUL BUUNII TUV";
    		STORAGE_FAN = false;
    		PRODUCT_GROUP = false;
    		product_sort_field = "product_name";
    		PRODUCT_SORT = false;
    		printer_model = "BIXOLON400";
    		printer_index = 1;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_BUR_DISCOUNT_AVAILABLE = true;
    		BELEN_ZEEL = false;
    		PRINT_BY_COLUMN = true;
    		GPS_INTERVAL = 10;
    		page = "svn/ntgc/avia.php";
    		image_url = "svn/ntgc/product_images/";
    	} else
    	if (u.indexOf("bosa") != -1) {
    		COMPANY = "BOSA IMPEX";
            page = "svn/crm_bosa/avia.php";
            //this.ip = "http://202.131.227.78:85/";
            ip = "http://103.48.116.88:80/";
            image_url = "svn/crm_bosa/product_images/";
            STORAGE_FAN = true;
            printer_model = "TP10";
            PRODUCT_GROUP = false;
            SHORT_PRODUCT_NAME = true;
            PRODUCT_SORT = true;
            QTY_DOUBLE = false;
            PADAAN_SUMMARY_ADDITIONAL = false;
            BELEN_ZEEL = true;
            PAYMENT_EDIT_AVAILABLE = true;
            SHOW_PRODUCT_AVAILABLE_COUNT = true;
            SHOW_STORAGE_HAMAAGUI = false;
            WARE_CHOOSEN = false;
            ONLY_BOSA_TWO_WARE = true;
            MTA = false;
            ALL_PRODUCTS_IN_TWO_WAREHOUSE = true;
            MUST_ON_GPS = true;
    	} else
    	if (u.indexOf("hc") != -1) {
    		page = "svn/crm_hc/avia.php";
    		COMPANY = "KHUNS COMPLEX LLC";
    		ip = "http://202.131.237.182:81/";    		
    		STORAGE_FAN = true;
    		PRODUCT_GROUP = false;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_SORT = true;
    		QTY_DOUBLE = false;
    		PADAAN_SUMMARY_ADDITIONAL = false;
    		BELEN_ZEEL = true;
    		PAYMENT_EDIT_AVAILABLE = true;
    		SHOW_PRODUCT_AVAILABLE_COUNT = true;
    	} else
    	if (u.indexOf("crm_et") != -1) {
    		ip = "http://103.48.116.112:85/";
    		COMPANY = "ERDENET GURIL";
    		STORAGE_FAN = false;
    		PRODUCT_GROUP = false;
    		product_sort_field = "product_name";
    		PRODUCT_SORT = false;
    		printer_model = "BIXOLON400";
    		printer_index = 1;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_BUR_DISCOUNT_AVAILABLE = true;
    		BELEN_ZEEL = false;
    		PRINT_BY_COLUMN = true;
    		GPS_INTERVAL = 10;
    		product_detail_title = "Баркод: ";
    		product_detail = "product_barcode";
    	}else
    	if (u.indexOf("teso") != -1) {
    		COMPANY = "TESO";
    		//ip = "http://103.48.116.88:80/";
    		ip = "http://103.48.116.88:80/";
    		page = "svn/crm_teso/avia.php";
    		image_url = "svn/crm_teso/product_images/";
    		STORAGE_FAN = true;
    		PRODUCT_GROUP = false;
    		SHORT_PRODUCT_NAME = true;
    		PRODUCT_SORT = true;
    		printer_model = "BIXOLON";
    		QTY_DOUBLE = false;
    		PADAAN_SUMMARY_ADDITIONAL = false;
    		BELEN_ZEEL = true;
    		PAYMENT_EDIT_AVAILABLE = true;
    		SHOW_PRODUCT_AVAILABLE_COUNT = true;
    		TOOLLOGO_FEATURE = false;
    		ENABLE_RETURN = true;
    		MUST_INSERT_REGNO = true;
    		MAINREGNO = "";
    	} 
    	
    	return ip+page;
    }
    
    public String getImageUrl() {
    	getURL();    	
    	return ip+image_url;
    }
    
    public String getAvatarImageUrl() {
    	getURL();
    	return ip+"svn/crm/images/users/";
    }
    
    public String getUploadUrl() {
    	getURL();
    	return ip+"svn/crm/upload.php";
    }
    
    
    public boolean isOnline() {
    	ConnectivityManager cm = (ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE);    	 
    	NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
    	return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
    }
    
    public LocationService locationService;
    
    public void getGPS() {
        Location l = locationService.getLocation(LocationManager.GPS_PROVIDER);
                        
        if (l != null) {
            lat = l.getLatitude();
            lng = l.getLongitude();
        }       
        
        if (lat == 0 || lng == 0) {
        	l = locationService.getLocation(LocationManager.NETWORK_PROVIDER);
        	if (l != null) {
        		lat = l.getLatitude();
        		lng = l.getLongitude();
        		Log.d("d", " networked");
        	}
        }
    }
    
	public void getDisplaySize() {
		DisplayMetrics metrics = new DisplayMetrics();
		getWindowManager().getDefaultDisplay().getMetrics(metrics);
		height = metrics.heightPixels;
		width = metrics.widthPixels;
		dpi = metrics.densityDpi;
	}
	
	public void setBackgroundDrawable(int drawable_id, int layout_id, int layout_type) {
		getDisplaySize();		
				
		Bitmap bmp = BitmapFactory.decodeResource(getResources(), drawable_id);
        BitmapDrawable wallpaperDrawable = new BitmapDrawable(bmp);       
        wallpaperDrawable.setTileModeXY(Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
         
        switch (layout_type) {
	        case FRAME: 
	    		FrameLayout flayout = (FrameLayout)findViewById(layout_id);
	    		flayout.setBackgroundColor(getResources().getColor(drawable_id)); //setBackgroundDrawable(wallpaperDrawable);
	    		break;
        	case LINEAR: 
        		LinearLayout llayout = (LinearLayout)findViewById(layout_id);
        		llayout.setBackgroundDrawable(getResources().getDrawable(drawable_id));
        		break;
        	case RELATIVE: 
        		RelativeLayout rlayout = (RelativeLayout)findViewById(layout_id);
        		rlayout.setBackgroundColor(getResources().getColor(drawable_id));
        		break;
        }          
        
        setToolbarItems();
        setFooterItems(false, false);
    }
		
	public void setBackground(int drawable_id, int layout_id, int layout_type) {
		getDisplaySize();		
				
		//Bitmap bmp = BitmapFactory.decodeResource(getResources(), drawable_id);
        //BitmapDrawable wallpaperDrawable = new BitmapDrawable(bmp);       
        //wallpaperDrawable.setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT);
         
        switch (layout_type) {
	        case FRAME: 
	    		FrameLayout flayout = (FrameLayout)findViewById(layout_id);
	    		flayout.setBackgroundColor(getResources().getColor(drawable_id)); //setBackgroundDrawable(wallpaperDrawable);
	    		break;
        	case LINEAR: 
        		LinearLayout llayout = (LinearLayout)findViewById(layout_id);
        		llayout.setBackgroundColor(getResources().getColor(drawable_id));
        		break;
        	case RELATIVE: 
        		RelativeLayout rlayout = (RelativeLayout)findViewById(layout_id);
        		rlayout.setBackgroundColor(getResources().getColor(drawable_id));
        		break;
        }          
        
        setToolbarItems();
        setFooterItems(false, false);
    }
	
	public void setToolbarItems() {
		removeToolbarItems();
		LinearLayout layout = (LinearLayout)findViewById(R.id.toolbar);
		View v = getLayoutInflater().inflate(R.layout.toolbar, null);				
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.toolbar_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);
		
		Button settings = (Button)v.findViewById(R.id.settings);
		settings.setTag("settings");
		settings.setOnClickListener(this);
				
		layout.addView(v);
	}
	
	public static String today() {		
		Calendar calendar = new GregorianCalendar();

		int year       = calendar.get(Calendar.YEAR);
		int month      = calendar.get(Calendar.MONTH); 
		int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH); // Jan = 0, not 1		
		
		return year+"-"+((month+1)<10?"0"+(month+1):(month+1))+"-"+(dayOfMonth<10?"0"+dayOfMonth:dayOfMonth);
	}
	
	public void setToolbarItemsMenu() {
		removeToolbarItems();
		LinearLayout layout = (LinearLayout)findViewById(R.id.toolbar);
		View v = getLayoutInflater().inflate(R.layout.toolbar_menu, null);
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.toolbar_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);				
		
		layout.addView(v);
	}
	
	public void setToolbarItemsDetail(String title) {
		removeToolbarItems();
		LinearLayout layout = (LinearLayout)findViewById(R.id.toolbar);
		View v = getLayoutInflater().inflate(R.layout.toolbar_detail, null);
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.toolbar_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);										
		
		Button back = (Button)v.findViewById(R.id.back_customer);
		back.setTag("back_customer");
		back.setText(title);
		back.setOnClickListener(this);
		
		Button reload = (Button)v.findViewById(R.id.refresh);			
		reload.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				reload_any();				
			}
			
		});
		
		layout.addView(v);
	}
	
	public void setToolbarItems(String title) {
		removeToolbarItems();
		LinearLayout layout = (LinearLayout)findViewById(R.id.toolbar);
		View v = getLayoutInflater().inflate(R.layout.toolbar_detail, null);
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.toolbar_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);										
		
		Button back = (Button)v.findViewById(R.id.back_customer);
		back.setTag("back_customer");
		back.setText(title);
		back.setOnClickListener(this);
		
		Button reload = (Button)v.findViewById(R.id.refresh);	
		reload.setVisibility(View.GONE);
		reload.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				reload_any();				
			}
			
		});
		
		layout.addView(v);
	}
	
	public void reload_any() {
		
	}
	
	public void reload() {
		
	}
	
	public void customer_adddialog() {
		
	}
	
	public void setToolbarItemsDetailWithSearch(String title) {
		removeToolbarItems();
		LinearLayout layout = (LinearLayout)findViewById(R.id.toolbar);
		View v = getLayoutInflater().inflate(R.layout.toolbar_search_back, null);
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.toolbar_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);										
		
		Button back = (Button)v.findViewById(R.id.back_customer);
		back.setTag("back_customer");
		back.setText(title);
		back.setOnClickListener(this);
		
		Button filter = (Button)v.findViewById(R.id.filter_button);
		filter.setVisibility(activity.equals("customer") ? View.VISIBLE: View.GONE);
		filter.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				route_filter();			
			}
			
		});	
		
		Button add = (Button)v.findViewById(R.id.add_button);
		add.setVisibility(activity.equals("customer") ? View.VISIBLE: View.GONE);
		add.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				customer_adddialog();				
			}
			
		});	
		
		
		Button refresh = (Button)v.findViewById(R.id.refresh_button);
		refresh.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				reload_alert();				
			}
			
		});	
		
		Button search = (Button)v.findViewById(R.id.search_view);
		search.setTag("search_onoff");		
		search.setOnClickListener(this);		
		
		LinearLayout l = (LinearLayout)v.findViewById(R.id.search_bar);
		linear.put("search_bar", l);
		
		EditText inputSearch = (EditText) v.findViewById(R.id.search_value);
		edits.put("search_value", inputSearch);
		inputSearch.addTextChangedListener(new TextWatcher() {
		    @Override
		    public void onTextChanged(CharSequence cs, int start, int before, int count) {
		    	if (activity.equals("add_service")) {
			        if (count < before) {
			        	if (PRODUCT_GROUP)
			        		product_grouped_adapter.filterData("");
			        	else
			        		product_adapter.resetData();
					}
			        
			        if (PRODUCT_GROUP)
			        	product_grouped_adapter.filterData(cs.toString());
			        else
			        	product_adapter.getFilter().filter(cs.toString());
		    	} else 
		    	if (activity.equals("customer")) {
		    		 if (count < before) {
		    			 customer_adapter.resetData();
					 }
	
			         customer_adapter.getFilter().filter(cs.toString());
		    	}
		    }
		    @Override
		    public void beforeTextChanged(CharSequence arg0, int arg1, int arg2, int arg3) { 
		    	
		    }
		    @Override
		    public void afterTextChanged(Editable arg0) {
		    	
		    }
		});
		
		layout.addView(v);
	}	
	
	public void route_filter() {
		
	}
	
	public void reload_alert() {
		new AlertDialog.Builder(this)
	    .setTitle("Анхааруулга")
	    .setMessage("Та мэдээллээ шинэчилэхдээ итгэлтэй байна уу?")
	    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
	        @Override
			public void onClick(DialogInterface dialog, int which) { 
	        	if (activity.equals("customer")) {
					init_reload = true;
					command = "customer";					
					reload();
				} else
				if (activity.equals("add_service")) {
					imgLoader.clearCache();
					init_reload = true;
					command = "product_list";
					reload();
				}
				dialog.dismiss();
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
	
	public void reload_customer_list() {
		init_reload = true;
		command = "customer";					
		reload();
	}
	
	public void removeToolbarItems() {
		LinearLayout layout = (LinearLayout)findViewById(R.id.toolbar);
		layout.removeAllViews();
	}
		
	public void setFooterItems(boolean refresh, boolean tools) {		
		LinearLayout bottom = (LinearLayout)findViewById(R.id.footer);
		bottom.removeAllViews();
		
		View v = getLayoutInflater().inflate(R.layout.footer, null);
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.footer_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);
		
		TextView f1 = (TextView)v.findViewById(R.id.f1);
		f1.setTypeface(Shared.tf[2]);
		
		bottom.addView(v);
	}
	
	public void setFooterPageItems() {		
		LinearLayout bottom = (LinearLayout)findViewById(R.id.footer);
		bottom.removeAllViews();
		
		View v = getLayoutInflater().inflate(R.layout.footer_page, null);
		LinearLayout panel = (LinearLayout)v.findViewById(R.id.footer_layout);
		TableRow.LayoutParams params = new TableRow.LayoutParams(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);		
		panel.setLayoutParams(params);
		
		TextView f1 = (TextView)v.findViewById(R.id.f1);
		f1.setTypeface(Shared.tf[2]);
		texts.put("ff1", f1);
		
		TextView f2 = (TextView)v.findViewById(R.id.f2);
		f2.setTypeface(Shared.tf[2]);
		texts.put("ff2", f2);
		
		bottom.addView(v);
	}
	
	
	public void removeFooterItems() {		
		LinearLayout bottom = (LinearLayout)findViewById(R.id.footer);
		bottom.removeAllViews();		
	}
	
	
	public void initComponents() {
		
	}
	
	@Override
	public void onClick(View v) {
		String tag = v.getTag().toString();
		
		
	}
	
	public Bitmap getBitmapFromAsset(String strName) 
    {
		try {
	        AssetManager assetManager = getAssets();
	        InputStream istr = assetManager.open(strName);
	        if (istr.available() > 0) {
	        	Bitmap bitmap = BitmapFactory.decodeStream(istr);
	        	istr.close();
	        	return bitmap;
	        } else {
	        	istr = assetManager.open("44d.png");
	        	Bitmap bitmap = BitmapFactory.decodeStream(istr);
	        	istr.close();
	        	return bitmap;
	        }
	        	
		} catch (Exception ex) {			
	        
		}
		
		return null;//getResources().getDrawable(R.drawable.w1);
    }
	
	public class CustomerAdapter extends ArrayAdapter<Variant> implements Filterable {     
		Collection unsuccess;
		
        public CustomerAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId, collection.getCollection());
        	this.planetList = collection.getCollection();    		
    		this.origPlanetList = planetList;
    		this.unsuccess = Shared.sql.selectAll("JsonList", "i", "crm_id", null, null);    		
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = planetList.get(position);
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.list_item_2, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            tt.setText((position+1)+". "+o.get("firstname"));
            bt.setText(o.get("address"));
            if (o.getString("lastVisit").equals(getToday()))
            	tt.setCompoundDrawablesWithIntrinsicBounds(null, null, getResources().getDrawable(R.drawable.success), null);
            
            if (unsuccess.queryIntHave("crm_id", o.getInt("crm_id"))) {
            	o.put("unsuccess", "yes");
            	tt.setCompoundDrawablesWithIntrinsicBounds(null, null, getResources().getDrawable(R.drawable.error), null);
            }
            return v;
        }
        
        @Override
		public int getCount() {
    		return planetList.size();
    	}

    	@Override
		public Variant getItem(int position) {
    		return planetList.get(position);
    	}

    	@Override
		public long getItemId(int position) {
    		return planetList.get(position).hashCode();
    	}
        
        @Override
		public Filter getFilter() {
			if (planetFilter == null)
    			planetFilter = new PlanetFilter();

    		return planetFilter;
		}
		
		public void resetData() {
    		planetList = origPlanetList;
    	}
		
		private class PlanetFilter extends Filter {
    		@Override
    		protected FilterResults performFiltering(CharSequence constraint) {
    			FilterResults results = new FilterResults();
    			if (constraint == null || constraint.length() == 0) {
    				results.values = origPlanetList;
    				results.count = origPlanetList.size();
    			}
    			else {
    				String latin = convertToLatin(constraint.toString().toLowerCase());
    				List<Variant> nPlanetList = new ArrayList<Variant>();

    				for (Variant p : planetList) {    					
    					if (p.getString("engname").toLowerCase().startsWith(constraint.toString().toLowerCase()) ||
    						p.getString("firstname").toLowerCase().startsWith(constraint.toString().toLowerCase()) ||
    						p.getString("firstname").toLowerCase().startsWith(latin))
    						nPlanetList.add(p);
    				}

    				results.values = nPlanetList;
    				results.count = nPlanetList.size();

    			}
    			return results;
    		}

    		@Override
    		protected void publishResults(CharSequence constraint, FilterResults results) {    		
    			if (results.count == 0)
    				notifyDataSetInvalidated();
    			else {
    				planetList = (List<Variant>) results.values;
    				notifyDataSetChanged();
    			}
    		}
    	}
		
		public List<Variant> planetList;    	
		public Filter planetFilter;
		public List<Variant> origPlanetList;   
    	
    	public String convertToLatin(String string) {
        	if (string.indexOf('|') != -1) string = string.substring(0, string.indexOf('|'));
        	String [] array = new String[10000];
        	array['a'] = "а";array['k'] = "к";array['u'] = "у";
        	array['b'] = "б";array['l'] = "л";array['x'] = "х";
        	array['c'] = "ц";array['m'] = "м";array['y'] = "я";
        	array['d'] = "д";array['n'] = "н";array['z'] = "з";
        	array['e'] = "э";array['o'] = "о";
        	array['f'] = "ф";array['p'] = "п";
        	array['g'] = "г";array['q'] = "к";
        	array['h'] = "х";array['r'] = "р";
        	array['i'] = "и";array['s'] = "с";
        	array['j'] = "ж";array['t'] = "т";        	  
        	
        	String result = "";
        	for (int i = 0; i < string.length(); i++) {
        		if (array[string.charAt(i)] != null)
        			result += array[string.charAt(i)];
        		else
        			result += string.charAt(i);
        	}
        	
        	return result;
        }
    }
	
	public String fillRight(int p, String v) {
		String white_space = "";
		while (v.length() + white_space.length() < p) 
			white_space += " ";
		
		return white_space+v;
	}
	
	public String fillLine(int p, String v) {
		String line = "";
		while (line.length() < p) 
			line += "-";
		
		return line;
	}
	
	public String fillLeft(int p, String v) {
		String white_space = "";
		while (v.length() + white_space.length() < p) 
			white_space += " ";
		
		return v+white_space;
	}
	
	public double distance(double lat1, double lon1, double lat2, double lon2, String unit) {
		double theta = lon1 - lon2;
		double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		dist = Math.acos(dist);
		dist = rad2deg(dist);
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344;
		} else if (unit == "N") {
			dist = dist * 0.8684;
		}

		return (dist);
	}

	   private double deg2rad(double deg) {
	      return (deg * Math.PI / 180.0);
	    }
	   private double rad2deg(double rad) {
	      return (rad * 180.0 / Math.PI);
	    }
	
	public String money(double v) {
     	if (v ==  0) return "0 ₮";        	        	        
     	DecimalFormat df = new DecimalFormat("###,###,###.00");
     	return df.format(v)+" ₮";
    }
	 
	public String money_(double v) {
     	if (v ==  0) return "0";        	        	        
     	DecimalFormat df = new DecimalFormat("###,###,###.0");
    	return df.format(v);
    }
	 
	public String money_1(double v) {
     	if (v ==  0) return "0";        	        	        
     	DecimalFormat df = new DecimalFormat("###.0");
    	return df.format(v);
    }
	 
	public String money_2(double v) {
     	if (v ==  0) return "0";        	        	        
     	DecimalFormat df = new DecimalFormat("###");
    	return df.format(v);
    }
	
	public String money_3(double v) {
     	if (v ==  0) return "0";        	        	        
     	DecimalFormat df = new DecimalFormat("###,###,###.00");
    	return df.format(v);
    }
	
	public String money_4(double v) {
     	if (v ==  0) return "0.00";        	        	        
     	DecimalFormat df = new DecimalFormat("###.00");
    	return df.format(v);
    }
	 
	public String number(double v) {
     	if (v ==  0) return "0";      
     	if (QTY_DOUBLE) {
     		DecimalFormat df = new DecimalFormat("###,###,###.00");
     		return df.format(v);
     	} else {
     		DecimalFormat df = new DecimalFormat("###,###,###");
     		return df.format(v);
     	}
    }
	
	public String number_2(double v) {
     	if (v ==  0) return "0";      
     	if (QTY_DOUBLE) {
     		DecimalFormat df = new DecimalFormat("###,###,###.0");
     		return df.format(v);
     	} else {
     		DecimalFormat df = new DecimalFormat("###,###,###");
     		return df.format(v);
     	}
    }
	
	public String number_1(double v) {
     	if (v ==  0) return "0";           	
     	DecimalFormat df = new DecimalFormat("###,###,###");
     	return df.format(v);     	
    }
	
	public String precent(double v) {
     	if (v ==  0) return "0%";           	
     	DecimalFormat df = new DecimalFormat("###,###,###");
     	return df.format(v)+"%";     	
    }
	
	public void loadDataFromAsset(Variant o, ImageView imgView) {
		if (!PRODUCT_GROUP) {
			/*
	        try {        
	        	String folder = logged.split("@")[1];
	        	String filename = o.getString("product_barcode")+".gif";
	        	if (folder.equals("battrade"))
	        		filename = "B"+o.getString("product_code")+".gif";	        
	        	if (folder.equals("voltam"))
	        		filename = o.getString("product_code")+".gif";	       
	            InputStream ims = getAssets().open(folder+"/"+filename);
	            Drawable d = Drawable.createFromStream(ims, null);
	            return d;
	        }
	        catch(IOException ex) {            
	        }*/
	        
			String folder = logged.split("@")[1];
			String filename = o.getString("product_barcode")+".jpg";
        	if (folder.equals("battrade"))
        		filename = "B"+o.getString("product_code")+".gif";	        
        	if (folder.equals("bosa"))
        		filename = o.getString("product_code")+".gif";	 
        	if (folder.equals("voltam"))
        		filename = o.getString("product_code")+".gif";
        	if (folder.equals("mtc"))
        		filename = o.getString("product_barcode")+".jpg";
        	if (folder.equals("glf"))
        		filename = o.getString("product_barcode")+".jpg";
        	if (folder.equals("teso"))
        		filename = o.getString("product_id")+".jpg";
        	
        	Log.d("d", getImageUrl() + filename);
	        imgLoader.DisplayImage(getImageUrl() + filename, imgView);
	        return;
		}
        		
        imgView.setImageDrawable(getResources().getDrawable(R.drawable.product));
    }
		
	
	public class ProductAdapter extends CustomerAdapter implements Filterable {     
		
        public ProductAdapter(Context context, int textViewResourceId, Collection collection) {
            super(context, textViewResourceId);
        	this.planetList = collection.getCollection();    		
    		this.origPlanetList = planetList;
        }
              
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = planetList.get(position);
            
            if (STORAGE_FAN) {
            	o = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id", "product_id="+o.getInt("product_id"), "product_name asc").elementAt(0);
            }
            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.product_item, null);
            
            TextView name = (TextView) v.findViewById(R.id.name);
            TextView price = (TextView) v.findViewById(R.id.price);
            TextView brand = (TextView) v.findViewById(R.id.brand);        
            TextView status = (TextView) v.findViewById(R.id.status);   
            
            name.setText(o.getString("product_name"));             
            price.setText(money(o.getFloat(activeCRM.getString("pricetag"))));
            brand.setText(o.getString("product_code")+" | "+o.getString("product_brand"));
            String value = "last";
            if (SHOW_PRODUCT_AVAILABLE_COUNT)
            	if(ALL_PRODUCTS_IN_TWO_WAREHOUSE)
                	if(activeWare.equals("2")){
                		value = "last1";
                	}else{
                		if(activeWare.equals("3")){
                    		value = "last2";
                    	}
                	}
                		
            	brand.setText(o.getString("product_code")+" | "+o.getString("product_brand")+" | "+filter_collection.queryInt("product_id", o.getInt("product_id")).getFloat(value));
            Variant w = (service_product_list.queryInt("product_id", o.getInt("product_id")));
            if (w.getFloat("qty") > 0) {
            	status.setText(w.getFloat("qty")+"");
            	int t = (w.getString("type").equals("cash") ? R.drawable.price_state: R.drawable.loan_state);
            	status.setBackgroundDrawable(getResources().getDrawable(t));
            	status.setVisibility(View.VISIBLE);
            } else
            	status.setVisibility(View.GONE);
            
            ImageView icon = (ImageView)v.findViewById(R.id.icon);            
            //icon.setImageDrawable(loadDataFromAsset(o));
            loadDataFromAsset(o, icon);
            
            return v;
        }  
        
        public boolean searchByField(Variant p, String field, String value, String latin) {
        	String needle = p.getString(field).toLowerCase();
        	
        	return (needle.startsWith(value)|| needle.startsWith(latin));
        }
        
        @Override
		public Filter getFilter() {
			if (planetFilter == null)
    			planetFilter = new PlanetFilter();

    		return planetFilter;
		}
        
		public class PlanetFilter extends Filter {
    		@Override
    		protected FilterResults performFiltering(CharSequence constraint) {
    			FilterResults results = new FilterResults();
    			if (constraint == null || constraint.length() == 0) {
    				results.values = origPlanetList;
    				results.count = origPlanetList.size();
    			}
    			else {
    				String latin = convertToLatin(constraint.toString());
    				List<Variant> nPlanetList = new ArrayList<Variant>();    				
    				for (Variant p : planetList) {
    					if (searchByField(p, "product_name", constraint.toString(), latin) ||    						
    						searchByField(p, "product_code", constraint.toString(), latin) ||
    						searchByField(p, "product_brand", constraint.toString(), latin))
    						nPlanetList.add(p);
    				}

    				results.values = nPlanetList;
    				results.count = nPlanetList.size();

    			}
    			return results;
    		}

    		@Override
    		protected void publishResults(CharSequence constraint, FilterResults results) {    		
    			if (results.count == 0)
    				notifyDataSetInvalidated();
    			else {
    				planetList = (List<Variant>) results.values;
    				notifyDataSetChanged();
    			}
    		}
    	}
    }
	
	public class Continent {		  
		 private String name;
		 private ArrayList<Variant> subList = new ArrayList<Variant>();
		  
		 public Continent(String name, ArrayList<Variant> subList) {
			  super();
			  this.name = name;
			  this.subList = subList;
		 }
		 public String getName() {
			 return name;
		 }
		 public void setName(String name) {
			 this.name = name;
		 }
		 public ArrayList<Variant> getCountryList() {
			 return subList;
		 }
		 public void setCountryList(ArrayList<Variant> countryList) {
			 this.subList = countryList;
		 }	  		 
	}
	
	public class ProductGroupedAdapter extends BaseExpandableListAdapter {     
		private Context context;
		private ArrayList<Continent> continentList;
		private ArrayList<Continent> originalList;
		
        public ProductGroupedAdapter(Context context, ArrayList<Continent> continentList) {
        	this.context = context;
        	this.continentList = new ArrayList<Continent>();
        	this.continentList.addAll(continentList);
        	this.originalList = new ArrayList<Continent>();
        	this.originalList.addAll(continentList);
        }
                     
        @Override
        public Object getChild(int groupPosition, int childPosition) {
	         ArrayList<Variant> countryList = continentList.get(groupPosition).getCountryList();
	         return countryList.get(childPosition);
        }
        
        @Override
        public long getChildId(int groupPosition, int childPosition) {
        	return childPosition;
        }
        
        @Override
        public View getChildView(int groupPosition, int childPosition, boolean isLastChild, View v, ViewGroup parent) {	          
        	Variant o = (Variant) getChild(groupPosition, childPosition);
	        if (v == null) {
	        	 LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	        	 v = layoutInflater.inflate(R.layout.product_item, null);
	        }
	        
            if (STORAGE_FAN) {
            	o = Shared.sql.selectAll("Products", "i,s,s,s,s,s,s,s,f,f,s,f,f,f,f,f,f,f,f,f,f,i", "product_id,product_name,product_type,product_code,product_barcode,product_brand,product_vendor,unit_type,unit_size,price,company,price1,price2,price3,price4,price5,price6,price7,price8,price9,price10,warehouse_id", "product_id="+o.getInt("product_id"), "product_name asc").elementAt(0);
            }
            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.product_item, null);
            
            TextView name = (TextView) v.findViewById(R.id.name);
            TextView price = (TextView) v.findViewById(R.id.price);
            TextView brand = (TextView) v.findViewById(R.id.brand);        
            TextView status = (TextView) v.findViewById(R.id.status);   
            
            name.setText(o.getString("product_name"));            
            price.setText(money(o.getFloat(activeCRM.getString("pricetag"))));
            brand.setText(o.getString("product_code")+" | "+o.getString("product_brand"));
            String value = "last";
            if (SHOW_PRODUCT_AVAILABLE_COUNT)
            	brand.setText(o.getString("product_code")+" | "+o.getString("product_brand")+" | "+filter_collection.queryInt("product_id", o.getInt("product_id")).getFloat(value));
            Variant w = (service_product_list.queryInt("product_id", o.getInt("product_id")));
            if (w.getFloat("qty") > 0) {
            	status.setText(w.getFloat("qty")+"");
            	int t = (w.getString("type").equals("cash") ? R.drawable.price_state: R.drawable.loan_state);
            	status.setBackgroundDrawable(getResources().getDrawable(t));
            	status.setVisibility(View.VISIBLE);
            } else
            	status.setVisibility(View.GONE);
            
            ImageView icon = (ImageView)v.findViewById(R.id.icon);            
            //icon.setImageDrawable(loadDataFromAsset(o));
            loadDataFromAsset(o, icon);
            
            return v;
        }
        
        @Override
        public int getChildrenCount(int groupPosition) {          
        	ArrayList<Variant> countryList = continentList.get(groupPosition).getCountryList();
        	return countryList.size();        
        }
        
        @Override
        public Object getGroup(int groupPosition) {
        	return continentList.get(groupPosition);
        }
        
        @Override
        public int getGroupCount() {
        	return continentList.size();
        }
        
        @Override
        public long getGroupId(int groupPosition) {
        	return groupPosition;
        }
        
        @Override
        public View getGroupView(int groupPosition, boolean isLastChild, View view, ViewGroup parent) {          
	         Continent continent = (Continent) getGroup(groupPosition);
	         if (view == null) {
	          LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	          view = layoutInflater.inflate(R.layout.list_header, null);
	         }
	          
	         TextView heading = (TextView) view.findViewById(R.id.list_header_title);
	         heading.setText(continent.getName().trim()+" ("+getChildrenCount(groupPosition)+" бараа)");
	          
	         return view;
        }
        
        @Override
        public boolean hasStableIds() {
        	return true;
        }
        
        @Override
        public boolean isChildSelectable(int groupPosition, int childPosition) {
        	return true;
        }
         
        @SuppressLint("NewApi")
		public void filterData(String query){          
	         query = query.toLowerCase();
	         Log.v("MyListAdapter", String.valueOf(continentList.size()));
	         continentList.clear();
	          
	         if(query.isEmpty()){
	          continentList.addAll(originalList);
	         }
	         else {
	           
	          for(Continent continent: originalList){
	            
	           ArrayList<Variant> subList = continent.getCountryList();
	           ArrayList<Variant> newList = new ArrayList<Variant>();
	           for(Variant item: subList){
	            if(item.getString("product_name").toLowerCase().contains(query) ||
	               item.getString("product_type").toLowerCase().contains(query)){
	            	newList.add(item);
	            }
	           }
	           if(newList.size() > 0){
	            Continent nContinent = new Continent(continent.getName(),newList);
	            continentList.add(nContinent);
	           }
	          }
	         }
	          	         
	         notifyDataSetChanged();          
        }
    }

	public class ContactAdapter extends ArrayAdapter<Variant> {     
		Collection contacts;
		
        public ContactAdapter(Context context, int textViewResourceId, Collection c) {
            super(context, textViewResourceId, c.getCollection());
            contacts = c;
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = contacts.getCollection().get(position);
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.list_item, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
           
            tt.setText(o.get("caption"));
            bt.setText(o.get("value")); 
            v.setTag("contact");
            return v;
        }
    }
		
	public class DealAdapter extends ArrayAdapter<Variant> {     
		
        public DealAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId, collection.getCollection());
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = collection.getCollection().get(position);            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.deal_item, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            TextView rt = (TextView) v.findViewById(R.id.righttext);
            TextView ot = (TextView) v.findViewById(R.id.owner);
            TextView dt = (TextView) v.findViewById(R.id._date);
            
            TextView closing_date = (TextView) v.findViewById(R.id.closing_date);
            TextView competitor = (TextView) v.findViewById(R.id.competitor);
           
            tt.setText(o.get("deal"));
            bt.setText(money(o.get("expected_revenue")));
            rt.setText(o.get("stage"));
            rt.setTextColor(getResources().getColor(stage(o.get("stage"))));
            
            ot.setText(o.get("owner")); 
            dt.setText(o.get("_date"));      
            
            closing_date.setText("Closing date : "+o.get("closing_date"));
            competitor.setText(o.get("competitor"));
            return v;
        }
        
        public String money(String v) {
        	if (v.length() == 0) return "0";
        	double value = Double.parseDouble(v.trim());         	        	
        	DecimalFormat df = new DecimalFormat("###,###,###.00");
        	return df.format(value)+" ₮";
        }
        
        public int stage(String v) {
        	v = v.trim();
        	if (v == "lead")
        		return R.color.magenta_bg;
        	if (v == "opportunity")
        		return R.color.orange_bg;
        	if (v == "quote")
        		return R.color.blue_bg;
        	if (v == "close as won")
        		return R.color.green_bg;
        	if (v == "close as lost" || v == "disqualified")
        		return R.color.red_bg;
        	
        	return R.color.black;
        }
    }
	
	public class ServiceAdapter extends ArrayAdapter<Variant> {     
		Collection col;
		
        public ServiceAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId, collection.getCollection());
            this.col = collection;
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = col.getCollection().get(position);            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.service_item, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            TextView rt = (TextView) v.findViewById(R.id.righttext);
            TextView ot = (TextView) v.findViewById(R.id.owner);
            TextView dt = (TextView) v.findViewById(R.id._date);
            
           
            tt.setText(o.get("subject"));
            if (o.getFloat("service_debt") > 0)
            	bt.setText(money(o.get("service_revenue"))+" (Авлага "+money(o.get("service_debt"))+")");
            else
            	bt.setText(money(o.get("service_revenue")));
            rt.setText(stageString(o.get("service_stage"))); 
            rt.setBackgroundDrawable(getResources().getDrawable(stage(o.getString("service_stage"))));
            
            tt.setText("Нийт дүн : "+money(o.get("total")));
            ot.setText(o.get("owner")); 
            dt.setText(o.get("_date"));      
                        
            return v;
        }
        
        public String money(String v) {
        	if (v.length() == 0) return "0";
        	double value = Double.parseDouble(v.trim());        	        	
        	DecimalFormat df = new DecimalFormat("###,###,###.00");
        	return df.format(value)+" ₮";
        }
        
        public int stage(String v) {
        	v = v.trim();
        	if (v.equals("receipt"))
        		return R.drawable.blue_state;
        	if (v.equals("service"))
        		return R.drawable.orange_state;
        	if (v.equals("closed") || v.equals("inret"))
        		return R.drawable.price_state;        	
        	if (v.equals("return"))
        		return R.drawable.red_state;
        	if (v.equals("fail"))
        		return R.drawable.red_state;
        	
        	return R.drawable.red_state;
        }
        
        public String stageString(String v) {
        	v = v.trim();
        	if (v.equals("receipt"))
        		return "илгээгдсэн";
        	if (v.equals("service"))
        		return "олгосон";
        	if (v.equals("closed"))
        		return "хаагдсан";
        	if (v.equals("inret"))
        		return "буцаалт";
        	if (v.equals("fail"))
        		return "хаалттай боломжгүй";
        	
        	return v;
        }
    }
	
	public class CaseAdapter extends ArrayAdapter<Variant> {     
		
        public CaseAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId, collection.getCollection());
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = collection.getCollection().get(position);            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.case_item, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            TextView rt = (TextView) v.findViewById(R.id.righttext);
            TextView ot = (TextView) v.findViewById(R.id.owner);
            TextView dt = (TextView) v.findViewById(R.id._date);
            
           
            tt.setText(o.get("complain_reason"));          
            bt.setText(caseType(o.get("complain_type")));
            rt.setText(stageCase(o.get("case_stage"))); 
            rt.setBackgroundDrawable(getResources().getDrawable(stage(o.getString("case_stage"))));
            
            ot.setText(o.get("owner")); 
            dt.setText(o.get("_date"));      
                        
            return v;
        }                
        
        public int stage(String v) {
        	v = v.trim();
        	if (v.equals("identify"))
        		return R.drawable.red_state;
        	if (v.equals("research"))
        		return R.drawable.orange_state;
        	if (v.equals("resolve"))
        		return R.drawable.price_state;
        	
        	return R.drawable.red_state;
        }
        
        public String stageCase(String v) {
        	v = v.trim();
        	if (v.equals("identify"))
        		return "илгээгдсэн";
        	if (v.equals("research"))
        		return "шалгагдаж байгаа";
        	if (v.equals("resolve"))
        		return "хаагдсан";
        	
        	return v;
        }
        
        public String caseType(String v) {
        	v = v.trim();
        	if (v.equals("problem"))
        		return "гомдол";
        	if (v.equals("feature request"))
        		return "санал хүсэлт";
        	
        	return v;
        }
    }
	
	public class ActivityAdapter extends ArrayAdapter<Variant> {     
		
        public ActivityAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId, collection.getCollection());
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = collection.getCollection().get(position);            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.activity_item, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            TextView rt = (TextView) v.findViewById(R.id.righttext);
            TextView ot = (TextView) v.findViewById(R.id.owner);
            TextView dt = (TextView) v.findViewById(R.id._date);
            
            TextView closing_date = (TextView) v.findViewById(R.id.closing_date);
            TextView competitor = (TextView) v.findViewById(R.id.competitor);
           
            tt.setText(o.get("subject"));
            bt.setText(o.get("days")+" "+o.get("times"));
            rt.setText(o.get("work_type"));            
            
            ot.setText(o.get("owner")); 
            dt.setText(o.get("_date"));      
            
            closing_date.setText("Deal : "+o.get("deal_name"));
            competitor.setText(o.get("status"));
            return v;
        }                
              
    }
	
	public class ReportAdapter extends ArrayAdapter<Variant> {     
		
        public ReportAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId, collection.getCollection());
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = collection.getCollection().get(position);            
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.report_item, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            TextView rt = (TextView) v.findViewById(R.id.righttext);            
           
            tt.setText(o.get("product_name"));
            bt.setText(money(o.getFloat("amount")));
            rt.setText(o.getFloat("qty")+" хайрцаг");
            
            return v;
        }                
              
    }
	
	public class ProductFilterAdapter extends ArrayAdapter<Variant> {     
		Collection filters;
		String field;
		
        public ProductFilterAdapter(Context context, int textViewResourceId, Collection c, String f) {
            super(context, textViewResourceId, c.getCollection());        	
            filters = c;
            field = f;
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = filters.getCollection().get(position);
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);            
            v = vi.inflate(R.layout.list_item_only, null);                       
            v.setBackgroundColor(0x000000FF);                                                
            
            String value = o.get(field);
            TextView tt = (TextView) v.findViewById(R.id.list_item_title);
            if (value.equals("NULL")) value = "Тодорхойгүй"; 
            	
            tt.setText(value);   
            v.setTag(value);
            
            if (field.equals("name") && activeWare.equals(o.getInt("warehouse_id")+""))
            	tt.setCompoundDrawablesWithIntrinsicBounds(null, null, getResources().getDrawable(R.drawable.checked), null);
            
            if (field.equals("product_brand") && activeBrand.equals(o.getString("product_brand")))
            	tt.setCompoundDrawablesWithIntrinsicBounds(null, null, getResources().getDrawable(R.drawable.checked), null);
            
            if (field.equals("descr") && activeRoute.equals(o.getString("descr")))
            	tt.setCompoundDrawablesWithIntrinsicBounds(null, null, getResources().getDrawable(R.drawable.checked), null);
            
            if (field.equals("descr") && activeSelect.equals(o.getString("value")))
            	tt.setCompoundDrawablesWithIntrinsicBounds(null, null, getResources().getDrawable(R.drawable.checked), null);
            return v;
        }        
    }		
	
	public class CommandAdapter extends ArrayAdapter<Variant> {     
		Collection commands;
		
        public CommandAdapter(Context context, int textViewResourceId, Collection c) {
            super(context, textViewResourceId, c.getCollection());        	
            commands = c;
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = commands.getCollection().get(position);
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.list_item_only, null);
            
            v.setBackgroundColor(0x000000FF);                                                
            
            TextView tt = (TextView) v.findViewById(R.id.list_item_title);                       
            tt.setText(o.get("caption"));   
            v.setTag("command");
            return v;
        }        
    }		
	
	public class ServiceCustomerAdapter extends ArrayAdapter<Variant> {     
		Collection collection, ware;
		
        public ServiceCustomerAdapter(Context context, int textViewResourceId, Collection c) {
            super(context, textViewResourceId, c.getCollection());        	
            collection = c;
            ware = Shared.sql.selectAll("WareHouse", "i,s", "warehouse_id,name", null, "name asc");
        }
        
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v = convertView;            
            Variant o = collection.getCollection().get(position);
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            v = vi.inflate(R.layout.service_item, null);
            
            v.setBackgroundColor(0x000000FF);   
            
            TextView tt = (TextView) v.findViewById(R.id.toptext);
            TextView bt = (TextView) v.findViewById(R.id.bottomtext);
            TextView rt = (TextView) v.findViewById(R.id.righttext);
            TextView ot = (TextView) v.findViewById(R.id.owner);
            TextView dt = (TextView) v.findViewById(R.id._date);
            
            tt.setText((position+1)+". "+o.get("crm_name"));            
            bt.setText(money(o.getFloat("amount")));
            String[] w = o.get("warehouse").split(",");
            String j = "";
            for (int i = 0; i < w.length; i++) {
            	if (w[i].length() > 0)
            		j += ware.queryInt("warehouse_id", Integer.parseInt(w[i])).getString("name")+", ";
            }
            
            rt.setText(j);
            
            return v;
        }        
    }
	
	public Handler dialogDismiss = new Handler()
    {
        @Override
		public void handleMessage(android.os.Message msg)
        {
            super.handleMessage(msg);

            switch (msg.what)
            {            	
                case DISMISS:
                	if (pd != null && pd.isShowing()) {                		
                		pd.cancel();
                	}
                    break;
            }
        }
    };
    
    public float convertPixelsToDp(float px, Context context){
        Resources resources = context.getResources();
        DisplayMetrics metrics = resources.getDisplayMetrics();
        float dp = px / (metrics.densityDpi / 160f);
        return dp;
    }
    
    @Override
    protected Dialog onCreateDialog(int id) {
	   	Calendar c = Calendar.getInstance();
	   	int cyear = c.get(Calendar.YEAR);
	   	int cmonth = c.get(Calendar.MONTH);
	   	int cday = c.get(Calendar.DAY_OF_MONTH);
	   	switch (id) {
	   		case DATE_DIALOG_ID:
	   				return new DatePickerDialog(this,  mDateSetListener,  cyear, cmonth, cday);
	   	}
	   	return null;
    }
   
    private DatePickerDialog.OnDateSetListener mDateSetListener = new DatePickerDialog.OnDateSetListener() {
	   	@Override
		public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
	   		String m = String.valueOf(monthOfYear+1);
	   		if (m.length() == 1) m = "0"+m;
	   		String d = String.valueOf(dayOfMonth);
	   		if (d.length() == 1) d = "0"+d;
	   		String date_selected = String.valueOf(year)+"-"+m+"-"+d;
	   		if (edits.get("closing_date") != null)
	   			edits.get("closing_date").setText(date_selected);
	   		
	   		if (activity.equals("customer")) {
	   			todayValue = date_selected;	   			
	   			reload_see_list();
	   		}
	   		
	   		if (activity.equals("report")) {
	   			todayValue = date_selected;
	   			reload_report_list();
	   		}
	   	}
    };
    
    public void reload_see_list() {
    	
    }
    
    public void reload_report_list() {
    	
    }

	public String getToday() {
    	Calendar now = Calendar.getInstance();    	
    	int year = now.get(Calendar.YEAR);
    	int month = now.get(Calendar.MONTH)+1;
    	int day = now.get(Calendar.DAY_OF_MONTH); 
    	
    	int hour = now.get(Calendar.HOUR_OF_DAY);
    	int minute = now.get(Calendar.MINUTE);
    	int second = now.get(Calendar.SECOND);    	
    	
    	String todayvalue = year+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day);    	
    	
    	return todayvalue;
    }
		
	public String getTomorrow() {
    	Calendar now = Calendar.getInstance();
    	now.add(Calendar.DATE, 1); 
    	int year = now.get(Calendar.YEAR);
    	int month = now.get(Calendar.MONTH)+1;
    	int day = now.get(Calendar.DAY_OF_MONTH); 
    	
    	int hour = now.get(Calendar.HOUR_OF_DAY);
    	int minute = now.get(Calendar.MINUTE);
    	int second = now.get(Calendar.SECOND);    	
    	
    	String todayvalue = year+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day);    	
    	
    	return todayvalue;
    }
	
	public String getNextDate(int d) {
    	Calendar now = Calendar.getInstance();
    	now.add(Calendar.DATE, d); 
    	int year = now.get(Calendar.YEAR);
    	int month = now.get(Calendar.MONTH)+1;
    	int day = now.get(Calendar.DAY_OF_MONTH); 
    	
    	int hour = now.get(Calendar.HOUR_OF_DAY);
    	int minute = now.get(Calendar.MINUTE);
    	int second = now.get(Calendar.SECOND);
    	
    	String todayvalue = year+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day);    	
    	
    	return todayvalue;
    }
	
	public boolean workingTime() {
    	Calendar now = Calendar.getInstance();    
    	int hour = now.get(Calendar.HOUR_OF_DAY);
    	Log.d("D", "hour day "+hour);
    	return (hour >= 9 && hour < 20);
    }
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}
	
	public void setData(String key, String value) {
    	SharedPreferences cache = getSharedPreferences("OPTIMAL_ERP", 0);
 		SharedPreferences.Editor editor = cache.edit();
 		editor.putString(key, value);
 		editor.commit();
    }
	
	public String getData(String key, String value) {
		SharedPreferences cache = getSharedPreferences("OPTIMAL_ERP", 0);	
		return cache.getString(key, value);
	}
	
	 public File getDir(Variant crm) {		 
	    File sdDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);	    
	    return new File(sdDir, ""+crm.getInt("crm_id"));
	 }
	 
	 public static String convertDateTimeToString() {        
	       Calendar calendar = Calendar.getInstance();
	       SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss"); 
	       try {           
	           return dateFormat.format(calendar.getTime());            
	       } catch (Exception e) {
	           e.printStackTrace();
	       }
	       
	       return "";
	 }
	 
	 public String saveBitmapToDisk(Bitmap bbicon){
		 
		 //ByteArrayOutputStream baosicon = new ByteArrayOutputStream();
		 //bbicon.compress(Bitmap.CompressFormat.PNG,0, baosicon);
		 //bicon=baosicon.toByteArray();

		 String extStorageDirectory = Environment.getExternalStorageDirectory().toString();
		 OutputStream outStream = null;
		 File file = new File(extStorageDirectory, "qrcode.jpeg");
		 try {
		     outStream = new FileOutputStream(file);
		     bbicon.compress(Bitmap.CompressFormat.JPEG, 100, outStream);
		     outStream.flush();
		     outStream.close();
		 } catch(Exception e) {

		 }
		 
		 return extStorageDirectory+"/qrcode.jpeg";
	 }
	 
	 public void print_to_padaan(final String printLine, final Bitmap bm) {
		 if (printer_model.equals("BIXOLON")) {
			final BixolonManager bixolon = new BixolonManager(this);
			bixolon.startBixolon();
		//	Log.d("AAAAAAAAAAAA", saveBitmapToDisk(bm));
			
			if (bixolon.printData(printLine)) {
				if(MTA){
					bixolon.printImage(saveBitmapToDisk(bm));
				}
				new AlertDialog.Builder(this)
		        .setIcon(android.R.drawable.ic_dialog_alert)
		        .setTitle("Мэдээлэл")
		        .setMessage("Дараагийн хувийг хэвлэх үү !")
		        .setPositiveButton("Тийм", new DialogInterface.OnClickListener() {
		            @Override
		            public void onClick(DialogInterface dialog, int which) {
		            	bixolon.printData(printLine);
		            	if(MTA){
		            		bixolon.printImage(saveBitmapToDisk(bm));
		            	}
		            	dialog.dismiss();
		            	bixolon.stopBixolon();	    		     
		            }
		        })
		        .setNegativeButton("Үгүй", new DialogInterface.OnClickListener() {
		            @Override
		            public void onClick(DialogInterface dialog, int which) {
		            	dialog.dismiss();
		            	bixolon.stopBixolon();
		            }
		        })
		        .show();
			} else {
				Toast.makeText(getApplicationContext(), "Уучлаарай принтертэй холбогдож чадахгүй байна ! Bluetooth болон принтерээ шалгана уу !", Toast.LENGTH_LONG).show();				
			}
		 } else
		 if (printer_model.equals("BIXOLON400")) {
			if (bixolon400 == null)
				bixolon400 = new BixolonManager400();
			if (!bixolon400.isConnected()) {
				bixolon400.startBixolon(this, printLine);
			} else {			
				if (bixolon400.printData(printLine)) {
					if(MTA){
						bixolon400.prinBitmap(bm);
					}
					new AlertDialog.Builder(this)
			        .setIcon(android.R.drawable.ic_dialog_alert)
			        .setTitle("Мэдээлэл")
			        .setMessage("Дараагийн хувийг хэвлэх үү !")
			        .setPositiveButton("Тийм", new DialogInterface.OnClickListener() {
			            @Override
			            public void onClick(DialogInterface dialog, int which) {
			            	dialog.dismiss();
			            	bixolon400.printData(printLine);
			            	if(MTA){
								bixolon400.prinBitmap(bm);
							}
			            	//bixolon400.stopBixolon();	    		     
			            }
			        })
			        .setNegativeButton("Үгүй", new DialogInterface.OnClickListener() {
			            @Override
			            public void onClick(DialogInterface dialog, int which) {
			            	dialog.dismiss();
			            	//bixolon400.stopBixolon();
			            }
			        })
			        .show();
				} else {
					if (bixolon400 != null)
						bixolon400.stopBixolon();
					Toast.makeText(getApplicationContext(), "Уучлаарай принтертэй холбогдож чадахгүй байна ! Bluetooth болон принтерээ шалгана уу !", Toast.LENGTH_LONG).show();				
				}
			}
		 } else
		 if (printer_model.equals("TP10")) {
			 TP10Manager tp10 = new TP10Manager();
			 tp10.connectPrinter(this, printLine, 1 ,bm);
		 }
	 }
	 
	 public Bitmap generateQrCode(String message){
		//qrCode generate
			GZxingEncoder   Encoder = GZxingEncoder.getInstance();
			
			//To generate bar code use this
			Bitmap bitmap = null;
			try {
				Encoder.setBitmap_Width_Height(700, 700);
				bitmap = Encoder.generate_QR_CODE(message,null);
			} catch (WriterException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        return bitmap;
	 }
	 
	 public Bitmap qrcode(String qrcode) {
		 Bitmap ImageBitmap = null;
	        if (!TextUtils.isEmpty(qrcode)) {
	            BitMatrix bm = null;
	            try {
	                bm = new MultiFormatWriter().encode(qrcode, BarcodeFormat.QR_CODE, 300, 300);
	            } catch (WriterException e) {
	                e.printStackTrace();
	            }
	            ImageBitmap = Bitmap.createBitmap(300, 300, Config.ARGB_8888);
	            for (int i = 0; i < 300; i++) {
	                for (int j = 0; j < 300; j++) {
	                    ImageBitmap.setPixel(i, j, bm.get(i, j) ? ViewCompat.MEASURED_STATE_MASK : -1);
	                }
	            }
	          //  image(ImageBitmap, 300, 300);
	           
	        }
	        return ImageBitmap;
	 }
	 
	 public static byte[] hexToBuffer(String hexString)
			    throws NumberFormatException {
			    int length = hexString.length();
			    byte[] buffer = new byte[(length + 1) / 2];
			    boolean evenByte = true;
			    byte nextByte = 0;
			    int bufferOffset = 0;

			    if ((length % 2) == 1) {
			        evenByte = false;
			    }

			    for (int i = 0; i < length; i++) {
			        char c = hexString.charAt(i);
			        int nibble; // A "nibble" is 4 bits: a decimal 0..15

			        if ((c >= '0') && (c <= '9')) {
			            nibble = c - '0';
			        } else if ((c >= 'A') && (c <= 'F')) {
			            nibble = c - 'A' + 0x0A;
			        } else if ((c >= 'a') && (c <= 'f')) {
			            nibble = c - 'a' + 0x0A;
			        } else {
			            throw new NumberFormatException("Invalid hex digit '" + c +
			                "'.");
			        }

			        if (evenByte) {
			            nextByte = (byte) (nibble << 4);
			        } else {
			            nextByte += (byte) nibble;
			            buffer[bufferOffset++] = nextByte;
			        }

			        evenByte = !evenByte;
			    }

			    return buffer;
			}
	 
	 public static byte[] StartBmpToPrintCode(Bitmap bitmap, int t) {
		    byte temp = 0;
		    int j = 7;
		    int start = 0;
		    if (bitmap != null) {
		        int mWidth = bitmap.getWidth();
		        int mHeight = bitmap.getHeight();

		        int[] mIntArray = new int[mWidth * mHeight];
		        byte[] data = new byte[mWidth * mHeight];
		        bitmap.getPixels(mIntArray, 0, mWidth, 0, 0, mWidth, mHeight);
		        //encodeYUV420SP(data, mIntArray, mWidth, mHeight, t);
		        byte[] result = new byte[mWidth * mHeight / 8];
		        for (int i = 0; i < mWidth * mHeight; i++) {
		            temp = (byte) ((byte) (data[i] << j) + temp);
		            j--;
		            if (j < 0) {
		                j = 7;
		            }
		            if (i % 8 == 7) {
		                result[start++] = temp;
		                temp = 0;
		            }
		        }
		        if (j != 7) {
		            result[start++] = temp;
		        }

		        int aHeight = 24 - mHeight % 24;
		        byte[] add = new byte[aHeight * 48];
		        byte[] nresult = new byte[mWidth * mHeight / 8 + aHeight * 48];
		        System.arraycopy(result, 0, nresult, 0, result.length);
		        System.arraycopy(add, 0, nresult, result.length, add.length);

		        byte[] byteContent = new byte[(mWidth / 8 + 4)
		                * (mHeight + aHeight)];// ´òÓ¡Êý×é
		        byte[] bytehead = new byte[4];// Ã¿ÐÐ´òÓ¡Í·
		        bytehead[0] = (byte) 0x1f;
		        bytehead[1] = (byte) 0x10;
		        bytehead[2] = (byte) (mWidth / 8);
		        bytehead[3] = (byte) 0x00;
		        for (int index = 0; index < mHeight + aHeight; index++) {
		            System.arraycopy(bytehead, 0, byteContent, index * 52, 4);
		            System.arraycopy(nresult, index * 48, byteContent,
		                    index * 52 + 4, 48);

		        }
		        return byteContent;
		    }
		    return null;

		}

		public static void encodeYUV420SP(byte[] yuv420sp, int[] rgba, int width,
		        int height, int t) {
		    final int frameSize = width * height;
		    int[] U, V;
		    U = new int[frameSize];
		    V = new int[frameSize];
		    final int uvwidth = width / 2;
		    int r, g, b, y, u, v;
		    int bits = 8;
		    int index = 0;
		    int f = 0;
		    for (int j = 0; j < height; j++) {
		        for (int i = 0; i < width; i++) {
		            r = (rgba[index] & 0xff000000) >> 24;
		            g = (rgba[index] & 0xff0000) >> 16;
		            b = (rgba[index] & 0xff00) >> 8;
		            // rgb to yuv
		            y = ((66 * r + 129 * g + 25 * b + 128) >> 8) + 16;
		            u = ((-38 * r - 74 * g + 112 * b + 128) >> 8) + 128;
		            v = ((112 * r - 94 * g - 18 * b + 128) >> 8) + 128;
		            // clip y
		            // yuv420sp[index++] = (byte) ((y < 0) ? 0 : ((y > 255) ? 255 :
		            // y));
		            byte temp = (byte) ((y < 0) ? 0 : ((y > 255) ? 255 : y));
		            if (t == 0) {
		                yuv420sp[index++] = temp > 0 ? (byte) 1 : (byte) 0;
		            } else {
		                yuv420sp[index++] = temp > 0 ? (byte) 0 : (byte) 1;
		            }

		            // {
		            // if (f == 0) {
		            // yuv420sp[index++] = 0;
		            // f = 1;
		            // } else {
		            // yuv420sp[index++] = 1;
		            // f = 0;
		            // }

		            // }

		        }

		    }
		    f = 0;
		}
	 
	 public String BitMapToString(Bitmap bitmap) {
		    ByteArrayOutputStream baos = new ByteArrayOutputStream();
		    bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
		    byte[] b = baos.toByteArray();
		    String temp = Base64.encodeToString(b, Base64.DEFAULT);
		    return temp;
	}
	 
	 public int uploadFile(File sourceFile, String fileName, String path) {                           
         int serverResponseCode = 0;
         HttpURLConnection conn = null;
         DataOutputStream dos = null;  
         String lineEnd = "\r\n";
         String twoHyphens = "--";
         String boundary = "*****";
         int bytesRead, bytesAvailable, bufferSize;
         byte[] buffer;
         int maxBufferSize = 1 * 1024 * 1024; 
       
         if (!sourceFile.isFile()) {                                
              return 0;           
         }
         else
         {
              try { 
                  FileInputStream fileInputStream = new FileInputStream(sourceFile);
                  URL url = new URL(getUploadUrl());
                   
                  // Open a HTTP  connection to  the URL
                  conn = (HttpURLConnection) url.openConnection(); 
                  conn.setDoInput(true); // Allow Inputs
                  conn.setDoOutput(true); // Allow Outputs
                  conn.setUseCaches(false); // Don't use a Cached Copy
                  conn.setRequestMethod("POST");
                  conn.setRequestProperty("Connection", "Keep-Alive");
                  conn.setRequestProperty("ENCTYPE", "multipart/form-data");
                  conn.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
                  conn.setRequestProperty("uploaded_file", fileName);                 
                    
                  dos = new DataOutputStream(conn.getOutputStream());         
                  dos.writeBytes(twoHyphens + boundary + lineEnd); 
                  dos.writeBytes("Content-Disposition: form-data; name=\"uploaded_file\";filename=\"" + fileName + "\"" + lineEnd);                   
                  dos.writeBytes(lineEnd);         
                  bytesAvailable = fileInputStream.available();          
                  bufferSize = Math.min(bytesAvailable, maxBufferSize);
                  buffer = new byte[bufferSize];        
                  bytesRead = fileInputStream.read(buffer, 0, bufferSize);                       
                  while (bytesRead > 0) {                       
                	  dos.write(buffer, 0, bufferSize);
                	  bytesAvailable = fileInputStream.available();
                	  bufferSize = Math.min(bytesAvailable, maxBufferSize);
                	  bytesRead = fileInputStream.read(buffer, 0, bufferSize);                        
                  }                          
                  dos.writeBytes(lineEnd);
                  dos.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);        
                  serverResponseCode = conn.getResponseCode();
                  String serverResponseMessage = conn.getResponseMessage();                   
                  if(serverResponseCode == 200){
                                  
                  }                       
                  fileInputStream.close();
                  dos.flush();
                  dos.close();
                    
             } catch (MalformedURLException ex) {              
                 ex.printStackTrace();                 
             } catch (Exception e) {                 
                 e.printStackTrace();                                
             }
        
             return serverResponseCode; 
         }
      } // End else block         
}
