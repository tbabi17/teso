package mxc.app.engine;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteStatement;
import android.util.Log;

public class SQLManager {
	private final String DATABASE_NAME = "ocrm.db";
	private final int DATABASE_VERSION = 36;
	   
	private Context context;
	private SQLiteDatabase db;
	private SQLiteStatement insertStmt;	
	   
	public SQLManager(Context context) {
	      this.context = context;
	      OpenHelper openHelper = new OpenHelper(this.context);
	      this.db = openHelper.getWritableDatabase();  	 	     
	}
			
	public void insertCollection(String tableName, Collection collection, String types, String fields) {
	   String[] fd = fields.split(",");
	   String[] tp = types.split(",");
	   String str = "?";
	   for (int i = 1; i < fd.length; i++)
		   str += ",?";
	   
	   this.insertStmt = this.db.compileStatement("INSERT INTO "+tableName+" ("+fields+") VALUES ("+str+")");	   
	   for (int i = 0; i < collection.size(); i++) {		   
		   try {			  			  
			  Variant w = collection.elementAt(i);			  
			  for (int j = 0; j < fd.length; j++) {
	        		switch (tp[j].charAt(0)) {
	        			case 's': 	        					  
	        					  this.insertStmt.bindString(j+1, w.getString(fd[j]));
	        					  break;
	        			case 'i': 	        					  
	        					  this.insertStmt.bindLong(j+1, w.getInt(fd[j]));
	        					  break; 	
	        			case 'f': 	        					  
	        					  this.insertStmt.bindDouble(j+1, w.getFloat(fd[j]));
	        					  break; 					  	        					  
	        		}
			  }			  
			  this.insertStmt.executeInsert();		      
		   } catch (Exception ex) {
			   ex.printStackTrace();
		   }
	   }
	   insertStmt.close();
    }
   
    public void insertVariant(String tableName, Variant w, String types, String fields) {
	   String[] fd = fields.split(",");
	   String[] tp = types.split(",");
	   String str = "?";
	   for (int i = 1; i < fd.length; i++)
		   str += ",?";
	   
	   this.insertStmt = this.db.compileStatement("INSERT INTO "+tableName+" ("+fields+") VALUES ("+str+")");	   	   		   
	   try {			  			
		  for (int j = 0; j < fd.length; j++) {
        		switch (tp[j].charAt(0)) {
        			case 's': 	        					  
        					  this.insertStmt.bindString(j+1, w.getString(fd[j]));
        					  break;
        			case 'i': 	        					  
        					  this.insertStmt.bindLong(j+1, w.getInt(fd[j]));
        					  break; 	
        			case 'f': 	        					  
        					  this.insertStmt.bindDouble(j+1, w.getFloat(fd[j]));
        					  break; 					  	        					  
        		}
		  }			  
		  this.insertStmt.executeInsert();		      
	   } catch (Exception ex) {
		   
	   }
	   insertStmt.close();
    }
    
    public Collection selectAllGrouped(String table, String where, String fields, String groupby) {
		  Collection vd = new Collection();  
		  String[] fd = fields.split(",");
	      Cursor cursor = this.db.query(table, fd, where, null, groupby, null, null);
	        if (cursor.moveToFirst()) {
	         do {
	        	Variant w = new Variant();	        		        	
	        	w.put(fd[0], cursor.getString(0));	        				        			        	
	            vd.addCollection(w);
	         } while (cursor.moveToNext());
	      }
	      if (cursor != null && !cursor.isClosed()) {
	         cursor.close();
	      }
	      return vd;
    }
    
    public Collection selectAll(String table, String types, String fields, String where, String orderby) {
		  Collection vd = new Collection();      
		  String[] fd = fields.split(",");
		  String[] tp = types.split(",");
	      Cursor cursor = this.db.query(table, fd, where, null, null, null, orderby);
	        if (cursor.moveToFirst()) {         
	         do {
	        	Variant w = new Variant();
	        	for (int i = 0; i < fd.length; i++) {
	        		switch (tp[i].charAt(0)) {
	        			case 's': w.put(fd[i], cursor.getString(i)); break;
	        			case 'i': w.put(fd[i], cursor.getInt(i)+""); break;
	        			case 'f': w.put(fd[i], cursor.getDouble(i)+""); break;
	        		}
	        		
	        	}	                       
	            vd.addCollection(w);
	         } while (cursor.moveToNext());
	      }
	      if (cursor != null && !cursor.isClosed()) {
	         cursor.close();
	      }
	      return vd;
    }    
    
    public Collection selectAllFilter(String table, String types, String fields, String where, String orderby, String find, String filter) {
		  Collection vd = new Collection();      
		  String[] fd = fields.split(",");
		  String[] tp = types.split(",");
	      Cursor cursor = this.db.query(table, fd, where, null, null, null, orderby);
	        if (cursor.moveToFirst()) {         
	         do {
	        	Variant w = new Variant();
	        	for (int i = 0; i < fd.length; i++) {
	        		switch (tp[i].charAt(0)) {
	        			case 's': w.put(fd[i], cursor.getString(i)); break;
	        			case 'i': w.put(fd[i], cursor.getInt(i)+""); break;
	        			case 'f': w.put(fd[i], cursor.getDouble(i)+""); break;
	        		}
	        		
	        	}	                       
	        	if (filter.length() < 3 || filter.indexOf(","+w.getInt(find)+",") != -1)
	        		vd.addCollection(w);
	         } while (cursor.moveToNext());
	      }
	      if (cursor != null && !cursor.isClosed()) {
	         cursor.close();
	      }
	      return vd;
  }
    
    public void deleteAll(String table) {
  	   this.db.delete(table, null, null);
    }
     
    public void deleteWhere(String table, String where) {
  	   this.db.delete(table, where, null);
    }               
    
    public void update(String table, Variant w, String fields, String where) {
    	String[] fd = fields.split(",");
	    ContentValues cv = new ContentValues();
	    for (int i = 0; i < fd.length; i++)
	    	cv.put(fd[i], w.getString(fd[i]));
	    
	    this.db.update(table, cv, where, null);
    }
    
    public void updateFloat(String table, Variant w, String fields, String where) {
    	String[] fd = fields.split(",");
	    ContentValues cv = new ContentValues();
	    for (int i = 0; i < fd.length; i++) {
	    	if (w.get(fd[i]).startsWith("f"))
	    		cv.put(fd[i], w.getFloat(fd[i]));
	    	else
	    		cv.put(fd[i], w.getString(fd[i]));
	    }
	    
	    this.db.update(table, cv, where, null);
    }
    
	private class OpenHelper extends SQLiteOpenHelper {
	      OpenHelper(Context context) {
	         super(context, DATABASE_NAME, null, DATABASE_VERSION);
	      }
	
	      @Override
	      public void onCreate(SQLiteDatabase db) {    	 	    	  
	         db.execSQL("CREATE TABLE Customer (crm_id INTEGER,synckey VARCHAR(32),parent_crm_id INTEGER,type VARCHAR(32),_class VARCHAR(32),regno VARCHAR(20),firstname VARCHAR(80),lastname VARCHAR(80),engname VARCHAR(80),birthday VARCHAR(20),gender VARCHAR(10),company_torol VARCHAR(10),employees VARCHAR(20),industry VARCHAR(120),industry_sub VARCHAR(120),sorog_huchin VARCHAR(120),promo_code VARCHAR(10),promo_precent FLOAT,promo_amount FLOAT,title VARCHAR(120),job_title VARCHAR(120),phone VARCHAR(50),phone1 VARCHAR(50),phone2 VARCHAR(50),fax VARCHAR(50),email VARCHAR(80),www VARCHAR(120),_date VARCHAR(80),level VARCHAR(20),country VARCHAR(80),city VARCHAR(80),district VARCHAR(80),horoo VARCHAR(80),address VARCHAR(80),usercode VARCHAR(32),descr TEXT,source VARCHAR(120),owner VARCHAR(32),campaign VARCHAR(80),mayduplicate INTEGER,customer_type INTEGER,priority VARCHAR(32),pricetag VARCHAR(12),lat DOUBLE, lng DOUBLE, lastVisit VARCHAR(32))");
	         db.execSQL("CREATE TABLE Products (product_id INTEGER,product_name VARCHAR(80),product_code VARCHAR(8),product_type VARCHAR(80),product_barcode VARCHAR(32),product_brand VARCHAR(50),product_vendor VARCHAR(80),unit_type VARCHAR(10),unit_size FLOAT,price FLOAT,company VARCHAR(20),price1 FLOAT,price2 FLOAT,price3 FLOAT,price4 FLOAT,price5 FLOAT,price6 FLOAT,price7 FLOAT,price8 FLOAT,price9 FLOAT,price10 FLOAT,discount FLOAT,warehouse_id INTEGER)");
	         db.execSQL("CREATE TABLE WareHouse (warehouse_id INTEGER, name VARCHAR(50))");
	         db.execSQL("CREATE TABLE Toollogo (crm_id INTEGER, product_id INTEGER, value INTEGER, _date VARCHAR(80))");
	         db.execSQL("CREATE TABLE Zarsan (crm_id INTEGER, product_id INTEGER, value INTEGER, _date VARCHAR(80))");
	         db.execSQL("CREATE TABLE JsonList (id INTEGER PRIMARY KEY AUTOINCREMENT, table_name VARCHAR(32), json VARCHAR(250), crm_id INTEGER)");
	         db.execSQL("CREATE TABLE Bytes (url TEXT, size INTEGER)");	         
	         	         
	         Log.d("d", "Databases created !");
	      }     
	
	      @Override
	      public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
	         Log.w("Example", "Upgrading database, this will drop tables and recreate.");
	         db.execSQL("DROP TABLE IF EXISTS Customer");
	         db.execSQL("DROP TABLE IF EXISTS Products");
	         db.execSQL("DROP TABLE IF EXISTS JsonList");
	         db.execSQL("DROP TABLE IF EXISTS WareHouse");
	         db.execSQL("DROP TABLE IF EXISTS Toollogo");
	         db.execSQL("DROP TABLE IF EXISTS Zarsan");
	         db.execSQL("DROP TABLE IF EXISTS Bytes");
	         
	         onCreate(db);
	      }
   }
}
