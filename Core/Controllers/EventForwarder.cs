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

        readonly IntPtr target;
        private bool _isResizing = false;

        public EventForwarder(IntPtr target)
        {
            this.target = target;
        }

        public void Close()
        {
            Application.Current.Shutdown();
        }

        public void MouseDownDrag()
        {
            ReleaseCapture();
            SendMessage(target, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
        }

        public void ResizeDrag()
        {
            //Debug.WriteLine("Hello World");
            ReleaseCapture();
            SendMessage(target, WM_NCLBUTTONDOWN, HT_BOTTOMRIGHT, 0);
        }
    }
}
