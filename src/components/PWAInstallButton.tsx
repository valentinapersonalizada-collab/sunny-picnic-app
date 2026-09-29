import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable ? (
        <button
          type="button"
          onClick={install}
          className="min-h-[36px] px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Install Storybook App for Offline Reading"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Install App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="min-h-[36px] px-3 py-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Install on iOS, Android, or Offline Mode Info"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="hidden sm:inline">{isIOS ? 'Install on iOS' : 'Offline & Mobile App'}</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {showGuideModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-4"
            onClick={() => setShowGuideModal(false)}
          >
            <div
              className="my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Read Anywhere — iOS, Android &amp; Offline
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Status:{' '}
                    {isOnline
                      ? 'Online & Cached for Offline Use'
                      : 'Offline Mode Active — Working without Internet'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="min-h-[40px] min-w-[40px] shrink-0 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <p className="font-semibold text-slate-900">Apple iPhone &amp; iPad (iOS Safari)</p>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                    1. Tap the <strong>Share</strong> icon in the Safari toolbar.
                    <br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                    <br />
                    3. Launch <strong>Sunny Picnic</strong> anytime — even on an airplane without
                    Wi-Fi!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900">Android Phones &amp; Tablets (Chrome)</p>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                    1. Tap the browser menu (three dots) or the <strong>Install App</strong> button.
                    <br />
                    2. Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-700 pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    All 20 pages, illustrations, speech narration, and games work 100% offline.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Got It, Back to Storybook
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
