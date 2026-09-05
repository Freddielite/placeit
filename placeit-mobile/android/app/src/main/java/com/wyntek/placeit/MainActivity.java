package com.wyntek.placeit;

import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onStart() {
    super.onStart();
    // Disable pinch-to-zoom and double-tap zoom at the WebView level.
    // The viewport meta tag on the web side (maximumScale/userScalable)
    // covers most browsers, but Android's WebView has its own zoom
    // controls that can override the page unless turned off here too.
    WebSettings settings = this.bridge.getWebView().getSettings();
    settings.setSupportZoom(false);
    settings.setBuiltInZoomControls(false);
    settings.setDisplayZoomControls(false);
  }
}
