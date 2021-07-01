using System;
using System.Windows;
using System.Runtime.InteropServices;

namespace Echo.Controllers
{
    public class EventForwarder
    {
        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [DllImport("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [DllImport("user32.dll")]
        public static extern bool ReleaseCapture();

        readonly IntPtr target;

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
    }
}
