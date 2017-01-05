package mxc.bluetooth.printer;

import java.util.Set;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.printer.bluetooth.android.BluetoothPrinter;
import com.printer.bluetooth.android.PrinterType;

@SuppressLint("NewApi")
public class TP10Manager {	
	private BluetoothAdapter mBtAdapter;    
    private int pairedDeviceNum = 0;
    private BluetoothDevice currentDevice;
    public static BluetoothPrinter mPrinter;
    
    private boolean isConnected;
    private boolean isConnecting;
    private String address;
    private boolean paired = false;
    private String mConnectedDeviceName = "";
    private String encodeType = "UTF-8";
    private String print_text = "";
    private Bitmap bmp = null;
    private int gogo = 1;
    private Context context;

	private void initPrinter(BluetoothDevice device){
    	mPrinter = new BluetoothPrinter(device);
    	mPrinter.setCurrentPrintType(PrinterType.TIII);
        mPrinter.setHandler(mHandler); 
        mPrinter.openConnection();
        mPrinter.setEncoding(encodeType);
	}
	
	@SuppressLint("HandlerLeak")
	private final Handler mHandler = new Handler() {
	        @Override
	        public void handleMessage(Message msg) {	        	
	            switch (msg.what) {
	            case BluetoothPrinter.Handler_Connect_Connecting:	            	
	            	isConnecting = true;	            	
	            	break;
	            case BluetoothPrinter.Handler_Connect_Success:
	            	Log.d("adf", "Connected TP10");	            	
	            	printText(print_text);	            
	            	printImage(bmp);
	            	isConnected = true;
	            	isConnecting = false;	    	            	
	            	break;
	            case BluetoothPrinter.Handler_Connect_Failed:
	            	Toast.makeText(context, "Принтертэй холбогдож чадсангүй !", Toast.LENGTH_LONG).show();
	            	isConnected = false;
	            	isConnecting = false;	            	
	            	break;
		        case BluetoothPrinter.Handler_Connect_Closed:		        	
		        	isConnected = false;
		        	isConnecting = false;		        	
		        	break;
		        }	            
	        }
	   };
	    
	public void connectPrinter(Context context, String text, int t, Bitmap bm) {
		 this.context = context;
		 print_text = text;
		 bmp = bm;
		 gogo = t;
		 mBtAdapter = BluetoothAdapter.getDefaultAdapter();
		 mBtAdapter.cancelDiscovery();
 
         Set<BluetoothDevice> pairedDevices = mBtAdapter.getBondedDevices();
         pairedDeviceNum = pairedDevices.size();
 
         if (pairedDeviceNum > 0) {
            for (BluetoothDevice device : pairedDevices) {
            	if (device.getName().startsWith("T10 BT")) {
            		address = device.getAddress();
            		paired = true;            		
            	}
            }
         }        		 		 
         
         BluetoothDevice device = mBtAdapter.getRemoteDevice(address);
		 mConnectedDeviceName = device.getName();
		    
		 if(device.getBondState() == BluetoothDevice.BOND_BONDED)     	          	        
			 initPrinter(device);
	}	
	
	public void printText(String content) {
		if (isConnected) {
			mPrinter.init();		
			mPrinter.printText(content);
			mPrinter.setPrinter(BluetoothPrinter.COMM_PRINT_AND_NEWLINE);			
			new AlertDialog.Builder(context)
	        .setIcon(android.R.drawable.ic_dialog_alert)
	        .setTitle("М�?д�?�?л�?л")
	        .setMessage("2 дахь хувийг х�?вл�?х үү ?")
	        .setPositiveButton("Тийм", new DialogInterface.OnClickListener() {
	            @Override
	            public void onClick(DialogInterface dialog, int which) {
	            	dialog.dismiss();		            			            			            	
	            	mPrinter.printText(print_text);
	            	mBtAdapter.cancelDiscovery();
	            	mPrinter.closeConnection();
	            }
	        })
	        .setNegativeButton("Үгүй", new DialogInterface.OnClickListener() {
	            @Override
	            public void onClick(DialogInterface dialog, int which) {
	            	mBtAdapter.cancelDiscovery();
	            	mPrinter.closeConnection();
	            	dialog.dismiss();		            		            			            	    		    
	            }
	        })
	        .show();
		}
	}	
	
	public void printImage(Bitmap content) {
		if (isConnected) {
			mPrinter.init();		
			mPrinter.printImage(content);
			mPrinter.setPrinter(BluetoothPrinter.COMM_PRINT_AND_NEWLINE);			
			new AlertDialog.Builder(context)
	        .setIcon(android.R.drawable.ic_dialog_alert)
	        .setTitle("Мэдээлэл")
	        .setMessage("2 дахь хувийг хэвлэх үү ?")
	        .setPositiveButton("Тийм", new DialogInterface.OnClickListener() {
	            @Override
	            public void onClick(DialogInterface dialog, int which) {
	            	dialog.dismiss();		      
	            	mPrinter.printImage(print_text);
	            	mBtAdapter.cancelDiscovery();
	            	mPrinter.closeConnection();
	            }
	        })
	        .setNegativeButton("Үгүй", new DialogInterface.OnClickListener() {
	            @Override
	            public void onClick(DialogInterface dialog, int which) {
	            	mBtAdapter.cancelDiscovery();
	            	mPrinter.closeConnection();
	            	dialog.dismiss();		            		            			            	    		    
	            }
	        })
	        .show();
		}
	}	
	
	public String getAddress() {		
        return address;
	}	
}
