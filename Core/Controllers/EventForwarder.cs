using System;
using System.Windows;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace Echo.Controllers
{
    public class EventForwarder
    {
        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;
        public const int HT_BOTTOMRIGHT = 17;

        [DllImport("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [DllImport("user32.dll")]
        public static extern bool ReleaseCapture();
        [DllImport("user32.dll")]
        public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);

        public delegate void EventForwarderEvent(object sender);
        public event EventForwarderEvent OnAppReady = delegate { };

        readonly IntPtr target;

        public EventForwarder(IntPtr target)
        {
            this.target = target;
        }

        public void Close()
        {
            Application.Current.Shutdown();
        }

        public void AppReady()
        {
            this.OnAppReady?.Invoke(this);
        }

        public void MouseDownDrag()
        {
            ReleaseCapture();
            SendMessage(target, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
        }

        public void ResizeDrag()
        {
            ReleaseCapture();
            SendMessage(target, WM_NCLBUTTONDOWN, HT_BOTTOMRIGHT, 0);
        }
    }
}
