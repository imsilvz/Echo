using System;
using System.IO;
using System.Windows;
using System.Diagnostics;

using Echo.Core.Controllers;
using Microsoft.Web.WebView2.Core;
namespace Echo 
{
    public class Program 
    {
        [STAThread]
        public static void Main(string[] args)
        {
            try
            {
                var version = CoreWebView2Environment.GetAvailableBrowserVersionString();
                // Do something with `version` if needed.

                // Create Directory!
                var path = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                Directory.CreateDirectory($"{path}/Echo/cache");

                DataBroker.Instance.Initialize();
                var app = new App();
                app.Run();
            }
            catch (WebView2RuntimeNotFoundException exception)
            {
                // Handle the runtime not being installed.
                // `exception.Message` is very nicely specific: It (currently at least) says "Couldn't find a compatible Webview2 Runtime installation to host WebViews."
                MessageBox.Show("WebView2 is not installed!", "Echo - FFXIV Chat Listener", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}