# PlaceIT - Native Shell

Capacitor project wrapping the live site at **https://www.getplaceit.com** in
a real Android app (and, via the manifest in the main client project, a
Microsoft Store package too). No copy of the website lives here - the app
always loads the live site, so anything deployed to getplaceit.com shows up
immediately, no app update needed.

App ID used: `com.wyntek.placeit`. **Permanent once you publish** - change it
in `capacitor.config.json` before your first release if you want something
else.

## Play Store (Android)

Needs [Android Studio](https://developer.android.com/studio) locally - this
can't be built in a chat sandbox, it needs the Android SDK/Gradle toolchain.

1. `npm install`
2. `npx cap sync android`
3. `npx cap open android` - opens `android/` in Android Studio
4. **Build > Generate Signed Bundle / APK** > **Android App Bundle (.aab)**
5. Create a keystore the first time - **back it up**, you need the same one
   for every future update, forever
6. Upload the `.aab` to [Play Console](https://play.google.com/console)

## Microsoft Store

Doesn't need this Capacitor project - Microsoft packages PWAs straight from
the live URL:

1. [pwabuilder.com](https://www.pwabuilder.com) → enter `https://www.getplaceit.com`
2. It reads the manifest (`src/app/manifest.ts`) and service worker
   (`public/sw.js`) in the main client project
3. Download the Windows package (.msix)
4. Submit via [Partner Center](https://partner.microsoft.com/dashboard)

$19 one-time Microsoft dev fee (individual) or $99 (company) - no other cost.

## Icon/launcher note

The launcher icon here was generated from the full "PlaceIT" wordmark
(`logo.svg`) centered on a white square, because no clean square icon-only
mark exists in the source project - the little person/circle graphic
embedded in the logo is actually a low-res raster, not vector, same as the
old icon set. It works, but a real launcher icon is usually icon-only (no
text) for legibility at small sizes. If you get a proper square mark made,
drop it at `assets/icon.png` (1024x1024) and `assets/splash.png`, then:

```
npm install -D @capacitor/assets
npx capacitor-assets generate --android --iconBackgroundColor '#ffffff' --splashBackgroundColor '#ffffff'
```

## What's NOT covered

- iOS intentionally left out (Apple review risk / $99/year account /
  rejection risk for WebView wrappers) per earlier discussion.
- Test the live site inside the app once built - popups, external links, or
  downloads sometimes behave differently in a WebView vs a normal tab.
