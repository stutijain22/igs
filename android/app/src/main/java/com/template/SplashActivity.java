package com.template;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

public class SplashActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       // requestWindowFeature(Window.FEATURE_NO_TITLE);
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}