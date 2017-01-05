package mxc.bluetooth.printer;

import java.util.Set;

import android.app.AlertDialog;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

import com.bixolon.printer.BixolonPrinter;


public class BixolonManager400 {
	static final String ACTION_GET_DEFINEED_NV_IMAGE_KEY_CODES = "com.bixolon.anction.GET_DEFINED_NV_IMAGE_KEY_CODES";
	static final String ACTION_COMPLETE_PROCESS_BITMAP = "com.bixolon.anction.COMPLETE_PROCESS_BITMAP";
	static final String EXTRA_NAME_NV_KEY_CODES = "NvKeyCodes";
	static final String EXTRA_NAME_BITMAP_WIDTH = "BitmapWidth";
	static final String EXTRA_NAME_BITMAP_HEIGHT = "BitmapHeight";
	static final String EXTRA_NAME_BITMAP_PIXELS = "BitmapPixels";
	
	static final int REQUEST_CODE_SELECT_FIRMWARE = Integer.MAX_VALUE;
	static final int RESULT_CODE_SELECT_FIRMWARE = Integer.MAX_VALUE - 1;
	static final int MESSAGE_START_WORK = Integer.MAX_VALUE - 2;
	static final int MESSAGE_END_WORK = Integer.MAX_VALUE - 3;
	
	static BixolonPrinter mBixolonPrinter;
	private boolean mIsConnected;
	private Context context;
	private String mConnectedDeviceName = null;
	private String print_text;
	
	public void startBixolon(Context context, String pline) {
		this.context = context;
		this.print_text = pline;
		mBixolonPrinter = new BixolonPrinter(context, mHandler, null);
		mBixolonPrinter.findBluetoothPrinters();		
	}
	
	public void stopBixolon() {
		mIsConnected = false;
		mBixolonPrinter.disconnect();
	}
	
	public boolean isConnected() {
		return mIsConnected;
	}
	
	public boolean prinBitmap(Bitmap bmp) {
		if (mIsConnected) {
			int alignment = BixolonPrinter.ALIGNMENT_CENTER;
			int width = 150;
			int level = 50;
			mBixolonPrinter.printBitmap(bmp, alignment, width, level, false);
			return true;
		}
		
		return false;
	}
	
	public boolean printData(String text) {
		if (mIsConnected) {
			String[] p = text.split("!");
			if (p.length > 1) {
				int alignment = BixolonPrinter.ALIGNMENT_LEFT;
				int attribute = BixolonPrinter.TEXT_ATTRIBUTE_FONT_A;
				int size = BixolonPrinter.TEXT_SIZE_HORIZONTAL1;
				mBixolonPrinter.printText(p[0], alignment, attribute, size, false);
				
				alignment = BixolonPrinter.ALIGNMENT_LEFT;
				attribute = BixolonPrinter.TEXT_ATTRIBUTE_EMPHASIZED;
				size = BixolonPrinter.TEXT_SIZE_HORIZONTAL1;
				mBixolonPrinter.printText(p[1], alignment, attribute, size, false);
				
				alignment = BixolonPrinter.ALIGNMENT_LEFT;
				attribute = BixolonPrinter.TEXT_ATTRIBUTE_FONT_A;
				size = BixolonPrinter.TEXT_SIZE_HORIZONTAL1;
				mBixolonPrinter.printText(p[2], alignment, attribute, size, false);
			} else {
				int alignment = BixolonPrinter.ALIGNMENT_LEFT;
				int attribute = BixolonPrinter.TEXT_ATTRIBUTE_FONT_A;
				int size = BixolonPrinter.TEXT_SIZE_HORIZONTAL1;			
				mBixolonPrinter.printText(text, alignment, attribute, size, false);
			}
			return true;
		}
		
		return false;
	}
	
	static void showBluetoothDialog(Context context, final Set<BluetoothDevice> pairedDevices) {
		final String[] items = new String[pairedDevices.size()];
		int index = 0;
		for (BluetoothDevice device : pairedDevices) {
			items[index++] = device.getAddress();
		}

		new AlertDialog.Builder(context).setTitle("Paired Bluetooth printers")
				.setItems(items, new DialogInterface.OnClickListener() {
					
					@Override
					public void onClick(DialogInterface dialog, int which) {
						mBixolonPrinter.connect(items[which]);						
					}
				}).show();
	}
	
	private final Handler mHandler = new Handler(new Handler.Callback() {
		
		@SuppressWarnings("unchecked")
		@Override
		public boolean handleMessage(Message msg) {
			switch (msg.what) {
			case BixolonPrinter.MESSAGE_STATE_CHANGE:
				switch (msg.arg1) {
				case BixolonPrinter.STATE_CONNECTED:									
					mIsConnected = true;				
					printData(print_text);
					break;

				case BixolonPrinter.STATE_CONNECTING:
					
					break;

				case BixolonPrinter.STATE_NONE:
					mIsConnected = false;
					break;
				}
				return true;
				
			case BixolonPrinter.MESSAGE_WRITE:
				switch (msg.arg1) {
				case BixolonPrinter.PROCESS_SET_SINGLE_BYTE_FONT:
					Bundle data = msg.getData();
					Toast.makeText(context, data.getString(BixolonPrinter.KEY_STRING_CODE_PAGE), Toast.LENGTH_SHORT).show();
					break;
					
				case BixolonPrinter.PROCESS_SET_DOUBLE_BYTE_FONT:
					mHandler.obtainMessage(MESSAGE_END_WORK).sendToTarget();
					
					Toast.makeText(context, "Complete to set double byte font.", Toast.LENGTH_SHORT).show();
					break;
					
				case BixolonPrinter.PROCESS_DEFINE_NV_IMAGE:
					mBixolonPrinter.getDefinedNvImageKeyCodes();
					Toast.makeText(context, "Complete to define NV image", Toast.LENGTH_LONG).show();
					break;
					
				case BixolonPrinter.PROCESS_REMOVE_NV_IMAGE:
					mBixolonPrinter.getDefinedNvImageKeyCodes();
					Toast.makeText(context, "Complete to remove NV image", Toast.LENGTH_LONG).show();
					break;
					
				case BixolonPrinter.PROCESS_UPDATE_FIRMWARE:
					mBixolonPrinter.disconnect();
					Toast.makeText(context, "Complete to download firmware.\nPlease reboot the printer.", Toast.LENGTH_SHORT).show();
					break;
				}
				return true;

			case BixolonPrinter.MESSAGE_READ:
				//MainActivity.this.dispatchMessage(msg);
				return true;

			case BixolonPrinter.MESSAGE_DEVICE_NAME:
				mConnectedDeviceName = msg.getData().getString(BixolonPrinter.KEY_STRING_DEVICE_NAME);
				Toast.makeText(context, mConnectedDeviceName, Toast.LENGTH_LONG).show();
				return true;

			case BixolonPrinter.MESSAGE_TOAST:				
				Toast.makeText(context, msg.getData().getString(BixolonPrinter.KEY_STRING_TOAST), Toast.LENGTH_SHORT).show();
				return true;
				
			case BixolonPrinter.MESSAGE_BLUETOOTH_DEVICE_SET:
				if (msg.obj == null) {
					Toast.makeText(context, "No paired device", Toast.LENGTH_SHORT).show();
				} else {
					showBluetoothDialog(context, (Set<BluetoothDevice>) msg.obj);
				}
				return true;
				
			case BixolonPrinter.MESSAGE_PRINT_COMPLETE:
				Toast.makeText(context, "Complete to print", Toast.LENGTH_SHORT).show();
				return true;
				
			case BixolonPrinter.MESSAGE_ERROR_INVALID_ARGUMENT:
				Toast.makeText(context, "Invalid argument", Toast.LENGTH_SHORT).show();
				return true;
				
			case BixolonPrinter.MESSAGE_ERROR_NV_MEMORY_CAPACITY:
				Toast.makeText(context, "NV memory capacity error", Toast.LENGTH_SHORT).show();
				return true;
				
			case BixolonPrinter.MESSAGE_ERROR_OUT_OF_MEMORY:
				Toast.makeText(context, "Out of memory", Toast.LENGTH_SHORT).show();
				return true;
				
			case BixolonPrinter.MESSAGE_COMPLETE_PROCESS_BITMAP:
				String text = "Complete to process bitmap.";
				Bundle data = msg.getData();
				byte[] value = data.getByteArray(BixolonPrinter.KEY_STRING_MONO_PIXELS);
				if (value != null) {
					Intent intent = new Intent();
					intent.setAction(ACTION_COMPLETE_PROCESS_BITMAP);
					intent.putExtra(EXTRA_NAME_BITMAP_WIDTH, msg.arg1);
					intent.putExtra(EXTRA_NAME_BITMAP_HEIGHT, msg.arg2);
					intent.putExtra(EXTRA_NAME_BITMAP_PIXELS, value);
					//sendBroadcast(intent);
				}
				
				Toast.makeText(context, text, Toast.LENGTH_SHORT).show();
				return true;
				
			case MESSAGE_START_WORK:
				
				return true;
				
			case MESSAGE_END_WORK:
				
				return true;
				
			case BixolonPrinter.MESSAGE_USB_DEVICE_SET:
				if (msg.obj == null) {
					Toast.makeText(context, "No connected device", Toast.LENGTH_SHORT).show();
				} else {
					//DialogManager.showUsbDialog(MainActivity.this, (Set<UsbDevice>) msg.obj, mUsbReceiver);
				}
				return true;
				
			case BixolonPrinter.MESSAGE_NETWORK_DEVICE_SET:
				if (msg.obj == null) {
					Toast.makeText(context, "No connectable device", Toast.LENGTH_SHORT).show();
				}
				//DialogManager.showNetworkDialog(MainActivity.this, (Set<String>) msg.obj);
				return true;
			}
			return false;
		}
	});
}
