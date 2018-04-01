
import android.Manifest;
import android.app.ActivityManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.format.DateUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    Location_GPS gps;
    Sensor_Magnetometer mag;
    Sensor_MagnetometerUC mag_uc;

    Handler m_handler;

    private static final int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 100;
    private static final long LOC_MILLI_SECOND = 432000000;
    private static final long CITY_MILLI_SECOND = 864000000;
    private static final long WORLD_MILLI_SECOND = 1728000000;

    //public static TextView text;
    private TextView output_mag;
    private TextView output_magX;
    private TextView output_magY;
    private TextView output_magZ;
    private TextView output_date;

    //Sensor Readings
    double latitude, longitude;
    double[] mag_readings;
    double[] magUC_readings;

    //flag for app running, to release the lock
    //PowerManager.WakeLock mWakeLock;
    public static int flag = 0;

    //This controls the number of times the screen gets refreshed
    int refresh = 1500;

    ImageButton b_compass,b_myLoc,b_city,b_world;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Utils.sharedPreferences = getSharedPreferences(Utils.PREF_NAME, MODE_PRIVATE);

        output_mag = (TextView) findViewById(R.id.textView1);
        output_magX = (TextView) findViewById(R.id.textView_x);
        output_magY = (TextView) findViewById(R.id.textView_y);
        output_magZ = (TextView) findViewById(R.id.textView_z);
        output_date = (TextView) findViewById(R.id.textView3);

        b_compass = (ImageButton) findViewById(R.id.button_compass);
        b_myLoc = (ImageButton) findViewById(R.id.button_myLoc);
        b_city = (ImageButton) findViewById(R.id.button_city);
        b_world = (ImageButton) findViewById(R.id.button_world);

        if (!isMyServiceRunning(Core_Function.class)){
            startService(new Intent(this, Core_Function.class));
        }

        gps = new Location_GPS(MainActivity.this);
        mag = new Sensor_Magnetometer();
        mag_uc = new Sensor_MagnetometerUC();


        /*
        if (!Utils.sharedPreferences.getString(Utils.DIALOG_FLAG, "").equalsIgnoreCase("yes")) {
            //  gps.showSettingsAlert();
            new AlertDialog.Builder(MainActivity.this)
                    .setTitle("Suggestion")
                    .setMessage("Please Relaunch app to get your location data.")
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Utils.storeString(Utils.DIALOG_FLAG, "yes");
                            dialog.dismiss();
                        }
                    })
                    .create()
                    .show();
        } else {
        }
        */


        if (gps.canGetLocation(this)) {
            Permission();
        } else {
            gps.showSettingsAlert();
        }

        //Takes care of keeping the app running even while the phone is asleep
        //PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        //mWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "myLock");
        //mWakeLock.acquire();

        m_handler = new Handler();
        startRepeatingTask();

        b_compass.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //String msg = "Please complete 12 hours of continuous usage, then restart the app.";
                //if (Utils.sharedPreferences.getString(Utils.COMPASS_FLAG,"") == "yes") {
                    Intent i = new Intent(MainActivity.this, CompassActivity.class);
                    startActivity(i);
                //}
                //else{
                //Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
                //}
            }
        });

        b_myLoc.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                double total_tmp = Utils.sharedPreferences.getLong("TOTAL_TIME",0)/(1000*60*60);
                String msg = "To see this, you need to log 120 hours of use. You have " + Double.toString(total_tmp);
                if (Utils.sharedPreferences.getLong("TOTAL_TIME",0)>= LOC_MILLI_SECOND) {
                    //if (true) {
                    Intent i = new Intent(MainActivity.this, Map.class);
                    startActivity(i);
                }
                else{
                    Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
                }
            }
        });

        b_city.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                double total_tmp = Utils.sharedPreferences.getLong("TOTAL_TIME",0)/(1000*60*60);
                String msg = "To see this, you need to log 240 hours of use. You have " + Double.toString(total_tmp);

                if (Utils.sharedPreferences.getLong("TOTAL_TIME",0)>= CITY_MILLI_SECOND) {
                    Intent i = new Intent(MainActivity.this, Map.class);
                    startActivity(i);
                }
                else{
                    Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
                }
            }
        });

        b_world.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                double total_tmp = Utils.sharedPreferences.getLong("TOTAL_TIME",0)/(1000*60*60);
                String msg = "To see this, you need to log 480 hours of use. You have " + Double.toString(total_tmp);

                if (Utils.sharedPreferences.getLong("TOTAL_TIME",0)>= WORLD_MILLI_SECOND) {
                    Intent i = new Intent(MainActivity.this, Map.class);
                    startActivity(i);
                }
                else{
                    Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
                }
            }
        });

    }

    //***************************************//

    public void displayData() {

            try {

                //new DecimalFormat("##.####").format(mag[0])
                //output_mag.setText(Double.toString(mag_readings[3]));

                output_mag.setText(new DecimalFormat("##.####").format(mag_readings[3]));
                output_magX.setText(" X:  " + new DecimalFormat("##.####").format(mag_readings[0]) + "   ");
                output_magY.setText(" Y:  " + new DecimalFormat("##.####").format(mag_readings[1]) + "   ");
                output_magZ.setText(" Z:  " + new DecimalFormat("##.####").format(mag_readings[2]) + "   ");

                Long tmp_time = (System.currentTimeMillis() - Utils.sharedPreferences.getLong("START_TIME", 0)) / 1000;
                output_date.setText("  Session Time: " + DateUtils.formatElapsedTime(tmp_time));
            } catch (NullPointerException e) {
                e.printStackTrace();
            }
    }

    Runnable mStatusChecker = new Runnable() {
        public void run(){
            m_handler.postDelayed(mStatusChecker,refresh);
            getReadings();
        }
    };

    void startRepeatingTask(){
        mStatusChecker.run();
    }

    void stopRepeatingTask(){
        m_handler.removeCallbacks(mStatusChecker);
    }

    //******************************************//

    /**
     *  check the given service is running
     * @param serviceClass class eg MyService.class
     * @return boolean
     */
    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    @Override
    protected void onResume() {
        super.onResume();

        Log.e("TAG", "On Resume Call");

        if (flag == 1) {
            Permission();
        } else if (!gps.canGetLocation(this)){
            gps.showSettingsAlert();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        //mWakeLock.release();
        //stopRepeatingTask();


    }


    /**
     * THis is the miscelaneous section. Notices and navigations
     */
    private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
        new AlertDialog.Builder(MainActivity.this)
                .setMessage(message)
                .setPositiveButton("OK", okListener)
                .setNegativeButton("Cancel", null)
                .create()
                .show();
    }

    /*
    // Backpress button touch
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            System.exit(0);

        }
        return false;
    }
    */

    /**
     * This section deals with checking the permisions are complete
     */
    public void Permission() {
        List<String> permissionsNeeded = new ArrayList<String>();
        final List<String> permissionsList = new ArrayList<String>();
        if (!addPermission(permissionsList, Manifest.permission.ACCESS_FINE_LOCATION))
            permissionsNeeded.add("GPS Location");
        if (!addPermission(permissionsList, Manifest.permission.READ_EXTERNAL_STORAGE))
            permissionsNeeded.add("Read External Storage");
        if (!addPermission(permissionsList, Manifest.permission.READ_PHONE_STATE))
            permissionsNeeded.add("Get Device Information");

        if (permissionsList.size() > 0) {
            if (permissionsNeeded.size() > 0) {
                // Need Rationale
                String message = "You need to grant access to: " + permissionsNeeded.get(0);
                for (int i = 1; i < permissionsNeeded.size(); i++)
                    message = message + ", " + permissionsNeeded.get(i);
                showMessageOKCancel(message, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                                    REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                        }
                    }
                });
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                        REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            }
            return;
        }

        if (flag == 1) {
            getReadings();
        }
    }

    private boolean addPermission(List<String> permissionsList, String permission) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsList.add(permission);
                // Check for Rationale Option
                if (!shouldShowRequestPermissionRationale(permission))
                    return false;
            }
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS: {
                Map<String, Integer> perms = new HashMap<String, Integer>();
                // Initial
                perms.put(Manifest.permission.ACCESS_FINE_LOCATION, PackageManager.PERMISSION_GRANTED);
                perms.put(Manifest.permission.READ_EXTERNAL_STORAGE, PackageManager.PERMISSION_GRANTED);
                // Fill with results
                for (int i = 0; i < permissions.length; i++)
                    perms.put(permissions[i], grantResults[i]);
                // Check for ACCESS_FINE_LOCATION
                if (perms.get(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                        && perms.get(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
                        ) {
                    // All Permissions Granted
                    getReadings();
                } else {
                    // Permission Denied
                    Toast.makeText(MainActivity.this, "Please recheck all the permissions", Toast.LENGTH_SHORT)
                            .show();
                }
            }
            break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    /**
     * This method collects the data from the sensors
     */
    public void getReadings() {
        if (gps.canGetLocation) {
            gps.getLocation();
            latitude = gps.getLatitude();
            longitude = gps.getLongitude();
        }
        mag_readings = Sensor_Magnetometer.getMagneticField();
        magUC_readings = Sensor_MagnetometerUC.getMagneticField();

        displayData();
    }
}
