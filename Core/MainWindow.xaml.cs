using System;
using System.IO;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using System.Runtime.InteropServices;

using System.Diagnostics;

using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

using Echo.Controllers;
namespace Echo
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            webView.CoreWebView2InitializationCompleted += WebView_InitializationCompleted;
            InitializeAsync();
        }

        async void InitializeAsync()
        {
            var env = await CoreWebView2Environment.CreateAsync(
                userDataFolder: Path.Combine(
                    Path.GetTempPath(),
                    "EchoBrowser"
                )
            );
            await webView.EnsureCoreWebView2Async(env);

            webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "echo.app", @"./WebApp/",
                CoreWebView2HostResourceAccessKind.Allow
            );
            
            webView.Source = new Uri(@"https://echo.app/public/index.html");
            webView.CoreWebView2.OpenDevToolsWindow();
        }

        private void WebView_InitializationCompleted(object sender, EventArgs e)
        {
            var dataBroker = Program.Broker;
            var eventForwarder = new EventForwarder(new WindowInteropHelper(this).Handle);

            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.AddHostObjectToScript("dataBroker", dataBroker);
            webView.CoreWebView2.AddHostObjectToScript("eventForwarder", eventForwarder);
            webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(File.ReadAllText(@"./WebApp/dist/preload.js"));
        }
    }
}
