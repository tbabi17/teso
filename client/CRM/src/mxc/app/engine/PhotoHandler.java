package mxc.app.engine;

import java.io.File;
import java.io.FileOutputStream;

import android.content.Context;
import android.hardware.Camera;
import android.hardware.Camera.PictureCallback;
import android.os.Environment;
import android.widget.Toast;

public class PhotoHandler implements PictureCallback {

	  private final Context context;
	  private Variant crm, service;

	  public PhotoHandler(Context context, Variant activeCRM, Variant s) {
	    this.context = context;
	    this.crm = activeCRM;
	    this.service = s;
	  }

	  @Override
	  public void onPictureTaken(byte[] data, Camera camera) {
	    File pictureFileDir = getDir();

	    if (!pictureFileDir.exists() && !pictureFileDir.mkdirs()) {	      
	      Toast.makeText(context, "Can't create directory to save image.",
	          Toast.LENGTH_LONG).show();
	      return;

	    }

	    String photoFile = crm.getInt("crm_id")+"_"+service.getString("subject") + ".jpg";
	    String filename = pictureFileDir.getPath() + File.separator + photoFile;
	    File pictureFile = new File(filename);

	    try {
	      FileOutputStream fos = new FileOutputStream(pictureFile);
	      fos.write(data);
	      fos.close();
	      Toast.makeText(context, "New Image saved:" + filename,
	          Toast.LENGTH_LONG).show();
	    } catch (Exception error) {	      
	      Toast.makeText(context, "Image could not be saved.",
	          Toast.LENGTH_LONG).show();
	    }
	  }

	  private File getDir() {
	    File sdDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
	    return new File(sdDir, ""+crm.getInt("crm_id"));
	  }
}
