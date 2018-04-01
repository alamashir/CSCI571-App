

import android.app.Service;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.widget.Toast;


public class Sensor_MagnetometerUC extends Service implements SensorEventListener {

    private SensorManager mSensorManager;
    private Sensor mSensor;

    static double uncab_x, uncab_y, uncab_z, magnitudeUC;
    static double bias_x, bias_y, bias_z;

    public Sensor_MagnetometerUC() { }


    @Override
    public void onCreate() {
        super.onCreate();

        mSensorManager = (SensorManager)getApplicationContext().getSystemService(SENSOR_SERVICE);

        if (mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD_UNCALIBRATED) != null) {
            mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD_UNCALIBRATED);
        } else {
            Toast.makeText(getApplicationContext(), "Device has no magnetic sensor", Toast.LENGTH_SHORT).show();
        }

        mSensorManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI);
    }


    public static double[] getMagneticField() {
        double[] tmp = {uncab_x, uncab_y, uncab_z, bias_x, bias_y, bias_z, magnitudeUC};
        return tmp;
    }


    @Override
    public void onSensorChanged(SensorEvent event) {
        //event.values[] (do something with sensor values)
        //event.timestamp (do something with timestamp)

        uncab_x = event.values[0];
        uncab_y = event.values[1];
        uncab_z = event.values[2];

        bias_x = event.values[3];
        bias_y = event.values[4];
        bias_z = event.values[5];

        magnitudeUC = Math.sqrt(Math.pow(event.values[0], 2) +
                Math.pow(event.values[1], 2) +
                Math.pow(event.values[2], 2));

        // Toast.makeText(mContext, "Your X is - \nX: " + current_x + "\nY: " + current_y + "\nZ: " + current_z, Toast.LENGTH_LONG).show();

        try {
            Utils.storeString(Utils.un_X, uncab_x + "");
            Utils.storeString(Utils.un_Y, uncab_y + "");
            Utils.storeString(Utils.un_Z, uncab_z + "");

            Utils.storeString(Utils.bias_X, bias_x + "");
            Utils.storeString(Utils.bias_Y, bias_y + "");
            Utils.storeString(Utils.bias_Z, bias_z + "");

            Utils.storeString(Utils.magnitudeUC, magnitudeUC + "");

        }catch (Exception e){
            e.printStackTrace();
        }


    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        //Do something with changed accuracy
        //This method is mandatory to defined
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        mSensorManager = (SensorManager)getApplicationContext().getSystemService(SENSOR_SERVICE);

        if (mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD_UNCALIBRATED) != null) {
            mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD_UNCALIBRATED);
        } else {
            Toast.makeText(getApplicationContext(), "Device has no magnetic sensor", Toast.LENGTH_SHORT).show();
        }

        mSensorManager.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI);

        return Service.START_STICKY;

    }

    /*
    @Override
    public void onDestroy() {
        super.onDestroy();
        mSensorManager.unregisterListener(this);
    }
    */

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

}
